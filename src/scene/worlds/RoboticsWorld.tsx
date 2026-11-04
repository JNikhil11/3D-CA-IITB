import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface RoboticsWorldProps {
  materials: AetherMaterialPalette;
  reducedMotion: boolean;
  active: boolean;
}

/**
 * 3D Robotics & Autonomous Kinetic Systems World:
 * - 6-axis articulated kinematic manipulator arm with hydraulic cylinders
 * - Two-finger precision mechanical gripper
 * - Revolving LiDAR sensor scanner head with translucent sweep cone
 */
export const RoboticsWorld: React.FC<RoboticsWorldProps> = ({
  materials,
  reducedMotion,
  active,
}) => {
  const baseTurretRef = useRef<THREE.Group>(null);
  const shoulderRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);
  const wristRef = useRef<THREE.Group>(null);
  const lidarScannerRef = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !active) return;
    const time = state.clock.getElapsedTime();

    // 1. Smooth kinematic arm cycle
    if (baseTurretRef.current) {
      baseTurretRef.current.rotation.y = Math.sin(time * 0.4) * 0.6;
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.z = -0.4 + Math.sin(time * 0.6) * 0.25;
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.z = 0.8 + Math.cos(time * 0.6) * 0.3;
    }
    if (wristRef.current) {
      wristRef.current.rotation.z = -0.4 + Math.sin(time * 0.8) * 0.25;
      wristRef.current.rotation.y = time * 0.5;
    }
    if (gripperRef.current) {
      gripperRef.current.scale.x = 0.85 + Math.sin(time * 1.2) * 0.15;
    }

    // 2. Continuous high-speed LiDAR scan head rotation
    if (lidarScannerRef.current) {
      lidarScannerRef.current.rotation.y += 0.08;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Heavy Machinery Base Flange */}
      <mesh material={materials.castBronze} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.25, 0.2, 32]} />
      </mesh>
      <mesh material={materials.agedBrass} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.9, 0.95, 0.06, 32]} />
      </mesh>

      {/* Axis 1: Rotating Turret Base */}
      <group ref={baseTurretRef} position={[0, 0.16, 0]}>
        <mesh material={materials.agedBrass} position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.82, 0.32, 24]} />
        </mesh>
        <mesh material={materials.burnishedGold} position={[0, 0.22, 0]}>
          <torusGeometry args={[0.72, 0.03, 12, 24]} />
        </mesh>

        {/* Shoulder Fork Brackets */}
        <mesh position={[-0.26, 0.52, 0]} material={materials.castBronze} castShadow>
          <boxGeometry args={[0.16, 0.45, 0.38]} />
        </mesh>
        <mesh position={[0.26, 0.52, 0]} material={materials.castBronze} castShadow>
          <boxGeometry args={[0.16, 0.45, 0.38]} />
        </mesh>
        {/* Shoulder Bearing Pivot */}
        <mesh position={[0, 0.62, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.12, 0.12, 0.72, 16]} />
        </mesh>

        {/* Axis 2: Shoulder Articulation & Upper Boom */}
        <group ref={shoulderRef} position={[0, 0.62, 0]}>
          {/* Main Upper Arm Structural Member */}
          <mesh position={[0, 0.75, 0]} material={materials.agedBrass} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 1.3, 16]} />
          </mesh>
          {/* Brass Hydraulic Actuator Cylinder */}
          <mesh position={[0.18, 0.45, 0.1]} rotation={[0, 0, 0.2]} material={materials.burnishedGold}>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
          </mesh>
          <mesh position={[0.18, 0.75, 0.1]} rotation={[0, 0, 0.2]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
          </mesh>

          {/* Axis 3: Elbow Joint */}
          <group ref={elbowRef} position={[0, 1.4, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.castBronze}>
              <cylinderGeometry args={[0.14, 0.14, 0.44, 16]} />
            </mesh>

            {/* Forearm Link */}
            <mesh position={[0, 0.6, 0]} material={materials.agedBrass} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 1.1, 16]} />
            </mesh>

            {/* Axis 4 & 5: Wrist Assembly */}
            <group ref={wristRef} position={[0, 1.2, 0]}>
              <mesh material={materials.burnishedGold}>
                <sphereGeometry args={[0.12, 16, 16]} />
              </mesh>

              {/* End Effector Gripper Tool */}
              <group ref={gripperRef} position={[0, 0.22, 0]}>
                <mesh material={materials.castBronze}>
                  <boxGeometry args={[0.26, 0.08, 0.14]} />
                </mesh>
                {/* Left Finger Talon */}
                <mesh position={[-0.1, 0.14, 0]} material={materials.darkPatinaSteel} castShadow>
                  <boxGeometry args={[0.04, 0.22, 0.06]} />
                </mesh>
                {/* Right Finger Talon */}
                <mesh position={[0.1, 0.14, 0]} material={materials.darkPatinaSteel} castShadow>
                  <boxGeometry args={[0.04, 0.22, 0.06]} />
                </mesh>
                {/* Laser sensor node on tool tip */}
                <mesh position={[0, 0.1, 0.08]} material={materials.vermilionRuby}>
                  <sphereGeometry args={[0.03, 10, 10]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* LiDAR Scanning Head Tower Mounted on Periphery */}
      <group position={[1.35, 0.15, 0.8]}>
        <mesh material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.12, 0.15, 0.4, 16]} />
        </mesh>
        <group ref={lidarScannerRef} position={[0, 0.24, 0]}>
          <mesh material={materials.castBronze}>
            <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
          </mesh>
          <mesh position={[0, 0.02, 0.12]} material={materials.plasmaCyan}>
            <boxGeometry args={[0.08, 0.05, 0.03]} />
          </mesh>
          {/* Translucent LiDAR scan field cone */}
          <mesh position={[0, 0.35, 0.7]} rotation={[Math.PI * 0.45, 0, 0]}>
            <coneGeometry args={[0.7, 1.2, 16, 1, true]} />
            <meshBasicMaterial
              color="#00F0FF"
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
