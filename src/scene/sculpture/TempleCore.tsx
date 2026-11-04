/**
 * The Radiant Stellar Core of the Aether Temple Engine
 *
 * Implements:
 * 1. The incandescent sun sphere surrounded by physical 3D cooling louvers
 * 2. Heavy equatorial heat-shield ring & brass magnetic restraints
 * 3. 3D Neural Lattice sub-assembly for Chapter 03 (Cognitive Computing):
 *    Synaptic tensor nodes and quantum waveguide lines pulsing with intelligence
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlowingSunTexture } from './aetherTempleTextures';

interface TempleCoreProps {
  scale?: number;
}

export const TempleCore: React.FC<TempleCoreProps> = ({ scale = 1.0 }) => {
  const innerSunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const neuralGroupRef = useRef<THREE.Group>(null);

  const sunTexture = useMemo(() => createGlowingSunTexture(), []);

  React.useEffect(() => {
    return () => {
      sunTexture.dispose();
    };
  }, [sunTexture]);

  // Procedural neural nodes coordinates
  const neuralNodes = useMemo(() => {
    const nodes: [number, number, number][] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.28;
      nodes.push([
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
      ]);
    }
    return nodes;
  }, []);

  // Synaptic connector line vertices
  const neuralLinePositions = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < neuralNodes.length; i++) {
      const next = (i + 1) % neuralNodes.length;
      const cross = (i + 3) % neuralNodes.length;
      points.push(...neuralNodes[i], ...neuralNodes[next]);
      points.push(...neuralNodes[i], ...neuralNodes[cross]);
    }
    return new Float32Array(points);
  }, [neuralNodes]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle thermal pulse on the core
    if (innerSunRef.current) {
      innerSunRef.current.rotation.y += delta * 0.12;
      const pulse = 1.0 + Math.sin(t * 2.5) * 0.025;
      innerSunRef.current.scale.set(pulse, pulse, pulse);
    }

    // Dynamic light pulsation matching incandescence
    if (lightRef.current) {
      lightRef.current.intensity = 24.0 + Math.sin(t * 3.5) * 3.0;
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.08;
    }

    // Dynamic rotation and synaptic firing in Neural Lattice
    if (neuralGroupRef.current) {
      neuralGroupRef.current.rotation.y += delta * 0.22;
      neuralGroupRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
  });

  // 10 physical horizontal slat louvers over the sun sphere
  const slatAngles = [-0.65, -0.5, -0.35, -0.2, -0.05, 0.1, 0.25, 0.4, 0.55, 0.7];

  return (
    <group scale={[scale, scale, scale]}>
      {/* Central intense omnidirectional incandescent light source */}
      <pointLight
        ref={lightRef}
        color="#FFA520"
        intensity={24.0}
        distance={20.0}
        decay={2.0}
      />

      {/* Auxiliary warm white highlight point light */}
      <pointLight color="#FFF4DE" intensity={12.0} distance={10.0} decay={2.0} />

      {/* Inner Radiant Sun Sphere */}
      <mesh ref={innerSunRef} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1.05, 64, 32]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#FFA01A"
          emissiveMap={sunTexture}
          emissiveIntensity={4.2}
          roughness={0.15}
          metalness={0.05}
        />
      </mesh>

      {/* Physical 3D Slatted Cooling Louvers (Dark Gunmetal with Gold Pinstripes) */}
      {slatAngles.map((yNorm, i) => {
        const yPos = yNorm * 1.0;
        const ringRad = Math.sqrt(Math.max(0.1, 1.15 * 1.15 - yPos * yPos));
        return (
          <group key={i} position={[0, yPos, 0]}>
            {/* Dark louver ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ringRad, 0.032, 12, 64]} />
              <meshStandardMaterial
                color="#121620"
                roughness={0.25}
                metalness={0.92}
              />
            </mesh>
            {/* Fine gold edge wire */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ringRad + 0.015, 0.008, 8, 64]} />
              <meshStandardMaterial
                color="#E5C158"
                roughness={0.15}
                metalness={0.96}
              />
            </mesh>
          </group>
        );
      })}

      {/* Heavy Equatorial mechanical heat-shield ring with vent notches */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#161B24"
          roughness={0.2}
          metalness={0.92}
        />
      </mesh>

      {/* Secondary brass magnetic restraint rings */}
      <mesh rotation={[0.35, 0.5, 0]}>
        <torusGeometry args={[1.24, 0.025, 12, 64]} />
        <meshStandardMaterial
          color="#D4A853"
          roughness={0.16}
          metalness={0.96}
        />
      </mesh>

      <mesh rotation={[-0.35, -0.5, 0]}>
        <torusGeometry args={[1.24, 0.025, 12, 64]} />
        <meshStandardMaterial
          color="#D4A853"
          roughness={0.16}
          metalness={0.96}
        />
      </mesh>

      {/* ------------------------------------------------------------- */}
      {/* CHAPTER 03: SYNAPTIC NEURAL LATTICE                           */}
      {/* Interconnected glowing computational tensor nodes and traces  */}
      {/* ------------------------------------------------------------- */}
      <group ref={neuralGroupRef}>
        {/* Synaptic Light Rays (Line Segments) */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[neuralLinePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00E5FF"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* Neural Tensor Nodes */}
        {neuralNodes.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshStandardMaterial
              color="#00E5FF"
              emissive="#00B0FF"
              emissiveIntensity={3.5}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Translucent radiant energy corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.32, 32, 32]} />
        <meshBasicMaterial
          color="#FFA21E"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
