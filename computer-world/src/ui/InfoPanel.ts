interface BuildingDescription {
  name: string;
  tag: string;
  icon: string;
  description: string;
  details?: string[];
  hasInterior?: boolean;
}

const BUILDING_DESCRIPTIONS: Record<string, BuildingDescription> = {
  '사무실 (메인보드)': {
    name: '사무실 (메인보드)',
    tag: '모든 부품이 연결되는 건물',
    icon: '🏢',
    description: '메인보드는 사무실입니다. 책상, 서랍, 서류함이 모두 여기 안에 있습니다.',
    details: [
      '메인보드는 부품들끼리 데이터를 주고받는 통로입니다.',
      '모든 하드웨어 부품이 메인보드에 연결되어 있습니다.',
      '메인보드가 없으면 부품들이 서로 연결될 수 없습니다.',
    ],
  },
  '책상 (CPU)': {
    name: '책상 (CPU)',
    tag: '중앙처리장치 · 모든 계산이 일어나는 곳',
    icon: '🖥️',
    description: 'CPU는 책상입니다. 사무실 안에서 실제로 문서를 작성하고, 계산하고, 결론을 내리는 곳이죠.',
    hasInterior: true,
    details: [
      'CPU는 숫자를 세고, 비교하고, 결론을 내리는 기계입니다.',
      '프로그램이 "2+2를 해라"라고 하면, CPU가 숫자 2와 2를 가져다가 더한 뒤 4라는 결과를 내놓습니다.',
      '책상 아래에는 서랍(캐시)이 있어 자주 쓰는 서류를 빠르게 꺼낼 수 있습니다.',
    ],
  },
  '책상 위 서랍 (캐시)': {
    name: '책상 아래 서랍 (캐시)',
    tag: 'CPU 바로 옆 · 가장 빠름',
    icon: '📦',
    description: '캐시는 책상 아래 서랍입니다. 자주 쓰는 서류를 여기에 두면 바로 꺼낼 수 있습니다.',
    details: [
      'L1/L2/L3 계층: 가장 작고 빠름 → 중간 → 가장 크고 느림',
      '캐시가 없으면 CPU가 매번 서류함에서 데이터를 가져와야 합니다.',
      '서류함은 캐시보다 100배 느립니다.',
    ],
  },
  '서류함 (RAM)': {
    name: '서류함 (RAM)',
    tag: '임시 기억 · 부르면 바로',
    icon: '🗄️',
    description: 'RAM은 서류함입니다. 자주 쓰는 서류를 바로 꺼낼 수 있도록 책상 근처에 둡니다. 전원이 꺼지면 모두 사라집니다.',
    hasInterior: true,
    details: [
      'RAM은 CPU가 지금 당장 필요한 데이터를 보관하는 임시 저장소입니다.',
      '전원을 끄면 모두 사라집니다.',
      '서류함이 책상 옆에 있는 이유는 자주 왔다갔다 해야 하기 때문입니다.',
    ],
  },
  '창고 (저장장치)': {
    name: '창고 (저장장치)',
    tag: '영구 보관 · 느리지만 용량 큼',
    icon: '🏭',
    description: '저장장치는 사무실 안 뒤편 창고입니다. 책상에서 가장 먼 거리에 있어 데이터를 꺼내느라 시간이 걸리지만, 모든 파일을 영구적으로 보관합니다.',
    hasInterior: true,
    details: [
      'SSD (소형 보관함): 빠르고 작습니다. 자주 쓰는 프로그램과 파일을 보관합니다.',
      'HDD (대형 창고): 느리지만 넓습니다. 오래된 파일과 백업을 보관합니다.',
      '메모리 계층: 서랍(가장 빠름) → 서류함(빠름) → 창고(느리지만 넓음)',
    ],
  },
  '그래픽 공방 (GPU)': {
    name: '그래픽 공방 (GPU)',
    tag: '화면을 그리는 전문가',
    icon: '🎮',
    description: 'GPU는 화면을 그리는 전문가입니다. 병렬 처리로 thousands개의 작업을 동시에 수행합니다.',
    details: [
      'GPU는 수천 개의 작은 코어로 구성되어 있습니다.',
      '게임, 영상 편집, 3D 렌더링에 사용됩니다.',
      'CPU는 일반적인 작업, GPU는 그래픽 전문 작업을 담당합니다.',
    ],
  },
  '경비실 (OS)': {
    name: '경비실 (OS)',
    tag: '운영체제 · 모든 출입을 관리',
    icon: '🏢',
    description: '운영체제는 관리사무소입니다. CPU, 메모리, 저장장치 등 모든 하드웨어 자원을 관리하고, 프로그램들에게 자원을 나눠줍니다.',
    details: [
      '운영체제는 CPU 시간 배분, 메모리 할당, 파일 관리, 장치 제어를 담당합니다.',
      '운영체제가 없으면 프로그램들이 서로 하드웨어를 차지하려고 싸우게 됩니다.',
      '운영체제는 컴퓨터의 "총무팀"이라고 부릅니다.',
    ],
  },
  '우체국 (DNS)': {
    name: 'DNS (주소 안내판)',
    tag: '이름 → 주소 변환',
    icon: '📍',
    description: 'DNS는 이름을 주소로 바꿔주는 안내판입니다. "naver.com"이라고 적힌 안내판을 보면, 실제 IP 주소 방향을 가리켜줍니다.',
    details: [
      '"mysite.com"이라고 치면, DNS가 IP 주소를 알려줍니다.',
      '도메인은 1년에 만 원 안팎이면 등록할 수 있습니다.',
      '도메인은 "내 서비스의 이름과 정체성을 지켜주는 방패"입니다.',
    ],
  },
  '교차로 (라우터)': {
    name: '교차로 (라우터)',
    tag: '데이터 경로 결정',
    icon: '🚦',
    description: '라우터는 데이터가 갈 길을 정해주는 교차로입니다. 편지(데이터)가 목적지까지 가장 빠른 길로 가도록 안내합니다.',
    details: [
      '집 안의 공유기도 하나의 라우터입니다.',
      '라우터가 없으면 데이터가 목적지를 찾지 못하고 헤매게 됩니다.',
      '라우터는 인터넷의 핵심 장비입니다.',
    ],
  },
  '문 (방화벽)': {
    name: '문 (방화벽)',
    tag: '보안 · 출입 통제',
    icon: '🛡️',
    description: '방화벽은 컴퓨터의 보안을 담당하는 경비원입니다. 허용된 요청만 들여보내고, 나머지는 막습니다.',
    hasInterior: true,
    details: [
      '방화벽 없이 인터넷에 연결되면, 누군가가 여러분의 컴퓨터에 원격으로 접속할 수 있습니다.',
      '방화벽은 컴퓨터 보안의 첫 번째 라인이 됩니다.',
      '바이러스나 해커가 침입하는 것을 막아줍니다.',
    ],
  },
  'HTTP (데이터 전송)': {
    name: 'HTTP (데이터 전송)',
    tag: '데이터 전송 규칙',
    icon: '📜',
    description: 'HTTP는 데이터가 오가는 기본 규칙을 보여주는 문서입니다.',
    details: [
      'HTTP는 웹에서 데이터를 주고받는 프로토콜입니다.',
      '요청(Request)과 응답(Response)으로 동작합니다.',
      '상태 코드: 200(성공), 404(찾을 수 없음), 500(서버 오류)',
    ],
  },
};

