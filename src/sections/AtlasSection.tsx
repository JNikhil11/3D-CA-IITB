import React from 'react';
import { DOMAINS, DomainItem } from '../content/techfest';
import styles from './AtlasSection.module.css';

interface AtlasSectionProps {
  selectedDomain: string;
  onSelectDomain: (domain: DomainItem) => void;
}

export const AtlasSection: React.FC<AtlasSectionProps> = ({
  selectedDomain,
  onSelectDomain,
}) => {
  const currentItem = DOMAINS.find((d) => d.id === selectedDomain) || DOMAINS[0];

  return (
    <section className={styles.atlas} id="atlas" aria-label="Chapter 03: The Atlas of Ideas">
      <div className={styles.atlasContainer}>
        {/* Section Eyebrow & Title */}
        <div className={styles.header}>
          <div className="calibration-badge">CHAPTER 03 · ATLAS OF IDEAS</div>
          <h2 className={styles.title}>The Quadrivium of Modern Engineering</h2>
          <p className={styles.lead}>
            Select any quadrant below to align the celestial armillary rings and examine the technology frontiers curated for Techfest 30.
          </p>
        </div>

        {/* Interactive Quadrant Grid */}
        <div className={styles.quadrantGrid} role="tablist" aria-label="Engineering Domains">
          {DOMAINS.map((domain) => {
            const isSelected = domain.id === currentItem.id;
            return (
              <button
                key={domain.id}
                type="button"
                role="tab"
                aria-selected={isSelected ? 'true' : 'false'}
                aria-controls={`panel-${domain.id}`}
                id={`tab-${domain.id}`}
                className={`${styles.domainTab} ${isSelected ? styles.domainTabActive : ''}`}
                onClick={() => onSelectDomain(domain)}
              >
                <div className={styles.tabHeader}>
                  <span className={styles.tabIndex}>{domain.number}</span>
                  <span className={styles.ringIndicator}>
                    Ring {domain.astrolabeTargetRing + 1}
                  </span>
                </div>
                <h3 className={styles.tabTitle}>{domain.title}</h3>
                <p className={styles.tabTagline}>{domain.tagline}</p>
                <div className={styles.tabFooter}>
                  <span className={styles.statusLabel}>
                    {isSelected ? '● Calibrated Active' : '○ Click to Align'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Sourced Disclosure Panel */}
        <div
          id={`panel-${currentItem.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentItem.id}`}
          className={styles.detailPanel}
        >
          <div className={styles.detailHeader}>
            <div className={styles.detailMeta}>
              <span className={styles.detailRingTag}>
                ORBITAL PLANE {currentItem.astrolabeTargetRing + 1}
              </span>
              <span className={styles.detailDot}>✦</span>
              <span className={styles.detailNumber}>{currentItem.number} OF 04</span>
            </div>
            <h3 className={styles.detailTitle}>{currentItem.title}</h3>
            <p className={styles.detailDescription}>{currentItem.description}</p>
          </div>

          <div className={styles.aspectsGrid}>
            <div className={styles.aspectsCol}>
              <h4 className={styles.aspectsTitle}>Core Engineering Focus Areas</h4>
              <ul className={styles.aspectsList}>
                {currentItem.keyAspects.map((aspect) => (
                  <li key={aspect} className={styles.aspectItem}>
                    <span className={styles.aspectBullet} aria-hidden="true">
                      ◈
                    </span>
                    <span>{aspect}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.panelActionCol}>
              <div className={styles.calloutCard}>
                <span className={styles.calloutLabel}>VERIFIED DESTINATION</span>
                <p className={styles.calloutText}>
                  Explore the full list of official competitions and workshop laboratories scheduled for this domain at Techfest 30.
                </p>
                <a
                  href={currentItem.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.panelLinkBtn}
                >
                  <span>Explore Official {currentItem.number} Track</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
