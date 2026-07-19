import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Portal } from '../portal/Portal.ts';
import type { InteriorObject } from './InteriorObjects.ts';
import {
  createCpuCore,
  createALU,
  createRegister,
  createControlUnit,
  createCache,
  createMemorySlot,
  createMemoryCell,
  createDataShelf,
  createPlatter,
  createReadHead,
  createFirewallGate,
  createPacketInspector,
  createRuleTable,
  createShaderCore,
  createVRAM,
  createRoutingTable,
  createDNSDatabase,
  createHTTPStructure,
  createKernel,
  createScheduler,
  createMemoryManager,
  createCircuit,
} from './InteriorObjects.ts';

interface InteriorConfig {
  buildingName: string;
  roomColor: number;
  floorColor: number;
  objects: InteriorObject[];
}

const INTERIOR_CONFIGS: Record<string, InteriorConfig> = {
  'CPU (중앙처리장치)': {
    buildingName: 'CPU (중앙처리장치)',
    roomColor: 0x37474f,
    floorColor: 0x263238,
    objects: [
      { type: 'cpu-core', position: new THREE.Vector3(-1.5, 0, -1.5), label: '코어 1', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(-0.5, 0, -1.5), label: '코어 2', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(0.5, 0, -1.5), label: '코어 3', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(1.5, 0, -1.5), label: '코어 4', color: 0x4fc3f7 },
      { type: 'alu', position: new THREE.Vector3(-1.0, 0, 0), label: 'ALU (산술논리연산장치)', color: 0x7c4dff },
      { type: 'alu', position: new THREE.Vector3(1.0, 0, 0), label: 'ALU (산술논리연산장치)', color: 0x7c4dff },
      { type: 'control-unit', position: new THREE.Vector3(0, 0, 0), label: '제어장치 (CU)', color: 0xff6e40 },
      { type: 'register', position: new THREE.Vector3(0, 0, 1.2), label: '레지스터', color: 0x00e676 },
      { type: 'cache', position: new THREE.Vector3(0, 0, 2.2), label: '캐시 메모리', color: 0x2196f3 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 3), label: '내부 버스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  'RAM (메모리)': {
    buildingName: 'RAM (메모리)',
    roomColor: 0x455a64,
    floorColor: 0x37474f,
    objects: [
      { type: 'memory-slot', position: new THREE.Vector3(-1.8, 0, -1), label: '슬롯 A', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(-0.6, 0, -1), label: '슬롯 B', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(0.6, 0, -1), label: '슬롯 C', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(1.8, 0, -1), label: '슬롯 D', color: 0x607d8b },
      { type: 'memory-cell', position: new THREE.Vector3(-1.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'memory-cell', position: new THREE.Vector3(-0.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'memory-cell', position: new THREE.Vector3(0.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'memory-cell', position: new THREE.Vector3(1.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 2.5), label: '주소 디코더 & 데이터 버스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '저장장치 (SSD/HDD)': {
    buildingName: '저장장치 (SSD/HDD)',
    roomColor: 0x5d4037,
    floorColor: 0x4e342e,
    objects: [
      { type: 'platter', position: new THREE.Vector3(-1.5, 0, -1), label: '플래터 (디스크)', color: 0x9e9e9e },
      { type: 'platter', position: new THREE.Vector3(-1.5, 0, 0), label: '플래터 (디스크)', color: 0x9e9e9e },
      { type: 'read-head', position: new THREE.Vector3(-1.5, 0, 1), label: '읽기/쓰기 헤드', color: 0x757575 },
      { type: 'data-shelf', position: new THREE.Vector3(0, 0, -1), label: 'SSD 컨트롤러', color: 0x2196f3 },
      { type: 'data-shelf', position: new THREE.Vector3(1.5, 0, -1), label: '캐시 버퍼', color: 0x4caf50 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 1.5), label: 'SATA/M.2 인터페이스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '방화벽 (화재벽)': {
    buildingName: '방화벽 (화재벽)',
    roomColor: 0xb71c1c,
    floorColor: 0x880e0e,
    objects: [
      { type: 'firewall-gate', position: new THREE.Vector3(0, 0, -2), label: '출입문', color: 0xc62828 },
      { type: 'packet-inspector', position: new THREE.Vector3(-1.5, 0, 0), label: '패킷 검사기', color: 0x1a237e },
      { type: 'rule-table', position: new THREE.Vector3(1.5, 0, 0), label: '규칙 테이블', color: 0x4a148c },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 2), label: '상태 테이블', color: 0x1a237e, size: new THREE.Vector3(2, 0, 1) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 2), label: '로그 기록', color: 0x1a237e, size: new THREE.Vector3(2, 0, 1) },
    ],
  },
  'GPU (그래픽처리장치)': {
    buildingName: 'GPU (그래픽처리장치)',
    roomColor: 0x1a237e,
    floorColor: 0x0d47a1,
    objects: [
      { type: 'shader-core', position: new THREE.Vector3(-1.5, 0, -1.5), label: '셰이더 코어 1', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(-0.5, 0, -1.5), label: '셰이더 코어 2', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(0.5, 0, -1.5), label: '셰이더 코어 3', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(1.5, 0, -1.5), label: '셰이더 코어 4', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(-1.5, 0, -0.5), label: '셰이더 코어 5', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(-0.5, 0, -0.5), label: '셰이더 코어 6', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(0.5, 0, -0.5), label: '셰이더 코어 7', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(1.5, 0, -0.5), label: '셰이더 코어 8', color: 0x00e5ff },
      { type: 'vram', position: new THREE.Vector3(-1.2, 0, 1), label: 'VRAM (전용 메모리)', color: 0x7c4dff },
      { type: 'vram', position: new THREE.Vector3(0, 0, 1), label: 'VRAM (전용 메모리)', color: 0x7c4dff },
      { type: 'vram', position: new THREE.Vector3(1.2, 0, 1), label: 'VRAM (전용 메모리)', color: 0x7c4dff },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 2.2), label: '메모리 컨트롤러', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '라우터 (공유기)': {
    buildingName: '라우터 (공유기)',
    roomColor: 0x004d40,
    floorColor: 0x00695c,
    objects: [
      { type: 'routing-table', position: new THREE.Vector3(0, 0, -1.5), label: '라우팅 테이블', color: 0x00897b },
      { type: 'packet-inspector', position: new THREE.Vector3(-1.5, 0, 0), label: 'NAT (주소 변환)', color: 0x00695c },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 0), label: 'DHCP 서버', color: 0x004d40, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1.5), label: '포트 포워딩', color: 0x004d40, size: new THREE.Vector3(2, 0, 1) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1.5), label: 'Wireless AP', color: 0x004d40, size: new THREE.Vector3(2, 0, 1) },
    ],
  },
  'DNS (이름서버)': {
    buildingName: 'DNS (이름서버)',
    roomColor: 0x311b92,
    floorColor: 0x4a148c,
    objects: [
      { type: 'dns-database', position: new THREE.Vector3(0, 0, -1.5), label: '도메인 데이터베이스', color: 0x7c4dff },
      { type: 'cache', position: new THREE.Vector3(-1.5, 0, 0), label: '리졸버 캐시', color: 0x00e676 },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 0), label: '쿼리 프로세서', color: 0x311b92, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 1.5), label: '레코드 테이블 (A, AAAA, CNAME)', color: 0x311b92, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  'HTTP (규약)': {
    buildingName: 'HTTP (규약)',
    roomColor: 0x1b5e20,
    floorColor: 0x2e7d32,
    objects: [
      { type: 'http-structure', position: new THREE.Vector3(0, 0, -1.5), label: 'HTTP 요청 (Request)', color: 0x4caf50 },
      { type: 'http-structure', position: new THREE.Vector3(0, 0, 0), label: 'HTTP 응답 (Response)', color: 0x2196f3 },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1), label: '헤더 (Headers)', color: 0x1b5e20, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1), label: '쿠키 & 세션', color: 0x1b5e20, size: new THREE.Vector3(2, 0, 1.5) },
    ],
  },
  '운영체제 (OS)': {
    buildingName: '운영체제 (OS)',
    roomColor: 0x263238,
    floorColor: 0x37474f,
    objects: [
      { type: 'kernel', position: new THREE.Vector3(0, 0, -1.5), label: '커널 (Kernel)', color: 0xff5252 },
      { type: 'scheduler', position: new THREE.Vector3(-1.5, 0, 0), label: '스케줄러 (Scheduler)', color: 0x2196f3 },
      { type: 'memory-manager', position: new THREE.Vector3(1.5, 0, 0), label: '메모리 관리자', color: 0x4caf50 },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1.5), label: '파일 시스템', color: 0x263238, size: new THREE.Vector3(2, 0, 1) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1.5), label: 'I/O 관리자', color: 0x263238, size: new THREE.Vector3(2, 0, 1) },
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
        case 'alu':
          mesh = createALU(obj);
          break;
        case 'register':
          mesh = createRegister(obj);
          break;
        case 'control-unit':
          mesh = createControlUnit(obj);
          break;
        case 'cache':
          mesh = createCache(obj);
          break;
        case 'memory-slot':
          mesh = createMemorySlot(obj);
          break;
        case 'memory-cell':
          mesh = createMemoryCell(obj);
          break;
        case 'data-shelf':
          mesh = createDataShelf(obj);
          break;
        case 'platter':
          mesh = createPlatter(obj);
          break;
        case 'read-head':
          mesh = createReadHead(obj);
          break;
        case 'firewall-gate':
          mesh = createFirewallGate(obj);
          break;
        case 'packet-inspector':
          mesh = createPacketInspector(obj);
          break;
        case 'rule-table':
          mesh = createRuleTable(obj);
          break;
        case 'shader-core':
          mesh = createShaderCore(obj);
          const coreLed = mesh.children[1] as THREE.Mesh;
          if (coreLed) this.animatedChips.push(coreLed);
          break;
        case 'vram':
          mesh = createVRAM(obj);
          break;
        case 'routing-table':
          mesh = createRoutingTable(obj);
          break;
        case 'dns-database':
          mesh = createDNSDatabase(obj);
          break;
        case 'http-structure':
          mesh = createHTTPStructure(obj);
          break;
        case 'kernel':
          mesh = createKernel(obj);
          break;
        case 'scheduler':
          mesh = createScheduler(obj);
          break;
        case 'memory-manager':
          mesh = createMemoryManager(obj);
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
