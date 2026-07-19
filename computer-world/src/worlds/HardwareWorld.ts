import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Building } from '../buildings/Building.ts';
import { Portal } from '../portal/Portal.ts';
import { upgradeMeshToPBR } from '../core/MaterialLibrary.ts';
import { Character } from '../characters/Character.ts';

/**
 * 하드웨어 월드 — CPU, RAM, 캐시, 저장장치, GPU, 메인보드가 있는 세계.
 * 컴퓨터의 물리적 구조를 탐험합니다.
 */
export class HardwareWorld extends World {
  private portals: Portal[] = [];
  private cpuIndicator!: THREE.Mesh;
  private characters: Character[] = [];

  constructor() {
    super('hardware', '하드웨어 월드');
  }

  build(): void {
    this.buildEnvironment();
    this.buildMotherboard();
    this.buildCPU();
    this.buildCache();
    this.buildRAM();
    this.buildStorage();
    this.buildGPU();
    this.buildOS();
    this.buildPortals();
    this.buildLabels();
    this.buildCharacters();

    this.scene.traverse(upgradeMeshToPBR);
  }

  onEnter(): void {}
  onExit(): void {}

  private buildEnvironment(): void {
    (this.scene as THREE.Scene).background = new THREE.Color(0xcfe8f0);
    (this.scene as THREE.Scene).fog = new THREE.Fog(0xcfe8f0, 45, 120);

    const ground = this.scene.getObjectByName('ground') as THREE.Mesh;
    if (ground) {
      ground.material = new THREE.MeshStandardMaterial({ color: 0x8fae6e, roughness: 0.9 });
    }

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9,
    });
    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Group();
      const puffs = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < puffs; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 8, 8), cloudMat);
        puff.position.set(j * 1.4 - puffs * 0.7, Math.random() * 0.4, Math.random() * 0.6);
        puff.scale.y = 0.6;
        cloud.add(puff);
      }
      cloud.position.set((Math.random() - 0.5) * 100, 20 + Math.random() * 10, (Math.random() - 0.5) * 100);
      cloud.scale.setScalar(1.2 + Math.random());
      this.scene.add(cloud);
    }

    this.buildRoads();
  }

  private buildRoads(): void {
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x59565f, roughness: 0.8 });

    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 0.02, -3),
      new THREE.Vector3(-8, 0.02, -3),
      new THREE.Vector3(0, 0.02, -3),
      new THREE.Vector3(8, 0.02, -3),
      new THREE.Vector3(20, 0.02, -3),
    ]);
    const mainRoad = new THREE.Mesh(new THREE.TubeGeometry(mainCurve, 30, 0.6, 8, false), roadMat);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);

    const crossCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.02, -12),
      new THREE.Vector3(0, 0.02, -3),
      new THREE.Vector3(0, 0.02, 4),
    ]);
    const crossRoad = new THREE.Mesh(new THREE.TubeGeometry(crossCurve, 20, 0.6, 8, false), roadMat);
    crossRoad.receiveShadow = true;
    this.scene.add(crossRoad);
  }

  private buildMotherboard(): void {
    const mbGroup = new THREE.Group();
    mbGroup.userData = {
      isBuilding: true,
      buildingName: '사무실 (메인보드)',
      buildingTag: '모든 부품이 연결되는 곳',
      buildingIcon: '🏢',
    };

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.1, 10),
      new THREE.MeshStandardMaterial({ color: 0x1a5c1a, roughness: 0.8 }),
    );
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    mbGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x9e9e9e, roughness: 0.6 });
    const walls = [
      { size: [14, 3, 0.15] as [number, number, number], pos: [0, 1.5, -5] as [number, number, number] },
      { size: [14, 3, 0.15] as [number, number, number], pos: [0, 1.5, 5] as [number, number, number] },
      { size: [0.15, 3, 10] as [number, number, number], pos: [-7, 1.5, 0] as [number, number, number] },
      { size: [0.15, 3, 4] as [number, number, number], pos: [7, 1.5, -3] as [number, number, number] },
      { size: [0.15, 3, 4] as [number, number, number], pos: [7, 1.5, 3] as [number, number, number] },
    ];
    for (const w of walls) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(...w.size), wallMat);
      wall.position.set(...w.pos);
      wall.castShadow = true;
      wall.receiveShadow = true;
      mbGroup.add(wall);
    }

    const mbLabel = this.makeTextLabel('사무실 (메인보드)', '모든 부품이 연결되는 건물');
    mbLabel.position.set(0, 4.0, -5.5);
    mbGroup.add(mbLabel);

    mbGroup.position.set(-2, 0, 0);
    this.scene.add(mbGroup);
  }

  private buildCPU(): void {
    const cpuGroup = new THREE.Group();
    cpuGroup.userData = {
      isBuilding: true,
      buildingName: '책상 (CPU)',
      buildingTag: '중앙처리장치 · 모든 계산이 일어나는 곳',
      buildingIcon: '🖥️',
    };

    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.2, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.6 }),
    );
    deskTop.position.y = 1.0;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    cpuGroup.add(deskTop);

    const legGeo = new THREE.BoxGeometry(0.15, 1.0, 0.15);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    for (const [x, z] of [[-1.5, -0.9], [-1.5, 0.9], [1.5, -0.9], [1.5, 0.9]]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.5, z);
      cpuGroup.add(leg);
    }

    const monitorBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.2, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.4 }),
    );
    monitorBody.position.set(0, 1.8, 0);
    monitorBody.castShadow = true;
    cpuGroup.add(monitorBody);

    const monitorScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.0, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x4fc3f7, emissive: 0x4fc3f7, emissiveIntensity: 0.6 }),
    );
    monitorScreen.position.set(0, 1.85, 0.08);
    cpuGroup.add(monitorScreen);

    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4 }),
    );
    keyboard.position.set(0, 1.15, 0.7);
    cpuGroup.add(keyboard);

    this.cpuIndicator = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.05, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.8 }),
    );
    this.cpuIndicator.position.set(0, 1.2, -0.5);
    cpuGroup.add(this.cpuIndicator);

    cpuGroup.position.set(-4, 0, 0);
    this.scene.add(cpuGroup);

    this.animatedObjects.push({
      update: (t) => { this.cpuIndicator.rotation.y = t * 2.0; },
    });
  }

  private buildCache(): void {
    const cacheGroup = new THREE.Group();
    cacheGroup.userData = {
      isBuilding: true,
      buildingName: '책상 위 서랍 (캐시)',
      buildingTag: 'CPU 바로 옆 · 가장 빠름',
      buildingIcon: '📦',
    };

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.6, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xa1887f, roughness: 0.6 }),
    );
    body.position.y = 0.3;
    cacheGroup.add(body);

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffd93d, roughness: 0.4, metalness: 0.6 }),
    );
    handle.position.set(0, 0.3, 0.42);
    cacheGroup.add(handle);

    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.15, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 0.5, transparent: true, opacity: 0.6 }),
    );
    glow.position.set(0, 0.3, 0);
    cacheGroup.add(glow);

    cacheGroup.position.set(-4, 1.2, 0);
    this.scene.add(cacheGroup);
  }

  private buildRAM(): void {
    const ram = new Building({
      name: '서류함 (RAM)',
      tag: '임시 기억 · 부르면 바로',
      icon: '🗄️',
      position: new THREE.Vector3(-1, 0, 0),
      size: new THREE.Vector3(1.5, 2.0, 1.0),
      color: 0x78909c,
    });
    this.scene.add(ram.group);

    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 1.0 }),
    );
    led.position.set(0, 2.0, 0.52);
    ram.group.add(led);

    this.animatedObjects.push({
      update: (t) => { led.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 3.0); },
    });
  }

  private buildStorage(): void {
    const storage = new Building({
      name: '창고 (저장장치)',
      tag: '장기 기억 · 영구 보관',
      icon: '🏭',
      position: new THREE.Vector3(-4, 0, 6),
      size: new THREE.Vector3(3.0, 2.5, 2.5),
      color: 0x5d4037,
      roofColor: 0x3e2723,
    });
    this.scene.add(storage.group);
  }

  private buildGPU(): void {
    const gpu = new Building({
      name: '그래픽 공방 (GPU)',
      tag: '화면을 그리는 전문가',
      icon: '🎮',
      position: new THREE.Vector3(-10, 0, 3),
      size: new THREE.Vector3(2, 2.5, 2),
      color: 0x7c4dff,
      roofColor: 0x651fff,
    });
    this.scene.add(gpu.group);

    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.0, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xb388ff, emissive: 0xb388ff, emissiveIntensity: 0.7 }),
    );
    screen.position.set(0, 1.5, 1.04);
    gpu.group.add(screen);
  }

  private buildOS(): void {
    const os = new Building({
      name: '경비실 (OS)',
      tag: '운영체제 · 모든 출입을 관리',
      icon: '🏢',
      position: new THREE.Vector3(6, 0, 0),
      size: new THREE.Vector3(2.5, 2.2, 2),
      color: 0x1a237e,
      roofColor: 0x0d47a1,
    });
    this.scene.add(os.group);
  }

  private buildPortals(): void {
    const toReal = new Portal({
      name: '실세계로 돌아가기',
      position: new THREE.Vector3(0, 0, -6),
      targetWorld: 'real-world',
      color: 0x8fae6e,
    });
    this.portals.push(toReal);
    this.scene.add(toReal.group);
    this.animatedObjects.push({ update: (t) => toReal.update(t) });

    const toNetwork = new Portal({
      name: '네트워크 월드',
      position: new THREE.Vector3(14, 0, -3),
      targetWorld: 'network',
      color: 0x00897b,
    });
    this.portals.push(toNetwork);
    this.scene.add(toNetwork.group);
    this.animatedObjects.push({ update: (t) => toNetwork.update(t) });
  }

  private buildLabels(): void {
    this.addBuildingLabel('CPU', -4, 3.5, 0);
    this.addBuildingLabel('캐시', -4, 2.5, 0);
    this.addBuildingLabel('RAM', -1, 3.0, 0);
    this.addBuildingLabel('저장장치', -4, 3.5, 6);
    this.addBuildingLabel('GPU', -10, 3.5, 3);
    this.addBuildingLabel('OS', 6, 3.5, 0);
  }

  private addBuildingLabel(text: string, x: number, y: number, z: number): void {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.beginPath(); ctx.roundRect(4, 4, 248, 56, 8); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center';
    ctx.fillText(text, 128, 40);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.rotation.x = -0.2;
    this.scene.add(m);
  }

  private buildCharacters(): void {
    const memHelper = new Character({
      name: '메모리 아줌마',
      color: 0x607d8b,
      hint: 'CPU가 데이터를 요청하면 항상 서류함에서 찾아요',
      position: new THREE.Vector3(-1, 0, 2),
      path: [
        new THREE.Vector3(-1, 0, 2),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(2, 0, -1),
        new THREE.Vector3(2, 0, 2),
      ],
      speed: 1.2,
    });
    this.characters.push(memHelper);
    this.scene.add(memHelper.group);
    this.animatedObjects.push({ update: (t) => memHelper.update(t) });
  }

  private makeTextLabel(title: string, subtitle: string): THREE.Mesh {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath(); ctx.roundRect(8, 8, 496, 112, 12); ctx.fill();
    ctx.strokeStyle = '#2d5a2d'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(8, 8, 496, 112, 12); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Arial'; ctx.textAlign = 'center';
    ctx.fillText(title, 256, 55);
    ctx.font = '22px Arial'; ctx.fillStyle = '#a0c0a0';
    ctx.fillText(subtitle, 256, 95);
    return new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 0.9),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide, depthTest: false }),
    );
  }
}
