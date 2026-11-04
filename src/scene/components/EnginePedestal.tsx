import React, { useMemo } from 'react';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface EnginePedestalProps {
  materials: AetherMaterialPalette;
}

/**
 * Museum-grade Renaissance pedestal matching reference image:
 * - 4 sculptured brass claw feet holding spheres
 * - Stepped dark walnut plinth
 * - Carved egg-and-dart brass ring
 * - Fluted baluster column
 * - Ornate U-shaped gimbal cradle fork with trunnion mounts
 */
export const EnginePedestal: React.FC<EnginePedestalProps> = ({ materials }) => {
  // Pre-calculate claw foot positions at 4 corners
  const clawPositions = useMemo(() => {
    const r = 1.35;
    return [
      { x: r * Math.cos(Math.PI * 0.25), z: r * Math.sin(Math.PI * 0.25), rot: -Math.PI * 0.25 },
      { x: r * Math.cos(Math.PI * 0.75), z: r * Math.sin(Math.PI * 0.75), rot: -Math.PI * 0.75 },
      { x: r * Math.cos(Math.PI * 1.25), z: r * Math.sin(Math.PI * 1.25), rot: -Math.PI * 1.25 },
      { x: r * Math.cos(Math.PI * 1.75), z: r * Math.sin(Math.PI * 1.75), rot: -Math.PI * 1.75 },
    ];
  }, []);

  return (
    <group position={[0, -2.85, 0]}>
      {/* 1. Stepped Dark Walnut Wood Plinth */}
      {/* Lower plinth tier */}
      <mesh
        position={[0, 0.08, 0]}
        material={materials.darkWalnut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.5, 1.62, 0.16, 48]} />
      </mesh>

      {/* Middle wood tier */}
      <mesh
        position={[0, 0.24, 0]}
        material={materials.darkWalnut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.32, 1.45, 0.16, 48]} />
      </mesh>

      {/* Upper wood tier */}
      <mesh
        position={[0, 0.38, 0]}
        material={materials.darkWalnut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.18, 1.28, 0.12, 48]} />
      </mesh>

      {/* 2. Four Brass Claw Feet at plinth corners */}
      {clawPositions.map((pos, idx) => (
        <group key={idx} position={[pos.x, 0.04, pos.z]} rotation={[0, pos.rot, 0]}>
          {/* Claw holding brass orb */}
          <mesh material={materials.agedBrass} position={[0, -0.04, 0]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          {/* Main claw talon */}
          <mesh
            material={materials.castBronze}
            position={[0.08, 0.08, 0]}
            rotation={[0, 0, -0.35]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.14, 0.24, 12]} />
          </mesh>
          {/* Upper claw bracket fixing to wood */}
          <mesh material={materials.agedBrass} position={[0.02, 0.2, 0]} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.2]} />
          </mesh>
        </group>
      ))}

      {/* 3. Carved Egg-and-Dart Brass Frieze Ring */}
      <mesh
        position={[0, 0.48, 0]}
        material={materials.agedBrass}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.1, 1.15, 0.1, 48]} />
      </mesh>
      {/* Relief beads around ring */}
      <mesh position={[0, 0.48, 0]} material={materials.burnishedGold}>
        <torusGeometry args={[1.12, 0.035, 12, 48]} />
      </mesh>

      {/* 4. Fluted Central Baluster Column */}
      {/* Lower column base */}
      <mesh position={[0, 0.62, 0]} material={materials.agedBrass} castShadow>
        <cylinderGeometry args={[0.55, 0.85, 0.18, 36]} />
      </mesh>
      {/* Torus waist ring */}
      <mesh position={[0, 0.74, 0]} material={materials.burnishedGold} castShadow>
        <torusGeometry args={[0.58, 0.06, 16, 36]} />
      </mesh>
      {/* Baluster body */}
      <mesh position={[0, 0.98, 0]} material={materials.agedBrass} castShadow>
        <cylinderGeometry args={[0.38, 0.52, 0.36, 36]} />
      </mesh>
      {/* Baluster neck */}
      <mesh position={[0, 1.22, 0]} material={materials.burnishedGold} castShadow>
        <cylinderGeometry args={[0.42, 0.32, 0.18, 36]} />
      </mesh>
      {/* Column capital */}
      <mesh position={[0, 1.36, 0]} material={materials.agedBrass} castShadow>
        <cylinderGeometry args={[0.65, 0.42, 0.12, 36]} />
      </mesh>

      {/* 5. Ornate U-shaped Cradle Fork Arms */}
      {/* Central cradle pivot hub */}
      <mesh position={[0, 1.48, 0]} material={materials.castBronze} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.16, 24]} />
      </mesh>

      {/* Left semicircular cradle arm rising up to meridian trunnion */}
      <group position={[-1.75, 2.2, 0]} rotation={[0, 0, Math.PI * 0.12]}>
        <mesh material={materials.agedBrass} castShadow>
          <boxGeometry args={[0.18, 1.6, 0.14]} />
        </mesh>
        {/* Acanthus decorative scrollwork */}
        <mesh position={[0.1, -0.3, 0]} material={materials.burnishedGold} castShadow>
          <torusGeometry args={[0.22, 0.05, 12, 24, Math.PI * 1.2]} />
        </mesh>
        {/* Trunnion bearing collar at top */}
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.castBronze}>
          <cylinderGeometry args={[0.18, 0.18, 0.22, 20]} />
        </mesh>
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        </mesh>
      </group>

      {/* Right semicircular cradle arm rising up to clockwork trunnion */}
      <group position={[1.75, 2.2, 0]} rotation={[0, 0, -Math.PI * 0.12]}>
        <mesh material={materials.agedBrass} castShadow>
          <boxGeometry args={[0.18, 1.6, 0.14]} />
        </mesh>
        {/* Acanthus decorative scrollwork */}
        <mesh position={[-0.1, -0.3, 0]} material={materials.burnishedGold} castShadow>
          <torusGeometry args={[0.22, 0.05, 12, 24, Math.PI * 1.2]} />
        </mesh>
        {/* Trunnion bearing collar at top */}
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.castBronze}>
          <cylinderGeometry args={[0.18, 0.18, 0.22, 20]} />
        </mesh>
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        </mesh>
      </group>
    </group>
  );
};
