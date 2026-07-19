import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Portal } from '../portal/Portal.ts';

/**
 * 실세계 — 사용자가 앉아 있는 책상, 모니터, 컴퓨터 본체.
 * 여기서 시작하여 컴퓨터 안으로 들어갑니다.
 */
export class RealWorld extends World {
  private portals: Portal[] = [];
  private arrowMesh!: THREE.Mesh;
  private glowRing!: THREE.Mesh;

  constructor() {
    super('real-world', '실세계');
  }

  build(): void {
    this.buildEnvironment();
    this.buildDesk();
    this.buildPerson();
    this.buildPortal();
  }

  onEnter(): void {}

  update(t: number): void {
    super.update(t);
    if (this.arrowMesh) {
      this.arrowMesh.position.y = 4.2 + Math.sin(t * 3) * 0.2;
    }
    if (this.glowRing) {
      (this.glowRing.material as THREE.MeshBasicMaterial).opacity = 0.3 + 0.25 * Math.sin(t * 2);
    }
  }

  onExit(): void {}

  private buildEnvironment(): void {
    (this.scene as THREE.Scene).background = new THREE.Color(0x87ceeb);

    const ground = this.scene.getObjectByName('ground') as THREE.Mesh;
    if (ground) {
      ground.material = new THREE.MeshStandardMaterial({ color: 0x8fae6e, roughness: 0.9 });
    }

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9,
    });
    for (let i = 0; i < 5; i++) {
      const cloud = new THREE.Group();
      const puffs = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < puffs; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 8, 8), cloudMat);
        puff.position.set(j * 1.4 - puffs * 0.7, Math.random() * 0.4, Math.random() * 0.6);
        puff.scale.y = 0.6;
        cloud.add(puff);
      }
      cloud.position.set((Math.random() - 0.5) * 60, 18 + Math.random() * 8, (Math.random() - 0.5) * 60);
      cloud.scale.setScalar(1.0 + Math.random());
      this.scene.add(cloud);
    }

    this.addTree(-6, 0, -4);
    this.addTree(8, 0, -6);
    this.addTree(-4, 0, 6);
    this.addTree(10, 0, 5);
    this.addTree(-8, 0, 2);

    this.addLabel('실세계', '당신이 앉아 있는 곳', 3.5, new THREE.Vector3(0, 0, 0));
  }

  private buildDesk(): void {
    const deskGroup = new THREE.Group();

    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.6 }),
    );
    deskTop.position.y = 1.0;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    const legGeo = new THREE.BoxGeometry(0.15, 1.0, 0.15);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    for (const [x, z] of [[-1.7, -1.0], [-1.7, 1.0], [1.7, -1.0], [1.7, 1.0]]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.5, z);
      deskGroup.add(leg);
    }

    const monitorBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.3, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.4 }),
    );
    monitorBody.position.set(0, 1.85, -0.5);
    monitorBody.castShadow = true;
    deskGroup.add(monitorBody);

    const monitorScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.1, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x4fc3f7, emissive: 0x4fc3f7, emissiveIntensity: 0.6 }),
    );
    monitorScreen.position.set(0, 1.9, -0.42);
    deskGroup.add(monitorScreen);

    const monitorStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.5 }),
    );
    monitorStand.position.set(0, 1.15, -0.5);
    deskGroup.add(monitorStand);

    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4 }),
    );
    keyboard.position.set(0, 1.15, 0.5);
    deskGroup.add(keyboard);

    const pcCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.6, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.5, metalness: 0.3 }),
    );
    pcCase.position.set(2.8, 0.8, 0);
    pcCase.castShadow = true;
    pcCase.userData = {
      isPortal: true,
      portalName: '하드웨어 월드로 진입',
      targetWorld: 'hardware',
    };
    deskGroup.add(pcCase);

    const pcLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 1.0 }),
    );
    pcLed.position.set(2.8, 1.6, 0.91);
    deskGroup.add(pcLed);

    const pcSideWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.0, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x6c5ce7, emissive: 0x6c5ce7, emissiveIntensity: 0.8, transparent: true, opacity: 0.6 }),
    );
    pcSideWindow.position.set(2.43, 0.8, 0);
    deskGroup.add(pcSideWindow);

    const pcLabel = this.makeTextSprite('컴퓨터 본체', '👆 클릭하여 하드웨어 월드로 진입', 0x6c5ce7);
    pcLabel.position.set(2.8, 2.8, 0);
    deskGroup.add(pcLabel);

    const glowRingGeo = new THREE.RingGeometry(1.2, 1.5, 32);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0x6c5ce7, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthTest: false,
    });
    this.glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    this.glowRing.rotation.x = -Math.PI / 2;
    this.glowRing.position.set(2.8, 0.02, 0);
    deskGroup.add(this.glowRing);

    const arrowCanvas = document.createElement('canvas');
    arrowCanvas.width = 128; arrowCanvas.height = 128;
    const actx = arrowCanvas.getContext('2d')!;
    actx.fillStyle = '#6c5ce7';
    actx.beginPath();
    actx.moveTo(64, 10); actx.lineTo(100, 70); actx.lineTo(75, 70);
    actx.lineTo(75, 118); actx.lineTo(53, 118); actx.lineTo(53, 70);
    actx.lineTo(28, 70); actx.closePath(); actx.fill();
    this.arrowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(arrowCanvas), transparent: true, depthTest: false }),
    );
    this.arrowMesh.position.set(2.8, 4.2, 0);
    deskGroup.add(this.arrowMesh);

    deskGroup.position.set(0, 0, 0);
    this.scene.add(deskGroup);
  }

  private buildPerson(): void {
    const person = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.16, 0.6, 10),
      new THREE.MeshStandardMaterial({ color: 0x6c5ce7 }),
    );
    body.position.y = 0.5;
    body.castShadow = true;
    person.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffdbac }),
    );
    head.position.y = 0.95;
    head.castShadow = true;
    person.add(head);

    person.position.set(-0.5, 0, 2.5);
    person.rotation.y = Math.PI;
    this.scene.add(person);
  }

  private buildPortal(): void {
    const portal = new Portal({
      name: '하드웨어 월드',
      position: new THREE.Vector3(2.8, 0, 0),
      targetWorld: 'hardware',
      color: 0x6c5ce7,
    });
    portal.group.scale.setScalar(0.6);
    this.portals.push(portal);
    this.scene.add(portal.group);
    this.animatedObjects.push({ update: (t) => portal.update(t) });
  }

  private addTree(x: number, y: number, z: number): void {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 }),
    );
    trunk.position.set(x, y + 0.75, z);
    trunk.castShadow = true;
    this.scene.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 }),
    );
    leaves.position.set(x, y + 2.0, z);
    leaves.castShadow = true;
    this.scene.add(leaves);
  }

  private addLabel(name: string, tag: string, y: number, pos: THREE.Vector3): void {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath(); ctx.roundRect(8, 8, 496, 112, 12); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Arial'; ctx.textAlign = 'center';
    ctx.fillText(name, 256, 58);
    ctx.font = '22px Arial'; ctx.fillStyle = '#a0a0c0';
    ctx.fillText(tag, 256, 95);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 0.75),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide, depthTest: false }),
    );
    m.position.set(pos.x, y, pos.z);
    m.rotation.x = -0.2;
    m.renderOrder = 999;
    this.scene.add(m);
  }

  private makeTextSprite(title: string, subtitle: string, color: number): THREE.Mesh {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath(); ctx.roundRect(8, 8, 496, 112, 12); ctx.fill();
    const hex = `#${color.toString(16).padStart(6, '0')}`;
    ctx.strokeStyle = hex; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(8, 8, 496, 112, 12); ctx.stroke();
    ctx.fillStyle = hex; ctx.font = 'bold 32px Arial'; ctx.textAlign = 'center';
    ctx.fillText(title, 256, 55);
    ctx.font = '22px Arial'; ctx.fillStyle = '#a0a0c0';
    ctx.fillText(subtitle, 256, 95);
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.55),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide, depthTest: false }),
    );
  }
}
