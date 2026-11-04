/**
 * The Aether Temple Engine — Master Interactive Architectural Sculpture
 *
 * Techfest 30, IIT Bombay — The Living Atlas / Aetherial Renaissance
 *
 * Faithfully realizes the target aesthetic:
 * - Monumental Renaissance/Sci-Fi celestial orrery temple
 * - Incandescent slatted stellar core casting intense point lighting
 * - Massive dark gunmetal & gold gimbals with vernier calibrations
 * - 45° slanted observation yoke with lighted sighting windows
 * - Ribbed observatory dome cupola with diamond finial beacon
 * - Articulated brass orrery arms carrying lantern planets & ringed satellites
 * - Stepped hexagonal temple dais with illuminated front staircase
 * - Human observer silhouette on the stairs establishing monumental scale
 * - Deep background monolithic classical guardian columns looming in mist
 * - Ground mist and volumetric rolling fog
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TempleCore } from './TempleCore';
import { TempleGimbals } from './TempleGimbals';
import { TemplePlanetarium } from './TemplePlanetarium';
import { TemplePlatform } from './TemplePlatform';

interface AetherTempleEngineProps {
  scale?: number;
  position?: [number, number, number];
}

export const AetherTempleEngine: React.FC<AetherTempleEngineProps> = ({
  scale = 1.0,
  position = [0, 0, 0],
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const floatingMechanicsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle breathing float on the upper mechanical assembly
    if (floatingMechanicsRef.current) {
      floatingMechanicsRef.current.position.y = 0.5 + Math.sin(t * 0.8) * 0.04;
    }

    // Very subtle yaw drift for cinematic presence
    if (masterGroupRef.current) {
      masterGroupRef.current.rotation.y = Math.sin(t * 0.12) * 0.05;
    }
  });

  return (
    <group ref={masterGroupRef} position={position} scale={[scale, scale, scale]}>
      {/* ============================================================== */}
      {/* 1. DEEP BACKGROUND GUARDIAN MONOLITHS (Atmospheric Depth)       */}
      {/* ============================================================== */}
      <group position={[0, 2.0, -14]}>
        {/* Left Colossal Column / Guardian */}
        <mesh position={[-7.0, 1.0, 0]}>
          <cylinderGeometry args={[1.2, 1.6, 14.0, 16]} />
          <meshStandardMaterial
            color="#05070D"
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>

        {/* Right Colossal Column / Guardian */}
        <mesh position={[7.0, 1.0, 0]}>
          <cylinderGeometry args={[1.2, 1.6, 14.0, 16]} />
          <meshStandardMaterial
            color="#05070D"
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. THE STEPPED HEXAGONAL DAIS & HUMAN SILHOUETTE ANCHOR        */}
      {/* ============================================================== */}
      <TemplePlatform />

      {/* ============================================================== */}
      {/* 3. FLOATING MECHANICAL CELESTIAL ENGINE ASSEMBLY               */}
      {/* ============================================================== */}
      <group ref={floatingMechanicsRef} position={[0, 0.5, 0]}>
        {/* Central Slatted Solar Core */}
        <TempleCore />

        {/* Armillary Rings, Slanted Yoke & Observatory Cupola */}
        <TempleGimbals />

        {/* Articulated Orrery Arms & Orbiting Planets */}
        <TemplePlanetarium />
      </group>
    </group>
  );
};
