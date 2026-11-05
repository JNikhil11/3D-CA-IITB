# Engineering & WebGL Performance Audit: Techfest 30 Living Atlas

**Target Repository:** `https://github.com/JNikhil11/3D-CA-IITB`  
**Production Deployment:** `https://3d-ca-iitb.vercel.app`  
**Audit Date:** November 5, 2026  
**Auditor:** Senior WebGL / Real-Time Graphics & Performance Specialist  
**Status:** PHASE 0 COMPLETE — AUDIT & BASELINE RECORDED

---

## Executive Summary

A comprehensive, evidence-based graphics and frontend audit was conducted on both the live Vercel production deployment and the local repository. Automated hardware-independent measurements were captured via Playwright in `QA/perf.spec.ts` and exported to `docs/perf-baseline.json`.

The system currently fails performance budgets for smooth 60–120 FPS rendering across standard and mobile hardware. Peak draw calls reach **535 calls per frame**, active WebGL buffers exceed **1,400**, and a single uncompressed HDR texture consumes **6.02 MB** on the network wire. Furthermore, 20 independent `useFrame` hooks and per-frame CPU vertex uploads induce substantial main-thread blocking during world transitions.

---

## 1. Static Codebase Inventory

### 1.1 Source Composition
- **Total Source Files:** 68 TypeScript/CSS files in `src/`.
- **Total `<mesh>` Declarations:** **266** across 15 scene files.
- **Total `<instancedMesh>` Declarations:** **0** (Zero instancing implemented).
- **Total Dynamic Lights Declared:** **28** (23 `pointLight`, 3 `directionalLight`, 2 `spotLight`).
- **Shadow-Casting Lights:** 1 primary directional light with `2048x2048` shadow map (`shadow-mapSize={[2048, 2048]}`) and 9 shadow-casting mesh groups.
- **Active `useFrame` Callbacks:** **20** callbacks running simultaneously across 16 components.
- **Glass / Composite Overlays:** **7** CSS modules applying `backdrop-filter: blur(...)` directly on top of the live WebGL canvas.

### 1.2 Breakdown by Scene Component

| Component File | Meshes | Instanced | Groups | Point Lights | Dir Lights | Spot Lights |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `sculpture/AstronomicalAstrolabe.tsx` | 59 | 0 | 19 | 0 | 0 | 0 |
| `sculpture/TempleGimbals.tsx` | 31 | 0 | 10 | 1 | 0 | 0 |
| `sculpture/TemplePlatform.tsx` | 25 | 0 | 8 | 2 | 0 | 0 |
| `sculpture/TemplePlanetarium.tsx` | 16 | 0 | 7 | 3 | 0 | 0 |
| `sculpture/TempleCore.tsx` | 8 | 0 | 3 | 2 | 0 | 0 |
| `sculpture/AetherTempleEngine.tsx` | 2 | 0 | 3 | 0 | 0 | 0 |
| `worlds/GrandObservatoryEnvironment.tsx` | 15 | 0 | 7 | 2 | 0 | 0 |
| `worlds/SubterraneanEngineEnvironment.tsx`| 28 | 0 | 11 | 2 | 0 | 0 |
| `worlds/EngineeringWorldsEnvironment.tsx` | 20 | 0 | 11 | 3 | 0 | 0 |
| `worlds/FestivalExperienceEnvironment.tsx`| 8 | 0 | 7 | 2 | 0 | 2 |
| `worlds/FinalDestinationEnvironment.tsx` | 6 | 0 | 4 | 2 | 0 | 0 |
| `chapters/AerospaceEnvironment.tsx` | 16 | 0 | 8 | 1 | 0 | 0 |
| `chapters/ComputingEnvironment.tsx` | 5 | 0 | 4 | 1 | 0 | 0 |
| `chapters/FestivalEnvironment.tsx` | 10 | 0 | 3 | 1 | 0 | 0 |
| `chapters/RoboticsEnvironment.tsx` | 17 | 0 | 10 | 1 | 0 | 0 |
| `scene/ImmersiveCanvas.tsx` | 0 | 0 | 0 | 0 | 3 | 0 |
| **TOTALS** | **266** | **0** | **115** | **23** | **3** | **2** |

---

## 2. Production Build vs. Live Vercel Deployment

### 2.1 Live Deployment Inspection (`https://3d-ca-iitb.vercel.app`)
- **HTTP Status:** 200 OK
- **Deployment Timestamp:** Thu, 05 Nov 2026 13:48:10 GMT
- **Cache Header:** `x-vercel-cache: HIT (age: 5023s)`
- **Script Bundles Served:**
  - `/assets/index-Cm2Ng-tg.js`
  - `/assets/index-DZznfa2k.css`

### 2.2 Local Production Build (`tsc && vite build`)
- **Build Duration:** 13.17s
- **Output Artifacts:**
  - `dist/assets/three-nOitOmZj.js`: **690.67 kB** (gzip: **177.38 kB**)
  - `dist/assets/r3f-adZQYyzh.js`: **502.20 kB** (gzip: **159.84 kB**)
  - `dist/assets/index-RfVg6CkN.js`: **129.99 kB** (gzip: **38.22 kB**)
  - `dist/assets/gsap-DdEiTQuA.js`: **70.90 kB** (gzip: **27.95 kB**)
  - `dist/assets/index-CJpmeq0P.css`: **28.32 kB** (gzip: **6.88 kB**)
