import * as THREE from 'three';

// Cache generated textures so we don't recreate them repeatedly
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates a high quality procedural cobblestone road with subtle glowing golden rangoli accents
 */
export function createStreetTexture(): THREE.CanvasTexture {
  if (textureCache.has('street')) return textureCache.get('street')!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm sandstone earth base
  ctx.fillStyle = '#6e462c';
  ctx.fillRect(0, 0, 1024, 1024);

  // Stone Pavers Grid - warm honey / terracotta sandstone pavers matching reference image
  const cols = 8;
  const rows = 16;
  const colWidth = 1024 / cols;
  const rowHeight = 1024 / rows;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2 === 0) ? 0 : colWidth / 2;
    for (let c = -1; c <= cols; c++) {
      const x = c * colWidth + offset + 2;
      const y = r * rowHeight + 2;
      const w = colWidth - 4;
      const h = rowHeight - 4;

      const rand = Math.sin(r * 31 + c * 17);
      const rVal = Math.floor(160 + rand * 22);
      const gVal = Math.floor(112 + rand * 18);
      const bVal = Math.floor(82 + rand * 14);
      ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, 6);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fill();

      // Warm sunlight specular bevel on top & left
      ctx.strokeStyle = 'rgba(255, 235, 195, 0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Subtle textured speckles on paver
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.2, 2);
    }
  }

  // Scattered Festive Flower Petals on Street (Marigold Orange, Yellow, Rose Red)
  const petalCount = 220;
  for (let i = 0; i < petalCount; i++) {
    const px = ((i * 137.5 + 43) % 1000) + 12;
    const py = ((i * 219.7 + 79) % 1000) + 12;
    const pRadius = 3.5 + (i % 4);
    const pColorChoice = i % 3;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((i * 47) % 360);
    ctx.beginPath();
    ctx.ellipse(0, 0, pRadius * 1.6, pRadius, 0, 0, Math.PI * 2);
    if (pColorChoice === 0) {
      ctx.fillStyle = 'rgba(255, 107, 0, 0.9)'; // Vibrant Marigold Orange
    } else if (pColorChoice === 1) {
      ctx.fillStyle = 'rgba(255, 206, 0, 0.92)'; // Bright Marigold Yellow
    } else {
      ctx.fillStyle = 'rgba(224, 26, 79, 0.88)'; // Rich Rose Crimson
    }
    ctx.fill();
    ctx.restore();
  }

  // Running Lane Dividers: Bright glowing golden dashed lines
  for (let lane = 1; lane <= 2; lane++) {
    const x = (1024 / 3) * lane;
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.9)';
    ctx.lineWidth = 6;
    ctx.setLineDash([28, 28]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();

    // Golden dot rivets along lanes
    ctx.setLineDash([]);
    for (let dy = 28; dy < 1024; dy += 56) {
      ctx.fillStyle = '#fff07c';
      ctx.beginPath();
      ctx.arc(x, dy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ornate Multicolor Rangoli Mandalas on street (matching bottom right in reference)
  const drawIntricateRangoli = (cx: number, cy: number, radius: number) => {
    ctx.save();
    ctx.translate(cx, cy);

    // Outer Petals Layer (Vibrant Magenta / Pink)
    const petalsOuter = 12;
    ctx.fillStyle = 'rgba(224, 26, 104, 0.85)';
    for (let p = 0; p < petalsOuter; p++) {
      const angle = (p * Math.PI * 2) / petalsOuter;
      const px = Math.cos(angle) * (radius * 0.72);
      const py = Math.sin(angle) * (radius * 0.72);
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid Petals Layer (Peacock Teal & Saffron)
    const petalsMid = 8;
    for (let p = 0; p < petalsMid; p++) {
      const angle = (p * Math.PI * 2) / petalsMid + 0.35;
      const px = Math.cos(angle) * (radius * 0.5);
      const py = Math.sin(angle) * (radius * 0.5);
      ctx.fillStyle = (p % 2 === 0) ? 'rgba(0, 180, 160, 0.85)' : 'rgba(255, 120, 0, 0.85)';
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner Radiant Golden Yellow Core
    ctx.fillStyle = 'rgba(255, 215, 0, 0.95)';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Center Red Kumkum Bindu
    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // White Rice-powder outline rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  };

  // Draw Rangolis in roadside lanes and borders
  drawIntricateRangoli(170, 300, 95);
  drawIntricateRangoli(854, 720, 95);
  drawIntricateRangoli(512, 120, 80);
  drawIntricateRangoli(512, 880, 80);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('street', texture);
  return texture;
}

/**
 * Left Roadside Hanging Festival Banner ("गणपती बाप्पा मोरया" with Golden Lotus)
 */
export function createLeftBannerTexture(): THREE.CanvasTexture {
  if (textureCache.has('banner_left')) return textureCache.get('banner_left')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rich Crimson Velvet Body
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#590d22');
  grad.addColorStop(0.5, '#800f2f');
  grad.addColorStop(1, '#3b0918');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Ornate Gold Double Border
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 236, 492);
  ctx.strokeStyle = 'rgba(255, 230, 120, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 220, 476);

  // Text: गणपती बाप्पा मोरया in Gold
  ctx.fillStyle = '#fff3b0';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Noto Sans Devanagari", "Tiro Devanagari Hindi", serif, sans-serif';
  ctx.fillText('गणपती', 128, 90);
  ctx.fillText('बाप्पा', 128, 135);
  ctx.font = 'bold 32px "Noto Sans Devanagari", "Tiro Devanagari Hindi", serif, sans-serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('मोरया', 128, 185);

  // Golden Lotus Motif in Center
  const drawLotus = (cx: number, cy: number, scale: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffd700';
    // Center petal
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    // Side petals
    [-0.5, 0.5].forEach((dir) => {
      ctx.save();
      ctx.rotate(dir);
      ctx.beginPath();
      ctx.ellipse(0, 6, 12, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    [-0.9, 0.9].forEach((dir) => {
      ctx.save();
      ctx.rotate(dir);
      ctx.beginPath();
      ctx.ellipse(0, 14, 10, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  };

  drawLotus(128, 280, 1.2);

  // Golden Om / Swastik at bottom
  ctx.fillStyle = '#fff3b0';
  ctx.font = 'bold 36px serif';
  ctx.fillText('ॐ', 128, 420);

  // Gold Fringe at bottom
  ctx.fillStyle = '#ffd700';
  for (let x = 16; x < 240; x += 14) {
    ctx.fillRect(x, 490, 8, 16);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('banner_left', texture);
  return texture;
}

/**
 * Right Roadside Hanging Festival Banner ("॥ गणेशोत्सव ॥" with Golden Lotus)
 */
export function createRightBannerTexture(): THREE.CanvasTexture {
  if (textureCache.has('banner_right')) return textureCache.get('banner_right')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rich Crimson Velvet Body
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#590d22');
  grad.addColorStop(0.5, '#800f2f');
  grad.addColorStop(1, '#3b0918');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Gold Border
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 236, 492);
  ctx.strokeStyle = 'rgba(255, 230, 120, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 220, 476);

  // Text: ॥ गणेशोत्सव ॥ in Gold
  ctx.fillStyle = '#fff3b0';
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px "Noto Sans Devanagari", "Tiro Devanagari Hindi", serif, sans-serif';
  ctx.fillText('॥', 128, 80);
  ctx.font = 'bold 30px "Noto Sans Devanagari", "Tiro Devanagari Hindi", serif, sans-serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('गणेशोत्सव', 128, 135);
  ctx.fillStyle = '#fff3b0';
  ctx.font = 'bold 32px "Noto Sans Devanagari", "Tiro Devanagari Hindi", serif, sans-serif';
  ctx.fillText('॥', 128, 185);

  // Golden Lotus Motif in Center
  const drawLotus = (cx: number, cy: number, scale: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    [-0.5, 0.5].forEach((dir) => {
      ctx.save();
      ctx.rotate(dir);
      ctx.beginPath();
      ctx.ellipse(0, 6, 12, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    [-0.9, 0.9].forEach((dir) => {
      ctx.save();
      ctx.rotate(dir);
      ctx.beginPath();
      ctx.ellipse(0, 14, 10, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  };

  drawLotus(128, 280, 1.2);

  // Bottom text
  ctx.fillStyle = '#fff3b0';
  ctx.font = 'bold 24px serif';
  ctx.fillText('श्री गणेशाय नमः', 128, 420);

  // Gold Fringe at bottom
  ctx.fillStyle = '#ffd700';
  for (let x = 16; x < 240; x += 14) {
    ctx.fillRect(x, 490, 8, 16);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('banner_right', texture);
  return texture;
}

/**
 * Festival Cart Back Panel Texture (Vibrant turquoise painted wood with golden floral mandala)
 */
export function createCartBackTexture(): THREE.CanvasTexture {
  if (textureCache.has('cart_back')) return textureCache.get('cart_back')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rich Turquoise / Teal background (matching reference cart back)
  ctx.fillStyle = '#0a7e8c';
  ctx.fillRect(0, 0, 512, 512);

  // Dark Wood Border Frame
  ctx.strokeStyle = '#5c2d16';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, 496, 496);

  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 472, 472);

  // Central Ornate Lotus Rosette Mandala
  const cx = 256;
  const cy = 256;

  // Outer orange ring
  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.fill();

  // Yellow scallops
  const scallops = 16;
  ctx.fillStyle = '#ffbe0b';
  for (let i = 0; i < scallops; i++) {
    const angle = (i * Math.PI * 2) / scallops;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 120, cy + Math.sin(angle) * 120, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner Deep Crimson circle
  ctx.fillStyle = '#d90429';
  ctx.beginPath();
  ctx.arc(cx, cy, 95, 0, Math.PI * 2);
  ctx.fill();

  // Golden 8-petal Lotus
  const petals = 8;
  ctx.fillStyle = '#fff3b0';
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 45, 18, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Golden Core
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('cart_back', texture);
  return texture;
}

/**
 * Barricade Hazard Stripe Texture (Yellow and Dark Wood with Marigold Trim)
 */
export function createHazardStripeTexture(): THREE.CanvasTexture {
  if (textureCache.has('hazard_stripe')) return textureCache.get('hazard_stripe')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffd166';
  ctx.fillRect(0, 0, 256, 64);

  ctx.fillStyle = '#2b1e19';
  const stripeW = 28;
  for (let x = -64; x < 256 + 64; x += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeW, 0);
    ctx.lineTo(x + stripeW - 32, 64);
    ctx.lineTo(x - 32, 64);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  textureCache.set('hazard_stripe', texture);
  return texture;
}

/**
 * Royal Velvet & Gold Pandal Sanctum Backdrop Texture
 */
export function createPandalBackdropTexture(): THREE.CanvasTexture {
  if (textureCache.has('pandal_backdrop')) return textureCache.get('pandal_backdrop')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep royal crimson background
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#590d22');
  grad.addColorStop(0.5, '#800f2f');
  grad.addColorStop(1, '#3b0918');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Ornate Gold Filigree Border
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 480);
  ctx.strokeStyle = 'rgba(255, 230, 120, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 456, 456);

  // Central Sacred Golden Sunburst / Halo Pattern
  const cx = 256;
  const cy = 256;
  const rays = 24;
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.45)';
  ctx.lineWidth = 3;
  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 40, cy + Math.sin(angle) * 40);
    ctx.lineTo(cx + Math.cos(angle) * 190, cy + Math.sin(angle) * 190);
    ctx.stroke();
  }

  // Central Lotus Mandala
  ctx.fillStyle = 'rgba(255, 180, 0, 0.5)';
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('pandal_backdrop', texture);
  return texture;
}

/**
 * Traditional Dhol Drum Texture (Wood grain + Leather heads + Red cords)
 */
export function createDholTexture(): THREE.CanvasTexture {
  if (textureCache.has('dhol')) return textureCache.get('dhol')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Polished mahogany wood body
  ctx.fillStyle = '#5c1d0c';
  ctx.fillRect(0, 0, 256, 256);

  // Gold decorative hoops on ends
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(0, 0, 256, 28);
  ctx.fillRect(0, 228, 256, 28);

  // Red and gold tension cords zig-zagging
  ctx.strokeStyle = '#d62246';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x <= 256; x += 32) {
    const top = (x / 32) % 2 === 0;
    ctx.lineTo(x, top ? 30 : 226);
  }
  ctx.stroke();

  // Brass tuning rings
  for (let x = 16; x < 256; x += 32) {
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.arc(x, 128, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('dhol', texture);
  return texture;
}

/**
 * Festival Crowd Silhouette Billboard Texture
 * (Cheering devotees waving saffron flags & holding festival lamps)
 */
export function createCrowdTexture(): THREE.CanvasTexture {
  if (textureCache.has('crowd')) return textureCache.get('crowd')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 128);

  // Generate stylized silhouette crowd figures
  const personCount = 28;
  for (let i = 0; i < personCount; i++) {
    const x = (512 / personCount) * i + Math.sin(i * 13) * 6;
    const height = 65 + Math.sin(i * 17) * 18;
    const y = 128 - height;

    // Body
    ctx.fillStyle = (i % 2 === 0) ? '#28143a' : '#1d0c2e';
    ctx.beginPath();
    ctx.ellipse(x, y + height * 0.6, 12, height * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head with festive turban or hair
    const headRadius = 8 + (i % 3);
    ctx.fillStyle = (i % 3 === 0) ? '#ff6b00' : ((i % 3 === 1) ? '#ffd700' : '#28143a');
    ctx.beginPath();
    ctx.arc(x, y + 10, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Raised arms waving
    ctx.strokeStyle = '#28143a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 25);
    ctx.lineTo(x - 12 - (i % 4) * 2, y - 5 + (i % 5) * 4);
    ctx.moveTo(x + 5, y + 25);
    ctx.lineTo(x + 12 + (i % 4) * 2, y - 5 + (i % 5) * 4);
    ctx.stroke();

    // Saffron festival flag on some crowd members
    if (i % 4 === 1) {
      const flagX = x + 12;
      const flagY = y - 10;
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(flagX, y + 20);
      ctx.lineTo(flagX, flagY - 20);
      ctx.stroke();

      // Triangular saffron flag (Bhagva Dhwaj)
      ctx.fillStyle = '#ff6b00';
      ctx.beginPath();
      ctx.moveTo(flagX, flagY - 20);
      ctx.lineTo(flagX + 22, flagY - 10);
      ctx.lineTo(flagX, flagY);
      ctx.closePath();
      ctx.fill();
    }

    // Glowing diya / mobile flash light held up
    if (i % 3 === 2) {
      ctx.fillStyle = '#ffe066';
      ctx.beginPath();
      ctx.arc(x - 12, y - 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('crowd', texture);
  return texture;
}

/**
 * Blessing Token Texture (Divine Golden Medallion)
 */
export function createBlessingTokenTexture(): THREE.CanvasTexture {
  if (textureCache.has('blessing_token')) return textureCache.get('blessing_token')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, '#fff3b0');
  grad.addColorStop(0.4, '#ffd700');
  grad.addColorStop(0.8, '#ff9e00');
  grad.addColorStop(1, '#b8860b');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  // Outer Beaded Ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Lotus Flower Relief in center
  const petals = 8;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.translate(128, 128);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 45, 14, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Inner Core Sunburst
  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.arc(128, 128, 26, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('blessing_token', texture);
  return texture;
}


/**
 * Sandstone Temple Wall texture with carved relief look
 */
export function createTempleSandstoneTexture(): THREE.CanvasTexture {
  if (textureCache.has('temple_stone')) return textureCache.get('temple_stone')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b88152';
  ctx.fillRect(0, 0, 512, 512);

  // Carved stone blocks
  ctx.strokeStyle = '#6e472a';
  ctx.lineWidth = 4;
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  for (let row = 0; row < 8; row++) {
    const y = row * 64;
    const offset = (row % 2 === 0) ? 0 : 64;
    for (let x = offset; x <= 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
      ctx.stroke();

      // Small ornamental floral carving in center of block
      ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(x + 64, y + 32, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('temple_stone', texture);
  return texture;
}

/**
 * Colorful striped festival market awning texture
 */
export function createAwningTexture(color1 = '#e63946', color2 = '#ffb703'): THREE.CanvasTexture {
  const key = `awning_${color1}_${color2}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const stripeWidth = 32;
  for (let x = 0; x < 256; x += stripeWidth * 2) {
    ctx.fillStyle = color1;
    ctx.fillRect(x, 0, stripeWidth, 256);
    ctx.fillStyle = color2;
    ctx.fillRect(x + stripeWidth, 0, stripeWidth, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Procedural Marigold Garland Texture
 */
export function createMarigoldTexture(): THREE.CanvasTexture {
  if (textureCache.has('marigold')) return textureCache.get('marigold')!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fill();

  // Dense petal layers
  for (let r = 48; r > 10; r -= 10) {
    ctx.fillStyle = (r % 20 === 0) ? '#ffb800' : '#ff9500';
    for (let a = 0; a < Math.PI * 2; a += 0.4) {
      ctx.beginPath();
      ctx.arc(64 + Math.cos(a) * r, 64 + Math.sin(a) * r, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Golden core
  ctx.fillStyle = '#ffe066';
  ctx.beginPath();
  ctx.arc(64, 64, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('marigold', texture);
  return texture;
}

/**
 * Glow Particle / Sparkle Texture for Diya flames and modak pickups
 */
export function createGlowParticleTexture(): THREE.CanvasTexture {
  if (textureCache.has('glow_particle')) return textureCache.get('glow_particle')!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.85)');
  gradient.addColorStop(0.5, 'rgba(255, 110, 0, 0.4)');
  gradient.addColorStop(1.0, 'rgba(255, 100, 0, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('glow_particle', texture);
  return texture;
}

/**
 * Majestic Indian Festival Sunset Sky Backdrop with glowing clouds & temple shikharas
 */
export function createSunsetSkyTexture(): THREE.CanvasTexture {
  if (textureCache.has('sunset_sky')) return textureCache.get('sunset_sky')!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Sky Gradient: Twilight Purple -> Coral Pink -> Radiant Golden Sunset
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0.0, '#3a184f'); // Twilight royal purple at top
  skyGrad.addColorStop(0.25, '#6b2d6a'); // Plum violet
  skyGrad.addColorStop(0.55, '#d96557'); // Coral pink
  skyGrad.addColorStop(0.78, '#f4a261'); // Warm peach
  skyGrad.addColorStop(0.92, '#ffb703'); // Golden orange
  skyGrad.addColorStop(1.0, '#fff3b0'); // Radiant golden sunlight at horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Glowing Sun disc on horizon center
  const sunGrad = ctx.createRadialGradient(512, 420, 20, 512, 420, 260);
  sunGrad.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
  sunGrad.addColorStop(0.3, 'rgba(255, 220, 120, 0.7)');
  sunGrad.addColorStop(0.6, 'rgba(255, 160, 60, 0.3)');
  sunGrad.addColorStop(1, 'rgba(255, 140, 50, 0.0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 160, 1024, 352);

  // 3. Fluffy Sunset Clouds with golden rim lighting
  const drawCloud = (cx: number, cy: number, w: number, h: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(180, 80, 120, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - w * 0.4, cy + h * 0.1, w * 0.6, h * 0.8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + w * 0.4, cy + h * 0.1, w * 0.6, h * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden top rim
    ctx.fillStyle = 'rgba(255, 230, 160, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, cy - h * 0.2, w * 0.85, h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCloud(220, 180, 160, 45);
  drawCloud(780, 150, 190, 50);
  drawCloud(490, 220, 240, 55);
  drawCloud(100, 260, 140, 40);
  drawCloud(920, 270, 150, 42);

  // 4. Distant Grand Temple Shikharas (Carved Temple Spires) into sunset mist
  ctx.fillStyle = 'rgba(90, 32, 64, 0.65)';
  const drawTempleSpire = (baseX: number, baseY: number, width: number, height: number) => {
    ctx.beginPath();
    ctx.moveTo(baseX - width / 2, baseY);
    // Tiered stepped spire
    const tiers = 5;
    for (let t = 0; t <= tiers; t++) {
      const curY = baseY - (height / tiers) * t;
      const curW = (width / 2) * (1 - (t / tiers) * 0.85);
      ctx.lineTo(baseX - curW, curY);
    }
    // Crown Kalash & Flag
    ctx.lineTo(baseX, baseY - height - 18);
    for (let t = tiers; t >= 0; t--) {
      const curY = baseY - (height / tiers) * t;
      const curW = (width / 2) * (1 - (t / tiers) * 0.85);
      ctx.lineTo(baseX + curW, curY);
    }
    ctx.closePath();
    ctx.fill();

    // Waving saffron dhwaja flag
    ctx.fillStyle = 'rgba(255, 107, 0, 0.8)';
    ctx.beginPath();
    ctx.moveTo(baseX, baseY - height - 16);
    ctx.lineTo(baseX + 16, baseY - height - 10);
    ctx.lineTo(baseX, baseY - height - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(90, 32, 64, 0.65)';
  };

  // Multiple distant temples across horizon
  drawTempleSpire(512, 470, 70, 150); // Grand Center Temple
  drawTempleSpire(430, 470, 45, 110);
  drawTempleSpire(594, 470, 45, 110);
  drawTempleSpire(310, 470, 60, 130);
  drawTempleSpire(714, 470, 60, 130);
  drawTempleSpire(180, 470, 50, 95);
  drawTempleSpire(844, 470, 50, 95);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('sunset_sky', texture);
  return texture;
}

/**
 * Creates a high-detail stylized cartoon face texture for the young Indian festival runner
 * Features: expressive Pixar-style dark eyes with sparkle, warm skin tone, festive Tilak, and cheerful smile
 */
export function createCharacterFaceTexture(): THREE.CanvasTexture {
  if (textureCache.has('character_face')) return textureCache.get('character_face')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Warm Glowing Indian Skin Tone
  const skinGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skinGrad.addColorStop(0, '#e5ab80');
  skinGrad.addColorStop(0.5, '#dca274');
  skinGrad.addColorStop(1, '#cb8f60');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Rosy Cheek Highlights (Soft festival glow)
  const drawCheekBlush = (cx: number, cy: number) => {
    const blushGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 55);
    blushGrad.addColorStop(0, 'rgba(235, 100, 80, 0.35)');
    blushGrad.addColorStop(0.6, 'rgba(235, 100, 80, 0.15)');
    blushGrad.addColorStop(1, 'rgba(235, 100, 80, 0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 55, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCheekBlush(150, 310);
  drawCheekBlush(362, 310);

  // 3. Sacred Festive Tilak & Chandan on Forehead
  // Red Kumkum vertical mark
  ctx.fillStyle = '#b71c1c';
  ctx.beginPath();
  ctx.ellipse(256, 150, 10, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Golden Chandan inner accent
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(256, 150, 5, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sacred gold dot below
  ctx.beginPath();
  ctx.arc(256, 192, 5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Stylized Expressive Cartoon Eyes
  const drawEye = (cx: number, cy: number, flip: boolean) => {
    ctx.save();
    
    // Eye socket shadow
    ctx.fillStyle = 'rgba(140, 80, 45, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, 48, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera (Eye white with soft top shadow)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 42, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera soft inner shadow
    ctx.fillStyle = 'rgba(180, 180, 200, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 14, 38, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris (Deep warm amber-brown with vibrant rim)
    const irisGrad = ctx.createRadialGradient(cx, cy - 2, 4, cx, cy, 26);
    irisGrad.addColorStop(0, '#5a2e17');
    irisGrad.addColorStop(0.6, '#3a1a0c');
    irisGrad.addColorStop(0.95, '#1e0c05');
    irisGrad.addColorStop(1, '#0e0502');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();

    // Pupil (Deep black)
    ctx.fillStyle = '#080301';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    // Specular Catchlights (Gives lively anime / Pixar sparkle!)
    // Primary large highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(cx - (flip ? -7 : 7), cy - 7, 7, 0, Math.PI * 2);
    ctx.fill();

    // Secondary smaller highlight
    ctx.beginPath();
    ctx.arc(cx + (flip ? -6 : 6), cy + 6, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyeliner / Upper lash curve
    ctx.strokeStyle = '#23120b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, 44, 32, 0, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Expressive Eyebrow (Arching gracefully with dark hair tone)
    ctx.strokeStyle = '#1e110a';
    ctx.lineWidth = 7;
    ctx.beginPath();
    const browY = cy - 44;
    if (!flip) {
      ctx.moveTo(cx - 42, browY + 6);
      ctx.quadraticCurveTo(cx - 10, browY - 14, cx + 38, browY - 2);
    } else {
      ctx.moveTo(cx - 38, browY - 2);
      ctx.quadraticCurveTo(cx + 10, browY - 14, cx + 42, browY + 6);
    }
    ctx.stroke();

    ctx.restore();
  };

  drawEye(160, 245, false); // Left Eye
  drawEye(352, 245, true);  // Right Eye

  // 5. Cute Stylized Nose
  ctx.fillStyle = '#b8754c';
  ctx.beginPath();
  ctx.ellipse(256, 310, 9, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose tip soft highlight
  ctx.fillStyle = 'rgba(255, 240, 220, 0.4)';
  ctx.beginPath();
  ctx.arc(256, 305, 4, 0, Math.PI * 2);
  ctx.fill();

  // 6. Confident, Friendly Festive Smile
  ctx.strokeStyle = '#853222';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(256, 350, 42, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();

  // Cheerful smile dimple / lip corners
  ctx.fillStyle = '#853222';
  ctx.beginPath();
  ctx.arc(224, 376, 3, 0, Math.PI * 2);
  ctx.arc(288, 376, 3, 0, Math.PI * 2);
  ctx.fill();

  // Subtle lower lip tint
  ctx.fillStyle = 'rgba(215, 95, 80, 0.45)';
  ctx.beginPath();
  ctx.ellipse(256, 395, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('character_face', texture);
  return texture;
}

/**
 * Creates a rich festive Saffron Orange fabric texture with golden jacquard motifs
 */
export function createKurtaFabricTexture(): THREE.CanvasTexture {
  if (textureCache.has('kurta_fabric')) return textureCache.get('kurta_fabric')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Saffron orange base with subtle gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ff7800');
  grad.addColorStop(0.5, '#f56300');
  grad.addColorStop(1, '#e05000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle woven gold brocade diamond pattern
  ctx.fillStyle = 'rgba(255, 215, 0, 0.22)';
  const step = 32;
  for (let y = 0; y < 512; y += step) {
    for (let x = 0; x < 512; x += step) {
      const offsetX = (y % (step * 2) === 0) ? 0 : step / 2;
      ctx.beginPath();
      ctx.moveTo(x + offsetX + step / 4, y);
      ctx.lineTo(x + offsetX + step / 2, y + step / 4);
      ctx.lineTo(x + offsetX + step / 4, y + step / 2);
      ctx.lineTo(x + offsetX, y + step / 4);
      ctx.closePath();
      ctx.fill();

      // Tiny center gold dot
      ctx.fillRect(x + offsetX + step / 4 - 1, y + step / 4 - 1, 2, 2);
    }
  }

  // Golden Zari embroidery borders at bottom
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(0, 480, 512, 32);
  ctx.fillStyle = '#b71c1c'; // Crimson inner accent stripe
  ctx.fillRect(0, 492, 512, 8);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('kurta_fabric', texture);
  return texture;
}

/**
 * High-Definition Silk Dhoti Fabric for Lord Ganesha (Vibrant Gold Silk with Crimson & Gold Zari borders)
 */
export function createGaneshaDhotiTexture(): THREE.CanvasTexture {
  if (textureCache.has('ganesha_dhoti')) return textureCache.get('ganesha_dhoti')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm golden silk gradient base
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ffbe0b');
  grad.addColorStop(0.5, '#fb5607');
  grad.addColorStop(1, '#ff006e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Woven gold brocade diagonal filigree
  ctx.strokeStyle = 'rgba(255, 235, 120, 0.35)';
  ctx.lineWidth = 1.5;
  const step = 24;
  for (let d = -512; d < 1024; d += step) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(d + 512, 0);
    ctx.lineTo(d, 512);
    ctx.stroke();
  }

  // Golden Floral Butta / Paisley Medallions
  for (let y = 32; y < 512; y += 64) {
    for (let x = 32; x < 512; x += 64) {
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Tiny petals around butta
      ctx.fillStyle = 'rgba(255, 240, 180, 0.8)';
      for (let p = 0; p < 6; p++) {
        const angle = (p * Math.PI * 2) / 6;
        ctx.fillRect(x + Math.cos(angle) * 7 - 1, y + Math.sin(angle) * 7 - 1, 2, 2);
      }
    }
  }

  // Heavy Royal Gold & Ruby Border at Bottom & Top Edges
  ctx.fillStyle = '#b7094c';
  ctx.fillRect(0, 460, 512, 52);
  ctx.fillRect(0, 0, 512, 32);

  ctx.fillStyle = '#ffd700';
  ctx.fillRect(0, 470, 512, 10);
  ctx.fillRect(0, 494, 512, 12);
  ctx.fillRect(0, 8, 512, 14);

  // Scalloped gold embroidery arches
  ctx.fillStyle = '#ffd700';
  for (let x = 0; x < 512; x += 16) {
    ctx.beginPath();
    ctx.arc(x + 8, 460, 6, Math.PI, 0, false);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('ganesha_dhoti', texture);
  return texture;
}

/**
 * Royal Gold & Gemstone Crown (Kiritamukuta) Texture
 */
export function createGaneshaCrownTexture(): THREE.CanvasTexture {
  if (textureCache.has('ganesha_crown')) return textureCache.get('ganesha_crown')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Polished Royal Gold Gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#ffd700');
  grad.addColorStop(0.3, '#ffaa00');
  grad.addColorStop(0.7, '#ffc300');
  grad.addColorStop(1, '#b8860b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Ornate filigree arches & lattice
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  for (let y = 20; y < 512; y += 40) {
    ctx.beginPath();
    for (let x = 0; x < 512; x += 20) {
      ctx.arc(x + 10, y, 10, Math.PI, 0);
    }
    ctx.stroke();
  }

  // Embedded Faceted Ruby & Emerald Gemstones
  for (let y = 40; y < 512; y += 80) {
    for (let x = 20; x < 512; x += 40) {
      const isRuby = ((x + y) / 40) % 2 === 0;
      ctx.fillStyle = isRuby ? '#d90429' : '#06d6a0';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();

      // Gemstone specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Gold setting ring
      ctx.strokeStyle = '#fff3b0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('ganesha_crown', texture);
  return texture;
}

/**
 * Carved Makrana White Marble Pedestal Texture with Gold Inlay Vines
 */
export function createGaneshaPedestalTexture(): THREE.CanvasTexture {
  if (textureCache.has('ganesha_pedestal')) return textureCache.get('ganesha_pedestal')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth pristine white/cream Makrana marble
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#faf8f5');
  grad.addColorStop(0.5, '#f3ede2');
  grad.addColorStop(1, '#ebe0d0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle marble veins
  ctx.strokeStyle = 'rgba(180, 160, 140, 0.15)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.bezierCurveTo(160, 180, 320, 80, 512, 200);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.bezierCurveTo(220, 260, 280, 320, 480, 512);
  ctx.stroke();

  // Intricate Gold Inlay Floral Arabesque
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  for (let x = 32; x < 512; x += 64) {
    ctx.strokeRect(x, 16, 48, 480);
    // Diamond center
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(x + 24, 200);
    ctx.lineTo(x + 40, 240);
    ctx.lineTo(x + 24, 280);
    ctx.lineTo(x + 8, 240);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('ganesha_pedestal', texture);
  return texture;
}

/**
 * Radiant Golden Prabhavali Halo Texture with Flame Motifs & Sacred Geometry
 */
export function createGaneshaPrabhavaliTexture(): THREE.CanvasTexture {
  if (textureCache.has('ganesha_prabhavali')) return textureCache.get('ganesha_prabhavali')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Transparent / Ethereal Sunburst Ring
  ctx.clearRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  // Outer Golden Flame Halo
  const flameCount = 32;
  for (let i = 0; i < flameCount; i++) {
    const angle = (i * Math.PI * 2) / flameCount;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Golden flame spike
    ctx.fillStyle = i % 2 === 0 ? '#ffd700' : '#ff9e00';
    ctx.beginPath();
    ctx.moveTo(0, -210);
    ctx.quadraticCurveTo(12, -235, 0, -252);
    ctx.quadraticCurveTo(-12, -235, 0, -210);
    ctx.fill();

    ctx.restore();
  }

  // Radiant Golden Solar Rays
  ctx.strokeStyle = 'rgba(255, 235, 120, 0.75)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 48; i++) {
    const angle = (i * Math.PI * 2) / 48;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 110, cy + Math.sin(angle) * 110);
    ctx.lineTo(cx + Math.cos(angle) * 205, cy + Math.sin(angle) * 205);
    ctx.stroke();
  }

  // Concentric Beaded Gold Rings
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 210, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#fff3b0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 195, 0, Math.PI * 2);
  ctx.stroke();

  // Beaded pearls
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 195, cy + Math.sin(angle) * 195, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('ganesha_prabhavali', texture);
  return texture;
}

/**
 * Grand Altar Rangoli Mandala with Marigold Petals and Diya Glow
 */
export function createAltarRangoliTexture(): THREE.CanvasTexture {
  if (textureCache.has('altar_rangoli')) return textureCache.get('altar_rangoli')!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const cx = 512;
  const cy = 512;

  // Deep Crimson & Saffron Mandala Base
  const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 500);
  grad.addColorStop(0, '#ffd700');
  grad.addColorStop(0.25, '#d90429');
  grad.addColorStop(0.55, '#7209b7');
  grad.addColorStop(0.85, '#240046');
  grad.addColorStop(1, '#0a0014');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 16 Lotus Petals Layer 1 (Vibrant Magenta & Rose)
  const petals1 = 16;
  for (let i = 0; i < petals1; i++) {
    const angle = (i * Math.PI * 2) / petals1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.ellipse(0, 320, 55, 130, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner gold tip
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, 420, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 16 Petals Layer 2 (Peacock Teal & Turquoise)
  const petals2 = 16;
  for (let i = 0; i < petals2; i++) {
    const angle = ((i + 0.5) * Math.PI * 2) / petals2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.ellipse(0, 220, 42, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  }

  // 8 Petals Layer 3 (Radiant Saffron Orange)
  const petals3 = 8;
  for (let i = 0; i < petals3; i++) {
    const angle = (i * Math.PI * 2) / petals3;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.ellipse(0, 130, 36, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Central Sacred Core with Swastika / Om Motif
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx, cy, 68, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#d90429';
  ctx.font = 'bold 56px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ॐ', cx, cy);

  // Outer Marigold Garland Ring
  for (let i = 0; i < 48; i++) {
    const angle = (i * Math.PI * 2) / 48;
    ctx.fillStyle = i % 2 === 0 ? '#ff7b00' : '#ffb703';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 480, cy + Math.sin(angle) * 480, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('altar_rangoli', texture);
  return texture;
}

