/**
 * FestivalChapter — Chapter 03: The Techfest Experience
 * Right-side panel: festival atmosphere, spectacles, workshops.
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
    <div className={ed.chapterBadge}>Chapter 03</div>

    <span className={ed.headlineSub}>The Festival</span>
    <h2 className={ed.headlineDark}>
      The Techfest Experience
    </h2>

    <div className={ed.goldRule} />

    <p className={ed.bodyDark}>
      175,000+ participants. Three days of relentless discovery across the
      green 500-acre campus of IIT Bombay. Workshops, exhibitions, keynotes,
      and spectacles that redefine what a science festival can be.
    </p>

    <div className={ed.atmosphereList}>
      {FESTIVAL_ATMOSPHERE.map((item) => (
        <div key={item.id} className={ed.atmosphereItem}>
          <div className={ed.atmosphereItemTitle}>{item.title}</div>
          <div className={ed.atmosphereItemDesc}>{item.subtitle}</div>
        </div>
      ))}
    </div>

    <div className={ed.goldRule} />

    <p className={ed.bodyDark} style={{ marginBottom: '0.5rem' }}>
      Learning tracks at Techfest 30:
    </p>
    <ul className={ed.compList}>
      {LEARNING_OFFERINGS.slice(0, 3).map((l) => (
        <li key={l.id}>
          <span>
            <span style={{ color: 'rgba(217,175,86,0.75)', fontSize: '0.7rem' }}>
              [{l.type.toUpperCase()}]
            </span>{' '}
            {l.title}
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
