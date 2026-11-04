/**
 * FinaleChapter — Final Chapter: Enter Techfest
 * Centre-panel with warm parchment treatment and primary registration CTA.
 */
import React from 'react';
import { TECHFEST_CONFIG } from '../../content/techfest';
import ed from '../../styles/editorial.module.css';

export const FinaleChapter: React.FC = () => (
  <div style={{ textAlign: 'center' }}>
    <div className={ed.calibBadge} style={{ justifyContent: 'center' }}>
      Final Chapter · The Portal Opens
    </div>

    <span className={ed.headlineSub} style={{ color: '#8C6F2D' }}>
      {TECHFEST_CONFIG.institution}
    </span>
    <h2 className={ed.headlineLight}>
      Enter Techfest 30
    </h2>

    <div
      className={ed.goldRule}
      style={{ margin: '1.25rem auto', background: '#B48E3C' }}
    />

    <p className={ed.bodyLight}>
      {TECHFEST_CONFIG.themeSubtitle}. Join scholars, engineers, and
      innovators from across the nation at IIT Bombay for three extraordinary days of science,
      competition, and wonder.
    </p>

    <div className={ed.datesBadge} style={{ justifyContent: 'center' }}>
      ✦ {TECHFEST_CONFIG.dates} · {TECHFEST_CONFIG.institution}
    </div>

    <div className={ed.btnRow} style={{ justifyContent: 'center' }}>
      <a
        href={TECHFEST_CONFIG.urls.officialSite}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnPrimary}
        style={{ padding: '0.9rem 2.5rem', fontSize: '0.85rem' }}
      >
        Register at techfest.org ↗
      </a>
    </div>

    <div className={ed.btnRow} style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
      <a
        href={TECHFEST_CONFIG.urls.collegeAmbassador}
        target="_blank"
        rel="noopener noreferrer"
        className={ed.btnSecondary}
      >
        College Ambassador Programme ↗
      </a>
    </div>

    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        letterSpacing: '0.12em',
        color: '#6B685C',
        marginTop: '1.75rem',
        lineHeight: 1.7,
      }}
    >
      {TECHFEST_CONFIG.disclaimer}
    </p>
  </div>
);
