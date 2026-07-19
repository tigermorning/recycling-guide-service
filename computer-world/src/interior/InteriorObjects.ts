import * as THREE from 'three';

export interface InteriorObject {
  type: 'cpu-core' | 'alu' | 'register' | 'control-unit' | 'cache' | 'memory-slot' | 'memory-cell' | 'data-shelf' | 'platter' | 'read-head' | 'firewall-gate' | 'packet-inspector' | 'rule-table' | 'shader-core' | 'vram' | 'routing-table' | 'dns-database' | 'http-structure' | 'kernel' | 'scheduler' | 'memory-manager' | 'circuit';
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

export function createALU(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const alu = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.3, 0.8),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.6 }),
  );
  alu.position.y = 0.5;
  alu.castShadow = true;
  group.add(alu);

  const addSymbol = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.6 }),
  );
  addSymbol.position.set(-0.3, 0.65, 0.43);
  group.add(addSymbol);

  const subSymbol = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.05, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xff5252, emissiveIntensity: 0.6 }),
  );
  subSymbol.position.set(0, 0.65, 0.43);
  group.add(subSymbol);

  const mulSymbol = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x2196f3, emissive: 0x2196f3, emissiveIntensity: 0.6 }),
  );
  mulSymbol.position.set(0.3, 0.65, 0.43);
  group.add(mulSymbol);

  addLabel(group, obj.label, 1.0);
  return group;
}

export function createRegister(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const reg = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.2, 0.6),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.5 }),
  );
  reg.position.y = 0.3;
  reg.castShadow = true;
  group.add(reg);

  for (let i = 0; i < 8; i++) {
    const cell = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.12, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.4 }),
    );
    cell.position.set(-0.6 + i * 0.17, 0.4, 0);
    group.add(cell);
  }

  addLabel(group, obj.label, 0.7);
  return group;
}

export function createControlUnit(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const cu = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.4, 0.8),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.6 }),
  );
  cu.position.y = 0.5;
  cu.castShadow = true;
  group.add(cu);

  const arrow = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.2, 8),
    new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.5 }),
  );
  arrow.position.set(0, 0.85, 0);
  arrow.rotation.z = Math.PI;
  group.add(arrow);

  addLabel(group, obj.label, 1.1);
  return group;
}

export function createCache(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const cache = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.25, 0.5),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.2, metalness: 0.7 }),
  );
  cache.position.y = 0.3;
  cache.castShadow = true;
  group.add(cache);

  for (let i = 0; i < 3; i++) {
    const level = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.15, 0.15),
      new THREE.MeshStandardMaterial({ 
        color: i === 0 ? 0x00e676 : i === 1 ? 0x2196f3 : 0x9c27b0, 
        emissive: i === 0 ? 0x00e676 : i === 1 ? 0x2196f3 : 0x9c27b0, 
        emissiveIntensity: 0.4 
      }),
    );
    level.position.set(-0.5 + i * 0.5, 0.45, 0);
    group.add(level);
  }

  addLabel(group, obj.label, 0.8);
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

export function createMemoryCell(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const cell = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.5 }),
  );
  cell.position.y = 0.3;
  cell.castShadow = true;
  group.add(cell);

  const capacitor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.4 }),
  );
  capacitor.position.set(0, 0.55, 0);
  group.add(capacitor);

  const transistor = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.08, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x2196f3, emissive: 0x2196f3, emissiveIntensity: 0.3 }),
  );
  transistor.position.set(0.12, 0.55, 0);
  group.add(transistor);

  addLabel(group, obj.label, 0.8);
  return group;
}

export function createPlatter(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const platter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.2, metalness: 0.8 }),
  );
  platter.position.y = 0.5;
  platter.castShadow = true;
  group.add(platter);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.3, metalness: 0.7 }),
  );
  hub.position.y = 0.55;
  group.add(hub);

  for (let i = 0; i < 4; i++) {
    const track = new THREE.Mesh(
      new THREE.TorusGeometry(0.3 + i * 0.12, 0.01, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.4 }),
    );
    track.position.y = 0.53;
    track.rotation.x = Math.PI / 2;
    group.add(track);
  }

  addLabel(group, obj.label, 1.0);
  return group;
}

export function createReadHead(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.08, 0.15),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4, metalness: 0.6 }),
  );
  arm.position.y = 0.7;
  arm.castShadow = true;
  group.add(arm);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.06, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.3 }),
  );
  head.position.set(-0.4, 0.68, 0);
  group.add(head);

  const pivot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.5, metalness: 0.5 }),
  );
  pivot.position.set(0.4, 0.7, 0);
  group.add(pivot);

  addLabel(group, obj.label, 1.0);
  return group;
}

export function createPacketInspector(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const inspector = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.8),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.5 }),
  );
  inspector.position.y = 0.6;
  inspector.castShadow = true;
  group.add(inspector);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 }),
  );
  screen.position.set(0, 0.7, 0.41);
  group.add(screen);

  const led1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.8 }),
  );
  led1.position.set(-0.4, 0.9, 0.41);
  group.add(led1);

  const led2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xff5252, emissiveIntensity: 0.8 }),
  );
  led2.position.set(0.4, 0.9, 0.41);
  group.add(led2);

  addLabel(group, obj.label, 1.3);
  return group;
}

