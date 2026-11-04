/**
 * Aerospace & Space Exploration Chapter Environment
 *
 * Implements:
 * - High-detail deep-space scientific satellite probe
 * - Gold MLI thermal foil bus & high-gain parabolic antenna
 * - Deployable twin photovoltaic solar arrays with silicon cell grids
 * - Blue plasma ion propulsion exhaust plume
 * - Concentric orbital flight trajectories and Keplerian vector rings
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AerospaceEnvProps {
  active: boolean;
  opacity?: number;
}

export const AerospaceEnvironment: React.FC<AerospaceEnvProps> = ({ active }) => {
  const satelliteRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const thrusterGlow = useRef<THREE.PointLight>(null);
  const orbitRef1 = useRef<THREE.Group>(null);
  const orbitRef2 = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Satellite orbital flight attitude stabilization
    if (satelliteRef.current) {
      satelliteRef.current.position.y = 0.5 + Math.sin(t * 0.8) * 0.12;
      satelliteRef.current.rotation.y += delta * 0.08;
      satelliteRef.current.rotation.x = Math.sin(t * 0.6) * 0.05;
    }

    // Parabolic tracking dish scan
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(t * 0.5) * 0.35;
    }

    // Ion engine plasma plume pulsation
    if (thrusterGlow.current) {
      thrusterGlow.current.intensity = 3.5 + Math.sin(t * 8.0) * 1.5;
    }

    // Orbital ring precessions
    if (orbitRef1.current) orbitRef1.current.rotation.z += delta * 0.05;
    if (orbitRef2.current) orbitRef2.current.rotation.x -= delta * 0.04;
  });

  return (
    <group position={[4.5, 0.4, -0.8]} visible={active}>
      {/* ---------------------------------------------------------------- */}
      {/* 1. KEPLERIAN ORBITAL TRAJECTORY RINGS                           */}
      {/* ---------------------------------------------------------------- */}
      <group ref={orbitRef1} rotation={[0.4, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.015, 8, 96]} />
          <meshBasicMaterial color="#40A9FF" transparent opacity={0.4} />
        </mesh>
      </group>
      <group ref={orbitRef2} rotation={[-0.5, 0.6, 0]}>
        <mesh>
          <torusGeometry args={[3.6, 0.015, 8, 96]} />
          <meshBasicMaterial color="#E5C158" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* 2. DEEP-SPACE SCIENTIFIC SATELLITE PROBE                        */}
      {/* ---------------------------------------------------------------- */}
      <group ref={satelliteRef}>
        {/* Hexagonal Main Avionics Bus (Gold Multi-Layer Insulation Foil) */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 1.2, 6]} />
          <meshStandardMaterial
            color="#FFC83B"
            roughness={0.18}
            metalness={0.92}
          />
        </mesh>

        {/* Spacecraft equipment deck collars */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.06, 6]} />
          <meshStandardMaterial color="#222B38" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.06, 6]} />
          <meshStandardMaterial color="#222B38" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* -------------------------------------------------------------- */}
        {/* TWIN DEPLOYABLE PHOTOVOLTAIC SOLAR ARRAYS                      */}
        {/* -------------------------------------------------------------- */}
        {/* Left Solar Wing */}
        <group position={[-1.75, 0, 0]}>
          {/* Main Panel */}
          <mesh>
            <boxGeometry args={[2.2, 0.8, 0.04]} />
            <meshStandardMaterial
              color="#0A1832"
              roughness={0.15}
              metalness={0.9}
            />
          </mesh>
          {/* Silicon cell pinstripe grid */}
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[2.16, 0.76]} />
            <meshStandardMaterial
              color="#184080"
              emissive="#0D2448"
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          {/* Hinge Boom */}
          <mesh position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 12]} />
            <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
          </mesh>
        </group>

        {/* Right Solar Wing */}
        <group position={[1.75, 0, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.8, 0.04]} />
            <meshStandardMaterial
              color="#0A1832"
              roughness={0.15}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[2.16, 0.76]} />
            <meshStandardMaterial
              color="#184080"
              emissive="#0D2448"
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[-1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 12]} />
            <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
          </mesh>
        </group>

        {/* -------------------------------------------------------------- */}
        {/* PARABOLIC HIGH-GAIN TELEMETRY DISH ANTENNA                     */}
        {/* -------------------------------------------------------------- */}
        <group ref={dishRef} position={[0, 0.85, 0]} rotation={[0.4, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
            <meshStandardMaterial
              color="#F0F4FA"
              roughness={0.2}
              metalness={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Feed Horn Stanchion */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
            <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.44, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#D4A853" />
          </mesh>
        </group>

        {/* -------------------------------------------------------------- */}
        {/* BLUE PLASMA ION PROPULSION THRUSTER                            */}
        {/* -------------------------------------------------------------- */}
        <group position={[0, -0.75, 0]}>
          {/* Thruster Bell Nozzle */}
          <mesh rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.08, 0.25, 20]} />
            <meshStandardMaterial color="#1E2838" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Ion Plasma Plume Cone */}
          <mesh position={[0, -0.32, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.16, 0.5, 16]} />
            <meshBasicMaterial
              color="#00A2FF"
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight
            ref={thrusterGlow}
            position={[0, -0.35, 0]}
            color="#00A2FF"
            intensity={4.0}
            distance={4.0}
          />
        </group>
      </group>
    </group>
  );
};