- **Total Transferred JS (Wire):** **403.39 kB** gzipped (**1.39 MB** raw)
- **Hash Difference Analysis:** Local build hashes (`index-RfVg6CkN.js`) differ from live (`index-Cm2Ng-tg.js`) due to previous UI and curtain styling adjustments made on `main` that have not yet been deployed through a new verified release tag or PR.

---

## 3. Empirical Performance Baseline (`docs/perf-baseline.json`)

Measurements were taken using the newly authored `QA/perf.spec.ts` test suite under automated Chromium execution with WebGL context interception:

| World Section | Scroll Progress | Draw Calls / Frame | Triangles / Frame | Active Buffers | Active Textures | Heap (MB) | Long Tasks (>50ms) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **World 01: Grand Observatory** | 0.00 | **535** | 194,146 | 1,048 | 14 | 54.17 | 8 |
| **World 02: Subterranean Vault** | 0.25 | **524** | 194,008 | 1,072 | 14 | 54.17 | 12 |
| **World 03: Engineering Quadrants** | 0.50 | **519** | 191,669 | 1,233 | 14 | 54.17 | 15 |
| **World 04: Technoholix Arena** | 0.75 | **511** | 188,814 | 1,320 | 14 | 54.17 | 18 |
| **World 05: Final Elevation** | 1.00 | **498** | 186,959 | 1,409 | 14 | 54.17 | 21 |

### Summary Metrics:
- **Peak Draw Calls:** **535 calls/frame** (Target: < 80–100 calls/frame)
- **Peak Triangles:** **194,146 triangles/frame** (Acceptable, but unindexed)
- **Active WebGL Buffers:** **1,048 – 1,409 buffers** allocated simultaneously in GPU VRAM
- **Total Startup Long Tasks (>50ms):** **24** tasks (Maximum observed duration: **9,673 ms** during unoptimized HDRI decode and shader compilation)
- **Network Asset Transfer Size:**
  - `studio_small.hdr`: **6,313,247 bytes** (**6.02 MB**) uncompressed HDR

---

## 4. Top 10 Root Bottlenecks (Ranked by Severity)

