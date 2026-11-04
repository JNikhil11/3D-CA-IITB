import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AstrolabeModelProps {
  scrollProgress: number;
  mousePosition?: { x: number; y: number };
  mousePositionRef?: React.RefObject<{ x: number; y: number }>;
  activeDomainRing?: number;
  explodedView?: boolean;
  reducedMotion: boolean;
  manualRotation?: { x: number; y: number };
  manualRotationRef?: React.RefObject<{ x: number; y: number }>;
}

export const AstrolabeModel: React.FC<AstrolabeModelProps> = ({
  scrollProgress,
  mousePosition,
  mousePositionRef,
  activeDomainRing = 0,
  explodedView = false,
  reducedMotion,
  manualRotation = { x: 0, y: 0 },
  manualRotationRef,
}) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const pedestalRef = useRef<THREE.Group>(null);
  const outerMeridianGroupRef = useRef<THREE.Group>(null);
  const eclipticGroupRef = useRef<THREE.Group>(null);
  const equinoxGroupRef = useRef<THREE.Group>(null);
  const innerSolsticeGroupRef = useRef<THREE.Group>(null);
  const globeCoreGroupRef = useRef<THREE.Group>(null);
  const alidadeGroupRef = useRef<THREE.Group>(null);
  const gearPinionRef = useRef<THREE.Group>(null);

  // Physically Based Materials (PBR) with high tactile quality
  const materials = useMemo(() => {
    return {
      agedBrass: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D9AF56'),
        metalness: 0.92,
        roughness: 0.24,
      }),
      burnishedGold: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E8C372'),
        metalness: 0.96,
        roughness: 0.16,
      }),
      castBronze: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A3226'),
        metalness: 0.88,
        roughness: 0.38,
      }),
      darkPatinaSteel: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#25221B'),
        metalness: 0.94,
        roughness: 0.42,
      }),
      vermilionRuby: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D65D40'),
        emissive: new THREE.Color('#D65D40'),
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.15,
        clearcoat: 1.0,
      }),
      ultramarineEnamel: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#243A8C'),
        metalness: 0.4,
        roughness: 0.25,
      }),
      translucentGlobe: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#344FC1'),
        metalness: 0.1,
        roughness: 0.12,
        transmission: 0.7,
        thickness: 0.9,
        transparent: true,
        opacity: 0.88,
      }),
      celestialGrid: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#E8C372'),
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
      gildedEngraving: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFF1C2'),
        metalness: 0.98,
        roughness: 0.1,
        emissive: new THREE.Color('#D9AF56'),
        emissiveIntensity: 0.2,
      }),
    };
  }, []);

  // Reusable shared geometries to eliminate 160+ individual geometry allocations
  const sharedGeometries = useMemo(() => {
    return {
      tickMajor: new THREE.BoxGeometry(0.016, 0.16, 0.09),
      tickSub: new THREE.BoxGeometry(0.016, 0.1, 0.09),
      tickMinor: new THREE.BoxGeometry(0.016, 0.05, 0.09),
      gearTooth: new THREE.BoxGeometry(0.045, 0.03, 0.07),
      zodiacDivider: new THREE.BoxGeometry(0.04, 0.28, 0.06),
      hourTick: new THREE.BoxGeometry(0.02, 0.08, 0.05),
    };
  }, []);

  // Cleanup Three.js GPU materials & geometries on unmount
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => {
        if (mat && typeof mat.dispose === 'function') {
          mat.dispose();
        }
      });
      Object.values(sharedGeometries).forEach((geom) => {
        if (geom && typeof geom.dispose === 'function') {
          geom.dispose();
        }
      });
    };
  }, [materials, sharedGeometries]);

  // Pre-calculated graduation ticks & gear teeth for high performance
  const ticks = useMemo(() => {
    const list: { angle: number; isMajor: boolean; isSub: boolean }[] = [];
    for (let i = 0; i < 96; i++) {
      list.push({
        angle: (i / 96) * Math.PI * 2,
        isMajor: i % 8 === 0,
        isSub: i % 4 === 0,
      });
    }
    return list;
  }, []);

  const gearTeeth = useMemo(() => {
    const teeth: number[] = [];
    for (let i = 0; i < 48; i++) {
      teeth.push((i / 48) * Math.PI * 2);
    }
    return teeth;
  }, []);

  // Frame animation with physical momentum and chapter scroll transitions
  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    // Passive clock time only advances when reduced motion is disabled
    const time = reducedMotion ? 0 : state.clock.getElapsedTime();

    const mouseX = mousePositionRef?.current?.x ?? mousePosition?.x ?? 0;
    const mouseY = mousePositionRef?.current?.y ?? mousePosition?.y ?? 0;
    const manualX = manualRotationRef?.current?.x ?? manualRotation?.x ?? 0;
    const manualY = manualRotationRef?.current?.y ?? manualRotation?.y ?? 0;

    // 1. Overall base orientation driven by manual drag, mouse parallax, and scroll progress
    const targetRotX =
      0.22 +
      manualX +
      (reducedMotion ? 0 : mouseY * 0.35) +
      Math.sin(scrollProgress * Math.PI) * 0.4;

    const targetRotY =
      manualY +
      (reducedMotion ? 0 : time * 0.12) +
      (reducedMotion ? 0 : mouseX * 0.5) +
      scrollProgress * Math.PI * 2.2;

    const targetRotZ =
      0.08 +
      (reducedMotion ? 0 : Math.sin(time * 0.2) * 0.04 + mouseX * 0.15);

    masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.x,
      targetRotX,
      0.08
    );
    masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.y,
      targetRotY,
      0.08
    );
    masterGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.z,
      targetRotZ,
      0.08
    );

    // 2. Exploded view offsets (spread rings along their planes when active)
    const explodeFactor = explodedView ? 1.0 : 0.0;

    // Ring 1 (Meridian)
    if (outerMeridianGroupRef.current) {
      if (!reducedMotion) outerMeridianGroupRef.current.rotation.y += delta * 0.08;
      const targetZ = explodeFactor * 0.6;
      outerMeridianGroupRef.current.position.z = THREE.MathUtils.lerp(
        outerMeridianGroupRef.current.position.z,
        targetZ,
        0.1
      );
    }

    // Ring 2 (Ecliptic / Zodiac)
    if (eclipticGroupRef.current) {
      if (!reducedMotion) eclipticGroupRef.current.rotation.z += delta * 0.14;
      const targetY = explodeFactor * 0.75;
      eclipticGroupRef.current.position.y = THREE.MathUtils.lerp(
        eclipticGroupRef.current.position.y,
        targetY,
        0.1
      );
    }

    // Ring 3 (Equinoctial)
    if (equinoxGroupRef.current) {
      if (!reducedMotion) equinoxGroupRef.current.rotation.x += delta * 0.1;
      const targetY = explodeFactor * -0.65;
      equinoxGroupRef.current.position.y = THREE.MathUtils.lerp(
        equinoxGroupRef.current.position.y,
        targetY,
        0.1
      );
    }

    // Ring 4 (Inner Solstitial)
    if (innerSolsticeGroupRef.current) {
      if (!reducedMotion) innerSolsticeGroupRef.current.rotation.y -= delta * 0.18;
      const targetX = explodeFactor * 0.7;
      innerSolsticeGroupRef.current.position.x = THREE.MathUtils.lerp(
        innerSolsticeGroupRef.current.position.x,
        targetX,
        0.1
      );
    }

    // Alidade sighting arm oscillation
    if (alidadeGroupRef.current) {
      if (!reducedMotion) {
        alidadeGroupRef.current.rotation.z = Math.sin(time * 0.4 + scrollProgress * 5) * 0.55;
      }
    }

    // Central celestial globe rotation
    if (globeCoreGroupRef.current) {
      if (!reducedMotion) globeCoreGroupRef.current.rotation.y += delta * 0.25;
    }

    // Gear pinion spinning in mesh with the main meridian ring
    if (gearPinionRef.current) {
      gearPinionRef.current.rotation.z -= delta * 1.2;
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* ======================================================== */}
      {/* 1. RENAISSANCE PEDESTAL & GIMBAL CRADLE STAND             */}
      {/* ======================================================== */}
      <group ref={pedestalRef} position={[0, -2.4, 0]}>
        {/* Tier 1: Main Cast Bronze Plinth Base */}
        <mesh position={[0, 0, 0]} material={materials.castBronze} receiveShadow>
          <cylinderGeometry args={[1.5, 1.75, 0.2, 48]} />
        </mesh>
        {/* Decorative Gold Inlay Bevel on Plinth */}
        <mesh position={[0, 0.1, 0]} material={materials.burnishedGold}>
          <torusGeometry args={[1.5, 0.035, 16, 48]} />
        </mesh>

        {/* Tier 2: Stepped Plinth Collar */}
        <mesh position={[0, 0.18, 0]} material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[1.15, 1.3, 0.16, 36]} />
        </mesh>

        {/* Leveling Feet with Knurled Thumb Screws (3 triangular points) */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <group key={`foot-${idx}`} position={[Math.cos(angle) * 1.55, -0.06, Math.sin(angle) * 1.55]}>
            <mesh material={materials.agedBrass}>
              <cylinderGeometry args={[0.22, 0.25, 0.12, 16]} />
            </mesh>
            <mesh position={[0, 0.12, 0]} material={materials.burnishedGold}>
              <cylinderGeometry args={[0.08, 0.08, 0.18, 12]} />
            </mesh>
          </group>
        ))}

        {/* Fluted Central Support Baluster / Column */}
        <mesh position={[0, 0.72, 0]} material={materials.agedBrass}>
          <cylinderGeometry args={[0.26, 0.38, 0.9, 24]} />
        </mesh>
        <mesh position={[0, 1.2, 0]} material={materials.burnishedGold}>
          <cylinderGeometry args={[0.42, 0.28, 0.12, 24]} />
        </mesh>

        {/* Heavy Curved U-Shaped Gimbal Yoke / Cradle Fork */}
        <group position={[0, 1.3, 0]}>
          {/* Horizontal crossbar beam */}
          <mesh position={[0, 0, 0]} material={materials.castBronze}>
            <cylinderGeometry args={[0.24, 0.24, 0.18, 24]} />
          </mesh>
          {/* Left curved arm rising to pivot */}
          <mesh position={[-1.75, 0.55, 0]} rotation={[0, 0, -0.32]} material={materials.agedBrass}>
            <boxGeometry args={[0.18, 1.3, 0.14]} />
          </mesh>
          <mesh position={[-2.42, 1.1, 0]} rotation={[0, 0, 0]} material={materials.burnishedGold}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
          </mesh>
          {/* Right curved arm rising to pivot */}
          <mesh position={[1.75, 0.55, 0]} rotation={[0, 0, 0.32]} material={materials.agedBrass}>
            <boxGeometry args={[0.18, 1.3, 0.14]} />
          </mesh>
          <mesh position={[2.42, 1.1, 0]} rotation={[0, 0, 0]} material={materials.burnishedGold}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
          </mesh>

          {/* Heavy Brass Pivot Bearing Blocks & Tension Bolts */}
          <mesh position={[-2.42, 1.1, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.14, 0.14, 0.28, 16]} />
          </mesh>
          <mesh position={[2.42, 1.1, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.14, 0.14, 0.28, 16]} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 2. RING 01 · PRIME MERIDIAN RING (Calibrated & Geared)   */}
      {/* ======================================================== */}
      <group ref={outerMeridianGroupRef} position={[0, 0, 0]}>
        {/* Main Structural Rectangular Band */}
        <mesh material={activeDomainRing === 0 ? materials.burnishedGold : materials.agedBrass}>
          <torusGeometry args={[2.4, 0.08, 16, 96]} />
        </mesh>
        {/* Inner Chamfer Ridge */}
        <mesh material={materials.darkPatinaSteel}>
          <torusGeometry args={[2.3, 0.03, 12, 96]} />
        </mesh>
        {/* Outer Flange */}
        <mesh material={materials.castBronze}>
          <torusGeometry args={[2.48, 0.025, 12, 96]} />
        </mesh>

        {/* 96 Astronomical Calibrated Degree Graduation Ticks */}
        {ticks.map((t, i) => (
          <mesh
            key={`meridian-tick-${i}`}
            position={[Math.cos(t.angle) * 2.4, Math.sin(t.angle) * 2.4, 0]}
            rotation={[0, 0, t.angle + Math.PI / 2]}
            geometry={
              t.isMajor
                ? sharedGeometries.tickMajor
                : t.isSub
                ? sharedGeometries.tickSub
                : sharedGeometries.tickMinor
            }
            material={t.isMajor ? materials.gildedEngraving : materials.darkPatinaSteel}
          />
        ))}

        {/* Outer Spur Gear Teeth around Perimeter */}
        {gearTeeth.map((angle, i) => (
          <mesh
            key={`gear-tooth-${i}`}
            position={[Math.cos(angle) * 2.51, Math.sin(angle) * 2.51, 0]}
            rotation={[0, 0, angle]}
            geometry={sharedGeometries.gearTooth}
            material={materials.agedBrass}
          />
        ))}

        {/* Drive Pinion Gear on Right Bearing Block */}
        <group ref={gearPinionRef} position={[2.54, 0, 0]}>
          <mesh material={materials.burnishedGold}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
          </mesh>
          <mesh material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.06, 0.06, 0.16, 12]} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. RING 02 · TILTED ECLIPTIC / ZODIAC BAND (23.5°)       */}
      {/* ======================================================== */}
      <group
        ref={eclipticGroupRef}
        rotation={[THREE.MathUtils.degToRad(23.5), 0, THREE.MathUtils.degToRad(12)]}
      >
        {/* Broad Solid Zodiac Brass Cylinder Band */}
        <mesh material={activeDomainRing === 1 ? materials.burnishedGold : materials.agedBrass}>
          <cylinderGeometry args={[2.15, 2.15, 0.28, 64, 1, true]} />
        </mesh>
        {/* Upper & Lower Beaded Retaining Rings */}
        <mesh position={[0, 0.14, 0]} material={materials.darkPatinaSteel}>
          <torusGeometry args={[2.16, 0.03, 12, 64]} />
        </mesh>
        <mesh position={[0, -0.14, 0]} material={materials.darkPatinaSteel}>
          <torusGeometry args={[2.16, 0.03, 12, 64]} />
        </mesh>

        {/* 12 Zodiac Constellation Division Blocks & Ruby Star Nodes */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const theta = (idx / 12) * Math.PI * 2;
          return (
            <group key={`zodiac-block-${idx}`} position={[Math.cos(theta) * 2.15, 0, Math.sin(theta) * 2.15]}>
              {/* Vertical engraved separator bar */}
              <mesh geometry={sharedGeometries.zodiacDivider} material={materials.darkPatinaSteel} />
              {/* Bezel mount with ruby planetary marker */}
              <mesh position={[0, 0, 0.03]} material={materials.burnishedGold}>
                <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
              </mesh>
              <mesh position={[0, 0, 0.055]} material={materials.vermilionRuby}>
                <sphereGeometry args={[0.045, 12, 12]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ======================================================== */}
      {/* 4. RING 03 · EQUINOCTIAL & CARDINAL PLANE RING            */}
      {/* ======================================================== */}
      <group ref={equinoxGroupRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Circular Flat Equinox Plate */}
        <mesh material={activeDomainRing === 2 ? materials.burnishedGold : materials.agedBrass}>
          <torusGeometry args={[1.82, 0.065, 16, 64]} />
        </mesh>
        {/* Inner Geared Track */}
        <mesh material={materials.darkPatinaSteel}>
          <torusGeometry args={[1.72, 0.025, 12, 64]} />
        </mesh>

        {/* 4 Cardinal Directional Pointers (N, S, E, W) */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
          <group
            key={`cardinal-ptr-${idx}`}
            position={[Math.cos(angle) * 1.82, Math.sin(angle) * 1.82, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            {/* Tapered pointer arrow */}
            <mesh material={materials.burnishedGold}>
              <coneGeometry args={[0.09, 0.24, 12]} />
            </mesh>
            <mesh position={[0, -0.1, 0]} material={materials.vermilionRuby}>
              <sphereGeometry args={[0.05, 10, 10]} />
            </mesh>
          </group>
        ))}

        {/* 24 Radial Hour Markings */}
        {Array.from({ length: 24 }).map((_, idx) => {
          const angle = (idx / 24) * Math.PI * 2;
          return (
            <mesh
              key={`hour-tick-${idx}`}
              position={[Math.cos(angle) * 1.82, Math.sin(angle) * 1.82, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
              geometry={sharedGeometries.hourTick}
              material={materials.darkPatinaSteel}
            />
          );
        })}
      </group>

      {/* ======================================================== */}
      {/* 5. RING 04 · INNER SOLSTITIAL / AZIMUTH RING             */}
      {/* ======================================================== */}
      <group ref={innerSolsticeGroupRef} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={activeDomainRing === 3 ? materials.burnishedGold : materials.castBronze}>
          <torusGeometry args={[1.48, 0.055, 16, 64]} />
        </mesh>
        {/* Secondary Inner Bearing Rail */}
        <mesh material={materials.agedBrass}>
          <torusGeometry args={[1.4, 0.025, 12, 64]} />
        </mesh>

        {/* Dual Brass Planetary Counterweights on Spindles */}
        <group position={[1.48, 0, 0]}>
          <mesh material={materials.burnishedGold}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.08]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
          </mesh>
        </group>
        <group position={[-1.48, 0, 0]}>
          <mesh material={materials.burnishedGold}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.08]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 6. CENTRAL CELESTIAL GLOBE & POLAR AXIS ASSEMBLY         */}
      {/* ======================================================== */}
      <group ref={globeCoreGroupRef} position={[0, 0, 0]}>
        {/* Main Polar Spindle Axis through entire Sphere */}
        <mesh material={materials.burnishedGold}>
          <cylinderGeometry args={[0.065, 0.065, 5.2, 24]} />
        </mesh>
        {/* Spindle Top & Bottom Finials with Acorn caps */}
        <mesh position={[0, 2.65, 0]} material={materials.burnishedGold}>
          <coneGeometry args={[0.12, 0.22, 16]} />
        </mesh>
        <mesh position={[0, -2.65, 0]} rotation={[0, 0, Math.PI]} material={materials.burnishedGold}>
          <coneGeometry args={[0.12, 0.22, 16]} />
        </mesh>

        {/* Deep Translucent Ultramarine Celestial Sphere */}
        <mesh material={materials.translucentGlobe}>
          <sphereGeometry args={[0.88, 36, 36]} />
        </mesh>

        {/* Celestial Coordinate Armillary Meridian Cage (Gold Wireframe) */}
        <mesh material={materials.celestialGrid}>
          <sphereGeometry args={[0.91, 18, 14]} />
        </mesh>

        {/* Solid Gilded Equator Ring Band on Globe */}
        <mesh material={materials.burnishedGold}>
          <torusGeometry args={[0.89, 0.025, 12, 48]} />
        </mesh>

        {/* Inner Glowing Atomic Pulsar Pivot Core */}
        <mesh material={materials.vermilionRuby}>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#D65D40" intensity={2.2} distance={4.5} />
      </group>

      {/* ======================================================== */}
      {/* 7. ALIDADE (Astrolabe Openwork Sighting Arm)              */}
      {/* ======================================================== */}
      <group ref={alidadeGroupRef} position={[0, 0, 0.12]}>
        {/* Central Beveled Pivot Boss with Star Medallion */}
        <mesh material={materials.burnishedGold}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 20]} />
        </mesh>
        <mesh position={[0, 0, 0.05]} material={materials.darkPatinaSteel}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
        </mesh>

        {/* Main Tapered Openwork Rule Arm */}
        <mesh position={[0, 0, 0]} material={materials.agedBrass}>
          <boxGeometry args={[0.07, 3.8, 0.035]} />
        </mesh>

        {/* Double Sighting Pinnules with Precision Apertures */}
        {/* Upper Sighting Vane */}
        <group position={[0, 1.72, 0.06]}>
          <mesh material={materials.burnishedGold}>
            <boxGeometry args={[0.16, 0.12, 0.04]} />
          </mesh>
          {/* Peep sight hole */}
          <mesh position={[0, 0, 0]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
          </mesh>
          <mesh position={[0, 0.14, 0]} material={materials.vermilionRuby}>
            <coneGeometry args={[0.07, 0.18, 12]} />
          </mesh>
        </group>

        {/* Lower Sighting Vane */}
        <group position={[0, -1.72, 0.06]}>
          <mesh material={materials.burnishedGold}>
            <boxGeometry args={[0.16, 0.12, 0.04]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={materials.darkPatinaSteel}>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
          </mesh>
          <mesh position={[0, -0.14, 0]} rotation={[0, 0, Math.PI]} material={materials.vermilionRuby}>
            <coneGeometry args={[0.07, 0.18, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
