export class PhaseProgress {
  private el: HTMLElement;
  private currentPhase = 1;

  constructor() {
    this.el = document.getElementById('phaseProgress') ?? this.create();
  }

  private create(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'phaseProgress';
    div.innerHTML = `
      <div class="phase-item active" data-phase="1"><span class="num">1</span><span>컴퓨터 구조</span></div>
      <div class="phase-item" data-phase="2"><span class="num">2</span><span>인터넷</span></div>
      <div class="phase-item" data-phase="3"><span class="num">3</span><span>서버</span></div>
      <div class="phase-item" data-phase="4"><span class="num">4</span><span>전체 조망</span></div>
    `;
    document.body.appendChild(div);
    return div;
  }

  setPhase(phase: number): void {
    this.currentPhase = phase;
    this.el.querySelectorAll('.phase-item').forEach(item => {
      const p = Number(item.getAttribute('data-phase'));
      item.classList.toggle('active', p === phase);
      item.classList.toggle('done', p < phase);
    });
  }

  getPhase(): number {
    return this.currentPhase;
  }
}
