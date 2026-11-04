/**
 * ImmersiveCanvas — Full-viewport fixed WebGL stage.
 *
 * Houses:
 * 1. The master Aether Temple Engine sculpture
 * 2. Specialized 3D Chapter Environments (Robotics, Aerospace, Computing, Festival)
 * 3. Cinematic studio lighting, HDRI reflections, and volumetric ground mist
 * 4. Continuous scroll-driven camera choreography linking all 5 chapters
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
  PresentationControls,
  useProgress,
} from '@react-three/drei';
import * as THREE from 'three';
import { AetherTempleEngine } from './sculpture/AetherTempleEngine';
import { RoboticsEnvironment } from './chapters/RoboticsEnvironment';
import { AerospaceEnvironment } from './chapters/AerospaceEnvironment';
import { ComputingEnvironment } from './chapters/ComputingEnvironment';
import { FestivalEnvironment } from './chapters/FestivalEnvironment';
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

/**
 * Continuous 5-Chapter Camera Choreography
 */
function ScrollCamera({ scrollProgress, reducedMotion }: CameraRig) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.25, 9.2));
  const targetLook = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame(() => {
    const p = scrollProgress;

    if (p < 0.2) {
      // Opening Hero: Wide establishing 3/4 view of the temple engine
      const t = p / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(0, 0.5, t),
        THREE.MathUtils.lerp(1.25, 0.9, t),
        THREE.MathUtils.lerp(9.2, 8.0, t)
      );
      targetLook.current.set(0, 0.2, 0);
    } else if (p < 0.4) {
      // Chapter 01: Enter the Engine (Zoom macro travel inside the gimbals & core)
      const t = (p - 0.2) / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(0.5, 0.0, t),
        THREE.MathUtils.lerp(0.9, 0.4, t),
        THREE.MathUtils.lerp(8.0, 4.4, t)
      );
      targetLook.current.set(0, 0.4, 0);
    } else if (p < 0.62) {
      // Chapter 02: Robotics Forge (Camera sweeps to the West Wing industrial cell)
      const t = (p - 0.4) / 0.22;
      targetPos.current.set(
        THREE.MathUtils.lerp(0.0, -3.2, t),
        THREE.MathUtils.lerp(0.4, 0.8, t),
        THREE.MathUtils.lerp(4.4, 5.2, t)
      );
      targetLook.current.set(
        THREE.MathUtils.lerp(0, -4.2, t),
        THREE.MathUtils.lerp(0.4, 0.3, t),
        THREE.MathUtils.lerp(0, -0.8, t)
      );
    } else if (p < 0.82) {
      // Chapter 03: Aerospace & Deep Space (Camera sweeps across to the orbital satellite)
      const t = (p - 0.62) / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(-3.2, 3.4, t),
        THREE.MathUtils.lerp(0.8, 1.4, t),
        THREE.MathUtils.lerp(5.2, 5.5, t)
      );
      targetLook.current.set(
        THREE.MathUtils.lerp(-4.2, 4.2, t),
        THREE.MathUtils.lerp(0.3, 0.6, t),
        THREE.MathUtils.lerp(-0.8, -0.6, t)
      );
    } else if (p < 0.92) {
      // Chapter 04: Computing & Neural Matrix (Camera ascends to quantum vault)
      const t = (p - 0.82) / 0.1;
      targetPos.current.set(
        THREE.MathUtils.lerp(3.4, 0.0, t),
        THREE.MathUtils.lerp(1.4, 3.6, t),
        THREE.MathUtils.lerp(5.5, 5.0, t)
      );
      targetLook.current.set(0, 2.8, -2.5);
    } else {
      // Chapter 05: Grand Festival Finale (Pull back to grand panoramic elevation with sky beacon)
      const t = (p - 0.92) / 0.08;
      targetPos.current.set(
        0,
        THREE.MathUtils.lerp(3.6, 1.6, t),
        THREE.MathUtils.lerp(5.0, 10.5, t)
      );
      targetLook.current.set(0, 1.0, 0);
    }

    if (!reducedMotion) {
      camera.position.lerp(targetPos.current, 0.045);
    } else {
      camera.position.copy(targetPos.current);
    }
    camera.lookAt(targetLook.current);
  });

  return null;
}

