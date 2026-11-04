import React from 'react';
import { LEARNING_OFFERINGS, TECHFEST_CONFIG } from '../content/techfest';
import styles from './LearningSection.module.css';

export const LearningSection: React.FC = () => {
  return (
    <section className={styles.learning} id="learning" aria-label="Chapter 05: Discovery & Learning">
      <div className={styles.learningContainer}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className="calibration-badge">CHAPTER 05 · DISCOVERY & DISCOURSE</div>
          <h2 className={styles.title}>Hands-on Labs, World Exhibitions & Keynotes</h2>
          <p className={styles.lead}>
            A curated ecosystem of intellectual exchange: direct lab instruction from industry researchers, interactive prototypes from 25+ nations, and lectures by laureates.
          </p>
        </div>

        {/* Structured List / Editorial Table Layout */}
        <div className={styles.offeringsList}>
          {LEARNING_OFFERINGS.map((item, index) => (
            <div key={item.id} className={styles.offeringRow}>
              <div className={styles.typeCol}>
                <span className={styles.indexNum}>0{index + 1}</span>
                <span
                  className={`${styles.typePill} ${
                    item.type === 'Workshop'
                      ? styles.typeWorkshop
                      : item.type === 'Exhibition'
                      ? styles.typeExhibition
                      : styles.typeLecture
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <div className={styles.mainCol}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <span className={styles.itemFocus}>{item.focus}</span>
                <p className={styles.itemSummary}>{item.summary}</p>
              </div>

              <div className={styles.actionCol}>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailBtn}
                >
                  <span>Explore Track</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Fast Action Row */}
        <div className={styles.footerNote}>
          <p className={styles.noteCopy}>
            Workshops require early seat reservation due to laboratory computer terminal limits.
          </p>
          <a
            href={TECHFEST_CONFIG.urls.workshops}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.workshopHubLink}
          >
            <span>Official Workshop Schedule & Registration</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
