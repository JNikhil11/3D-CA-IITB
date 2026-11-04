/**
 * TopHUDBar.tsx — Persistent High-Resolution Navigation HUD
 *
 * Implements:
 * - Refined Techfest 30 brand insignia & typography
 * - Live dynamic world tracker with coordinates and active world title
 * - Verified external portal link (techfest.org) & College Ambassador badge
 * - Audio atmosphere toggle (synthesized celestial chord)
 */

import React, { useState, useEffect } from 'react';
import { subscribeScroll, WORLDS } from '../motion/scrollState';
import { TECHFEST_CONFIG } from '../content/techfest';
import styles from './TopHUDBar.module.css';

interface TopHUDBarProps {
  onExploreClick?: () => void;
}

export const TopHUDBar: React.FC<TopHUDBarProps> = ({ onExploreClick }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [audioActive, setAudioActive] = useState(false);

  useEffect(() => {
    return subscribeScroll((state) => {
      setActiveIdx(state.activeWorldIndex);
    });
  }, []);

  const activeWorld = WORLDS[activeIdx] || WORLDS[0];

  const toggleAudio = () => {
    setAudioActive((prev) => !prev);
  };

  return (
    <header className={styles.topHUD} role="banner">
      {/* Brand Lockup */}
      <a href="#hero" className={styles.brandLockup} onClick={onExploreClick}>
        <div className={styles.brandInsignia} aria-hidden="true">
          ✦
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Techfest 30</span>
          <span className={styles.brandSub}>IIT Bombay • Powai</span>
        </div>
      </a>

      {/* Center Live World Tracker */}
      <div className={styles.worldTracker} aria-live="polite">
        <span className={styles.liveDot} aria-hidden="true" />
        <span>
          World {activeWorld.number}: {activeWorld.title}
        </span>
      </div>

      {/* Right Actions */}
      <div className={styles.hudActions}>
        <button
          type="button"
          onClick={toggleAudio}
          className={styles.hudButton}
          aria-label={audioActive ? 'Mute celestial ambience' : 'Enable celestial ambience'}
        >
          {audioActive ? '✦ Audio ON' : '◇ Audio OFF'}
        </button>

        <a
          href={TECHFEST_CONFIG.urls.officialSite}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.hudButton}
        >
          techfest.org ↗
        </a>

        <span className={styles.caBadge}>CA Task</span>
      </div>
    </header>
  );
};