function AetherDust() {
  const count = 350;
  const geo = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!geo.current) return;
    const pos = geo.current.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.setY(i, ((pos.getY(i) + delta * 0.025 + 8) % 16) - 8);
    }
    pos.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#E5C158"
        transparent
        opacity={0.38}
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
  // Compute smooth chapter environment visibility weights
  const p = scrollProgress;

  // Robotics: fades in around 0.35, peaks 0.45-0.58, fades out by 0.65
  const roboticsOpacity =
    p >= 0.32 && p <= 0.65
      ? p < 0.42
        ? (p - 0.32) / 0.1
        : p > 0.58
        ? (0.65 - p) / 0.07
        : 1.0
      : 0.0;

  // Aerospace: fades in around 0.55, peaks 0.65-0.78, fades out by 0.84
  const aerospaceOpacity =
    p >= 0.55 && p <= 0.84
      ? p < 0.65
        ? (p - 0.55) / 0.1
        : p > 0.78
        ? (0.84 - p) / 0.06
        : 1.0
      : 0.0;

  // Computing: fades in around 0.74, peaks 0.82-0.90, fades out by 0.94
  const computingOpacity =
    p >= 0.74 && p <= 0.94
      ? p < 0.82
        ? (p - 0.74) / 0.08
        : p > 0.9
        ? (0.94 - p) / 0.04
        : 1.0
      : 0.0;

  // Festival: fades in around 0.88, peaks at 1.0
  const festivalOpacity =
    p >= 0.88 ? THREE.MathUtils.clamp((p - 0.88) / 0.08, 0, 1) : 0.0;

  return (
    <>
      {/* Studio HDRI Environment for realistic metallic reflections */}
      <Environment files="/hdri/studio_small.hdr" background={false} />

      {/* Cinematic Studio Lighting */}
      <ambientLight intensity={0.38} color="#151D2C" />

      {/* Warm Golden Key Light */}
      <directionalLight
        position={[-6, 10, 7]}
        intensity={2.8}
        color="#FFF6E4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={35}
        shadow-bias={-0.0002}
      />

      {/* Secondary Brass Fill */}
      <directionalLight
        position={[7, 4, 5]}
        intensity={1.6}
        color="#E8C372"
      />

      {/* Ultramarine Celestial Rim Light */}
      <directionalLight
        position={[0, 7, -9]}
        intensity={2.2}
        color="#3252AC"
      />

      {/* Smooth Scroll Camera Choreography */}
      <ScrollCamera scrollProgress={scrollProgress} reducedMotion={reducedMotion} />

      {/* Subtle Aether Stardust */}
      {!reducedMotion && <AetherDust />}

      {/* Master 3D Aether Temple Engine Sculpture */}
      <PresentationControls
        global
        snap={false}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 8, Math.PI / 8]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <AetherTempleEngine position={[0, -0.2, 0]} />
      </PresentationControls>

      {/* Distinct 3D Chapter Environments */}
      <RoboticsEnvironment active={roboticsOpacity > 0} opacity={roboticsOpacity} />
      <AerospaceEnvironment active={aerospaceOpacity > 0} opacity={aerospaceOpacity} />
      <ComputingEnvironment active={computingOpacity > 0} opacity={computingOpacity} />
      <FestivalEnvironment active={festivalOpacity > 0} opacity={festivalOpacity} />
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
        camera={{ position: [0, 1.25, 9.2], fov: 42, near: 0.1, far: 100 }}
        dpr={isMobile ? [1, 1.5] : isTablet ? [1, 1.75] : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
          powerPreference: 'high-performance',
        }}
        shadows
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color('#03050A'));
          scene.fog = new THREE.FogExp2('#03050A', 0.032);
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
