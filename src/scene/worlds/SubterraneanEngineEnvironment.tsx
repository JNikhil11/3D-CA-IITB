/**
 * SubterraneanEngineEnvironment.tsx — World 02: The Subterranean Engine
 *
 * Visual Reference (Image 6 & Reference Video):
 * - Subterranean industrial vault with heavy riveted steel girders
 * - Industrial steam pipes with bolted flanges running along the curved walls
 * - Metal catwalk stairs with railings leading down into the subterranean abyss
 * - Foreground mechanical control console with glowing thermionic vacuum tubes,
 *   animated dial needles, and brass instrument switches
 * - Fiery boiler core underglow with pulsing amber/crimson illumination
 * - Rising steam and ember particles
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldProps {
  active: boolean;
  intensity?: number;
}

export const SubterraneanEngineEnvironment: React.FC<WorldProps> = ({
  active,
  intensity = 1.0,
}) => {
  const dialNeedle1 = useRef<THREE.Mesh>(null);
  const dialNeedle2 = useRef<THREE.Mesh>(null);
  const dialNeedle3 = useRef<THREE.Mesh>(null);
  const boilerLight = useRef<THREE.PointLight>(null);
  const steamRef = useRef<THREE.Points>(null);

  // Steam & ember particle positions
  const steamParticles = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.0;
      pos[i * 3 + 1] = Math.random() * 5.0 - 2.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5.0 + 1.0;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Fluctuating dial needles simulating steam pressure / power load
    if (dialNeedle1.current) {
      dialNeedle1.current.rotation.z = Math.sin(t * 3.5) * 0.45 + 0.2;
    }
    if (dialNeedle2.current) {
      dialNeedle2.current.rotation.z = Math.cos(t * 2.1) * 0.55 - 0.1;
    }
    if (dialNeedle3.current) {
      dialNeedle3.current.rotation.z = Math.sin(t * 4.2 + 1.2) * 0.38 + 0.3;
    }

    // Fiery boiler pulsing light
    if (boilerLight.current) {
      boilerLight.current.intensity =
        (3.8 + Math.sin(t * 5.0) * 0.6 + Math.random() * 0.4) * intensity;
    }

    // Rising steam & ember particles
    if (steamRef.current) {
      const attr = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 160; i++) {
        let y = attr.getY(i) + delta * 0.45;
        if (y > 3.5) y = -2.0;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;
    }
  });

  if (!active && intensity <= 0.01) return null;

  return (
    <group visible={active}>
      {/* ============================================================== */}
      {/* 1. SUBTERRANEAN BOILER VAULT PIT & FIERY UNDERGLOW             */}
      {/* ============================================================== */}
      <group position={[0, -2.4, 0]}>
        {/* Deep machine pit floor */}
        <mesh receiveShadow position={[0, -0.8, 0]}>
          <cylinderGeometry args={[8.0, 8.5, 1.2, 32]} />
          <meshStandardMaterial
            color="#080706"
            roughness={0.85}
            metalness={0.6}
          />
        </mesh>

        {/* Central fiery boiler aperture glow */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[2.8, 3.2, 0.4, 32]} />
          <meshStandardMaterial
            color="#2A1005"
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>

        <mesh position={[0, 0.08, 0]}>
          <ringGeometry args={[0.4, 2.7, 32]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>

        {/* Dynamic Boiler Fire Point Light */}
        <pointLight
          ref={boilerLight}
          position={[0, 0.6, 0]}
          color="#FF6A00"
          intensity={4.2 * intensity}
          distance={14}
          decay={1.8}
        />
      </group>

      {/* ============================================================== */}
      {/* 2. RIVETED STEEL GIRDERS & CATWALK STAIRS (Image 6)           */}
      {/* ============================================================== */}
      <group position={[0, -1.2, 0]}>
        {/* Left industrial girder arch */}
        <mesh position={[-5.8, 2.5, -1.0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.6, 8.0, 0.8]} />
          <meshStandardMaterial
            color="#181A20"
            roughness={0.55}
            metalness={0.88}
          />
        </mesh>

        {/* Right industrial girder arch */}
        <mesh position={[5.8, 2.5, -1.0]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.6, 8.0, 0.8]} />
          <meshStandardMaterial
            color="#181A20"
            roughness={0.55}
            metalness={0.88}
          />
        </mesh>

        {/* Overhead cross truss */}
        <mesh position={[0, 6.2, -1.0]}>
          <boxGeometry args={[11.8, 0.5, 0.6]} />
          <meshStandardMaterial
            color="#15171D"
            roughness={0.5}
            metalness={0.85}
          />
        </mesh>

        {/* Metal Catwalk Stairs descending into the vault */}
        <group position={[0, -0.6, 2.6]}>
          {[0, 1, 2, 3, 4].map((step) => (
            <mesh
              key={`stair-${step}`}
              position={[0, -step * 0.22, step * 0.38]}
              receiveShadow
            >
              <boxGeometry args={[3.2, 0.14, 0.42]} />
              <meshStandardMaterial
                color="#1C2029"
                roughness={0.4}
                metalness={0.9}
              />
            </mesh>
          ))}

          {/* Catwalk Handrails */}
          <mesh position={[-1.6, 0.4, 0.8]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
            <meshStandardMaterial color="#C59B27" roughness={0.3} metalness={0.95} />
          </mesh>
          <mesh position={[1.6, 0.4, 0.8]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
            <meshStandardMaterial color="#C59B27" roughness={0.3} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 3. HEAVY STEAM CONDUITS & BOLTED FLANGES                      */}
      {/* ============================================================== */}
      <group position={[0, 0, -2.5]}>
        {/* Main High-Pressure Curved Boiler Pipe (Left to Right) */}
        <mesh position={[-3.8, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.32, 0.32, 4.2, 24]} />
          <meshStandardMaterial
            color="#5C3A21"
            roughness={0.38}
            metalness={0.85}
          />
        </mesh>

        {/* Bolted Flange Rings on Pipe */}
        {[-1.2, 0, 1.2].map((off, idx) => (
          <mesh
            key={`flange-${idx}`}
            position={[-3.8 + off * 0.7, 0.8 - off * 0.7, 0]}
            rotation={[0, 0, -Math.PI / 4]}
          >
            <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
            <meshStandardMaterial
              color="#D4AF37"
              roughness={0.25}
              metalness={0.95}
            />
          </mesh>
        ))}

        {/* Right Pressure Valve Conduit */}
        <mesh position={[3.8, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.32, 0.32, 4.2, 24]} />
          <meshStandardMaterial
            color="#5C3A21"
            roughness={0.38}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 4. FOREGROUND MECHANICAL CONTROL CONSOLE (Image 6 Focus)      */}
      {/* ============================================================== */}
      <group position={[0, -1.0, 3.2]}>
        {/* Main Angled Console Deck */}
        <mesh position={[0, 0, 0]} rotation={[-0.25, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.7, 1.1]} />
          <meshStandardMaterial
            color="#141822"
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>

        {/* Brass Bezel Trim */}
        <mesh position={[0, 0.36, -0.05]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[3.44, 0.04, 1.14]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.25}
            metalness={0.95}
          />
        </mesh>

        {/* ------------------------------------------------------------ */}
        {/* THREE GLOWING THERMIONIC VACUUM TUBES                        */}
        {/* ------------------------------------------------------------ */}
        {[-0.8, 0.0, 0.8].map((tubeX, idx) => (
          <group key={`tube-${idx}`} position={[tubeX, 0.55, -0.15]}>
            {/* Brass Tube Base Socket */}
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.16, 0.18, 0.12, 16]} />
              <meshStandardMaterial color="#C59B27" metalness={0.9} />
            </mesh>
            {/* Outer Glass Envelope */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.42, 16]} />
              <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.3}
                roughness={0.05}
                metalness={0.1}
              />
            </mesh>
            {/* Incandescent Orange Filament Core */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
              <meshBasicMaterial color="#FF7700" />
            </mesh>
            <pointLight
              color="#FF8800"
              intensity={0.85 * intensity}
              distance={1.6}
              decay={2}
            />
          </group>
        ))}

        {/* ------------------------------------------------------------ */}
        {/* THREE VERNIER PRESSURE DIALS WITH ANIMATED NEEDLES          */}
        {/* ------------------------------------------------------------ */}
        {/* Dial 1 */}
        <group position={[-1.1, 0.42, 0.22]} rotation={[-0.25, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.06, 24]} />
            <meshStandardMaterial color="#0A0D14" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <circleGeometry args={[0.19, 24]} />
            <meshStandardMaterial color="#E8D8A0" roughness={0.4} />
          </mesh>
          {/* Needle 1 */}
          <mesh ref={dialNeedle1} position={[0, 0.045, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.02, 0.16, 0.01]} />
            <meshBasicMaterial color="#CC2200" />
          </mesh>
        </group>

        {/* Dial 2 */}
        <group position={[-0.45, 0.42, 0.22]} rotation={[-0.25, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.06, 24]} />
            <meshStandardMaterial color="#0A0D14" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <circleGeometry args={[0.19, 24]} />
            <meshStandardMaterial color="#E8D8A0" roughness={0.4} />
          </mesh>
          {/* Needle 2 */}
          <mesh ref={dialNeedle2} position={[0, 0.045, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.02, 0.16, 0.01]} />
            <meshBasicMaterial color="#CC2200" />
          </mesh>
        </group>

        {/* Dial 3 */}
        <group position={[0.45, 0.42, 0.22]} rotation={[-0.25, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.06, 24]} />
            <meshStandardMaterial color="#0A0D14" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <circleGeometry args={[0.19, 24]} />
            <meshStandardMaterial color="#E8D8A0" roughness={0.4} />
          </mesh>
          {/* Needle 3 */}
          <mesh ref={dialNeedle3} position={[0, 0.045, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.02, 0.16, 0.01]} />
            <meshBasicMaterial color="#CC2200" />
          </mesh>
        </group>

        {/* Master Kinematic Knife Switch */}
        <group position={[1.1, 0.42, 0.22]} rotation={[-0.25, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.25, 0.04, 0.35]} />
            <meshStandardMaterial color="#2B1A0D" />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 5. RISING STEAM & EMBER PARTICLES                             */}
      {/* ============================================================== */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#FFA040"
          transparent
          opacity={0.5 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
