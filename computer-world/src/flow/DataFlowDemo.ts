import * as THREE from 'three';
import type { World } from '../core/World.ts';
import type { WorldManager } from '../core/WorldManager.ts';
import type { IsometricCamera } from '../core/IsometricCamera.ts';

export interface FlowStep {
  worldName: string;
  buildingName: string;
  label: string;
  description?: string;
  why?: string;
  zoomLevel?: number;
  pauseMs?: number;
  position?: THREE.Vector3;
}

interface ResolvedStep {
  worldName: string;
  buildingName: string;
  position: THREE.Vector3;
  label: string;
  description?: string;
  why?: string;
  zoomLevel: number;
  pauseMs: number;
}

/**
 * 데이터 흐름 데모 — 사용자 액션이 컴퓨터 전체를 어떻게 통과하는지
 * 단계별로 애니메이션하여 보여줍니다.
 *
 * 개선 사항:
 * - IsometricCamera.flyTo() 를 사용하여 카메라 시스템과 일관성 유지
 * - WorldManager.switchTo() 를 사용하여 월드 간 전환
 * - 각 단계에 WHY 설명 포함 — 왜 이 구성요소가 사용되는지
 * - 진행 단계 기반 데모 — 방문한 월드의 개념만 표시
 * - 카메라가 데이터 여정을 따라가며 줌인/일시정지
 */
export class DataFlowDemo {
  private engine: { scene: THREE.Scene; camera: THREE.Camera };
  private worlds: Map<string, World>;
  private worldManager: WorldManager;
  private particle!: THREE.Mesh;
  private trail!: THREE.Mesh;
  private labelSprite!: THREE.Sprite;
  private isRunning = false;
  private previousWorldName: string | null = null;

  /** 하드웨어 빌딩명 → 버스 구간 키 매핑 */
  private static readonly HW_BUILDING_TO_BUS: Record<string, string> = {
    'CPU (중앙처리장치)': 'CPU',
    'RAM (메모리)': 'RAM',
    '저장장치 (SSD/HDD)': 'Storage',
    'GPU (그래픽처리장치)': 'GPU',
    '운영체제 (OS)': 'OS',
  };

  constructor(
    engine: { scene: THREE.Scene; camera: THREE.Camera },
    worlds: Map<string, World>,
    worldManager: WorldManager,
  ) {
    this.engine = engine;
    this.worlds = worlds;
    this.worldManager = worldManager;
    this.createParticle();
    this.createLabel();
  }

  // ─── VISUAL SETUP ───────────────────────────────────────────────────

