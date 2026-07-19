import { Engine } from './core/Engine.ts';
import { WorldManager } from './core/WorldManager.ts';
import { InfoPanel } from './ui/InfoPanel.ts';
import { HUD } from './ui/HUD.ts';
import { Intro } from './ui/Intro.ts';
import { Drawer } from './ui/Drawer.ts';
import { PhaseProgress } from './ui/PhaseProgress.ts';
import { Toast } from './ui/Toast.ts';
import { RelationshipDiagram } from './ui/RelationshipDiagram.ts';
import { RealWorld } from './worlds/RealWorld.ts';
import { HardwareWorld } from './worlds/HardwareWorld.ts';
import { NetworkWorld } from './worlds/NetworkWorld.ts';

const NAME_TO_STATION: Record<string, string> = {
  '사무실 (메인보드)': 'motherboard',
  '책상 (CPU)': 'desk',
  '책상 위 서랍 (캐시)': 'cache',
  '서류함 (RAM)': 'ram',
  '창고 (저장장치)': 'storage',
  '그래픽 공방 (GPU)': 'gpu',
  '경비실 (OS)': 'os',
  '우체국 (DNS)': 'dns',
  '교차로 (라우터)': 'router',
  '문 (방화벽)': 'firewall',
  'HTTP (데이터 전송)': 'http',
};

const BUILDING_PHASE: Record<string, number> = {
  '사무실 (메인보드)': 1,
  '책상 (CPU)': 1,
  '책상 위 서랍 (캐시)': 1,
  '서류함 (RAM)': 1,
  '창고 (저장장치)': 1,
  '그래픽 공방 (GPU)': 1,
  '경비실 (OS)': 1,
  '우체국 (DNS)': 2,
  '교차로 (라우터)': 2,
  '문 (방화벽)': 3,
  'HTTP (데이터 전송)': 2,
};

async function main(): Promise<void> {
  try {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  if (!canvas) { console.error('No canvas element found'); return; }
  const engine = new Engine(canvas);
  const worldManager = new WorldManager(engine);

  const toast = new Toast();
  const hud = new HUD();
  new InfoPanel();
  new RelationshipDiagram();
  const phaseProgress = new PhaseProgress();

  const drawer = new Drawer((station) => {
    const worldMap: Record<string, string> = {
      'real-world': 'real-world',
      hardware: 'hardware',
      network: 'network',
    };
    const worldName = worldMap[station.world] ?? 'hardware';
    worldManager.switchTo(worldName);
  });

  drawer.setStations([
    { id: 'motherboard', icon: '🏢', label: '사무실 (메인보드)', tag: '모든 부품이 연결되는 건물', phase: 1, world: 'hardware' },
    { id: 'desk', icon: '🖥️', label: '책상 (CPU)', tag: '중앙처리장치', phase: 1, world: 'hardware' },
    { id: 'cache', icon: '📦', label: '책상 아래 서랍 (캐시)', tag: '가장 빠름', phase: 1, world: 'hardware' },
    { id: 'ram', icon: '🗄️', label: '서류함 (RAM)', tag: '임시 기억', phase: 1, world: 'hardware' },
    { id: 'storage', icon: '🏭', label: '창고 (저장장치)', tag: '영구 보관', phase: 1, world: 'hardware' },
    { id: 'gpu', icon: '🎮', label: '그래픽 공방 (GPU)', tag: '화면을 그리는 전문가', phase: 1, world: 'hardware' },
    { id: 'os', icon: '🏢', label: '경비실 (OS)', tag: '운영체제', phase: 1, world: 'hardware' },
    { id: 'dns', icon: '📍', label: '우체국 (DNS)', tag: '이름 → 주소', phase: 2, world: 'network' },
    { id: 'router', icon: '🚦', label: '교차로 (라우터)', tag: '데이터 경로 결정', phase: 2, world: 'network' },
    { id: 'firewall', icon: '🛡️', label: '문 (방화벽)', tag: '보안 · 출입 통제', phase: 3, world: 'network' },
    { id: 'http', icon: '📜', label: 'HTTP (데이터 전송)', tag: '데이터 전송 규칙', phase: 2, world: 'network' },
  ]);

  const realWorld = new RealWorld();
  const hardwareWorld = new HardwareWorld();
  const networkWorld = new NetworkWorld();

  worldManager.addWorld(realWorld);
  worldManager.addWorld(hardwareWorld);
  worldManager.addWorld(networkWorld);

  await worldManager.switchTo('real-world');
  phaseProgress.setPhase(1);

  new Intro(() => {
    toast.showHint('💡 컴퓨터 본체를 클릭하면 하드웨어 월드로 진입합니다! 위의 ← 화살표를 따라 본체를 클릭해 보세요.', 6000);
    setTimeout(() => {
      toast.showHint('🖱️ 마우스 왼쪽 드래그로 맵 이동 · 오른쪽 드래그로 회전 · 스크롤로 확대/축소', 5000);
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

  engine.start();
  } catch (err) {
    console.error('Game init error:', err);
  }
}

main().catch((err) => {
  console.error('Game init failed:', err);
});
