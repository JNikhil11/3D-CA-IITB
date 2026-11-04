import React from 'react';
import styles from './AstrolabeFallback.module.css';

interface AstrolabeFallbackProps {
  reducedMotion?: boolean;
}

export const AstrolabeFallback: React.FC<AstrolabeFallbackProps> = ({ reducedMotion = false }) => {
  return (
    <div
      className={styles.fallbackContainer}
      role="img"
      aria-label="Engraved Renaissance Astrolabe and Celestial Armillary Sculpture"
    >
      <svg
        viewBox="0 0 500 500"
        className={`${styles.svg} ${reducedMotion ? styles.static : styles.animated}`}
      >
        <defs>
          <radialGradient id="astrolabeCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D65D40" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#D9AF56" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#344FC1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C372" />
            <stop offset="50%" stopColor="#D9AF56" />
            <stop offset="100%" stopColor="#9C7A2E" />
          </linearGradient>
        </defs>

        {/* Ambient celestial core aura */}
        <circle cx="250" cy="250" r="140" fill="url(#astrolabeCoreGlow)" />

        {/* 1. Outer Meridian Ring */}
        <g className={styles.outerRing}>
          <circle
            cx="250"
            cy="250"
            r="210"
            fill="none"
            stroke="url(#brassGrad)"
            strokeWidth="3.5"
          />
          <circle
            cx="250"
            cy="250"
            r="202"
            fill="none"
            stroke="#272721"
            strokeWidth="1"
            strokeDasharray="2, 6"
          />
          <circle
            cx="250"
            cy="250"
            r="218"
            fill="none"
            stroke="#272721"
            strokeWidth="1"
            opacity="0.4"
          />
        </g>

        {/* 2. Ecliptic / Zodiac Ring (tilted ellipse) */}
        <g className={styles.eclipticRing}>
          <ellipse
            cx="250"
            cy="250"
            rx="180"
            ry="90"
            fill="none"
            stroke="#D9AF56"
            strokeWidth="2.5"
            transform="rotate(-23.5 250 250)"
          />
          {/* Zodiac node points */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <circle
              key={deg}
              cx={250 + 180 * Math.cos((deg * Math.PI) / 180)}
              cy={250 + 90 * Math.sin((deg * Math.PI) / 180)}
              r="3.5"
              fill="#D65D40"
              transform="rotate(-23.5 250 250)"
            />
          ))}
        </g>

        {/* 3. Equinoctial Ring */}
        <g className={styles.equinoxRing}>
          <circle
            cx="250"
            cy="250"
            r="150"
            fill="none"
            stroke="#3A3226"
            strokeWidth="2"
          />
          <circle
            cx="250"
            cy="250"
            r="142"
            fill="none"
            stroke="#D9AF56"
            strokeWidth="1"
            strokeDasharray="3, 5"
          />
        </g>

        {/* 4. Inner Celestial Coordinates */}
        <g className={styles.innerCage}>
          <ellipse
            cx="250"
            cy="250"
            rx="75"
            ry="110"
            fill="none"
            stroke="#344FC1"
            strokeWidth="1.5"
            opacity="0.75"
          />
          <circle cx="250" cy="250" r="75" fill="none" stroke="#272721" strokeWidth="1" opacity="0.6" />
        </g>

        {/* 5. Alidade (Pointer Needle) */}
        <g className={styles.alidade}>
          <line
            x1="250"
            y1="50"
            x2="250"
            y2="450"
            stroke="url(#brassGrad)"
            strokeWidth="3.5"
          />
          <polygon points="250,30 244,55 256,55" fill="#D65D40" />
          <polygon points="250,470 244,445 256,445" fill="#D65D40" />
        </g>

        {/* Central Spindle Pivot */}
        <circle cx="250" cy="250" r="16" fill="#D9AF56" stroke="#272721" strokeWidth="2" />
        <circle cx="250" cy="250" r="6" fill="#D65D40" />
      </svg>
    </div>
  );
};
