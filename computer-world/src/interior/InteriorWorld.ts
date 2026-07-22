import * as THREE from 'three';
import { World } from '../core/World.ts';
import { Portal } from '../portal/Portal.ts';
import type { InteriorObject } from './InteriorObjects.ts';
import {
  createCpuCore,
  createALU,
  createRegister,
  createControlUnit,
  createCache,
  createMemorySlot,
  createMemoryCell,
  createDataShelf,
  createPlatter,
  createReadHead,
  createFirewallGate,
  createPacketInspector,
  createRuleTable,
  createShaderCore,
  createVRAM,
  createRoutingTable,
  createDNSDatabase,
  createHTTPStructure,
  createKernel,
  createScheduler,
  createMemoryManager,
  createCircuit,
} from './InteriorObjects.ts';

interface InteriorConfig {
  buildingName: string;
  roomColor: number;
  floorColor: number;
  objects: InteriorObject[];
}

const INTERIOR_CONFIGS: Record<string, InteriorConfig> = {
  'CPU (중앙처리장치)': {
    buildingName: 'CPU (중앙처리장치)',
    roomColor: 0x37474f,
    floorColor: 0x263238,
    objects: [
      { type: 'cpu-core', position: new THREE.Vector3(-1.5, 0, -1.5), label: '코어 1', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(-0.5, 0, -1.5), label: '코어 2', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(0.5, 0, -1.5), label: '코어 3', color: 0x4fc3f7 },
      { type: 'cpu-core', position: new THREE.Vector3(1.5, 0, -1.5), label: '코어 4', color: 0x4fc3f7 },
      { type: 'alu', position: new THREE.Vector3(-1.0, 0, 0), label: 'ALU (산술논리연산장치)', color: 0x7c4dff },
      { type: 'alu', position: new THREE.Vector3(1.0, 0, 0), label: 'ALU (산술논리연산장치)', color: 0x7c4dff },
      { type: 'control-unit', position: new THREE.Vector3(0, 0, 0), label: '제어장치 (CU)', color: 0xff6e40 },
      { type: 'register', position: new THREE.Vector3(0, 0, 1.2), label: '레지스터', color: 0x00e676 },
      { type: 'cache', position: new THREE.Vector3(0, 0, 2.2), label: '캐시 메모리', color: 0x2196f3 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 3), label: '내부 버스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  'RAM (메모리)': {
    buildingName: 'RAM (메모리)',
    roomColor: 0x455a64,
    floorColor: 0x37474f,
    objects: [
      { type: 'memory-slot', position: new THREE.Vector3(-1.8, 0, -1), label: '슬롯 A', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(-0.6, 0, -1), label: '슬롯 B', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(0.6, 0, -1), label: '슬롯 C', color: 0x607d8b },
      { type: 'memory-slot', position: new THREE.Vector3(1.8, 0, -1), label: '슬롯 D', color: 0x607d8b },
      { type: 'memory-cell', position: new THREE.Vector3(-1.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'memory-cell', position: new THREE.Vector3(-0.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'memory-cell', position: new THREE.Vector3(0.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'memory-cell', position: new THREE.Vector3(1.5, 0, 1), label: '메모리 셀 (capacitor)', color: 0x00e676 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 2.5), label: '주소 디코더 & 데이터 버스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '저장장치 (SSD/HDD)': {
    buildingName: '저장장치 (SSD/HDD)',
    roomColor: 0x5d4037,
    floorColor: 0x4e342e,
    objects: [
      { type: 'platter', position: new THREE.Vector3(-1.5, 0, -1), label: '플래터 (디스크)', color: 0x9e9e9e },
      { type: 'platter', position: new THREE.Vector3(-1.5, 0, 0), label: '플래터 (디스크)', color: 0x9e9e9e },
      { type: 'read-head', position: new THREE.Vector3(-1.5, 0, 1), label: '읽기/쓰기 헤드', color: 0x757575 },
      { type: 'data-shelf', position: new THREE.Vector3(0, 0, -1), label: 'SSD 컨트롤러', color: 0x2196f3 },
      { type: 'data-shelf', position: new THREE.Vector3(1.5, 0, -1), label: '캐시 버퍼', color: 0x4caf50 },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 1.5), label: 'SATA/M.2 인터페이스', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '방화벽 (화재벽)': {
    buildingName: '방화벽 (화재벽)',
    roomColor: 0xb71c1c,
    floorColor: 0x880e0e,
    objects: [
      { type: 'firewall-gate', position: new THREE.Vector3(0, 0, -2), label: '출입문', color: 0xc62828 },
      { type: 'packet-inspector', position: new THREE.Vector3(-1.5, 0, 0), label: '패킷 검사기', color: 0x1a237e },
      { type: 'rule-table', position: new THREE.Vector3(1.5, 0, 0), label: '규칙 테이블', color: 0x4a148c },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 2), label: '상태 테이블', color: 0x1a237e, size: new THREE.Vector3(2, 0, 1) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 2), label: '로그 기록', color: 0x1a237e, size: new THREE.Vector3(2, 0, 1) },
    ],
  },
  'GPU (그래픽처리장치)': {
    buildingName: 'GPU (그래픽처리장치)',
    roomColor: 0x1a237e,
    floorColor: 0x0d47a1,
    objects: [
      { type: 'shader-core', position: new THREE.Vector3(-1.5, 0, -1.5), label: '셰이더 코어 1', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(-0.5, 0, -1.5), label: '셰이더 코어 2', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(0.5, 0, -1.5), label: '셰이더 코어 3', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(1.5, 0, -1.5), label: '셰이더 코어 4', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(-1.5, 0, -0.5), label: '셰이더 코어 5', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(-0.5, 0, -0.5), label: '셰이더 코어 6', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(0.5, 0, -0.5), label: '셰이더 코어 7', color: 0x00e5ff },
      { type: 'shader-core', position: new THREE.Vector3(1.5, 0, -0.5), label: '셰이더 코어 8', color: 0x00e5ff },
      { type: 'vram', position: new THREE.Vector3(-1.2, 0, 1), label: 'VRAM (전용 메모리)', color: 0x7c4dff },
      { type: 'vram', position: new THREE.Vector3(0, 0, 1), label: 'VRAM (전용 메모리)', color: 0x7c4dff },
      { type: 'vram', position: new THREE.Vector3(1.2, 0, 1), label: 'VRAM (전용 메모리)', color: 0x7c4dff },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 2.2), label: '메모리 컨트롤러', color: 0x1a5c1a, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  '라우터 (공유기)': {
    buildingName: '라우터 (공유기)',
    roomColor: 0x004d40,
    floorColor: 0x00695c,
    objects: [
      { type: 'routing-table', position: new THREE.Vector3(0, 0, -1.5), label: '라우팅 테이블', color: 0x00897b },
      { type: 'packet-inspector', position: new THREE.Vector3(-1.5, 0, 0), label: 'NAT (주소 변환)', color: 0x00695c },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 0), label: 'DHCP 서버', color: 0x004d40, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1.5), label: '포트 포워딩', color: 0x004d40, size: new THREE.Vector3(2, 0, 1) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1.5), label: 'Wireless AP', color: 0x004d40, size: new THREE.Vector3(2, 0, 1) },
    ],
  },
  'DNS (이름서버)': {
    buildingName: 'DNS (이름서버)',
    roomColor: 0x311b92,
    floorColor: 0x4a148c,
    objects: [
      { type: 'dns-database', position: new THREE.Vector3(0, 0, -1.5), label: '도메인 데이터베이스', color: 0x7c4dff },
      { type: 'cache', position: new THREE.Vector3(-1.5, 0, 0), label: '리졸버 캐시', color: 0x00e676 },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 0), label: '쿼리 프로세서', color: 0x311b92, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(0, 0, 1.5), label: '레코드 테이블 (A, AAAA, CNAME)', color: 0x311b92, size: new THREE.Vector3(4, 0, 1) },
    ],
  },
  'HTTP (규약)': {
    buildingName: 'HTTP (규약)',
    roomColor: 0x1b5e20,
    floorColor: 0x2e7d32,
    objects: [
      { type: 'http-structure', position: new THREE.Vector3(0, 0, -1.5), label: 'HTTP 요청 (Request)', color: 0x4caf50 },
      { type: 'http-structure', position: new THREE.Vector3(0, 0, 0), label: 'HTTP 응답 (Response)', color: 0x2196f3 },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1), label: '헤더 (Headers)', color: 0x1b5e20, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1), label: '쿠키 & 세션', color: 0x1b5e20, size: new THREE.Vector3(2, 0, 1.5) },
    ],
  },
  'HTTPS (보안규약)': {
    buildingName: 'HTTPS (보안규약)',
    roomColor: 0x004d40,
    floorColor: 0x00695c,
    objects: [
      { type: 'http-structure', position: new THREE.Vector3(0, 0, -1.5), label: 'HTTPS 요청 (암호화)', color: 0x00c853 },
      { type: 'http-structure', position: new THREE.Vector3(0, 0, 0), label: 'HTTPS 응답 (암호화)', color: 0x00e676 },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1), label: 'TLS/SSL 핸드셰이크', color: 0x004d40, size: new THREE.Vector3(2, 0, 1.5) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1), label: '인증서 검증', color: 0x004d40, size: new THREE.Vector3(2, 0, 1.5) },
    ],
  },
  '운영체제 (OS)': {
    buildingName: '운영체제 (OS)',
    roomColor: 0x263238,
    floorColor: 0x37474f,
    objects: [
      { type: 'kernel', position: new THREE.Vector3(0, 0, -1.5), label: '커널 (Kernel)', color: 0xff5252 },
      { type: 'scheduler', position: new THREE.Vector3(-1.5, 0, 0), label: '스케줄러 (Scheduler)', color: 0x2196f3 },
      { type: 'memory-manager', position: new THREE.Vector3(1.5, 0, 0), label: '메모리 관리자', color: 0x4caf50 },
      { type: 'circuit', position: new THREE.Vector3(-1.5, 0, 1.5), label: '파일 시스템', color: 0x263238, size: new THREE.Vector3(2, 0, 1) },
      { type: 'circuit', position: new THREE.Vector3(1.5, 0, 1.5), label: 'I/O 관리자', color: 0x263238, size: new THREE.Vector3(2, 0, 1) },
    ],
  },
};

