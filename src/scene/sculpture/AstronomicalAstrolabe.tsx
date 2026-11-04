/**
 * AstronomicalAstrolabe — Master Renaissance Mechanical Astronomical Sculpture
 *
 * Implements the authentic Aetherial Renaissance aesthetic from the project reference:
 * - Central celestial globe with antique map & coordinate grid
 * - Heavy brass meridian ring with outer gear teeth & Latin graduations
 * - Horizontal equatorial horizon ring with supporting quadrant brackets
 * - Tilted (23.44°) zodiac ecliptic band with constellation glyphs
 * - Nested solstitial rings & sighting alidade
 * - Mounted mechanical clockwork gear train with Roman numeral dial & ticking hands
 * - Renaissance turned baluster pedestal, 4 lion claw feet & rich walnut plinth
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createClockDialTexture,
  createZodiacBandTexture,
  createWalnutWoodTexture,
} from './astrolabeTextures';

export interface AstronomicalAstrolabeProps {
  scrollProgress?: number;
  reducedMotion?: boolean;
}

export const AstronomicalAstrolabe: React.FC<AstronomicalAstrolabeProps> = ({
  scrollProgress = 0,
  reducedMotion = false,
}) => {
  // References for animation
  const rootGroupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Group>(null);
  const zodiacBandRef = useRef<THREE.Group>(null);
  const innerRing1Ref = useRef<THREE.Group>(null);
  const innerRing2Ref = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const alidadeRef = useRef<THREE.Group>(null);

  // Load Earth texture for celestial globe
  const earthTexture = useLoader(THREE.TextureLoader, '/textures/earth.jpg');
  earthTexture.anisotropy = 8;

  // Generate procedural canvas textures
  const { clockDialTex, zodiacTex, walnutTex } = useMemo(() => {
    return {
      clockDialTex: createClockDialTexture(),
      zodiacTex: createZodiacBandTexture(),
      walnutTex: createWalnutWoodTexture(),
    };
  }, []);

  // Dispose generated textures on unmount
  useEffect(() => {
    return () => {
      clockDialTex.dispose();
      zodiacTex.dispose();
      walnutTex.dispose();
    };
  }, [clockDialTex, zodiacTex, walnutTex]);

  // Master PBR Materials Palette
  const materials = useMemo(() => {
    // Rich aged brass for main structural rings
    const agedBrass = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4A853'),
      metalness: 0.94,
      roughness: 0.22,
      envMapIntensity: 2.4,
    });

    // Deep burnished bronze for secondary rings & joints
    const deepBronze = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#946B28'),
      metalness: 0.92,
      roughness: 0.32,
      envMapIntensity: 1.8,
    });

    // Bright gold foil for engraved accents & gears
    const goldAccent = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F7D57F'),
      metalness: 0.97,
      roughness: 0.15,
      envMapIntensity: 3.0,
    });

    // Celestial globe: metallic golden earth
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: new THREE.Color('#E8C170'),
      metalness: 0.72,
      roughness: 0.28,
      envMapIntensity: 2.0,
    });

    // Zodiac band: cylindrical band mapped with constellation texture
    const zodiacMat = new THREE.MeshStandardMaterial({
      map: zodiacTex,
      metalness: 0.88,
      roughness: 0.25,
      side: THREE.DoubleSide,
      envMapIntensity: 2.2,
    });

    // Clock dial face material
    const clockDialMat = new THREE.MeshStandardMaterial({
      map: clockDialTex,
      roughness: 0.35,
      metalness: 0.15,
      envMapIntensity: 1.2,
    });

    // Blued steel for clock hands & screws
    const bluedSteel = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E2A3A'),
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 2.0,
    });

    // Dark polished walnut wood for plinth base
    const walnutMat = new THREE.MeshStandardMaterial({
      map: walnutTex,
      color: new THREE.Color('#382214'),
      roughness: 0.42,
      metalness: 0.08,
      envMapIntensity: 1.0,
    });

    // Coordinate grid line material
    const gridLineMat = new THREE.LineBasicMaterial({
      color: 0xE8C170,
      transparent: true,
      opacity: 0.45,
    });

    return {
      agedBrass,
      deepBronze,
      goldAccent,
      globeMat,
      zodiacMat,
      clockDialMat,
      bluedSteel,
      walnutMat,
      gridLineMat,
    };
  }, [earthTexture, zodiacTex, clockDialTex, walnutTex]);

  // Clean up materials on unmount
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // Compute 96 outer spur gear teeth on the meridian ring
  const gearTeeth = useMemo(() => {
    const teeth: { angle: number; x: number; y: number }[] = [];
    const count = 96;
    const r = 2.34;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      teeth.push({
        angle,
        x: Math.sin(angle) * r,
        y: Math.cos(angle) * r,
      });
    }
    return teeth;
  }, []);

  // Compute 72 graduation ticks on meridian ring
  const meridianTicks = useMemo(() => {
    const ticks: { angle: number; x: number; y: number; isMajor: boolean }[] = [];
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      ticks.push({
        angle,
        x: Math.sin(angle) * 2.24,
        y: Math.cos(angle) * 2.24,
        isMajor: i % 6 === 0,
      });
    }
    return ticks;
  }, []);

  // Compute 16 teeth for clockwork gear 1 and 28 for gear 2
  const clockGear1Teeth = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2);
  }, []);

  const clockGear2Teeth = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => (i / 28) * Math.PI * 2);
  }, []);

  // Animation frame loop
  useFrame((_, delta) => {
    if (reducedMotion) return;
    const dt = Math.min(delta, 0.1);

    // Continuous celestial rotations
    if (globeRef.current) {
      globeRef.current.rotation.y += dt * 0.15;
    }

    if (zodiacBandRef.current) {
      zodiacBandRef.current.rotation.y += dt * 0.08;
    }

    if (innerRing1Ref.current) {
      innerRing1Ref.current.rotation.x += dt * 0.12;
      innerRing1Ref.current.rotation.z += dt * 0.04;
    }

    if (innerRing2Ref.current) {
      innerRing2Ref.current.rotation.y -= dt * 0.1;
      innerRing2Ref.current.rotation.z -= dt * 0.06;
    }

    if (alidadeRef.current) {
      alidadeRef.current.rotation.z += dt * 0.05;
    }

    // Clockwork animations
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z -= dt * 0.4;
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z -= dt * (0.4 / 12);
    }
    if (gear1Ref.current) {
      gear1Ref.current.rotation.z += dt * 0.6;
    }
    if (gear2Ref.current) {
      gear2Ref.current.rotation.z -= dt * (0.6 * (16 / 28));
    }

    // Dynamic scroll reactivity (subtle responsive axial tilt)
    if (rootGroupRef.current) {
      const targetRotY = scrollProgress * Math.PI * 0.8;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        0.05
      );
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.4, 0]}>
      {/* ============================================================ */}
      {/* 1. CENTRAL CELESTIAL GLOBE & POLAR SPINDLE                   */}
      {/* ============================================================ */}
      <group position={[0, 1.4, 0]}>
        {/* Central Spindle Axis */}
        <mesh material={materials.agedBrass} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 4.8, 16]} />
        </mesh>
        {/* Top & bottom spindle finial acorns */}
        <mesh position={[0, 2.45, 0]} material={materials.goldAccent} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh position={[0, -2.45, 0]} material={materials.goldAccent} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>

        {/* Rotating Globe Group */}
        <group ref={globeRef}>
          {/* Main sphere with antique earth texture */}
          <mesh material={materials.globeMat} castShadow receiveShadow>
            <sphereGeometry args={[0.72, 48, 48]} />
          </mesh>

          {/* Coordinate grid rings */}
          {/* Equator ring */}
          <mesh material={materials.goldAccent} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.73, 0.008, 8, 64]} />
          </mesh>
          {/* Tropics */}
          <mesh position={[0, 0.28, 0]} material={materials.deepBronze} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.66, 0.006, 8, 48]} />
          </mesh>
          <mesh position={[0, -0.28, 0]} material={materials.deepBronze} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.66, 0.006, 8, 48]} />
          </mesh>
          {/* Meridian lines (4 longitudinal circles) */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, i) => (
            <mesh key={i} rotation={[0, angle, 0]} material={materials.deepBronze}>
              <torusGeometry args={[0.73, 0.006, 8, 64]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ============================================================ */}
      {/* 2. OUTER VERTICAL MERIDIAN RING (COLURUS AEQUINOCTIALIS)     */}
      {/* ============================================================ */}
      <group position={[0, 1.4, 0]}>
        {/* Main heavy meridian torus */}
        <mesh material={materials.agedBrass} castShadow receiveShadow>
          <torusGeometry args={[2.28, 0.052, 24, 128]} />
        </mesh>
        {/* Inner concentric rim border */}
        <mesh material={materials.deepBronze}>
          <torusGeometry args={[2.21, 0.016, 12, 128]} />
        </mesh>
        <mesh material={materials.deepBronze}>
          <torusGeometry args={[2.35, 0.016, 12, 128]} />
        </mesh>

        {/* 96 Outer spur gear teeth on rim */}
        {gearTeeth.map((tooth, idx) => (
          <mesh
            key={idx}
            position={[tooth.x, tooth.y, 0]}
            rotation={[0, 0, -tooth.angle]}
            material={materials.agedBrass}
            castShadow
          >
            <boxGeometry args={[0.024, 0.075, 0.05]} />
          </mesh>
        ))}

        {/* Graduation tick marks along inner circumference */}
        {meridianTicks.map((tick, idx) => (
          <mesh
            key={idx}
            position={[tick.x, tick.y, 0]}
            rotation={[0, 0, -tick.angle]}
            material={tick.isMajor ? materials.goldAccent : materials.deepBronze}
          >
            <boxGeometry args={[0.012, tick.isMajor ? 0.07 : 0.035, 0.04]} />
          </mesh>
        ))}

        {/* Zenith Crown Finial Urn */}
        <group position={[0, 2.38, 0]}>
          <mesh material={materials.goldAccent} castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.16, 16]} />
          </mesh>
          <mesh position={[0, 0.12, 0]} material={materials.agedBrass} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh position={[0, 0.22, 0]} material={materials.goldAccent} castShadow>
            <coneGeometry args={[0.04, 0.14, 16]} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. HORIZONTAL EQUATORIAL / HORIZON RING                      */}
      {/* ============================================================ */}
      <group position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Main horizon torus */}
        <mesh material={materials.agedBrass} castShadow receiveShadow>
          <torusGeometry args={[2.36, 0.048, 20, 128]} />
        </mesh>
        {/* Inner stepped border */}
        <mesh material={materials.deepBronze}>
          <torusGeometry args={[2.29, 0.014, 12, 128]} />
        </mesh>

        {/* 4 Cardinal Directional Pointers */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.sin(angle) * 2.36, Math.cos(angle) * 2.36, 0]}
            rotation={[0, 0, -angle + Math.PI / 2]}
            material={materials.goldAccent}
            castShadow
          >
            <coneGeometry args={[0.045, 0.18, 12]} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 4. TILTED ZODIAC ECLIPTIC BAND (23.44° AXIAL TILT)           */}
      {/* ============================================================ */}
      <group position={[0, 1.4, 0]} rotation={[0.41, 0, 0.15]} ref={zodiacBandRef}>
        {/* Wide cylindrical band with texture */}
        <mesh material={materials.zodiacMat} castShadow receiveShadow>
          <cylinderGeometry args={[1.92, 1.92, 0.28, 128, 1, true]} />
        </mesh>
        {/* Top and bottom reinforcing bronze rims */}
        <mesh position={[0, 0.14, 0]} material={materials.agedBrass}>
          <torusGeometry args={[1.92, 0.022, 12, 128]} />
        </mesh>
        <mesh position={[0, -0.14, 0]} material={materials.agedBrass}>
          <torusGeometry args={[1.92, 0.022, 12, 128]} />
        </mesh>

        {/* 12 Ruby Gem / Gold Nodes at zodiac boundaries */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 1.92, 0, Math.cos(a) * 1.92]}
              material={materials.goldAccent}
              castShadow
            >
              <sphereGeometry args={[0.038, 12, 12]} />
            </mesh>
          );
        })}
      </group>

      {/* ============================================================ */}
      {/* 5. INDEPENDENT INNER SOLSTITIAL RINGS                        */}
      {/* ============================================================ */}
      <group position={[0, 1.4, 0]}>
        {/* Inner Solstitial Ring 1 */}
        <group ref={innerRing1Ref} rotation={[0, 0.7, 0.3]}>
          <mesh material={materials.deepBronze} castShadow>
            <torusGeometry args={[1.52, 0.028, 16, 96]} />
          </mesh>
          {/* Cross support arm */}
          <mesh material={materials.agedBrass}>
            <cylinderGeometry args={[0.014, 0.014, 3.0, 8]} />
          </mesh>
        </group>

        {/* Inner Equinoctial Ring 2 */}
        <group ref={innerRing2Ref} rotation={[0.9, 0, -0.4]}>
          <mesh material={materials.agedBrass} castShadow>
            <torusGeometry args={[1.18, 0.024, 16, 80]} />
          </mesh>
          <mesh material={materials.deepBronze} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 2.3, 8]} />
          </mesh>
        </group>

        {/* Sighting Alidade (Rotating Dioptra) */}
        <group ref={alidadeRef}>
          <mesh material={materials.goldAccent} castShadow>
            <boxGeometry args={[0.032, 3.4, 0.016]} />
          </mesh>
          {/* Top sight vane with aperture */}
          <mesh position={[0, 1.6, 0.04]} material={materials.agedBrass} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.012]} />
          </mesh>
          {/* Bottom sight vane */}
          <mesh position={[0, -1.6, 0.04]} material={materials.agedBrass} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.012]} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 6. MECHANICAL CLOCKWORK TRAIN & ROMAN DIAL                   */}
      {/* (Mounted off the right side as in reference image)           */}
      {/* ============================================================ */}
      <group position={[1.55, 0.55, 0.95]} rotation={[0, -0.25, 0]}>
        {/* Curved mounting bracket connecting clockwork to meridian ring */}
        <mesh
          position={[-0.45, 0.35, -0.45]}
          rotation={[0, 0, -0.6]}
          material={materials.agedBrass}
          castShadow
        >
          <boxGeometry args={[0.06, 1.1, 0.05]} />
        </mesh>

        {/* Main circular clock housing / bezel cylinder (aligned with Z) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.agedBrass} castShadow>
          <cylinderGeometry args={[0.66, 0.70, 0.16, 48]} />
        </mesh>
        {/* Molded front bezel ring (in XY plane, framing dial) */}
        <mesh position={[0, 0, 0.082]} material={materials.goldAccent}>
          <torusGeometry args={[0.64, 0.026, 16, 48]} />
        </mesh>

        {/* Clock Dial Face with Roman Numerals Texture */}
        <mesh position={[0, 0, 0.083]} material={materials.clockDialMat}>
          <circleGeometry args={[0.62, 48]} />
        </mesh>

        {/* Hour Hand (Ornate Baroque Pierced Hand) */}
        <group position={[0, 0, 0.095]} ref={hourHandRef}>
          <mesh position={[0, 0.16, 0]} material={materials.bluedSteel}>
            <boxGeometry args={[0.028, 0.34, 0.008]} />
          </mesh>
          <mesh position={[0, 0.28, 0]} material={materials.bluedSteel}>
            <coneGeometry args={[0.04, 0.1, 8]} />
          </mesh>
          <mesh position={[0, 0.12, 0]} material={materials.bluedSteel}>
            <circleGeometry args={[0.055, 12]} />
          </mesh>
        </group>

        {/* Minute Hand (Longer, slender pierced hand) */}
        <group position={[0, 0, 0.10]} ref={minuteHandRef}>
          <mesh position={[0, 0.24, 0]} material={materials.bluedSteel}>
            <boxGeometry args={[0.018, 0.5, 0.008]} />
          </mesh>
          <mesh position={[0, 0.44, 0]} material={materials.bluedSteel}>
            <coneGeometry args={[0.03, 0.12, 8]} />
          </mesh>
        </group>

        {/* Center arbor cap */}
        <mesh position={[0, 0, 0.11]} material={materials.goldAccent}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>

        {/* Skeletonized Gear Train (Behind the dial) */}
        <group position={[0, -0.15, -0.12]}>
          {/* Main 16-tooth spur gear */}
          <group ref={gear1Ref} position={[-0.2, -0.1, 0]}>
            <mesh material={materials.goldAccent} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.028, 24]} />
            </mesh>
            {clockGear1Teeth.map((angle, idx) => (
              <mesh
                key={idx}
                position={[Math.sin(angle) * 0.33, Math.cos(angle) * 0.33, 0]}
                rotation={[0, 0, -angle]}
                material={materials.goldAccent}
              >
                <boxGeometry args={[0.025, 0.05, 0.028]} />
              </mesh>
            ))}
            {/* Gear spokes */}
            {[0, Math.PI / 3, (2 * Math.PI) / 3].map((a, idx) => (
              <mesh key={idx} rotation={[0, 0, a]} material={materials.agedBrass}>
                <boxGeometry args={[0.03, 0.6, 0.02]} />
              </mesh>
            ))}
          </group>

          {/* Secondary 28-tooth spur gear */}
          <group ref={gear2Ref} position={[0.24, -0.25, 0]}>
            <mesh material={materials.deepBronze} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.024, 32]} />
            </mesh>
            {clockGear2Teeth.map((angle, idx) => (
              <mesh
                key={idx}
                position={[Math.sin(angle) * 0.43, Math.cos(angle) * 0.43, 0]}
                rotation={[0, 0, -angle]}
                material={materials.deepBronze}
              >
                <boxGeometry args={[0.025, 0.045, 0.024]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 7. ORNAMENTAL RENAISSANCE PEDESTAL, CLAW FEET & WOOD PLINTH  */}
      {/* ============================================================ */}
      <group position={[0, -0.9, 0]}>
        {/* Cradle Yoke Arm: Arched brass half-ring cradling the meridian ring */}
        <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI]} material={materials.agedBrass} castShadow>
          <torusGeometry args={[2.32, 0.045, 16, 64, Math.PI]} />
        </mesh>
        {/* Decorative yoke end rosettes */}
        <mesh position={[-2.32, 1.4, 0]} material={materials.goldAccent} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh position={[2.32, 1.4, 0]} material={materials.goldAccent} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>

        {/* Central Pedestal Neck Fitting */}
        <mesh position={[0, -0.92, 0]} material={materials.agedBrass} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.2, 24]} />
        </mesh>
        <mesh position={[0, -0.82, 0]} material={materials.goldAccent}>
          <torusGeometry args={[0.22, 0.035, 16, 32]} />
        </mesh>

        {/* Central Turned Baluster Urn Column */}
        <mesh position={[0, -1.15, 0]} material={materials.agedBrass} castShadow>
          <cylinderGeometry args={[0.16, 0.32, 0.35, 32]} />
        </mesh>
        <mesh position={[0, -1.35, 0]} material={materials.goldAccent} castShadow>
          <torusGeometry args={[0.34, 0.04, 16, 32]} />
        </mesh>
        <mesh position={[0, -1.5, 0]} material={materials.agedBrass} castShadow>
          <cylinderGeometry args={[0.32, 0.58, 0.26, 32]} />
        </mesh>
        <mesh position={[0, -1.64, 0]} material={materials.goldAccent} castShadow>
          <torusGeometry args={[0.60, 0.045, 16, 36]} />
        </mesh>

        {/* 4 Cast Brass Scrolled Lion Claw Feet */}
        {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle, idx) => {
          const r = 0.68;
          const x = Math.sin(angle) * r;
          const z = Math.cos(angle) * r;
          return (
            <group key={idx} position={[x, -1.72, z]} rotation={[0, -angle, 0]}>
              {/* Ornate scrolled leg */}
              <mesh position={[0, 0.08, 0]} rotation={[0.35, 0, 0]} material={materials.agedBrass} castShadow>
                <boxGeometry args={[0.14, 0.24, 0.12]} />
              </mesh>
              {/* Lion paw ball */}
              <mesh position={[0, -0.04, 0.08]} material={materials.goldAccent} castShadow>
                <sphereGeometry args={[0.10, 16, 16]} />
              </mesh>
              {/* 3 Prominent cast claws */}
              {[-0.05, 0, 0.05].map((cx, cIdx) => (
                <mesh
                  key={cIdx}
                  position={[cx, -0.07, 0.16]}
                  rotation={[0.7, 0, 0]}
                  material={materials.goldAccent}
                >
                  <coneGeometry args={[0.02, 0.08, 8]} />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* Rich Solid Dark Walnut Wood Plinth Base (Molded stepped table) */}
        <mesh position={[0, -1.86, 0]} material={materials.walnutMat} receiveShadow castShadow>
          <cylinderGeometry args={[1.05, 1.15, 0.14, 48]} />
        </mesh>
        <mesh position={[0, -1.98, 0]} material={materials.walnutMat} receiveShadow castShadow>
          <cylinderGeometry args={[1.22, 1.32, 0.14, 48]} />
        </mesh>
      </group>
    </group>
  );
};
