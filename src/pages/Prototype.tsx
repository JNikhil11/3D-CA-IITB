/**
 * Prototype — Phase 2 Isolated Route
 *
 * Dedicated isolated 3D environment presenting the master
 * Astronomical Astrolabe sculpture. Occupies >70% of the viewport with
 * rich PBR materials, contact shadows, studio reflections, and
 * full 360° pointer/touch interactive presentation.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PresentationControls,
  Float,
} from '@react-three/drei';
import * as THREE from 'three';
import { AstronomicalAstrolabe } from '../scene/sculpture/AstronomicalAstrolabe';
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
        camera={{ position: [0, 0.25, 8.5], fov: 42 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color('#060913'));
          scene.fog = new THREE.FogExp2('#060913', 0.025);
        }}
      >
        <Suspense fallback={null}>
          {/* Studio HDRI Environment for realistic metallic brass/bronze reflections */}
          <Environment files="/hdri/studio_small.hdr" background={false} />

          {/* Ambient light for shadow fill */}
          <ambientLight intensity={0.35} color="#D8C8A8" />

          {/* Primary key sunlight (warm gold from top-left) */}
          <directionalLight
            position={[-5, 8, 4]}
            intensity={2.8}
            color="#FFF4D6"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0002}
          />

          {/* Secondary warm brass fill light */}
          <directionalLight
            position={[5, 4, 3]}
            intensity={1.6}
            color="#E8C372"
          />

          {/* Deep ultramarine celestial rim light from behind */}
          <directionalLight
            position={[0, -2, -6]}
            intensity={1.8}
            color="#344FC1"
          />

          {/* Ground reflection & contact shadow plane */}
          <ContactShadows
            position={[0, -2.85, 0]}
            opacity={0.7}
            scale={14}
            blur={2.0}
            far={5}
            color="#04060C"
          />

          {/* Interactive presentation wrapper with pointer/touch support */}
          <PresentationControls
            global
            snap={false}
            rotation={[0.1, 0.35, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.15}>
              <AstronomicalAstrolabe />
            </Float>
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
