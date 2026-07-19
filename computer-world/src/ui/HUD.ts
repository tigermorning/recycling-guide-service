import type { World } from '../core/World.ts';

export class HUD {
  private worldNameEl: HTMLElement;
  private worldSubtitleEl: HTMLElement;
  private progressEl: HTMLElement;

  constructor() {
    this.worldNameEl = document.querySelector('.hud-title') as HTMLElement;
    this.worldSubtitleEl = this.worldNameEl.querySelector('small') as HTMLElement;
    this.progressEl = document.getElementById('progressChip') as HTMLElement;
  }

  setWorld(world: World): void {
    if (this.worldSubtitleEl) {
      this.worldSubtitleEl.textContent = `${world.displayName} · ${world.name}`;
    }
  }

  setProgress(visited: number, total: number): void {
    this.progressEl.textContent = `${visited} / ${total} 방문`;
  }
}
