import * as THREE from 'three';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

interface PatternTexture {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

const cache: Record<string, PatternTexture> = {};

function createCanvas(size: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}

function genBrickTex(): PatternTexture {
  const S = 256;
  const col = createCanvas(S), bmp = createCanvas(S);
  const cx = col.getContext('2d')!, bx = bmp.getContext('2d')!;
  cx.fillStyle = '#c9b9a6'; cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#4a4a4a'; bx.fillRect(0, 0, S, S);
  const bw = 58, bh = 26, mg = 5;
  let row = 0;
  for (let y = -bh; y < S + bh; y += bh + mg) {
    const off = (row % 2 === 0) ? 0 : -(bw / 2 + mg / 2);
    for (let x = off; x < S + bw; x += bw + mg) {
      const shade = 0.88 + Math.random() * 0.24;
      cx.fillStyle = `rgb(${Math.floor(180 * shade)},${Math.floor(150 * shade)},${Math.floor(120 * shade)})`;
      cx.fillRect(x, y, bw, bh);
      const g = Math.floor(150 + Math.random() * 70);
      bx.fillStyle = `rgb(${g},${g},${g})`;
      bx.fillRect(x, y, bw, bh);
    }
    row++;
  }
  return { map: new THREE.CanvasTexture(col), bump: new THREE.CanvasTexture(bmp) };
}

function genWoodTex(): PatternTexture {
  const S = 256;
  const col = createCanvas(S), bmp = createCanvas(S);
  const cx = col.getContext('2d')!, bx = bmp.getContext('2d')!;
  cx.fillStyle = '#6b4a35'; cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#909090'; bx.fillRect(0, 0, S, S);
  const plankH = 32;
  for (let y = 0; y < S; y += plankH) {
    cx.fillStyle = 'rgba(0,0,0,0.25)'; cx.fillRect(0, y, S, 2);
    bx.fillStyle = 'rgb(60,60,60)'; bx.fillRect(0, y, S, 2);
    for (let i = 0; i < 40; i++) {
      const gy = y + 2 + Math.random() * (plankH - 4);
      const len = 20 + Math.random() * 80;
      const gx = Math.random() * S;
      cx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.25})`;
      cx.beginPath(); cx.moveTo(gx, gy); cx.lineTo(gx + len, gy); cx.stroke();
      const bg = 130 + Math.floor(Math.random() * 60);
      bx.strokeStyle = `rgb(${bg},${bg},${bg})`;
      bx.beginPath(); bx.moveTo(gx, gy); bx.lineTo(gx + len, gy); bx.stroke();
    }
  }
  return { map: new THREE.CanvasTexture(col), bump: new THREE.CanvasTexture(bmp) };
}

function genConcreteTex(): PatternTexture {
  const S = 256;
  const col = createCanvas(S), bmp = createCanvas(S);
  const cx = col.getContext('2d')!, bx = bmp.getContext('2d')!;
  cx.fillStyle = '#a8a8a4'; cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#808080'; bx.fillRect(0, 0, S, S);
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * S, y = Math.random() * S, b = Math.random();
    cx.fillStyle = `rgba(${b < 0.5 ? 0 : 255},${b < 0.5 ? 0 : 255},${b < 0.5 ? 0 : 255},${Math.random() * 0.08})`;
    cx.fillRect(x, y, 1.4, 1.4);
    const g = 100 + Math.floor(Math.random() * 100);
    bx.fillStyle = `rgba(${g},${g},${g},0.5)`;
    bx.fillRect(x, y, 1.6, 1.6);
  }
  return { map: new THREE.CanvasTexture(col), bump: new THREE.CanvasTexture(bmp) };
}

function genMetalTex(baseLight: number): PatternTexture {
  const S = 256;
  const col = createCanvas(S), bmp = createCanvas(S);
  const cx = col.getContext('2d')!, bx = bmp.getContext('2d')!;
  const base = Math.floor(255 * baseLight);
  cx.fillStyle = `rgb(${base},${base},${base})`; cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#808080'; bx.fillRect(0, 0, S, S);
  const ridge = 16;
  for (let y = 0; y < S; y++) {
    const wave = Math.sin((y % ridge) / ridge * Math.PI);
    cx.fillStyle = `rgba(0,0,0,${(1 - (0.75 + wave * 0.3)) * 0.5})`;
    cx.fillRect(0, y, S, 1);
    const g = Math.floor(90 + wave * 140);
    bx.fillStyle = `rgb(${g},${g},${g})`;
    bx.fillRect(0, y, S, 1);
  }
  return { map: new THREE.CanvasTexture(col), bump: new THREE.CanvasTexture(bmp) };
}

function genShingleTex(): PatternTexture {
  const S = 256;
  const col = createCanvas(S), bmp = createCanvas(S);
  const cx = col.getContext('2d')!, bx = bmp.getContext('2d')!;
  cx.fillStyle = '#c7bba8'; cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#787878'; bx.fillRect(0, 0, S, S);
  const rowH = 22;
  let row = 0;
  for (let y = 0; y < S; y += rowH) {
    const off = (row % 2 === 0) ? 0 : 14;
    for (let x = -14 + off; x < S; x += 28) {
      const shade = 0.85 + Math.random() * 0.25;
      const g = Math.floor(160 * shade);
      cx.fillStyle = `rgb(${g},${Math.floor(g * 0.92)},${Math.floor(g * 0.8)})`;
      cx.beginPath();
      cx.moveTo(x, y + rowH); cx.quadraticCurveTo(x + 14, y + rowH - 16, x + 28, y + rowH);
      cx.lineTo(x + 28, y + rowH + 2); cx.lineTo(x, y + rowH + 2); cx.closePath(); cx.fill();
    }
    row++;
  }
  return { map: new THREE.CanvasTexture(col), bump: new THREE.CanvasTexture(bmp) };
}

function genGlassTex(): PatternTexture {
  const S = 128;
  const col = createCanvas(S), bmp = createCanvas(S);
  const cx = col.getContext('2d')!, bx = bmp.getContext('2d')!;
  cx.fillStyle = '#eef6f8'; cx.fillRect(0, 0, S, S);
  bx.fillStyle = '#a0a0a0'; bx.fillRect(0, 0, S, S);
  cx.strokeStyle = 'rgba(40,50,60,0.35)'; cx.lineWidth = 4;
  cx.beginPath(); cx.moveTo(S / 2, 0); cx.lineTo(S / 2, S); cx.moveTo(0, S / 2); cx.lineTo(S, S / 2); cx.stroke();
  const grad = cx.createLinearGradient(0, 0, S, S);
  grad.addColorStop(0, 'rgba(255,255,255,0.5)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.05)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = grad; cx.fillRect(0, 0, S, S);
  return { map: new THREE.CanvasTexture(col), bump: new THREE.CanvasTexture(bmp) };
}

function getPatternTextures(name: string): PatternTexture {
  if (cache[name]) return cache[name];
  let res: PatternTexture;
  switch (name) {
    case 'brick': res = genBrickTex(); break;
    case 'wood': res = genWoodTex(); break;
    case 'concrete': res = genConcreteTex(); break;
    case 'metal_dark': res = genMetalTex(0.28); break;
    case 'metal_paint': res = genMetalTex(0.78); break;
    case 'shingle': res = genShingleTex(); break;
    case 'glass': res = genGlassTex(); break;
    default: res = genConcreteTex();
  }
  cache[name] = res;
  return res;
}

function pickPatternForColor(color: THREE.Color): string {
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  const hueDeg = hsl.h * 360;
  if (hsl.l < 0.16 && hsl.s < 0.35) return 'metal_dark';
  if (hueDeg >= 15 && hueDeg <= 50 && hsl.s > 0.15) return hsl.l < 0.40 ? 'wood' : 'brick';
  if (hsl.s < 0.18) return 'concrete';
  return 'metal_paint';
}

function applyPBR(
  mesh: THREE.Mesh,
  patternName: string,
  repeatX: number,
  repeatY: number,
  bumpScale: number,
): void {
  const base = getPatternTextures(patternName);
  const map = base.map.clone(); map.needsUpdate = true;
  map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(repeatX, repeatY);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = base.bump.clone(); bump.needsUpdate = true;
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(repeatX, repeatY);
  const mat = mesh.material as THREE.MeshStandardMaterial;
  mat.map = map;
  mat.bumpMap = bump;
  mat.bumpScale = bumpScale;
  mat.needsUpdate = true;
}

export function upgradeMeshToPBR(mesh: THREE.Object3D): void {
  if (!(mesh instanceof THREE.Mesh)) return;
  if (!mesh.material || !(mesh.material instanceof THREE.MeshStandardMaterial)) return;
  if (mesh.material.map) return;
  if (mesh.material.transparent && mesh.material.opacity < 0.95) return;

  const geo = mesh.geometry;
  const p = geo.parameters as Record<string, number> | undefined;
  if (!p) return;

  if (geo.type === 'BoxGeometry') {
    const w = p.width ?? 1, h = p.height ?? 1, d = p.depth ?? 1;
    if (Math.max(w, h, d) < 0.55) return;
    const isGlow = mesh.material.emissive && mesh.material.emissive.getHex() !== 0 && mesh.material.emissiveIntensity > 0.15;
    if (isGlow) { applyPBR(mesh, 'glass', 1, 1, 0.02); return; }
    const pattern = pickPatternForColor(mesh.material.color);
    const rx = clamp(Math.round(Math.max(w, d) / 1.1), 1, 10);
    const ry = clamp(Math.round(h / 1.1), 1, 8);
    const bumpAmt = (pattern === 'metal_dark' || pattern === 'metal_paint') ? 0.045 : (pattern === 'wood') ? 0.05 : 0.07;
    applyPBR(mesh, pattern, rx, ry, bumpAmt);
  } else if (geo.type === 'ConeGeometry') {
    const r = p.radius ?? 1, h = p.height ?? 1;
    if (Math.max(r, h) < 0.4) return;
    const rx = clamp(Math.round((r * 2) / 0.9), 1, 10);
    const ry = clamp(Math.round(h / 0.6), 1, 6);
    applyPBR(mesh, 'shingle', rx, ry, 0.08);
  }
}
