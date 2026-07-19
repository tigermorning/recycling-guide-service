import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Building } from '../buildings/Building.ts';
import { Portal } from '../portal/Portal.ts';
import { upgradeMeshToPBR } from '../core/MaterialLibrary.ts';
import { Character } from '../characters/Character.ts';

/**
 * 하드웨어 월드 — 회로 기판(Motherboard) 위에 CPU, RAM 등이 연결된 세계.
 * 실제 컴퓨터 하드웨어의 물리적 구조를 직관적으로 보여줍니다.
 *
 * 교육적 배치:
 *   - CPU + Cache(내장): 보드 중앙, 캐시는 CPU 안에 있음
 *   - RAM: 보드 오른쪽, DIMM 슬롯에 수직으로 꽂힘
 *   - GPU: 보드 왼쪽 가장자리에 PCIe 슬롯으로 꽂힌 확장 카드
 *   - Storage: 보드 밖, 케이블로 연결된 별도 장치
 *   - OS: 메인보드 위 소프트웨어 영역 표시
 */
export class HardwareWorld extends World {
  private portals: Portal[] = [];
  private cpuFan!: THREE.Mesh;
  private cpuLed!: THREE.Mesh;
  private ramLed!: THREE.Mesh;
  private characters: Character[] = [];

  /** 각 부품의 월드 좌표 — 데이터 흐름 데모에서 사용 */
  readonly componentPositions: Record<string, THREE.Vector3> = {};

  /** 시스템 버스 — 컴포넌트 간 연결 경로 (하이라이트용) */
  private busSegments = new Map<string, THREE.Mesh>();
  private busMaterials = new Map<string, THREE.MeshStandardMaterial>();
  private highlightedBuses = new Set<string>();

  constructor() {
    super('hardware', '하드웨어 월드');
  }

  build(): void {
    this.buildEnvironment();
    this.buildMotherboard();
    this.buildPCBTraces();
    this.buildCPU();
    this.buildRAM();
    this.buildStorage();
    this.buildGPU();
    this.buildOSArea();
    this.buildPortals();
    this.buildCharacters();

    // 시스템 버스 애니메이션 — 하이라이트된 구간 펄스
    this.animatedObjects.push({
      update: (t) => {
        for (const key of this.highlightedBuses) {
          const mat = this.busMaterials.get(key);
          if (mat) {
            mat.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 6);
          }
        }
      },
    });

