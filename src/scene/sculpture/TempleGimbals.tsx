/**
 * The Armillary Gimbals, Observation Yoke & Observatory Cupola
 *
 * Faithfully realizes the target aesthetic:
 * 1. Slanted Observation Yoke: massive 38° diagonal beam with paddle ends and glowing viewports
 * 2. Heavy Gunmetal Outer Gimbal Ring with vernier scales & cog teeth
 * 3. Secondary brass intersecting gimbal rings with mechanical pivot blocks
 * 4. Upper Observatory Dome Cupola: hemispherical copper rib lattice directly crowning the upper sphere
 * 5. Diamond beacon finial at the apex with golden mounting bracket
 * 6. Base riser: multi-tiered compressor disks, brass linkage columns, and gear dial plate
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGunmetalTexture } from './aetherTempleTextures';

export const TempleGimbals: React.FC = () => {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const yokeRef = useRef<THREE.Group>(null);
  const diamondRef = useRef<THREE.Mesh>(null);

  const gunmetalTex = React.useMemo(() => createGunmetalTexture(), []);

  React.useEffect(() => {
    return () => {
      gunmetalTex.dispose();
    };
  }, [gunmetalTex]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Slow, stately rotation of the outer master gimbal
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.035;
    }

    // Counter-rotation of inner ring
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x += delta * 0.045;
      innerRingRef.current.rotation.z += delta * 0.02;
    }

    // Gentle mechanical oscillation of observation yoke
    if (yokeRef.current) {
      yokeRef.current.rotation.z = (Math.PI / 180) * 40 + Math.sin(t * 0.25) * 0.035;
    }

    // Pulsing diamond beacon finial
    if (diamondRef.current) {
      diamondRef.current.rotation.y += delta * 1.2;
      const s = 1.0 + Math.sin(t * 3.5) * 0.15;
      diamondRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* ============================================================== */}
      {/* 1. SLANTED OBSERVATION YOKE (Framing the Core at 40°)           */}
      {/* ============================================================== */}
      <group ref={yokeRef}>
        {/* Central Hub Ring around the core */}
        <mesh position={[0, 0, 0.2]}>
          <torusGeometry args={[1.28, 0.06, 16, 64]} />
          <meshStandardMaterial color="#161B25" roughness={0.2} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <torusGeometry args={[1.34, 0.02, 12, 64]} />
          <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.96} />
        </mesh>

        {/* Upper Yoke Arm with Paddle End */}
        <group position={[0, 1.45, 0.35]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.45, 0.16]} />
            <meshStandardMaterial
              color="#141822"
              roughness={0.22}
              metalness={0.92}
              map={gunmetalTex}
            />
          </mesh>
          {/* Illuminated observation chamber viewport */}
          <mesh position={[0, -0.05, 0.085]}>
            <planeGeometry args={[0.34, 1.0]} />
            <meshStandardMaterial
              color="#FFA520"
              emissive="#FFA520"
              emissiveIntensity={3.2}
              roughness={0.15}
            />
          </mesh>
          {/* Gold edge frames */}
          <mesh position={[0.29, 0, 0]}>
            <boxGeometry args={[0.035, 1.48, 0.17]} />
            <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.96} />
          </mesh>
          <mesh position={[-0.29, 0, 0]}>
            <boxGeometry args={[0.035, 1.48, 0.17]} />
            <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.96} />
          </mesh>
          {/* Paddle-shaped flared endcap with cooling louvers */}
          <group position={[0, 0.85, 0]}>
            <mesh>
              <boxGeometry args={[0.7, 0.26, 0.22]} />
              <meshStandardMaterial color="#222B38" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Horizontal end vents */}
            {[-0.06, 0, 0.06].map((vy, vi) => (
              <mesh key={vi} position={[0, vy, 0.115]}>
                <boxGeometry args={[0.48, 0.025, 0.01]} />
                <meshStandardMaterial color="#FFA520" emissive="#FFA520" emissiveIntensity={2.0} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Lower Yoke Arm with Paddle End */}
        <group position={[0, -1.45, 0.35]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.45, 0.16]} />
            <meshStandardMaterial
              color="#141822"
              roughness={0.22}
              metalness={0.92}
              map={gunmetalTex}
            />
          </mesh>
          {/* Illuminated observation chamber viewport */}
          <mesh position={[0, 0.05, 0.085]}>
            <planeGeometry args={[0.34, 1.0]} />
            <meshStandardMaterial
              color="#FFA520"
              emissive="#FFA520"
              emissiveIntensity={3.2}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0.29, 0, 0]}>
            <boxGeometry args={[0.035, 1.48, 0.17]} />
            <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.96} />
          </mesh>
          <mesh position={[-0.29, 0, 0]}>
            <boxGeometry args={[0.035, 1.48, 0.17]} />
            <meshStandardMaterial color="#D4A853" roughness={0.15} metalness={0.96} />
          </mesh>
          <group position={[0, -0.85, 0]}>
            <mesh>
              <boxGeometry args={[0.7, 0.26, 0.22]} />
              <meshStandardMaterial color="#222B38" roughness={0.3} metalness={0.9} />
            </mesh>
            {[-0.06, 0, 0.06].map((vy, vi) => (
              <mesh key={vi} position={[0, vy, 0.115]}>
                <boxGeometry args={[0.48, 0.025, 0.01]} />
                <meshStandardMaterial color="#FFA520" emissive="#FFA520" emissiveIntensity={2.0} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 2. OUTER MASTER GIMBAL RING WITH VERNIER CALIBRATION            */}
      {/* ============================================================== */}
      <group ref={outerRingRef}>
        {/* Main wide gunmetal structural ring */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.2, 0.08, 16, 128]} />
          <meshStandardMaterial
            color="#121620"
            roughness={0.25}
            metalness={0.94}
            map={gunmetalTex}
          />
        </mesh>

        {/* Inner concentric gold calibration track */}
        <mesh>
          <torusGeometry args={[2.08, 0.025, 12, 128]} />
          <meshStandardMaterial color="#E0B858" roughness={0.15} metalness={0.96} />
        </mesh>

        {/* Outer cogwheel rim gear-teeth accents (54 teeth) */}
        {Array.from({ length: 54 }).map((_, i) => {
          const angle = (i / 54) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 2.29, Math.sin(angle) * 2.29, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.05, 0.03, 0.06]} />
              <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.92} />
            </mesh>
          );
        })}

        {/* Heavy mechanical hinge blocks */}
        <mesh position={[2.2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.35, 24]} />
          <meshStandardMaterial color="#242E3D" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[-2.2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.35, 24]} />
          <meshStandardMaterial color="#242E3D" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. INNER INTERSECTING GIMBAL RINGS                              */}
      {/* ============================================================== */}
      <group ref={innerRingRef}>
        {/* Tilted vertical ring */}
        <mesh rotation={[0.42, 0, 0.22]} castShadow>
          <torusGeometry args={[1.92, 0.055, 16, 96]} />
          <meshStandardMaterial color="#D4A853" roughness={0.18} metalness={0.96} />
        </mesh>

        {/* Equatorial calibrated horizontal ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.045, 16, 96]} />
          <meshStandardMaterial
            color="#18202C"
            roughness={0.28}
            metalness={0.9}
            map={gunmetalTex}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 4. UPPER OBSERVATORY DOME CUPOLA (Direct Spherical Crown)       */}
      {/* ============================================================== */}
      <group position={[0, 0.65, 0]}>
        {/* Hemispherical ribbed copper/brass dome lattice */}
        {Array.from({ length: 16 }).map((_, i) => {
          const rotY = (i / 16) * Math.PI;
          return (
            <mesh key={i} rotation={[0, rotY, 0]}>
              <torusGeometry args={[1.48, 0.024, 12, 32, Math.PI / 2]} />
              <meshStandardMaterial color="#C88E48" roughness={0.2} metalness={0.94} />
            </mesh>
          );
        })}

        {/* Amber illuminated translucent glass dome panels */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.47, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.7]} />
          <meshPhysicalMaterial
            color="#FFD688"
            emissive="#FF9D1B"
            emissiveIntensity={0.65}
            transparent
            opacity={0.36}
            roughness={0.15}
            transmission={0.6}
            thickness={0.4}
            metalness={0.15}
          />
        </mesh>

        {/* Base retaining ring collar */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.48, 0.045, 12, 48]} />
          <meshStandardMaterial color="#D4A853" roughness={0.18} metalness={0.95} />
        </mesh>

        {/* Dome apex collar ring */}
        <mesh position={[0, 1.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.04, 12, 24]} />
          <meshStandardMaterial color="#E0B858" roughness={0.15} metalness={0.98} />
        </mesh>

        {/* Illuminated Diamond Beacon Finial */}
        <mesh ref={diamondRef} position={[0, 1.66, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#FFF6D8"
            emissive="#FFAA20"
            emissiveIntensity={5.0}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        <pointLight position={[0, 1.66, 0]} color="#FFA520" intensity={5.0} distance={7.0} decay={2.0} />
      </group>

      {/* ============================================================== */}
      {/* 5. BASE TURNTABLE & VERNIER DIAL PLATES (Machine Base Riser)    */}
      {/* ============================================================== */}
      <group position={[0, -2.05, 0]}>
        {/* Main rotating dial plate with vernier calibration */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.08, 64]} />
          <meshStandardMaterial
            color="#10141E"
            roughness={0.25}
            metalness={0.92}
            map={gunmetalTex}
          />
        </mesh>

        {/* Engraved brass outer bezel ring */}
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[1.52, 0.038, 12, 64]} />
          <meshStandardMaterial color="#D4A853" roughness={0.18} metalness={0.96} />
        </mesh>

        {/* Multi-tier compressor cooling fin stack */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[0, -0.05 - i * 0.09, 0]}>
            <cylinderGeometry args={[1.35 - i * 0.07, 1.35 - i * 0.07, 0.035, 48]} />
            <meshStandardMaterial color="#18202D" roughness={0.3} metalness={0.9} />
          </mesh>
        ))}

        {/* Central hydraulic riser column */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.55, 0.7, 0.8, 32]} />
          <meshStandardMaterial color="#121620" roughness={0.35} metalness={0.88} />
        </mesh>

        {/* Vertical brass linkage columns */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.0, -0.42, Math.sin(angle) * 1.0]}
            >
              <cylinderGeometry args={[0.035, 0.035, 0.8, 16]} />
              <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
