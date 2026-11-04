/**
 * DiscoveryChapter — Chapter 00: The Discovery
 *
 * Monumental establishing view of the complete Aether Temple Engine.
 * Pure negative space editorial typography in the left field.
 */
import React from 'react';
import { TECHFEST_CONFIG } from '../../content/techfest';
import { LeaderLine } from '../../components/LeaderLine';
import ed from '../../styles/editorial.module.css';

interface DiscoveryChapterProps {
  active: boolean;
  onExploreClick: () => void;
}

export const DiscoveryChapter: React.FC<DiscoveryChapterProps> = ({
  active,
  onExploreClick,
}) => (
  <div
    className={`${ed.chapterStageOverlay} ${ed.leftOverlay} ${active ? ed.chapterActive : ''}`}
    aria-hidden={!active}
  >
    {/* Dynamic hairline leader line linking typography to 3D central core */}
    <LeaderLine sourceX={32} sourceY={48} visible={active} />

    <div className={ed.editorialBlock}>
      <span className={ed.monumentalNumeral}>30</span>

      <div className={ed.folioStamp}>
        19.1334° N, 72.9133° E · Powai, Mumbai · {TECHFEST_CONFIG.edition}
      </div>

      <span className={ed.headlineSub}>The Living Atlas</span>
      <h1 className={ed.displayTitle}>{TECHFEST_CONFIG.theme}</h1>

      <div className={ed.editorialHairline} />

      <p className={ed.editorialBody}>{TECHFEST_CONFIG.narrativeLead}</p>

      <div className={ed.datesStamp}>
        ✦ {TECHFEST_CONFIG.dates} · IIT Bombay
      </div>

      <div className={ed.btnRow}>
        <button
          type="button"
          onClick={onExploreClick}
          className={ed.btnPrimary}
        >
          <span>Explore the Atlas</span>
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
  </div>
);
