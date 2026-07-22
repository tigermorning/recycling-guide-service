import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Building } from '../buildings/Building.ts';
import { Portal } from '../portal/Portal.ts';
import { upgradeMeshToPBR } from '../core/MaterialLibrary.ts';
import { DataFlow } from '../flow/DataFlow.ts';
import { Character } from '../characters/Character.ts';

/**
 * 네트워크 월드 — 실제 컴퓨터 네트워킹 아키텍처를 반영.
 *
 * 레이아웃:
 *
 *   [-15]      [-10]       [0]        [10]       [15]
 *     |          |          |          |          |
 *     |   DNS    |  ROUTER  | FIREWALL |   NIC    | HW 포털
 *     |   HTTP   |          |   WALL   | Browser  | Real 포털
 *     |   HTTPS  |          |          | DNS Cache|
 *     |          |          |          | OS Stack |
 *     |          |          |          |          |
 *     | EXTERNAL |          |          | INTERNAL |
 *     | INTERNET |          |          | NETWORK  |
 *     | (비신뢰)  |          |          | (신뢰)    |
 *
 *   흐름: Real World → Hardware World → Internal Network → Firewall → External Internet
 */
export class NetworkWorld extends World {
  private portals: Portal[] = [];
  private routerLeds: THREE.Mesh[] = [];
  private dataFlow: DataFlow;
  private characters: Character[] = [];
  private connectionLines: THREE.Line[] = [];
  private firewallGate: THREE.Group | null = null;
  private guardCharacter: Character | null = null;

  constructor() {
    super('network', '네트워크 월드');
    this.dataFlow = new DataFlow(this.scene);
  }

  build(): void {
    this.buildEnvironment();
    this.buildTrustZones();
    this.buildExternalInternet();
    this.buildFirewallBoundary();
    this.buildInternalNetwork();
    this.buildConnectionLines();
    this.buildPortals();
    this.buildCharacters();

    this.animatedObjects.push({ update: (t) => this.dataFlow.update(t) });

    this.scene.traverse(upgradeMeshToPBR);
  }

  onEnter(): void {
    this.dataFlow.start();
  }
  onExit(): void {
    this.dataFlow.stop();
  }

