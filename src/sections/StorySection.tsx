import React from 'react';
import styles from './StorySection.module.css';

export const StorySection: React.FC = () => {
  return (
    <section className={styles.story} id="story" aria-label="Chapter 02: The Revival">
      <div className={styles.storyContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className="calibration-badge">CHAPTER 02 · THE REVIVAL</div>
          <h2 className={styles.title}>The Renaissance of Pure Curiosity</h2>
          <p className={styles.subtitle}>
            In an era where technology often obscures its origins, Techfest 30 returns to the core impulse that drives civilization: human curiosity testing the boundary of what is known.
          </p>
        </div>

        {/* Narrative Split Column Grid */}
        <div className={styles.grid}>
          {/* Left Column: Philosophical Exposition */}
          <div className={styles.narrativeCol}>
            <div className={styles.leadBlock}>
              <span className={styles.dropCap}>W</span>
              <p className={styles.bodyParagraph}>
                hen Renaissance scholars held the astrolabe to the night sky, they were not merely measuring angles of stars—they were projecting human imagination into the cosmos. Five centuries later, on the verdant campus of IIT Bombay, that same spirit is reborn in autonomous machines, neural models, and planetary engineering.
              </p>
            </div>

            <p className={styles.bodyParagraph}>
              Techfest is not an isolated academic conference; it is an annual gathering of makers, tinkerers, and researchers. Over three days every December, lecture halls host Nobel Laureates while outdoor arenas roar with pneumatic combat machines and algorithmic flight trials.
            </p>

            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                “Observation becomes a question. A question becomes an experiment. Experiments become inventions, and inventions become shared human discovery.”
              </p>
              <span className={styles.quoteSource}>— Techfest 30 Curatorial Statement</span>
            </div>
          </div>

          {/* Right Column: Verified Metric Marginalia & Architectural Cards */}
          <div className={styles.metricsCol}>
            <div className={styles.metricCard}>
              <span className={styles.metricNumber}>30</span>
              <span className={styles.metricLabel}>Editions of Continuous Innovation</span>
              <p className={styles.metricDesc}>
                Established at IIT Bombay in 1998, growing from a regional exhibition into Asia’s largest festival of science and engineering.
              </p>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricNumber}>175,000+</span>
              <span className={styles.metricLabel}>Annual Festival Attendees</span>
              <p className={styles.metricDesc}>
                Students, researchers, professors, and tech enthusiasts converging from across the subcontinent and international institutions.
              </p>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricNumber}>25+</span>
              <span className={styles.metricLabel}>Participating Nations & Delegations</span>
              <p className={styles.metricDesc}>
                Global competitors participating in International Robowars, robotics challenges, and international technology exhibitions.
              </p>
            </div>

            <div className={styles.actionNote}>
              <span className={styles.actionNoteLabel}>NEXT MOVEMENT:</span>
              <a href="#atlas" className={styles.actionLink}>
                <span>Explore the 4 Atlas Domains</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