### Rank 1: Massive Uncompressed HDRI File (`public/hdri/studio_small.hdr`)
- **Severity:** CRITICAL
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L319`
- **Mechanism:** `<Environment files="/hdri/studio_small.hdr" />` forces a 6.02 MB network download on initial load. The browser must decode RGBE floating-point data on the main thread, resulting in a 7.7s to 9.6s long task and delaying the initial interactive frame.
- **Remediation:** Replace with an optimized pre-filtered KTX2/DDS environment map or an ultra-compact RGBE cube map (< 600 KB total), or use procedural gradient harmonics for ambient reflections.

### Rank 2: 266 Individual `<mesh>` Objects with Zero Instancing
- **Severity:** CRITICAL
- **Code Reference:** `src/scene/sculpture/*.tsx`, `src/scene/worlds/*.tsx`
- **Mechanism:** Repeated structural elements (16 rotunda pillars, 24 brass rivets, 12 gear teeth, 8 gimbal calipers, 6 catenary cables) are rendered as separate `<mesh>` elements. This inflates draw calls to 535/frame and forces 1,400 individual buffer bindings per frame.
- **Remediation:** Convert all repeated geometric elements into Three.js `<instancedMesh>` instances with shared BufferGeometry and single-material batches. Target: reduce draw calls below 75.

### Rank 3: 28 Competing Dynamic Lights & 2048px Real-Time Shadow Maps
- **Severity:** HIGH
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L325-L347`, individual world components
- **Mechanism:** 23 point lights and 3 directional lights are declared across components. Forward rendering evaluates every dynamic light per active fragment. Furthermore, a 2048x2048 directional shadow map forces a full scene shadow pass, multiplying draw calls.
- **Remediation:** Consolidate lighting into a master 3-point light rig (1 key directional light, 1 fill, 1 rim). Convert point lights on architectural structures into baked emissive shaders or instanced fake glow spheres.

### Rank 4: 20 Uncoordinated `useFrame` Loops on the Main Thread
- **Severity:** HIGH
- **Code Reference:** 16 separate components invoking `useFrame`
- **Mechanism:** Each `useFrame` executes an independent JavaScript callback on every render tick. Many perform vector allocations (`new THREE.Vector3()`), trigonometry calculations, and React state evaluations out of order.
- **Remediation:** Centralize scene updates into a single orchestrator loop or use R3F priority ordering (`useFrame(..., priority)`). Pre-allocate all temporary vectors outside render loops to avoid GC churn.

### Rank 5: Per-Frame CPU Vertex Buffer Mutation in `AetherDust`
- **Severity:** HIGH
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L236-L243`
- **Mechanism:**
  ```typescript
  useFrame((_, delta) => {
    for (let i = 0; i < count; i++) {
      pos.setY(i, ((pos.getY(i) + delta * 0.025 + 8) % 16) - 8);
    }
    pos.needsUpdate = true; // Forces CPU -> GPU buffer transfer every frame!
  });
  ```
- **Remediation:** Replace with a GPU vertex shader (`customShaderMaterial` or `PointsMaterial` with vertex shader animation) that computes particle positions based on `uniform float uTime`, eliminating all CPU loops and zero GPU buffer uploads.

### Rank 6: Multi-Layered `backdrop-filter: blur(18px)` Over Active WebGL
- **Severity:** HIGH
- **Code Reference:** `DecorativeGoldFrame.module.css`, `Navbar.module.css`, `TopHUDBar.module.css`, `VerticalNavRail.module.css`
- **Mechanism:** `backdrop-filter: blur(...)` forces the browser compositor to perform a synchronous GPU readback of the WebGL canvas, apply a two-pass Gaussian blur on the compositing layer, and composite the DOM overlay every frame.
- **Remediation:** Remove heavy real-time CSS backdrop blur directly over the canvas. Use pre-rendered semi-transparent dark tinted panels (`background: rgba(8, 12, 22, 0.82)`) with crisp hairline borders (`box-shadow` or 1px SVG borders).

### Rank 7: `preserveDrawingBuffer: true` in Canvas Configuration
- **Severity:** MEDIUM
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L458`
- **Mechanism:** Setting `preserveDrawingBuffer: true` prevents the browser from discarding the WebGL backbuffer after presentation, disabling fast hardware page flipping and increasing mobile VRAM bandwidth consumption by up to 2x.
- **Remediation:** Remove `preserveDrawingBuffer: true` (default to `false`).

### Rank 8: Uncapped High-DPI DPR (`dpr={[1, 2]}`)
- **Severity:** MEDIUM
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L451`
- **Mechanism:** On modern MacBook Retina displays and high-DPI mobile devices (devicePixelRatio = 2 or 3), rendering at full 2x or 3x forces shading of up to 8.3 million pixels per frame.
- **Remediation:** Cap DPR at `[1, 1.5]` for desktop and `[1, 1.25]` for mobile, integrated with Drei `<PerformanceMonitor>` to automatically scale DPR down to 1.0 if frame rate drops below 55 FPS.

### Rank 9: React State Mutation in Render Loop (`WorldsManager`)
- **Severity:** MEDIUM
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L271-L288`
- **Mechanism:** `setWorldStates({ w1, w2, w3, w4, w5 })` is called inside `useFrame`, triggering asynchronous React reconciliation and component unmount/mount cycles while the 3D scene is rendering.
- **Remediation:** Control world visibility and material opacity directly on Three.js object references (`mesh.visible = true/false`, `material.opacity = lerp(...)`) without React state changes.

### Rank 10: Lack of Unified Shader Warm-up Pipeline
- **Severity:** MEDIUM
- **Code Reference:** `src/scene/ImmersiveCanvas.tsx#L83`
- **Mechanism:** Only the root scene is compiled during `gl.compile()`. When worlds switch dynamically at `p=0.20, 0.40, 0.65`, new materials are lazily compiled by the WebGL driver on the main thread, resulting in micro-stutters during scrolling.
- **Remediation:** Ensure all materials across all 5 worlds are traversed and compiled during the initial preloader curtain phase before revealing the interface.

---

## 5. Performance Targets & Phase Budget

| Metric | Current Baseline (Audit) | Target Budget (Phase 1–5) | Target Reduction |
| :--- | :--- | :--- | :--- |
| **Peak Draw Calls / Frame** | **535** | **< 75** | **-86%** |
| **Active WebGL Buffers** | **1,409** | **< 150** | **-89%** |
| **Triangles / Frame** | **194,146** | **< 120,000** | **-38%** |
| **3D Asset Wire Size** | **6.02 MB** (HDR only) | **< 1.8 MB** (All assets) | **-70%** |
| **JS Bundle (gzip wire)** | **403 kB** | **< 320 kB** | **-20%** |
| **Startup Long Tasks (>50ms)** | **24** | **< 3** | **-87%** |
| **Max Long Task Duration** | **9,673 ms** | **< 250 ms** | **-97%** |
| **Real GPU Frame Rate** | Variable (drops on scroll) | **Solid 60 / 120 FPS** | **Fluid Cinematic** |

---

## 6. Phase 0 Completion & Sign-Off

Phase 0 requirements have been strictly satisfied:
1. Zero feature code in `src/` has been modified.
2. Verified Playwright test harness `QA/perf.spec.ts` created and validated against the local build.
3. Hardware-independent baseline data recorded in `docs/perf-baseline.json`.
4. Manual Real-GPU QA Protocol documented in `docs/MANUAL_QA.md`.
5. Comprehensive audit documentation delivered in `docs/AUDIT.md`.

*Next Phase (Phase 1: Performance Optimization & Asset Streamlining) is fully mapped and awaiting user approval.*