  private createParticle(): void {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const ctx = glowCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#ffd700');
    grad.addColorStop(0.7, '#ff8c00');
    grad.addColorStop(1, 'rgba(255,140,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    this.particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(glowCanvas),
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      }),
    );
    this.particle.renderOrder = 999;
    this.particle.visible = false;
    this.engine.scene.add(this.particle);

    const trailGeo = new THREE.SphereGeometry(0.12, 8, 8);
    this.trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.5,
      depthTest: false,
    }));
    this.trail.renderOrder = 998;
    this.trail.visible = false;
    this.engine.scene.add(this.trail);
  }

  private createLabel(): void {
    const c = document.createElement('canvas');
    c.width = 900;
    c.height = 280;
    const ctx = c.getContext('2d')!;
    this.drawLabelBackground(ctx, c.width, c.height);

    this.labelSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        depthTest: false,
      }),
    );
    this.labelSprite.scale.set(7, 2.2, 1);
    this.labelSprite.renderOrder = 1000;
    this.labelSprite.visible = false;
    this.engine.scene.add(this.labelSprite);
  }

  private drawLabelBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.92)';
    ctx.beginPath();
    ctx.roundRect(4, 4, w - 8, h - 8, 12);
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, w - 8, h - 8, 12);
    ctx.stroke();
  }

  private updateLabel(text: string, subtext: string, why?: string): void {
    const spriteMat = this.labelSprite.material as THREE.SpriteMaterial;
    const canvas = spriteMat.map?.image as HTMLCanvasElement | undefined;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    this.drawLabelBackground(ctx, w, h);

    // ── 단계 제목 (gold) ──
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, w / 2, 55);

    // ── 설명 (gray) ──
    ctx.font = '26px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText(subtext, w / 2, 95);

    // ── WHY 설명 (cyan) ──
    if (why) {
      ctx.fillStyle = '#4fc3f7';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('💡 왜 필요한가:', w / 2, 140);

      ctx.font = '18px Arial';
      ctx.fillStyle = '#b0bec5';
      const maxWidth = w - 80;
      const words = why.split(' ');
      let line = '';
      let y = 172;
      for (const word of words) {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth) {
          ctx.fillText(line.trim(), w / 2, y);
          line = word + ' ';
          y += 26;
          if (y > h - 16) break;
        } else {
          line = testLine;
        }
      }
      if (y <= h - 16) ctx.fillText(line.trim(), w / 2, y);
    }

    spriteMat.map = new THREE.CanvasTexture(canvas);
    spriteMat.needsUpdate = true;
  }

  // ─── PUBLIC API ──────────────────────────────────────────────────────

  async run(steps: FlowStep[]): Promise<void> {
    if (this.isRunning || steps.length === 0) return;
    this.isRunning = true;

    const cameraCtrl = this.worldManager.getCamera();
    this.previousWorldName = this.worldManager.getCurrentWorld()?.name ?? null;

    window.dispatchEvent(new CustomEvent('demo-started'));
    this.showElements(true);

    const resolved = this.resolveSteps(steps);
    if (resolved.length === 0) {
      this.isRunning = false;
      this.showElements(false);
      return;
    }

    // ── 월드별로 그룹핑 ──
    const worldGroups = new Map<string, ResolvedStep[]>();
    for (const step of resolved) {
      const group = worldGroups.get(step.worldName) || [];
      group.push(step);
      worldGroups.set(step.worldName, group);
    }

    let currentWorld = this.previousWorldName;

    // ── 각 월드의 단계를 순서대로 실행 ──
    for (const [worldName, worldSteps] of worldGroups) {
      // 월드 전환
      if (currentWorld !== worldName) {
        this.hideElements();
        await this.worldManager.switchTo(worldName);
        await this.wait(0.6);
        this.showElements(true);
        currentWorld = worldName;
      }

      for (let i = 0; i < worldSteps.length; i++) {
        const step = worldSteps[i];
        const nextStep = i < worldSteps.length - 1 ? worldSteps[i + 1] : null;

        // 카메라를 구성요소로 이동
        await cameraCtrl.flyTo(step.position, step.zoomLevel, 800);

        // 라벨 업데이트 (WHY 포함)
        this.updateLabel(step.label, step.description ?? '', step.why);

        // 파티클 위치 설정
        this.particle.position.copy(step.position);
        this.particle.position.y += 1.5;
        this.trail.position.copy(this.particle.position);
        this.labelSprite.position.copy(this.particle.position);
        this.labelSprite.position.y += 2.5;

        // 구성요소에서 일시정지
        await this.wait(step.pauseMs / 1000);

        // 다음 단계가 같은 월드이면 파티클 애니메이션
        if (nextStep && nextStep.worldName === worldName) {
          // 하드웨어 월드에서 버스 하이라이트
          if (worldName === 'hardware') {
            const fromKey = DataFlowDemo.HW_BUILDING_TO_BUS[step.buildingName];
            const toKey = DataFlowDemo.HW_BUILDING_TO_BUS[nextStep.buildingName];
            if (fromKey && toKey) {
              const hw = this.worlds.get('hardware') as unknown as {
                highlightBusSegment?: (a: string, b: string) => void;
                resetBusHighlights?: () => void;
              };
              hw.highlightBusSegment?.(fromKey, toKey);
              await this.animatePacketTo(nextStep.position, cameraCtrl);
              hw.resetBusHighlights?.();
            } else {
              await this.animatePacketTo(nextStep.position, cameraCtrl);
            }
          } else {
            await this.animatePacketTo(nextStep.position, cameraCtrl);
          }
        }
      }
    }

    // ── 완료 ──
    this.updateLabel(
      '데모 완료!',
      '전체 흐름을 확인했습니다',
      '각 구성 요소가 데이터를 처리하는 과정을 확인했습니다',
    );
    await this.wait(2.5);

    // ── 원래 월드로 복귀 ──
    if (this.previousWorldName && this.worldManager.getCurrentWorld()?.name !== this.previousWorldName) {
      this.hideElements();
      await this.worldManager.switchTo(this.previousWorldName);
    }

    await cameraCtrl.flyTo(new THREE.Vector3(0, 0, 0), 1.8, 800);
    this.showElements(false);
    this.isRunning = false;
    window.dispatchEvent(new CustomEvent('demo-completed'));
  }

  // ─── CAMERA FOLLOWING ────────────────────────────────────────────────

  private async animatePacketTo(targetPos: THREE.Vector3, cameraCtrl: IsometricCamera): Promise<void> {
    const startPos = this.particle.position.clone();
    const endPos = targetPos.clone();
    endPos.y += 1.5;

    const duration = 1200;
    const start = performance.now();

    return new Promise<void>((resolve) => {
      const animate = () => {
        const now = performance.now();
        const t = Math.min((now - start) / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        // 파티클 이동
        this.particle.position.lerpVectors(startPos, endPos, ease);
        this.particle.position.y += Math.sin(ease * Math.PI) * 0.5;

        // 트레일 따라오기
        this.trail.position.lerpVectors(startPos, endPos, Math.max(0, ease - 0.15));

        // 라벨 따라오기
        this.labelSprite.position.copy(this.particle.position);
        this.labelSprite.position.y += 2.5;

        // 카메라가 파티클을 부드럽게 따라감
        cameraCtrl.setTarget(
          this.particle.position.x,
          this.particle.position.y + 2,
          this.particle.position.z,
        );

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  // ─── STEP RESOLUTION ────────────────────────────────────────────────

  private resolveSteps(steps: FlowStep[]): ResolvedStep[] {
    const resolved: ResolvedStep[] = [];

    for (const step of steps) {
      let position: THREE.Vector3 | undefined;

      // 1) 스텝에 명시적 position이 있으면 사용
      if (step.position) {
        position = step.position.clone();
      } else {
        // 2) 월드 씬에서 buildingName으로 검색
        const world = this.worlds.get(step.worldName);
        if (world) {
          world.scene.traverse((child) => {
            if (child.userData?.isBuilding && child.userData.buildingName === step.buildingName && !position) {
              position = new THREE.Vector3();
              child.getWorldPosition(position!);
            }
          });
        }

        // 3) HardwareWorld의 componentPositions에서 조회
        if (!position && world) {
          const hw = world as unknown as { componentPositions?: Record<string, THREE.Vector3> };
          if (hw.componentPositions && hw.componentPositions[step.buildingName]) {
            position = hw.componentPositions[step.buildingName].clone();
          }
        }

        // 4) 폴백
        if (!position) {
          position = new THREE.Vector3(0, 2, 0);
        }
      }

      resolved.push({
        worldName: step.worldName,
        buildingName: step.buildingName,
        position: position!,
        label: step.label,
        description: step.description,
        why: step.why,
        zoomLevel: step.zoomLevel ?? 2.0,
        pauseMs: step.pauseMs ?? 2500,
      });
    }

    return resolved;
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────

  private showElements(visible: boolean): void {
    this.particle.visible = visible;
    this.trail.visible = visible;
    this.labelSprite.visible = visible;
  }

  private hideElements(): void {
    this.showElements(false);
  }

  dispose(): void {
    this.engine.scene.remove(this.particle);
    this.engine.scene.remove(this.trail);
    this.engine.scene.remove(this.labelSprite);
  }

  private wait(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
