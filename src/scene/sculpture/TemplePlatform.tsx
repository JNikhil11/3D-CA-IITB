/**
 * The Stepped Hexagonal Temple Dais, Pylons & Human Silhouette Anchor
 *
 * Implements:
 * 1. Multi-tiered stepped hexagonal platform in polished dark obsidian with fine gold inlays
 * 2. Grand front staircase with illuminated golden tread steps
 * 3. Human Observer Silhouette figure (scale anchor)
 * 4. Heavy hydraulic conduit pipes with brass flanged couplings
 * 5. Peripheral hexagonal capacitor pylons
 * 6. Thick layered volumetric ground mist rolling across the dark floor
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createPlatformFloorTexture,
  createSmokeTexture,
} from './aetherTempleTextures';

export const TemplePlatform: React.FC = () => {
  const fogRef1 = useRef<THREE.Mesh>(null);
  const fogRef2 = useRef<THREE.Mesh>(null);
  const fogRef3 = useRef<THREE.Mesh>(null);
  const floorTex = React.useMemo(() => createPlatformFloorTexture(), []);
  const smokeTex = React.useMemo(() => createSmokeTexture(), []);

  React.useEffect(() => {
    return () => {
      floorTex.dispose();
      smokeTex.dispose();
    };
  }, [floorTex, smokeTex]);

  useFrame((_, delta) => {
    if (fogRef1.current) {
      fogRef1.current.rotation.z += delta * 0.015;
    }
    if (fogRef2.current) {
      fogRef2.current.rotation.z -= delta * 0.012;
    }
    if (fogRef3.current) {
      fogRef3.current.rotation.z += delta * 0.009;
    }
  });

  return (
    <group position={[0, -2.5, 0]}>
      {/* ============================================================== */}
      {/* 1. STEPPED HEXAGONAL DAIS (Polished Obsidian & Gunmetal)       */}
      {/* ============================================================== */}
      {/* Tier 1 — Lowest wide hexagonal base */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 4.7, 0.45, 6]} />
        <meshStandardMaterial
          color="#060911"
          roughness={0.25}
          metalness={0.9}
          map={floorTex}
        />
      </mesh>

      {/* Tier 2 — Intermediate hexagonal tier */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[3.3, 3.55, 0.38, 6]} />
        <meshStandardMaterial
          color="#090D17"
          roughness={0.22}
          metalness={0.92}
          map={floorTex}
        />
      </mesh>

      {/* Tier 3 — Raised inner stage (Dark Obsidian Plating) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.38, 0.32, 6]} />
        <meshStandardMaterial
          color="#080C16"
          roughness={0.18}
          metalness={0.95}
          map={floorTex}
        />
      </mesh>

      {/* Gold perimeter boundary rim (HOLLOW ring, NOT a solid cylinder) */}
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.14, 2.24, 6]} />
        <meshStandardMaterial
          color="#D4A853"
          roughness={0.15}
          metalness={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ============================================================== */}
      {/* 2. THE GRAND FRONT STAIRCASE WITH ILLUMINATED STEPS            */}
      {/* ============================================================== */}
      <group position={[0, -0.28, 2.6]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const stepY = i * 0.075;
          const stepZ = -i * 0.22;
          const stepW = 1.8 - i * 0.05;
          return (
            <group key={i} position={[0, stepY, stepZ]}>
              {/* Dark polished tread */}
              <mesh position={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[stepW, 0.075, 0.24]} />
                <meshStandardMaterial color="#0A0E18" roughness={0.25} metalness={0.9} />
              </mesh>
              {/* Illuminated golden riser edge */}
              <mesh position={[0, 0.036, 0.115]}>
                <boxGeometry args={[stepW - 0.04, 0.014, 0.02]} />
                <meshStandardMaterial
                  color="#FFA825"
                  emissive="#FFA825"
                  emissiveIntensity={3.8}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ============================================================== */}
      {/* 3. THE HUMAN OBSERVER SILHOUETTE (Crucial Architectural Scale) */}
      {/* ============================================================== */}
      <group position={[0, 0.32, 1.25]}>
        {/* Head */}
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshStandardMaterial color="#04060A" roughness={0.95} metalness={0.05} />
        </mesh>
        {/* Torso & Long Coat */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.055, 0.085, 0.22, 16]} />
          <meshStandardMaterial color="#04060A" roughness={0.95} metalness={0.05} />
        </mesh>
        {/* Left Leg */}
        <mesh position={[-0.035, 0.045, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.14, 12]} />
          <meshStandardMaterial color="#030408" roughness={0.95} metalness={0.05} />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.035, 0.045, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.14, 12]} />
          <meshStandardMaterial color="#030408" roughness={0.95} metalness={0.05} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 4. HEAVY HYDRAULIC CONDUIT PIPES                               */}
      {/* ============================================================== */}
      {/* Left conduit pipe */}
      <group position={[-1.7, 0.15, 0.6]}>
        <mesh rotation={[0, 0.6, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 2.0, 16]} />
          <meshStandardMaterial color="#D4A853" roughness={0.18} metalness={0.95} />
        </mesh>
        {/* Flanged joint collars */}
        <mesh position={[0.5, 0, 0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#1E2738" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[-0.5, 0, -0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#1E2738" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* Right conduit pipe */}
      <group position={[1.7, 0.15, 0.6]}>
        <mesh rotation={[0, -0.6, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 2.0, 16]} />
          <meshStandardMaterial color="#D4A853" roughness={0.18} metalness={0.95} />
        </mesh>
        <mesh position={[-0.5, 0, 0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#1E2738" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0.5, 0, -0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#1E2738" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 5. PERIPHERAL CAPACITOR PYLONS (Sustainable Energy Leylines)   */}
      {/* ============================================================== */}
      {/* Front-Left Pylon with Clean Energy Emerald Leyline */}
      <group position={[-3.1, 0.05, 1.8]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.0, 6]} />
          <meshStandardMaterial color="#0A1118" roughness={0.2} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.22, 0.27, 1.02, 6]} />
          <meshStandardMaterial color="#10B981" roughness={0.2} metalness={0.95} wireframe />
        </mesh>
        {/* Glowing capstone */}
        <mesh position={[0, 1.05, 0]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial color="#10B981" emissive="#059669" emissiveIntensity={4.2} />
        </mesh>
        <pointLight position={[0, 1.05, 0]} color="#10B981" intensity={2.8} distance={3.5} />
      </group>

      {/* Front-Right Pylon with Clean Energy Cyan Leyline */}
      <group position={[3.1, 0.05, 1.8]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.0, 6]} />
          <meshStandardMaterial color="#0A1118" roughness={0.2} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.22, 0.27, 1.02, 6]} />
          <meshStandardMaterial color="#00E5FF" roughness={0.2} metalness={0.95} wireframe />
        </mesh>
        {/* Glowing capstone */}
        <mesh position={[0, 1.05, 0]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial color="#00E5FF" emissive="#0284C7" emissiveIntensity={4.2} />
        </mesh>
        <pointLight position={[0, 1.05, 0]} color="#00E5FF" intensity={2.8} distance={3.5} />
      </group>

      {/* ============================================================== */}
      {/* 6. CINEMATIC VOLUMETRIC GROUND MIST / FLOOR FOG                */}
      {/* ============================================================== */}
      <mesh ref={fogRef1} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          map={smokeTex}
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={fogRef2} position={[0, 0.1, 0.8]} rotation={[-Math.PI / 2, 0, 0.7]}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial
          map={smokeTex}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={fogRef3} position={[0, -0.2, 2.2]} rotation={[-Math.PI / 2, 0, -0.5]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial
          map={smokeTex}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
