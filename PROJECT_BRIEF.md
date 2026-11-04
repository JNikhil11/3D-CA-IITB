# TECHFEST 30 / ANTIGRAVITY MASTER BUILD SPEC
## MASTER EXECUTION BRIEF • PROJECT TITLE: 3D CA-IITB

**Display Title:** 3D CA-IITB  
**Repository:** JNikhil11 / 3D-CA-IITB  
**Date:** 04 November 2026  
**Execution Standard:** Single-prompt complete delivery; verified evidence, not confidence or promises.

---

### PAGE 01 / TITLE & PREAMBLE
- **Event:** Techfest 30, IIT Bombay (Asia's Largest Science & Technology Festival)
- **Concept:** THE LIVING ATLAS (Aetherial Renaissance / 3D Interactive Experience)
- **Standard of Care:** Perfection is the standard of care; verified evidence is the standard of completion.

---

### PAGE 02 / MASTER INSTRUCTION
- **Single-prompt execution contract:**
  - Do not stop after research, plan, wireframe, or mock-up. Continue through implementation, testing, fixes, and deployment readiness.
  - Do not request additional design prompts for ordinary decisions. Resolve them using this specification, current official sources, repository evidence, and documented engineering judgement.
  - Do not silently invent facts, event names, dates, sponsors, figures, models, licences, or features.
  - Do not claim anything is tested, responsive, accessible, secure, or complete unless you ran the relevant check and recorded the result.
  - Complete all independent work first if a human blocker occurs.
- **Priority Order:**
  Official task requirements and verified Techfest facts → this manual → verified source-code references → design-gallery inspiration → agent preference.

---

### PAGE 03 / MODEL, REASONING, AND EXECUTION SAFETY
- Gemini 3.8 Flash in Google Antigravity with high thinking/effort.
- Turbo warning: never run destructive commands, delete unrelated files, alter global settings, expose secrets, or force-push.

---

### PAGE 04 / PRODUCT REQUIREMENTS DOCUMENT (PRD)
- **Product Summary:** Original, responsive, browser-based 3D interactive landing page for Techfest, IIT Bombay. Translates the spirit of science, engineering, discovery, creativity, and festival-scale participation.
- **Primary Goals:**
  - Communicate Techfest identity and 30th-edition context with correct, sourced information.
  - Distinctive editorial art direction avoiding generic AI technology aesthetics.
  - At least one meaningful, real 3D experience integrated with scrolling or user input.
  - Clear pathways to official competitions, workshops, festival info, and registration.
  - Work intentionally across phone, tablet, laptop, and desktop viewports.
  - Fast, accessible, maintainable, static frontend.
- **Non-Goals:** No login/auth DB, payment, tickets checkout, admin CRM, fake schedule, fake testimonials.

---

### PAGE 05 / SUCCESS CRITERIA AND SCOPE BOUNDARIES
- **Success Criteria:**
  - Brand: Identifiable as Techfest, not generic agency template.
  - Story: Curiosity → Discovery → Participation.
  - 3D: True WebGL 3D scene responding to pointer/touch/scroll.
  - Motion: Purposeful, smooth, reversible, no scroll hijacking.
  - Responsive: No clipping, horizontal overflow, or unusable interactions at required widths.
  - Content: Every factual claim and CTA has a verified source.
  - Quality: Build passes, visual QA, a11y, links, console clean.

---

### PAGE 06 / AUDIENCE, VISITOR JOURNEYS, AND CONVERSION
- **Audience:** Students/participants, College ambassadors, Parents/educators, Tech enthusiasts.
- **Primary Journey:**
  1. Arrive and recognise Techfest / IIT Bombay within first screen.
  2. Understand theme ("An Aetherial Renaissance") and proposition.
  3. Explore story, domains, competitions, workshops, festival experience.
  4. Clear next action: official registration, competitions, workshops, main portal.

---

### PAGE 07 / INFORMATION ARCHITECTURE AND PAGE MAP
1. **01 · Hero:** Techfest identity, theme, edition/date, 3D astrolabe sculpture, Explore CTA.
2. **02 · The invitation / story:** Sourced positioning statement and festival essence.
3. **03 · Atlas of ideas:** Actual official domains/categories with interactive 3D navigation/index.
4. **04 · Challenges / Competitions:** Verified competition highlights with event details links.
5. **05 · Learning and discovery:** Verified workshops, exhibitions, lectures.
6. **06 · Festival atmosphere:** Campus-wide experience, cultural & tech spectacles (Technoholix, Ozone).
7. **07 · Final invitation:** Official registration / portal CTA, footer disclaimer and social links.

---

### PAGE 08 / CREATIVE CONCEPT: THE LIVING ATLAS
- **Narrative Arc:** Observe → Question → Experiment → Invent → Gather → Participate.
- **Signature Object:** Mechanical astrolabe / orrery-inspired 3D sculpture as visual anchor. Newly composed design, credible mechanical proportions, restrained metallic materials, engraved marks, contemporary lighting. Exhibition sculpture feel.

---

### PAGE 09 / ART DIRECTION: PALETTE, TYPOGRAPHY, AND MATERIALS
- **Color Tokens:**
  - Parchment `#F2EBDD` (Primary page canvas)
  - Ink `#272721` (Body text, rules, fine labels)
  - Vermilion `#D65D40` (High-impact accent & CTA)
  - Ultramarine `#344FC1` (Technology chapters & deep visual contrast)
  - Antique Gold `#D9AF56` (Instrument details, metal highlights)
  - Sage `#527B65` (Secondary chapters & calm contrast)
  - Warm White `#FBF9F3` (Cards, content panels, negative space)
- **Typography:**
  - Display: Cormorant Garamond / Editorial Serif
  - Body: Space Grotesk / Inter
  - Utility: Space Mono / JetBrains Mono
- **Material & Image Language:** Engraved linework, fine scientific annotations, brass/bronze 3D material. NO GENERIC DARK THEME.

---

### PAGE 10 / VISUAL DESIGN SYSTEM AND COMPONENT RULES
- Layout principles: measured grid, generous whitespace, asymmetrical compositions, controlled reading widths.
- Centralised CSS tokens for colors, spacing, typography, radii, shadows, z-indexes.

---

### PAGE 11-12 / SECTION SPECIFICATIONS & CTA DESTINATIONS
- Data-driven URLs in one configuration file:
  - Official Portal: `https://techfest.org`
  - Competitions: `https://techfest.org/competitions`
  - Workshops: `https://techfest.org/workshops`
  - Exhibitions: `https://techfest.org/exhibitions`
  - Lectures: `https://techfest.org/lectures`
  - CA Portal: `https://ca.techfest.org`
  - CA Task: `https://ca.techfest.org/tasks/web-development`
- Disclaimer: Independent College Ambassador concept page for Techfest IIT Bombay.

---

### PAGE 13-14 / INTERACTION, MOTION, AND SCROLL CHOREOGRAPHY
- GSAP + ScrollTrigger for scroll-linked sequences.
- No scroll hijacking: browser owns native vertical scrolling.
- Pointer subtle parallax, touch-friendly fallback, respect `prefers-reduced-motion`.

---

### PAGE 15 / RESPONSIVE DESIGN SPECIFICATION
- Viewport target matrix:
  - 1440 × 900 (Desktop hero composition)
  - 1280 × 800 (Laptop layout)
  - 1024 × 768 (Compact desktop / landscape tablet)
  - 768 × 1024 (Portrait tablet)
  - 430 × 932 (Large phone)
  - 390 × 844 (Common phone)
  - 375 × 812 (Small phone)
  - 320 × 700 (Minimum-width stress test)

---

### PAGE 16-17 / TECHNICAL STACK & DEPENDENCIES
- React + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- GSAP + ScrollTrigger
- CSS Modules / Custom Tokens
- Playwright + Unit testing
- ESLint + TypeScript strict checks

---

### PAGE 18-19 / ARCHITECTURE & 3D SCENE SPECIFICATION
- Astrolabe / Orrery 3D sculpture: central globe, nested orbital rings, calibrated brass/bronze markings, controlled motion.
- Single shared R3F canvas, clamped DPR, performance fallbacks, WebGL context loss handling.

---

### PAGE 20-25 / HARNESS, REUSE, TESTING, GITHUB, AND SUBMISSION
- Repository: `JNikhil11/3D-CA-IITB` (Display title: `3D CA-IITB`)
- Defect log at `QA/DEFECT_LOG.md`
- Design references at `docs/design-references.md`
- Third-party notices at `THIRD_PARTY_NOTICES.md`
