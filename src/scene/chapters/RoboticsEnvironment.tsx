/**
 * Robotics & Mechanical Engineering Chapter Environment
 *
 * Implements:
 * - Two articulated 6-axis industrial robot arms with hydraulic pistons
 * - Rotating base turrets, dual-link forearms, and precision end-effectors
 * - High-speed laser welding arc with dynamic flickering spark light
 * - Precision kinematic gear-train assembly being machined
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoboticsEnvProps {
  active: boolean;
  opacity?: number;
}

export const RoboticsEnvironment: React.FC<RoboticsEnvProps> = ({ active }) => {
  const arm1Base = useRef<THREE.Group>(null);
  const arm1Elbow = useRef<THREE.Group>(null);
  const arm1Wrist = useRef<THREE.Group>(null);
  const sparkLight = useRef<THREE.PointLight>(null);
  const gearRef1 = useRef<THREE.Mesh>(null);
  const gearRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Robotic kinematics animation
    if (arm1Base.current) {
      arm1Base.current.rotation.y = Math.sin(t * 1.5) * 0.45;
    }
    if (arm1Elbow.current) {
      arm1Elbow.current.rotation.z = Math.sin(t * 2.2) * 0.35 + 0.4;
    }
    if (arm1Wrist.current) {
      arm1Wrist.current.rotation.z = -Math.cos(t * 2.2) * 0.4 - 0.2;
    }

    // Rotating machined gears
    if (gearRef1.current) gearRef1.current.rotation.z += delta * 1.8;
    if (gearRef2.current) gearRef2.current.rotation.z -= delta * 1.8;

    // Laser welding spark flicker
    if (sparkLight.current) {
      sparkLight.current.intensity = Math.random() > 0.3 ? 4.0 + Math.random() * 5.0 : 0.5;
    }
  });

  return (
    <group position={[-4.5, 0.2, -1.0]} visible={active}>
      {/* Heavy Industrial Machining Pedestal */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.6, 32]} />
        <meshStandardMaterial color="#101520" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.1, 32]} />
        <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* ---------------------------------------------------------------- */}
      {/* ROBOTIC MANIPULATOR ARM 01 (Articulated Kinematic Welder)       */}
      {/* ---------------------------------------------------------------- */}
      <group position={[-0.8, -1.2, 0.3]}>
        {/* Base Turret */}
        <group ref={arm1Base}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.5, 24]} />
            <meshStandardMaterial color="#222B3A" roughness={0.25} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Lower Arm Boom */}
          <group position={[0, 0.55, 0]} ref={arm1Elbow} rotation={[0, 0, 0.4]}>
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[0.18, 1.4, 0.18]} />
              <meshStandardMaterial color="#1E2838" roughness={0.3} metalness={0.88} />
            </mesh>
            {/* Hydraulic cylinder alongside boom */}
            <mesh position={[0.12, 0.6, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.1, 12]} />
              <meshStandardMaterial color="#E0B858" roughness={0.15} metalness={0.98} />
            </mesh>

            {/* Forearm & Wrist Joint */}
            <group position={[0, 1.4, 0]} ref={arm1Wrist} rotation={[0, 0, -0.6]}>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
              </mesh>
              <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.14, 1.2, 0.14]} />
                <meshStandardMaterial color="#18202D" roughness={0.25} metalness={0.9} />
              </mesh>

              {/* End-Effector Precision Laser Nozzle */}
              <group position={[0, 1.2, 0]}>
                <mesh position={[0, 0.12, 0]}>
                  <cylinderGeometry args={[0.04, 0.08, 0.24, 16]} />
                  <meshStandardMaterial color="#C88E48" roughness={0.2} metalness={0.95} />
                </mesh>
                {/* Glowing Laser Arc Point */}
                <pointLight
                  ref={sparkLight}
                  position={[0, 0.28, 0]}
                  color="#40A9FF"
                  intensity={5.0}
                  distance={4.0}
                />
                <mesh position={[0, 0.28, 0]}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshBasicMaterial color="#80D0FF" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* ROBOTIC MANIPULATOR ARM 02 (Precision Gripper Assembler)        */}
      {/* ---------------------------------------------------------------- */}
      <group position={[0.9, -1.2, -0.2]} rotation={[0, Math.PI * 0.8, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.28, 0.36, 0.5, 24]} />
          <meshStandardMaterial color="#222B3A" roughness={0.25} metalness={0.9} />
        </mesh>
        <group position={[0, 0.55, 0]} rotation={[0, 0, 0.3]}>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[0.16, 1.3, 0.16]} />
            <meshStandardMaterial color="#1E2838" roughness={0.3} metalness={0.88} />
          </mesh>
          <group position={[0, 1.3, 0]} rotation={[0, 0, -0.5]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.12, 1.0, 0.12]} />
              <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
            </mesh>
            {/* 3-Finger Precision Micro-Gripper */}
            <mesh position={[-0.06, 1.08, 0]}>
              <boxGeometry args={[0.025, 0.16, 0.04]} />
              <meshStandardMaterial color="#222B38" />
            </mesh>
            <mesh position={[0.06, 1.08, 0]}>
              <boxGeometry args={[0.025, 0.16, 0.04]} />
              <meshStandardMaterial color="#222B38" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* WORKPIECE: INTERLOCKING KINEMATIC BRASS GEAR ASSEMBLY           */}
      {/* ---------------------------------------------------------------- */}
      <group position={[0, -0.6, 0.2]}>
        {/* Main Drive Gear */}
        <mesh ref={gearRef1} position={[-0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 24]} />
          <meshStandardMaterial color="#E5C158" roughness={0.18} metalness={0.95} />
        </mesh>
        {/* Secondary Driven Gear */}
        <mesh ref={gearRef2} position={[0.45, 0, 0]} rotation={[Math.PI / 2, 0, 0.12]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 20]} />
          <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.92} />
        </mesh>
      </group>
    </group>
  );
};
