import * as THREE from 'three';
import type { Engine } from '../core/Engine.ts';
import type { World } from '../core/World.ts';
import { IsometricCamera } from '../core/IsometricCamera.ts';
import { InteriorWorld } from '../interior/InteriorWorld.ts';

export class WorldManager {
  private engine: Engine;
  private cameraCtrl: IsometricCamera;
  private worlds: Map<string, World> = new Map();
  private currentWorld: World | null = null;
  private previousWorldName: string | null = null;
  private isInteriorMode = false;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private isDragging = false;
  private isRightDragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private readonly PAN_SPEED = 0.02;
  private readonly ROTATE_SPEED = 0.005;
  private selectedBuildingName: string | null = null;

  constructor(engine: Engine) {
    this.engine = engine;
    this.cameraCtrl = new IsometricCamera(engine.camera);
    engine.onUpdate((dt) => this.update(dt));
    this.setupInput();
  }

  addWorld(world: World): void {
    this.worlds.set(world.name, world);
    world.build();
  }

  async switchTo(worldName: string, cameraTarget?: THREE.Vector3, zoom?: number): Promise<void> {
    const world = this.worlds.get(worldName);
    if (!world) return;

    this.selectedBuildingName = null;
    window.dispatchEvent(new CustomEvent('building-dismissed'));

    if (this.currentWorld) {
      this.engine.scene.remove(this.currentWorld.scene);
      this.currentWorld.onExit();
    }

    this.engine.scene.add(world.scene);
    this.currentWorld = world;
    this.isInteriorMode = false;
    world.onEnter();

    window.dispatchEvent(new CustomEvent('world-changed', {
      detail: { worldName: world.name, displayName: world.displayName, isInterior: false },
    }));

    if (cameraTarget) {
      await this.cameraCtrl.flyTo(cameraTarget, zoom ?? 1.8);
    }
  }

  async enterInterior(buildingName: string): Promise<void> {
    if (!this.currentWorld || this.isInteriorMode) return;

    this.previousWorldName = this.currentWorld.name;

    const interior = new InteriorWorld(buildingName, this.previousWorldName);
    interior.build();

    this.engine.scene.remove(this.currentWorld.scene);
    this.currentWorld.onExit();

    this.engine.scene.add(interior.scene);
    this.currentWorld = interior;
    this.isInteriorMode = true;
    interior.onEnter();

    window.dispatchEvent(new CustomEvent('world-changed', {
      detail: { worldName: 'interior', displayName: buildingName, isInterior: true, parentWorld: this.previousWorldName },
    }));

    await this.cameraCtrl.flyTo(new THREE.Vector3(0, 5, 8), 3.0);
  }

  async exitInterior(): Promise<void> {
    if (!this.isInteriorMode || !this.previousWorldName) return;

    const prevWorld = this.worlds.get(this.previousWorldName);
    if (!prevWorld) return;

    if (this.currentWorld) {
      this.engine.scene.remove(this.currentWorld.scene);
      this.currentWorld.onExit();
    }

    this.engine.scene.add(prevWorld.scene);
    this.currentWorld = prevWorld;
    this.isInteriorMode = false;
    prevWorld.onEnter();

    window.dispatchEvent(new CustomEvent('world-changed', {
      detail: { worldName: prevWorld.name, displayName: prevWorld.displayName, isInterior: false },
    }));

    await this.cameraCtrl.flyTo(new THREE.Vector3(0, 5, 8), 1.8);
  }

  getCurrentWorld(): World | null {
    return this.currentWorld;
  }

  getCamera(): IsometricCamera {
    return this.cameraCtrl;
  }

  isInInterior(): boolean {
    return this.isInteriorMode;
  }

  private update(dt: number): void {
    this.cameraCtrl.update(dt);
    const t = performance.now() * 0.001;
    if (this.currentWorld) {
      this.currentWorld.update(t);
    }
  }

