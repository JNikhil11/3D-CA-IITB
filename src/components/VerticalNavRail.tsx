/**
 * VerticalNavRail.tsx — Persistent Vertical World Navigation Rail
 *
 * Provides direct click-to-scrub navigation across the 5 Worlds:
 * 01: The Grand Observatory
 * 02: The Subterranean Engine
 * 03: Engineering Worlds
 * 04: The Techfest Experience
 * 05: The Final Destination
 */

import React, { useState, useEffect } from 'react';
import { subscribeScroll, WORLDS } from '../motion/scrollState';
import styles from './VerticalNavRail.module.css';

interface VerticalNavRailProps {
  onSelectWorld?: (worldIndex: number) => void;
}

export const VerticalNavRail: React.FC<VerticalNavRailProps> = ({
  onSelectWorld,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    return subscribeScroll((state) => {
      setActiveIdx(state.activeWorldIndex);
    });
  }, []);

  const handleWorldClick = (idx: number) => {
    if (onSelectWorld) {
      onSelectWorld(idx);
    } else {
      // Default scrub: find the world target progress and scroll window
      const world = WORLDS[idx];
      const targetProg = (world.range[0] + world.range[1]) * 0.5;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: targetProg * maxScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className={styles.navRail} aria-label="World Navigation Rail">
      <div className={styles.railLine} aria-hidden="true" />
      {WORLDS.map((w, idx) => (
        <button
          key={w.id}
          type="button"
          className={`${styles.navItem} ${idx === activeIdx ? styles.active : ''}`}
          onClick={() => handleWorldClick(idx)}
          aria-label={`Navigate to World ${w.number}: ${w.title}`}
          aria-current={idx === activeIdx ? 'step' : undefined}
        >
          <div className={styles.marker}>{w.number}</div>
          <span className={styles.navLabel}>{w.title}</span>
        </button>
      ))}
    </nav>
  );
};
