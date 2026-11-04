/**
 * InitialRevealCurtain.tsx — Cinematic Initial Loading & Reveal Screen
 *
 * Implements the mandatory 1.7-second minimum gate:
 * - revealTime = Math.max(startTime + 1700ms, essentialAssetsReadyTime)
 * - Calibrating celestial instruments animation with authentic Techfest identity
 * - Eliminates FOUC, canvas pop-in, model pop-in, and background flashes
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from './InitialRevealCurtain.module.css';

export interface InitialRevealCurtainProps {
  isReady: boolean;
  loadProgress: number;
  onExited?: () => void;
}

export const InitialRevealCurtain: React.FC<InitialRevealCurtainProps> = ({
  isReady,
  loadProgress,
  onExited,
}) => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [hasExited, setHasExited] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Enforce 1.7-second minimum gate
  useEffect(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, 1700 - elapsed);

    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, remaining);

    // Safety timeout: unlock after 3800ms regardless to prevent hang
    const safetyTimer = setTimeout(() => {
      setMinTimeElapsed(true);
      setShouldHide(true);
    }, 3800);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  // When both the 1.7s minimum gate has passed and assets/first frame are confirmed ready
  useEffect(() => {
    if (minTimeElapsed && isReady) {
      setShouldHide(true);
    }
  }, [minTimeElapsed, isReady]);

  // Handle transition completion
  useEffect(() => {
    if (shouldHide) {
      const exitTimer = setTimeout(() => {
        setHasExited(true);
        if (onExited) onExited();
      }, 900); // 850ms transition + 50ms buffer
      return () => clearTimeout(exitTimer);
    }
  }, [shouldHide, onExited]);

  if (hasExited) {
    return null;
  }

  // Smooth visual progress clamp
  const displayProgress = Math.min(100, Math.max(12, Math.round(loadProgress)));

  return (
    <div
      className={`${styles.curtainRoot} ${shouldHide ? styles.curtainHidden : ''}`}
      aria-hidden={shouldHide}
      aria-busy={!shouldHide}
    >
      <div className={styles.curtainAura} />

      {/* Astrolabe concentric mechanical rings */}
      <div className={styles.astrolabeEmblem} aria-hidden="true">
        <div className={styles.outerRing} />
        <div className={styles.middleRing} />
        <div className={styles.innerRing} />
        <div className={styles.coreGlow} />
      </div>

      {/* Brand Identity */}
      <div className={styles.brandEyebrow}>Techfest 30 · IIT Bombay</div>
      <h1 className={styles.brandTitle}>The Living Atlas</h1>
      <div className={styles.brandSubtitle}>An Aetherial Renaissance</div>

      {/* Calibration Indicator */}
      <div
        className={styles.indicatorWrapper}
        role="status"
        aria-live="polite"
        aria-label="Calibrating Celestial Instruments"
      >
        <div className={styles.indicatorBarTrack}>
          <div
            className={styles.indicatorBarFill}
            style={{ width: `${displayProgress}%` }}
          />
        </div>
        <div className={styles.indicatorStatusRow}>
          <span className={styles.indicatorStatusText}>
            {displayProgress < 50
              ? 'Calibrating Optics…'
              : displayProgress < 90
              ? 'Warming Shaders…'
              : 'Harmonizing Spheres…'}
          </span>
          <span>{displayProgress}%</span>
        </div>
      </div>

      <div className={styles.coordinatesAnnotation}>
        19.1334° N, 72.9133° E · Powai, Mumbai · Dec 16–18, 2026
      </div>
    </div>
  );
};