  private buildEnvironment(): void {
    (this.scene as THREE.Scene).background = new THREE.Color(0xcfe8f0);
    (this.scene as THREE.Scene).fog = new THREE.Fog(0xcfe8f0, 50, 130);

    const ground = this.scene.getObjectByName('ground') as THREE.Mesh;
    if (ground) {
      ground.material = new THREE.MeshStandardMaterial({ color: 0x8fae6e, roughness: 0.9 });
    }

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x59565f, roughness: 0.8 });
    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, 0.02, 0),
      new THREE.Vector3(-5, 0.02, 0),
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(5, 0.02, 0),
      new THREE.Vector3(15, 0.02, 0),
    ]);
    const mainRoad = new THREE.Mesh(new THREE.TubeGeometry(mainCurve, 30, 0.8, 8, false), roadMat);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);
  }

  // ─── TRUST ZONES ─────────────────────────────────────────────────────
  private buildTrustZones(): void {
    const zoneLabelFont = 'bold 48px Arial';
    const zoneSubFont = '28px Arial';

    // EXTERNAL INTERNET ZONE (left side) — untrusted
    const internetLabel = this.createZoneLabel(
      'EXTERNAL INTERNET',
      '외부 네트워크 (비신뢰 구간)',
      zoneLabelFont,
      zoneSubFont,
      0xff5252,
    );
    internetLabel.position.set(-10, 7.5, -8);
    this.scene.add(internetLabel);

    // INTERNAL NETWORK ZONE (right side) — trusted
    const internalLabel = this.createZoneLabel(
      'INTERNAL NETWORK',
      '내 컴퓨터 (신뢰 구간)',
      zoneLabelFont,
      zoneSubFont,
      0x00e676,
    );
    internalLabel.position.set(10, 7.5, -8);
    this.scene.add(internalLabel);

    // Visual boundary lines (dashed)
    this.createBoundaryLine(-4, 0.05, -8, -4, 0.05, 8, 0xff5252, 0.5);
    this.createBoundaryLine(4, 0.05, -8, 4, 0.05, 8, 0x00e676, 0.5);
  }

  private createZoneLabel(
    title: string,
    subtitle: string,
    titleFont: string,
    subFont: string,
    color: number,
  ): THREE.Mesh {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 160;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 144, 16);
    ctx.fill();

    const hexColor = '#' + new THREE.Color(color).getHexString();
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 144, 16);
    ctx.stroke();

    ctx.fillStyle = hexColor;
    ctx.font = titleFont;
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 70);

    ctx.font = subFont;
    ctx.fillStyle = '#c0c0c0';
    ctx.fillText(subtitle, 256, 120);

    return new THREE.Mesh(
      new THREE.PlaneGeometry(5.0, 1.6),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
      }),
    );
  }

  private createBoundaryLine(
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number,
    color: number,
    opacity: number,
  ): void {
    const material = new THREE.LineDashedMaterial({
      color,
      dashSize: 0.5,
      gapSize: 0.3,
      transparent: true,
      opacity,
    });
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ]);
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);
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

  // ─── EXTERNAL INTERNET (Untrusted) ───────────────────────────────────
  private buildExternalInternet(): void {
    // DNS Server (public)
    const dns = new Building({
      name: 'DNS (이름서버)',
      tag: '이름을 주소로 변환하는 서버',
      icon: '📍',
      position: new THREE.Vector3(-10, 0, 3),
      size: new THREE.Vector3(1.8, 2.4, 1.8),
      color: 0x1565c0,
      roofColor: 0x0d47a1,
    });
    this.scene.add(dns.group);

    // HTTP Server (public)
    const http = new Building({
      name: 'HTTP (규약)',
      tag: '웹 데이터를 전송하는 통신 규칙',
      icon: '📜',
      position: new THREE.Vector3(-10, 0, -3),
      size: new THREE.Vector3(1.8, 2.4, 0.5),
      color: 0xfafafa,
      windowColor: 0x90a4ae,
    });
    this.scene.add(http.group);

    // HTTPS Server (public, encrypted)
    const httpsGroup = this.createHTTPSServer();
    httpsGroup.position.set(-14, 0, 0);
    this.scene.add(httpsGroup);
  }

  private createHTTPSServer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = {
      isBuilding: true,
      buildingName: 'HTTPS (보안규약)',
      buildingTag: '암호화된 웹 데이터 전송 규칙',
      buildingIcon: '🔒',
    };

    // Document base
    const doc = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.2, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.7 }),
    );
    doc.position.y = 1.3;
    doc.castShadow = true;
    group.add(doc);

    // Text lines
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae });
    for (let i = 0; i < 5; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.06, 0.01),
        lineMat,
      );
      line.position.set(0, 2.0 - i * 0.2, 0.21);
      group.add(line);
    }

    // Padlock body (green)
    const lockBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.4, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x00c853, roughness: 0.4 }),
    );
    lockBody.position.set(0, 3.2, 0);
    group.add(lockBody);

    // Padlock U-shackle
    const shackleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 3.4, 0),
      new THREE.Vector3(-0.15, 3.7, 0),
      new THREE.Vector3(0.15, 3.7, 0),
      new THREE.Vector3(0.15, 3.4, 0),
    ]);
    const shackle = new THREE.Mesh(
      new THREE.TubeGeometry(shackleCurve, 12, 0.04, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x00c853, roughness: 0.3 }),
    );
    group.add(shackle);

    // Keyhole
    const keyhole = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0x004d40 }),
    );
    keyhole.position.set(0, 3.2, 0.11);
    group.add(keyhole);

    // Green glow indicator
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0x00e676,
        emissive: 0x00e676,
        emissiveIntensity: 0.9,
      }),
    );
    glow.position.set(0, 3.9, 0);
    group.add(glow);

    this.animatedObjects.push({
      update: (t) => {
        (glow.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.5 + 0.5 * Math.sin(t * 2);
      },
    });

    const label = this.makeLabel('HTTPS (보안규약)', '암호화된 보안 전송');
    label.position.set(0, 4.5, 0);
    group.add(label);

    return group;
  }

  // ─── FIREWALL BOUNDARY ───────────────────────────────────────────────
  private buildFirewallBoundary(): void {
    // Router (at boundary)
    this.buildRouter();

    // Firewall Wall
    this.buildFirewallWall();
  }

  private buildRouter(): void {
    const routerGroup = new THREE.Group();
    routerGroup.userData = {
      isBuilding: true,
      buildingName: '라우터 (공유기)',
      buildingTag: '데이터 경로를 결정하는 장치',
      buildingIcon: '🚦',
    };

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.8 }),
    );
    disc.position.y = 0.1;
    disc.castShadow = true;
    disc.receiveShadow = true;
    routerGroup.add(disc);

    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 0.26, 32),
      new THREE.MeshStandardMaterial({ color: 0x66bb6a, roughness: 0.8 }),
    );
    inner.position.y = 0.13;
    routerGroup.add(inner);

    for (let i = 0; i < 6; i++) {
      const bush = new THREE.Mesh(
        new THREE.SphereGeometry(0.16 + Math.random() * 0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x3d8b40, roughness: 0.9 }),
      );
      const a = (i / 6) * Math.PI * 2;
      bush.position.set(Math.sin(a) * 0.6, 0.35, Math.cos(a) * 0.6);
      routerGroup.add(bush);
    }

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 }),
    );
    pole.position.set(0, 1.6, 0);
    pole.castShadow = true;
    routerGroup.add(pole);

    const house = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.6, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x222222 }),
    );
    house.position.set(0, 3.5, 0);
    routerGroup.add(house);

    const ledColors = [0xff1744, 0xffd600, 0x00e676];
    ledColors.forEach((col, i) => {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9 }),
      );
      led.position.set(0, 3.7 - i * 0.18, 0.11);
      routerGroup.add(led);
      this.routerLeds.push(led);
    });

    const orbitDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd600, emissive: 0xffd600, emissiveIntensity: 1.0 }),
    );
    orbitDot.position.set(1.7, 0.32, 0);
    routerGroup.add(orbitDot);

    this.animatedObjects.push({
      update: (t) => {
        orbitDot.position.set(Math.sin(t * 0.8) * 1.7, 0.32, Math.cos(t * 0.8) * 1.7);
        this.routerLeds.forEach((led, i) => {
          (led.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 2.5 + i * 2.1);
        });
      },
    });

    routerGroup.position.set(0, 0, 0);
    this.scene.add(routerGroup);

    const routerLabel = this.makeLabel('라우터 (공유기)', '데이터 경로를 결정하는 장치');
    routerLabel.position.set(0, 5.0, 0);
    this.scene.add(routerLabel);
  }

  private buildFirewallWall(): void {
    this.firewallGate = new THREE.Group();
    this.firewallGate.userData = {
      isBuilding: true,
      buildingName: '방화벽 (화재벽)',
      buildingTag: '보안 위협을 차단하는 보안 장치',
      buildingIcon: '🛡️',
    };

    // Main wall spanning across
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.6 });
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 4, 16),
      wallMat,
    );
    wall.position.set(0, 2, 0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    this.firewallGate.add(wall);

    // Gateway arch
    const archMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.5 });
    const archLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 0.8), archMat);
    archLeft.position.set(0, 2.25, -2);
    archLeft.castShadow = true;
    this.firewallGate.add(archLeft);

    const archRight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 0.8), archMat);
    archRight.position.set(0, 2.25, 2);
    archRight.castShadow = true;
    this.firewallGate.add(archRight);

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 5.6), archMat);
    archTop.position.set(0, 4.4, 0);
    archTop.castShadow = true;
    this.firewallGate.add(archTop);

    // Shield emblem
    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffd600,
        emissive: 0xffd600,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      }),
    );
    shield.position.set(0, 5.2, 0);
    this.firewallGate.add(shield);

    // Pulsing red warning light
    const warnLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
      }),
    );
    warnLight.position.set(0, 5.0, 0);
    this.firewallGate.add(warnLight);

    this.animatedObjects.push({
      update: (t) => {
        (warnLight.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.5 + 0.5 * Math.sin(t * 3);
      },
    });

    // Firewall label
    const fwLabel = this.makeLabel('방화벽 (Firewall)', '보안 경비원 — 출입 통제');
    fwLabel.position.set(0, 6.5, 0);
    this.firewallGate.add(fwLabel);

    this.firewallGate.position.set(0, 0, 0);
    this.scene.add(this.firewallGate);
  }

  // ─── INTERNAL NETWORK (Trusted - My Computer) ────────────────────────
  private buildInternalNetwork(): void {
    // Network Interface Card (NIC)
    this.buildNIC();

    // Browser/Client
    this.buildBrowser();

    // Local DNS Cache
    this.buildDNSCache();

    // OS Network Stack
    this.buildNetworkStack();
  }

  private buildNIC(): void {
    const nic = new Building({
      name: '네트워크 인터페이스 (NIC)',
      tag: '컴퓨터의 네트워크 연결점',
      icon: '🌐',
      position: new THREE.Vector3(8, 0, 0),
      size: new THREE.Vector3(1.5, 1.0, 0.8),
      color: 0x1b5e20,
      roofColor: 0x0d47a1,
    });
    this.scene.add(nic.group);
  }

  private buildBrowser(): void {
    const browserGroup = new THREE.Group();
    browserGroup.userData = {
      isBuilding: true,
      buildingName: '웹 브라우저',
      buildingTag: '인터넷에 접속하는 클라이언트 프로그램',
      buildingIcon: '🌍',
    };

    // Browser window frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.7 }),
    );
    frame.position.y = 1.0;
    frame.castShadow = true;
    browserGroup.add(frame);

    // Screen
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.2, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0x2196f3,
        emissive: 0x2196f3,
        emissiveIntensity: 0.3,
      }),
    );
    screen.position.set(0, 1.1, 0.16);
    browserGroup.add(screen);

    // URL bar
    const urlBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.15, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
    );
    urlBar.position.set(0, 1.65, 0.16);
    browserGroup.add(urlBar);

    const label = this.makeLabel('웹 브라우저', 'HTTP/HTTPS 요청 전송');
    label.position.set(0, 3.0, 0);
    browserGroup.add(label);

    browserGroup.position.set(12, 0, -3);
    this.scene.add(browserGroup);
  }

  private buildDNSCache(): void {
    const cacheGroup = new THREE.Group();
    cacheGroup.userData = {
      isBuilding: true,
      buildingName: '로컬 DNS 캐시',
      buildingTag: '자주 방문한 사이트의 주소를 임시 보관',
      buildingIcon: '💾',
    };

    // Cache box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.2, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x7b1fa2, roughness: 0.6 }),
    );
    box.position.y = 0.8;
    box.castShadow = true;
    cacheGroup.add(box);

    // Cache indicator lights
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0x00e676,
      emissive: 0x00e676,
      emissiveIntensity: 0.8,
    });
    for (let i = 0; i < 3; i++) {
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        lightMat,
      );
      light.position.set(-0.4 + i * 0.4, 1.5, 0.51);
      cacheGroup.add(light);
    }

    const label = this.makeLabel('로컬 DNS 캐시', 'DNS 결과 임시 보관');
    label.position.set(0, 2.8, 0);
    cacheGroup.add(label);

    cacheGroup.position.set(12, 0, 3);
    this.scene.add(cacheGroup);
  }

  private buildNetworkStack(): void {
    const stackGroup = new THREE.Group();
    stackGroup.userData = {
      isBuilding: true,
      buildingName: '운영체제 네트워크 스택',
      buildingTag: '네트워크 통신을 관리하는 OS 내부 모듈',
      buildingIcon: '⚙️',
    };

    // Stack layers
    const layers = [
      { color: 0x4caf50, y: 0.3, label: 'Application' },
      { color: 0x2196f3, y: 0.7, label: 'Transport (TCP/UDP)' },
      { color: 0xff9800, y: 1.1, label: 'Network (IP)' },
      { color: 0xf44336, y: 1.5, label: 'Link (Ethernet)' },
    ];

    layers.forEach((layer) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.3, 1.0),
        new THREE.MeshStandardMaterial({ color: layer.color, roughness: 0.6 }),
      );
      mesh.position.y = layer.y;
      mesh.castShadow = true;
      stackGroup.add(mesh);
    });

    const label = this.makeLabel('OS 네트워크 스택', '네트워크 통신 계층 관리');
    label.position.set(0, 3.0, 0);
    stackGroup.add(label);

    stackGroup.position.set(8, 0, 4);
    this.scene.add(stackGroup);
  }

  // ─── CONNECTION LINES ─────────────────────────────────────────────────
  private buildConnectionLines(): void {
    // Internal NIC → Router
    this.createFlowLine(
      new THREE.Vector3(8, 0.5, 0),
      new THREE.Vector3(0, 0.5, 0),
      0x00e676,
    );

    // Router → External DNS
    this.createFlowLine(
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(-10, 0.5, 3),
      0x4fc3f7,
    );

    // Router → External HTTP
    this.createFlowLine(
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(-10, 0.5, -3),
      0x69f0ae,
    );

    // Router → External HTTPS
    this.createFlowLine(
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(-14, 0.5, 0),
      0x00e676,
    );

    // Internal connections
    this.createFlowLine(
      new THREE.Vector3(8, 0.5, 0),
      new THREE.Vector3(12, 0.5, -3),
      0x2196f3,
    );
    this.createFlowLine(
      new THREE.Vector3(8, 0.5, 0),
      new THREE.Vector3(12, 0.5, 3),
      0x7b1fa2,
    );
    this.createFlowLine(
      new THREE.Vector3(8, 0.5, 0),
      new THREE.Vector3(8, 0.5, 4),
      0xff9800,
    );
  }

  private createFlowLine(
    start: THREE.Vector3,
    end: THREE.Vector3,
    color: number,
  ): void {
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
    });
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.connectionLines.push(line);
  }

  // ─── CHARACTERS ───────────────────────────────────────────────────────
  private buildCharacters(): void {
    this.guardCharacter = new Character({
      name: '보안 경비원',
      color: 0xc62828,
      hint: '허가되지 않은 요청은 내가 막아요',
      position: new THREE.Vector3(2, 0, 2),
      path: [
        new THREE.Vector3(2, 0, 2),
        new THREE.Vector3(2, 0, -2),
        new THREE.Vector3(-2, 0, -2),
        new THREE.Vector3(-2, 0, 2),
      ],
      speed: 1.0,
    });
    this.characters.push(this.guardCharacter);
    this.scene.add(this.guardCharacter.group);
    this.animatedObjects.push({ update: (t) => this.guardCharacter!.update(t) });
  }

  // ─── PORTALS (Internal Network side) ─────────────────────────────────
  private buildPortals(): void {
    const toHardware = new Portal({
      name: '하드웨어 월드',
      position: new THREE.Vector3(14, 0, -6),
      targetWorld: 'hardware',
      color: 0x6c5ce7,
    });
    this.portals.push(toHardware);
    this.scene.add(toHardware.group);
    this.animatedObjects.push({ update: (t) => toHardware.update(t) });

    const toReal = new Portal({
      name: '실세계로 돌아가기',
      position: new THREE.Vector3(14, 0, 6),
      targetWorld: 'real-world',
      color: 0x8fae6e,
    });
    this.portals.push(toReal);
    this.scene.add(toReal.group);
    this.animatedObjects.push({ update: (t) => toReal.update(t) });
  }
}
