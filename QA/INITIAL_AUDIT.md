# Architectural & Visual Experience Audit

**Project:** Techfest 30 — IIT Bombay (3D CA-IITB)  
**Production URL:** https://3d-ca-iitb.vercel.app  
**GitHub Repository:** https://github.com/JNikhil11/3D-CA-IITB  
**Audit Timestamp:** 2026-11-04 16:52 UTC+5:30  
**Latest Git Commit:** `910c010` (`feat(3d): overhaul astronomical astrolabe, sticky stage, PBR lighting and 360 interactivity`)  
**Vercel Production Deployment:** `dpl_H6PeNJJMwZaftGy4nAPFPgaJV3L5` (Aliased to `https://3d-ca-iitb.vercel.app`)

---

## 1. Executive Summary & Root Cause Analysis

While the previous commit (`910c010`) updated the astrolabe geometry with procedural brass rings, PBR materials, and introduced a two-column sticky stage for Chapters 01–03, the website still suffered from critical conceptual and architectural flaws that prevented it from being perceived as a true immersive 3D digital exhibition:

1. **Fragmented 3D Journey (3D Stopped at Chapter 03):**  
   Chapters 04 ("Competitions"), 05 ("Learning"), 06 ("Atmosphere"), and 07 ("Finale") resided in `.independentChapters`, completely outside the 3D canvas stage. As soon as the visitor scrolled past Chapter 03, the 3D experience terminated entirely, replaced by static, traditional 2D HTML cards.
2. **Abstract Rather Than Concrete 3D Worlds in Chapter 03:**  
   Chapter 03 ("The Atlas") represented four pillars of modern engineering (Aerospace, Computing, Robotics, Clean Energy) solely as text cards, merely changing which brass ring turned gold in the astrolabe. It lacked authentic 3D environments representing these engineering domains.
3. **Disconnection from Cinematic Reference Aesthetic:**  
   The reference visual direction (`media_1793791071187_d2c7f8e7.jpg`) showcases an intricate, museum-grade astronomical clockwork machine: an ornate carved wooden pedestal with claw feet, an exposed side-mounted clockwork gear train with Roman numeral face, heavy engraved Latin meridian bands ("COLURUS AEQUINOXIALIS", "TROPICUS CANCRI"), a detailed zodiac ecliptic band, and a central bronze celestial sphere, all bathed in dramatic key lighting against a cosmic starfield/nebula. The existing implementation was set against flat beige parchment (`#F2EBDD`), depriving the metalwork of specular contrast and cosmic mystery.
4. **Camera Choreography Was Purely Passive Orientation Modulations:**  
   The camera did not fly into the engine, explore its interior mechanics, or transport the visitor into distinct spatial worlds. 3D was functioning as an illustrative object beside text rather than the central cinematic narrative medium.

---

## 2. Technical Inspection Matrix

| Area | Current State (Commit `910c010`) | Defect / Limitation | Required State (The Aether Engine Spec) |
|---|---|---|---|
| **Canvas Lifecycle & Viewport** | Sticky aside for Ch 01–03; removed in Ch 04–07. Mobile hero slot only. | 3D vanishes halfway through the user journey. | **Continuous Full-Stage 3D World:** The 3D canvas spans the entire experience, with cinematic camera choreography guiding the visitor through all 5 chapters. |
| **Opening 3D Hero Sculpture** | Procedural rings with ticks, gear teeth, and basic alidade. | Lacks the mechanical richness, exposed clockwork escapement, Latin relief engravings, and claw-foot pedestal of the reference. | **The Aether Engine:** Monumental Renaissance clockwork armillary sphere featuring ornate claw-foot base, exposed Roman-numeral clockwork mechanism, engraved Latin rings, and zodiac relief band. |
| **Scroll Experience** | Slight rotation tilt (`y += scrollProgress`). | Flat, static camera distance (`z: 7.2`). No sense of journey or scale. | **Cinematic Camera Flight:** Camera flies through the celestial rings into the core mechanism, entering the heart of the engine. |
| **Engineering Representation** | 4 text cards that highlight a ring in gold. | 2D editorial cards instead of 3D environments. | **The World of Engineering:** 4 distinct, real 3D spatial scenes (Robotics kinematic arm & LiDAR, Aerospace orbital satellite & ion thruster, Computational quantum neural lattice, Sustainable helical turbine & tokamak ring). |
| **Festival Arena** | 2D competition grid cards. | Misses the energy and scale of Asia's largest tech festival. | **The Techfest Experience:** 3D festival pavilion with spatial exhibition pylons, interactive beacons for flagship competitions (Robowars, CoDecode, etc.), and verified festival metrics. |
| **Final Resolution** | Flat text card with CTA link. | Anti-climactic end to the story. | **Enter Techfest:** Camera pulls back to the fully illuminated Aether Engine hovering over the final portal gate. |
| **Editorial Overlays** | Opaque column cards competing with 3D canvas. | Content crowds the 3D model, causing visual competition. | **Glassmorphic Renaissance Overlays:** Transparent archival manuscript cards, frosted glass panels, and precision scientific annotations that allow the 3D universe to remain visible at all times. |
| **Mobile Experience** | Canvas restricted to small box inside hero. | Disconnected from scroll story on mobile. | **Mobile-Optimized 3D Stage:** Responsive camera zoom and touch controls with dedicated interactive mode and smooth vertical scroll flow. |

---

## 3. WebGL State & Asset Audit

- **WebGL Availability:** Tested and active across Chrome, Firefox, and Safari on desktop and mobile. WebGL2 context initialized with `ACESFilmicToneMapping` and high performance profile.
- **Fallback Verification:** `AstrolabeFallback.tsx` exists and renders an SVG illustration when WebGL is unavailable or context is lost.
- **Console Errors:** 0 WebGL shader compilation or runtime errors.
- **Resource Cleanup:** Materials and geometries are managed with explicit disposal lifecycle hooks (`dispose()`).

---

## 4. Architectural Transformation Plan

The website architecture will be completely overhauled into **The Aether Engine Universe**:
1. **Scene Engine (`src/scene/`):**
   - `AetherEngineScene.tsx`: Master 3D scene orchestrating the 5 chapters and smooth camera transitions.
   - `AetherEngineModel.tsx`: Rebuilt signature mechanical sculpture matching the reference image (claw-foot base, clockwork dial mechanism, Latin engraved rings, zodiac band, celestial core).
   - `EngineeringWorlds.tsx`: Real 3D interactive environments for Robotics, Aerospace, Computation, and Sustainable Engineering.
   - `FestivalPavilion.tsx`: 3D festival arena with interactive competition nodes.
   - `SpaceEnvironment.tsx`: Cosmic starfield and lighting rig.
2. **Choreography (`src/motion/`):**
   - Continuous scroll camera timeline mapping normalized scroll progress (`0.0` to `1.0`) to 3D camera waypoints and scene transformations.
3. **Editorial Presentation (`src/sections/`):**
   - Translucent Renaissance manuscript cards with delicate borders, gold leaf accents, and high-contrast typography that complement rather than cover the 3D scenes.
