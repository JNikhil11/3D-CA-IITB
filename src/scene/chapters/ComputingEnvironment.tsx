/**
 * Computational & Emerging Technologies Chapter Environment
 *
 * Implements:
 * - Crystalline quantum processor core with laser-etched circuits
 * - Floating electromagnetic containment toroids
 * - Optical laser waveguide buses with pulsating data packets
 * - Neural matrix nodes and algorithmic logic lattices
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ComputingEnvProps {
  active: boolean;
  opacity: number;
}

export const ComputingEnvironment: React.FC<ComputingEnvProps> = ({ active, opacity }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Group>(null);
  const ringRef2 = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Quantum core rotation and facet shimmer
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.4;
      coreRef.current.rotation.y += delta * 0.6;
    }

    // Counter-rotating containment field toroids
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.8;
    if (ringRef2.current) ringRef2.current.rotation.x -= delta * 0.7;

    // Optical data pulse
    if (lightRef.current) {
      lightRef.current.intensity = 4.0 + Math.sin(t * 5.0) * 2.0;
    }
  });

  return (
    <group position={[0, 2.8, -2.5]} visible={active}>
      {/* ---------------------------------------------------------------- */}
      {/* 1. QUANTUM CRYSTALLINE PROCESSOR CORE                           */}
      {/* ---------------------------------------------------------------- */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshPhysicalMaterial
          color="#00FFA8"
          emissive="#00E5FF"
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.1}
          transmission={0.7}
          thickness={0.8}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>

      {/* Optical point light */}
      <pointLight ref={lightRef} color="#00FFA8" intensity={4.5 * opacity} distance={6.0} />

      {/* ---------------------------------------------------------------- */}
      {/* 2. ELECTROMAGNETIC CONTAINMENT TOROIDS                          */}
      {/* ---------------------------------------------------------------- */}
      <group ref={ringRef1}>
        <mesh>
          <torusGeometry args={[1.3, 0.025, 12, 64]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00B0FF"
            emissiveIntensity={2.5}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
      <group ref={ringRef2} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.5, 0.025, 12, 64]} />
          <meshStandardMaterial
            color="#D4A853"
            emissive="#FFA520"
            emissiveIntensity={1.8}
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* 3. OPTICAL DATA WAVEGUIDE BUSES & NEURAL LATTICE NODES          */}
      {/* ---------------------------------------------------------------- */}
      {/* 8 radiating neural nodes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const rad = 2.4;
        const x = Math.cos(angle) * rad;
        const z = Math.sin(angle) * rad;
        const y = Math.sin(angle * 2) * 0.4;
        return (
          <group key={i} position={[x, y, z]}>
            {/* Logic Node Qubit Cube */}
            <mesh rotation={[angle, angle, 0]}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial
                color="#00FFA8"
                emissive="#00FFA8"
                emissiveIntensity={2.2}
                roughness={0.2}
                transparent
                opacity={opacity}
              />
            </mesh>
            {/* Waveguide Beam Oriented Toward Core */}
            <mesh
              position={[-x * 0.5, -y * 0.5, -z * 0.5]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.015, 0.015, rad]} />
              <meshBasicMaterial color="#00E5FF" transparent opacity={0.35 * opacity} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
