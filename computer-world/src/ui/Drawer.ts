export interface Station {
  id: string;
  icon: string;
  label: string;
  tag: string;
  phase: number;
  world: string;
  visited?: boolean;
}

export class Drawer {
  private el: HTMLElement;
  private listEl: HTMLElement;
  private stations: Station[] = [];
  private onSelect: (station: Station) => void;

  constructor(onSelect: (station: Station) => void) {
    this.onSelect = onSelect;
    this.el = document.getElementById('drawer') ?? this.create();
    this.listEl = this.el.querySelector('#stationList') as HTMLElement;
    this.bindToggle();
  }

  private create(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'drawer';
    div.innerHTML = `
      <h4>장소 목록</h4>
      <div id="stationList"></div>
    `;
    document.body.appendChild(div);
    return div;
  }

  private bindToggle(): void {
    const btn = document.getElementById('drawerToggle');
    btn?.addEventListener('click', () => this.toggle());
  }

  toggle(): void {
    this.el.classList.toggle('open');
  }

  close(): void {
    this.el.classList.remove('open');
  }

  setStations(stations: Station[]): void {
    this.stations = stations;
    this.render();
  }

  markVisited(id: string): void {
    const s = this.stations.find(s => s.id === id);
    if (s) s.visited = true;
    this.render();
  }

  getVisitedCount(): number {
    return this.stations.filter(s => s.visited).length;
  }

  private render(): void {
    this.listEl.innerHTML = '';
    const phases = [1, 2, 3, 4];
    const phaseNames: Record<number, string> = { 1: '컴퓨터 구조', 2: '인터넷', 3: '서버', 4: '전체 조망' };

    for (const phase of phases) {
      const items = this.stations.filter(s => s.phase === phase);
      if (items.length === 0) continue;

      const h = document.createElement('h4');
      h.textContent = phaseNames[phase] ?? `Phase ${phase}`;
      h.style.cssText = 'font-size:.8em;color:#a29bfe;margin:12px 0 6px;padding-left:4px;text-transform:uppercase;letter-spacing:.04em';
      this.listEl.appendChild(h);

      for (const s of items) {
        const item = document.createElement('div');
        item.className = `station-item${s.visited ? ' visited' : ''}`;
        item.innerHTML = `
          <span class="chk">${s.visited ? '✅' : '⬜'}</span>
          <span class="si-icon">${s.icon}</span>
          <div class="si-text">
            <div class="si-label">${s.label}</div>
            <div class="si-tag">${s.tag}</div>
          </div>
        `;
        item.addEventListener('click', () => {
          this.onSelect(s);
          this.close();
        });
        this.listEl.appendChild(item);
      }
    }
  }
}
