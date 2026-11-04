/**
 * FestivalChapter — Chapter 03: The Techfest Experience
 * Right-side panel: festival atmosphere, campus grounds, spectacles.
 */
import React from 'react';
import {
  FESTIVAL_ATMOSPHERE,
  LEARNING_OFFERINGS,
  TECHFEST_CONFIG,
} from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

export const FestivalChapter: React.FC = () => (
  <div>
    <div className={ed.folioEyebrow}>Chapter 03 · Powai Convergence</div>

    <span className={ed.headlineSub}>The Festival</span>
    <h2 className={ed.headlineVellum}>
      The Techfest Experience
    </h2>

    <div className={ed.goldRule} />

    <p className={ed.bodyVellum}>
      Asia's Largest Science &amp; Technology Festival. Three days of relentless discovery across the
      green 500-acre campus of IIT Bombay. Dynamic open-air arenas, immersive exhibitions,
      keynote discourses, and evening spectacles that redefine what a celebration of science can be.
    </p>

    {/* Archival Atmosphere Folio (Replaces generic cards) */}
    <div className={ed.atmosphereFolio}>
      {FESTIVAL_ATMOSPHERE.map((item) => (
        <div key={item.id} className={ed.atmosphereEntry}>
          <div className={ed.atmosphereTitle}>{item.title}</div>
          <div className={ed.atmosphereDesc}>{item.description}</div>
        </div>
      ))}
    </div>

    <div className={ed.brassHairline} />

    <p className={ed.headlineSub} style={{ marginBottom: '0.4rem' }}>
      Academic &amp; Research Tracks:
    </p>
    <ul className={ed.compList}>
      {LEARNING_OFFERINGS.slice(0, 3).map((l) => (
        <li key={l.id}>
          <span>
            <span style={{ color: '#8C6F2D', fontWeight: 600, fontSize: '0.72rem' }}>
              [{l.type.toUpperCase()}]
            </span>{' '}
            <strong className={ed.compName}>{l.title}</strong>
          </span>
        </li>
      ))}
    </ul>

    <div className={ed.btnRow}>
      <a
        href={TECHFEST_CONFIG.urls.exhibitions}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        Exhibitions ↗
      </a>
      <a
        href={TECHFEST_CONFIG.urls.lectures}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        Lectures ↗
      </a>
    </div>
  </div>
);
