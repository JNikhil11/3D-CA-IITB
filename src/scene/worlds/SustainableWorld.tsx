import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface SustainableWorldProps {
  materials: AetherMaterialPalette;
  reducedMotion: boolean;
  active: boolean;
}

/**
 * 3D Sustainable Engineering & Earth Systems World:
 * - Toroidal Fusion Tokamak with 16 D-shaped magnetic coils and glowing plasma torus
 * - Helical vertical-axis wind turbine with curved kinetic blades
 * - Geodesic ecology biosphere dome
 */
export const SustainableWorld: React.FC<SustainableWorldProps> = ({
  materials,
  reducedMotion,
  active,
}) => {
  const tokamakGroupRef = useRef<THREE.Group>(null);
  const plasmaTorusRef = useRef<THREE.Mesh>(null);
  const turbineRotorRef = useRef<THREE.Group>(null);
  const biosphereRef = useRef<THREE.Group>(null);

  // 16 D-shaped magnetic confinement coils
  const coilAngles = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 16; i++) {
      list.push((i / 16) * Math.PI * 2);
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion || !active) return;
    const time = state.clock.getElapsedTime();

    // 1. Tokamak plasma torus breathing & circulation
    if (plasmaTorusRef.current) {
      plasmaTorusRef.current.rotation.z += delta * 0.8;
      const pulse = 1.0 + Math.sin(time * 3) * 0.05;
      plasmaTorusRef.current.scale.set(pulse, pulse, pulse);
    }

    // 2. Continuous wind turbine rotation
    if (turbineRotorRef.current) {
      turbineRotorRef.current.rotation.y += delta * 1.5;
    }

    // 3. Biosphere gentle levitation
    if (biosphereRef.current) {
      biosphereRef.current.position.y = 0.8 + Math.sin(time * 0.7) * 0.08;
      biosphereRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* ======================================================== */}
      {/* 1. TOROIDAL FUSION TOKAMAK REACTOR                       */}
      {/* ======================================================== */}
      <group ref={tokamakGroupRef} position={[-0.8, -0.4, 0]}>
        {/* Glowing Magenta / Cyan Fusion Plasma Torus */}
        <mesh ref={plasmaTorusRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.22, 24, 48]} />
          <primitive object={materials.tokamakMagenta} attach="material" />
        </mesh>

        {/* 16 D-shaped Magnetic Poloidal/Toroidal Field Coils */}
        {coilAngles.map((angle, idx) => (
          <group key={idx} rotation={[0, angle, 0]}>
            <mesh position={[1.15, 0, 0]} material={materials.burnishedGold} castShadow>
              <torusGeometry args={[0.38, 0.045, 12, 24]} />
            </mesh>
            <mesh position={[1.15, 0, 0]} material={materials.castBronze}>
              <boxGeometry args={[0.12, 0.88, 0.05]} />
            </mesh>
          </group>
        ))}

        {/* Central Cryogenic Solenoid Column */}
        <mesh material={materials.darkPatinaSteel} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 1.2, 24]} />
        </mesh>
        <mesh material={materials.agedBrass} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.2, 24]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. HELICAL VERTICAL-AXIS WIND TURBINE                   */}
      {/* ======================================================== */}
      <group position={[1.4, -0.5, 0.6]}>
        {/* Turbine Foundation Plinth */}
        <mesh material={materials.castBronze} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.16, 16]} />
        </mesh>
        {/* Mast Spindle */}
        <mesh material={materials.darkPatinaSteel} position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
        </mesh>

        {/* Rotating 3-Blade Helical Rotor */}
        <group ref={turbineRotorRef} position={[0, 0.9, 0]}>
          {/* Top & bottom aerodynamic hub spiders */}
          <mesh position={[0, 0.7, 0]} material={materials.agedBrass}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 12]} />
          </mesh>
          <mesh position={[0, -0.7, 0]} material={materials.agedBrass}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 12]} />
          </mesh>

          {/* 3 Curved Aerodynamic Blades (120 deg apart) */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((bladeAngle, bIdx) => (
            <group key={bIdx} rotation={[0, bladeAngle, 0]}>
              {/* Connecting strut arms */}
              <mesh position={[0.26, 0.7, 0]} material={materials.agedBrass}>
                <boxGeometry args={[0.48, 0.02, 0.04]} />
              </mesh>
              <mesh position={[0.26, -0.7, 0]} material={materials.agedBrass}>
                <boxGeometry args={[0.48, 0.02, 0.04]} />
              </mesh>
              {/* Curved airfoil blade segment */}
              <mesh position={[0.5, 0, 0]} material={materials.burnishedGold}>
                <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. GEODESIC ECOLOGY BIOSPHERE DOME                      */}
      {/* ======================================================== */}
      <group ref={biosphereRef} position={[0.2, 0.8, -0.8]}>
        {/* Emerald Biosphere Glass Shell */}
        <mesh material={materials.emeraldBiosphere} castShadow>
          <sphereGeometry args={[0.7, 24, 24]} />
        </mesh>
        {/* Geodesic Hexagonal Lattice Framing */}
        <mesh>
          <sphereGeometry args={[0.71, 12, 12]} />
          <meshBasicMaterial color="#E8C372" wireframe transparent opacity={0.5} />
        </mesh>
        {/* Inner Bio-Energy Core */}
        <mesh material={materials.pulsarCore}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
};
