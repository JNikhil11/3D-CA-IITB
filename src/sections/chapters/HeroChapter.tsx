/**
 * HeroChapter — Opening panel: The Aether Engine
 * Renders in a translucent Renaissance vellum card on the left side
 * over the full-bleed 3D celestial temple engine.
 */
import React from 'react';
import { TECHFEST_CONFIG } from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

interface HeroChapterProps {
  onExploreClick: () => void;
}

export const HeroChapter: React.FC<HeroChapterProps> = ({ onExploreClick }) => (
  <div>
    <p className={ed.metaCoords}>19.1334° N, 72.9133° E · Powai, Mumbai</p>

    <div className={ed.calibBadge}>
      {TECHFEST_CONFIG.edition} · Asia's Largest Science Festival
    </div>

    <span className={ed.headlineSub}>The Living Atlas</span>
    <h1 className={ed.headlineVellum} style={{ marginBottom: '0.25rem' }}>
      {TECHFEST_CONFIG.theme}
    </h1>

    <div className={ed.goldRule} />

    <p className={ed.bodyVellum}>{TECHFEST_CONFIG.narrativeLead}</p>

    <div className={ed.datesBadge}>
      ✦ {TECHFEST_CONFIG.dates}
    </div>

    <div className={ed.btnRow}>
      <button
        type="button"
        onClick={onExploreClick}
        className={ed.btnPrimary}
      >
        <span>Enter the Atlas</span>
        <span aria-hidden="true">↓</span>
      </button>

      <a
        href={TECHFEST_CONFIG.urls.officialSite}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        techfest.org ↗
      </a>
    </div>
  </div>
);
