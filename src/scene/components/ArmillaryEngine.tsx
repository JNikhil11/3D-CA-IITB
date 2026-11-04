import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface ArmillaryEngineProps {
  materials: AetherMaterialPalette;
  activeDomainRing: number;
  explodedView: boolean;
  reducedMotion: boolean;
  scrollProgress: number;
}

/**
 * Intricate Renaissance Armillary Sphere Mechanism:
 * - Colurus Aequinoctialis meridian ring with Latin engravings & 96 outer gear teeth
 * - 23.5° tilted Zodiac ecliptic band with constellation glyphs and ruby gem star nodes
 * - Horizontal Equinoctial plane ring with 4 cardinal directional pointers
 * - Inner Solstitial ring with brass counterweights
 * - Translucent sapphire celestial globe with internal glowing pulsar core
 * - Dual alidade sighting arms with vernier thumb screws
 */
export const ArmillaryEngine: React.FC<ArmillaryEngineProps> = ({
  materials,
  activeDomainRing,
  explodedView,
  reducedMotion,
  scrollProgress,
}) => {
  const outerMeridianGroupRef = useRef<THREE.Group>(null);
  const zodiacEclipticGroupRef = useRef<THREE.Group>(null);
  const equinoxPlaneGroupRef = useRef<THREE.Group>(null);
  const solstitialGroupRef = useRef<THREE.Group>(null);
  const celestialGlobeGroupRef = useRef<THREE.Group>(null);
  const alidadeGroupRef = useRef<THREE.Group>(null);

  // 96 gear teeth around the outer rim of the meridian ring
  const meridianGearTeeth = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 96; i++) {
      list.push((i / 96) * Math.PI * 2);
    }
    return list;
  }, []);

  // 12 ruby star gems on the Zodiac band
  const zodiacGems = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 12; i++) {
      list.push((i / 12) * Math.PI * 2);
    }
    return list;
  }, []);

  // 24 hour division markers on the Equinoctial ring
  const equinoxHours = useMemo(() => {
    const list: { angle: number; isMajor: boolean }[] = [];
    for (let i = 0; i < 48; i++) {
      list.push({
        angle: (i / 48) * Math.PI * 2,
        isMajor: i % 2 === 0,
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    const time = reducedMotion ? 0 : state.clock.getElapsedTime();
    const explodeFactor = explodedView ? 1.0 : 0.0;

    // 1. Meridian Ring (Ring 3) - Slowly rolls, translates forward in exploded mode
    if (outerMeridianGroupRef.current) {
      if (!reducedMotion) outerMeridianGroupRef.current.rotation.y += delta * 0.05;
      const targetZ = explodeFactor * 0.7;
      outerMeridianGroupRef.current.position.z = THREE.MathUtils.lerp(
        outerMeridianGroupRef.current.position.z,
        targetZ,
        0.1
      );
    }

    // 2. Zodiac Ecliptic Band (Ring 1) - Rotates on tilted axis, elevates in exploded mode
    if (zodiacEclipticGroupRef.current) {
      if (!reducedMotion) zodiacEclipticGroupRef.current.rotation.y += delta * 0.12;
      const targetY = explodeFactor * 0.85;
      zodiacEclipticGroupRef.current.position.y = THREE.MathUtils.lerp(
        zodiacEclipticGroupRef.current.position.y,
        targetY,
        0.1
      );
    }

    // 3. Equinoctial Plane Ring (Ring 2) - Rotates in horizontal plane, lowers in exploded mode
    if (equinoxPlaneGroupRef.current) {
      if (!reducedMotion) equinoxPlaneGroupRef.current.rotation.y -= delta * 0.08;
      const targetY = explodeFactor * -0.75;
      equinoxPlaneGroupRef.current.position.y = THREE.MathUtils.lerp(
        equinoxPlaneGroupRef.current.position.y,
        targetY,
        0.1
      );
    }

    // 4. Solstitial Colure Ring (Ring 0) - Swings on polar pivots
    if (solstitialGroupRef.current) {
      if (!reducedMotion) solstitialGroupRef.current.rotation.x += delta * 0.15;
      const targetX = explodeFactor * 0.8;
      solstitialGroupRef.current.position.x = THREE.MathUtils.lerp(
        solstitialGroupRef.current.position.x,
        targetX,
        0.1
      );
    }

    // 5. Celestial Globe Core - Continuous planetary rotation
    if (celestialGlobeGroupRef.current) {
      if (!reducedMotion) celestialGlobeGroupRef.current.rotation.y += delta * 0.22;
    }

    // 6. Alidade Sighting Arm - Periodic celestial sighting sweep
    if (alidadeGroupRef.current && !reducedMotion) {
      alidadeGroupRef.current.rotation.z = Math.sin(time * 0.5 + scrollProgress * 4) * 0.65;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ======================================================== */}
      {/* 1. OUTER MERIDIAN RING ("COLURUS AEQUINOXIALIS")         */}
      {/* ======================================================== */}
      <group ref={outerMeridianGroupRef}>
        {/* Main broad meridian band with engraved Latin texture */}
        <mesh material={materials.latinEngravedBrass} castShadow receiveShadow>
          <cylinderGeometry args={[2.55, 2.55, 0.26, 64, 1, true]} />
        </mesh>

        {/* Outer rim structural toruses */}
        <mesh position={[0, 0.13, 0]} material={activeDomainRing === 3 ? materials.burnishedGold : materials.agedBrass}>
          <torusGeometry args={[2.56, 0.025, 12, 64]} />
        </mesh>
        <mesh position={[0, -0.13, 0]} material={activeDomainRing === 3 ? materials.burnishedGold : materials.agedBrass}>
          <torusGeometry args={[2.56, 0.025, 12, 64]} />
        </mesh>

        {/* 96 Outer Spur Gear Teeth around circumference */}
        {meridianGearTeeth.map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 2.58, 0, Math.sin(angle) * 2.58]}
            rotation={[0, -angle, 0]}
            material={materials.castBronze}
          >
            <boxGeometry args={[0.04, 0.22, 0.05]} />
          </mesh>
        ))}

        {/* North and South Pole Trunnion Pivot Fasteners */}
        <mesh position={[0, 2.65, 0]} material={materials.castBronze}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>
        <mesh position={[0, -2.65, 0]} material={materials.castBronze}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. TILTED ZODIAC ECLIPTIC BAND (23.5° AXIAL TILT)        */}
      {/* ======================================================== */}
      <group
        ref={zodiacEclipticGroupRef}
        rotation={[Math.PI * (23.5 / 180), 0, Math.PI * 0.1]}
      >
        {/* Broad cylindrical ecliptic band with Zodiac glyphs & constellation names */}
        <mesh material={materials.zodiacBand} castShadow receiveShadow>
          <cylinderGeometry args={[2.18, 2.18, 0.34, 64, 1, true]} />
        </mesh>

        {/* Gold reinforcing rim beads */}
        <mesh position={[0, 0.17, 0]} material={activeDomainRing === 1 ? materials.burnishedGold : materials.agedBrass}>
          <torusGeometry args={[2.19, 0.02, 12, 64]} />
        </mesh>
        <mesh position={[0, -0.17, 0]} material={activeDomainRing === 1 ? materials.burnishedGold : materials.agedBrass}>
          <torusGeometry args={[2.19, 0.02, 12, 64]} />
        </mesh>

        {/* 12 Ruby Star Nodes positioned at each astrological house */}
        {zodiacGems.map((angle, idx) => (
          <group
            key={idx}
            position={[Math.cos(angle) * 2.22, 0, Math.sin(angle) * 2.22]}
          >
            {/* Brass bezel setting */}
            <mesh material={materials.agedBrass}>
              <cylinderGeometry args={[0.045, 0.045, 0.04, 12]} />
            </mesh>
            {/* Cut ruby gemstone */}
            <mesh material={materials.vermilionRuby} position={[0, 0.02, 0]}>
              <sphereGeometry args={[0.038, 12, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 3. HORIZONTAL EQUINOCTIAL PLANE RING                     */}
      {/* ======================================================== */}
      <group ref={equinoxPlaneGroupRef}>
        {/* Flat horizontal circular ring bisecting the sphere */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          material={activeDomainRing === 2 ? materials.burnishedGold : materials.agedBrass}
          castShadow
        >
          <ringGeometry args={[2.28, 2.45, 64]} />
        </mesh>

        {/* 4 Cardinal Directional Pointers (N, S, E, W) */}
        {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, idx) => (
          <group key={idx} rotation={[0, angle, 0]} position={[0, 0, 0]}>
            <mesh position={[2.42, 0, 0]} material={materials.castBronze}>
              <boxGeometry args={[0.14, 0.03, 0.08]} />
            </mesh>
            <mesh position={[2.52, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={materials.burnishedGold}>
              <coneGeometry args={[0.06, 0.12, 4]} />
            </mesh>
          </group>
        ))}

        {/* 48 Graduation Hour Division Pegs */}
        {equinoxHours.map((item, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(item.angle) * 2.36, 0, Math.sin(item.angle) * 2.36]}
            material={materials.darkPatinaSteel}
          >
            <boxGeometry args={[0.015, 0.025, item.isMajor ? 0.06 : 0.03]} />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 4. INNER SOLSTITIAL COLURE RING                          */}
      {/* ======================================================== */}
      <group ref={solstitialGroupRef}>
        {/* Nested vertical ring */}
        <mesh
          rotation={[0, 0, Math.PI / 2]}
          material={activeDomainRing === 0 ? materials.burnishedGold : materials.agedBrass}
          castShadow
        >
          <torusGeometry args={[1.72, 0.055, 16, 64]} />
        </mesh>

        {/* Brass counterweights on solstitial axis */}
        <mesh position={[0, 1.72, 0]} material={materials.castBronze}>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
        </mesh>
        <mesh position={[0, -1.72, 0]} material={materials.castBronze}>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. CENTRAL CELESTIAL GLOBE & PULSAR CORE                 */}
      {/* ======================================================== */}
      <group ref={celestialGlobeGroupRef}>
        {/* Outer translucent sapphire crystal sphere */}
        <mesh material={materials.translucentGlobe} castShadow>
          <sphereGeometry args={[0.82, 36, 36]} />
        </mesh>

        {/* Latitude & Longitude wireframe grid lines */}
        <mesh material={materials.celestialGrid}>
          <sphereGeometry args={[0.83, 18, 18]} />
        </mesh>

        {/* Golden Equatorial rim band */}
        <mesh material={materials.burnishedGold}>
          <torusGeometry args={[0.84, 0.02, 12, 36]} />
        </mesh>

        {/* Central glowing pulsar energy sphere */}
        <mesh material={materials.pulsarCore}>
          <sphereGeometry args={[0.26, 20, 20]} />
        </mesh>

        {/* Polar Spindle Axis through the core */}
        <mesh material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.035, 0.035, 2.1, 16]} />
        </mesh>
        {/* North and South finial nuts */}
        <mesh position={[0, 1.05, 0]} material={materials.burnishedGold}>
          <sphereGeometry args={[0.08, 12, 12]} />
        </mesh>
        <mesh position={[0, -1.05, 0]} material={materials.burnishedGold}>
          <sphereGeometry args={[0.08, 12, 12]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. ALIDADE SIGHTING ARM (ROTATING SIGHTING RULER)        */}
      {/* ======================================================== */}
      <group ref={alidadeGroupRef} position={[0, 0, 0]}>
        {/* Main rule beam */}
        <mesh material={materials.agedBrass} position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.08, 3.4, 0.02]} />
        </mesh>
        {/* Central sighting ring hub */}
        <mesh material={materials.castBronze} position={[0, 0, 0.05]}>
          <torusGeometry args={[0.22, 0.03, 12, 24]} />
        </mesh>
        {/* Top sighting vane with pinhole aperture */}
        <group position={[0, 1.6, 0.08]}>
          <mesh material={materials.burnishedGold}>
            <boxGeometry args={[0.12, 0.16, 0.03]} />
          </mesh>
          <mesh material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
          </mesh>
        </group>
        {/* Bottom sighting vane with sighting slit */}
        <group position={[0, -1.6, 0.08]}>
          <mesh material={materials.burnishedGold}>
            <boxGeometry args={[0.12, 0.16, 0.03]} />
          </mesh>
          <mesh material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
