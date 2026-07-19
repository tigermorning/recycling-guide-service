export class Toast {
  private hintEl: HTMLElement;
  private finishEl: HTMLElement;
  private levelUnlockEl: HTMLElement;
  private charHintEl: HTMLElement;

  constructor() {
    this.hintEl = document.getElementById('hint') ?? this.createHint();
    this.finishEl = document.getElementById('finish') ?? this.createFinish();
    this.levelUnlockEl = document.getElementById('levelUnlock') ?? this.createLevelUnlock();
    this.charHintEl = document.getElementById('charHint') ?? this.createCharHint();
  }

  private createHint(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'hint';
    div.innerHTML = '💡 건물 클릭: 설명 · 드래그: 맵 이동 · 스크롤: 확대/축소';
    document.body.appendChild(div);
    return div;
  }

  private createFinish(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'finish';
    div.innerHTML = '🎉 모든 장소를 둘러보셨습니다!';
    document.body.appendChild(div);
    return div;
  }

  private createLevelUnlock(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'levelUnlock';
    document.body.appendChild(div);
    return div;
  }

  showHint(text: string, duration = 4000): void {
    this.hintEl.innerHTML = text;
    this.hintEl.classList.add('show');
    setTimeout(() => this.hintEl.classList.remove('show'), duration);
  }

  showFinish(): void {
    this.finishEl.classList.add('show');
    setTimeout(() => this.finishEl.classList.remove('show'), 5000);
  }

  showLevelUnlock(level: number, name: string): void {
    const levelClass = level === 2 ? 'inter' : 'adv';
    this.levelUnlockEl.innerHTML = `
      <h2>🎉 레벨 해금!</h2>
      <p>새로운 장소들이 열렸습니다</p>
      <div class="level-badge ${levelClass}">${name}</div>
      <button id="levelUnlockBtn">계속 탐험하기</button>
    `;
    this.levelUnlockEl.classList.add('show');
    this.levelUnlockEl.querySelector('#levelUnlockBtn')?.addEventListener('click', () => {
      this.levelUnlockEl.classList.remove('show');
    });
  }

  showCharacterHint(name: string, hint: string, duration = 5000): void {
    this.charHintEl.innerHTML = `<b>${name}</b>: "${hint}"`;
    this.charHintEl.classList.add('show');
    setTimeout(() => this.charHintEl.classList.remove('show'), duration);
  }

  private createCharHint(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'charHint';
    div.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(20,18,40,.9);border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:12px 24px;font-size:.9em;backdrop-filter:blur(10px);z-index:7;opacity:0;transition:opacity .5s ease;pointer-events:none;text-align:center;max-width:400px';
    document.body.appendChild(div);
    return div;
  }
}
