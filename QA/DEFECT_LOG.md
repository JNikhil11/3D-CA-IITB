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
