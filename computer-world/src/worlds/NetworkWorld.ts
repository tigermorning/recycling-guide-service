import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Building } from '../buildings/Building.ts';
import { Portal } from '../portal/Portal.ts';
import { upgradeMeshToPBR } from '../core/MaterialLibrary.ts';
import { DataFlow } from '../flow/DataFlow.ts';
import { Character } from '../characters/Character.ts';

/**
 * 네트워크 월드 — DNS, 라우터, 방화벽, HTTP 등 네트워크 개념.
 * 정보 흐름 시스템의 핵심 경로입니다.
 */
export class NetworkWorld extends World {
  private portals: Portal[] = [];
  private routerLeds: THREE.Mesh[] = [];
  private dataFlow: DataFlow;
  private characters: Character[] = [];

  constructor() {
    super('network', '네트워크 월드');
    this.dataFlow = new DataFlow(this.scene);
  }

  build(): void {
    this.buildEnvironment();
    this.buildDNS();
    this.buildRouter();
    this.buildFirewall();
    this.buildHTTP();
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

  private buildDNS(): void {
    const dns = new Building({
      name: '우체국 (DNS)',
      tag: '이름 → 주소 변환',
      icon: '📍',
      position: new THREE.Vector3(-8, 0, 3),
      size: new THREE.Vector3(1.5, 2.0, 1.5),
      color: 0x1565c0,
      roofColor: 0x0d47a1,
    });
    this.scene.add(dns.group);
  }

  private buildRouter(): void {
    const routerGroup = new THREE.Group();
    routerGroup.userData = {
      isBuilding: true,
      buildingName: '교차로 (라우터)',
      buildingTag: '데이터 경로 결정',
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
  }

  private buildFirewall(): void {
    const fw = new Building({
      name: '문 (방화벽)',
      tag: '보안 · 출입 통제',
      icon: '🛡️',
      position: new THREE.Vector3(8, 0, 0),
      size: new THREE.Vector3(2.0, 2.8, 0.5),
      color: 0xc62828,
    });
    this.scene.add(fw.group);
  }

  private buildHTTP(): void {
    const http = new Building({
      name: 'HTTP (데이터 전송)',
      tag: '데이터 전송 규칙',
      icon: '📜',
      position: new THREE.Vector3(0, 0, 6),
      size: new THREE.Vector3(1.5, 2.0, 0.5),
      color: 0xfafafa,
      windowColor: 0x90a4ae,
    });
    this.scene.add(http.group);
  }

  private buildCharacters(): void {
    const guard = new Character({
      name: '보안 경비원',
      color: 0xc62828,
      hint: '허가되지 않은 요청은 내가 막아요',
      position: new THREE.Vector3(8, 0, 2),
      path: [
        new THREE.Vector3(8, 0, 2),
        new THREE.Vector3(8, 0, -2),
        new THREE.Vector3(4, 0, -2),
        new THREE.Vector3(4, 0, 2),
      ],
      speed: 1.0,
    });
    this.characters.push(guard);
    this.scene.add(guard.group);
    this.animatedObjects.push({ update: (t) => guard.update(t) });
  }

  private buildPortals(): void {
    const toHardware = new Portal({
      name: '하드웨어 월드',
      position: new THREE.Vector3(-14, 0, 0),
      targetWorld: 'hardware',
      color: 0x6c5ce7,
    });
    this.portals.push(toHardware);
    this.scene.add(toHardware.group);
    this.animatedObjects.push({ update: (t) => toHardware.update(t) });
  }
}
