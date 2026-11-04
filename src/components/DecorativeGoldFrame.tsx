/**
 * DecorativeGoldFrame.tsx — Ornate Brass & Obsidian Information Frame
 *
 * Implements the master visual reference:
 * - Dual-tier gradient brass filigree border (#d4af37, #996515, #f5d77f)
 * - Classical engraved corner brackets (❖)
 * - Engraved brass header badge with stardate / sector coordinates
 * - Dark polished obsidian glass backing (rgba(8, 12, 20, 0.88) + blur(18px))
 * - High-cohesion presentation of verified Techfest information
 */

import React from 'react';
import styles from './DecorativeGoldFrame.module.css';

export interface DecorativeGoldFrameProps {
  worldNumber: string;
  badge: string;
  coordinates?: string;
  sector?: string;
  active: boolean;
  position?: 'left' | 'right' | 'center';
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const DecorativeGoldFrame: React.FC<DecorativeGoldFrameProps> = ({
  worldNumber,
  badge,
  coordinates = '19°08′00″N 72°54′50″E',
  sector = 'POWAI CELESTIAL VAULT',
  active,
  position = 'left',
  children,
  className = '',
  id,
}) => {
  const posClass =
    position === 'right'
      ? styles.posRight
      : position === 'center'
      ? styles.posCenter
      : styles.posLeft;

  return (
    <aside
      id={id}
      className={`${styles.frameContainer} ${posClass} ${
        active ? styles.active : ''
      } ${className}`}
      aria-hidden={!active}
    >
      <div className={styles.outerFrame}>
        <div className={styles.innerChamber}>
          {/* Ornate Corner Brackets (❖) */}
          <span className={`${styles.cornerBracket} ${styles.cornerTL}`}>❖</span>
          <span className={`${styles.cornerBracket} ${styles.cornerTR}`}>❖</span>
          <span className={`${styles.cornerBracket} ${styles.cornerBL}`}>❖</span>
          <span className={`${styles.cornerBracket} ${styles.cornerBR}`}>❖</span>

          {/* Engraved Header Plaque */}
          <div className={styles.headerPlaque}>
            <span className={styles.badgeTag}>{badge}</span>
            <span className={styles.worldNumber}>№ {worldNumber}</span>
          </div>

          {/* Main Editorial Content */}
          <div className={styles.bodyContent}>{children}</div>

          {/* Technical Telemetry Footer */}
          <div className={styles.telemetryFooter}>
            <span className={styles.telemetryCoordinates}>{coordinates}</span>
            <span className={styles.telemetrySector}>{sector}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
