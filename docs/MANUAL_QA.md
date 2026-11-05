# Manual Real-GPU QA Verification Checklist

## Why Headless Automated Tests Cannot Measure Real-World FPS
Automated headless browser runners (such as Playwright running in Chromium) utilize **SwiftShader**, a CPU-based software rasterizer, rather than dedicated physical GPU hardware. While headless tests produce 100% accurate, hardware-independent metrics (draw call counts, triangle throughput, WebGL buffer allocations, texture memory, and main-thread JavaScript execution duration), they **cannot** accurately measure native GPU refresh rates (60/90/120 FPS) or fill-rate bottlenecks on physical display panels.

This manual verification protocol must be executed on physical hardware before any phase can be marked as complete.

---

## 1. Test Hardware Matrix

| Tier | Target Devices / Configuration | Target Frame Rate | Maximum Frame Time |
| :--- | :--- | :--- | :--- |
| **Tier 1: Desktop High-End** | Dedicated GPU (Nvidia RTX / Apple M-series Pro/Max), 1440p / 4K 120Hz | **120 FPS** | 8.33 ms |
| **Tier 2: Standard Laptop** | Integrated GPU (Intel Iris Xe / AMD Radeon 680M / Apple M-base), 1080p 60Hz | **60 FPS** | 16.66 ms |
| **Tier 3: Mobile Handset** | iPhone 13+ (Safari iOS) / Samsung Galaxy S21+ (Chrome Android) | **60 FPS** | 16.66 ms |

---

## 2. Chrome DevTools Setup Instructions

1. Open Chrome on physical hardware and navigate to `http://localhost:3000` (or the Vercel Preview URL).
2. Open DevTools (`F12` or `Cmd + Option + I`).
3. Press `Cmd + Shift + P` (macOS) or `Ctrl + Shift + P` (Windows) to open the Command Menu.
4. Type `Show Rendering` and press Enter.
5. In the **Rendering** drawer:
   - Check **Frame Rendering Stats** (HUD displays live FPS, GPU raster status, and dropped frame count).
   - Check **Core Web Vitals** overlay.
6. Open the **Performance** tab for timeline recording with 4x CPU slowdown simulated.

---

## 3. Step-by-Step Test Protocol

### Step 1: Preloader & Shader Warmup
- **Action:** Perform a hard refresh (`Ctrl + Shift + R`).
- **Observe:** Does the insignia animate smoothly without stutter? Does the preloader progress smoothly from 0% to 100%?
- **Pass Criteria:** No visual freezing during asset decompression; curtain drops cleanly without dropping frames below 55 FPS.

### Step 2: Hero Section Idle & Presentation Controls (Progress 0.0)
- **Action:** Allow the Hero observatory environment to idle for 5 seconds. Then, click/touch and drag to rotate the Aether Temple Engine.
- **Observe:** Check the DevTools FPS counter.
- **Pass Criteria:**
  - Idle FPS maintains steady 60 FPS (or 120 FPS on high-refresh displays).
  - Dragging the central orrery does not induce stutter or frame hitching.

### Step 3: Continuous Scroll Scrub (Progress 0.0 -> 1.0)
- **Action:** Smoothly scroll from the top of the page down to the footer over 10 seconds.
- **Observe:** Note any frame rate dips when transitioning between worlds:
  - World 01 -> World 02 (Observatory to Subterranean Vault)
  - World 02 -> World 03 (Subterranean to Engineering Quadrants)
  - World 03 -> World 04 (Engineering to Technoholix Arena)
  - World 04 -> World 05 (Technoholix to Final Elevation Beacon)
- **Pass Criteria:** No frame dips below 50 FPS during camera lerp transitions.

### Step 4: Leader Line & HUD Synchronization
- **Action:** While scrolling between worlds, observe the SVG leader line connecting the 3D focal anchor to the editorial glass card.
- **Observe:** Does the line track the anchor without decoupling, jitter, or 1-frame latency?
- **Pass Criteria:** Leader line coordinates update synchronously with camera projection without visual lag.

### Step 5: Memory Leak & Sustained Load Verification
- **Action:** Scroll up and down continuously through all 5 worlds 10 times consecutively.
- **Observe:** DevTools **Memory** tab -> JS Heap Size and GPU Process Memory in Task Manager.
- **Pass Criteria:** JS Heap remains bounded (under 80 MB); no monotonically increasing memory growth; no WebGL context loss warnings.

---

## 4. Verification Sign-Off Template

When reporting manual QA results on physical hardware, paste this block:

```markdown
### Physical Hardware QA Report
- **Tester Hardware:** [e.g. Apple MacBook Pro M2 / Windows RTX 4070 / iPhone 14 Pro]
- **Display Resolution & Refresh Rate:** [e.g. 2560x1440 @ 120Hz / 1920x1080 @ 60Hz]
- **Browser:** [e.g. Chrome 134 / Safari 18]
- **Idle FPS:** [e.g. 120 FPS]
- **Active Drag FPS:** [e.g. 118 FPS]
- **Scroll Transition Lowest FPS:** [e.g. 58 FPS]
- **Observed Glitches / Pop-in:** [None / Detail any frame hitching]
- **Sign-Off Verdict:** [PASS / FAIL]
```
