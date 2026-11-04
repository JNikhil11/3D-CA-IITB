/**
 * AerospaceChapter — Chapter 02: Aerospace & Orbital Dynamics
 *
 * Camera sweeps along the 40° observation yoke, collimator optics,
 * and orbital satellite. Pure negative space editorial layout.
 */
import React from 'react';
import { COMPETITIONS, TECHFEST_CONFIG } from '../../content/techfest';
import { LeaderLine } from '../../components/LeaderLine';
import ed from '../../styles/editorial.module.css';

interface AerospaceChapterProps {
  active: boolean;
}

export const AerospaceChapter: React.FC<AerospaceChapterProps> = ({ active }) => {
  const aeromodelling = COMPETITIONS.find((c) => c.id === 'aeromodelling');

  return (
    <div
      className={`${ed.chapterStageOverlay} ${ed.rightOverlay} ${active ? ed.chapterActive : ''}`}
      aria-hidden={!active}
    >
      {/* SVG Leader line pointing to the observation yoke & satellite */}
      <LeaderLine sourceX={66} sourceY={46} visible={active} />

      <div className={ed.editorialBlock}>
        <span className={ed.monumentalNumeral}>02</span>

        <div className={ed.folioStamp}>
          40° Observation Yoke &amp; Orbital Sighting Rings
        </div>

        <span className={ed.headlineSub}>Quadrant II · Celestial Dynamics</span>
        <h2 className={ed.displayTitle}>
          Aerospace &amp; Orbital Dynamics
        </h2>

        <div className={ed.editorialHairline} />

        <p className={ed.editorialBody}>
          The inclined sighting yoke and equatorial latitude rings align into
          celestial trajectory. From aerodynamic glide ratios to interplanetary
          propulsion, engineering conquers atmospheric boundaries.
        </p>

        <div className={ed.aspectStream}>
          <span>Fixed-Wing Aerodynamics</span>
          <span>FPV Maneuvers</span>
          <span>Autonomous Avionics</span>
          <span>Orbital Tracking</span>
        </div>

        <ul className={ed.telemetryList}>
          {aeromodelling && (
            <li>
              <span>
                <strong className={ed.telemetryKey}>{aeromodelling.name}</strong>
                {' — '}{aeromodelling.summary.split('.')[0]}.
              </span>
            </li>
          )}
        </ul>

        <div className={ed.btnRow}>
          <a
            href={TECHFEST_CONFIG.urls.competitions}
            target="_blank"
            rel="noopener noreferrer"
            className={ed.btnPrimary}
          >
            Aerospace Challenges ↗
          </a>
        </div>
      </div>
    </div>
  );
};
