import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AstrolabeModel } from './AstrolabeModel';
import { AstrolabeFallback } from './AstrolabeFallback';
import { useWindowSize } from '../hooks/useWindowSize';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './AstrolabeCanvas.module.css';

interface AstrolabeCanvasProps {
  scrollProgress: number;
  activeDomainRing?: number;
}

// Simple WebGL availability probe
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
  activeDomainRing,
}) => {
  const { isMobile, isTablet } = useWindowSize();
  const reducedMotion = useReducedMotion();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [webGLError, setWebGLError] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Smooth bounded pointer tracking
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  // Scale and camera tuning for mobile vs desktop
  const objectScale = isMobile ? 0.72 : isTablet ? 0.88 : 1.05;
  const objectPosY = isMobile ? -0.2 : 0;

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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      role="region"
      aria-label="3D Interactive Astrolabe Sculpture"
    >
      <Suspense fallback={<AstrolabeFallback reducedMotion={reducedMotion} />}>
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 45 }}
          dpr={isMobile ? [1, 1.25] : [1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
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
          {/* Lighting Rig */}
          <ambientLight intensity={0.75} color="#FBF7EE" />
          {/* Main golden key light */}
          <directionalLight
            position={[5, 8, 6]}
            intensity={2.0}
            color="#E8C372"
          />
          {/* Ultramarine rim fill light */}
          <directionalLight
            position={[-6, -4, -4]}
            intensity={1.2}
            color="#344FC1"
          />
          {/* Vermilion subtle accent light */}
          <pointLight
            position={[0, 0, 0]}
            intensity={1.8}
            distance={5}
            color="#D65D40"
          />
          {/* Top highlight */}
          <pointLight
            position={[0, 4, 3]}
            intensity={1.0}
            distance={8}
            color="#FBF9F3"
          />

          <group position={[0, objectPosY, 0]} scale={[objectScale, objectScale, objectScale]}>
            <AstrolabeModel
              scrollProgress={scrollProgress}
              mousePosition={mousePos}
              activeDomainRing={activeDomainRing}
              reducedMotion={reducedMotion}
            />
          </group>
        </Canvas>
      </Suspense>
    </div>
  );
};
