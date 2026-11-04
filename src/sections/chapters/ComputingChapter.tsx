/**
 * ComputingChapter — Chapter 03: Cognitive Computing & Intelligence
 *
 * Camera dives into the radiant stellar core and synaptic neural lattice.
 * Pure negative space editorial layout.
 */
import React from 'react';
import { COMPETITIONS, LEARNING_OFFERINGS, TECHFEST_CONFIG } from '../../content/techfest';
import { LeaderLine } from '../../components/LeaderLine';
import ed from '../../styles/editorial.module.css';

interface ComputingChapterProps {
  active: boolean;
}

export const ComputingChapter: React.FC<ComputingChapterProps> = ({ active }) => {
  const icc = COMPETITIONS.find((c) => c.id === 'icc');
  const genai = LEARNING_OFFERINGS.find((l) => l.id === 'genai-workshop');

  return (
    <div
      className={`${ed.chapterStageOverlay} ${ed.leftOverlay} ${active ? ed.chapterActive : ''}`}
      aria-hidden={!active}
    >
      {/* SVG Leader line pointing directly into the incandescent neural core */}
      <LeaderLine sourceX={34} sourceY={48} visible={active} />

      <div className={ed.editorialBlock}>
        <span className={ed.monumentalNumeral}>03</span>

        <div className={ed.folioStamp}>
          Radiant Stellar Core &amp; Synaptic Neural Lattice
        </div>

        <span className={ed.headlineSub}>Quadrant III · Algorithmic Synthesis</span>
        <h2 className={ed.displayTitle}>
          Cognitive Computing &amp; Intelligence
        </h2>

        <div className={ed.editorialHairline} />

        <p className={ed.editorialBody}>
          At the burning nucleus of the Atlas sits pure computation:
          interconnected neural tensor lattices, real-time reasoning pipelines,
          and algorithmic architectures scaling intelligence across physical systems.
        </p>

        <div className={ed.aspectStream}>
          <span>Transformer Models</span>
          <span>Edge Intelligence</span>
          <span>Quantum Waveguides</span>
          <span>Competitive Algorithms</span>
        </div>

        <ul className={ed.telemetryList}>
          {icc && (
            <li>
              <span>
                <strong className={ed.telemetryKey}>{icc.name}</strong>
                {' — '}{icc.summary.split('.')[0]}.
              </span>
            </li>
          )}
          {genai && (
            <li>
              <span>
                <strong className={ed.telemetryKey}>[{genai.type}] {genai.title}</strong>
                {' — '}{genai.summary.split('.')[0]}.
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
            Software Competitions ↗
          </a>
          <a
            href={TECHFEST_CONFIG.urls.workshops}
            target="_blank"
            rel="noopener noreferrer"
            className={ed.btnSecondary}
          >
            AI Workshops ↗
          </a>
        </div>
      </div>
    </div>
  );
};
