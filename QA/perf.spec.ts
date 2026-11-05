import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface WorldSample {
  progress: number;
  worldName: string;
  drawCallsPerFrame: number;
  trianglesPerFrame: number;
  activeTextures: number;
  activeBuffers: number;
  longTasksCount: number;
  maxLongTaskMs: number;
  avgFrameTimeMs: number;
  jsHeapUsedMB: number;
}

interface PerfBaseline {
  timestamp: string;
  targetUrl: string;
  userAgent: string;
  viewport: { width: number; height: number };
  bundleMetrics: {
    totalJsBytes: number;
    totalCssBytes: number;
    totalAssetBytes: number;
    hdrBytes: number;
    resources: Array<{ name: string; transferSize: number; decodedSize: number }>;
  };
  scrollSamples: WorldSample[];
  summary: {
    peakDrawCalls: number;
    peakTriangles: number;
    totalLongTasks: number;
    maxLongTaskDurationMs: number;
    totalBufferCount: number;
    totalTextureCount: number;
    hdrWireSizeMB: number;
  };
  hardwareIndependentVerdict: string;
}

test('Collect WebGL & Main-Thread Performance Baseline', async ({ page }) => {
  test.setTimeout(180000);

  // Hook WebGL and PerformanceObserver before page scripts execute
  await page.addInitScript(() => {
    (window as any).__PERF__ = {
      drawCallsTotal: 0,
      trianglesTotal: 0,
      currentFrameDrawCalls: 0,
      currentFrameTriangles: 0,
      activeTextures: 0,
      activeBuffers: 0,
      recentFrames: [] as Array<{ draws: number; tris: number; delta: number }>,
      longTasks: [] as Array<{ startTime: number; duration: number }>,
      lastFrameTime: performance.now(),
    };

    // Longtask observer
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration >= 50) {
            (window as any).__PERF__.longTasks.push({
              startTime: entry.startTime,
              duration: entry.duration,
            });
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch {
      // Fallback
    }

    // Wrap WebGL Contexts
    function instrumentGL(gl: any) {
      if (!gl || gl.__perfWrapped) return gl;
      gl.__perfWrapped = true;

      const origDrawElements = gl.drawElements;
      gl.drawElements = function (mode: number, count: number, type: number, offset: number) {
        (window as any).__PERF__.drawCallsTotal++;
        (window as any).__PERF__.currentFrameDrawCalls++;
        let tris = 0;
        if (mode === gl.TRIANGLES) tris = count / 3;
        else if (mode === gl.TRIANGLE_STRIP || mode === gl.TRIANGLE_FAN) tris = Math.max(0, count - 2);
        (window as any).__PERF__.trianglesTotal += tris;
        (window as any).__PERF__.currentFrameTriangles += tris;
        return origDrawElements.apply(this, arguments);
      };

      const origDrawArrays = gl.drawArrays;
      gl.drawArrays = function (mode: number, first: number, count: number) {
        (window as any).__PERF__.drawCallsTotal++;
        (window as any).__PERF__.currentFrameDrawCalls++;
        let tris = 0;
        if (mode === gl.TRIANGLES) tris = count / 3;
        else if (mode === gl.TRIANGLE_STRIP || mode === gl.TRIANGLE_FAN) tris = Math.max(0, count - 2);
        (window as any).__PERF__.trianglesTotal += tris;
        (window as any).__PERF__.currentFrameTriangles += tris;
        return origDrawArrays.apply(this, arguments);
      };

      const origCreateTexture = gl.createTexture;
      gl.createTexture = function () {
        (window as any).__PERF__.activeTextures++;
        return origCreateTexture.apply(this, arguments);
      };

      const origDeleteTexture = gl.deleteTexture;
      gl.deleteTexture = function () {
        (window as any).__PERF__.activeTextures = Math.max(0, (window as any).__PERF__.activeTextures - 1);
        return origDeleteTexture.apply(this, arguments);
      };

      const origCreateBuffer = gl.createBuffer;
      gl.createBuffer = function () {
        (window as any).__PERF__.activeBuffers++;
        return origCreateBuffer.apply(this, arguments);
      };

      const origDeleteBuffer = gl.deleteBuffer;
      gl.deleteBuffer = function () {
        (window as any).__PERF__.activeBuffers = Math.max(0, (window as any).__PERF__.activeBuffers - 1);
        return origDeleteBuffer.apply(this, arguments);
      };

      return gl;
    }

    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string) {
      const ctx = origGetContext.apply(this, arguments as any);
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
        instrumentGL(ctx);
      }
      return ctx;
    };

    // Frame sampler
    function onRaf(now: number) {
      const p = (window as any).__PERF__;
      const delta = now - p.lastFrameTime;
      p.lastFrameTime = now;

      p.recentFrames.push({
        draws: p.currentFrameDrawCalls,
        tris: p.currentFrameTriangles,
        delta,
      });
      if (p.recentFrames.length > 40) {
        p.recentFrames.shift();
      }

      p.currentFrameDrawCalls = 0;
      p.currentFrameTriangles = 0;
      requestAnimationFrame(onRaf);
    }
    requestAnimationFrame(onRaf);
  });

  const targetUrl = process.env.BASE_URL || 'http://localhost:3000';
  console.log(`[PERF AUDIT] Navigating to ${targetUrl}...`);

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(3000); // Allow preloader and warm-up compile to finish

  // Sample progress positions across the 5 worlds
  const progressPoints = [
    { p: 0.0, name: 'World 01: Grand Observatory (Hero Establishing)' },
    { p: 0.25, name: 'World 02: Subterranean Engine Vault' },
    { p: 0.50, name: 'World 03: Engineering Quadrants' },
    { p: 0.75, name: 'World 04: Technoholix Arena' },
    { p: 1.0, name: 'World 05: Final Elevation Beacon' },
  ];

  const samples: WorldSample[] = [];

  for (const point of progressPoints) {
    // Set scroll position
    await page.evaluate((targetProgress) => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: targetProgress * totalScrollable,
        behavior: 'instant' as ScrollBehavior,
      });
    }, point.p);

    // Wait 1.0s for camera lerp and rendering to stabilize
    await page.waitForTimeout(1000);

    // Read sampled frames from __PERF__
    const sample = await page.evaluate((pointInfo) => {
      const p = (window as any).__PERF__;
      const frames = p.recentFrames.slice(-20); // Last 20 frames

      let totalDraws = 0;
      let totalTris = 0;
      let totalDelta = 0;
      let validFrames = 0;

      for (const f of frames) {
        if (f.draws > 0) {
          totalDraws += f.draws;
          totalTris += f.tris;
          totalDelta += f.delta;
          validFrames++;
        }
      }

      const avgDrawCalls = validFrames > 0 ? Math.round(totalDraws / validFrames) : 0;
      const avgTriangles = validFrames > 0 ? Math.round(totalTris / validFrames) : 0;
      const avgFrameTimeMs = validFrames > 0 ? +(totalDelta / validFrames).toFixed(2) : 0;

      const mem = (performance as any).memory;
      const jsHeapUsedMB = mem ? +(mem.usedJSHeapSize / (1024 * 1024)).toFixed(2) : 0;

      const longTasksCount = p.longTasks.length;
      const maxLongTask = p.longTasks.reduce(
        (max: number, lt: any) => Math.max(max, lt.duration),
        0
      );

      return {
        progress: pointInfo.p,
        worldName: pointInfo.name,
        drawCallsPerFrame: avgDrawCalls,
        trianglesPerFrame: avgTriangles,
        activeTextures: p.activeTextures,
        activeBuffers: p.activeBuffers,
        longTasksCount,
        maxLongTaskMs: +maxLongTask.toFixed(2),
        avgFrameTimeMs,
        jsHeapUsedMB,
      };
    }, point);

    samples.push(sample);
    console.log(
      `[SAMPLE] p=${point.p} | Draws: ${sample.drawCallsPerFrame} | Tris: ${sample.trianglesPerFrame} | Tex: ${sample.activeTextures} | Buf: ${sample.activeBuffers} | Heap: ${sample.jsHeapUsedMB}MB`
    );
  }

  // Network resource breakdown
  const resourceMetrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalJsBytes = 0;
    let totalCssBytes = 0;
    let totalAssetBytes = 0;
    let hdrBytes = 0;

    const list = resources.map((r) => {
      const transfer = r.transferSize || 0;
      const decoded = r.decodedBodySize || 0;
      const size = transfer > 0 ? transfer : decoded;

      if (r.name.endsWith('.js') || r.initiatorType === 'script') totalJsBytes += size;
      else if (r.name.endsWith('.css') || r.initiatorType === 'css') totalCssBytes += size;
      else totalAssetBytes += size;

      if (r.name.includes('.hdr')) hdrBytes = size;

      return {
        name: r.name.split('/').pop() || r.name,
        transferSize: transfer,
        decodedSize: decoded,
      };
    });

    return {
      totalJsBytes,
      totalCssBytes,
      totalAssetBytes,
      hdrBytes,
      resources: list,
    };
  });

  // Calculate totals and summary
  const peakDrawCalls = Math.max(...samples.map((s) => s.drawCallsPerFrame));
  const peakTriangles = Math.max(...samples.map((s) => s.trianglesPerFrame));
  const totalLongTasks = await page.evaluate(() => (window as any).__PERF__.longTasks.length);
  const maxLongTaskDurationMs = await page.evaluate(() =>
    Math.max(0, ...(window as any).__PERF__.longTasks.map((lt: any) => lt.duration))
  );
  const totalBufferCount = samples[0]?.activeBuffers || 0;
  const totalTextureCount = samples[0]?.activeTextures || 0;
  const hdrWireSizeMB = +(resourceMetrics.hdrBytes / (1024 * 1024)).toFixed(2);

  const baselineData: PerfBaseline = {
    timestamp: new Date().toISOString(),
    targetUrl,
    userAgent: await page.evaluate(() => navigator.userAgent),
    viewport: { width: 1440, height: 900 },
    bundleMetrics: resourceMetrics,
    scrollSamples: samples,
    summary: {
      peakDrawCalls,
      peakTriangles,
      totalLongTasks,
      maxLongTaskDurationMs: +maxLongTaskDurationMs.toFixed(2),
      totalBufferCount,
      totalTextureCount,
      hdrWireSizeMB,
    },
    hardwareIndependentVerdict:
      peakDrawCalls > 100 || totalBufferCount > 200 || hdrWireSizeMB > 3.0
        ? 'FAIL_BUDGET: Excessive draw calls, geometries, or assets exceed 60FPS target budget on typical GPUs'
        : 'PASS_BUDGET',
  };

  // Ensure docs directory exists
  const docsDir = path.resolve(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const reportName = process.env.PERF_OUT || 'perf-phase1.json';
  const baselinePath = path.join(docsDir, reportName);
  fs.writeFileSync(baselinePath, JSON.stringify(baselineData, null, 2), 'utf-8');
  console.log(`[PERF AUDIT] Saved report to ${baselinePath}`);

  expect(baselineData.scrollSamples.length).toBe(5);
});
