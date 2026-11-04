import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

export interface BeaconData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  prizePool: string;
  verifiedUrl: string;
}

interface InteractiveBeaconProps {
  data: BeaconData;
  position: [number, number, number];
  materials: AetherMaterialPalette;
  reducedMotion: boolean;
  onSelect: (beacon: BeaconData) => void;
}

/**
 * 3D Interactive Spatial Beacon for Chapter 03 (The Techfest Experience):
 * Interactive pointer raycasting with hover reaction, pulsing radar rings, and click inspection.
 */
export const InteractiveBeacon: React.FC<InteractiveBeaconProps> = ({
  data,
  position,
  materials,
  reducedMotion,
  onSelect,
}) => {
  const beaconGroupRef = useRef<THREE.Group>(null);
  const radarRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Restore cursor on unmount to prevent global pointer leak
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const time = state.clock.getElapsedTime();

    if (beaconGroupRef.current) {
      // Gentle floating levitation
      beaconGroupRef.current.position.y =
        position[1] + Math.sin(time * 2 + position[0]) * 0.12;
      beaconGroupRef.current.rotation.y += delta * (hovered ? 0.8 : 0.25);
    }

    if (radarRingRef.current) {
      // Expanding pulsing radar echo ring
      const cycle = (time * 1.5) % 1;
      radarRingRef.current.scale.set(1 + cycle * 0.8, 1 + cycle * 0.8, 1);
      const ringMat = radarRingRef.current.material as THREE.MeshBasicMaterial;
      if (ringMat) {
        ringMat.opacity = Math.max(0, 0.8 - cycle * 0.8);
      }
    }
  });

  const getBeaconIcon = () => {
    switch (data.id) {
      case 'robowars':
        return (
          <group>
            {/* Combat battlebot wedge */}
            <mesh material={materials.vermilionRuby} castShadow>
              <coneGeometry args={[0.24, 0.45, 4]} />
            </mesh>
            <mesh position={[0, -0.15, 0]} material={materials.castBronze}>
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
            </mesh>
          </group>
        );
      case 'codecode':
        return (
          <group>
            {/* Algorithmic hypercube brackets */}
            <mesh>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshBasicMaterial color="#00F0FF" wireframe />
            </mesh>
            <mesh material={materials.pulsarCore}>
              <sphereGeometry args={[0.1, 12, 12]} />
            </mesh>
          </group>
        );
      case 'aeromodelling':
        return (
          <group rotation={[Math.PI * 0.2, 0, 0]}>
            {/* Delta-wing aerial glider */}
            <mesh material={materials.burnishedGold} castShadow>
              <coneGeometry args={[0.28, 0.6, 3]} />
            </mesh>
            <mesh position={[0, -0.2, 0]} material={materials.darkPatinaSteel}>
              <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
            </mesh>
          </group>
        );
      case 'innovatex':
      default:
        return (
          <group>
            {/* Grassroots ecological energy sphere */}
            <mesh material={materials.emeraldBiosphere}>
              <sphereGeometry args={[0.22, 16, 16]} />
            </mesh>
            <mesh material={materials.burnishedGold}>
              <torusGeometry args={[0.28, 0.02, 12, 24]} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group position={position}>
      {/* Interactive Raycast Hit Target */}
      <group
        ref={beaconGroupRef}
        scale={hovered ? 1.25 : 1.0}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
      >
        {/* Beacon Floating Icon Geometry */}
        {getBeaconIcon()}

        {/* Outer Halo Orbit */}
        <mesh material={materials.burnishedGold}>
          <torusGeometry args={[0.42, 0.015, 12, 32]} />
        </mesh>

        {/* Pulsing Radar Ground Ring */}
        <mesh
          ref={radarRingRef}
          position={[0, -0.6, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.45, 0.52, 32]} />
          <meshBasicMaterial
            color={hovered ? '#00F0FF' : '#E8C372'}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Vertical Light Column from ground anchor */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
          <meshBasicMaterial
            color={hovered ? '#00F0FF' : '#FFEAA7'}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Ground Anchor Pedestal Disc */}
      <mesh position={[0, -0.62, 0]} material={materials.castBronze}>
        <cylinderGeometry args={[0.4, 0.45, 0.06, 24]} />
      </mesh>
    </group>
  );
};