export function createRuleTable(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.0, 0.1),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.5 }),
  );
  table.position.y = 0.7;
  table.castShadow = true;
  group.add(table);

  for (let i = 0; i < 4; i++) {
    const rule = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.15, 0.02),
      new THREE.MeshStandardMaterial({ 
        color: i === 0 ? 0x00e676 : i === 1 ? 0x2196f3 : i === 2 ? 0xffd93d : 0xff5252,
        emissive: i === 0 ? 0x00e676 : i === 1 ? 0x2196f3 : i === 2 ? 0xffd93d : 0xff5252,
        emissiveIntensity: 0.3 
      }),
    );
    rule.position.set(0, 0.4 + i * 0.2, 0.06);
    group.add(rule);
  }

  addLabel(group, obj.label, 1.5);
  return group;
}

export function createShaderCore(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.15, 0.6),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.6 }),
  );
  core.position.y = 0.3;
  core.castShadow = true;
  group.add(core);

  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.8 }),
  );
  led.position.set(0, 0.4, 0.32);
  group.add(led);

  addLabel(group, obj.label, 0.6);
  return group;
}

export function createVRAM(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const chip = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.2, 0.4),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.5 }),
  );
  chip.position.y = 0.3;
  chip.castShadow = true;
  group.add(chip);

  for (let i = 0; i < 6; i++) {
    const pin = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.08, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.3 }),
    );
    pin.position.set(-0.35 + i * 0.14, 0.2, 0.22);
    group.add(pin);
  }

  addLabel(group, obj.label, 0.6);
  return group;
}

export function createRoutingTable(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.2, 0.1),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4 }),
  );
  table.position.y = 0.8;
  table.castShadow = true;
  group.add(table);

  const header = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.2, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x2196f3, emissive: 0x2196f3, emissiveIntensity: 0.4 }),
  );
  header.position.set(0, 1.3, 0.06);
  group.add(header);

  for (let i = 0; i < 3; i++) {
    const row = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.12, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x4caf50, emissiveIntensity: 0.2 }),
    );
    row.position.set(0, 0.7 + i * 0.2, 0.06);
    group.add(row);
  }

  addLabel(group, obj.label, 1.7);
  return group;
}

export function createDNSDatabase(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const db = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4, metalness: 0.5 }),
  );
  db.position.y = 0.5;
  db.castShadow = true;
  group.add(db);

  const label2 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.4, transparent: true, opacity: 0.8 }),
  );
  label2.position.set(0, 0.6, 0.61);
  group.add(label2);

  for (let i = 0; i < 3; i++) {
    const record = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.08, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.3 }),
    );
    record.position.set(0, 0.3 + i * 0.15, 0.61);
    group.add(record);
  }

  addLabel(group, obj.label, 1.2);
  return group;
}

export function createHTTPStructure(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const request = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 0.4),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4 }),
  );
  request.position.y = 0.5;
  request.castShadow = true;
  group.add(request);

  const method = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.15, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x4caf50, emissiveIntensity: 0.4 }),
  );
  method.position.set(-0.35, 0.6, 0.21);
  group.add(method);

  const url = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.15, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x2196f3, emissive: 0x2196f3, emissiveIntensity: 0.4 }),
  );
  url.position.set(0.15, 0.6, 0.21);
  group.add(url);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.2, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.3 }),
  );
  body.position.set(0, 0.4, 0.21);
  group.add(body);

  addLabel(group, obj.label, 1.0);
  return group;
}

export function createKernel(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const kernel = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.4, 1.0),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.3, metalness: 0.6 }),
  );
  kernel.position.y = 0.4;
  kernel.castShadow = true;
  group.add(kernel);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.05, 8, 32),
    new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xff5252, emissiveIntensity: 0.4 }),
  );
  ring.position.y = 0.65;
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  addLabel(group, obj.label, 0.9);
  return group;
}

export function createScheduler(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const scheduler = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.3, 0.8),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4 }),
  );
  scheduler.position.y = 0.4;
  scheduler.castShadow = true;
  group.add(scheduler);

  const clock = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0x2196f3, emissive: 0x2196f3, emissiveIntensity: 0.4 }),
  );
  clock.position.set(0, 0.6, 0.3);
  group.add(clock);

  for (let i = 0; i < 3; i++) {
    const queue = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x4caf50, emissiveIntensity: 0.3 }),
    );
    queue.position.set(-0.3 + i * 0.3, 0.5, -0.2);
    group.add(queue);
  }

  addLabel(group, obj.label, 0.8);
  return group;
}

export function createMemoryManager(obj: InteriorObject): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(obj.position);

  const mm = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.3, 0.6),
    new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.4 }),
  );
  mm.position.y = 0.4;
  mm.castShadow = true;
  group.add(mm);

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.4, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.3, transparent: true, opacity: 0.7 }),
  );
  table.position.set(0, 0.5, 0.31);
  group.add(table);

  for (let i = 0; i < 4; i++) {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: i < 2 ? 0x4caf50 : 0xff5252, emissive: i < 2 ? 0x4caf50 : 0xff5252, emissiveIntensity: 0.3 }),
    );
    block.position.set(-0.25 + i * 0.17, 0.5, 0.32);
    group.add(block);
  }

  addLabel(group, obj.label, 0.8);
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
