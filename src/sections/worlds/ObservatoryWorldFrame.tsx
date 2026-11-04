/**
 * ObservatoryWorldFrame.tsx — World 01: The Grand Observatory Frame
 */

import React from 'react';
import { DecorativeGoldFrame } from '../../components/DecorativeGoldFrame';
import { WORLD_DATA } from '../../content/techfest';
import styles from './WorldFrames.module.css';

interface WorldFrameProps {
  active: boolean;
  onExploreClick?: () => void;
}

export const ObservatoryWorldFrame: React.FC<WorldFrameProps> = ({
  active,
  onExploreClick,
}) => {
  const data = WORLD_DATA['observatory'];

  return (
    <DecorativeGoldFrame
      id="world-01-frame"
      worldNumber={data.number}
      badge={data.badge}
      coordinates={data.telemetry.coordinates}
      sector={data.telemetry.sector}
      active={active}
      position="left"
    >
      <h1 className={styles.frameTitle}>{data.title}</h1>
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
        <button
          type="button"
          onClick={onExploreClick}
          className={styles.primaryCta}
        >
          {data.primaryCta.label}
        </button>
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
