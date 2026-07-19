export class Intro {
  private el: HTMLElement;
  private onStart: () => void;

  constructor(onStart: () => void) {
    this.onStart = onStart;
    this.el = document.getElementById('intro') ?? this.create();
    this.bind();
  }

  private create(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'intro';
    div.innerHTML = `
      <div class="intro-card">
        <h1>컴퓨터 마을에 오신 것을 환영합니다</h1>
        <p>이 마을은 <b>컴퓨터의 작동원리</b>를 설명하는 세계입니다.</p>
        <p>각 건물마다 컴퓨터의 어떤 부품이나 개념이 숨어 있습니다. 건물을 클릭하면 자세한 설명을 볼 수 있어요.</p>
        <div class="subtitle">컴퓨터를 한 번도 본 적 없어도 괜찮습니다. 마을 하나를 이해하듯 천천히 둘러보세요.</div>
        <div class="intro-map">
          <div class="map-step"><div class="num">1단계</div><div class="icon">🏠</div><div>컴퓨터 구조</div></div>
          <div class="map-step"><div class="num">2단계</div><div class="icon">📮</div><div>인터넷</div></div>
          <div class="map-step"><div class="num">3단계</div><div class="icon">🏭</div><div>서버</div></div>
          <div class="map-step"><div class="num">4단계</div><div class="icon">🔭</div><div>전체 조망</div></div>
        </div>
        <button id="enterBtn">마을 안으로 들어가기 →</button>
      </div>
    `;
    document.body.appendChild(div);
    return div;
  }

  private bind(): void {
    this.el.querySelector('#enterBtn')?.addEventListener('click', () => {
      this.el.classList.add('hide');
      setTimeout(() => { this.el.style.display = 'none'; }, 600);
      this.onStart();
    });
  }

  show(): void {
    this.el.style.display = 'flex';
    this.el.classList.remove('hide');
  }
}
