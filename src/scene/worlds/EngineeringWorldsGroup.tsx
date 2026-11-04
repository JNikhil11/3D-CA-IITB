import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';
import { RoboticsWorld } from './RoboticsWorld';
import { AerospaceWorld } from './AerospaceWorld';
import { ComputationalWorld } from './ComputationalWorld';
import { SustainableWorld } from './SustainableWorld';

interface EngineeringWorldsGroupProps {
  materials: AetherMaterialPalette;
  activeDomain: string; // 'robotics' | 'aerospace' | 'ai-computing' | 'clean-innovation'
  visible: boolean;
  reducedMotion: boolean;
}

/**
 * Coordinates spatial placement and transitions among the 4 Quadrivium Engineering Worlds:
 * Smoothly blends active world to the center stage and orbits the other three.
 */
export const EngineeringWorldsGroup: React.FC<EngineeringWorldsGroupProps> = ({
  materials,
  activeDomain,
  visible,
  reducedMotion,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const roboticsRef = useRef<THREE.Group>(null);
  const aerospaceRef = useRef<THREE.Group>(null);
  const computingRef = useRef<THREE.Group>(null);
  const sustainableRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!masterGroupRef.current) return;

    // Master visibility scale (0 when inactive, 1 when visible)
    const targetScale = visible ? 1 : 0.001;
    masterGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    if (!visible) return;

    // Mapping domains to center positions
    // The active domain stays at [0, 0, 0] with scale 1.0
    // Inactive domains offset into peripheral vantage points
    const worldConfigs: Record<
      string,
      {
        activeScale: number;
        inactiveScale: number;
        offset: [number, number, number];
      }
    > = {
      robotics: { activeScale: 1.0, inactiveScale: 0.35, offset: [-3.8, 1.8, -2.5] },
      aerospace: { activeScale: 1.0, inactiveScale: 0.35, offset: [3.8, 1.8, -2.5] },
      'ai-computing': { activeScale: 1.0, inactiveScale: 0.35, offset: [-3.8, -1.8, -2.5] },
      'clean-innovation': { activeScale: 1.0, inactiveScale: 0.35, offset: [3.8, -1.8, -2.5] },
    };

    const updateWorldTransform = (
      groupRef: React.RefObject<THREE.Group | null>,
      domainKey: string
    ) => {
      if (!groupRef.current) return;
      const isActive = activeDomain === domainKey;
      const targetPos = isActive
        ? new THREE.Vector3(0, 0, 0)
        : new THREE.Vector3(...worldConfigs[domainKey].offset);
      const targetS = isActive
        ? worldConfigs[domainKey].activeScale
        : worldConfigs[domainKey].inactiveScale;

      groupRef.current.position.lerp(targetPos, 0.08);
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetS, targetS, targetS),
        0.08
      );
    };

    updateWorldTransform(roboticsRef, 'robotics');
    updateWorldTransform(aerospaceRef, 'aerospace');
    updateWorldTransform(computingRef, 'ai-computing');
    updateWorldTransform(sustainableRef, 'clean-innovation');
  });

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      <group ref={roboticsRef}>
        <RoboticsWorld
          materials={materials}
          reducedMotion={reducedMotion}
          active={visible && activeDomain === 'robotics'}
        />
      </group>

      <group ref={aerospaceRef}>
        <AerospaceWorld
          materials={materials}
          reducedMotion={reducedMotion}
          active={visible && activeDomain === 'aerospace'}
        />
      </group>

      <group ref={computingRef}>
        <ComputationalWorld
          materials={materials}
          reducedMotion={reducedMotion}
          active={visible && activeDomain === 'ai-computing'}
        />
      </group>

      <group ref={sustainableRef}>
        <SustainableWorld
          materials={materials}
          reducedMotion={reducedMotion}
          active={visible && activeDomain === 'clean-innovation'}
        />
      </group>
    </group>
  );
};
