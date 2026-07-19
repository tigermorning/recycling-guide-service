import * as THREE from 'three';

export interface PortalOptions {
  name: string;
  position: THREE.Vector3;
  targetWorld: string;
  color?: number;
  subtitle?: string;
}

/**
 * Portal은 월드 간 이동을 가능하게 하는 구조물입니다.
 * 포털을 클릭하면 목표 월드로 전환됩니다.
 */
export class Portal {
  readonly group: THREE.Group;
  readonly name: string;
  readonly targetWorld: string;
  private glowMesh: THREE.Mesh;
  private pillarLeft: THREE.Mesh;
  private pillarRight: THREE.Mesh;
  private beam: THREE.Mesh;

  constructor(options: PortalOptions) {
    this.name = options.name;
    this.targetWorld = options.targetWorld;
    this.group = new THREE.Group();
    this.group.userData = {
      portalName: this.name,
      targetWorld: this.targetWorld,
      isPortal: true,
    };

    const color = options.color ?? 0x6c5ce7;
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x4a3f6b, roughness: 0.6 });

    this.pillarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 0.25), pillarMat);
    this.pillarLeft.position.set(-0.8, 1.4, 0);
    this.pillarLeft.castShadow = true;
    this.group.add(this.pillarLeft);

    this.pillarRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 0.25), pillarMat);
    this.pillarRight.position.set(0.8, 1.4, 0);
    this.pillarRight.castShadow = true;
    this.group.add(this.pillarRight);

    this.beam = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.25, 0.25), pillarMat);
    this.beam.position.set(0, 2.85, 0);
    this.beam.castShadow = true;
    this.group.add(this.beam);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gctx = glowCanvas.getContext('2d')!;
    const grad = gctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, '#e0d6ff');
    grad.addColorStop(0.5, `#${color.toString(16).padStart(6, '0')}`);
    grad.addColorStop(1, '#1a1030');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 128, 128);

    this.glowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 2.4),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(glowCanvas),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      }),
    );
    this.glowMesh.position.set(0, 1.4, 0);
    this.group.add(this.glowMesh);

    const label = this.makeLabel(options.name, color, options.subtitle);
    label.position.set(0, 3.5, 0);
    this.group.add(label);

    this.group.position.copy(options.position);
  }

  private makeLabel(text: string, color: number, subtitle?: string): THREE.Mesh {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 12);
    ctx.fill();

    const hex = `#${color.toString(16).padStart(6, '0')}`;
    ctx.strokeStyle = hex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 12);
    ctx.stroke();

    ctx.fillStyle = hex;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 58);

    ctx.font = '22px Arial';
    ctx.fillStyle = '#a0a0c0';
    ctx.fillText(subtitle ?? ' 클릭하여 이동', 256, 95);

    return new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 0.65),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
      }),
    );
  }

  update(t: number): void {
    const pulse = 0.7 + 0.3 * Math.sin(t * 2.0);
    (this.glowMesh.material as THREE.MeshBasicMaterial).opacity = pulse;
  }
}
