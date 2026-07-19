interface DiagramNode {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  color: string;
}

interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

const NODES: DiagramNode[] = [
  { id: 'cpu', label: 'CPU', icon: '🖥️', x: 300, y: 80, color: '#cd853f' },
  { id: 'cache', label: '캐시', icon: '📦', x: 150, y: 160, color: '#ff1744' },
  { id: 'ram', label: 'RAM', icon: '🗄️', x: 300, y: 160, color: '#607d8b' },
  { id: 'storage', label: '저장장치', icon: '🏭', x: 450, y: 160, color: '#f9a825' },
  { id: 'gpu', label: 'GPU', icon: '🎮', x: 550, y: 80, color: '#7c4dff' },
  { id: 'monitor', label: '모니터', icon: '🖥️', x: 650, y: 80, color: '#00bcd4' },
  { id: 'os', label: 'OS', icon: '🏢', x: 100, y: 80, color: '#1a237e' },
  { id: 'dns', label: 'DNS', icon: '📍', x: 550, y: 220, color: '#1565c0' },
  { id: 'router', label: '라우터', icon: '🚦', x: 400, y: 280, color: '#00897b' },
  { id: 'server', label: '서버', icon: '🏭', x: 600, y: 280, color: '#ffd93d' },
  { id: 'database', label: 'DB', icon: '📦', x: 700, y: 220, color: '#fd79a8' },
  { id: 'firewall', label: '방화벽', icon: '🛡️', x: 500, y: 340, color: '#c62828' },
];

const EDGES: DiagramEdge[] = [
  { from: 'cpu', to: 'cache', label: 'L1/L2/L3' },
  { from: 'cpu', to: 'ram', label: '데이터' },
  { from: 'cpu', to: 'gpu', label: '렌더링' },
  { from: 'gpu', to: 'monitor', label: '영상' },
  { from: 'os', to: 'cpu', label: '관리' },
  { from: 'os', to: 'ram', label: '할당' },
  { from: 'os', to: 'storage', label: '파일' },
  { from: 'dns', to: 'cpu', label: '이름변환' },
  { from: 'router', to: 'server', label: '라우팅' },
  { from: 'server', to: 'database', label: '저장' },
  { from: 'firewall', to: 'server', label: '보안' },
  { from: 'storage', to: 'ram', label: 'I/O' },
];

export class RelationshipDiagram {
  private el: HTMLElement;
  private container: HTMLElement;

  constructor() {
    this.el = document.getElementById('relationshipDiagram') ?? this.create();
    this.container = this.el.querySelector('#diagramContainer') as HTMLElement;
    this.bind();
  }

  private create(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'relationshipDiagram';
    div.innerHTML = `
      <div class="diagram-card">
        <h3>🔗 컴퓨터 구성요소들의 관계</h3>
        <div class="diagram" id="diagramContainer"></div>
        <p style="font-size:.85em;color:#8a8aa8;margin-top:10px">건물을 클릭하면 자세한 설명을 볼 수 있습니다</p>
        <button class="close-btn" id="closeDiagram">닫기</button>
      </div>
    `;
    document.body.appendChild(div);
    return div;
  }

  private bind(): void {
    document.getElementById('relationshipBtn')?.addEventListener('click', () => this.show());
    this.el.querySelector('#closeDiagram')?.addEventListener('click', () => this.hide());
  }

  show(): void {
    this.render();
    this.el.classList.add('show');
  }

  hide(): void {
    this.el.classList.remove('show');
  }

  private render(): void {
    this.container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.style.cssText = 'width:100%;height:100%';

    for (const edge of EDGES) {
      const from = NODES.find(n => n.id === edge.from);
      const to = NODES.find(n => n.id === edge.to);
      if (!from || !to) continue;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(from.x));
      line.setAttribute('y1', String(from.y));
      line.setAttribute('x2', String(to.x));
      line.setAttribute('y2', String(to.y));
      line.setAttribute('stroke', 'rgba(255,255,255,0.3)');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);

      if (edge.label) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String((from.x + to.x) / 2));
        text.setAttribute('y', String((from.y + to.y) / 2 - 8));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#8a8aa8');
        text.setAttribute('font-size', '10');
        text.textContent = edge.label;
        svg.appendChild(text);
      }
    }

    for (const node of NODES) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.style.cursor = 'pointer';

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(node.x - 40));
      rect.setAttribute('y', String(node.y - 20));
      rect.setAttribute('width', '80');
      rect.setAttribute('height', '40');
      rect.setAttribute('rx', '10');
      rect.setAttribute('fill', 'rgba(20,18,40,0.9)');
      rect.setAttribute('stroke', node.color);
      rect.setAttribute('stroke-width', '2');
      g.appendChild(rect);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(node.x));
      text.setAttribute('y', String(node.y + 5));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#e8e8f6');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', '600');
      text.textContent = `${node.icon} ${node.label}`;
      g.appendChild(text);

      svg.appendChild(g);
    }

    this.container.appendChild(svg);
  }
}
