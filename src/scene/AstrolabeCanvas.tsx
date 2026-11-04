import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { AstrolabeModel } from './AstrolabeModel';
import { AstrolabeFallback } from './AstrolabeFallback';
import { useWindowSize } from '../hooks/useWindowSize';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './AstrolabeCanvas.module.css';

interface AstrolabeCanvasProps {
  scrollProgress: number;
  activeDomainRing?: number;
  onRingSelect?: (ringIndex: number) => void;
}

function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const AstrolabeCanvas: React.FC<AstrolabeCanvasProps> = ({
  scrollProgress,
  activeDomainRing = 0,
  onRingSelect,
}) => {
  const { isMobile, isTablet } = useWindowSize();
  const reducedMotion = useReducedMotion();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [webGLError, setWebGLError] = useState<boolean>(false);
  const [explodedView, setExplodedView] = useState<boolean>(false);

  // Manual interactive rotation via drag/touch stored in refs to avoid high-frequency React re-renders
  const manualRotRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Passive mouse parallax stored in ref
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePosRef.current.x = Math.max(-1, Math.min(1, nx));
    mousePosRef.current.y = Math.max(-1, Math.min(1, ny));

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastPointerPosRef.current.x;
      const deltaY = e.clientY - lastPointerPosRef.current.y;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      manualRotRef.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, manualRotRef.current.x + deltaY * 0.008)
      );
      manualRotRef.current.y += deltaX * 0.01;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }
  }, []);

  const handleResetOrientation = () => {
    manualRotRef.current.x = 0;
    manualRotRef.current.y = 0;
  };

  const objectScale = isMobile ? 0.72 : isTablet ? 0.88 : 1.02;
  const objectPosY = isMobile ? 0.15 : 0;

  if (!hasWebGL || webGLError) {
    return (
      <div className={styles.canvasContainer}>
        <AstrolabeFallback reducedMotion={reducedMotion} />
      </div>
    );
  }

  return (
    <div
      className={styles.canvasContainer}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="3D Interactive Mechanical Astrolabe Stage"
    >
      {/* Interactive 3D Stage HUD Controls */}
      <div className={styles.stageHud} onPointerDown={(e) => e.stopPropagation()}>
        <div className={styles.hudTopRow}>
          <div className={styles.hudBadge}>
            <span className={styles.hudPulse} />
            <span className={styles.hudText}>3D INTERACTIVE STAGE</span>
          </div>
          <span className={styles.dragPrompt}>✦ DRAG OR TOUCH TO ROTATE 360°</span>
        </div>

        <div className={styles.hudActions}>
          <button
            type="button"
            className={`${styles.hudBtn} ${explodedView ? styles.hudBtnActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setExplodedView(!explodedView);
            }}
            aria-pressed={explodedView}
            title="Toggle exploded mechanical inspection"
          >
            <span>{explodedView ? 'Collapse Orrery' : 'Explode Rings'}</span>
          </button>

          <button
            type="button"
            className={styles.hudBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleResetOrientation();
            }}
            title="Reset to calibrated default angle"
          >
            <span>Reset Orientation</span>
          </button>

          {onRingSelect && (
            <div className={styles.ringQuickSelect} onClick={(e) => e.stopPropagation()}>
              <span className={styles.ringQuickLabel}>ALIGN RING:</span>
              {[0, 1, 2, 3].map((ringIdx) => (
                <button
                  key={ringIdx}
                  type="button"
                  className={`${styles.ringBtn} ${
                    activeDomainRing === ringIdx ? styles.ringBtnActive : ''
                  }`}
                  onClick={() => onRingSelect(ringIdx)}
                  aria-label={`Align Ring ${ringIdx + 1}`}
                  aria-pressed={activeDomainRing === ringIdx}
                >
                  R{ringIdx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<AstrolabeFallback reducedMotion={reducedMotion} />}>
        <Canvas
          camera={{ position: [0, 0.4, 7.2], fov: 46 }}
          dpr={isMobile ? [1, 1.25] : [1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setWebGLError(true);
            });
          }}
          className={styles.canvas}
        >
          {/* Studio HDR Metallic Reflection Rig via Drei Lightformer */}
          <Environment background={false}>
            {/* Key Golden Daylight Lightformer */}
            <Lightformer
              form="rect"
              intensity={2.8}
              color="#FFF5D6"
              position={[6, 8, -4]}
              scale={[12, 6, 1]}
            />
            {/* Soft Warm Brass Fill Lightformer */}
            <Lightformer
              form="rect"
              intensity={2.0}
              color="#E8C372"
              position={[-6, 4, 6]}
              scale={[8, 12, 1]}
            />
            {/* Deep Ultramarine Celestial Contrast Rim */}
            <Lightformer
              form="rect"
              intensity={1.6}
              color="#344FC1"
              position={[0, -6, -6]}
              scale={[14, 4, 1]}
            />
            {/* Top Zenith Glint Lightformer */}
            <Lightformer
              form="circle"
              intensity={3.5}
              color="#FFFDF7"
              position={[0, 9, 0]}
              scale={8}
            />
          </Environment>

          {/* Direct Physical Lights */}
          <ambientLight intensity={0.65} color="#FBF7EE" />

          {/* Golden Key Sunlight */}
          <directionalLight
            position={[5, 7, 5]}
            intensity={2.2}
            color="#FFF2CC"
            castShadow
          />

          {/* Ultramarine Fill Light */}
          <directionalLight
            position={[-5, -2, -3]}
            intensity={1.4}
            color="#344FC1"
          />

          {/* Pedestal Contact Shadow on Parchment Plane */}
          <ContactShadows
            position={[0, -2.55, 0]}
            opacity={0.68}
            scale={8.5}
            blur={2.4}
            far={4.2}
            color="#272721"
            frames={1}
          />

          <group position={[0, objectPosY, 0]} scale={[objectScale, objectScale, objectScale]}>
            <AstrolabeModel
              scrollProgress={scrollProgress}
              mousePositionRef={mousePosRef}
              activeDomainRing={activeDomainRing}
              explodedView={explodedView}
              reducedMotion={reducedMotion}
              manualRotationRef={manualRotRef}
            />
          </group>
        </Canvas>
      </Suspense>
    </div>
  );
};
