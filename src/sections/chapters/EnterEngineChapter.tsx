/**
 * EnterEngineChapter — Chapter 01: Enter the Engine
 * Right-side panel as camera zooms into the mechanical structure.
 */
import React from 'react';
import { TECHFEST_CONFIG } from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

export const EnterEngineChapter: React.FC = () => (
  <div>
    <div className={ed.chapterBadge}>Chapter 01</div>

    <span className={ed.headlineSub}>Enter the Engine</span>
    <h2 className={ed.headlineDark}>
      A Renaissance of Curiosity
    </h2>

    <div className={ed.goldRule} />

    <p className={ed.bodyDark}>
      The armillary sphere was the Renaissance scholar's window to the cosmos —
      a brass lattice of celestial circles that revealed the architecture of
      the universe through pure mechanical logic.
    </p>

    <p className={ed.bodyDark}>
      Techfest 30 revives this spirit. The Aether Engine is not merely a symbol —
      it is a working model of curiosity itself: orbital rings of intellect,
      each axis revealing a new dimension of human knowledge.
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
