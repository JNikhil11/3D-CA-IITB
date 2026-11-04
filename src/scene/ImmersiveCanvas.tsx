/**
 * ImmersiveCanvas — Full-viewport fixed WebGL stage.
 *
 * Houses the master Astronomical Astrolabe sculpture,
 * dynamic cinematic studio lighting, HDRI reflections,
 * contact shadows, and scroll-driven camera choreography.
 */

import React, {
  Suspense,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  Float,
  PresentationControls,
  Preload,
  useProgress,
} from '@react-three/drei';
import * as THREE from 'three';
import { AstronomicalAstrolabe } from './sculpture/AstronomicalAstrolabe';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './ImmersiveCanvas.module.css';

export interface ImmersiveCanvasProps {
  scrollProgress: number;
}

function LoadingOverlay({
  onLoaded,
  onProgress,
}: {
  onLoaded: () => void;
  onProgress: (p: number) => void;
}) {
  const { progress, active } = useProgress();

  useEffect(() => {
    onProgress(progress);
    if (!active && progress >= 100) {
      const id = setTimeout(onLoaded, 300);
      return () => clearTimeout(id);
    }
  }, [active, progress, onLoaded, onProgress]);

  return null;
}

interface CameraRig {
  scrollProgress: number;
  reducedMotion: boolean;
}

function ScrollCamera({ scrollProgress, reducedMotion }: CameraRig) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(1.4, 0.4, 7.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const p = scrollProgress;

    if (p < 0.2) {
      // Opening: wide establishing shot offset to the right for editorial card
      targetPos.current.set(1.4, 0.4, 7.5);
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.4) {
      // Chapter 01: zoom in closer
      const t = (p - 0.2) / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(1.4, 2.0, t),
        THREE.MathUtils.lerp(0.4, 1.0, t),
        THREE.MathUtils.lerp(7.5, 4.2, t)
      );
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.65) {
      // Chapter 02: orbital sweep
      const t = (p - 0.4) / 0.25;
      const angle = THREE.MathUtils.lerp(0, Math.PI * 0.5, t);
      targetPos.current.set(
        Math.sin(angle) * 5.5,
        THREE.MathUtils.lerp(1.0, 0.3, t),
        Math.cos(angle) * 5.5
      );
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.85) {
      // Chapter 03: elevated lookdown
      const t = (p - 0.65) / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(5.5, -1.5, t),
        THREE.MathUtils.lerp(0.3, 3.0, t),
        THREE.MathUtils.lerp(0, 6, t)
      );
      targetLook.current.set(0, 0, 0);
    } else {
      // Final: return to centered hero
      const t = (p - 0.85) / 0.15;
      targetPos.current.set(
        THREE.MathUtils.lerp(-1.5, 1.4, t),
        THREE.MathUtils.lerp(3.0, 0.4, t),
        THREE.MathUtils.lerp(6, 7.5, t)
      );
      targetLook.current.set(0, 0, 0);
    }

    if (!reducedMotion) {
      camera.position.lerp(targetPos.current, 0.04);
    } else {
      camera.position.copy(targetPos.current);
    }
    camera.lookAt(targetLook.current);
  });

  return null;
}

function AetherDust() {
  const count = 300;
  const geo = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!geo.current) return;
    const pos = geo.current.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.setY(i, ((pos.getY(i) + delta * 0.02 + 7) % 14) - 7);
    }
    pos.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#D9AF56"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: number;
  reducedMotion: boolean;
}) {
  return (
    <>
      {/* Studio HDRI Environment for realistic metallic reflections */}
      <Environment files="/hdri/studio_small.hdr" background={false} />

      {/* Ambient Fill */}
      <ambientLight intensity={0.35} color="#D8C8A8" />

      {/* Key Directional Sunlight (Warm golden from top-right) */}
      <directionalLight
        position={[6, 10, 4]}
        intensity={2.8}
        color="#FFF0D0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-bias={-0.0002}
      />

      {/* Secondary Fill (Warm brass) */}
      <directionalLight
        position={[-6, 4, 3]}
        intensity={1.6}
        color="#E8C372"
      />

      {/* Rim light (Deep ultramarine celestial contrast) */}
      <directionalLight
        position={[0, -3, -8]}
        intensity={1.8}
        color="#344FC1"
      />

      {/* Scroll camera */}
      <ScrollCamera scrollProgress={scrollProgress} reducedMotion={reducedMotion} />

      {/* Stardust particles */}
      {!reducedMotion && <AetherDust />}

      {/* Contact shadow */}
      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.65}
        scale={12}
        blur={2.2}
        far={6}
        color="#040710"
      />

      {/* Master 3D Astrolabe sculpture */}
      <PresentationControls
        global
        snap={false}
        rotation={[0.1, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        <Float
          speed={reducedMotion ? 0 : 0.6}
          rotationIntensity={reducedMotion ? 0 : 0.12}
          floatIntensity={reducedMotion ? 0 : 0.25}
        >
          <AstronomicalAstrolabe
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />
        </Float>
      </PresentationControls>

      <Preload all />
    </>
  );
}

export const ImmersiveCanvas: React.FC<ImmersiveCanvasProps> = ({
  scrollProgress,
}) => {
  const reducedMotion = useReducedMotion();
  const { isMobile, isTablet } = useWindowSize();
  const [loaded, setLoaded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [progress, setProgress] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleInteraction = useCallback(() => setInteracted(true), []);

  if (!hasWebGL) {
    return (
      <div className={styles.canvasWrapper}>
        <div className={styles.fallbackBanner} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.canvasWrapper}
      onPointerDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Loading Veil */}
      <div className={`${styles.loadingVeil} ${loaded ? styles.hidden : ''}`}>
        <div className={styles.loadingCrest}>The Aether Engine</div>
        <div className={styles.loadingBar}>
          <div
            className={styles.loadingBarFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.loadingCaption}>
          Calibrating Celestial Instruments…
        </div>
      </div>

      {/* Drag hint */}
      {loaded && !interacted && (
        <div className={styles.dragHint}>
          ✦ Drag or touch to rotate the engine
        </div>
      )}

      {/* The WebGL Canvas */}
      <Canvas
        className={styles.canvas}
        camera={{ position: [1.4, 0.4, 7.5], fov: 46, near: 0.1, far: 100 }}
        dpr={isMobile ? [1, 1.5] : isTablet ? [1, 1.75] : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          powerPreference: 'high-performance',
        }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#05070f'));
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          });
        }}
      >
        <Suspense
          fallback={
            <LoadingOverlay
              onLoaded={handleLoaded}
              onProgress={handleProgress}
            />
          }
        >
          <LoadingOverlay onLoaded={handleLoaded} onProgress={handleProgress} />
          <SceneContent
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
