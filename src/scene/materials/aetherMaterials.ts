import * as THREE from 'three';
import {
  AetherTextures,
  createLatinBandTexture,
  createRomanNumeralDialTexture,
  createZodiacGlyphTexture,
  createSolarCellTexture,
  createHexCircuitTexture,
  disposeAetherTextures,
} from '../factory/textureFactory';

export interface AetherMaterialPalette {
  agedBrass: THREE.MeshStandardMaterial;
  burnishedGold: THREE.MeshStandardMaterial;
  darkWalnut: THREE.MeshStandardMaterial;
  castBronze: THREE.MeshStandardMaterial;
  darkPatinaSteel: THREE.MeshStandardMaterial;
  latinEngravedBrass: THREE.MeshStandardMaterial;
  romanClockFace: THREE.MeshStandardMaterial;
  zodiacBand: THREE.MeshStandardMaterial;
  translucentGlobe: THREE.MeshPhysicalMaterial;
  celestialGrid: THREE.MeshBasicMaterial;
  pulsarCore: THREE.MeshStandardMaterial;
  vermilionRuby: THREE.MeshPhysicalMaterial;
  plasmaCyan: THREE.MeshStandardMaterial;
  tokamakMagenta: THREE.MeshPhysicalMaterial;
  solarPanel: THREE.MeshStandardMaterial;
  quantumCore: THREE.MeshPhysicalMaterial;
  emeraldBiosphere: THREE.MeshPhysicalMaterial;
  beaconHalo: THREE.MeshBasicMaterial;
}

/**
 * Creates the complete PBR material set and generated procedural textures.
 */
export function createAetherMaterials(): {
  materials: AetherMaterialPalette;
  textures: AetherTextures;
} {
  // Generate procedural canvas textures
  const latinMeridianTexture = createLatinBandTexture();
  const romanClockDialTexture = createRomanNumeralDialTexture();
  const zodiacEclipticTexture = createZodiacGlyphTexture();
  const solarCellTexture = createSolarCellTexture();
  const hexCircuitTexture = createHexCircuitTexture();

  const textures: AetherTextures = {
    latinMeridianTexture,
    romanClockDialTexture,
    zodiacEclipticTexture,
    solarCellTexture,
    hexCircuitTexture,
  };

  const materials: AetherMaterialPalette = {
    // 1. Structural Antique Brass
    agedBrass: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 0.92,
      roughness: 0.28,
      envMapIntensity: 1.2,
    }),

    // 2. High-Specular Burnished Gold
    burnishedGold: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F6D886'),
      metalness: 0.97,
      roughness: 0.14,
      envMapIntensity: 1.5,
    }),

    // 3. Renaissance Carved Walnut Wood Pedestal
    darkWalnut: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#221610'),
      roughness: 0.68,
      metalness: 0.06,
    }),

    // 4. Heavy Cast Bronze Trunnions & Claws
    castBronze: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4E3825'),
      metalness: 0.88,
      roughness: 0.42,
    }),

    // 5. Dark Patina Steel Fasteners & Screws
    darkPatinaSteel: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#221F1B'),
      metalness: 0.94,
      roughness: 0.38,
    }),

    // 6. Colurus Meridian Ring with Engraved Latin Text
    latinEngravedBrass: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F5D480'),
      map: latinMeridianTexture,
      metalness: 0.9,
      roughness: 0.24,
      envMapIntensity: 1.2,
    }),

    // 7. Side Clockwork Roman Numeral Face
    romanClockFace: new THREE.MeshStandardMaterial({
      map: romanClockDialTexture,
      metalness: 0.45,
      roughness: 0.35,
    }),

    // 8. Tilted Zodiac Band with Astrological Symbols
    zodiacBand: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F6DE95'),
      map: zodiacEclipticTexture,
      metalness: 0.88,
      roughness: 0.22,
    }),

    // 9. Central Translucent Celestial Sphere
    translucentGlobe: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1B3564'),
      metalness: 0.12,
      roughness: 0.14,
      transmission: 0.68,
      thickness: 1.1,
      transparent: true,
      opacity: 0.86,
    }),

    // 10. Celestial Coordinate Grid
    celestialGrid: new THREE.MeshBasicMaterial({
      color: new THREE.Color('#F0D278'),
      wireframe: true,
      transparent: true,
      opacity: 0.48,
    }),

    // 11. Central Pulsar Energy Core
    pulsarCore: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFE27A'),
      emissive: new THREE.Color('#D9AF56'),
      emissiveIntensity: 1.6,
      roughness: 0.1,
    }),

    // 12. Renaissance Vermilion Ruby Gems & Accents
    vermilionRuby: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C9381E'),
      emissive: new THREE.Color('#94200E'),
      emissiveIntensity: 0.65,
      metalness: 0.18,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    }),

    // 13. High-Tech Aerospace & Computing Cyan Plasma
    plasmaCyan: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00F0FF'),
      emissive: new THREE.Color('#00E5FF'),
      emissiveIntensity: 2.2,
      roughness: 0.1,
    }),

    // 14. Sustainable Fusion Tokamak Plasma Torus
    tokamakMagenta: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF007F'),
      emissive: new THREE.Color('#E60067'),
      emissiveIntensity: 2.4,
      transmission: 0.5,
      transparent: true,
      opacity: 0.8,
    }),

    // 15. Photovoltaic Solar Panels (Aerospace World)
    solarPanel: new THREE.MeshStandardMaterial({
      map: solarCellTexture,
      metalness: 0.75,
      roughness: 0.25,
    }),

    // 16. Quantum Computing Hypercube Core
    quantumCore: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1BE7FF'),
      transmission: 0.78,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.82,
    }),

    // 17. Sustainable Ecology Geodesic Biosphere
    emeraldBiosphere: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2ECC71'),
      emissive: new THREE.Color('#107C41'),
      emissiveIntensity: 0.55,
      transmission: 0.65,
      transparent: true,
      opacity: 0.75,
    }),

    // 18. Festival Pavilion Interactive Beacon Halo
    beaconHalo: new THREE.MeshBasicMaterial({
      color: new THREE.Color('#F39C12'),
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    }),
  };

  return { materials, textures };
}

/**
 * Systematically disposes GPU materials and textures on unmount.
 */
export function disposeAetherPalette(
  materials: Partial<AetherMaterialPalette>,
  textures: Partial<AetherTextures>
): void {
  Object.values(materials).forEach((mat) => {
    if (mat && typeof mat.dispose === 'function') {
      mat.dispose();
    }
  });
  disposeAetherTextures(textures);
}