interface InteriorComponent {
  name: string;
  desc: string;
  color: string;
}

interface InteriorInfo {
  title: string;
  subtitle: string;
  icon: string;
  components: InteriorComponent[];
  keyInsight: string;
}

const INTERIOR_INFOS: Record<string, InteriorInfo> = {
  'CPU (중앙처리장치)': {
    title: 'CPU 내부 구조',
    subtitle: '컴퓨터의 두뇌 — 명령어를 처리하는 핵심',
    icon: '🖥️',
    components: [
      { name: '코어 (Core)', desc: '명령어를 실제로 처리하는 핵심 장치. 코어가 많을수록 동시에 여러 작업 가능', color: '#4fc3f7' },
      { name: 'ALU (산술논리연산장치)', desc: '숫자를 더하고 빼고 비교하는 실제 계산을 수행', color: '#7c4dff' },
      { name: '제어장치 (CU)', desc: '어떤 명령어를 언제 실행할지 지시를 내리는 지휘자', color: '#ff6e40' },
      { name: '레지스터 (Register)', desc: '지금 당장 쓸 데이터를 잠시 보관하는 가장 작은 저장소', color: '#00e676' },
      { name: '캐시 메모리 (Cache)', desc: '자주 쓰는 데이터를 미리 가져다 놓는 빠른 저장소 (L1/L2/L3)', color: '#2196f3' },
    ],
    keyInsight: 'CPU는 클럭(Clock) 속도에 맞춰 매초 수억 번 명령어를 실행합니다. 코어가 많을수록 동시에 처리할 수 있는 작업이 늘어납니다.',
  },
  'RAM (메모리)': {
    title: 'RAM 내부 구조',
    subtitle: '컴퓨터의 단기 기억 — 지금 당장 필요한 데이터 보관소',
    icon: '🗄️',
    components: [
      { name: '메모리 슬롯 (DIMM Slot)', desc: '메모리 모듈이 꽂히는 슬롯. 여러 개를 사용하면 용량을 늘릴 수 있음', color: '#607d8b' },
      { name: '메모리 셀 (Memory Cell)', desc: '데이터를 임시로 저장하는 캐퍼시터. 전기가 사라지면 데이터도 사라짐', color: '#00e676' },
      { name: '주소 디코더 & 데이터 버스', desc: 'CPU가 요청한 데이터의 위치를 찾아주는 안내원', color: '#1a5c1a' },
    ],
    keyInsight: 'RAM은 전원이 꺼지면 데이터가 모두 사라지는 휘발성(Volatile) 메모리입니다. 그래서 RAM은 "단기 기억"이라고 불립니다.',
  },
  '저장장치 (SSD/HDD)': {
    title: '저장장치 내부 구조',
    subtitle: '컴퓨터의 장기 기억 — 영구 데이터 보관소',
    icon: '🏭',
    components: [
      { name: '플래터 (Platter)', desc: 'HDD의 원형 디스크. 데이터가 자기적으로 기록됨', color: '#9e9e9e' },
      { name: '읽기/쓰기 헤드', desc: '디스크 위를 돌아다니며 데이터를 읽거나 씀', color: '#757575' },
      { name: 'SSD 컨트롤러', desc: 'SSD의 데이터 관리자. 어디에 저장했는지 기록', color: '#2196f3' },
      { name: '캐시 버퍼', desc: '자주 쓰는 데이터를 임시 보관하는 SSD 내부 캐시', color: '#4caf50' },
    ],
    keyInsight: 'SSD는 플래시 메모리를 사용하여 HDD보다 훨씬 빠르지만, HDD는 같은 가격에 훨씬 많은 용량을 제공합니다.',
  },
  '방화벽 (화재벽)': {
    title: '방화벽 내부 구조',
    subtitle: '컴퓨터의 보안 경비원 — 출입 통제 시스템',
    icon: '🛡️',
    components: [
      { name: '출입문 (Gateway)', desc: '모든 데이터가 들어가는 유일한 입구', color: '#c62828' },
      { name: '패킷 검사기', desc: '들어오는 데이터 패킷을 하나하나 분석하는 심사관', color: '#1a237e' },
      { name: '규칙 테이블', desc: '어떤 데이터를 허용하고 막을지 정한 규칙 목록', color: '#4a148c' },
    ],
    keyInsight: '방화벽은 "패킷 필터링"이라는 기술로 들어오는 데이터를 검사합니다. 허용된 포트와 프로토콜만 통과시킵니다.',
  },
  'GPU (그래픽처리장치)': {
    title: 'GPU 내부 구조',
    subtitle: '화면을 그리는 전문가 — 수천 개의 연산 코어',
    icon: '🎮',
    components: [
      { name: '셰이더 코어 (Shader Core)', desc: '화면의 작은 영역을 동시에 그리는 전문 연산 장치. 수천 개가 존재', color: '#00e5ff' },
      { name: 'VRAM (전용 메모리)', desc: '그래픽 데이터를 보관하는 GPU 전용 메모리. CPU의 RAM과 별도', color: '#7c4dff' },
      { name: '메모리 컨트롤러', desc: 'VRAM과 셰이더 코어 사이의 데이터 흐름을 관리', color: '#1a5c1a' },
    ],
    keyInsight: 'GPU는 수천 개의 작은 코어로 구성되어 있어, CPU보다 적은 수의 명령어를 매우 많은 데이터에 동시에 적용할 수 있습니다.',
  },
  '라우터 (공유기)': {
    title: '라우터 내부 구조',
    subtitle: '데이터의 교차로 — 경로를 결정하는 장치',
    icon: '🚦',
    components: [
      { name: '라우팅 테이블', desc: '데이터가 갈 경로를 기록한 지도. 가장 빠른 경로를 선택', color: '#00897b' },
      { name: 'NAT (주소 변환)', desc: '내부 주소를 외부 주소로 변환하는 통역사', color: '#00695c' },
      { name: 'DHCP 서버', desc: '각 기기에 IP 주소를 자동으로 할당하는 관리자', color: '#004d40' },
    ],
    keyInsight: '라우터는 라우팅 테이블을 참고하여 데이터의 다음 목적지를 결정합니다. 집 안의 공유기도 하나의 라우터입니다.',
  },
  'DNS (이름서버)': {
    title: 'DNS 내부 구조',
    subtitle: '인터넷의 전화번호부 — 이름을 주소로 변환',
    icon: '📍',
    components: [
      { name: '도메인 데이터베이스', desc: '모든 도메인과 IP 주소의 연결 정보 보관', color: '#7c4dff' },
      { name: '리졸버 캐시', desc: '자주 찾는 도메인의 결과를 임시 보관하여 빠르게 응답', color: '#00e676' },
      { name: '쿼리 프로세서', desc: 'DNS 요청을 처리하는 분석관', color: '#311b92' },
    ],
    keyInsight: 'DNS는 "도메인 이름"을 "IP 주소"로 변환합니다. DNS가 없으면 웹사이트 이름을 입력해도 접속할 수 없습니다.',
  },
  'HTTP (규약)': {
    title: 'HTTP 내부 구조',
    subtitle: '웹의 기본 언어 — 요청과 응답의 규칙',
    icon: '📜',
    components: [
      { name: 'HTTP 요청 (Request)', desc: '브라우저가 서버에게 보내는 메시지. GET, POST 등의 메서드 사용', color: '#4caf50' },
      { name: 'HTTP 응답 (Response)', desc: '서버가 브라우저에게 돌려보내는 결과. 상태 코드 포함', color: '#2196f3' },
      { name: '헤더 (Headers)', desc: '요청과 응답에 부가되는 부가 정보', color: '#1b5e20' },
      { name: '쿠키 & 세션', desc: '사용자를 기억하기 위한 임시 데이터', color: '#1b5e20' },
    ],
    keyInsight: 'HTTP는 "클라이언트-서버" 모델로 작동합니다. 브라우저(클라이언트)가 요청하면, 서버가 응답합니다.',
  },
  'HTTPS (보안규약)': {
    title: 'HTTPS 내부 구조',
    subtitle: '보안 웹 통신 — 암호화된 데이터 전송',
    icon: '🔒',
    components: [
      { name: 'HTTPS 요청 (암호화)', desc: 'HTTP 요청을 TLS로 암호화하여 전송', color: '#00c853' },
      { name: 'HTTPS 응답 (암호화)', desc: '서버의 응답을 TLS로 암호화하여 반환', color: '#00e676' },
      { name: 'TLS/SSL 핸드셰이크', desc: '브라우저와 서버가 암호화 키를 교환하는 과정', color: '#004d40' },
      { name: '인증서 검증', desc: '서버의 SSL 인증서가 유효한지 확인하는 과정', color: '#004d40' },
    ],
    keyInsight: 'HTTPS는 HTTP + TLS/SSL 암호화의 조합입니다. 중간에 가로채더라도 데이터 내용을 해독할 수 없습니다.',
  },
  '운영체제 (OS)': {
    title: '운영체제 내부 구조',
    subtitle: '컴퓨터의 총괄 관리자 — 하드웨어와 프로그램 사이의 중재자',
    icon: '💻',
    components: [
      { name: '커널 (Kernel)', desc: '운영체제의 핵심. 하드웨어와 직접 소통하는 가장 중요한 부분', color: '#ff5252' },
      { name: '스케줄러 (Scheduler)', desc: '어떤 프로그램이 다음에 실행될지 결정하는 관리자', color: '#2196f3' },
      { name: '메모리 관리자', desc: 'RAM 사용량을 관리하고 프로그램들에게 나눠주는 담당자', color: '#4caf50' },
    ],
    keyInsight: '운영체제는 CPU의 시간을 아주 작은 단위(타임 슬라이스)로 나눠서 여러 프로그램에게 골고루 배분합니다(시분할).',
  },
};

