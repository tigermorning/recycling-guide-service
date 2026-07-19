import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Portal } from '../portal/Portal.ts';
import type { InteriorObject } from './InteriorObjects.ts';
import {
  createCpuCore,
  createMemorySlot,
  createDataShelf,
  createFirewallGate,
  createCircuit,
} from './InteriorObjects.ts';

interface InteriorConfig {
  buildingName: string;
  roomColor: number;
  floorColor: number;
  objects: InteriorObject[];
}

const INTERIOR_CONFIGS: Record<string, InteriorConfig> = {
  '책상 (CPU)': {
    buildingName: '책상 (CPU)',
    roomColor: 0x37474f,
    floorColor: 0x263238,
    objects: [
      { type: 'cpu-core', position: new THREE.Vector3(-1.5, 0, -1), label: '코어 1', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(-0.5, 0, -1), label: '코어 2', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(0.5, 0, -1), label: '코어 3', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(1.5, 0, -1), label: '코어 4', color: 0x4fc3f7 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 1), label: '메인보드', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 2) },
    ],
  },
  '서류함 (RAM)': {
    buildingName: '서류함 (RAM)',
    roomColor: 0x455a64,
    floorColor: 0x37474f,
    objects: [
      { type: 'memory-slot', position: new THREE.Vector3(-1.2, 0, 0), label: '슬롯 A', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(-0.4, 0, 0), label: '슬롯 B', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(0.4, 0, 0), label: '슬롯 C', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(1.2, 0, 0), label: '슬롯 D', color: 0x607d8b },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 1.5), label: '데이터 버스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '창고 (저장장치)': {
    buildingName: '창고 (저장장치)',
    roomColor: 0x5d4037,
    floorColor: 0x4e342e,
    objects: [
      { type: 'data-shelf', position: new THREE.Vector3(-1.5, 0, -1), label: 'SSD', color: 0x795548 },
      { type: 'data-shelf', position: new THREE.Vector3(0, 0, -1), label: 'HDD', color: 0x6d4c41 },
      { type: 'data-shelf', position: new THREE.Vector3(1.5, 0, -1), label: '백업', color: 0x8d6e63 },
    ],
  },
  '문 (방화벽)': {
    buildingName: '문 (방화벽)',
    roomColor: 0xb71c1c,
    floorColor: 0x880e0e,
    objects: [
      { type: 'firewall-gate', position: new THREE.Vector3(0, 0, -1.5), label: '출입문', color: 0xc62828 },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1), label: '필터', color: 0x1a237e, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1), label: '로그', color: 0x1a237e, size: new THREE.Vector3(2, 0, 1.5) },
    ],
  },
};

export class InteriorWorld extends World {
  private portals: Portal[] = [];
  private previousWorld: string;
  private config: InteriorConfig;
  private animatedChips: THREE.Mesh[] = [];

  constructor(buildingName: string, previousWorld: string) {
    super('interior', `${buildingName} 내부`);
    this.previousWorld = previousWorld;
    this.config = INTERIOR_CONFIGS[buildingName] ?? this.createFallbackConfig(buildingName);
  }

  private createFallbackConfig(name: string): InteriorConfig {
    return {
      buildingName: name,
      roomColor: 0x455a64,
      floorColor: 0x37474f,
      objects: [
        { type: 'circuit', position: new THREE.Vector3(0, 0, 0), label: name, color: 0x1a5c1a, size: new THREE.Vector3(3, 0, 2) },
      ],
    };
  }

  build(): void {
    this.buildRoom();
    this.buildObjects();
    this.buildPortal();
  }

  onEnter(): void {}
  onExit(): void {
    this.animatedChips = [];
  }

  private buildRoom(): void {
    (this.scene as THREE.Scene).background = new THREE.Color(this.config.roomColor);
    (this.scene as THREE.Scene).fog = new THREE.Fog(this.config.roomColor, 15, 40);

    const ground = this.scene.getObjectByName('ground') as THREE.Mesh;
    if (ground) {
      ground.material = new THREE.MeshStandardMaterial({ color: this.config.floorColor, roughness: 0.8 });
    }

    const wallMat = new THREE.MeshStandardMaterial({ color: this.config.roomColor, roughness: 0.7 });
    const walls = [
      { size: [8, 3, 0.15] as [number, number, number], pos: [0, 1.5, -4] as [number, number, number] },
      { size: [8, 3, 0.15] as [number, number, number], pos: [0, 1.5, 4] as [number, number, number] },
      { size: [0.15, 3, 8] as [number, number, number], pos: [-4, 1.5, 0] as [number, number, number] },
      { size: [0.15, 3, 8] as [number, number, number], pos: [4, 1.5, 0] as [number, number, number] },
    ];
    for (const w of walls) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(...w.size), wallMat);
      wall.position.set(...w.pos);
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.scene.add(wall);
    }

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: this.config.roomColor, roughness: 0.9 }),
    );
    ceiling.position.y = 3;
    this.scene.add(ceiling);

    const light = new THREE.PointLight(0xffffff, 0.8, 15);
    light.position.set(0, 2.5, 0);
    this.scene.add(light);
  }

  private buildObjects(): void {
    for (const obj of this.config.objects) {
      let mesh: THREE.Group;
      switch (obj.type) {
        case 'cpu-core':
          mesh = createCpuCore(obj);
          const chip = mesh.children[0] as THREE.Mesh;
          if (chip) this.animatedChips.push(chip);
          break;
        case 'memory-slot':
          mesh = createMemorySlot(obj);
          break;
        case 'data-shelf':
          mesh = createDataShelf(obj);
          break;
        case 'firewall-gate':
          mesh = createFirewallGate(obj);
          break;
        case 'circuit':
          mesh = createCircuit(obj);
          break;
        default:
          mesh = createCircuit(obj);
      }
      this.scene.add(mesh);
    }

    this.animatedObjects.push({
      update: (t) => {
        for (const chip of this.animatedChips) {
          (chip.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + 0.3 * Math.sin(t * 2);
        }
      },
    });
  }

  private buildPortal(): void {
    const portal = new Portal({
      name: '나가기',
      position: new THREE.Vector3(0, 0, -3),
      targetWorld: this.previousWorld,
      color: 0xffd93d,
    });
    this.portals.push(portal);
    this.scene.add(portal.group);
    this.animatedObjects.push({ update: (t) => portal.update(t) });
  }

  static hasInterior(buildingName: string): boolean {
    return buildingName in INTERIOR_CONFIGS;
  }

  getPreviousWorld(): string {
    return this.previousWorld;
  }
}
