import * as THREE from 'three';

/**
 * Procedural Texture Factory for The Aether Engine
 * Generates crisp, high-resolution canvas textures without relying on external network assets.
 */

export interface AetherTextures {
  latinMeridianTexture: THREE.CanvasTexture;
  romanClockDialTexture: THREE.CanvasTexture;
  zodiacEclipticTexture: THREE.CanvasTexture;
  solarCellTexture: THREE.CanvasTexture;
  hexCircuitTexture: THREE.CanvasTexture;
}

/**
 * Creates the engraved Latin meridian band texture:
 * "COLURUS AEQUINOXIALIS • ANNO DOMINI MMXXVI • TECHFEST XXX"
 * with graduation degree ticks.
 */
export function createLatinBandTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich aged brass background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 256);
    bgGradient.addColorStop(0, '#C59E41');
    bgGradient.addColorStop(0.3, '#E0BA59');
    bgGradient.addColorStop(0.7, '#B88F35');
    bgGradient.addColorStop(1, '#8A6820');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 2048, 256);

    // Border tramlines (antique double ruled lines)
    ctx.strokeStyle = '#5E4311';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 8, 2040, 240);
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 16, 2028, 224);

    // Degree calibrations along top and bottom edges (360 degrees mapped across width)
    const totalTicks = 360;
    for (let i = 0; i <= totalTicks; i++) {
      const x = (i / totalTicks) * 2048;
      const isTen = i % 10 === 0;
      const isFive = i % 5 === 0;

      ctx.strokeStyle = isTen ? '#362406' : isFive ? '#503810' : '#775820';
      ctx.lineWidth = isTen ? 3 : isFive ? 2 : 1;

      // Top ticks
      const topHeight = isTen ? 32 : isFive ? 20 : 12;
      ctx.beginPath();
      ctx.moveTo(x, 16);
      ctx.lineTo(x, 16 + topHeight);
      ctx.stroke();

      // Bottom ticks
      const bottomHeight = isTen ? 32 : isFive ? 20 : 12;
      ctx.beginPath();
      ctx.moveTo(x, 240);
      ctx.lineTo(x, 240 - bottomHeight);
      ctx.stroke();

      // Degree numbers every 30 degrees
      if (i % 30 === 0 && i < totalTicks) {
        ctx.fillStyle = '#2A1B03';
        ctx.font = 'bold 18px "Cinzel", "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`${i}°`, x, 52);
      }
    }

    // Inscribed Latin astronomical text in center band
    ctx.fillStyle = '#1E1302';
    ctx.font = 'bold 36px "Cinzel", "Times New Roman", "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '6px';

    const latinPhrase =
      '✦ COLURUS AEQUINOXIALIS ✦ ANNO DOMINI MMXXVI ✦ TECHFEST XXX • IIT BOMBAY ✦ TROPICUS CANCRI ✦';
    ctx.fillText(latinPhrase, 1024, 150);

    // Gold leaf highlight shadow for raised relief effect
    ctx.fillStyle = 'rgba(255, 235, 170, 0.45)';
    ctx.fillText(latinPhrase, 1025, 149);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates the Roman numeral clock face texture matching the side-mounted clockwork:
 * Roman numerals I - XII with intricate filigree center and minute divisions.
 */
export function createRomanNumeralDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = 512;
    const cy = 512;
    const radius = 480;

    // Dial background: aged brass / ivory parchment vignette
    const radGrad = ctx.createRadialGradient(cx, cy, 60, cx, cy, radius);
    radGrad.addColorStop(0, '#FFF5DD');
    radGrad.addColorStop(0.65, '#E8D5A7');
    radGrad.addColorStop(0.88, '#C9A962');
    radGrad.addColorStop(1, '#8A6820');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Outer rim & chapter ring borders
    ctx.strokeStyle = '#4A340E';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 36, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius - 150, 0, Math.PI * 2);
    ctx.stroke();

    // 60 minute marks around perimeter
    for (let m = 0; m < 60; m++) {
      const angle = (m / 60) * Math.PI * 2 - Math.PI / 2;
      const isFive = m % 5 === 0;
      const rOuter = radius - 36;
      const rInner = isFive ? radius - 70 : radius - 52;

      ctx.strokeStyle = isFive ? '#2E1E05' : '#6B4E1B';
      ctx.lineWidth = isFive ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.lineTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.stroke();
    }

    // Roman Numerals I through XII
    const romanNumerals = [
      'XII', 'I', 'II', 'III', 'IV', 'V',
      'VI', 'VII', 'VIII', 'IX', 'X', 'XI'
    ];

    ctx.fillStyle = '#221401';
    ctx.font = 'bold 54px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const numRadius = radius - 108;
    for (let h = 0; h < 12; h++) {
      const angle = (h / 12) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + Math.cos(angle) * numRadius;
      const ny = cy + Math.sin(angle) * numRadius;
      ctx.fillText(romanNumerals[h], nx, ny);
    }

    // Inner filigree circle & Renaissance sunburst
    ctx.strokeStyle = '#704E15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Radial gear spokes / sunburst filigree
    for (let s = 0; s < 16; s++) {
      const angle = (s / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 70, cy + Math.sin(angle) * 70);
      ctx.lineTo(cx + Math.cos(angle) * 215, cy + Math.sin(angle) * 215);
      ctx.stroke();
    }

    // Center inscription
    ctx.fillStyle = '#3A2708';
    ctx.font = 'italic bold 22px "Cinzel", "Georgia", serif';
    ctx.fillText('HOROLOGIUM', cx, cy - 40);
    ctx.fillText('TECHFEST 30', cx, cy + 40);

    // Center brass arbor pivot
    ctx.fillStyle = '#442F09';
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E8C372';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates the Zodiac Ecliptic band texture with Latin sign names and symbols:
 * Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.
 */
