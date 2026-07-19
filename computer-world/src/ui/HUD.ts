import type { World } from '../core/World.ts';
import { learningProgress } from '../learning/LearningProgress.ts';

const WORLD_HIERARCHY: Record<string, string[]> = {
  'real-world': ['실세계'],
  'hardware': ['실세계', '컴퓨터 세계', '하드웨어 월드'],
  'network': ['실세계', '컴퓨터 세계', '네트워크 월드'],
  'interior': ['실세계', '컴퓨터 세계', '하드웨어 월드'],
};

const STAGE_NAMES: Record<number, string> = {
  0: '탐험 시작',
  1: '하드웨어 이해',
  2: '네트워크 연결',
  3: '운영체제 학습',
  4: '전체 시스템 마스터',
};

export class HUD {
  private worldNameEl: HTMLElement;
  private worldSubtitleEl: HTMLElement;
  private progressEl: HTMLElement;
  private breadcrumbEl: HTMLElement;
  private stageEl: HTMLElement;

  constructor() {
    this.worldNameEl = document.querySelector('.hud-title') as HTMLElement;
    this.worldSubtitleEl = this.worldNameEl.querySelector('small') as HTMLElement;
    this.progressEl = document.getElementById('progressChip') as HTMLElement;
    this.breadcrumbEl = this.createBreadcrumb();
    this.stageEl = this.createStageIndicator();
    this.updateStage();

    window.addEventListener('world-changed', ((e: CustomEvent) => {
      this.updateBreadcrumb(e.detail);
      this.updateStage();
    }) as EventListener);
  }

  setWorld(world: World): void {
    if (this.worldSubtitleEl) {
      this.worldSubtitleEl.textContent = `${world.displayName} · ${world.name}`;
    }
  }

  setProgress(visited: number, total: number): void {
    this.progressEl.textContent = `${visited} / ${total} 방문`;
  }

  private createStageIndicator(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'stage-indicator';
    el.style.cssText = `
      position: fixed; top: 16px; right: 20px;
      background: rgba(13,11,26,.85); border: 1px solid rgba(255,215,0,.3);
      border-radius: 12px; padding: 8px 16px; backdrop-filter: blur(12px);
      z-index: 7; font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 12px; color: #ffd700; letter-spacing: 0.3px;
      transition: all 0.3s;
    `;
    document.body.appendChild(el);
    return el;
  }

  private updateStage(): void {
    const stage = learningProgress.getCurrentStage();
    const stageName = STAGE_NAMES[stage] ?? '탐험 시작';
    const visited = learningProgress.getVisitedCount();
    this.stageEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:14px">📊</span>
        <span style="font-weight:600">학습 단계 ${stage}</span>
        <span style="color:#888;font-size:11px">|</span>
        <span style="color:#ccc">${stageName}</span>
      </div>
      <div style="margin-top:4px;font-size:10px;color:#888">
        방문한 월드: ${visited}개
      </div>
    `;
  }

  private createBreadcrumb(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'breadcrumb';
    el.style.cssText = `
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 6px;
      background: rgba(13,11,26,.85); border: 1px solid rgba(255,255,255,.12);
      border-radius: 20px; padding: 8px 18px; backdrop-filter: blur(12px);
      z-index: 7; font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 13px; color: #a0a0c0; letter-spacing: 0.3px;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(el);
    return el;
  }

  private updateBreadcrumb(detail: { worldName: string; displayName: string; isInterior: boolean; parentWorld?: string }): void {
    const parts = WORLD_HIERARCHY[detail.worldName] ?? ['실세계'];
    const currentName = detail.isInterior ? `${detail.displayName} 내부` : detail.displayName;

    this.breadcrumbEl.innerHTML = parts.map((p, i) => {
      const isLast = i === parts.length - 1;
      return `<span style="color:${isLast ? '#e8e8f6' : '#6c7a89'};${isLast ? 'font-weight:600' : ''}">${p}</span>`
        + (isLast ? '' : '<span style="color:#4a5568;margin:0 2px">›</span>');
    }).join('') + `<span style="color:#4a5568;margin:0 2px">›</span><span style="color:#6c5ce7;font-weight:600">${currentName}</span>`;
  }
}
