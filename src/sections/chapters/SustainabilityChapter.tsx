/**
 * SustainabilityChapter — Chapter 04: Sustainable Earth Systems
 *
 * Camera sweeps across the stepped hexagonal obsidian dais, energy accumulator
 * pylons, and hydraulic ground circuits. Pure negative space editorial layout.
 */
import React from 'react';
import { COMPETITIONS, TECHFEST_CONFIG } from '../../content/techfest';
import { LeaderLine } from '../../components/LeaderLine';
import ed from '../../styles/editorial.module.css';

interface SustainabilityChapterProps {
  active: boolean;
}

export const SustainabilityChapter: React.FC<SustainabilityChapterProps> = ({
  active,
}) => {
  const innovatex = COMPETITIONS.find((c) => c.id === 'innovatex');

  return (
    <div
      className={`${ed.chapterStageOverlay} ${ed.rightOverlay} ${active ? ed.chapterActive : ''}`}
      aria-hidden={!active}
    >
      {/* SVG Leader line pointing to the obsidian dais & capacitor pylons */}
      <LeaderLine sourceX={64} sourceY={50} visible={active} />

      <div className={ed.editorialBlock}>
        <span className={ed.monumentalNumeral}>04</span>

        <div className={ed.folioStamp}>
          Stepped Obsidian Dais &amp; Leyline Capacitor Pylons
        </div>

        <span className={ed.headlineSub}>Quadrant IV · Planetary Equilibrium</span>
        <h2 className={ed.displayTitle}>
          Sustainable Earth Systems
        </h2>

        <div className={ed.editorialHairline} />

        <p className={ed.editorialBody}>
          Anchoring the celestial machine is the earth foundation: closed-loop
          ecological cycles, renewable power generation, and clean technological
          innovations addressing planet-scale sustainability challenges.
        </p>

        <div className={ed.aspectStream}>
          <span>Decarbonized Systems</span>
          <span>Clean Energy Cycles</span>
          <span>Resource Networks</span>
          <span>Smart Power Grids</span>
        </div>

        <ul className={ed.telemetryList}>
          {innovatex && (
            <li>
              <span>
                <strong className={ed.telemetryKey}>{innovatex.name}</strong>
                {' — '}{innovatex.summary.split('.')[0]}.
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
            InnovateX Arena ↗
          </a>
        </div>
      </div>
    </div>
  );
};
