/**
 * FinalDestinationEnvironment.tsx — World 05: The Final Destination
 *
 * Implements the grand cosmic climax:
 * - Monumental vertical sky beacon beam piercing straight into the stars
 * - Concentric celestial horizon rings and portal glyph markers
 * - Vast cosmic starfield and nebula halo
 * - Grand architectural dais beacons framing the Living Atlas
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldProps {
  active: boolean;
  intensity?: number;
}

export const FinalDestinationEnvironment: React.FC<WorldProps> = ({
  active,
  intensity = 1.0,
}) => {
  const beaconCoreRef = useRef<THREE.Mesh>(null);
  const portalRing1 = useRef<THREE.Mesh>(null);
  const portalRing2 = useRef<THREE.Mesh>(null);
  const skyLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Beacon intensity pulse
    if (beaconCoreRef.current) {
      const mat = beaconCoreRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.65 + Math.sin(t * 3.0) * 0.25;
      }
    }

    // Portal celestial rings slow counter-rotation
    if (portalRing1.current) {
      portalRing1.current.rotation.z = t * 0.08;
    }
    if (portalRing2.current) {
      portalRing2.current.rotation.z = -t * 0.05;
    }

    if (skyLight.current) {
      skyLight.current.intensity = (4.0 + Math.sin(t * 2.0) * 1.0) * intensity;
    }
  });

  if (!active && intensity <= 0.01) return null;

  return (
    <group visible={active}>
      {/* ============================================================== */}
      {/* 1. MONUMENTAL VERTICAL SKY BEACON (Cosmic Piercing Finial)     */}
      {/* ============================================================== */}
      <group position={[0, 1.8, 0]}>
        {/* Inner intense light filament */}
        <mesh ref={beaconCoreRef} position={[0, 12, 0]}>
          <cylinderGeometry args={[0.08, 0.25, 24, 16]} />
          <meshBasicMaterial
            color="#FFF4D0"
            transparent
            opacity={0.8 * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Outer translucent energy sheath */}
        <mesh position={[0, 12, 0]}>
          <cylinderGeometry args={[0.45, 1.8, 24, 16, 1, true]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.22 * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Vertical Zenith Light Point */}
        <pointLight
          ref={skyLight}
          position={[0, 8.0, 0]}
          color="#FFF0BE"
          intensity={5.0 * intensity}
          distance={30}
          decay={1.6}
        />
      </group>

      {/* ============================================================== */}
      {/* 2. CONCENTRIC CELESTIAL PORTAL RINGS                           */}
      {/* ============================================================== */}
      <group position={[0, 0.4, 0]}>
        {/* Portal Ring 1 (Inner Gold) */}
        <mesh
          ref={portalRing1}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        >
          <ringGeometry args={[5.2, 5.35, 64]} />
          <meshBasicMaterial
            color="#E5C158"
            transparent
            opacity={0.6 * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Portal Ring 2 (Outer Celestial Cyan) */}
        <mesh
          ref={portalRing2}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.05, 0]}
        >
          <ringGeometry args={[7.8, 7.95, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.5 * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. FOUR PERIMETER BEACON PYLONS (Framing the Living Atlas)    */}
      {/* ============================================================== */}
      {[
        [-5.5, -5.5],
        [5.5, -5.5],
        [-5.5, 5.5],
        [5.5, 5.5],
      ].map(([bx, bz], idx) => (
        <group key={`pylon-beacon-${idx}`} position={[bx, -1.2, bz]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.22, 0.3, 1.8, 16]} />
            <meshStandardMaterial
              color="#101524"
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, 1.75, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          <pointLight
            position={[0, 1.8, 0]}
            color="#FFD700"
            intensity={1.0 * intensity}
            distance={5.0}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
};
