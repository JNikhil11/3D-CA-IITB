/**
 * GrandObservatoryEnvironment.tsx — World 01: The Grand Observatory
 *
 * Visual Reference (Images 1, 2, 4, 5):
 * - Circular rotunda with 12 fluted classical columns (radius: 7.5m)
 * - Tall vaulted arched windows revealing deep starry cosmic nebula
 * - Angled volumetric sunlight/celestial light cones (AdditiveBlending)
 * - Polished reflective obsidian floor with glowing etched celestial chart diagrams
 * - Overhead celestial glass star-dome hemisphere with glowing constellation lines
 * - Classical perimeter library archives with warm brass lanterns
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldProps {
  active: boolean;
  intensity?: number;
}

export const GrandObservatoryEnvironment: React.FC<WorldProps> = ({
  active,
  intensity = 1.0,
}) => {
  const domeRef = useRef<THREE.Group>(null);
  const chartRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // 12 columns arranged radially
  const columnPositions = useMemo(() => {
    const cols = [];
    const radius = 7.8;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      cols.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle: -angle + Math.PI / 2,
      });
    }
    return cols;
  }, []);

  // Floating celestial particles inside the rotunda
  const particlePositions = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.random() * 6.0;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Slow rotation of celestial star dome
    if (domeRef.current) {
      domeRef.current.rotation.y = t * 0.015;
    }

    // Gentle pulse of the etched floor diagram
    if (chartRef.current) {
      const mat = chartRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.55 + Math.sin(t * 1.4) * 0.15;
      }
    }

    // Drifting dust particles
    if (dustRef.current) {
      const attr = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 180; i++) {
        let y = attr.getY(i) + delta * 0.08;
        if (y > 6.0) y = 0.2;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;
    }
  });

  if (!active && intensity <= 0.01) return null;

  return (
    <group visible={active}>
      {/* ============================================================== */}
      {/* 1. POLISHED REFLECTIVE OBSIDIAN ROTUNDA FLOOR                 */}
      {/* ============================================================== */}
      <group position={[0, -1.8, 0]}>
        {/* Main polished dais floor */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[8.8, 9.2, 0.4, 48]} />
          <meshStandardMaterial
            color="#080C14"
            roughness={0.08}
            metalness={0.92}
            envMapIntensity={1.8}
          />
        </mesh>

        {/* Outer concentric brass retaining curb */}
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[8.6, 0.08, 16, 48]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.22}
            metalness={0.95}
          />
        </mesh>

        {/* Glowing Etched Celestial Chart Diagrams (Image 4 & 5 Floor Etchings) */}
        <mesh
          ref={chartRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.16, 0]}
        >
          <ringGeometry args={[2.2, 7.8, 64]} />
          <meshBasicMaterial
            color="#E5C158"
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </mesh>

        {/* Inner concentric astronomical coordinate rings */}
        {[3.2, 4.6, 6.0, 7.2].map((r, idx) => (
          <mesh
            key={`ring-${idx}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.165, 0]}
          >
            <ringGeometry args={[r - 0.02, r + 0.02, 64]} />
            <meshBasicMaterial
              color="#F0D078"
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* ============================================================== */}
      {/* 2. 12 FLUTED CLASSICAL ROTUNDA COLUMNS & ARCHITRAVE           */}
      {/* ============================================================== */}
      <group position={[0, -1.8, 0]}>
        {columnPositions.map((col, idx) => (
          <group
            key={`column-${idx}`}
            position={[col.x, 0, col.z]}
            rotation={[0, col.angle, 0]}
          >
            {/* Column Plinth Base */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.9, 0.6, 0.9]} />
              <meshStandardMaterial
                color="#141A28"
                roughness={0.4}
                metalness={0.7}
              />
            </mesh>

            {/* Stepped Torus Base */}
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.38, 0.44, 0.2, 24]} />
              <meshStandardMaterial
                color="#C59B27"
                roughness={0.3}
                metalness={0.85}
              />
            </mesh>

            {/* Fluted Column Shaft */}
            <mesh position={[0, 4.0, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.36, 6.5, 24]} />
              <meshStandardMaterial
                color="#0D121F"
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>

            {/* Brass Capital Moulding */}
            <mesh position={[0, 7.4, 0]}>
              <boxGeometry args={[0.85, 0.4, 0.85]} />
              <meshStandardMaterial
                color="#D4AF37"
                roughness={0.2}
                metalness={0.92}
              />
            </mesh>

            {/* Warm Lantern Bracket mounted on every alternate column */}
            {idx % 2 === 0 && (
              <group position={[0, 3.8, 0.45]}>
                <mesh>
                  <boxGeometry args={[0.08, 0.4, 0.08]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.12]}>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshBasicMaterial color="#FFB84D" />
                </mesh>
                <pointLight
                  color="#FFA633"
                  intensity={0.65}
                  distance={3.5}
                  decay={2}
                />
              </group>
            )}
          </group>
        ))}

        {/* Continuous Upper Entablature Architrave Ring */}
        <mesh position={[0, 7.7, 0]}>
          <torusGeometry args={[7.8, 0.42, 16, 48]} />
          <meshStandardMaterial
            color="#141A28"
            roughness={0.3}
            metalness={0.75}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. VOLUMETRIC ANGLED LIGHT SHAFTS (Images 2, 4, 5)             */}
      {/* ============================================================== */}
      <group position={[0, 2.5, 0]}>
        {/* Shaft 1: From high East window toward central astrolabe */}
        <mesh
          position={[-3.2, 1.2, 1.8]}
          rotation={[0.38, 0.2, -0.62]}
        >
          <cylinderGeometry args={[0.3, 2.2, 9.0, 16, 1, true]} />
          <meshBasicMaterial
            color="#FFF4D0"
            transparent
            opacity={0.14 * intensity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Shaft 2: From high West window */}
        <mesh
          position={[3.4, 1.4, -1.2]}
          rotation={[-0.32, -0.25, 0.58]}
        >
          <cylinderGeometry args={[0.35, 2.4, 9.2, 16, 1, true]} />
          <meshBasicMaterial
            color="#FFEAB0"
            transparent
            opacity={0.12 * intensity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Central Vertical Celestial Illumination Beacon */}
        <pointLight
          position={[0, 5.5, 0]}
          color="#FFF8E7"
          intensity={2.8 * intensity}
          distance={18}
          decay={1.8}
        />
      </group>

      {/* ============================================================== */}
      {/* 4. OVERHEAD CELESTIAL STAR-DOME HEMISPHERE (Images 2, 4)      */}
      {/* ============================================================== */}
      <group ref={domeRef} position={[0, 5.8, 0]}>
        {/* Hemispherical glass dome ribs */}
        <mesh>
          <sphereGeometry args={[8.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
          <meshStandardMaterial
            color="#0A1428"
            roughness={0.1}
            metalness={0.4}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Concentric Astronomical Meridian Ribs */}
        {[2.5, 4.5, 6.5].map((rad, idx) => (
          <mesh key={`dome-rib-${idx}`} position={[0, idx * 0.9, 0]}>
            <torusGeometry args={[rad, 0.05, 8, 36]} />
            <meshBasicMaterial
              color="#D4AF37"
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}

        {/* Constellation Glow Node Points */}
        <points>
          <sphereGeometry args={[8.1, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <pointsMaterial
            size={0.07}
            color="#7EE7F7"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* ============================================================== */}
      {/* 5. GENTLE FLOATING CELESTIAL STARDUST PARTICLES                */}
      {/* ============================================================== */}
      <points ref={dustRef} position={[0, -1.6, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#FFDF85"
          transparent
          opacity={0.45 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
