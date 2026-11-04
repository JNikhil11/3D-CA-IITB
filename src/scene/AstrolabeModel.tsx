import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AstrolabeModelProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  activeDomainRing?: number;
  reducedMotion: boolean;
}

export const AstrolabeModel: React.FC<AstrolabeModelProps> = ({
  scrollProgress,
  mousePosition,
  activeDomainRing,
  reducedMotion,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const eclipticRingRef = useRef<THREE.Group>(null);
  const equinoxRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Group>(null);
  const alidadeRef = useRef<THREE.Group>(null);

  // High-fidelity materials using project design tokens
  const materials = useMemo(() => {
    return {
      agedBrass: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D9AF56'),
        metalness: 0.88,
        roughness: 0.28,
        envMapIntensity: 1.2,
      }),
      darkBronze: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A3226'),
        metalness: 0.92,
        roughness: 0.38,
      }),
      burnishedGold: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E8C372'),
        metalness: 0.95,
        roughness: 0.18,
      }),
      vermilionAccent: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D65D40'),
        metalness: 0.4,
        roughness: 0.3,
        emissive: new THREE.Color('#D65D40'),
        emissiveIntensity: 0.4,
      }),
      ultramarineGlass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#344FC1'),
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.6,
        thickness: 0.8,
        transparent: true,
        opacity: 0.85,
      }),
      wireframeCelestial: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#D9AF56'),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    };
  }, []);

  // Calibrated tick notches for the outer meridian ring
  const tickNotches = useMemo(() => {
    const ticks: { angle: number; isMajor: boolean }[] = [];
    for (let i = 0; i < 72; i++) {
      ticks.push({
        angle: (i / 72) * Math.PI * 2,
        isMajor: i % 6 === 0,
      });
    }
    return ticks;
  }, []);

  // Frame animation loop with smooth lerping
  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    if (reducedMotion) {
      // Gentle static orientation with slight static tilt
      masterGroupRef.current.rotation.set(0.3, 0.4 + scrollProgress * 0.5, 0.1);
      return;
    }

    const time = state.clock.getElapsedTime();

    // 1. Target rotation driven by scroll progress + mouse parallax
    const targetRotX = 0.35 + mousePosition.y * 0.45 + scrollProgress * 1.8;
    const targetRotY = time * 0.15 + mousePosition.x * 0.6 + scrollProgress * 3.14;
    const targetRotZ = 0.12 + Math.sin(time * 0.25) * 0.05 + mousePosition.x * 0.2;

    masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.x,
      targetRotX,
      0.06
    );
    masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.y,
      targetRotY,
      0.06
    );
    masterGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.z,
      targetRotZ,
      0.06
    );

    // 2. Individual armillary ring independent clockwork rotations
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.1;
      const scale = activeDomainRing === 0 ? 1.08 : 1.0;
      outerRingRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (eclipticRingRef.current) {
      eclipticRingRef.current.rotation.z += delta * 0.16;
      const scale = activeDomainRing === 1 ? 1.08 : 1.0;
      eclipticRingRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (equinoxRingRef.current) {
      equinoxRingRef.current.rotation.x += delta * 0.12;
      const scale = activeDomainRing === 2 ? 1.08 : 1.0;
      equinoxRingRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.22;
      const scale = activeDomainRing === 3 ? 1.12 : 1.0;
      innerRingRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (alidadeRef.current) {
      alidadeRef.current.rotation.z = Math.sin(time * 0.5 + scrollProgress * 4) * 0.45;
    }

    if (coreSphereRef.current) {
      coreSphereRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* 1. OUTER MERIDIAN RING (Calibrated Astronomical Armillary) */}
      <group ref={outerRingRef}>
        {/* Main circular band */}
        <mesh material={materials.agedBrass}>
          <torusGeometry args={[2.5, 0.055, 16, 100]} />
        </mesh>
        {/* Secondary bevel bead */}
        <mesh material={materials.darkBronze}>
          <torusGeometry args={[2.58, 0.02, 12, 100]} />
        </mesh>
        {/* Calibrated graduation tick marks */}
        {tickNotches.map((tick, i) => (
          <mesh
            key={`outer-tick-${i}`}
            position={[
              Math.cos(tick.angle) * 2.5,
              Math.sin(tick.angle) * 2.5,
              0,
            ]}
            rotation={[0, 0, tick.angle + Math.PI / 2]}
            material={tick.isMajor ? materials.burnishedGold : materials.darkBronze}
          >
            <boxGeometry args={[0.018, tick.isMajor ? 0.12 : 0.06, 0.04]} />
          </mesh>
        ))}
      </group>

      {/* 2. ECLIPTIC / ZODIAC BAND (Tilted at 23.5 degrees) */}
      <group
        ref={eclipticRingRef}
        rotation={[THREE.MathUtils.degToRad(23.5), 0, THREE.MathUtils.degToRad(15)]}
      >
        <mesh material={materials.burnishedGold}>
          <cylinderGeometry args={[2.2, 2.2, 0.16, 64, 1, true]} />
        </mesh>
        <mesh material={materials.darkBronze}>
          <torusGeometry args={[2.2, 0.035, 16, 64]} />
        </mesh>
        {/* Zodiac constellation node markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <group
              key={`zodiac-node-${i}`}
              position={[Math.cos(angle) * 2.2, 0, Math.sin(angle) * 2.2]}
            >
              <mesh material={materials.vermilionAccent}>
                <sphereGeometry args={[0.05, 12, 12]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 3. EQUINOCTIAL RING (Horizontal Plane) */}
      <group ref={equinoxRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={materials.agedBrass}>
          <torusGeometry args={[1.88, 0.048, 16, 80]} />
        </mesh>
        {/* Four cardinal points */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
          <mesh
            key={`cardinal-${idx}`}
            position={[Math.cos(angle) * 1.88, Math.sin(angle) * 1.88, 0]}
            material={materials.vermilionAccent}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          </mesh>
        ))}
      </group>

      {/* 4. INNER AZIMUTH RING (Vertical Orthogonal Plane) */}
      <group ref={innerRingRef} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={materials.darkBronze}>
          <torusGeometry args={[1.52, 0.04, 16, 64]} />
        </mesh>
        <mesh material={materials.agedBrass}>
          <torusGeometry args={[1.44, 0.02, 12, 64]} />
        </mesh>
        {/* Planetary bronze counterweights */}
        <mesh position={[1.52, 0, 0]} material={materials.burnishedGold}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <mesh position={[-1.52, 0, 0]} material={materials.burnishedGold}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
      </group>

      {/* 5. ALIDADE (Astrolabe Sighting Arm / Pointer) */}
      <group ref={alidadeRef} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} material={materials.burnishedGold}>
          <boxGeometry args={[0.06, 3.4, 0.025]} />
        </mesh>
        {/* Sighting vanes at tips */}
        <mesh position={[0, 1.7, 0]} material={materials.vermilionAccent}>
          <coneGeometry args={[0.08, 0.22, 16]} />
        </mesh>
        <mesh position={[0, -1.7, 0]} rotation={[0, 0, Math.PI]} material={materials.vermilionAccent}>
          <coneGeometry args={[0.08, 0.22, 16]} />
        </mesh>
      </group>

      {/* 6. CENTRAL CELESTIAL SPHERE & PIVOT AXIS */}
      <group ref={coreSphereRef}>
        {/* Central bronze spindle pin */}
        <mesh material={materials.burnishedGold}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 24]} />
        </mesh>
        {/* Inner Terrestrial / Celestial Armillary Core */}
        <mesh material={materials.ultramarineGlass}>
          <sphereGeometry args={[0.82, 32, 32]} />
        </mesh>
        {/* Celestial coordinate meridian cage */}
        <mesh material={materials.wireframeCelestial}>
          <sphereGeometry args={[0.86, 16, 12]} />
        </mesh>
        {/* Central glowing pulsar pivot */}
        <mesh material={materials.vermilionAccent}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
};
