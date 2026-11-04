import React from 'react';
import { FESTIVAL_ATMOSPHERE } from '../content/techfest';
import styles from './AtmosphereSection.module.css';

export const AtmosphereSection: React.FC = () => {
  return (
    <section className={styles.atmosphere} id="atmosphere" aria-label="Chapter 06: Festival Atmosphere">
      <div className={`container ${styles.atmosContainer}`}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className="calibration-badge">CHAPTER 06 · FESTIVAL REALM</div>
          <h2 className={styles.title}>The Living Campus of Powai</h2>
          <p className={styles.lead}>
            When dusk falls over Powai Lake, Techfest transforms from intense technical trial into an awe-inspiring festival of lasers, interactive installations, and cultural energy.
          </p>
        </div>

        {/* Atmosphere Feature Grid */}
        <div className={styles.atmosphereGrid}>
          {FESTIVAL_ATMOSPHERE.map((item, idx) => (
            <div key={item.id} className={styles.atmosCard}>
              <div className={styles.cardHeader}>
                <div className={styles.numberStamp}>
                  <span>ZONE 0{idx + 1}</span>
                </div>
                <h3 className={styles.atmosTitle}>{item.title}</h3>
                <span className={styles.atmosSubtitle}>{item.subtitle}</span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.atmosDesc}>{item.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.highlightPill}>✦ {item.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Campus Map & Venue Information */}
        <div className={styles.venueBanner}>
          <div className={styles.venueLeft}>
            <span className={styles.venueTag}>OFFICIAL LOCATION</span>
            <h4 className={styles.venueHeadline}>Indian Institute of Technology Bombay</h4>
            <p className={styles.venueAddress}>
              Main Gate Road, Powai, Mumbai, Maharashtra 400076, India
            </p>
          </div>
          <div className={styles.venueRight}>
            <div className={styles.coordBox}>
              <span className={styles.coordTitle}>ASTRONOMICAL COORDINATES</span>
              <span className={styles.coordNumbers}>19° 08' 00" N · 72° 54' 48" E</span>
              <span className={styles.coordElevation}>Elevation: 50m above mean sea level</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
