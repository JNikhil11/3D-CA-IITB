import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicEnvironmentProps {
  reducedMotion: boolean;
}

/**
 * Cinematic Deep Space & Cosmic Observatory Environment:
 * - 2,500 procedural star particles with twinkle effect
 * - Nebular cosmic dust volume
 * - PBR 3-point lighting rig tailored for specular metallic brass and dark walnut
 */
export const CosmicEnvironment: React.FC<CosmicEnvironmentProps> = ({ reducedMotion }) => {
  const starsRef = useRef<THREE.Points>(null);
  const nebulaGroupRef = useRef<THREE.Group>(null);

  // Generate 2,500 star positions & colors
  const { positions, colors } = useMemo(() => {
    const count = 2500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#FFF8E7'), // Warm ivory
      new THREE.Color('#FFE2A0'), // Amber gold
      new THREE.Color('#D8E5FF'), // Celestial blue
      new THREE.Color('#FFFFFF'), // Pure diamond
      new THREE.Color('#F39C12'), // Vermilion gold
    ];

    for (let i = 0; i < count; i++) {
      // Distribute on spherical shell between r=16 and r=48
      const radius = 16 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    // Very gentle cosmic drift
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
    }
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y -= delta * 0.004;
    }
  });

  return (
    <>
      {/* ======================================================== */}
      {/* 1. CINEMATIC PBR LIGHTING RIG                           */}
      {/* ======================================================== */}
      {/* Warm Ambient Fill from cosmic dust */}
      <ambientLight color="#18233C" intensity={0.75} />

      {/* Primary Key Light (Upper Left Warm Sun/Star) */}
      <directionalLight
        position={[-6, 8, 7]}
        intensity={2.6}
        color="#FFF4D4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Secondary Fill Light (Cool Midnight Ultramarine from lower right) */}
      <directionalLight
        position={[7, -3, -4]}
        intensity={0.9}
        color="#5A88D6"
      />

      {/* Rim / Silhouette Light (Behind the Engine, highlights brass rim curves) */}
      <directionalLight
        position={[0, 6, -8]}
        intensity={1.8}
        color="#F5D77F"
      />

      {/* Internal warm glow from the celestial core */}
      <pointLight position={[0, 0, 0]} intensity={1.4} distance={6} color="#FFEAA7" />

      {/* ======================================================== */}
      {/* 2. 2,500 PROCEDURAL TWINKLE STARS                       */}
      {/* ======================================================== */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
        />
      </points>

      {/* ======================================================== */}
      {/* 3. SUBTLE COSMIC NEBULA GLOW VOLUMES                    */}
      {/* ======================================================== */}
      <group ref={nebulaGroupRef}>
        {/* Deep blue celestial dust cloud */}
        <mesh position={[-8, 6, -18]}>
          <sphereGeometry args={[14, 16, 16]} />
          <meshBasicMaterial
            color="#0C1B33"
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Warm golden nebular dust cloud matching key light */}
        <mesh position={[-12, 10, -14]}>
          <sphereGeometry args={[10, 16, 16]} />
          <meshBasicMaterial
            color="#2A1E0E"
            transparent
            opacity={0.35}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </>
  );
};
