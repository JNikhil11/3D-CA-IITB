# 3D CA-IITB

> **Techfest 30 | IIT Bombay — The Living Atlas**  
> *An Aetherial Renaissance: 3D Interactive Experience & College Ambassador Web Initiative*

[![Typecheck](https://img.shields.io/badge/TypeScript-Strict%20Passed-blue.svg)](file:///PROJECT_BRIEF.md)
[![Lint](https://img.shields.io/badge/ESLint-9.x%20Clean-brightgreen.svg)](file:///eslint.config.js)
[![Unit Tests](https://img.shields.io/badge/Vitest-11%2F11%20Passed-success.svg)](file:///src/tests/techfest.test.ts)
[![E2E & Responsive](https://img.shields.io/badge/Playwright-8%20Viewports%20Verified-blueviolet.svg)](file:///QA/DEFECT_LOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](file:///LICENSE)

---

## 1. Project Overview & Architectural Vision

**3D CA-IITB** is an original, responsive, browser-based 3D interactive landing experience designed for the **30th Edition of Techfest, IIT Bombay** (Asia's Largest Science and Technology Festival).

Interpreting the official theme **"An Aetherial Renaissance"**, the site departs decisively from generic AI tech templates (no neon-cyan glows or dark SaaS cards). Instead, it embodies **"The Living Atlas"**: an editorial manuscript and celestial exhibition where Renaissance astronomical instruments—astrolabes and armillary spheres—converge with modern robotics, avionics, quantum systems, and planetary engineering.

### Signature 3D Visual Anchor: The Mechanical Astrolabe
At the center of the experience is a procedurally constructed 3D armillary astrolabe sculpture:
- **Calibrated Meridian Ring:** Outer circular brass band with 72 calibrated astronomical graduation tick marks.
- **Tilted Ecliptic / Zodiac Band:** Positioned at a true 23.5° axial obliquity with 12 luminous constellation node markers.
- **Equinoctial Plane & Sighting Alidade:** Horizontal brass plane with cardinal directional pivots and dual sighting vanes.
- **Ultramarine Terrestrial / Celestial Core:** Internal transmissive glass sphere enclosed in an astronomical meridian coordinate cage.
- **Interactive Multi-Ring Alignment:** Selecting any of the 4 Atlas domains mechanically aligns and highlights the corresponding armillary ring in real-time.

---

## 2. Technical Stack

| Layer | Technology | Specification / Role |
|---|---|---|
| **Framework & Core** | React 19 + TypeScript | Declarative component architecture with strict typing |
| **Bundler & Build Tool** | Vite 6 | Optimized HMR, Rollup chunk splitting (`vendor-three`, `vendor-r3f`, `gsap`) |
| **3D Graphics & WebGL** | Three.js + React Three Fiber + Drei | Procedural geometry, PBR materials (brass, bronze, transmissive glass) |
| **Motion Choreography** | GSAP 3 + ScrollTrigger | Non-intrusive scroll-linked reveals; **zero scroll hijacking** |
| **Styling & Design Tokens** | CSS Modules + Custom Tokens | Warm editorial palette (`#F2EBDD` Parchment, `#272721` Ink, `#D65D40` Vermilion) |
| **Testing Suite** | Vitest + Testing Library + Playwright | Unit tests, component accessibility assertions, multi-viewport E2E runs |
| **Engineering Harness** | ECC (Experimental Antigravity Adapter) | Clean workflow structure (`.agents/rules/`, `.agents/skills/`) |

---

## 3. Seven Sourced Chapters & Information Architecture

1. **01 · Prologue (Hero):** Immediate recognition, Techfest 30 / IIT Bombay identity, 3D astrolabe focal sculpture, dual high-contrast action CTAs, and visible scroll indicator.
2. **02 · The Revival (Story):** Sourced context and human scale: 30 years of legacy (est. 1998), 175,000+ annual participants, and delegations from 25+ countries.
3. **03 · The Atlas of Ideas (Domains):** Interactive quadrivium across Robotics, Aerospace, Cognitive Computing, and Sustainable Engineering with 3D ring coordination.
4. **04 · Competitions:** Verified flagship challenges: International Robowars (15kg & 60kg combat bots), Boeing National Aeromodelling Challenge, InnovateX National Innovation Challenge, International Coding Challenge, and Meshmerize.
5. **05 · Discovery & Discourse:** Verified workshops (Generative AI labs, ROS 2 Robotics), World Exhibitions, and the International Lecture Series.
6. **06 · Festival Realm (Atmosphere):** Technoholix night laser/aerial spectacle, Ozone interactive science carnival, and Powai campus coordinates.
7. **07 · Final Invitation (Colophon):** Dominant registration CTA to verified official portal (`https://techfest.org`), secondary ambassador pathway (`https://ca.techfest.org`), and required independent CA concept disclosure.

---

## 4. Responsive Verification Matrix (Playwright Tested)

Tested against the complete viewport matrix with **zero horizontal clipping** and verified evidence:

| Viewport Target | Dimensions (CSS px) | Layout Behavior | Result | Screenshot Evidence |
|---|---|---|---|---|
| Desktop Wide | 1440 × 900 | Split editorial hero, 3D astrolabe right balance | **PASSED** | `test-results/screenshot-desktop-1440.png` |
| Standard Laptop | 1280 × 800 | Balanced whitespace, fluid container grid | **PASSED** | `test-results/screenshot-laptop-1280.png` |
| Compact Desktop / Tablet Landscape | 1024 × 768 | Responsive 4-column domain grid | **PASSED** | `test-results/screenshot-tablet-landscape-1024.png` |
| Portrait Tablet | 768 × 1024 | Stacked grid, touch targets optimized | **PASSED** | `test-results/screenshot-tablet-portrait-768.png` |
| Large Phone | 430 × 932 | Clean typography wrap, full-bleed CTA buttons | **PASSED** | `test-results/screenshot-phone-large-430.png` |
| Common Phone | 390 × 844 | Mobile drawer menu, zero overflow | **PASSED** | `test-results/screenshot-phone-common-390.png` |
| Small Phone | 375 × 812 | Fluid clamp() fonts, wrapped badges | **PASSED** | `test-results/screenshot-phone-small-375.png` |
| Minimum Stress Width | 320 × 700 | Verified zero horizontal overflow (`diff <= 1px`) | **PASSED** | `test-results/screenshot-phone-min-320.png` |

---

## 5. Development & Verification Commands

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Run strict TypeScript type check
npm run typecheck

# Run ESLint check
npm run lint

# Run Vitest unit & component test suite
npm run test

# Run Playwright responsive & E2E verification across all viewports
npm run test:e2e

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Official Attribution & Disclaimer

- **Official Portals:** [techfest.org](https://techfest.org) | [ca.techfest.org](https://ca.techfest.org)
- **Institution:** Indian Institute of Technology Bombay (Powai, Mumbai 400076)
- **Submission Author:** [JNikhil11](https://github.com/JNikhil11)
- **Repository Slug:** `3D-CA-IITB` (Canonical GitHub URL: `https://github.com/JNikhil11/3D-CA-IITB`)
- **Disclaimer:** This project is an independent submission developed for the Techfest 30 College Ambassador Web Development initiative. All trademarks, official logos, and event titles remain the exclusive intellectual property of Techfest, IIT Bombay.
