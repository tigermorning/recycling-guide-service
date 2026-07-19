import * as THREE from 'three';

/**
 * World는 하나의 추상화 레이어를 나타내는 3D 씬입니다.
 * 각 월드는 자체적인 빌딩, 포털, 애니메이션을 가집니다.
 */
export abstract class World {
  readonly scene: THREE.Scene;
  readonly name: string;
  readonly displayName: string;
  protected buildings: THREE.Group[] = [];
  protected animatedObjects: Array<{ update: (t: number) => void }> = [];

  constructor(name: string, displayName: string) {
    this.scene = new THREE.Scene();
    this.name = name;
    this.displayName = displayName;
    this.setupGround();
  }

  private setupGround(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    ground.name = 'ground';
    this.scene.add(ground);
  }

  /** 월드의 모든 3D 객체를 생성합니다. */
  abstract build(): void;

  /** 월드에 진입할 때 호출됩니다. */
  abstract onEnter(): void;

  /** 월드에서 나갈 때 호출됩니다. */
  abstract onExit(): void;

  /** 매 프레임마다 호출됩니다. */
  update(t: number): void {
    for (const obj of this.animatedObjects) {
      obj.update(t);
    }
  }

  dispose(): void {
    this.scene.clear();
    this.buildings = [];
    this.animatedObjects = [];
  }
}
