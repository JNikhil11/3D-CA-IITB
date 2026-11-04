/**
 * The Radiant Stellar Core of the Aether Temple Engine
 *
 * Implements the incandescent sun sphere surrounded by physical 3D
 * cooling slats/louvers, equatorial magnetic clamps, and high-intensity
 * point light illumination.
 */

import React, { useRef } from 'react';
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

  const sunTexture = React.useMemo(() => createGlowingSunTexture(), []);

  React.useEffect(() => {
    return () => {
      sunTexture.dispose();
    };
  }, [sunTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle thermal pulse on the core
    if (innerSunRef.current) {
      innerSunRef.current.rotation.y += delta * 0.12;
      const pulse = 1.0 + Math.sin(t * 2.5) * 0.025;
      innerSunRef.current.scale.set(pulse, pulse, pulse);
    }

    // Dynamic light pulsation matching target image incandescence
    if (lightRef.current) {
      lightRef.current.intensity = 24.0 + Math.sin(t * 3.5) * 3.0;
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.08;
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
