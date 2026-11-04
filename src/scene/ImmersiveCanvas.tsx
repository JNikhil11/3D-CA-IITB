/**
 * ImmersiveCanvas — The Living Atlas as Hero & Foreground
 *
 * Architecture:
 * 1. Monumental 3D Aether Temple Engine occupying 75-85% of viewport
 * 2. 6-Chapter Camera Choreography driven by authoritative scrollState.progress
 * 3. Screen projection of 3D chapter focal points for dynamic SVG leader lines
 * 4. First-frame buffer swap and shader warmup before curtain release
 * 5. Fluid 60/90/120 FPS rendering decoupled from React state churn
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
import { GrandObservatoryEnvironment } from './worlds/GrandObservatoryEnvironment';
import { SubterraneanEngineEnvironment } from './worlds/SubterraneanEngineEnvironment';
import { EngineeringWorldsEnvironment } from './worlds/EngineeringWorldsEnvironment';
import { FestivalExperienceEnvironment } from './worlds/FestivalExperienceEnvironment';
import { FinalDestinationEnvironment } from './worlds/FinalDestinationEnvironment';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  scrollState,
  WORLDS,
} from '../motion/scrollState';
import styles from './ImmersiveCanvas.module.css';

export interface ImmersiveCanvasProps {
  onCanvasReady?: () => void;
  onLoadProgress?: (progress: number) => void;
}

/**
 * Tracks Drei asset download progress and notifies parent
 */
function AssetProgressTracker({
  onProgress,
  onLoaded,
}: {
  onProgress?: (p: number) => void;
  onLoaded?: () => void;
}) {
  const { progress, active } = useProgress();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (onProgress) onProgress(progress);
    if (!active && progress >= 100 && !loadedRef.current) {
      loadedRef.current = true;
      if (onLoaded) onLoaded();
    }
  }, [active, progress, onProgress, onLoaded]);

  return null;
}

/**
 * Ensures initial frame buffer swap and warms up WebGL shaders
 */
function FirstFrameTracker({ onReady }: { onReady: () => void }) {
  const count = useRef(0);
  const fired = useRef(false);

  useFrame(({ gl, scene, camera }) => {
    if (fired.current) return;
    count.current += 1;

    if (count.current === 1) {
      try {
        gl.compile(scene, camera);
      } catch {
        // Fallback gracefully
      }
    }

    if (count.current >= 2) {
      fired.current = true;
      onReady();
    }
  });

  return null;
}

/**
 * Continuous 5-World Camera Choreography through the Atlas
 */
