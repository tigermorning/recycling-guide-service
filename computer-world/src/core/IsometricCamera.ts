import * as THREE from 'three';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

interface CameraState {
  target: THREE.Vector3;
  zoom: number;
  angleX: number;
  angleY: number;
  readonly MIN_ZOOM: number;
  readonly MAX_ZOOM: number;
  readonly MIN_ANGLE_Y: number;
  readonly MAX_ANGLE_Y: number;
}

export class IsometricCamera {
  readonly camera: THREE.PerspectiveCamera;
  private state: CameraState;
  private goal: CameraState;
  private isTransitioning = false;
  private transitionDuration = 0;
  private transitionElapsed = 0;
  private transitionFrom = {
    target: new THREE.Vector3(),
    zoom: 1,
    angleX: 0,
    angleY: 0,
  };

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.state = {
      target: new THREE.Vector3(0, 0, 0),
      zoom: 25,
      angleX: Math.PI / 4,
      angleY: Math.PI / 4,
      MIN_ZOOM: 8,
      MAX_ZOOM: 60,
      MIN_ANGLE_Y: 0.2,
      MAX_ANGLE_Y: Math.PI / 2 - 0.1,
    };
    this.goal = { ...this.state };
    this.apply();
  }

  private apply(): void {
    const dist = this.state.zoom;
    const sinY = Math.sin(this.state.angleY);
    const cosY = Math.cos(this.state.angleY);
    const sinX = Math.sin(this.state.angleX);
    const cosX = Math.cos(this.state.angleX);

    this.camera.position.set(
      this.state.target.x + dist * sinY * cosX,
      this.state.target.y + dist * cosY,
      this.state.target.z + dist * sinY * sinX,
    );
    this.camera.lookAt(this.state.target);
  }

  setTarget(x: number, y: number, z: number): void {
    this.goal.target.set(x, y, z);
  }

  setZoom(z: number): void {
    this.goal.zoom = clamp(z, this.state.MIN_ZOOM, this.state.MAX_ZOOM);
  }

  zoomBy(factor: number): void {
    this.goal.zoom = clamp(this.goal.zoom * factor, this.state.MIN_ZOOM, this.state.MAX_ZOOM);
  }

  rotateBy(dx: number, dy: number): void {
    this.goal.angleX += dx;
    this.goal.angleY = clamp(
      this.goal.angleY + dy,
      this.state.MIN_ANGLE_Y,
      this.state.MAX_ANGLE_Y,
    );
  }

  panBy(dx: number, dy: number): void {
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();

    right.setFromMatrixColumn(this.camera.matrixWorld, 0);
    right.y = 0;
    right.normalize();

    up.set(-right.z, 0, right.x);

    const panOffset = new THREE.Vector3();
    panOffset.addScaledVector(right, dx);
    panOffset.addScaledVector(up, dy);

    this.goal.target.add(panOffset);
  }

  async flyTo(
    target: THREE.Vector3,
    zoom: number,
    duration = 1200,
  ): Promise<void> {
    this.transitionFrom.target = this.state.target.clone();
    this.transitionFrom.zoom = this.state.zoom;
    this.transitionFrom.angleX = this.state.angleX;
    this.transitionFrom.angleY = this.state.angleY;
    this.goal.target.copy(target);
    this.goal.zoom = zoom;
    this.goal.angleX = Math.PI / 4;
    this.goal.angleY = Math.PI / 4;
    this.transitionDuration = duration;
    this.transitionElapsed = 0;
    this.isTransitioning = true;

    return new Promise((resolve) => {
      const check = (): void => {
        if (!this.isTransitioning) {
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });
  }

  update(dt: number): void {
    if (this.isTransitioning) {
      this.transitionElapsed += dt * 1000;
      const t = clamp(this.transitionElapsed / this.transitionDuration, 0, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      this.state.target.lerpVectors(this.transitionFrom.target, this.goal.target, ease);
      this.state.zoom = this.transitionFrom.zoom + (this.goal.zoom - this.transitionFrom.zoom) * ease;
      this.state.angleX = this.transitionFrom.angleX + (this.goal.angleX - this.transitionFrom.angleX) * ease;
      this.state.angleY = this.transitionFrom.angleY + (this.goal.angleY - this.transitionFrom.angleY) * ease;

      if (t >= 1) {
        this.isTransitioning = false;
      }
    } else {
      const lerp = 0.08;
      this.state.target.lerp(this.goal.target, lerp);
      this.state.zoom += (this.goal.zoom - this.state.zoom) * lerp;
      this.state.angleX += (this.goal.angleX - this.state.angleX) * lerp;
      this.state.angleY += (this.goal.angleY - this.state.angleY) * lerp;
    }

    this.apply();
  }
}
