import { Engine } from './core/Engine.ts';
import { WorldManager } from './core/WorldManager.ts';
import { HUD } from './ui/HUD.ts';
import { Drawer } from './ui/Drawer.ts';
import { PhaseProgress } from './ui/PhaseProgress.ts';
import { Toast } from './ui/Toast.ts';
import * as THREE from 'three';
import { learningProgress } from './learning/LearningProgress.ts';
import type { FlowStep } from './flow/DataFlowDemo.ts';

/**
 * 데모 시나리오 정의
 * - 방문한 월드의 개념만 포함 (progress-gated)
 * - 각 단계에 WHY 설명 포함 — 왜 이 구성요소가 사용되는지
 * - 정확한 처리 경로 — 실제로 사용되는 구성요소만 포함
 */

// 1단계: 로컬 데이터 처리 (Real World + Hardware World)
// 로그인 버튼 클릭이 컴퓨터 내부를 통과하는 전체 여정
const LOCAL_PROCESSING_STEPS: FlowStep[] = [
  {
    worldName: 'real-world',
    buildingName: '사용자',
    label: '1. 사용자가 로그인 버튼 클릭',
    description: '키보드에서 키를 누릅니다',
    why: '모든 컴퓨터 작업은 사용자의 물리적 입력으로 시작됩니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
    position: new THREE.Vector3(0, 2, 2),
  },
  {
    worldName: 'real-world',
    buildingName: '컴퓨터 본체',
    label: '2. 입력 신호가 컴퓨터로 전달',
    description: '키보드 신호가 전기 신호로 변환되어 본체로 전달',
    why: '물리적 입력이 디지털 신호로 변환되어 컴퓨터 내부로 들어갑니다',
    zoomLevel: 2.5,
    pauseMs: 2500,
    position: new THREE.Vector3(2.8, 1.5, 0),
  },
  {
    worldName: 'hardware',
    buildingName: 'CPU (중앙처리장치)',
    label: '3. CPU가 명령어 수신',
    description: 'CPU가 입력신호를 해석하여 명령어로 변환',
    why: 'CPU는 컴퓨터의 두뇌로, 모든 명령의 처리를 시작하는 핵심 칩입니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
  },
  {
    worldName: 'hardware',
    buildingName: 'CPU 내장 캐시',
    label: '4. CPU 내장 캐시에서 데이터 확인',
    description: 'CPU는 먼저 내장 캐시(L1/L2)에서 필요한 데이터를 찾습니다',
    why: '캐시는 CPU 안에 있는 가장 빠른 저장장치입니다. 여기 있으면 나노초 만에 사용할 수 있습니다',
    zoomLevel: 3.0,
    pauseMs: 2500,
  },
  {
    worldName: 'hardware',
    buildingName: 'RAM (메모리)',
    label: '5. 캐시에 없으면 RAM에서 로딩',
    description: '캐시 미스 시 RAM에서 데이터를 가져옵니다',
    why: 'RAM은 CPU의 작업공간입니다. 저장장치보다 100배 빠르고, 자주 쓰는 데이터가 보관됩니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
  },
  {
    worldName: 'hardware',
    buildingName: 'CPU (중앙처리장치)',
    label: '6. CPU가 명령 처리 완료',
    description: 'CPU가 데이터를 처리하여 최종 결과를 생성합니다',
    why: 'CPU의 역할은 입력된 명령을 실제 결과로 변환하는 것 — 모든 계산이 여기서 일어납니다',
    zoomLevel: 2.5,
    pauseMs: 2500,
  },
  {
    worldName: 'hardware',
    buildingName: 'GPU (그래픽처리장치)',
    label: '7. GPU가 화면 렌더링',
    description: 'CPU의 결과를 GPU가 화면 이미지로 변환합니다',
    why: 'GPU는 수천 개의 코어로 동시에 색상을 계산하여 빠르게 화면을 그립니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
  },
  {
    worldName: 'real-world',
    buildingName: '모니터',
    label: '8. 사용자에게 결과 표시',
    description: '최종 결과가 모니터에 표시됩니다',
    why: '모니터는 컴퓨터의 처리 결과를 사람이 볼 수 있게 빛의 이미지로 변환합니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
    position: new THREE.Vector3(0, 2.5, -0.5),
  },
];