function ScrollCamera({
  reducedMotion,
  isMobile,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.8, 8.8));
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame(() => {
    const p = scrollState.progress;

    if (p < 0.2) {
      // World 01: The Grand Observatory [0.0, 0.20]
      // Monumental establishing view of astrolabe & celestial dome
      const t = p / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(0, 0.3, t),
        THREE.MathUtils.lerp(isMobile ? 2.2 : 1.8, 1.5, t),
        THREE.MathUtils.lerp(isMobile ? 10.5 : 8.8, 7.8, t)
      );
      targetLook.current.set(0, 0.5, 0);
    } else if (p < 0.4) {
      // World 02: The Subterranean Engine [0.20, 0.40]
      // Camera swoops down into the industrial vault, close to catwalk and console
      const t = (p - 0.2) / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(0.3, 0.0, t),
        THREE.MathUtils.lerp(1.5, -0.6, t),
        THREE.MathUtils.lerp(7.8, isMobile ? 4.9 : 4.4, t)
      );
      targetLook.current.set(
        THREE.MathUtils.lerp(0, 0.0, t),
        THREE.MathUtils.lerp(0.5, -1.0, t),
        THREE.MathUtils.lerp(0, 2.8, t)
      );
    } else if (p < 0.65) {
      // World 03: Engineering Worlds [0.40, 0.65]
      // Sweeping traversal orbiting around the 4 engineering quadrants
      const t = (p - 0.4) / 0.25;
      targetPos.current.set(
        THREE.MathUtils.lerp(0.0, isMobile ? 2.0 : 2.8, t),
        THREE.MathUtils.lerp(-0.6, 1.4, t),
        THREE.MathUtils.lerp(isMobile ? 4.9 : 4.4, isMobile ? 6.0 : 5.2, t)
      );
      targetLook.current.set(
        THREE.MathUtils.lerp(0.0, 1.0, t),
        THREE.MathUtils.lerp(-1.0, 0.5, t),
        THREE.MathUtils.lerp(2.8, 0.0, t)
      );
    } else if (p < 0.85) {
      // World 04: The Techfest Experience [0.65, 0.85]
      // Sweeping dynamic view across Technoholix laser arrays & Ozone arena
      const t = (p - 0.65) / 0.2;
      targetPos.current.set(
        THREE.MathUtils.lerp(isMobile ? 2.0 : 2.8, isMobile ? -1.8 : -2.4, t),
        THREE.MathUtils.lerp(1.4, 1.6, t),
        THREE.MathUtils.lerp(isMobile ? 6.0 : 5.2, isMobile ? 7.0 : 6.2, t)
      );
      targetLook.current.set(
        THREE.MathUtils.lerp(1.0, -0.8, t),
        THREE.MathUtils.lerp(0.5, 0.2, t),
        THREE.MathUtils.lerp(0.0, -1.0, t)
      );
    } else {
      // World 05: The Final Destination [0.85, 1.00]
      // Grand panoramic elevation pullback into deep space revealing the beacon
      const t = (p - 0.85) / 0.15;
      targetPos.current.set(
        THREE.MathUtils.lerp(isMobile ? -1.8 : -2.4, 0.0, t),
        THREE.MathUtils.lerp(1.6, 3.8, t),
        THREE.MathUtils.lerp(isMobile ? 7.0 : 6.2, isMobile ? 12.8 : 11.5, t)
      );
      targetLook.current.set(
        THREE.MathUtils.lerp(-0.8, 0.0, t),
        THREE.MathUtils.lerp(0.2, 1.2, t),
        THREE.MathUtils.lerp(-1.0, 0.0, t)
      );
    }

    if (!reducedMotion) {
      camera.position.lerp(targetPos.current, 0.06);
    } else {
      camera.position.copy(targetPos.current);
    }
    camera.lookAt(targetLook.current);
  });

  return null;
}

/**
 * Projects the active world's 3D focal coordinates to 2D screen percentage
 * for SVG leader line anchoring
 */