  private setupInput(): void {
    const canvas = this.engine.renderer.domElement;

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraCtrl.zoomBy(e.deltaY > 0 ? 1.08 : 0.92);
    }, { passive: false });

    canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.isRightDragging = e.button === 2;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      if (e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;

      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;

      if (this.isRightDragging) {
        this.cameraCtrl.rotateBy(dx * this.ROTATE_SPEED, dy * this.ROTATE_SPEED);
      } else {
        this.cameraCtrl.panBy(-dx * this.PAN_SPEED, dy * this.PAN_SPEED);
      }

      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    canvas.addEventListener('pointerup', (e) => {
      if (this.isDragging && !this.isRightDragging && e.button === 0) {
        const dx = Math.abs(e.clientX - this.lastPointerX);
        const dy = Math.abs(e.clientY - this.lastPointerY);
        if (dx < 5 && dy < 5) {
          this.handleClick(e);
        }
      }
      this.isDragging = false;
      this.isRightDragging = false;
    });

    canvas.addEventListener('dblclick', (e) => {
      this.handleDoubleClick(e);
    });

    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  private handleClick(e: PointerEvent): void {
    if (!this.currentWorld) return;
    const canvas = this.engine.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.engine.camera);

    const clickables: THREE.Object3D[] = [];
    this.currentWorld.scene.traverse((child) => {
      if (child.userData?.isPortal || child.userData?.isBuilding || child.userData?.isCharacter) {
        clickables.push(child);
      }
    });

    const hits = this.raycaster.intersectObjects(clickables, true);
    if (hits.length === 0) return;

    let target = hits[0].object;
    while (target.parent && !target.userData?.isPortal && !target.userData?.isBuilding && !target.userData?.isCharacter) {
      target = target.parent;
    }

    if (target.userData?.isPortal) {
      const worldName = target.userData.targetWorld as string;
      if (worldName) {
        this.selectedBuildingName = null;
        window.dispatchEvent(new CustomEvent('building-dismissed'));
        if (this.isInteriorMode) {
          this.exitInterior();
        } else {
          this.switchTo(worldName);
        }
      }
    } else if (target.userData?.isBuilding) {
      const buildingName = target.userData.buildingName as string;
      if (buildingName === this.selectedBuildingName) {
        this.selectedBuildingName = null;
        window.dispatchEvent(new CustomEvent('building-dismissed'));
      } else {
        this.selectedBuildingName = buildingName;
        window.dispatchEvent(new CustomEvent('building-clicked', {
          detail: {
            name: buildingName,
            tag: target.userData.buildingTag,
            icon: target.userData.buildingIcon,
          },
        }));
      }
    } else if (target.userData?.isCharacter) {
      window.dispatchEvent(new CustomEvent('character-clicked', {
        detail: {
          name: target.userData.characterName,
          hint: target.userData.characterHint,
        },
      }));
    } else {
      if (this.selectedBuildingName) {
        this.selectedBuildingName = null;
        window.dispatchEvent(new CustomEvent('building-dismissed'));
      }
    }
  }

  private handleDoubleClick(e: MouseEvent): void {
    if (!this.currentWorld || this.isInteriorMode) return;
    const canvas = this.engine.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.engine.camera);

    const clickables: THREE.Object3D[] = [];
    this.currentWorld.scene.traverse((child) => {
      if (child.userData?.isPortal || child.userData?.isBuilding) {
        clickables.push(child);
      }
    });

    const hits = this.raycaster.intersectObjects(clickables, true);
    if (hits.length === 0) return;

    let target = hits[0].object;
    while (target.parent && !target.userData?.isPortal && !target.userData?.isBuilding) {
      target = target.parent;
    }

    if (target.userData?.isBuilding) {
      const buildingName = target.userData.buildingName as string;
      if (InteriorWorld.hasInterior(buildingName)) {
        this.enterInterior(buildingName);
      } else {
        const worldPos = new THREE.Vector3();
        target.getWorldPosition(worldPos);
        this.cameraCtrl.flyTo(worldPos, 3.5);
      }
    }
  }
}
