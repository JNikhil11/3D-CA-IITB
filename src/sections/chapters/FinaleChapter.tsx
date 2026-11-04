/**
 * FinaleChapter — Chapter 05: Enter Techfest 30 Grand Finale
 *
 * Camera completes its celestial journey, pulling back to a monumental elevated
 * elevation with vertical sky beacon. Pure negative space center composition.
 */
import React from 'react';
import { TECHFEST_CONFIG, FESTIVAL_ATMOSPHERE } from '../../content/techfest';
import { LeaderLine } from '../../components/LeaderLine';
import ed from '../../styles/editorial.module.css';

interface FinaleChapterProps {
  active: boolean;
}

export const FinaleChapter: React.FC<FinaleChapterProps> = ({ active }) => (
  <div
    className={`${ed.chapterStageOverlay} ${ed.centreOverlay} ${active ? ed.chapterActive : ''}`}
    aria-hidden={!active}
  >
    {/* SVG Leader line pointing to the elevated sky beacon diamond finial */}
    <LeaderLine sourceX={50} sourceY={35} visible={active} />

    <div className={ed.editorialBlock} style={{ maxWidth: '640px', margin: '0 auto' }}>
      <span className={ed.monumentalNumeral}>✦</span>

      <div className={ed.folioStamp} style={{ justifyContent: 'center' }}>
        Final Chapter · The Portal Opens · IIT Bombay
      </div>

      <span className={ed.headlineSub}>{TECHFEST_CONFIG.institution}</span>
      <h2 className={ed.displayTitle}>Enter Techfest 30</h2>

      <div
        className={ed.editorialHairline}
        style={{ margin: '1.15rem auto', maxWidth: '420px' }}
      />

      <p className={ed.editorialBody} style={{ margin: '0 auto 1.25rem' }}>
        {TECHFEST_CONFIG.themeSubtitle}. Join scholars, engineers, and
        innovators from across the globe at IIT Bombay for three extraordinary
        days of science, competition, and wonder.
      </p>

      {/* Atmospheric highlights */}
      <div className={ed.aspectStream} style={{ justifyContent: 'center' }}>
        {FESTIVAL_ATMOSPHERE.map((item) => (
          <span key={item.id}>{item.title}</span>
        ))}
      </div>

      <div className={ed.datesStamp} style={{ justifyContent: 'center' }}>
        ✦ {TECHFEST_CONFIG.dates} · {TECHFEST_CONFIG.institution}
      </div>

      <div className={ed.btnRow} style={{ justifyContent: 'center' }}>
        <a
          href={TECHFEST_CONFIG.urls.officialSite}
          target="_blank"
          rel="noopener noreferrer"
          className={ed.btnPrimary}
          style={{ padding: '0.95rem 2.5rem', fontSize: '0.88rem' }}
        >
          Register at techfest.org ↗
        </a>

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
          letterSpacing: '0.14em',
          color: 'rgba(212, 175, 55, 0.65)',
          marginTop: '1.75rem',
          lineHeight: 1.7,
        }}
      >
        {TECHFEST_CONFIG.disclaimer}
      </p>
    </div>
  </div>
);
