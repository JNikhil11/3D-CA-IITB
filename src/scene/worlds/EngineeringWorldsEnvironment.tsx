/**
 * EngineeringWorldsEnvironment.tsx — World 03: Engineering Worlds
 *
 * Implements the 4 distinct engineering domains spatially:
 * - Quadrant 1 (NW): Robotics & Kinetic Systems (Articulated 6-axis arm, laser welding arc, machined gear cluster)
 * - Quadrant 2 (NE): Aerospace & Orbital Dynamics (Satellite with solar wings, ion propulsion thruster, orbit trajectory)
 * - Quadrant 3 (SE): Cognitive Computing & Intelligence (Crystalline neural lattice core, glowing data nodes)
 * - Quadrant 4 (SW): Sustainable Earth Systems (Stepped dais with glowing emerald energy leylines & capacitor coils)
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldProps {
  active: boolean;
  intensity?: number;
}

export const EngineeringWorldsEnvironment: React.FC<WorldProps> = ({
  active,
  intensity = 1.0,
}) => {
  // Robotics refs
  const armElbow = useRef<THREE.Group>(null);
  const gear1 = useRef<THREE.Mesh>(null);
  const gear2 = useRef<THREE.Mesh>(null);
  const weldingSpark = useRef<THREE.PointLight>(null);

  // Aerospace refs
  const satelliteGroup = useRef<THREE.Group>(null);
  const ionThruster = useRef<THREE.PointLight>(null);

  // Computing refs
  const neuralCore = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);

  // Sustainability refs
  const leylinePulse = useRef<THREE.MeshBasicMaterial>(null);

  // Neural data particle stream
  const neuralParticles = useMemo(() => {
    const count = 90;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 2.8 + (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 1] = 0.2 + (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = 1.8 + (Math.random() - 0.5) * 1.8;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // 1. Robotics animation
    if (armElbow.current) {
      armElbow.current.rotation.z = Math.sin(t * 2.4) * 0.35 + 0.3;
    }
    if (gear1.current) gear1.current.rotation.z += delta * 2.2;
    if (gear2.current) gear2.current.rotation.z -= delta * 2.2;
    if (weldingSpark.current) {
      weldingSpark.current.intensity =
        Math.random() > 0.3 ? (3.5 + Math.random() * 4.0) * intensity : 0.4;
    }

    // 2. Aerospace orbital precession
    if (satelliteGroup.current) {
      satelliteGroup.current.position.y = 1.2 + Math.sin(t * 1.2) * 0.15;
      satelliteGroup.current.rotation.y = t * 0.25;
    }
    if (ionThruster.current) {
      ionThruster.current.intensity = (2.2 + Math.sin(t * 8.0) * 0.5) * intensity;
    }

    // 3. Cognitive Computing core pulse
    if (neuralCore.current) {
      neuralCore.current.rotation.x = t * 0.3;
      neuralCore.current.rotation.y = t * 0.45;
    }
    if (coreMat.current) {
      coreMat.current.emissiveIntensity = 0.8 + Math.sin(t * 3.0) * 0.4;
    }

    // 4. Sustainability energy leyline pulse
    if (leylinePulse.current) {
      leylinePulse.current.opacity = 0.45 + Math.sin(t * 2.5) * 0.25;
    }
  });

  if (!active && intensity <= 0.01) return null;

  return (
    <group visible={active}>
      {/* ============================================================== */}
      {/* QUADRANT 1 (NW): ROBOTICS & KINETIC SYSTEMS                   */}
      {/* ============================================================== */}
      <group position={[-3.8, 0.2, -1.8]}>
        {/* Heavy Machining Pedestal */}
        <mesh position={[0, -1.4, 0]} receiveShadow>
          <cylinderGeometry args={[1.4, 1.6, 0.8, 24]} />
          <meshStandardMaterial color="#0C1018" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 24]} />
          <meshStandardMaterial color="#D4A853" roughness={0.2} metalness={0.95} />
        </mesh>

        {/* 6-Axis Robot Articulation Arm */}
        <group position={[-0.4, -0.9, 0]}>
          {/* Base Turret */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.6, 16]} />
            <meshStandardMaterial color="#1E2433" metalness={0.8} />
          </mesh>
          {/* Elbow Joint */}
          <group ref={armElbow} position={[0, 0.65, 0]}>
            <mesh position={[0, 0.5, 0.1]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.18, 1.1, 0.18]} />
              <meshStandardMaterial color="#D4A853" metalness={0.9} />
            </mesh>
            {/* Welding Torch End-Effector */}
            <mesh position={[0, 1.1, 0.35]}>
              <cylinderGeometry args={[0.04, 0.08, 0.35, 12]} />
              <meshStandardMaterial color="#333333" metalness={0.9} />
            </mesh>
            {/* Laser Welding Arc Point */}
            <mesh position={[0, 1.3, 0.4]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#66DDFF" />
            </mesh>
            <pointLight
              ref={weldingSpark}
              position={[0, 1.3, 0.4]}
              color="#55CCFF"
              distance={4}
              decay={2}
            />
          </group>
        </group>

        {/* Machined Planetary Gears */}
        <group position={[0.4, -0.7, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh ref={gear1} position={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 18]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} />
          </mesh>
          <mesh ref={gear2} position={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.08, 14]} />
            <meshStandardMaterial color="#A67C1E" metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* QUADRANT 2 (NE): AEROSPACE & ORBITAL DYNAMICS                 */}
      {/* ============================================================== */}
      <group position={[3.8, 0.6, -1.8]}>
        <group ref={satelliteGroup}>
          {/* Central Satellite Chassis */}
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.7, 1.1]} />
            <meshStandardMaterial
              color="#D8BA6B"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>

          {/* Left Solar Array */}
          <mesh position={[-1.3, 0, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[1.6, 0.03, 0.7]} />
            <meshStandardMaterial
              color="#0A1838"
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>

          {/* Right Solar Array */}
          <mesh position={[1.3, 0, 0]} rotation={[0, -0.2, 0]}>
            <boxGeometry args={[1.6, 0.03, 0.7]} />
            <meshStandardMaterial
              color="#0A1838"
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>

          {/* High-Gain Parabolic Communications Dish */}
          <mesh position={[0, 0.55, 0.2]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.05, 0.15, 24, 1, true]} />
            <meshStandardMaterial
              color="#E8D595"
              metalness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Ion Propulsion Thruster Plume */}
          <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.18, 0.8, 16]} />
            <meshBasicMaterial
              color="#00EEFF"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight
            ref={ionThruster}
            position={[0, 0, -0.9]}
            color="#00D4FF"
            distance={4}
            decay={2}
          />
        </group>

        {/* Orbit Trajectory Ring */}
        <mesh rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[2.2, 0.015, 8, 48]} />
          <meshBasicMaterial
            color="#48C7FF"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* QUADRANT 3 (SE): COGNITIVE COMPUTING & INTELLIGENCE           */}
      {/* ============================================================== */}
      <group position={[3.2, -0.2, 2.0]}>
        {/* Floating Quantum Processor Core */}
        <group ref={neuralCore} position={[0, 0.4, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial
              ref={coreMat}
              color="#3B82F6"
              emissive="#1E40AF"
              emissiveIntensity={0.8}
              roughness={0.15}
              metalness={0.85}
              wireframe={false}
            />
          </mesh>
          {/* Wireframe Outer Shell */}
          <mesh>
            <octahedronGeometry args={[0.82, 0]} />
            <meshBasicMaterial
              color="#60A5FA"
              wireframe
              transparent
              opacity={0.65}
            />
          </mesh>
        </group>

        {/* Holographic Neural Data Stream Particles */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[neuralParticles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            color="#60A5FA"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Substrate Dais */}
        <mesh position={[0, -1.2, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.4, 6]} />
          <meshStandardMaterial color="#0A0E18" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* QUADRANT 4 (SW): SUSTAINABLE EARTH SYSTEMS                     */}
      {/* ============================================================== */}
      <group position={[-3.2, -0.6, 2.0]}>
        {/* Stepped Hexagonal Sustainable Dais */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <cylinderGeometry args={[1.5, 1.7, 0.4, 6]} />
          <meshStandardMaterial color="#0A1412" roughness={0.25} metalness={0.9} />
        </mesh>

        {/* Glowing Emerald Energy Leylines */}
        <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 1.35, 6]} />
          <meshBasicMaterial
            ref={leylinePulse}
            color="#10B981"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Resonant Capacitor Pylons */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => {
          const px = Math.cos(angle) * 1.0;
          const pz = Math.sin(angle) * 1.0;
          return (
            <group key={`pylon-${idx}`} position={[px, -0.2, pz]}>
              <mesh>
                <cylinderGeometry args={[0.08, 0.1, 0.6, 12]} />
                <meshStandardMaterial
                  color="#10B981"
                  emissive="#047857"
                  emissiveIntensity={0.6}
                  metalness={0.8}
                />
              </mesh>
              <pointLight
                color="#10B981"
                intensity={0.6 * intensity}
                distance={2.2}
                decay={2}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
};
