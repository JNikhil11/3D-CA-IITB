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
  Lightformer,
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
          {/* High-Performance Procedural Studio Environment Rig */}
          <Environment resolution={256} background={false}>
            <Lightformer
              form="rect"
              intensity={2.8}
              color="#FFF6E4"
              scale={[10, 5, 1]}
              position={[-6, 10, 7]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="ring"
              intensity={1.8}
              color="#E8C372"
              scale={[8, 8, 1]}
              position={[7, 4, 5]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={2.2}
              color="#3252AC"
              scale={[12, 4, 1]}
              position={[0, 7, -9]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="circle"
              intensity={0.6}
              color="#151D2C"
              scale={[16, 16, 1]}
              position={[0, -5, 0]}
            />
          </Environment>

          {/* Deep ambient fill for moody shadows */}
          <ambientLight intensity={0.4} color="#182236" />

          {/* Key light from top-left */}
          <directionalLight
            position={[-6, 10, 7]}
            intensity={2.8}
            color="#FFF6E4"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-camera-near={0.5}
            shadow-camera-far={28}
            shadow-bias={-0.00015}
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