    this.scene.traverse(upgradeMeshToPBR);
  }

  onEnter(): void {}
  onExit(): void {}

  private buildEnvironment(): void {
    (this.scene as THREE.Scene).background = new THREE.Color(0x1a1a2e);
    (this.scene as THREE.Scene).fog = new THREE.Fog(0x1a1a2e, 50, 120);

    const ground = this.scene.getObjectByName('ground') as THREE.Mesh;
    if (ground) {
      ground.material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95 });
    }
  }

  // ─── UNIFIED LABEL ────────────────────────────────────────────────────
  private makeLabel(title: string, subtitle: string): THREE.Mesh {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 14);
    ctx.fill();

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 14);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 55);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#c0c0c0';
    ctx.fillText(subtitle, 256, 95);

    return new THREE.Mesh(
      new THREE.PlaneGeometry(4.0, 1.0),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
      }),
    );
  }

  // ─── MOTHERBOARD ───────────────────────────────────────────────────────
  private buildMotherboard(): void {
    const mbGroup = new THREE.Group();
    mbGroup.userData = {
      isBuilding: true,
      buildingName: '메인보드 (기판)',
      buildingTag: '모든 부품을 연결하는 회로 기판',
      buildingIcon: '🔌',
    };

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.7, metalness: 0.1 }),
    );
    board.position.y = -0.07;
    board.receiveShadow = true;
    mbGroup.add(board);

    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
    const edgeH = 0.2;
    const edges = [
      { s: [20, edgeH, 0.12] as [number, number, number], p: [0, edgeH / 2, -8.06] as [number, number, number] },
      { s: [20, edgeH, 0.12] as [number, number, number], p: [0, edgeH / 2, 8.06] as [number, number, number] },
      { s: [0.12, edgeH, 16.24] as [number, number, number], p: [-10.06, edgeH / 2, 0] as [number, number, number] },
      { s: [0.12, edgeH, 16.24] as [number, number, number], p: [10.06, edgeH / 2, 0] as [number, number, number] },
    ];
    for (const e of edges) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(...e.s), edgeMat);
      m.position.set(...e.p);
      mbGroup.add(m);
    }

    const mbLabel = this.makeLabel('메인보드 (기판)', '모든 부품을 연결하는 회로 기판');
    mbLabel.position.set(0, 1.4, -8.8);
    mbGroup.add(mbLabel);

    mbGroup.position.set(-2, 0, 0);
    this.scene.add(mbGroup);
    this.componentPositions['메인보드 (기판)'] = new THREE.Vector3(-2, 0, 0);
  }

  // ─── PCB TRACES (시스템 버스) ────────────────────────────────────────
  private buildPCBTraces(): void {
    const traceMat = new THREE.MeshStandardMaterial({
      color: 0xd4a017, roughness: 0.3, metalness: 0.8,
      emissive: 0xd4a017, emissiveIntensity: 0.15,
    });

    const pairs: [string, string][] = [
      ['CPU', 'RAM'],
      ['CPU', 'Storage'],
      ['CPU', 'GPU'],
      ['CPU', 'OS'],
    ];

    const positions: Record<string, THREE.Vector3> = {
      CPU: new THREE.Vector3(0, 0.01, 0),
      RAM: new THREE.Vector3(5, 0.01, 0),
      Storage: new THREE.Vector3(-9, 0.01, 9),
      GPU: new THREE.Vector3(-7, 0.01, 3),
      OS: new THREE.Vector3(-7, 0.01, -4),
    };

    for (const [a, b] of pairs) {
      const pa = positions[a];
      const pb = positions[b];
      this.makeTrace(pa, pb, traceMat, `${a}->${b}`);
    }
  }

  /**
   * 특정 버스 구간을 하이라이트합니다 (데모에서 사용)
   */
  highlightBusSegment(from: string, to: string): void {
    const key = `${from}->${to}`;
    const mat = this.busMaterials.get(key);
    if (mat) {
      mat.emissiveIntensity = 1.0;
      mat.color.set(0x00e676);
      mat.emissive.set(0x00e676);
      this.highlightedBuses.add(key);
    }
  }

  /**
   * 모든 버스 하이라이트를 초기화합니다
   */
  resetBusHighlights(): void {
    for (const key of this.highlightedBuses) {
      const mat = this.busMaterials.get(key);
      if (mat) {
        mat.emissiveIntensity = 0.15;
        mat.color.set(0xd4a017);
        mat.emissive.set(0xd4a017);
      }
    }
    this.highlightedBuses.clear();
  }

  private makeTrace(from: THREE.Vector3, to: THREE.Vector3, mat: THREE.Material, key?: string): void {
    const dx = to.x - from.x;
    const dz = to.z - from.z;

    // 고유한 material 복제 (하이라이트 개별 제어)
    const segMat = (mat as THREE.MeshStandardMaterial).clone();
    const meshes: THREE.Mesh[] = [];

    if (Math.abs(dx) > 0.1 && Math.abs(dz) > 0.1) {
      const mid = new THREE.Vector3(to.x, from.y, from.z);
      const s1 = this.makeTraceSegment(from, mid, segMat);
      const s2 = this.makeTraceSegment(mid, to, segMat);
      meshes.push(s1, s2);
      this.scene.add(s1);
      this.scene.add(s2);

      const dot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.04, 8),
        segMat,
      );
      dot.position.copy(mid);
      meshes.push(dot);
      this.scene.add(dot);
    } else {
      const s = this.makeTraceSegment(from, to, segMat);
      meshes.push(s);
      this.scene.add(s);
    }

    // 첫 번째 메시의 material을 대표로 저장
    if (key && meshes.length > 0) {
      this.busSegments.set(key, meshes[0]);
      this.busMaterials.set(key, segMat);
    }
  }

  private makeTraceSegment(a: THREE.Vector3, b: THREE.Vector3, mat: THREE.Material): THREE.Mesh {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    if (len < 0.01) return new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), mat);

    const geo = new THREE.BoxGeometry(len, 0.03, 0.18);
    const mesh = new THREE.Mesh(geo, mat);

    const center = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mesh.position.copy(center);
    mesh.lookAt(b);
    return mesh;
  }

  // ─── CPU (캐시 포함) ──────────────────────────────────────────────────
  private buildCPU(): void {
    const cpuGroup = new THREE.Group();
    cpuGroup.userData = {
      isBuilding: true,
      buildingName: 'CPU (중앙처리장치)',
      buildingTag: '계산과 처리를 담당하는 핵심 칩',
      buildingIcon: '🖥️',
    };

    // ── CPU 칩 본체 (확대) ──
    const chipBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.4, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.3, metalness: 0.5 }),
    );
    chipBody.position.y = 0.2;
    chipBody.castShadow = true;
    cpuGroup.add(chipBody);

    // ── 핀 (메인보드 소켓에 꽂히는 부분) ──
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.2, metalness: 0.9 });
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.04), pinMat);
        pin.position.set(-0.85 + i * 0.28, 0.05, -0.85 + j * 0.28);
        cpuGroup.add(pin);
      }
    }

    // ── 캐시 영역 (CPU 칩 위의 반투명 레이어 — L1/L2/L3) ──
    const cacheLayer = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.06, 1.6),
      new THREE.MeshStandardMaterial({
        color: 0x4fc3f7, emissive: 0x4fc3f7, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.65,
      }),
    );
    cacheLayer.position.y = 0.43;
    cpuGroup.add(cacheLayer);

    const cacheLabel = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.015, 0.8),
      new THREE.MeshStandardMaterial({
        color: 0x4fc3f7, emissive: 0x4fc3f7, emissiveIntensity: 0.4,
      }),
    );
    cacheLabel.position.y = 0.47;
    cpuGroup.add(cacheLabel);

    // ── 히트싱크 (방열판 — 확대) ──
    const heatBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.12, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.4, metalness: 0.7 }),
    );
    heatBase.position.y = 0.5;
    cpuGroup.add(heatBase);

    for (let i = 0; i < 10; i++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.55, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x9e9e9e, roughness: 0.4, metalness: 0.6 }),
      );
      fin.position.set(0, 0.78, -0.9 + i * 0.2);
      cpuGroup.add(fin);
    }

    // ── 팬 (확대) ──
    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 0.1, 20),
      new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.5 }),
    );
    fan.position.y = 1.2;
    cpuGroup.add(fan);
    this.cpuFan = fan;

    for (let i = 0; i < 5; i++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.02, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.5 }),
      );
      blade.rotation.y = (i / 5) * Math.PI * 2;
      blade.position.y = 1.2;
      fan.add(blade);
    }

    // ── LED ──
    this.cpuLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 1.0 }),
    );
    this.cpuLed.position.set(1.1, 0.22, 1.1);
    cpuGroup.add(this.cpuLed);

    // ── 라벨 ──
    const cpuLabel = this.makeLabel('CPU (중앙처리장치)', '계산과 처리를 담당하는 핵심 칩');
    cpuLabel.position.set(0, 2.4, 0);
    cpuGroup.add(cpuLabel);

    cpuGroup.position.set(0, 0, 0);
    this.scene.add(cpuGroup);
    this.componentPositions['CPU (중앙처리장치)'] = new THREE.Vector3(0, 0, 0);

    this.animatedObjects.push({
      update: (t) => {
        this.cpuFan.rotation.y = t * 8.0;
        (this.cpuLed.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 3.0);
        (cacheLayer.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + 0.3 * Math.sin(t * 5.0);
      },
    });
  }

  // ─── RAM (수직 DIMM — 확대) ──────────────────────────────────────────
  private buildRAM(): void {
    const ramGroup = new THREE.Group();
    ramGroup.userData = {
      isBuilding: true,
      buildingName: 'RAM (메모리)',
      buildingTag: '임시로 데이터를 보관하는 장치',
      buildingIcon: '🗄️',
    };

    const stickMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.5, metalness: 0.3 });
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.3, metalness: 0.5 });

    for (let s = 0; s < 4; s++) {
      const stick = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 2.4), stickMat);
      stick.position.set(-0.9 + s * 0.6, 0.75, 0);
      stick.castShadow = true;
      ramGroup.add(stick);

      for (let c = 0; c < 5; c++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.3), chipMat);
        chip.position.set(-0.9 + s * 0.6, 0.25 + c * 0.28, 0);
        ramGroup.add(chip);
      }

      const goldEdge = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.08, 2.0),
        new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.2, metalness: 0.9 }),
      );
      goldEdge.position.set(-0.9 + s * 0.6, 0.04, 0);
      ramGroup.add(goldEdge);
    }

    this.ramLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 1.0 }),
    );
    this.ramLed.position.set(0, 1.55, 0);
    ramGroup.add(this.ramLed);

    const ramLabel = this.makeLabel('RAM (메모리)', '임시로 데이터를 보관하는 장치');
    ramLabel.position.set(0, 2.6, 0);
    ramGroup.add(ramLabel);

    ramGroup.position.set(5, 0, 0);
    this.scene.add(ramGroup);
    this.componentPositions['RAM (메모리)'] = new THREE.Vector3(5, 0, 0);

    this.animatedObjects.push({
      update: (t) => {
        (this.ramLed.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.5 + 0.5 * Math.sin(t * 3.0);
      },
    });
  }

  // ─── STORAGE (보드 밖, 케이블 연결) ───────────────────────────────────
  private buildStorage(): void {
    const storage = new Building({
      name: '저장장치 (SSD/HDD)',
      tag: '데이터를 영구 보관하는 장치',
      icon: '🏭',
      position: new THREE.Vector3(-9, 0, 9),
      size: new THREE.Vector3(3.5, 2.8, 3.0),
      color: 0x5d4037,
      roofColor: 0x3e2723,
    });
    this.scene.add(storage.group);
    this.componentPositions['저장장치 (SSD/HDD)'] = new THREE.Vector3(-9, 0, 9);
  }

  // ─── GPU (보드 가장자리에 꽂힌 확장 카드 — 확대) ──────────────────────
  private buildGPU(): void {
    const gpuGroup = new THREE.Group();
    gpuGroup.userData = {
      isBuilding: true,
      buildingName: 'GPU (그래픽처리장치)',
      buildingTag: '화면을 그리는 전문 칩',
      buildingIcon: '🎮',
    };

    // 카드 본체 (보드에 수직으로 꽂힘 — 확대)
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 3.0, 3.5),
      new THREE.MeshStandardMaterial({ color: 0x7c4dff, roughness: 0.4, metalness: 0.4 }),
    );
    card.position.y = 1.5;
    card.castShadow = true;
    gpuGroup.add(card);

    // 금색 커넥터 (보드에 꽂히는 PCIe 핀)
    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.18, 2.5),
      new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.2, metalness: 0.9 }),
    );
    connector.position.set(0, 0.09, 0);
    gpuGroup.add(connector);

    // 팬
    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.08, 14),
      new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.5 }),
    );
    fan.position.set(0.22, 1.8, 0);
    fan.rotation.z = Math.PI / 2;
    gpuGroup.add(fan);

    // 화면 (GPU가 그리는 결과물)
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.2, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xb388ff, emissive: 0xb388ff, emissiveIntensity: 0.7 }),
    );
    screen.position.set(0.22, 1.8, 0);
    gpuGroup.add(screen);

    const gpuLabel = this.makeLabel('GPU (그래픽처리장치)', '화면을 그리는 전문 칩');
    gpuLabel.position.set(0, 4.2, 0);
    gpuGroup.add(gpuLabel);

    gpuGroup.position.set(-7, 0, 3);
    this.scene.add(gpuGroup);
    this.componentPositions['GPU (그래픽처리장치)'] = new THREE.Vector3(-7, 0, 3);
  }

  // ─── OS 영역 (메인보드 위 소프트웨어 레이어) ──────────────────────────
  private buildOSArea(): void {
    const osGroup = new THREE.Group();
    osGroup.userData = {
      isBuilding: true,
      buildingName: '운영체제 (OS)',
      buildingTag: '하드웨어를 관리하는 소프트웨어',
      buildingIcon: '💻',
    };

    // 반투명 파란색 영역 — OS가 상주하는 메모리 영역 시각화
    const osArea = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.08, 3.0),
      new THREE.MeshStandardMaterial({
        color: 0x2196f3, emissive: 0x2196f3, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.4,
      }),
    );
    osArea.position.y = 0.04;
    osGroup.add(osArea);

    // OS 영역 테두리
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0x42a5f5, emissive: 0x42a5f5, emissiveIntensity: 0.5,
    });
    const borders = [
      { s: [4.0, 0.06, 0.06] as [number, number, number], p: [0, 0.05, -1.5] as [number, number, number] },
      { s: [4.0, 0.06, 0.06] as [number, number, number], p: [0, 0.05, 1.5] as [number, number, number] },
      { s: [0.06, 0.06, 3.0] as [number, number, number], p: [-2.0, 0.05, 0] as [number, number, number] },
      { s: [0.06, 0.06, 3.0] as [number, number, number], p: [2.0, 0.05, 0] as [number, number, number] },
    ];
    for (const b of borders) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(...b.s), borderMat);
      m.position.set(...b.p);
      osGroup.add(m);
    }

    const osLabel = this.makeLabel('운영체제 (OS)', '하드웨어를 관리하는 소프트웨어');
    osLabel.position.set(0, 1.2, 0);
    osGroup.add(osLabel);

    osGroup.position.set(-7, 0, -4);
    this.scene.add(osGroup);
    this.componentPositions['운영체제 (OS)'] = new THREE.Vector3(-7, 0, -4);
  }

  // ─── PORTALS ───────────────────────────────────────────────────────────
  private buildPortals(): void {
    const toReal = new Portal({
      name: '실세계로 돌아가기',
      position: new THREE.Vector3(0, 0, -9),
      targetWorld: 'real-world',
      color: 0x8fae6e,
      subtitle: '클릭하여 실세계로 이동',
    });
    this.portals.push(toReal);
    this.scene.add(toReal.group);
    this.animatedObjects.push({ update: (t) => toReal.update(t) });

    const toNetwork = new Portal({
      name: '네트워크 월드',
      position: new THREE.Vector3(16, 0, -3),
      targetWorld: 'network',
      color: 0x00897b,
    });
    this.portals.push(toNetwork);
    this.scene.add(toNetwork.group);
    this.animatedObjects.push({ update: (t) => toNetwork.update(t) });
  }

  // ─── CHARACTERS ────────────────────────────────────────────────────────
  private buildCharacters(): void {
    const memHelper = new Character({
      name: '메모리 아줌마',
      color: 0x607d8b,
      hint: 'CPU가 데이터를 요청하면 항상 서류함에서 찾아요',
      position: new THREE.Vector3(5, 0, 3),
      path: [
        new THREE.Vector3(5, 0, 3),
        new THREE.Vector3(5, 0, -2),
        new THREE.Vector3(8, 0, -2),
        new THREE.Vector3(8, 0, 3),
      ],
      speed: 1.2,
    });
    this.characters.push(memHelper);
    this.scene.add(memHelper.group);
    this.animatedObjects.push({ update: (t) => memHelper.update(t) });
  }
}