function FocalPointProjector() {
  const { camera } = useThree();
  const tempVec = useRef(new THREE.Vector3());

  useFrame(() => {
    const activeIdx = scrollState.activeWorldIndex;
    const focal3D = WORLDS[activeIdx].focalPoint3D;
    tempVec.current.set(focal3D[0], focal3D[1], focal3D[2]);
    tempVec.current.project(camera);

    // Convert from normalized device coordinates (-1 to 1) to screen percentage (0 to 100)
    const targetX = ((tempVec.current.x + 1) * 0.5) * 100;
    const targetY = ((-tempVec.current.y + 1) * 0.5) * 100;

    // Smooth dampening to prevent leader line flutter
    scrollState.projectedFocalPoint.x +=
      (targetX - scrollState.projectedFocalPoint.x) * 0.2;
    scrollState.projectedFocalPoint.y +=
      (targetY - scrollState.projectedFocalPoint.y) * 0.2;
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

function WorldsManager() {
  const [worldStates, setWorldStates] = useState({
    w1: true,
    w2: false,
    w3: false,
    w4: false,
    w5: false,
  });

  useFrame(() => {
    const p = scrollState.progress;
    const w1 = p < 0.24;
    const w2 = p >= 0.16 && p < 0.44;
    const w3 = p >= 0.36 && p < 0.68;
    const w4 = p >= 0.62 && p < 0.88;
    const w5 = p >= 0.82;

    if (
      w1 !== worldStates.w1 ||
      w2 !== worldStates.w2 ||
      w3 !== worldStates.w3 ||
      w4 !== worldStates.w4 ||
      w5 !== worldStates.w5
    ) {
      setWorldStates({ w1, w2, w3, w4, w5 });
    }
  });

  return (
    <>
      <GrandObservatoryEnvironment active={worldStates.w1} />
      <SubterraneanEngineEnvironment active={worldStates.w2} />
      <EngineeringWorldsEnvironment active={worldStates.w3} />
      <FestivalExperienceEnvironment active={worldStates.w4} />
      <FinalDestinationEnvironment active={worldStates.w5} />
    </>
  );
}

function SceneContent({
  reducedMotion,
  isMobile,
  onCanvasReady,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
  onCanvasReady: () => void;
}) {
  return (
    <>
      {/* Confirms 1st and 2nd frames have rendered and warmed up shaders */}
      <FirstFrameTracker onReady={onCanvasReady} />

      {/* Projects 3D focal coordinates to 2D screen coordinates */}
      <FocalPointProjector />

      {/* Studio HDRI Environment for realistic metallic reflections */}
      <Environment files="/hdri/studio_small.hdr" background={false} />

      {/* Cinematic Studio Lighting */}
      <ambientLight intensity={0.42} color="#151D2C" />

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

      {/* Smooth 5-World Scroll Camera Choreography */}
      <ScrollCamera reducedMotion={reducedMotion} isMobile={isMobile} />

      {/* Subtle Aether Stardust */}
      {!reducedMotion && <AetherDust />}

      {/* 5 Distinct 3D World Spatial Environments */}
      <WorldsManager />

      {/* Master 3D Aether Temple Engine Sculpture (Dominant Foreground Hero) */}
      <PresentationControls
        global
        snap={false}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 10, Math.PI / 10]}
        azimuth={[-Math.PI / 6, Math.PI / 6]}
      >
        <AetherTempleEngine position={[0, -0.2, 0]} scale={1.05} />
      </PresentationControls>
    </>
  );
}

export const ImmersiveCanvas: React.FC<ImmersiveCanvasProps> = ({
  onCanvasReady,
  onLoadProgress,
}) => {
  const reducedMotion = useReducedMotion();
  const { isMobile, isTablet } = useWindowSize();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const assetsLoadedRef = useRef(false);
  const warmupReadyRef = useRef(false);
  const reportedReadyRef = useRef(false);

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

  const checkOverallReady = useCallback(() => {
    if (
      assetsLoadedRef.current &&
      warmupReadyRef.current &&
      !reportedReadyRef.current
    ) {
      reportedReadyRef.current = true;
      setIsReady(true);
      if (onCanvasReady) onCanvasReady();
    }
  }, [onCanvasReady]);

  const handleAssetsLoaded = useCallback(() => {
    assetsLoadedRef.current = true;
    checkOverallReady();
  }, [checkOverallReady]);

  const handleWarmupReady = useCallback(() => {
    warmupReadyRef.current = true;
    checkOverallReady();
  }, [checkOverallReady]);

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
      {/* Drag hint */}
      {isReady && !interacted && (
        <div className={styles.dragHint}>
          ✦ Drag or touch to inspect the atlas
        </div>
      )}

      {/* The WebGL Canvas */}
      <Canvas
        className={styles.canvas}
        camera={{
          position: [0, 1.8, 8.8],
          fov: isMobile ? 52 : 42,
          near: 0.1,
          far: 100,
        }}
        dpr={isMobile ? [1, 1.5] : isTablet ? [1, 1.75] : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
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
        <Suspense fallback={null}>
          <AssetProgressTracker
            onProgress={onLoadProgress}
            onLoaded={handleAssetsLoaded}
          />
          <SceneContent
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            onCanvasReady={handleWarmupReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
