import * as THREE from 'three';

export interface InteriorObject {
  type: 'cpu-core' | 'memory-slot' | 'data-shelf' | 'firewall-gate' | 'circuit';
  position: THREE.Vector3;
  label: string;
  color: number;
  size?: THREE.Vector3;
}

export function createCpuCore(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const chip = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.15, 0.8),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.5 }),
  );
  chip.position.y = 0.5;
  chip.castShadow = true;
  group.add(chip);

  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.8 }),
  );
  led.position.set(0, 0.6, 0.42);
  group.add(led);

  addLabel(group, obj.label, 1.0);
  return group;
}

export function createMemorySlot(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const slot = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.2, 0.08),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4 }),
  );
  slot.position.y = 0.6;
  slot.castShadow = true;
  group.add(slot);

  for (let i = 0; i < 4; i++) {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.7 }),
    );
    led.position.set(0, 0.3 + i * 0.25, 0.06);
    group.add(led);
  }

  addLabel(group, obj.label, 1.5);
  return group;
}

export function createDataShelf(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.8, 0.6),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.7 }),
  );
  shelf.position.y = 0.9;
  shelf.castShadow = true;
  group.add(shelf);

  for (let i = 0; i < 3; i++) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x5d4037 }),
    );
    box.position.set(-0.3 + i * 0.3, 0.5 + i * 0.5, 0.32);
    group.add(box);
  }

  addLabel(group, obj.label, 2.2);
  return group;
}

export function createFirewallGate(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.0, 0.15),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.5 }),
  );
  frame.position.y = 1.0;
  frame.castShadow = true;
  group.add(frame);

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 1.5),
    new THREE.MeshStandardMaterial({
      color: 0xff5252,
      emissive: 0xff5252,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.3,
    }),
  );
  glow.position.set(0, 1.0, 0.1);
  group.add(glow);

  addLabel(group, obj.label, 2.5);
  return group;
}

export function createCircuit(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(obj.size?.x ?? 2, 0.08, obj.size?.z ?? 1.5),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.6 }),
  );
  board.position.y = 0.04;
  board.receiveShadow = true;
  group.add(board);

  const lineMat = new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.3 });
  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.02, (obj.size?.z ?? 1.5) * 0.8),
      lineMat,
    );
    line.position.set(-0.6 + i * 0.3, 0.09, 0);
    group.add(line);
  }

  return group;
}

function addLabel(group: THREE.Group, text: string, y: number): void {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 56, 8);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, 128, 40);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.3),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide, depthTest: false }),
  );
  mesh.position.set(0, y, 0);
  mesh.rotation.x = -0.2;
  mesh.renderOrder = 999;
  group.add(mesh);
}
