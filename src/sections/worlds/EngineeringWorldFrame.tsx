/**
 * EngineeringWorldFrame.tsx — World 03: Engineering Worlds Frame
 */

import React from 'react';
import { DecorativeGoldFrame } from '../../components/DecorativeGoldFrame';
import { WORLD_DATA } from '../../content/techfest';
import styles from './WorldFrames.module.css';

interface WorldFrameProps {
  active: boolean;
}

export const EngineeringWorldFrame: React.FC<WorldFrameProps> = ({ active }) => {
  const data = WORLD_DATA['engineering-worlds'];

  return (
    <DecorativeGoldFrame
      id="world-03-frame"
      worldNumber={data.number}
      badge={data.badge}
      coordinates={data.telemetry.coordinates}
      sector={data.telemetry.sector}
      active={active}
      position="left"
    >
      <h2 className={styles.frameTitle}>{data.title}</h2>
      <div className={styles.frameSubtitle}>{data.subtitle}</div>
      <p className={styles.frameLead}>{data.leadParagraph}</p>

      <ul className={styles.featureList}>
        {data.keyFeatures.map((feat, idx) => (
          <li key={idx} className={styles.featureItem}>
            <span className={styles.featureBullet} aria-hidden="true">✦</span>
            <div>
              <span className={styles.featureLabel}>{feat.label}: </span>
              <span>{feat.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.ctaGroup}>
        <a
          href={data.primaryCta.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primaryCta}
        >
          {data.primaryCta.label}
        </a>
        {data.secondaryCta && (
          <a
            href={data.secondaryCta.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryCta}
          >
            {data.secondaryCta.label}
          </a>
        )}
      </div>
    </DecorativeGoldFrame>
  );
};
