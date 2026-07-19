import * as THREE from 'three';

export interface CharacterOptions {
  name: string;
  color: number;
  hint: string;
  position: THREE.Vector3;
  path: THREE.Vector3[];
  speed?: number;
}

export class Character {
  readonly group: THREE.Group;
  readonly name: string;
  private hint: string;
  private path: THREE.Vector3[];
  private speed: number;
  private pathIndex = 0;
  private pathProgress = 0;
  private headMesh!: THREE.Mesh;
  private labelMesh!: THREE.Mesh;
  private bubbleMesh: THREE.Mesh | null = null;
  private bubbleTimer = 0;

  constructor(options: CharacterOptions) {
    this.name = options.name;
    this.hint = options.hint;
    this.path = options.path;
    this.speed = options.speed ?? 1.5;

    this.group = new THREE.Group();
    this.group.userData = {
      isCharacter: true,
      characterName: this.name,
      characterHint: this.hint,
    };

    this.buildBody(options.color);
    this.buildLabel();
    this.group.position.copy(options.position);
  }

  private buildBody(color: number): void {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.16, 0.6, 10),
      new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
    );
    body.position.y = 0.5;
    body.castShadow = true;
    this.group.add(body);

    this.headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 }),
    );
    this.headMesh.position.y = 0.95;
    this.headMesh.castShadow = true;
    this.group.add(this.headMesh);

    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x37474f });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.08, 0.15, 0);
    this.group.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.08, 0.15, 0);
    this.group.add(rightLeg);
  }

  private buildLabel(): void {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 56, 8);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, 128, 40);

    const texture = new THREE.CanvasTexture(c);
    this.labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.3),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthTest: false }),
    );
    this.labelMesh.position.set(0, 1.5, 0);
    this.labelMesh.rotation.x = -0.2;
    this.labelMesh.renderOrder = 999;
    this.group.add(this.labelMesh);
  }

  showBubble(): void {
    if (this.bubbleMesh) return;

    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 16);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.hint, 256, 75);

    const texture = new THREE.CanvasTexture(c);
    this.bubbleMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 0.6),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthTest: false }),
    );
    this.bubbleMesh.position.set(0, 2.2, 0);
    this.bubbleMesh.rotation.x = -0.15;
    this.bubbleMesh.renderOrder = 1000;
    this.group.add(this.bubbleMesh);
    this.bubbleTimer = 0;
  }

  hideBubble(): void {
    if (this.bubbleMesh) {
      this.group.remove(this.bubbleMesh);
      this.bubbleMesh = null;
    }
  }

  update(t: number): void {
    if (this.path.length < 2) return;

    this.pathProgress += this.speed * 0.016;
    if (this.pathProgress >= 1) {
      this.pathProgress = 0;
      this.pathIndex = (this.pathIndex + 1) % this.path.length;
    }

    const from = this.path[this.pathIndex];
    const to = this.path[(this.pathIndex + 1) % this.path.length];
    this.group.position.lerpVectors(from, to, this.pathProgress);
    this.group.position.y = 0;

    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    if (dir.length() > 0.01) {
      this.group.rotation.y = Math.atan2(dir.x, dir.z);
    }

    this.headMesh.rotation.z = Math.sin(t * 3) * 0.1;

    if (this.bubbleMesh) {
      this.bubbleTimer += 0.016;
      if (this.bubbleTimer > 4) {
        this.hideBubble();
      }
    }
  }
}
