/**
 * LeaderLine.tsx — Dynamic SVG Leader Line & 3D Focal Reticle
 *
 * Connects screen-space editorial typography anchors directly to the
 * projected 3D focal coordinates of the active component on the Atlas.
 * Updates at 60 FPS via lightweight requestAnimationFrame without React state churn.
 */

import React, { useRef, useEffect } from 'react';
import { scrollState } from '../motion/scrollState';
import styles from './LeaderLine.module.css';

interface LeaderLineProps {
  sourceX: number; // Percentage 0-100 of typography anchor
  sourceY: number; // Percentage 0-100 of typography anchor
  visible: boolean;
}

export const LeaderLine: React.FC<LeaderLineProps> = ({
  sourceX,
  sourceY,
  visible,
}) => {
  const lineRef = useRef<SVGLineElement>(null);
  const reticleInnerRef = useRef<SVGCircleElement>(null);
  const reticleOuterRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let animId: number;

    const updateLine = () => {
      const targetX = scrollState.projectedFocalPoint.x;
      const targetY = scrollState.projectedFocalPoint.y;

      if (lineRef.current) {
        lineRef.current.setAttribute('x1', `${sourceX}%`);
        lineRef.current.setAttribute('y1', `${sourceY}%`);
        lineRef.current.setAttribute('x2', `${targetX}%`);
        lineRef.current.setAttribute('y2', `${targetY}%`);
      }

      if (reticleInnerRef.current) {
        reticleInnerRef.current.setAttribute('cx', `${targetX}%`);
        reticleInnerRef.current.setAttribute('cy', `${targetY}%`);
      }

      if (reticleOuterRef.current) {
        reticleOuterRef.current.setAttribute('cx', `${targetX}%`);
        reticleOuterRef.current.setAttribute('cy', `${targetY}%`);
      }

      animId = requestAnimationFrame(updateLine);
    };

    if (visible) {
      animId = requestAnimationFrame(updateLine);
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [sourceX, sourceY, visible]);

  if (!visible) return null;

  return (
    <svg className={styles.leaderLineSvg} aria-hidden="true">
      <defs>
        <radialGradient id="reticleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dashed hairline connection vector */}
      <line
        ref={lineRef}
        x1={`${sourceX}%`}
        y1={`${sourceY}%`}
        x2="50%"
        y2="50%"
        stroke="#D4AF37"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.55"
      />

      {/* Target Reticle at 3D projected focal point */}
      <g>
        <circle
          ref={reticleOuterRef}
          className={styles.reticleOuter}
          cx="50%"
          cy="50%"
          r="8"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle
          ref={reticleInnerRef}
          cx="50%"
          cy="50%"
          r="3"
          fill="#D4AF37"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};
