import React from 'react';
import { TECHFEST_CONFIG } from '../content/techfest';
import styles from './FinaleSection.module.css';

export const FinaleSection: React.FC = () => {
  return (
    <section className={styles.finale} id="finale" aria-label="Chapter 07: Final Invitation">
      <div className={`container ${styles.finaleContainer}`}>
        <div className={styles.innerCard}>
          <div className="calibration-badge">CHAPTER 07 · EPILOGUE & PARTICIPATION</div>

          <h2 className={styles.headline}>Your Coordinates in the Atlas Await</h2>

          <p className={styles.leadText}>
            Whether designing high-speed autonomous rovers, coding distributed systems, or engaging with global scientific leaders—Techfest 30 welcomes you to Asia’s largest festival of innovation.
          </p>

          <div className={styles.festivalStamp}>
            <div className={styles.stampItem}>
              <span className={styles.stampLabel}>FESTIVAL DATES</span>
              <span className={styles.stampVal}>{TECHFEST_CONFIG.dates}</span>
            </div>
            <div className={styles.stampDivider} aria-hidden="true">✦</div>
            <div className={styles.stampItem}>
              <span className={styles.stampLabel}>ACCOMMODATION</span>
              <span className={styles.stampVal}>{TECHFEST_CONFIG.accommodationDates}</span>
            </div>
            <div className={styles.stampDivider} aria-hidden="true">✦</div>
            <div className={styles.stampItem}>
              <span className={styles.stampLabel}>LOCATION</span>
              <span className={styles.stampVal}>IIT Bombay, Powai</span>
            </div>
          </div>

          <div className={styles.actionGroup}>
            <a
              href={TECHFEST_CONFIG.urls.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryActionBtn}
            >
              <span>Access Official Techfest Portal</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </a>

            <a
              href={TECHFEST_CONFIG.urls.collegeAmbassador}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryActionBtn}
            >
              <span>College Ambassador Hub</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.subtextBlock}>
            <p className={styles.subtext}>
              All registrations, competition entries, and pass bookings are governed exclusively through verified official Techfest channels at{' '}
              <a href={TECHFEST_CONFIG.urls.officialSite} target="_blank" rel="noopener noreferrer">
                techfest.org
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
