/**
 * RoboticsChapter — Chapter 01: Robotics & Kinetic Systems
 *
 * Camera swoops down to the lower mechanical drive, rotating gear-train,
 * and high-torque kinematic gimbals. Pure negative space layout.
 */
import React from 'react';
import { COMPETITIONS, TECHFEST_CONFIG } from '../../content/techfest';
import { LeaderLine } from '../../components/LeaderLine';
import ed from '../../styles/editorial.module.css';

interface RoboticsChapterProps {
  active: boolean;
}

export const RoboticsChapter: React.FC<RoboticsChapterProps> = ({ active }) => {
  const robowars = COMPETITIONS.find((c) => c.id === 'robowars');
  const meshmerize = COMPETITIONS.find((c) => c.id === 'meshmerize');

  return (
    <div
      className={`${ed.chapterStageOverlay} ${ed.leftOverlay} ${active ? ed.chapterActive : ''}`}
      aria-hidden={!active}
    >
      {/* SVG Leader line pointing to the lower drive gears and gimbals */}
      <LeaderLine sourceX={34} sourceY={52} visible={active} />

      <div className={ed.editorialBlock}>
        <span className={ed.monumentalNumeral}>01</span>

        <div className={ed.folioStamp}>
          Lower Drive &amp; Kinematic Vernier Mechanism
        </div>

        <span className={ed.headlineSub}>Quadrant I · Mechanical Autonomy</span>
        <h2 className={ed.displayTitle}>
          Robotics &amp; Kinetic Systems
        </h2>

        <div className={ed.editorialHairline} />

        <p className={ed.editorialBody}>
          The lower drive assembly of the Atlas charts physical computation:
          precision gear trains and high-torque articulated gimbals that channel
          mechanical power into autonomous action.
        </p>

        <div className={ed.aspectStream}>
          <span>Combat Robotics</span>
          <span>Kinematic Manipulators</span>
          <span>Autonomous Navigation</span>
          <span>Computer Vision Guidance</span>
        </div>

        <ul className={ed.telemetryList}>
          {robowars && (
            <li>
              <span>
                <strong className={ed.telemetryKey}>{robowars.name}</strong>
                {' — '}{robowars.summary.split('.')[0]}.
              </span>
            </li>
          )}
          {meshmerize && (
            <li>
              <span>
                <strong className={ed.telemetryKey}>{meshmerize.name}</strong>
                {' — '}{meshmerize.summary.split('.')[0]}.
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
            Robotics Arenas ↗
          </a>
        </div>
      </div>
    </div>
  );
};
