import React, { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createAetherMaterials, disposeAetherPalette } from './materials/aetherMaterials';
import { CosmicEnvironment } from './environment/CosmicEnvironment';
import { EnginePedestal } from './components/EnginePedestal';
import { SideClockworkTrain } from './components/SideClockworkTrain';
import { ArmillaryEngine } from './components/ArmillaryEngine';
import { EngineeringWorldsGroup } from './worlds/EngineeringWorldsGroup';
import { FestivalPavilionGroup } from './pavilion/FestivalPavilionGroup';
import { CameraController } from './camera/CameraController';
import { BeaconData } from './pavilion/InteractiveBeacon';

interface AetherEngineSceneProps {
  scrollProgress: number;
  activeDomain: string;
  activeDomainRing?: number;
  explodedView: boolean;
  reducedMotion: boolean;
  manualRotationRef?: React.RefObject<{ x: number; y: number }>;
  mousePositionRef?: React.RefObject<{ x: number; y: number }>;
  onSelectBeacon: (beacon: BeaconData) => void;
}

/**
 * Master 3D Scene Orchestrator for The Aether Engine:
 * Manages the transitions across the 5 Narrative Chapters:
 * 1. Opening: The complete Aether Engine floating in deep space
 * 2. Chapter 01: Macro dive into the moving clockwork gears & celestial core
 * 3. Chapter 02: Real 3D Spatial Worlds of Engineering (Robotics, Aero, Computing, Clean Energy)
 * 4. Chapter 03: 3D Techfest Festival Pavilion with 4 interactive beacons
 * 5. Final Chapter: Full grand pullback framing the illuminated engine over the portal
 */
export const AetherEngineScene: React.FC<AetherEngineSceneProps> = ({
  scrollProgress,
  activeDomain,
  activeDomainRing = 0,
  explodedView,
  reducedMotion,
  manualRotationRef,
  mousePositionRef,
  onSelectBeacon,
}) => {
  const engineGroupRef = useRef<THREE.Group>(null);

  // Initialize PBR materials and procedural canvas textures
  const { materials, textures } = useMemo(() => {
    return createAetherMaterials();
  }, []);

  // Dispose GPU textures & materials on unmount
  useEffect(() => {
    return () => {
      disposeAetherPalette(materials, textures);
    };
  }, [materials, textures]);

  // Determine chapter visibility thresholds
  // Chapter 00-01 (0.0 to 0.38): The Aether Engine
  // Chapter 02 (0.36 to 0.66): Quadrivium Engineering Worlds
  // Chapter 03 (0.64 to 0.88): Techfest Festival Pavilion
  // Final Chapter (0.86 to 1.0): Pullback to The Aether Engine
  const isEngineActive = scrollProgress < 0.38 || scrollProgress > 0.85;
  const isEngineeringActive = scrollProgress >= 0.36 && scrollProgress <= 0.66;
  const isPavilionActive = scrollProgress > 0.64 && scrollProgress <= 0.88;

  useFrame((state) => {
    if (!engineGroupRef.current) return;

    // Smooth visibility scaling for the primary engine sculpture
    const targetScale = isEngineActive ? 1.0 : 0.001;
    engineGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    if (isEngineActive) {
      const time = reducedMotion ? 0 : state.clock.getElapsedTime();
      const manualX = manualRotationRef?.current?.x ?? 0;
      const manualY = manualRotationRef?.current?.y ?? 0;

      // Base engine orientation driven by user drag and slow passive celestial drift
      const targetRotX = 0.18 + manualX + (reducedMotion ? 0 : Math.sin(time * 0.15) * 0.04);
      const targetRotY = manualY + (reducedMotion ? 0 : time * 0.08) + scrollProgress * Math.PI * 1.5;

      engineGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        engineGroupRef.current.rotation.x,
        targetRotX,
        0.08
      );
      engineGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        engineGroupRef.current.rotation.y,
        targetRotY,
        0.08
      );
    }
  });

  return (
    <>
      {/* 1. Cinematic Deep Space Starfield & Lighting Rig */}
      <CosmicEnvironment reducedMotion={reducedMotion} />

      {/* 2. Spline Camera Choreography */}
      <CameraController
        scrollProgress={scrollProgress}
        mousePositionRef={mousePositionRef}
        manualRotationRef={manualRotationRef}
        reducedMotion={reducedMotion}
      />

      {/* 3. The Signature Sculpture: The Aether Engine */}
      <group ref={engineGroupRef} position={[0, 0, 0]}>
        {/* Carved Walnut & Claw-Foot Pedestal */}
        <EnginePedestal materials={materials} />

        {/* Exposed Side Clockwork Gear Train */}
        <SideClockworkTrain
          materials={materials}
          reducedMotion={reducedMotion}
        />

        {/* Armillary Astronomical Spherical Mechanism */}
        <ArmillaryEngine
          materials={materials}
          activeDomainRing={activeDomainRing}
          explodedView={explodedView}
          reducedMotion={reducedMotion}
          scrollProgress={scrollProgress}
        />
      </group>

      {/* 4. Chapter 02: Quadrivium Engineering Worlds */}
      <EngineeringWorldsGroup
        materials={materials}
        activeDomain={activeDomain}
        visible={isEngineeringActive}
        reducedMotion={reducedMotion}
      />

      {/* 5. Chapter 03: Techfest Festival Pavilion & Interactive Beacons */}
      <FestivalPavilionGroup
        materials={materials}
        visible={isPavilionActive}
        reducedMotion={reducedMotion}
        onSelectBeacon={onSelectBeacon}
      />
    </>
  );
};
