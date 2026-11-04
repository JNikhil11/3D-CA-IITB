import React from 'react';
import { COMPETITIONS, TECHFEST_CONFIG } from '../content/techfest';
import styles from './CompetitionsSection.module.css';

export const CompetitionsSection: React.FC = () => {
  return (
    <section className={styles.competitions} id="competitions" aria-label="Chapter 04: Flagship Competitions">
      <div className={`container ${styles.compContainer}`}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className="calibration-badge">CHAPTER 04 · COMPETITIONS</div>
          <h2 className={styles.title}>The Arenas of Technical Combat & Mastery</h2>
          <p className={styles.lead}>
            Verified premier competitive tracks where engineering precision, algorithmic speed, and physical resilience are tested before judges and international peers.
          </p>
        </div>

        {/* Competition Cards Grid */}
        <div className={styles.cardsGrid}>
          {COMPETITIONS.map((comp, idx) => (
            <article key={comp.id} className={styles.compCard}>
              <div className={styles.cardHeader}>
                <div className={styles.metaRow}>
                  <span className={styles.cardIndex}>№ {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  {comp.featuredTag && (
                    <span className={styles.featuredBadge}>{comp.featuredTag}</span>
                  )}
                </div>
                <span className={styles.categoryBadge}>{comp.category}</span>
                <h3 className={styles.cardTitle}>{comp.name}</h3>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.summaryText}>{comp.summary}</p>
                <p className={styles.detailsText}>{comp.details}</p>
              </div>

              <div className={styles.cardFooter}>
                <a
                  href={comp.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.eventLink}
                >
                  <span>Official Event Track</span>
                  <span className={styles.linkArrow} aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* External Portal Callout Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomBarInfo}>
            <span className={styles.bottomBarBadge}>COMPLETE ROSTER</span>
            <p className={styles.bottomBarText}>
              Over 20+ additional regional and international competitions operate during Techfest 30.
            </p>
          </div>
          <a
            href={TECHFEST_CONFIG.urls.competitions}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.allCompetitionsBtn}
          >
            <span>View All Competitions on Techfest.org</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