export function createZodiacGlyphTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich gilded brass band background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#D4AF37');
    bgGrad.addColorStop(0.5, '#F5D77F');
    bgGrad.addColorStop(1, '#9C7A1E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 256);

    // Border tramlines
    ctx.strokeStyle = '#4A3408';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 6, 2040, 244);

    const signs = [
      { name: 'ARIES', glyph: '♈' },
      { name: 'TAURUS', glyph: '♉' },
      { name: 'GEMINI', glyph: '♊' },
      { name: 'CANCER', glyph: '♋' },
      { name: 'LEO', glyph: '♌' },
      { name: 'VIRGO', glyph: '♍' },
      { name: 'LIBRA', glyph: '♎' },
      { name: 'SCORPIO', glyph: '♏' },
      { name: 'SAGITTARIUS', glyph: '♐' },
      { name: 'CAPRICORN', glyph: '♑' },
      { name: 'AQUARIUS', glyph: '♒' },
      { name: 'PISCES', glyph: '♓' },
    ];

    const segmentWidth = 2048 / 12;

    for (let i = 0; i < 12; i++) {
      const segX = i * segmentWidth;

      // Divider pillar between signs
      ctx.strokeStyle = '#382504';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(segX, 6);
      ctx.lineTo(segX, 250);
      ctx.stroke();

      // Degree subdivision ticks within each sign (30 degrees each)
      for (let d = 0; d < 30; d++) {
        const dx = segX + (d / 30) * segmentWidth;
        const isTen = d % 10 === 0;
        const tickHeight = isTen ? 20 : 10;

        ctx.strokeStyle = isTen ? '#382504' : '#6A4D12';
        ctx.lineWidth = isTen ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(dx, 6);
        ctx.lineTo(dx, 6 + tickHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dx, 250);
        ctx.lineTo(dx, 250 - tickHeight);
        ctx.stroke();
      }

      // Constellation Glyph
      const centerX = segX + segmentWidth / 2;
      ctx.fillStyle = '#8B1E12'; // Vermilion ruby accent for glyph
      ctx.font = 'bold 64px "Segoe UI Symbol", "Apple Symbols", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(signs[i].glyph, centerX, 105);

      // Sign Name in Latin
      ctx.fillStyle = '#221503';
      ctx.font = 'bold 24px "Cinzel", "Times New Roman", serif';
      ctx.fillText(signs[i].name, centerX, 185);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates solar photovoltaic panel texture for Aerospace satellite arrays.
 */
export function createSolarCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep reflective sapphire blue
    ctx.fillStyle = '#0F1E3D';
    ctx.fillRect(0, 0, 512, 512);

    // Silicon solar wafer grid
    const cols = 8;
    const rows = 16;
    const cellW = 512 / cols;
    const cellH = 512 / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * cellW + 2;
        const y = r * cellH + 2;
        const w = cellW - 4;
        const h = cellH - 4;

        // Individual cell gradient
        const cellGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        cellGrad.addColorStop(0, '#1E3B75');
        cellGrad.addColorStop(0.5, '#142852');
        cellGrad.addColorStop(1, '#0B1733');
        ctx.fillStyle = cellGrad;
        ctx.fillRect(x, y, w, h);

        // Thin silver busbars across cells
        ctx.strokeStyle = '#A8C0E8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.33, y);
        ctx.lineTo(x + w * 0.33, y + h);
        ctx.moveTo(x + w * 0.66, y);
        ctx.lineTo(x + w * 0.66, y + h);
        ctx.stroke();
      }
    }

    // Outer framing busbar
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 508, 508);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates circuit hex pattern texture for Computational neural core.
 */
export function createHexCircuitTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#080E1A';
    ctx.fillRect(0, 0, 512, 512);

    // Glowing cyan circuit traces
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;

    for (let i = 0; i < 32; i++) {
      const startX = Math.random() * 512;
      const startY = Math.random() * 512;
      const midX = startX + (Math.random() - 0.5) * 120;
      const midY = startY + (Math.random() - 0.5) * 120;
      const endX = midX + (Math.random() - 0.5) * 120;
      const endY = midY + (Math.random() - 0.5) * 120;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(midX, midY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Node dot
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Dispose all textures in an AetherTextures collection
 */
export function disposeAetherTextures(textures: Partial<AetherTextures>): void {
  Object.values(textures).forEach((tex) => {
    if (tex && typeof tex.dispose === 'function') {
      tex.dispose();
    }
  });
}
