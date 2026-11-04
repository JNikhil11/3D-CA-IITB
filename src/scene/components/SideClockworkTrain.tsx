import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface SideClockworkTrainProps {
  materials: AetherMaterialPalette;
  reducedMotion: boolean;
}

/**
 * Exposed Renaissance side-mounted clockwork gear train matching reference photo:
 * - Roman numeral clock face disc (I - XII)
 * - Interlocking brass spur gears with cut teeth
 * - 3-stage reduction pinions
 * - Oscillating escapement anchor pallet
 * - Rotating clock hands driven by mechanical gear ratios
 */
export const SideClockworkTrain: React.FC<SideClockworkTrainProps> = ({
  materials,
  reducedMotion,
}) => {
  const dialRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const mainSpurGearRef = useRef<THREE.Group>(null);
  const intermediateGearRef = useRef<THREE.Group>(null);
  const escapeWheelRef = useRef<THREE.Group>(null);
  const anchorPalletRef = useRef<THREE.Group>(null);

  // Pre-calculate gear teeth angles
  const mainGearTeeth = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 36; i++) {
      list.push((i / 36) * Math.PI * 2);
    }
    return list;
  }, []);

  const pinionTeeth = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 18; i++) {
      list.push((i / 18) * Math.PI * 2);
    }
    return list;
  }, []);

  const escapeTeeth = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 15; i++) {
      list.push((i / 15) * Math.PI * 2);
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const time = state.clock.getElapsedTime();

    // 1. Minute hand completes rotation smoothly
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z -= delta * 0.4;
    }

    // 2. Hour hand rotates at 1/12th rate
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z -= delta * (0.4 / 12);
    }

    // 3. Main spur gear driving clock train
    if (mainSpurGearRef.current) {
      mainSpurGearRef.current.rotation.z += delta * 0.2;
    }

    // 4. Intermediate reduction gear rotates counter
    if (intermediateGearRef.current) {
      intermediateGearRef.current.rotation.z -= delta * 0.4;
    }

    // 5. High-speed escape wheel
    if (escapeWheelRef.current) {
      escapeWheelRef.current.rotation.z += delta * 1.2;
    }

    // 6. Rhythmic escapement anchor pallet rocking (tick-tock)
    if (anchorPalletRef.current) {
      anchorPalletRef.current.rotation.z = Math.sin(time * 8) * 0.18;
    }
  });

  return (
    <group position={[1.45, -0.25, 1.15]} rotation={[0.15, -0.35, -0.05]}>
      {/* Heavy brass mounting bracket clamping to the meridian arm */}
      <mesh material={materials.castBronze} position={[-0.35, 0, -0.15]} castShadow>
        <boxGeometry args={[0.3, 0.45, 0.15]} />
      </mesh>
      <mesh material={materials.darkPatinaSteel} position={[-0.35, 0, -0.06]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
      </mesh>

      {/* Rear clockwork backplate (skeletonized brass frame) */}
      <mesh material={materials.agedBrass} position={[0, 0, -0.12]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.04, 32]} />
      </mesh>
      <mesh material={materials.castBronze} position={[0, 0, -0.14]}>
        <ringGeometry args={[0.82, 0.94, 32]} />
      </mesh>

      {/* Exposed Interlocking Gear Train */}
      {/* 1. Main Driving Spur Gear */}
      <group ref={mainSpurGearRef} position={[0, 0, -0.06]}>
        <mesh material={materials.burnishedGold}>
          <cylinderGeometry args={[0.78, 0.78, 0.03, 36]} />
        </mesh>
        {/* Gear spoke cutouts */}
        <mesh material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        </mesh>
        {/* Teeth */}
        {mainGearTeeth.map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 0.81, Math.sin(angle) * 0.81, 0]}
            rotation={[0, 0, angle]}
            material={materials.burnishedGold}
          >
            <boxGeometry args={[0.04, 0.06, 0.03]} />
          </mesh>
        ))}
      </group>

      {/* 2. Intermediate Pinion Gear */}
      <group ref={intermediateGearRef} position={[0.48, -0.52, -0.04]}>
        <mesh material={materials.agedBrass}>
          <cylinderGeometry args={[0.36, 0.36, 0.03, 24]} />
        </mesh>
        {pinionTeeth.map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 0.38, Math.sin(angle) * 0.38, 0]}
            rotation={[0, 0, angle]}
            material={materials.agedBrass}
          >
            <boxGeometry args={[0.03, 0.045, 0.03]} />
          </mesh>
        ))}
        {/* Steel axle arbor */}
        <mesh material={materials.darkPatinaSteel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
        </mesh>
      </group>

      {/* 3. Escapement Mechanism (Escape Wheel & Anchor) */}
      <group position={[-0.42, -0.58, -0.05]}>
        {/* Escape wheel */}
        <group ref={escapeWheelRef}>
          <mesh material={materials.burnishedGold}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 16]} />
          </mesh>
          {escapeTeeth.map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0]}
              rotation={[0, 0, angle + 0.3]} // Ratchet tooth angle
              material={materials.burnishedGold}
            >
              <boxGeometry args={[0.02, 0.05, 0.02]} />
            </mesh>
          ))}
        </group>
        {/* Oscillating Escapement Anchor Pallet */}
        <group ref={anchorPalletRef} position={[0, 0.32, 0.02]}>
          <mesh material={materials.castBronze}>
            <boxGeometry args={[0.28, 0.04, 0.02]} />
          </mesh>
          {/* Left pallet claw */}
          <mesh position={[-0.14, -0.06, 0]} material={materials.darkPatinaSteel}>
            <boxGeometry args={[0.03, 0.09, 0.02]} />
          </mesh>
          {/* Right pallet claw */}
          <mesh position={[0.14, -0.06, 0]} material={materials.darkPatinaSteel}>
            <boxGeometry args={[0.03, 0.09, 0.02]} />
          </mesh>
          {/* Anchor pivot screw */}
          <mesh material={materials.agedBrass}>
            <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
          </mesh>
        </group>
      </group>

      {/* Pillars separating backplate and front dial */}
      {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, -0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.agedBrass}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.14, 12]} />
        </mesh>
      ))}

      {/* 4. Front Clock Face Dial Disc with Roman Numerals Texture */}
      <group ref={dialRef} position={[0, 0, 0.05]}>
        {/* Outer cast bronze bezel rim */}
        <mesh material={materials.castBronze} castShadow>
          <torusGeometry args={[0.88, 0.05, 16, 48]} />
        </mesh>
        {/* Inner beaded gold ring */}
        <mesh position={[0, 0, 0.01]} material={materials.burnishedGold}>
          <torusGeometry args={[0.84, 0.02, 12, 48]} />
        </mesh>

        {/* The Roman Numeral Dial Face (Circle using procedural canvas texture) */}
        <mesh
          material={materials.romanClockFace}
          position={[0, 0, 0.02]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <circleGeometry args={[0.85, 48]} />
        </mesh>

        {/* Center brass bushing arbor */}
        <mesh position={[0, 0, 0.04]} material={materials.agedBrass}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.06]} material={materials.burnishedGold}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>

        {/* 5. Ornate Renaissance Clock Hands */}
        {/* Hour Hand */}
        <group ref={hourHandRef} position={[0, 0, 0.04]}>
          {/* Heart/filigree spade shape on hour hand */}
          <mesh position={[0, 0.24, 0]} material={materials.darkPatinaSteel}>
            <boxGeometry args={[0.03, 0.38, 0.01]} />
          </mesh>
          <mesh position={[0, 0.34, 0]} material={materials.burnishedGold}>
            <sphereGeometry args={[0.05, 12, 12]} />
          </mesh>
          {/* Counterbalance tail */}
          <mesh position={[0, -0.1, 0]} material={materials.darkPatinaSteel}>
            <boxGeometry args={[0.025, 0.16, 0.01]} />
          </mesh>
        </group>

        {/* Minute Hand */}
        <group ref={minuteHandRef} position={[0, 0, 0.055]}>
          <mesh position={[0, 0.36, 0]} material={materials.darkPatinaSteel}>
            <boxGeometry args={[0.02, 0.58, 0.01]} />
          </mesh>
          {/* Arrow tip */}
          <mesh position={[0, 0.64, 0]} rotation={[0, 0, Math.PI / 4]} material={materials.burnishedGold}>
            <boxGeometry args={[0.06, 0.06, 0.01]} />
          </mesh>
          {/* Counterbalance crescent */}
          <mesh position={[0, -0.14, 0]} material={materials.darkPatinaSteel}>
            <boxGeometry args={[0.02, 0.2, 0.01]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
