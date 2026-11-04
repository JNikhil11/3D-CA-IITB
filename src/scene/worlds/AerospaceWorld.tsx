import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface AerospaceWorldProps {
  materials: AetherMaterialPalette;
  reducedMotion: boolean;
  active: boolean;
}

/**
 * 3D Aerospace & Atmospheric Dynamics World:
 * - High-detail deep space satellite craft with gold foil thermal bus
 * - Deployable photovoltaic solar panel array wings
 * - High-gain parabolic antenna dish with focal feed
 * - Hall-effect ion propulsion thruster with glowing plasma exhaust plume
 */
export const AerospaceWorld: React.FC<AerospaceWorldProps> = ({
  materials,
  reducedMotion,
  active,
}) => {
  const satelliteBusRef = useRef<THREE.Group>(null);
  const solarWingsRef = useRef<THREE.Group>(null);
  const dishAntennaRef = useRef<THREE.Group>(null);
  const ionThrusterRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reducedMotion || !active) return;
    const time = state.clock.getElapsedTime();

    // Subtle orbital attitude drift
    if (satelliteBusRef.current) {
      satelliteBusRef.current.rotation.y += delta * 0.12;
      satelliteBusRef.current.rotation.x = Math.sin(time * 0.3) * 0.08;
      satelliteBusRef.current.position.y = Math.sin(time * 0.5) * 0.08;
    }

    // Parabolic antenna tracking sweep
    if (dishAntennaRef.current) {
      dishAntennaRef.current.rotation.y = Math.sin(time * 0.25) * 0.35;
    }

    // Ion thruster pulse
    if (ionThrusterRef.current) {
      ionThrusterRef.current.scale.z = 1.0 + Math.sin(time * 12) * 0.15;
    }
  });

  return (
    <group ref={satelliteBusRef} position={[0, 0, 0]}>
      {/* 1. Main Spacecraft Octagonal Bus Chassis (Gold Kapton Foil) */}
      <mesh material={materials.burnishedGold} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 1.3, 8]} />
      </mesh>

      {/* Equipment bay reinforcement trusses */}
      <mesh position={[0, 0.65, 0]} material={materials.castBronze}>
        <cylinderGeometry args={[0.76, 0.76, 0.08, 8]} />
      </mesh>
      <mesh position={[0, -0.65, 0]} material={materials.castBronze}>
        <cylinderGeometry args={[0.76, 0.76, 0.08, 8]} />
      </mesh>

      {/* 2. Deployable Photovoltaic Solar Array Wings */}
      <group ref={solarWingsRef}>
        {/* Left Solar Wing */}
        <group position={[-1.9, 0, 0]}>
          {/* Main solar panel surface */}
          <mesh material={materials.solarPanel} castShadow>
            <boxGeometry args={[2.0, 0.95, 0.04]} />
          </mesh>
          {/* Gilded structural frame */}
          <mesh material={materials.agedBrass}>
            <boxGeometry args={[2.04, 0.99, 0.02]} />
          </mesh>
          {/* Articulation hinge boom connecting to bus */}
          <mesh position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          </mesh>
        </group>

        {/* Right Solar Wing */}
        <group position={[1.9, 0, 0]}>
          <mesh material={materials.solarPanel} castShadow>
            <boxGeometry args={[2.0, 0.95, 0.04]} />
          </mesh>
          <mesh material={materials.agedBrass}>
            <boxGeometry args={[2.04, 0.99, 0.02]} />
          </mesh>
          <mesh position={[-1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          </mesh>
        </group>
      </group>

      {/* 3. Parabolic High-Gain Communications Dish Antenna */}
      <group ref={dishAntennaRef} position={[0, 0.9, 0.35]} rotation={[-0.45, 0, 0]}>
        {/* Parabolic reflector bowl */}
        <mesh material={materials.agedBrass} castShadow>
          <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        </mesh>
        {/* Golden feed horn tripod */}
        <mesh position={[0, 0.28, 0]} material={materials.burnishedGold}>
          <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
        </mesh>
        <mesh position={[0, 0.42, 0]} material={materials.vermilionRuby}>
          <sphereGeometry args={[0.04, 10, 10]} />
        </mesh>
      </group>

      {/* 4. Aft Hall-Effect Ion Propulsion Thruster Engine */}
      <group position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
        {/* Thruster nozzle bell */}
        <mesh material={materials.darkPatinaSteel} castShadow>
          <cylinderGeometry args={[0.34, 0.22, 0.38, 20]} />
        </mesh>
        {/* Inner magnetic anode ring */}
        <mesh position={[0, -0.15, 0]} material={materials.agedBrass}>
          <torusGeometry args={[0.26, 0.03, 12, 24]} />
        </mesh>

        {/* Glowing Cyan Ion Plasma Plume */}
        <mesh ref={ionThrusterRef} position={[0, -0.58, 0]}>
          <coneGeometry args={[0.28, 0.75, 16, 1, true]} />
          <primitive object={materials.plasmaCyan} attach="material" />
        </mesh>
      </group>

      {/* Optical Star Tracker Barrel on side */}
      <mesh position={[0.65, 0.2, 0.45]} rotation={[0.4, 0.6, 0]} material={materials.darkPatinaSteel}>
        <cylinderGeometry args={[0.08, 0.08, 0.26, 16]} />
      </mesh>
    </group>
  );
};