// 2단계: 인터넷 요청 (Real World + Hardware + Network)
const NETWORK_REQUEST_STEPS: FlowStep[] = [
  ...LOCAL_PROCESSING_STEPS.slice(0, 3),
  {
    worldName: 'hardware',
    buildingName: 'CPU (중앙처리장치)',
    label: '3-1. CPU가 네트워크 요청 생성',
    description: 'CPU가 인터넷 요청 명령을 만듭니다',
    why: 'CPU는 모든 명령의 출발점 — 네트워크 요청도 CPU에서 시작됩니다',
    zoomLevel: 2.5,
    pauseMs: 2500,
  },
  {
    worldName: 'hardware',
    buildingName: 'RAM (메모리)',
    label: '4. 요청 데이터를 RAM에 임시 저장',
    description: '보낼 데이터가 RAM에 임시로 보관됩니다',
    why: 'RAM은 출발지와 목적지 사이의 임시 정류장입니다',
    zoomLevel: 2.5,
    pauseMs: 2500,
  },
  {
    worldName: 'network',
    buildingName: '라우터 (공유기)',
    label: '5. 라우터로 데이터 전달',
    description: '데이터가 라우터를 통해 인터넷으로 나갑니다',
    why: '라우터는 데이터의 GPS 같은 역할 — 가장 빠른 경로를 찾아 전 세계로 전달합니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
  },
  {
    worldName: 'network',
    buildingName: 'DNS (이름서버)',
    label: '6. DNS가 서버 주소 확인',
    description: '"naver.com"을 IP 주소로 변환합니다',
    why: 'DNS는 인터넷의 전화번호부 — 이름을 숫자 주소로 변환하여 컴퓨터가 찾을 수 있게 합니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
  },
  {
    worldName: 'network',
    buildingName: '방화벽 (화재벽)',
    label: '7. 방화벽이 요청 검증',
    description: '보안 검사를 통과한 후 서버로 전달됩니다',
    why: '방화벽은 컴퓨터의 보안요원 — 안전하지 않은 요청을 차단하여 시스템을 보호합니다',
    zoomLevel: 2.5,
    pauseMs: 2500,
  },
  {
    worldName: 'network',
    buildingName: 'HTTP (규약)',
    label: '8. HTTP 규약으로 서버에 요청',
    description: 'HTTP 규칙에 맞춰 서버에 데이터를 보냅니다',
    why: 'HTTP는 웹에서 통신하는 공통 언어 — 서버와 클라이언트가 서로 이해할 수 있는 규칙입니다',
    zoomLevel: 2.5,
    pauseMs: 3000,
  },
];

// 데모 시나리오 매핑
const DEMO_SCENARIOS: { label: string; getSteps: () => FlowStep[]; minStage: number }[] = [
  { label: '로컬 처리 (키보드→CPU→화면)', getSteps: () => LOCAL_PROCESSING_STEPS, minStage: 1 },
  { label: '인터넷 요청 (전체 경로)', getSteps: () => NETWORK_REQUEST_STEPS, minStage: 2 },
];

function getAvailableDemoSteps(): FlowStep[] {
  const stage = learningProgress.getCurrentStage();
  // 가장 높은 단계의 시나리오를 선택
  let bestSteps: FlowStep[] = [];
  for (const scenario of DEMO_SCENARIOS) {
    if (stage >= scenario.minStage) {
      bestSteps = scenario.getSteps();
    }
  }
  return bestSteps;
}

