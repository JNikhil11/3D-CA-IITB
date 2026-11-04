/**
 * The Planetarium Orrery System of the Aether Temple Engine
 *
 * Implements the articulated curved brass arms holding orbiting celestial bodies:
 * 1. The Ribbed Lantern Planet (vertical dark louvers with glowing amber interior + mini satellite)
 * 2. The Saturnian Ringed Planet (bright glowing sphere with tilted brass ring)
 * 3. Radiant beacon pearls on cantilevered stanchions
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createLanternPlanetTexture } from './aetherTempleTextures';

export const TemplePlanetarium: React.FC = () => {
  const systemRef = useRef<THREE.Group>(null);
  const lanternPlanetRef = useRef<THREE.Mesh>(null);
  const miniMoonRef = useRef<THREE.Mesh>(null);
  const ringedPlanetRef = useRef<THREE.Group>(null);

  const lanternTex = React.useMemo(() => createLanternPlanetTexture(), []);

  React.useEffect(() => {
    return () => {
      lanternTex.dispose();
    };
  }, [lanternTex]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Slow planetary precession
    if (systemRef.current) {
      systemRef.current.rotation.y += delta * 0.08;
    }

    // Lantern planet rotation & moon orbit
    if (lanternPlanetRef.current) {
      lanternPlanetRef.current.rotation.y += delta * 0.4;
    }
    if (miniMoonRef.current) {
      const angle = t * 1.5;
      miniMoonRef.current.position.set(
        Math.cos(angle) * 0.45,
        Math.sin(angle * 1.5) * 0.15,
        Math.sin(angle) * 0.45
      );
    }

    // Ringed planet slow axial tilt wobble
    if (ringedPlanetRef.current) {
      ringedPlanetRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group ref={systemRef}>
      {/* ============================================================== */}
      {/* 1. UPPER RIGHT ARM: THE RIBBED LANTERN PLANET & MOON            */}
      {/* ============================================================== */}
      <group position={[2.4, 1.8, 0.4]}>
        {/* Support pipe down to central platform */}
        <mesh position={[-0.4, -0.9, -0.1]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.035, 0.045, 2.0, 16]} />
          <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Vertical riser bracket */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
          <meshStandardMaterial color="#2B3242" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Brass collar mounting */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#E5C158" roughness={0.15} metalness={0.95} />
        </mesh>

        {/* The Ribbed Lantern Planet */}
        <mesh ref={lanternPlanetRef} position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            map={lanternTex}
            emissive="#FFB030"
            emissiveMap={lanternTex}
            emissiveIntensity={2.5}
            roughness={0.25}
            metalness={0.3}
          />
        </mesh>

        {/* Auxiliary local point light on the lantern */}
        <pointLight position={[0, 0.35, 0]} color="#FFA520" intensity={4.0} distance={4.0} decay={2.0} />

        {/* Mini orbiting satellite moon */}
        <mesh ref={miniMoonRef} position={[0.45, 0.35, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color="#FFF4D0"
            emissive="#FFF4D0"
            emissiveIntensity={2.0}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. MID-LEFT ARM: THE SATURNIAN RINGED CELESTIAL BODY           */}
      {/* ============================================================== */}
      <group ref={ringedPlanetRef} position={[-2.3, -0.2, 0.8]}>
        {/* Curved connecting strut */}
        <mesh position={[0.5, -0.6, -0.2]} rotation={[0.2, 0.3, 0.8]}>
          <cylinderGeometry args={[0.04, 0.045, 1.8, 16]} />
          <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Central glowing orb */}
        <mesh>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial
            color="#FFDF88"
            emissive="#FFA010"
            emissiveIntensity={3.2}
            roughness={0.15}
            metalness={0.2}
          />
        </mesh>
        <pointLight color="#FF9010" intensity={3.5} distance={4.5} decay={2.0} />

        {/* Concentric planetary rings (tilted at 35 degrees) */}
        <group rotation={[0.65, 0.3, 0.2]}>
          {/* Main golden ring disc */}
          <mesh>
            <ringGeometry args={[0.48, 0.78, 64]} />
            <meshStandardMaterial
              color="#D4A853"
              roughness={0.2}
              metalness={0.9}
              side={THREE.DoubleSide}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Outer fine ring track */}
          <mesh>
            <ringGeometry args={[0.82, 0.86, 64]} />
            <meshStandardMaterial
              color="#FFE4A0"
              roughness={0.1}
              metalness={0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 3. PERIPHERAL BEACON NODES (LOWER PERIMETER ORB CLUSTER)        */}
      {/* ============================================================== */}
      {/* Left lower double beacon */}
      <group position={[-2.8, -0.8, -0.5]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 16]} />
          <meshStandardMaterial color="#2B3242" roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[-0.2, 0.2, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#FFF0B0" emissive="#FFA520" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0.2, 0.45, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#FFF0B0" emissive="#FFA520" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Right lower single beacon */}
      <group position={[2.6, -0.7, -0.6]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 16]} />
          <meshStandardMaterial color="#2B3242" roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFF0B0" emissive="#FFA520" emissiveIntensity={3.0} />
        </mesh>
        <pointLight position={[0, 0.25, 0]} color="#FFA520" intensity={2.0} distance={3.0} decay={2.0} />
      </group>

      {/* Front-right accent beacon */}
      <group position={[1.8, -0.4, 1.9]}>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.025, 0.03, 1.2, 16]} />
          <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#FFF4D0" emissive="#FF9510" emissiveIntensity={2.8} />
        </mesh>
      </group>
    </group>
  );
};
