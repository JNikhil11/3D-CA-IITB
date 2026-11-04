/**
 * Procedural Canvas Textures for The Aether Temple Engine
 * Generates custom PBR maps for:
 * 1. Radiant Slatted Solar Core (Incandescent Sun with horizontal louvers)
 * 2. Dark Machined Gunmetal & Anodized Steel with Vernier Scales
 * 3. Stepped Temple Dais with Hexagonal Grating & Gold Inlays
 * 4. Ribbed Lantern Planet Texture
 * 5. Soft Volumetric Cloud / Ground Mist Map
 */

import * as THREE from 'three';

/**
 * Creates the glowing, slatted artificial sun / stellar core texture
 */
export function createGlowingSunTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Intense incandescent warm core gradient
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#FFE890');
  grad.addColorStop(0.25, '#FFA41C');
  grad.addColorStop(0.5, '#FFD366');
  grad.addColorStop(0.75, '#FF9408');
  grad.addColorStop(1, '#FFE890');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Horizontal louvers / structural shadow slats (as seen in target image)
  const numSlats = 28;
  const slatHeight = size / numSlats;
  for (let i = 0; i < numSlats; i++) {
    if (i % 2 === 0) {
      // Dark cooling slat band
      const y = i * slatHeight;
      const slatGrad = ctx.createLinearGradient(0, y, 0, y + slatHeight);
      slatGrad.addColorStop(0, 'rgba(40, 20, 5, 0.95)');
      slatGrad.addColorStop(0.5, 'rgba(15, 8, 2, 0.98)');
      slatGrad.addColorStop(1, 'rgba(50, 25, 5, 0.95)');
      ctx.fillStyle = slatGrad;
      ctx.fillRect(0, y, size, slatHeight);

      // Fine golden highlight pinstripe
      ctx.fillStyle = '#FFE082';
      ctx.fillRect(0, y, size, 2);
    }
  }

  // Micro vertical heat vents
  ctx.fillStyle = 'rgba(255, 230, 150, 0.6)';
  for (let x = 0; x < size; x += 16) {
    ctx.fillRect(x, 0, 2, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates dark machined gunmetal texture with mechanical markings
 */
export function createGunmetalTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark charcoal/gunmetal base
  ctx.fillStyle = '#141822';
  ctx.fillRect(0, 0, size, size);

  // Subtle brushed metallic noise
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * size;
    ctx.fillStyle = `rgba(45, 55, 75, ${Math.random() * 0.15})`;
    ctx.fillRect(0, y, size, Math.random() * 2 + 1);
  }

  // Mechanical vernier scale lines & calibration ticks
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 2;
  for (let x = 32; x < size; x += 32) {
    const isMajor = x % 128 === 0;
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.strokeStyle = isMajor ? 'rgba(212, 168, 83, 0.8)' : 'rgba(180, 195, 220, 0.35)';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, isMajor ? 28 : 14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, size);
    ctx.lineTo(x, isMajor ? size - 28 : size - 14);
    ctx.stroke();
  }

  // Industrial rivet dots
  ctx.fillStyle = '#D4A853';
  for (let x = 64; x < size; x += 64) {
    ctx.beginPath();
    ctx.arc(x, 42, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, size - 42, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates platform floor texture with dark obsidian metal plating and illuminated seams
 */
export function createPlatformFloorTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian charcoal base
  ctx.fillStyle = '#06080E';
  ctx.fillRect(0, 0, size, size);

  // Subtle metallic texture noise
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = `rgba(20, 28, 42, ${Math.random() * 0.15})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Heavy plate panel seams (dark recessed channels)
  ctx.strokeStyle = '#020306';
  ctx.lineWidth = 8;
  const step = 128;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Fine gold circuit inlays & junction dots
  ctx.strokeStyle = 'rgba(212, 168, 83, 0.75)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, size - 48, size - 48);

  ctx.fillStyle = '#E5C158';
  for (let x = step; x < size; x += step) {
    for (let y = step; y < size; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates ribbed glowing lantern planet texture
 */
export function createLanternPlanetTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm glowing base
  ctx.fillStyle = '#FFDD80';
  ctx.fillRect(0, 0, size, size);

  // Vertical dark structural ribs
  const ribs = 16;
  const w = size / ribs;
  for (let i = 0; i < ribs; i++) {
    ctx.fillStyle = '#302210';
    ctx.fillRect(i * w, 0, w * 0.35, size);

    // Fine gold bead line
    ctx.fillStyle = '#FFEAA0';
    ctx.fillRect(i * w + w * 0.35, 0, 2, size);
  }

  // Horizontal equator clamp band
  ctx.fillStyle = '#1E160C';
  ctx.fillRect(0, size * 0.45, size, size * 0.1);

  ctx.fillStyle = '#D4A853';
  ctx.fillRect(0, size * 0.48, size, 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates soft volumetric smoke alpha puff for the floor fog
 */
export function createSmokeTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  grad.addColorStop(0, 'rgba(220, 235, 255, 0.85)');
  grad.addColorStop(0.3, 'rgba(180, 205, 240, 0.55)');
  grad.addColorStop(0.6, 'rgba(130, 160, 210, 0.25)');
  grad.addColorStop(0.85, 'rgba(80, 110, 160, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
