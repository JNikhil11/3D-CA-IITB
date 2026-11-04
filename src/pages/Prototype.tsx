/**
 * Prototype — Phase 2 Isolated Route
 *
 * Dedicated isolated 3D environment presenting the master
 * Aether Temple Engine sculpture. Occupies >70% of the viewport with
 * rich PBR materials, contact shadows, studio reflections, and
 * full 360° pointer/touch interactive presentation.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  PresentationControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { AetherTempleEngine } from '../scene/sculpture/AetherTempleEngine';
import styles from './Prototype.module.css';

export const Prototype: React.FC = () => {
  return (
    <div className={styles.prototypeContainer}>
      {/* Discreet Editorial Header Mark (Unobtrusive, no buttons) */}
      <header className={styles.headerOverlay}>
        <h1 className={styles.brandTitle}>The Aether Engine</h1>
        <span className={styles.brandSub}>Techfest 30 · IIT Bombay · Prototype Stage</span>
      </header>

      {/* 3D Canvas Stage */}
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 1.25, 9.2], fov: 42 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color('#03050A'));
          scene.fog = new THREE.FogExp2('#03050A', 0.032);
        }}
      >
        <Suspense fallback={null}>
          {/* Studio HDRI Environment for realistic metallic brass/gunmetal reflections */}
          <Environment files="/hdri/studio_small.hdr" background={false} />

          {/* Deep ambient fill for moody shadows */}
          <ambientLight intensity={0.4} color="#182236" />

          {/* Key light from top-left */}
          <directionalLight
            position={[-5, 10, 7]}
            intensity={2.8}
            color="#FFF6E4"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0002}
          />

          {/* Warm brass edge fill */}
          <directionalLight
            position={[7, 4, 5]}
            intensity={1.6}
            color="#E8C372"
          />

          {/* Cool ultramarine rim light from behind */}
          <directionalLight
            position={[0, 7, -9]}
            intensity={2.2}
            color="#3252AC"
          />

          {/* Interactive presentation wrapper with pointer/touch support */}
          <PresentationControls
            global
            snap={false}
            rotation={[0.1, 0.22, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <AetherTempleEngine position={[0, -0.2, 0]} />
          </PresentationControls>
        </Suspense>
      </Canvas>

      {/* Subtle Drag Prompt */}
      <div className={styles.interactionPrompt} aria-hidden="true">
        ✦ Drag or touch to inspect 360°
      </div>
    </div>
  );
};
