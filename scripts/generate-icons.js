import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard Brand SVG (512x512)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#142238" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Background rounded squircle / tile -->
  <rect width="512" height="512" rx="112" fill="#101827" />
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#bgGrad)" stroke="#242831" stroke-width="4" />

  <!-- Subtle constellation background lines -->
  <circle cx="256" cy="256" r="180" stroke="#344B6B" stroke-opacity="0.35" stroke-width="2.5" stroke-dasharray="8 8" fill="none" />
  <circle cx="256" cy="256" r="128" stroke="#344B6B" stroke-opacity="0.5" stroke-width="3" fill="none" />
  
  <!-- Outer orbital pulse dots -->
  <circle cx="256" cy="76" r="7" fill="#38BDF8" />
  <circle cx="436" cy="256" r="7" fill="#34D399" />
  <circle cx="256" cy="436" r="7" fill="#38BDF8" />
  <circle cx="76" cy="256" r="7" fill="#34D399" />

  <!-- Core Outer Ring with Glowing Gradient -->
  <circle cx="256" cy="256" r="92" stroke="url(#blueGrad)" stroke-width="16" fill="none" />

  <!-- Modern Geometric 'X' Intersecting the Circle -->
  <g stroke-linecap="round" stroke-linejoin="round">
    <!-- Diagonal 1 -->
    <line x1="172" y1="172" x2="340" y2="340" stroke="#F5F6F8" stroke-width="28" />
    <!-- Diagonal 2 -->
    <line x1="340" y1="172" x2="172" y2="340" stroke="#F5F6F8" stroke-width="28" />
    
    <!-- Accent core intersection highlights -->
    <circle cx="256" cy="256" r="34" fill="#101827" stroke="url(#emeraldGrad)" stroke-width="7" />
    <circle cx="256" cy="256" r="14" fill="#34D399" />
  </g>
</svg>`;

// 2. Maskable Icon SVG (Full bleed background, 20% safe zone padding)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#142238" />
      <stop offset="100%" stop-color="#101827" />
    </linearGradient>
    <linearGradient id="mBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <linearGradient id="mEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Full background bleed for maskable -->
  <rect width="512" height="512" fill="#101827" />
  <circle cx="256" cy="256" r="230" fill="url(#mBgGrad)" stroke="#242831" stroke-width="4" />

  <!-- Safe Zone Contained Graphics (within 65% radius = 166px) -->
  <circle cx="256" cy="256" r="140" stroke="#344B6B" stroke-opacity="0.45" stroke-width="2.5" stroke-dasharray="6 6" fill="none" />
  
  <!-- Outer orbital pulse dots -->
  <circle cx="256" cy="116" r="6" fill="#38BDF8" />
  <circle cx="396" cy="256" r="6" fill="#34D399" />
  <circle cx="256" cy="396" r="6" fill="#38BDF8" />
  <circle cx="116" cy="256" r="6" fill="#34D399" />

  <!-- Core Ring -->
  <circle cx="256" cy="256" r="76" stroke="url(#mBlueGrad)" stroke-width="14" fill="none" />

  <!-- Dynamic Geometric 'X' -->
  <g stroke-linecap="round" stroke-linejoin="round">
    <line x1="188" y1="188" x2="324" y2="324" stroke="#F5F6F8" stroke-width="22" />
    <line x1="324" y1="188" x2="188" y2="324" stroke="#F5F6F8" stroke-width="22" />
    <circle cx="256" cy="256" r="26" fill="#101827" stroke="url(#mEmeraldGrad)" stroke-width="5" />
    <circle cx="256" cy="256" r="10" fill="#34D399" />
  </g>
</svg>`;

async function generate() {
  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'pwa-icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable.svg'), maskableSvg);

  const standardBuf = Buffer.from(standardSvg);
  const maskableBuf = Buffer.from(maskableSvg);

  // Generate PNGs with sharp
  await sharp(standardBuf).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(standardBuf).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(standardBuf).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(standardBuf).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.ico'));
  await sharp(maskableBuf).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('✓ Successfully generated all PWA icons & raster PNGs!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