export class InteriorWorld extends World {
  private portals: Portal[] = [];
  private previousWorld: string;
  private config: InteriorConfig;
  private animatedChips: THREE.Mesh[] = [];

  constructor(buildingName: string, previousWorld: string) {
    super('interior', `${buildingName} 내부`);
    this.previousWorld = previousWorld;
    this.config = INTERIOR_CONFIGS[buildingName] ?? this.createFallbackConfig(buildingName);
  }

  private createFallbackConfig(name: string): InteriorConfig {
    return {
      buildingName: name,
      roomColor: 0x455a64,
      floorColor: 0x37474f,
      objects: [
        { type: 'circuit', position: new THREE.Vector3(0, 0, 0), label: name, color: 0x1a5c1a, size: new THREE.Vector3(3, 0, 2) },
      ],
    };
  }

  build(): void {
    this.buildRoom();
    this.buildObjects();
    this.buildPortal();

    window.dispatchEvent(new CustomEvent('interiorEnter', { detail: { buildingName: this.config.buildingName } }));
  }

  onEnter(): void {}
  onExit(): void {
    this.animatedChips = [];
  }

  private buildRoom(): void {
    (this.scene as THREE.Scene).background = new THREE.Color(this.config.roomColor);
    (this.scene as THREE.Scene).fog = new THREE.Fog(this.config.roomColor, 15, 40);

    const ground = this.scene.getObjectByName('ground') as THREE.Mesh;
    if (ground) {
      ground.material = new THREE.MeshStandardMaterial({ color: this.config.floorColor, roughness: 0.8 });
    }

    const wallMat = new THREE.MeshStandardMaterial({ color: this.config.roomColor, roughness: 0.7 });
    const walls = [
      { size: [8, 3, 0.15] as [number, number, number], pos: [0, 1.5, -4] as [number, number, number] },
      { size: [8, 3, 0.15] as [number, number, number], pos: [0, 1.5, 4] as [number, number, number] },
      { size: [0.15, 3, 8] as [number, number, number], pos: [-4, 1.5, 0] as [number, number, number] },
      { size: [0.15, 3, 8] as [number, number, number], pos: [4, 1.5, 0] as [number, number, number] },
    ];
    for (const w of walls) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(...w.size), wallMat);
      wall.position.set(...w.pos);
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.scene.add(wall);
    }

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: this.config.roomColor, roughness: 0.9 }),
    );
    ceiling.position.y = 3;
    this.scene.add(ceiling);

    const light = new THREE.PointLight(0xffffff, 0.8, 15);
    light.position.set(0, 2.5, 0);
    this.scene.add(light);
  }

  private buildObjects(): void {
    for (const obj of this.config.objects) {
      let mesh: THREE.Group;
      switch (obj.type) {
        case 'cpu-core':
          mesh = createCpuCore(obj);
          const chip = mesh.children[0] as THREE.Mesh;
          if (chip) this.animatedChips.push(chip);
          break;
        case 'alu':
          mesh = createALU(obj);
          break;
        case 'register':
          mesh = createRegister(obj);
          break;
        case 'control-unit':
          mesh = createControlUnit(obj);
          break;
        case 'cache':
          mesh = createCache(obj);
          break;
        case 'memory-slot':
          mesh = createMemorySlot(obj);
          break;
        case 'memory-cell':
          mesh = createMemoryCell(obj);
          break;
        case 'data-shelf':
          mesh = createDataShelf(obj);
          break;
        case 'platter':
          mesh = createPlatter(obj);
          break;
        case 'read-head':
          mesh = createReadHead(obj);
          break;
        case 'firewall-gate':
          mesh = createFirewallGate(obj);
          break;
        case 'packet-inspector':
          mesh = createPacketInspector(obj);
          break;
        case 'rule-table':
          mesh = createRuleTable(obj);
          break;
        case 'shader-core':
          mesh = createShaderCore(obj);
          const coreLed = mesh.children[1] as THREE.Mesh;
          if (coreLed) this.animatedChips.push(coreLed);
          break;
        case 'vram':
          mesh = createVRAM(obj);
          break;
        case 'routing-table':
          mesh = createRoutingTable(obj);
          break;
        case 'dns-database':
          mesh = createDNSDatabase(obj);
          break;
        case 'http-structure':
          mesh = createHTTPStructure(obj);
          break;
        case 'kernel':
          mesh = createKernel(obj);
          break;
        case 'scheduler':
          mesh = createScheduler(obj);
          break;
        case 'memory-manager':
          mesh = createMemoryManager(obj);
          break;
        case 'circuit':
          mesh = createCircuit(obj);
          break;
        default:
          mesh = createCircuit(obj);
      }
      this.scene.add(mesh);
    }

    this.animatedObjects.push({
      update: (t) => {
        for (const chip of this.animatedChips) {
          (chip.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + 0.3 * Math.sin(t * 2);
        }
      },
    });
  }

  private buildPortal(): void {
    const portal = new Portal({
      name: '나가기',
      position: new THREE.Vector3(0, 0, -3),
      targetWorld: this.previousWorld,
      color: 0xffd93d,
    });
    this.portals.push(portal);
    this.scene.add(portal.group);
    this.animatedObjects.push({ update: (t) => portal.update(t) });
  }

  static getInteriorInfo(buildingName: string): InteriorInfo | null {
    return INTERIOR_INFOS[buildingName] ?? null;
  }

  static hasInterior(buildingName: string): boolean {
    return buildingName in INTERIOR_CONFIGS;
  }

  getPreviousWorld(): string {
    return this.previousWorld;
  }
}