export class InfoPanel {
  private el: HTMLElement;

  constructor() {
    this.el = document.getElementById('info-panel') ?? this.createElement();
    this.el.style.cssText = `
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      width: min(600px, 92vw); max-height: 50vh; overflow-y: auto;
      background: rgba(13,11,26,.95); border: 1px solid rgba(255,255,255,.15);
      border-radius: 20px; padding: 24px 26px; backdrop-filter: blur(16px);
      z-index: 8; box-shadow: 0 30px 80px rgba(0,0,0,.6);
      display: none; color: #e8e8f6; font-family: 'Segoe UI', system-ui, sans-serif;
    `;
    window.addEventListener('building-clicked', ((e: CustomEvent) => {
      this.showBuilding(e.detail);
    }) as EventListener);
  }

  private showBuilding(detail: { name: string; tag: string; icon: string }): void {
    const desc = BUILDING_DESCRIPTIONS[detail.name];

    if (desc) {
      const detailsHtml = desc.details
        ? desc.details.map(d => `<li style="margin-bottom:8px;line-height:1.7;color:#c0c0e0">• ${d}</li>`).join('')
        : '';

      this.el.innerHTML = `
        <h3 style="font-size:1.3em;margin-bottom:8px">${detail.icon} ${detail.name}</h3>
        <div style="display:inline-block;font-size:.72em;padding:4px 12px;border-radius:12px;
          background:rgba(255,255,255,.12);margin-bottom:14px">${detail.tag}</div>
        <p style="line-height:1.8;font-size:.95em;color:#e0e0f0;margin-bottom:14px">
          ${desc.description}
        </p>
        ${detailsHtml ? `<ul style="list-style:none;padding:0;margin:0">${detailsHtml}</ul>` : ''}
        <div style="margin-top:16px;display:flex;gap:10px">
          ${desc.hasInterior ? '<button id="info-interior" style="background:linear-gradient(135deg,#6c5ce7,#00cec9);border:none;color:#fff;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:.88em">내부 보기</button>' : ''}
          <button id="info-close" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);
            color:#fff;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:.88em">닫기</button>
        </div>
      `;
    } else {
      this.el.innerHTML = `
        <h3 style="font-size:1.3em;margin-bottom:8px">${detail.icon} ${detail.name}</h3>
        <div style="display:inline-block;font-size:.72em;padding:4px 12px;border-radius:12px;
          background:rgba(255,255,255,.12);margin-bottom:14px">${detail.tag}</div>
        <p style="line-height:1.8;font-size:.95em;color:#e0e0f0">
          이 건물에 대한 설명이 곧 추가됩니다.
        </p>
        <div style="margin-top:16px">
          <button id="info-close" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);
            color:#fff;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:.88em">닫기</button>
        </div>
      `;
    }

    this.el.style.display = 'block';
    document.getElementById('info-close')?.addEventListener('click', () => this.hide());
    document.getElementById('info-interior')?.addEventListener('click', () => {
      this.hide();
      window.dispatchEvent(new CustomEvent('enter-interior', {
        detail: { name: detail.name },
      }));
    });
  }

  hide(): void {
    this.el.style.display = 'none';
  }

  private createElement(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'info-panel';
    document.body.appendChild(div);
    return div;
  }
}
