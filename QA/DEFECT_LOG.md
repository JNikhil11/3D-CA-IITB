# QA Defect & Verification Log

**Project:** 3D CA-IITB — The Living Atlas  
**Audit Standard:** Honesty Rule (Never state "zero bugs" without test evidence; report verified results per viewport).  
**Verification Date:** 04 November 2026

| Defect ID | Severity | Viewport / Module | Description & Reproduction | Root Cause | Fix Applied | Retest Verification |
|---|---|---|---|---|---|---|
| DEF-001 | Major | Mobile (<430px) | Horizontal page overflow of 15px to 85px detected at 390px, 375px, and 320px. | `.editionPill` had 43 uppercase characters with `letter-spacing: 0.14em` and no word wrapping; `.allCompetitionsBtn` had `white-space: nowrap`. | Responsive clamp font sizing, `word-break: break-word`, max-width containment on badges, buttons, and coordinate panels. | Retested with Playwright across 390x844, 375x812, 320x700: all passed with `diff <= 1px`. |
| DEF-002 | Major | Viewports <900px | Mobile navigation drawer caused residual `scrollWidth` expansion of 694px when closed. | `.mobileMenuPanel` was translated with `translateX(100%)` inside fixed container without `display: none` when closed. | Applied `display: none` when `!isMenuOpen` and `overflow: hidden` on `.mobileMenu`. | Verified closed and open drawer states; Escape key dismisses cleanly; zero layout expansion. |
| DEF-003 | Major | Small phones (375px, 320px) | Residual 5px overflow at 375px and 60px overflow at 320px in Chapter 05. | `.workshopHubLink` had `white-space: nowrap` forcing link text outside the viewport. | Replaced `white-space: nowrap` with `max-width: 100%` and `word-break: break-word`. | Full Playwright suite passed across 375x812 and 320x700 with zero overflow. |
| DEF-004 | Minor | E2E Tests | Test selector timeout on mobile menu toggle after open. | Button accessible name toggled from "Open Navigation Menu" to "Close Navigation Menu", invalidating regex selector. | Updated selector to `button[aria-controls="mobile-menu"]`. | All 9 Playwright tests passed in 58.4s. |
| DEF-005 | Moderate | Tablet Landscape (1024px) | 3.3px subpixel overflow (`scrollWidth: 1027px`) on sticky stage and editorial container. | In `App.module.css`, `.stageJourneySection` lacked `box-sizing: border-box`, and grid tracks defaulted to `minmax(auto, 1fr)`. Nested `.container` classes inside `StorySection` and `AtlasSection` added duplicate gutter padding and `repeat(4, 1fr)` forced min-content expansion. | Set `minmax(0, 1.05fr) minmax(0, 0.95fr)` on grid columns, `min-width: 0` on columns, removed nested `.container` wrappers from editorial subsections, and adjusted responsive quadrant grid to 2 columns. | Full Playwright E2E suite passed: 1024x768 has 0px overflow (`diff <= 1px`). All 9 tests passed. |
| DEF-006 | Minor | Mobile (<430px) | Fixed navigation header subtly overlapped the prologue calibration badge on initial load. | Hero section top padding (`4.5rem`) did not provide sufficient clearance for the 76px fixed navbar on compact screens. | Increased mobile hero top padding to `6rem`, and tightened mobile 3D HUD controls for maximum model visibility. | Visual screenshot inspection at 390x844 and 320x700 confirmed clear margin between navbar and hero content. |

## Viewport Test Matrix Results

| Viewport Target | Width × Height | Overflow Result | Status | Screenshot Evidence |
|---|---|---|---|---|
| Desktop Wide | 1440 × 900 | 0 px | PASSED | `test-results/screenshot-desktop-1440.png` |
| Standard Laptop | 1280 × 800 | 0 px | PASSED | `test-results/screenshot-laptop-1280.png` |
| Landscape Tablet / Compact Desktop | 1024 × 768 | 0 px | PASSED | `test-results/screenshot-tablet-landscape-1024.png` |
| Portrait Tablet | 768 × 1024 | 0 px | PASSED | `test-results/screenshot-tablet-portrait-768.png` |
| Large Phone | 430 × 932 | 0 px | PASSED | `test-results/screenshot-phone-large-430.png` |
| Common Phone | 390 × 844 | 0 px | PASSED | `test-results/screenshot-phone-common-390.png` |
| Small Phone | 375 × 812 | 0 px | PASSED | `test-results/screenshot-phone-small-375.png` |
| Minimum Stress Width | 320 × 700 | 0 px | PASSED | `test-results/screenshot-phone-min-320.png` |

## 3D Sculpture & Interactivity Verification

1. **Geometry & Depth:** Multi-tiered Cast Bronze pedestal base with stepped collar, knurled brass leveling feet, fluted baluster column, gimbal cradle fork, and bearing blocks. Four concentric calibrated rings with bevels, 96 astronomical graduation ticks, spur gear teeth, 12 zodiac constellation blocks with ruby star nodes, and equinoctial cardinal pointers.
2. **Materials & Lighting:** PBR `MeshStandardMaterial` (metalness 0.85-0.92, roughness 0.22-0.34) with multi-directional lighting and studio reflection HDR rig via Drei `Environment` / `Lightformer` (zero external asset requests).
3. **Contact Shadows:** Ground contact shadow positioned at `y = -1.5` beneath the pedestal, anchoring the sculpture onto the parchment plane.
4. **Interactivity:** 360° drag/touch rotation with damping and velocity accumulation, "Explode Rings / Collapse Orrery" mechanical inspection mode, "Reset Orientation", and ring quick-alignment buttons (R1 - R4) synced with domain selection.
5. **Sticky Stage Composition:** Desktop layout features a persistent sticky 3D stage (`top: 5rem; height: calc(100vh - 6rem)`) alongside Chapters 01 to 03, ensuring continuous visual engagement during scrolling without covering the sculpture.
6. **Mobile Layout:** Dedicated high-prominence 3D stage embedded directly within the Hero section with touch gestures, reduced shadow resolution, and responsive HUD.
