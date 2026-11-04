/**
 * Procedural Texture Generator for Renaissance Astronomical Astrolabe
 * Generates crisp, high-resolution canvas textures for:
 * 1. Roman Numeral Clock Dial
 * 2. Engraved Zodiac / Constellation Ecliptic Band
 * 3. Meridian & Equatorial Degree Graduation Marks & Latin Inscriptions
 * 4. Rich Walnut Wood Grain for the Pedestal Plinth
 */

import * as THREE from 'three';

/**
 * Creates an antique Roman numeral clock face texture
 */
export function createClockDialTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 24;

  // Background: Aged parchment enamel with warm radial gradient
  const bgGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
  bgGrad.addColorStop(0, '#FFFDF8');
  bgGrad.addColorStop(0.7, '#F7EED9');
  bgGrad.addColorStop(1, '#E4D5B5');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Outer gold rim border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#9C7A2E';
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#D9AF56';
  ctx.beginPath();
  ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
  ctx.stroke();

  // Inner track
  ctx.beginPath();
  ctx.arc(cx, cy, r - 52, 0, Math.PI * 2);
  ctx.stroke();

  // 60 minute ticks
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isFive = i % 5 === 0;
    const r1 = r - 14;
    const r2 = isFive ? r - 48 : r - 30;

    ctx.lineWidth = isFive ? 5 : 2;
    ctx.strokeStyle = isFive ? '#272721' : '#725E3B';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Roman Numerals
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.fillStyle = '#1E1E19';
  ctx.font = 'bold 56px "Cormorant Garamond", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const numR = r - 100;
    const x = cx + Math.cos(angle) * numR;
    const y = cy + Math.sin(angle) * numR;
    ctx.fillText(numerals[i], x, y);
  }

  // Inner decorative astrological star / compass rose
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(217, 175, 86, 0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r * 0.45);
    ctx.stroke();
  }
  // Central arbor circle
  ctx.fillStyle = '#8B6A2B';
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#D9AF56';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates the Zodiac band texture with constellation names and glyphs
 */
export function createZodiacBandTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background: Rich antique hammered bronze/brass
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#5A421A');
  bgGrad.addColorStop(0.5, '#8C6C32');
  bgGrad.addColorStop(1, '#4A3514');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Border gold rules
  ctx.strokeStyle = '#E8C372';
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, width - 8, height - 8);
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // 12 Zodiac signs in order
  const signs = [
    { name: 'ARIES', symbol: 'AR', deg: '0°' },
    { name: 'TAURUS', symbol: 'TA', deg: '30°' },
    { name: 'GEMINI', symbol: 'GE', deg: '60°' },
    { name: 'CANCER', symbol: 'CA', deg: '90°' },
    { name: 'LEO', symbol: 'LE', deg: '120°' },
    { name: 'VIRGO', symbol: 'VI', deg: '150°' },
    { name: 'LIBRA', symbol: 'LI', deg: '180°' },
    { name: 'SCORPIUS', symbol: 'SC', deg: '210°' },
    { name: 'SAGITTARIUS', symbol: 'SA', deg: '240°' },
    { name: 'CAPRICORN', symbol: 'CP', deg: '270°' },
    { name: 'AQUARIUS', symbol: 'AQ', deg: '300°' },
    { name: 'PISCES', symbol: 'PI', deg: '330°' },
  ];

  const sectorW = width / 12;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 12; i++) {
    const x = i * sectorW + sectorW / 2;

    // Sector divider line
    ctx.strokeStyle = 'rgba(232, 195, 114, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(i * sectorW, 14);
    ctx.lineTo(i * sectorW, height - 14);
    ctx.stroke();

    // Degree subdivisions (every 5 degrees)
    for (let d = 1; d < 6; d++) {
      const subX = i * sectorW + (sectorW / 6) * d;
      ctx.beginPath();
      ctx.moveTo(subX, height - 28);
      ctx.lineTo(subX, height - 16);
      ctx.stroke();
    }

    // Degree label at top
    ctx.fillStyle = '#E8C372';
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillText(signs[i].deg, x, 36);

    // Astronomical Constellation Center Medallion (Golden engraved seal)
    ctx.save();
    ctx.translate(x, height / 2);
    ctx.fillStyle = '#FFEEC2';
    ctx.font = 'bold 44px "Cormorant Garamond", serif';
    ctx.fillText(signs[i].symbol, 0, 0);

    // Decorative circle around symbol
    ctx.strokeStyle = 'rgba(232, 195, 114, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Latin constellation name at bottom
    ctx.fillStyle = '#FFE8A8';
    ctx.font = 'bold 24px "Cormorant Garamond", serif';
    ctx.fillText(signs[i].name, x, height - 44);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates dark polished walnut wood texture for the pedestal plinth
 */
export function createWalnutWoodTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base deep walnut tone
  ctx.fillStyle = '#22140C';
  ctx.fillRect(0, 0, size, size);

  // Wood grain layers
  for (let i = 0; i < size; i += 3) {
    const grain = Math.sin(i * 0.08) * 15 + Math.random() * 8;
    ctx.fillStyle = `rgba(55, 34, 20, ${0.3 + grain * 0.02})`;
    ctx.fillRect(0, i, size, 2);
  }

  // Dark edge vignette
  const vig = ctx.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.65);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
