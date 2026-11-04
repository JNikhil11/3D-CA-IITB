import React from 'react';
import { TECHFEST_CONFIG } from '../content/techfest';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onExploreClick: () => void;
  mobile3DStage?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, mobile3DStage }) => {
  return (
    <section className={styles.hero} id="hero" aria-label="Prologue: The Living Atlas">
      <div className={styles.heroContainer}>
        {/* Editorial Marginalia / Metadata Badge */}
        <div className={styles.metaRow}>
          <div className="calibration-badge">
            CHAPTER 01 · {TECHFEST_CONFIG.edition}
          </div>
          <div className={styles.coordinates}>
            <span>19.1334° N, 72.9133° E</span>
            <span className={styles.coordDot}>•</span>
            <span>POWAI, MUMBAI</span>
          </div>
        </div>

        {/* Hero Central Narrative Header */}
        <div className={styles.contentWrap}>
          <div className={styles.editionPill}>
            <span>ASIA'S LARGEST SCIENCE & TECHNOLOGY FESTIVAL</span>
          </div>

          <h1 className={styles.headline}>
            <span className={styles.headlineSub}>THE LIVING ATLAS</span>
            <span className={styles.headlineMain}>{TECHFEST_CONFIG.theme}</span>
          </h1>

          {/* Dedicated Mobile 3D Interactive Stage Slot */}
          {mobile3DStage}

          <p className={styles.narrativeLead}>
            {TECHFEST_CONFIG.narrativeLead}
          </p>

          {/* Action Button Pair */}
          <div className={styles.actionGroup}>
            <button
              type="button"
              onClick={onExploreClick}
              className={styles.primaryBtn}
            >
              <span>Explore The Atlas</span>
              <span className={styles.arrowIcon} aria-hidden="true">↓</span>
            </button>

            <a
              href={TECHFEST_CONFIG.urls.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              <span>Official Techfest Portal</span>
              <span className={styles.arrowIcon} aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Sourced Timeline Marker */}
          <div className={styles.scheduleBadge}>
            <div className={styles.scheduleIcon}>✦</div>
            <div className={styles.scheduleText}>
              <strong>{TECHFEST_CONFIG.dates}</strong>
              <span>IIT Bombay Campus · Accommodation Window Dec 15–19</span>
            </div>
          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <div className={styles.scrollCue}>
          <span className={styles.scrollLabel}>SCROLL TO UNRAVEL ORBITS</span>
          <div className={styles.scrollLine}>
            <span className={styles.scrollDot} />
          </div>
        </div>
      </div>
    </section>
  );
};