function createDemoButton(onClick: () => void): { updateStage: () => void } {
  const btn = document.createElement('button');
  btn.title = '데이터가 컴퓨터를 통과하는 과정을 단계별로 보여줍니다';
  btn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    border: none; color: #1a1a2e; padding: 12px 20px;
    border-radius: 12px; cursor: pointer; font-size: 14px;
    font-weight: 600; z-index: 9; box-shadow: 0 4px 20px rgba(255,140,0,.4);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'Segoe UI', system-ui, sans-serif;
  `;
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.05)';
    btn.style.boxShadow = '0 6px 30px rgba(255,140,0,.6)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 4px 20px rgba(255,140,0,.4)';
  });
  btn.addEventListener('click', onClick);
  document.body.appendChild(btn);

  const updateStage = () => {
    const stage = learningProgress.getCurrentStage();
    const steps = getAvailableDemoSteps();
    const scenarioLabel = stage >= 2 ? '인터넷 요청' : '로컬 처리';
    btn.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <span>🔄 데이터 흐름 데모</span>
        <span style="font-size:10px;opacity:0.8">${scenarioLabel} (${steps.length}단계)</span>
      </div>
    `;
  };

  return { updateStage };
}

const NAME_TO_STATION: Record<string, string> = {
  '메인보드 (기판)': 'motherboard',
  'CPU (중앙처리장치)': 'cpu',
  'CPU 내장 캐시': 'cache',
  'RAM (메모리)': 'ram',
  '저장장치 (SSD/HDD)': 'storage',
  'GPU (그래픽처리장치)': 'gpu',
  '운영체제 (OS)': 'os',
  'DNS (이름서버)': 'dns',
  '라우터 (공유기)': 'router',
  '방화벽 (화재벽)': 'firewall',
  'HTTP (규약)': 'http',
};

const BUILDING_PHASE: Record<string, number> = {
  '메인보드 (기판)': 1,
  'CPU (중앙처리장치)': 1,
  'CPU 내장 캐시': 1,
  'RAM (메모리)': 1,
  '저장장치 (SSD/HDD)': 1,
  'GPU (그래픽처리장치)': 1,
  '운영체제 (OS)': 1,
  'DNS (이름서버)': 2,
  '라우터 (공유기)': 2,
  '방화벽 (화재벽)': 3,
  'HTTP (규약)': 2,
};

