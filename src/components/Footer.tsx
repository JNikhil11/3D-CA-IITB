import React from 'react';
import { TECHFEST_CONFIG } from '../content/techfest';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="colophon">
      <div className={`container ${styles.footerInner}`}>
        {/* Top Editorial Row */}
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <div className={styles.brandLockup}>
              <span className={styles.brandStar}>✦</span>
              <span className={styles.brandName}>TECHFEST 30</span>
            </div>
            <p className={styles.themeTagline}>
              {TECHFEST_CONFIG.theme} — {TECHFEST_CONFIG.themeSubtitle}
            </p>
            <p className={styles.locationMeta}>
              {TECHFEST_CONFIG.dates} · {TECHFEST_CONFIG.venue}
            </p>
          </div>

          <div className={styles.navBlock}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Official Channels</h4>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href={TECHFEST_CONFIG.urls.officialSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    Official Portal ↗
                  </a>
                </li>
                <li>
                  <a
                    href={TECHFEST_CONFIG.urls.competitions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    Flagship Competitions ↗
                  </a>
                </li>
                <li>
                  <a
                    href={TECHFEST_CONFIG.urls.workshops}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    Campus Workshops ↗
                  </a>
                </li>
                <li>
                  <a
                    href={TECHFEST_CONFIG.urls.collegeAmbassador}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    CA Ambassador Hub ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Direct Connections</h4>
              <ul className={styles.linkList}>
                {TECHFEST_CONFIG.socials.map((soc) => (
                  <li key={soc.label}>
                    <a
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkItem}
                    >
                      {soc.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.hairline} />

        {/* Mandatory Independent Concept Disclosure */}
        <div className={styles.bottomRow}>
          <div className={styles.disclaimerBox}>
            <span className={styles.disclaimerLabel}>Official Attribution & Status Note</span>
            <p className={styles.disclaimerText}>{TECHFEST_CONFIG.disclaimer}</p>
          </div>

          <div className={styles.copyrightBlock}>
            <p className={styles.authorMeta}>
              Engineered by <a href="https://github.com/JNikhil11" target="_blank" rel="noopener noreferrer">JNikhil11</a> · Repository: <a href="https://github.com/JNikhil11/3D-CA-IITB" target="_blank" rel="noopener noreferrer">3D-CA-IITB</a>
            </p>
            <p className={styles.yearMeta}>© 2026 Techfest, IIT Bombay. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
