import * as THREE from 'three';

export interface BuildingOptions {
  name: string;
  tag: string;
  icon: string;
  position: THREE.Vector3;
  size: THREE.Vector3;
  color: number;
  roofColor?: number;
  windowColor?: number;
}

/**
 * Building은 월드 내의 개별 구조물입니다.
 * 클릭 가능하며, 설명 패널을 활성화할 수 있습니다.
 */
export class Building {
  readonly group: THREE.Group;
  readonly name: string;
  readonly tag: string;
  readonly icon: string;
  private label: THREE.Mesh | null = null;

  constructor(options: BuildingOptions) {
    this.name = options.name;
    this.tag = options.tag;
    this.icon = options.icon;
    this.group = new THREE.Group();
    this.group.userData = {
      buildingName: this.name,
      buildingTag: this.tag,
      buildingIcon: this.icon,
      isBuilding: true,
    };

    this.buildBody(options);
    this.buildLabel(options);
    this.group.position.copy(options.position);
  }

  private buildBody(options: BuildingOptions): void {
    const { size, color, roofColor, windowColor = 0x87ceeb } = options;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
    );
    body.position.y = size.y / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    if (roofColor) {
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(size.x * 0.75, size.y * 0.45, 4),
        new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6 }),
      );
      roof.position.y = size.y + size.y * 0.22;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      this.group.add(roof);
    }

    const door = new THREE.Mesh(
      new THREE.BoxGeometry(size.x * 0.25, size.y * 0.45, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x5d4037 }),
    );
    door.position.set(0, size.y * 0.22, size.z / 2 + 0.08);
    this.group.add(door);

    const winGeo = new THREE.BoxGeometry(size.x * 0.18, size.y * 0.18, 0.12);
    const winMat = new THREE.MeshStandardMaterial({
      color: windowColor,
      emissive: windowColor,
      emissiveIntensity: 0.4,
    });
    for (const xOff of [-size.x * 0.28, size.x * 0.28]) {
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(xOff, size.y * 0.6, size.z / 2 + 0.06);
      this.group.add(win);
    }
  }

  private buildLabel(options: BuildingOptions): void {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(options.name, 256, 70);

    ctx.font = '28px Arial';
    ctx.fillStyle = '#a0a0c0';
    ctx.fillText(options.tag, 256, 110);

    const texture = new THREE.CanvasTexture(c);
    this.label = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 0.75),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }),
    );
    this.label.position.set(0, options.size.y + 2.0, 0);
    this.label.rotation.x = -0.2;
    this.group.add(this.label);
  }
}
