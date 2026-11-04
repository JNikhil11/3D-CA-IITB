/**
 * EnterEngineChapter — Chapter 01: Enter the Engine
 * Translucent vellum card on the right side as camera zooms into the mechanical structure.
 */
import React from 'react';
import { TECHFEST_CONFIG } from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

export const EnterEngineChapter: React.FC = () => (
  <div>
    <div className={ed.folioEyebrow}>Chapter 01 · Colurus Aequinoctialis</div>

    <span className={ed.headlineSub}>Enter the Engine</span>
    <h2 className={ed.headlineVellum}>
      A Renaissance of Curiosity
    </h2>

    <div className={ed.goldRule} />

    <p className={ed.bodyVellum}>
      The armillary sphere was the Renaissance scholar's window to the cosmos —
      an intricate brass lattice of celestial rings and vernier graduations that
      charted the architecture of the heavens through mechanical logic.
    </p>

    <p className={ed.bodyVellum}>
      Techfest 30 revives this timeless mastery. The Aether Engine is a living
      monument of scientific discovery: concentric orbital rings, precision
      yokes, and optical sighting instruments that open into modern engineering realms.
    </p>

    <div className={ed.datesBadge}>
      ✦ {TECHFEST_CONFIG.institution} · {TECHFEST_CONFIG.dates}
    </div>

    <div className={ed.btnRow}>
      <a
        href={TECHFEST_CONFIG.urls.competitions}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        View Competitions ↗
      </a>
    </div>
  </div>
);
