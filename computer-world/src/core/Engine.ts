import * as THREE from 'three';

export class Engine {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly clock: THREE.Clock;
  private animationCallbacks: Array<(dt: number) => void> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 500);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.clock = new THREE.Clock();

    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.setupLighting();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupLighting(): void {
    const hemi = new THREE.HemisphereLight(0xbfe0ff, 0x6b6558, 0.95);
    this.scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xfff4dd, 1.35);
    dir.position.set(12, 25, 12);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 60;
    dir.shadow.camera.left = -40;
    dir.shadow.camera.right = 40;
    dir.shadow.camera.top = 40;
    dir.shadow.camera.bottom = -40;
    this.scene.add(dir);

    const fill = new THREE.DirectionalLight(0x6c5ce7, 0.22);
    fill.position.set(-10, 8, -10);
    this.scene.add(fill);
  }

  private handleResize(): void {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  onUpdate(callback: (dt: number) => void): void {
    this.animationCallbacks.push(callback);
  }

  start(): void {
    const loop = (): void => {
      requestAnimationFrame(loop);
      const dt = this.clock.getDelta();
      for (const cb of this.animationCallbacks) {
        cb(dt);
      }
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
