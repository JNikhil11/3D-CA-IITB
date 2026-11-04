/**
 * The Techfest Experience / Finale Chapter Environment
 *
 * Implements:
 * - Towering vertical celestial sky-beacon projecting to infinity
 * - Grand architectural festival triumphal portal arch
 * - Illuminated Techfest golden standards and celebratory beacons
 * - Concentric festival aura radiating outwards
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FestivalEnvProps {
  active: boolean;
  opacity: number;
}

export const FestivalEnvironment: React.FC<FestivalEnvProps> = ({ active, opacity }) => {
  const beaconBeamRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Pulse sky beacon beam
    if (beaconBeamRef.current) {
      beaconBeamRef.current.rotation.y += delta * 0.2;
      const s = 1.0 + Math.sin(t * 3.0) * 0.08;
      beaconBeamRef.current.scale.set(s, 1.0, s);
    }

    // Radiating festival aura
    if (auraRef.current) {
      auraRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]} visible={active}>
      {/* ---------------------------------------------------------------- */}
      {/* 1. TOWERING SKY BEACON (Beam of Light to the Heavens)           */}
      {/* ---------------------------------------------------------------- */}
      <mesh ref={beaconBeamRef} position={[0, 10, 0]}>
        <cylinderGeometry args={[0.35, 0.08, 18, 24, 1, true]} />
        <meshBasicMaterial
          color="#FFE8A0"
          transparent
          opacity={0.45 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Auxiliary outer celestial aura */}
      <mesh ref={auraRef} position={[0, 10, 0]}>
        <cylinderGeometry args={[0.9, 0.25, 18, 24, 1, true]} />
        <meshBasicMaterial
          color="#FFA520"
          transparent
          opacity={0.2 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ---------------------------------------------------------------- */}
      {/* 2. GRAND ARCHITECTURAL FESTIVAL PORTAL ARCHES                   */}
      {/* ---------------------------------------------------------------- */}
      <group position={[0, 0, -4.5]}>
        {/* Left Portal Pylon */}
        <mesh position={[-4.8, 2.5, 0]}>
          <boxGeometry args={[0.8, 8.0, 0.8]} />
          <meshStandardMaterial color="#141A26" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[-4.8, 6.6, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#FFA520" emissive="#FFA520" emissiveIntensity={3.0} />
        </mesh>

        {/* Right Portal Pylon */}
        <mesh position={[4.8, 2.5, 0]}>
          <boxGeometry args={[0.8, 8.0, 0.8]} />
          <meshStandardMaterial color="#141A26" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[4.8, 6.6, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#FFA520" emissive="#FFA520" emissiveIntensity={3.0} />
        </mesh>

        {/* Arch Transom Header Beam */}
        <mesh position={[0, 6.5, 0]}>
          <boxGeometry args={[10.4, 0.6, 0.9]} />
          <meshStandardMaterial color="#1C2432" roughness={0.25} metalness={0.92} />
        </mesh>
        {/* Golden Arch Inlay Plate */}
        <mesh position={[0, 6.5, 0.46]}>
          <planeGeometry args={[9.6, 0.35]} />
          <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.96} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* 3. CELEBRATORY FESTIVAL BEACONS                                 */}
      {/* ---------------------------------------------------------------- */}
      {[-4.0, -2.0, 2.0, 4.0].map((x, i) => (
        <group key={i} position={[x, -2.2, 3.2]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
            <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#FFF0B0" emissive="#FFA520" emissiveIntensity={3.5} />
          </mesh>
          <pointLight position={[0, 1.25, 0]} color="#FFA520" intensity={2.0 * opacity} distance={3.5} />
        </group>
      ))}
    </group>
  );
};