async function main(): Promise<void> {
  try {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  if (!canvas) { console.error('No canvas element found'); return; }
  const engine = new Engine(canvas);
  const worldManager = new WorldManager(engine);

  const toast = new Toast();
  const hud = new HUD();
  const phaseProgress = new PhaseProgress();

  const drawer = new Drawer((station) => {
    const worldMap: Record<string, string> = {
      'real-world': 'real-world',
      hardware: 'hardware',
      network: 'network',
    };
    const worldName = worldMap[station.world] ?? 'hardware';
    learningProgress.markWorldVisited(station.world);
    demoButton.updateStage();
    worldManager.switchTo(worldName);
  });

  drawer.setStations([
    { id: 'motherboard', icon: '🔌', label: '메인보드 (기판)', tag: '모든 부품을 연결하는 회로 기판', phase: 1, world: 'hardware' },
    { id: 'cpu', icon: '🖥️', label: 'CPU (중앙처리장치)', tag: '계산과 처리를 담당하는 핵심 칩', phase: 1, world: 'hardware' },
    { id: 'cache', icon: '📦', label: 'CPU 내장 캐시', tag: 'CPU 안의 가장 빠른 기억', phase: 1, world: 'hardware' },
    { id: 'ram', icon: '🗄️', label: 'RAM (메모리)', tag: '임시로 데이터를 보관하는 장치', phase: 1, world: 'hardware' },
    { id: 'storage', icon: '🏭', label: '저장장치 (SSD/HDD)', tag: '데이터를 영구 보관하는 장치', phase: 1, world: 'hardware' },
    { id: 'gpu', icon: '🎮', label: 'GPU (그래픽처리장치)', tag: '화면을 그리는 전문 칩', phase: 1, world: 'hardware' },
    { id: 'os', icon: '💻', label: '운영체제 (OS)', tag: '하드웨어를 관리하는 소프트웨어', phase: 1, world: 'hardware' },
    { id: 'dns', icon: '📍', label: 'DNS (이름서버)', tag: '이름을 주소로 변환하는 서버', phase: 2, world: 'network' },
    { id: 'router', icon: '🚦', label: '라우터 (공유기)', tag: '데이터 경로를 결정하는 장치', phase: 2, world: 'network' },
    { id: 'firewall', icon: '🛡️', label: '방화벽 (화재벽)', tag: '보안 위협을 차단하는 보안 장치', phase: 3, world: 'network' },
    { id: 'http', icon: '📜', label: 'HTTP (규약)', tag: '웹 데이터를 전송하는 통신 규칙', phase: 2, world: 'network' },
  ]);

  const [{ RealWorld }, { HardwareWorld }, { NetworkWorld }] = await Promise.all([
    import('./worlds/RealWorld.ts'),
    import('./worlds/HardwareWorld.ts'),
    import('./worlds/NetworkWorld.ts'),
  ]);

  const realWorld = new RealWorld();
  const hardwareWorld = new HardwareWorld();
  const networkWorld = new NetworkWorld();

  worldManager.addWorld(realWorld);
  worldManager.addWorld(hardwareWorld);
  worldManager.addWorld(networkWorld);

  const worlds = new Map<string, import('./core/World.ts').World>();
  worlds.set('real-world', realWorld);
  worlds.set('hardware', hardwareWorld);
  worlds.set('network', networkWorld);

  let dataFlowDemo: import('./flow/DataFlowDemo.ts').DataFlowDemo | null = null;

  const demoButton = createDemoButton(async () => {
    const currentSteps = getAvailableDemoSteps();
    if (currentSteps.length === 0) {
      toast.showHint('⚠️ 아직 방문한 월드가 없습니다. 먼저 Real World와 Hardware World를 탐험해보세요!', 4000);
      return;
    }
    if (!dataFlowDemo) {
      const { DataFlowDemo } = await import('./flow/DataFlowDemo.ts');
      dataFlowDemo = new DataFlowDemo(engine, worlds, worldManager);
    }
    await dataFlowDemo.run(currentSteps);
  });

  await worldManager.switchTo('real-world');
  learningProgress.markWorldVisited('real-world');
  demoButton.updateStage();
  phaseProgress.setPhase(1);

  const [{ InfoPanel }, { RelationshipDiagram }, { Intro }] = await Promise.all([
    import('./ui/InfoPanel.ts'),
    import('./ui/RelationshipDiagram.ts'),
    import('./ui/Intro.ts'),
  ]);

  new InfoPanel();
  new RelationshipDiagram();

  new Intro(() => {
    toast.showHint('💡 컴퓨터 본체를 클릭하면 하드웨어 월드로 진입합니다!', 6000);
    setTimeout(() => {
      toast.showHint('🖱️ 왼쪽 드래그로 맵 이동 · 오른쪽 드래그로 회전 · 스크롤로 확대/축소', 5000);
    }, 7000);
  });

  window.addEventListener('building-clicked', ((e: CustomEvent) => {
    const buildingName: string = e.detail.name;
    const stationId = NAME_TO_STATION[buildingName];
    if (stationId) {
      drawer.markVisited(stationId);
    }
    const visited = drawer.getVisitedCount();
    hud.setProgress(visited, 11);
    if (visited >= 11) {
      toast.showFinish();
    }

    const phase = BUILDING_PHASE[buildingName];
    if (phase) {
      phaseProgress.setPhase(phase);
    }
  }) as EventListener);

  window.addEventListener('character-clicked', ((e: CustomEvent) => {
    toast.showCharacterHint(e.detail.name, e.detail.hint);
  }) as EventListener);

  window.addEventListener('enter-interior', ((e: CustomEvent) => {
    worldManager.enterInterior(e.detail.name);
  }) as EventListener);

  window.addEventListener('demo-started', () => {
    toast.showHint('🔄 데이터 흐름 데모 시작! 컴퓨터가 로그인 요청을 처리하는 과정을 보여줍니다.', 4000);
  });
  window.addEventListener('demo-completed', () => {
    toast.showHint('✅ 데모 완료! 데이터가 컴퓨터 전체를 통과하는 과정을 확인했습니다.', 4000);
  });

  engine.start();
  } catch (err) {
    console.error('Game init error:', err);
  }
}

main().catch((err) => {
  console.error('Game init failed:', err);
});
