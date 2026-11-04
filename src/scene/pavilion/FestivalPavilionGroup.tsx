import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';
import { InteractiveBeacon, BeaconData } from './InteractiveBeacon';
import { TECHFEST_CONFIG } from '../../content/techfest';

interface FestivalPavilionGroupProps {
  materials: AetherMaterialPalette;
  visible: boolean;
  reducedMotion: boolean;
  onSelectBeacon: (beacon: BeaconData) => void;
}

/**
 * 3D Techfest Festival Pavilion (Chapter 03):
 * Modeled after IIT Bombay's Open Air Theatre / Convocation Hall architecture:
 * - Stepped circular amphitheater arena
 * - Kinetic floating canopy arches
 * - 4 interactive event beacons (Robowars, CoDecode, Aeromodelling, InnovateX)
 * - Central festival crystal flame
 */
export const FestivalPavilionGroup: React.FC<FestivalPavilionGroupProps> = ({
  materials,
  visible,
  reducedMotion,
  onSelectBeacon,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.Group>(null);
  const centralFlameRef = useRef<THREE.Mesh>(null);

  // 4 Verified Flagship Festival Beacons
  const beacons: { data: BeaconData; pos: [number, number, number] }[] = useMemo(() => {
    return [
      {
        data: {
          id: 'robowars',
          title: 'International Robowars',
          subtitle: 'The Apex Combat Robotics Arena',
          category: 'Combat Robotics',
          description:
            'Asia’s premier combat robotics championship with 60kg and 15kg weapon-grade fighting machines engineered for extreme pneumatic impact and kinetic destruction.',
          prizePool: 'INR 1,200,000+ Prize Pool',
          verifiedUrl: TECHFEST_CONFIG.urls.competitions,
        },
        pos: [-2.4, 0.4, 0],
      },
      {
        data: {
          id: 'codecode',
          title: 'CoDecode Championship',
          subtitle: 'National Algorithmic Supremacy',
          category: 'Competitive Programming',
          description:
            'A battle of algorithmic mastery testing high-speed dynamic programming, graph theory, mathematical reasoning, and data structure optimization under strict time limits.',
          prizePool: 'INR 500,000+ Prize Pool',
          verifiedUrl: TECHFEST_CONFIG.urls.competitions,
        },
        pos: [0, 0.4, 2.4],
      },
      {
        data: {
          id: 'aeromodelling',
          title: 'Boeing Aeromodelling',
          subtitle: 'Aero-Design & Flight Dynamics',
          category: 'Aerospace Engineering',
          description:
            'Challenging student aeronautical teams to design, fabricate, and fly radio-controlled fixed-wing aircraft executing precision maneuvers and payload drops.',
          prizePool: 'INR 600,000+ Prize Pool',
          verifiedUrl: TECHFEST_CONFIG.urls.competitions,
        },
        pos: [2.4, 0.4, 0],
      },
      {
        data: {
          id: 'innovatex',
          title: 'InnovateX Solutions',
          subtitle: 'Grassroots Sustainability & Clean Tech',
          category: 'Ecological Innovation',
          description:
            'Pioneering sustainable engineering prototypes, clean water cycles, decentralized renewable grids, and circular economy hardware solving urgent global issues.',
          prizePool: 'INR 800,000+ Incubation & Grants',
          verifiedUrl: TECHFEST_CONFIG.urls.competitions,
        },
        pos: [0, 0.4, -2.4],
      },
    ];
  }, []);

  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    // Smooth visibility scaling
    const targetScale = visible ? 1 : 0.001;
    masterGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    if (!visible || reducedMotion) return;
    const time = state.clock.getElapsedTime();

    // Canopy slow hovering rotation
    if (canopyRef.current) {
      canopyRef.current.rotation.y += delta * 0.05;
      canopyRef.current.position.y = 2.4 + Math.sin(time * 0.8) * 0.06;
    }

    // Central flame pulse
    if (centralFlameRef.current) {
      const pulse = 1.0 + Math.sin(time * 4) * 0.12;
      centralFlameRef.current.scale.set(pulse, 1.0 + Math.cos(time * 5) * 0.15, pulse);
      centralFlameRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, -0.8, 0]}>
      {/* 1. Terraced Circular Amphitheater Arena */}
      {/* Bottom tier */}
      <mesh material={materials.darkWalnut} position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[3.8, 4.0, 0.18, 48]} />
      </mesh>
      <mesh material={materials.agedBrass} position={[0, -0.2, 0]}>
        <torusGeometry args={[3.82, 0.03, 12, 48]} />
      </mesh>

      {/* Middle tier */}
      <mesh material={materials.darkWalnut} position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.18, 48]} />
      </mesh>
      <mesh material={materials.agedBrass} position={[0, -0.02, 0]}>
        <torusGeometry args={[3.22, 0.03, 12, 48]} />
      </mesh>

      {/* Arena Stage Floor */}
      <mesh material={materials.castBronze} position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[2.6, 2.8, 0.14, 48]} />
      </mesh>
      <mesh material={materials.burnishedGold} position={[0, 0.12, 0]}>
        <ringGeometry args={[2.4, 2.58, 48]} />
      </mesh>

      {/* 2. Central Ceremonial Festival Prism / Eternal Tech Flame */}
      <group position={[0, 0.15, 0]}>
        <mesh material={materials.burnishedGold}>
          <cylinderGeometry args={[0.3, 0.38, 0.22, 16]} />
        </mesh>
        <mesh ref={centralFlameRef} position={[0, 0.35, 0]}>
          <octahedronGeometry args={[0.26, 0]} />
          <primitive object={materials.pulsarCore} attach="material" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.4, 0.015, 12, 24]} />
          <primitive object={materials.beaconHalo} attach="material" />
        </mesh>
      </group>

      {/* 3. The 4 Interactive Flagship Event Beacons */}
      {beacons.map((beacon, idx) => (
        <InteractiveBeacon
          key={idx}
          data={beacon.data}
          position={beacon.pos}
          materials={materials}
          reducedMotion={reducedMotion}
          onSelect={onSelectBeacon}
        />
      ))}

      {/* 4. Suspended Modern Geometric Canopy Arches */}
      <group ref={canopyRef} position={[0, 2.4, 0]}>
        {/* Tension ring */}
        <mesh material={materials.agedBrass}>
          <torusGeometry args={[3.2, 0.04, 16, 36]} />
        </mesh>
        <mesh material={materials.burnishedGold}>
          <torusGeometry args={[1.8, 0.03, 12, 24]} />
        </mesh>

        {/* 8 Radial tension cables */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]}
              rotation={[0, -angle, 0]}
              material={materials.darkPatinaSteel}
            >
              <boxGeometry args={[1.4, 0.02, 0.02]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
