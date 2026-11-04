/**
 * FestivalExperienceEnvironment.tsx — World 04: The Techfest Experience
 *
 * Implements the festival spectacle:
 * - Technoholix amphitheater laser physics beams with intersecting colored angles
 * - Sweeping concert stage spotlights with animated pan & tilt
 * - Stage truss structures with aluminum triangular framework
 * - Ozone interactive pavilion structures with glowing neon geodesic accents
 * - Vibrant festival atmosphere and illuminated crowd aura
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldProps {
  active: boolean;
  intensity?: number;
}

export const FestivalExperienceEnvironment: React.FC<WorldProps> = ({
  active,
  intensity = 1.0,
}) => {
  const laserGroup1 = useRef<THREE.Group>(null);
  const laserGroup2 = useRef<THREE.Group>(null);
  const spotLight1 = useRef<THREE.SpotLight>(null);
  const spotLight2 = useRef<THREE.SpotLight>(null);
  const festivalAtmosphere = useRef<THREE.Points>(null);

  // Festival spark and laser particle aura
  const festivalParticles = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 8.0 - 2.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Laser array sweeping motion
    if (laserGroup1.current) {
      laserGroup1.current.rotation.y = Math.sin(t * 1.8) * 0.45;
      laserGroup1.current.rotation.z = Math.cos(t * 1.4) * 0.25;
    }
    if (laserGroup2.current) {
      laserGroup2.current.rotation.y = -Math.sin(t * 1.8 + 0.8) * 0.45;
      laserGroup2.current.rotation.z = -Math.cos(t * 1.4 + 0.8) * 0.25;
    }

    // Spotlights sweeping across the stage
    if (spotLight1.current) {
      spotLight1.current.position.x = Math.sin(t * 2.0) * 4.0;
    }
    if (spotLight2.current) {
      spotLight2.current.position.x = -Math.cos(t * 2.0) * 4.0;
    }
  });

  if (!active && intensity <= 0.01) return null;

  return (
    <group visible={active}>
      {/* ============================================================== */}
      {/* 1. TECHNOHOLIX STAGE TRUSS RIGGING                             */}
      {/* ============================================================== */}
      <group position={[0, -1.2, -4.5]}>
        {/* Stage Platform Base */}
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[12.0, 0.6, 5.0]} />
          <meshStandardMaterial color="#0A0E18" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Left Truss Tower */}
        <mesh position={[-5.4, 3.2, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 7.2, 12]} />
          <meshStandardMaterial color="#556075" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Right Truss Tower */}
        <mesh position={[5.4, 3.2, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 7.2, 12]} />
          <meshStandardMaterial color="#556075" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Overhead Stage Lighting Truss Bar */}
        <mesh position={[0, 6.8, 0]}>
          <boxGeometry args={[11.2, 0.35, 0.35]} />
          <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. SYNCHRONIZED MULTI-COLORED VOLUMETRIC LASER BEAMS           */}
      {/* ============================================================== */}
      <group position={[0, 4.5, -4.2]}>
        {/* Left Laser Bank (Cyan & Magenta Beams) */}
        <group ref={laserGroup1} position={[-3.6, 0, 0]}>
          {[-0.6, -0.2, 0.2, 0.6].map((xOff, idx) => (
            <mesh
              key={`laser-l-${idx}`}
              position={[xOff * 0.8, -2.8, 4.0]}
              rotation={[-0.7, xOff * 0.4, 0]}
            >
              <cylinderGeometry args={[0.035, 0.12, 14.0, 12, 1, true]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#00F0FF' : '#FF0077'}
                transparent
                opacity={0.35 * intensity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* Right Laser Bank (Gold & Emerald Beams) */}
        <group ref={laserGroup2} position={[3.6, 0, 0]}>
          {[-0.6, -0.2, 0.2, 0.6].map((xOff, idx) => (
            <mesh
              key={`laser-r-${idx}`}
              position={[xOff * 0.8, -2.8, 4.0]}
              rotation={[-0.7, -xOff * 0.4, 0]}
            >
              <cylinderGeometry args={[0.035, 0.12, 14.0, 12, 1, true]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#FFD700' : '#00FF88'}
                transparent
                opacity={0.35 * intensity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ============================================================== */}
      {/* 3. CONCERT SPOTLIGHTS WITH GLOWING TARGETS                     */}
      {/* ============================================================== */}
      <spotLight
        ref={spotLight1}
        position={[-3.0, 6.0, -3.0]}
        target-position={[0, -1.0, 0]}
        color="#00D4FF"
        intensity={6.0 * intensity}
        angle={0.4}
        penumbra={0.7}
        distance={22}
      />
      <spotLight
        ref={spotLight2}
        position={[3.0, 6.0, -3.0]}
        target-position={[0, -1.0, 0]}
        color="#FF0088"
        intensity={6.0 * intensity}
        angle={0.4}
        penumbra={0.7}
        distance={22}
      />

      {/* ============================================================== */}
      {/* 4. OZONE GEODESIC PAVILION STRUCTURES                          */}
      {/* ============================================================== */}
      <group position={[-5.8, -1.0, 1.2]}>
        {/* Geodesic Dome Framework */}
        <mesh>
          <sphereGeometry args={[1.8, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshBasicMaterial
            color="#38BDF8"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
        <pointLight
          color="#38BDF8"
          intensity={1.2 * intensity}
          distance={4.5}
          decay={2}
        />
      </group>

      <group position={[5.8, -1.0, 1.2]}>
        {/* Geodesic Dome Framework */}
        <mesh>
          <sphereGeometry args={[1.8, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshBasicMaterial
            color="#A855F7"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
        <pointLight
          color="#A855F7"
          intensity={1.2 * intensity}
          distance={4.5}
          decay={2}
        />
      </group>

      {/* ============================================================== */}
      {/* 5. FESTIVAL ATMOSPHERE AURA PARTICLES                          */}
      {/* ============================================================== */}
      <points ref={festivalAtmosphere}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[festivalParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#FFDD66"
          transparent
          opacity={0.5 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
