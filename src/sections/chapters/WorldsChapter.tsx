/**
 * WorldsChapter — Chapter 02: The World of Engineering
 * Left-side panel as camera orbits to reveal engineering domains.
 */
import React from 'react';
import { DOMAINS, COMPETITIONS, TECHFEST_CONFIG } from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

export const WorldsChapter: React.FC = () => (
  <div>
    <div className={ed.chapterBadge}>Chapter 02</div>

    <span className={ed.headlineSub}>The Four Quadrants</span>
    <h2 className={ed.headlineDark}>
      World of Engineering
    </h2>

    <div className={ed.goldRule} />

    <p className={ed.bodyDark}>
      Four orbital rings of the engine represent four great domains of
      scientific and engineering endeavour. Each world hosts its own
      competitions, workshops, and exhibitions at Techfest 30.
    </p>

    <div className={ed.domainGrid}>
      {DOMAINS.map((d) => (
        <div key={d.id} className={ed.domainPill}>
          <strong>{d.number} · {d.title.split(' & ')[0]}</strong>
          {d.tagline}
        </div>
      ))}
    </div>

    <div className={ed.goldRule} />

    <p className={ed.bodyDark} style={{ marginBottom: '0.5rem' }}>
      Flagship competitions:
    </p>
    <ul className={ed.compList}>
      {COMPETITIONS.slice(0, 4).map((c) => (
        <li key={c.id}>
          <span>
            <strong style={{ color: 'rgba(217,175,86,0.9)' }}>{c.name}</strong>
            {' — '}{c.summary.split('.')[0]}.
          </span>
        </li>
      ))}
    </ul>

    <div className={ed.btnRow}>
      <a
        href={TECHFEST_CONFIG.urls.competitions}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnPrimary}
      >
        All Competitions ↗
      </a>
      <a
        href={TECHFEST_CONFIG.urls.workshops}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        Workshops ↗
      </a>
    </div>
  </div>
);
