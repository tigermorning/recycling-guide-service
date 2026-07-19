interface BuildingDescription {
  name: string;
  tag: string;
  icon: string;
  what: string;
  why: string;
  how: string;
  relationships: string[];
  systemContext: string;
  hasInterior?: boolean;
}

const BUILDING_DESCRIPTIONS: Record<string, BuildingDescription> = {
  '메인보드 (기판)': {
    name: '메인보드 (기판)',
    tag: '모든 부품을 연결하는 회로 기판',
    icon: '🔌',
    what: '메인보드(Mainboard, 마더보드)는 컴퓨터 안의 모든 부품이 서로 이야기할 수 있게 해주는 큰 회로 기판입니다. 기술 용어로는 PWB(Printed Wired Board, 인쇄 배선 회로)라고도 합니다. 여러분이 지금 보고 있는 이 세계의 모든 부품—CPU, 캐시, RAM, 저장장치—이 모두 이 초록색 기판 위의 금색 배선(Trace)을 통해 서로 연결되어 있습니다.',
    why: '컴퓨터는 하나의 부품으로 만들어지지 않습니다. CPU, 메모리(Memory), 저장장치 등 여러 부품이 각자의 역할을 합니다. 그런데 이 부품들이 서로 대화할 수 없으면 아무 일도 일어나지 않습니다. 메인보드는 이 모든 부품을 하나로 연결하는 회로 기판입니다. 부품들은 메인보드 위의 배선(Trace)을 통해 서로 데이터를 주고받습니다.',
    how: '메인보드는 초록색 기판(PCB, Printed Circuit Board) 위에 수많은 금색 배선(Trace)이 그어져 있습니다. 이 배선들이 부품들이 서로 대화하는 통로입니다. CPU를 꽂는 소켓(Socket), RAM을 꽂는 슬롯(Slot), 저장장치를 연결하는 SATA 포트 등이 모두 이 판 위에 있습니다. 배선이 곧 도로이고, 부품들이 곧 건물인 셈입니다.',
    relationships: ['CPU는 메인보드의 소켓(Socket)에 꽂혀 있고, 이 배선(Trace)을 통해 RAM과 대화합니다', 'RAM은 메인보드의 DIMM 슬롯에 꽂혀 있어 CPU가 부르면 바로 응답합니다', '저장장치는 메인보드의 SATA 포트에 연결되어 있어 파일을 보관하고 꺼냅니다', 'GPU는 메인보드의 PCIe 슬롯에 꽂혀 화면 그리는 일을 돕습니다'],
    systemContext: '메인보드가 없으면 부품들은 각자 섬처럼 고립됩니다. CPU는 RAM에 접근할 수 없고, 저장장치는 데이터를 보낼 수 없습니다. 메인보드는 컴퓨터의 뼈대이자 골격이며, 모든 부품이 하나의 시스템으로 작동하게 만드는 기반입니다.',
  },
  'CPU (중앙처리장치)': {
    name: 'CPU (중앙처리장치)',
    tag: '계산과 처리를 담당하는 핵심 칩',
    icon: '🖥️',
    what: 'CPU(Central Processing Unit, 중앙처리장치)는 컴퓨터의 두뇌입니다. "2 더하기 2는 4"처럼 단순한 계산부터, 게임을 실행하거나 동영상을 재생하는 것처럼 복잡한 작업까지, 컴퓨터가 하는 모든 일이 이 칩 안에서 일어납니다.',
    why: '컴퓨터는 매 순간 수백만 번의 연산을 합니다. "이 글자를 화면에 보여줘", "이 버튼을 누르면 무엇을 해야 하지?", "이 사진의 색상을 바꿔줘" 같은 지시가 쉴 새 없이 쏟아집니다. CPU가 없으면 이 모든 계산을 할 수 있는 장치가 없어집니다.',
    how: 'CPU 안에는 여러 핵심 부품이 있습니다: ALU(Arithmetic Logic Unit, 산술논리연산장치)는 숫자를 더하고 빼는 연산을 수행합니다. 제어장치(Control Unit, CU)는 "이제 이 명령어를 실행해"라고 지시를 내립니다. 레지스터(Register)는 지금 당장 필요한 데이터를 잠시 보관하는 작고 빠른 저장소입니다. 캐시(Cache)는 자주 쓰는 데이터를 미리 가져다 놓는 저장소입니다. 코어(Core)가 많을수록 동시에 여러 명령어를 처리할 수 있습니다. 이 모든 과정은 클럭(Clock, 컴퓨터의 심장 박동) 속도에 맞춰 매초 수억 번 반복됩니다.',
    relationships: ['ALU(산술논리연산장치)는 숫자를 더하고 빼고 곱하는 실제 계산을 수행합니다', '제어장치(CU)는 어떤 명령어를 언제 실행할지 결정합니다', '레지스터(Register)는 지금 당장 쓸 데이터를 잠시 보관합니다', '캐시(Cache)는 자주 쓰는 데이터를 미리 가져다 둡니다', 'CPU가 데이터가 필요하면, 먼저 자기 안에 있는 캐시(Cache)에서 찾습니다', '캐시에 없으면 RAM에서 가져옵니다', 'CPU는 메인보드의 배선(Trace)을 통해 모든 부품과 대화합니다', '운영체제(OS)는 CPU의 시간을 여러 프로그램에게 골고루 나눠줍니다(스케줄링)'],
    systemContext: 'CPU는 컴퓨터 시스템의 중심입니다. 프로그램은 결국 CPU가 실행하는 명령어(Instruction)들의 나열입니다. CPU가 빠르면 컴퓨터 전체가 빨라지고, CPU가 느리면 아무리 좋은 부품이 있어도 컴퓨터가 느립니다. CPU의 성능은 클럭 주파수(Clock Speed, GHz)와 IPC(Instructions Per Cycle)로 측정합니다. CPU 내부를 들어가면 ALU, 제어장치, 레지스터, 캐시를 확인할 수 있습니다.',
    hasInterior: true,
  },
  'CPU 내장 캐시': {
    name: 'CPU 내장 캐시',
    tag: 'CPU 칩 안에 내장된 가장 빠른 기억',
    icon: '📦',
    what: '캐시(Cache)는 CPU 칩 안에 직접 내장된 아주 작은 저장소입니다. 기술적으로는 SRAM(Static RAM)으로 만들어져 있어 매우 빠르지만 용량이 작습니다. CPU가 자주 쓰는 데이터를 여기에 두면, 매번 멀리 있는 RAM까지 갈 필요 없이 바로 꺼낼 수 있습니다.',
    why: 'CPU는 아주 빠르게 일합니다. 그런데 데이터를 가져오는 곳이 느리면 CPU가 기다려야 합니다. RAM에서 데이터를 가져오는 데 시간이 걸리면, CPU는 그 시간 동안 놀게 됩니다(이것을 버블, Bubble이라고 합니다). 캐시는 CPU의 속도에 맞춰 데이터를 바로바로 공급함으로써 이 문제를 해결합니다.',
    how: 'CPU 안의 캐시는 세 단계로 나뉩니다 (CPU 내부를 들어가면 확인할 수 있습니다): L1 캐시(가장 작고 가장 빠름, 각 코어 안에 있음, 초록색) → L2 캐시(조금 크고 조금 느림, 코어 옆, 파란색) → L3 캐시(가장 크고 가장 느림, 여러 코어가 공유, 보라색). CPU가 어떤 데이터를 필요로 하면, 먼저 L1에서 찾고, 없으면 L2로, 그래도 없으면 L3로, 마지막으로 RAM에서 가져옵니다. 거기 있으면 바로 꺼내 씁니다(히트, Hit). 거기 없으면 RAM에서 가져와서 캐시에도 복사해 둡니다(미스, Miss). 그러면 다음에 또 필요할 때는 바로 꺼낼 수 있습니다.',
    relationships: ['L1 캐시는 각 CPU 코어 안에 직접 내장되어 있습니다(가장 빠름)', 'L2 캐시는 CPU 코어 옆에 있습니다(L1보다 느리지만 더 큼)', 'L3 캐시는 모든 코어가 공유합니다(L2보다 느리지만 가장 큼)', '캐시에 데이터가 없으면(미스, Miss) RAM에서 가져옵니다', 'RAM은 캐시보다 약 100배 느리지만, 훨씬 많은 데이터를 보관할 수 있습니다', '캐시에 자주 쓰는 데이터가 있으면(히트율, Hit Rate가 높으면) 컴퓨터가 훨씬 빨라집니다'],
    systemContext: '컴퓨터의 메모리는 계층 구조(Memory Hierarchy)로 되어 있습니다. CPU 안의 캐시(가장 빠름) → CPU 밖의 RAM(중간) → 저장장치(가장 느림) 순으로, 속도와 용량 사이의 절충안입니다. 이 계층 덕분에 컴퓨터는 빠르면서도 많은 데이터를 처리할 수 있습니다. CPU 내부의 캐시는 초록색(L1), 파란색(L2), 보라색(L3)으로 구분되어 있습니다.',
  },
  'RAM (메모리)': {
    name: 'RAM (메모리)',
    tag: '임시로 데이터를 보관하는 장치',
    icon: '🗄️',
    what: 'RAM(Random Access Memory, 랜덤액세스메모리)은 컴퓨터가 지금 당장 사용하는 것들을 보관하는 곳입니다. 웹 브라우저를 열면, 게임을 실행하면, 음악을 틀면, 그 프로그램들의 데이터가 모두 RAM에 올라갑니다. 기술적으로는 DRAM(Dynamic RAM)이라는 종류가 주로 사용됩니다.',
    why: '저장장치는 느립니다. 프로그램을 실행할 때마다 저장장치에서 데이터를 가져오면 너무 느릴 것입니다. 그래서 CPU 근처에 빠른 임시 저장소가 필요합니다. RAM이 그 역할을 합니다. 하지만 주의할 점이 하나 있습니다: 전원이 꺼지면 RAM의 내용은 모두 사라집니다(휘발성, Volatile).',
    how: '프로그램을 실행하면, 저장장치에 있는 프로그램 파일이 RAM으로 복사됩니다. CPU는 RAM에서 명령어(Instruction)를 읽어 실행합니다. 작업이 끝나면 RAM에서 지워지고, 결과만 저장장치에 영구 보관됩니다.',
    relationships: ['RAM은 CPU보다 느리지만, 저장장치보다는 훨씬 빠릅니다', 'CPU가 필요하면 RAM에서 데이터를 가져가서 처리합니다', 'RAM에 보관된 데이터는 전원이 꺼지면 모두 사라집니다(휘발성, Volatile)', '운영체제(OS)는 RAM의 여유 공간을 여러 프로그램에게 나눠줍니다(메모리 할당, Memory Allocation)'],
    systemContext: 'RAM은 컴퓨터의 단기 기억입니다. 충분한 RAM이 있으면 여러 프로그램을 동시에 쾌적하게 사용할 수 있습니다(멀티태스킹, Multitasking). RAM이 부족하면 프로그램이 느려지거나 아예 실행되지 않을 수 있습니다. 컴퓨터를 살 때 RAM 용량(예: 8GB, 16GB)을 확인하는 것이 중요한 이유입니다.',
    hasInterior: true,
  },
  '저장장치 (SSD/HDD)': {
    name: '저장장치 (SSD/HDD)',
    tag: '데이터를 영구 보관하는 장치',
    icon: '🏭',
    what: '저장장치(Storage)는 컴퓨터의 장기 기억입니다. 여러분이 작성한 문서, 찍은 사진, 설치한 프로그램, 내려받은 영화 등 모든 파일이 여기에 영구적으로 보관됩니다. 비휘발성(Non-Volatile) 메모리라 전원이 꺼져도 데이터가 사라지지 않습니다.',
    why: 'RAM은 전원이 꺼지면 내용이 모두 사라집니다(휘발성, Volatile). 그렇다면 "컴퓨터를 껐다가 다시 켜면 어떻게 하지?"라는 의문이 듭니다. 답은 저장장치입니다. 저장장치는 전원 없이도 데이터를 안전하게 보관합니다.',
    how: '저장장치는 메인보드에서 케이블(SATA 또는 M.2 연결)로 분리된 별도 장치입니다. 파일을 저장하면, 저장장치 안의 플래시 메모리(Flash Memory, NAND) 또는 자기 디스크(Magnetic Disk)에 기록됩니다. 컴퓨터를 껐다가 다시 켜도 저장장치의 파일은 그대로 남아 있습니다. SSD(Solid State Drive)는 빠르고 내구성이 좋고, HDD(Hard Disk Drive)는 느리지만 넓어서 많은 파일을 보관합니다.',
    relationships: ['저장장치는 메인보드에 케이블로 연결된 별도 장치입니다(메인보드 위에 붙어있지 않음)', '저장장치는 RAM보다 느리지만, 데이터가 사라지지 않습니다(비휘발성, Non-Volatile)', '프로그램은 저장장치에 설치되고, 실행될 때 RAM으로 복사됩니다(로딩, Loading)', '운영체제(OS)도 저장장치에 저장되어 있다가 부팅 시 RAM으로 로드됩니다'],
    systemContext: '저장장치는 컴퓨터의 장기 기억입니다. 만약 저장장치가 없다면, 컴퓨터를 껐다가 다시 켤 때 모든 프로그램과 파일이 사라질 것입니다. 중요한 데이터는 저장장치에 보관하고, 백업(Backup)도 준비하는 것이 좋습니다.',
    hasInterior: true,
  },
  'GPU (그래픽처리장치)': {
    name: 'GPU (그래픽처리장치)',
    tag: '화면을 그리는 전문 칩',
    icon: '🎮',
    what: 'GPU(Graphics Processing Unit, 그래픽처리장치)는 컴퓨터 화면에 보이는 모든 것을 그리는 전문가입니다. 게임의 화면, 동영상, 웹사이트의 이미지, 3D 애니메이션—all GPU가 그립니다.',
    why: '화면에는 수백만 개의 작은 점(픽셀, Pixel)이 있습니다. 각 픽셀의 색상을 하나하나 계산하려면 엄청난 연산이 필요합니다. CPU는 이런 반복적인 대량 연산에 적합하지 않습니다. GPU는 수천 개의 작은 계산 장치(코어, Core)를 동시에 사용해 이 일을 효율적으로 처리합니다.',
    how: 'GPU는 메인보드의 PCIe 슬롯에 꽂히는 확장 카드입니다. 카드 형태로 보드에 수직으로 꽂히며, 안에 수천 개의 셰이더 코어(Shader Core)가 들어 있습니다. 각 셰이더 코어가 화면의 작은 영역을 담당하여 동시에 색상을 계산합니다(렌더링, Rendering). GPU에는 전용 메모리 VRAM(Video RAM)이 있어 대량의 그래픽 데이터를 보관합니다. GPU 내부를 들어가면 셰이더 코어들이 격자 형태로 배치되어 있고, VRAM 칩들이 옆에 있는 것을 확인할 수 있습니다.',
    relationships: ['GPU는 메인보드의 PCIe 슬롯에 꽂히는 별도의 확장 카드입니다', '셰이더 코어(Shader Core)는 수천 개가 있어 동시에 많은 연산을 수행합니다', 'VRAM(Video RAM)은 그래픽 전용 메모리로, CPU의 RAM과 별도입니다', 'GPU는 CPU의 지시를 받아 화면을 렌더링(Rendering)합니다', '게임, 영상 편집, 인공지능(AI) 학습 등에 활용됩니다'],
    systemContext: 'GPU는 컴퓨터의 그래픽 전문가입니다. 게임을 하거나 3D 작업을 할 때 GPU의 성능이 중요합니다. 최근에는 인공지능(AI) 학습에도 활용되면서 CPU만큼 중요해지고 있습니다. "GPU가 좋으면 게임이 부드럽다"는 말이 있는 이유입니다. GPU 내부를 들어가면 수백 개의 셰이더 쎔어와 VRAM 칩을 볼 수 있습니다.',
    hasInterior: true,
  },
  '운영체제 (OS)': {
    name: '운영체제 (OS)',
    tag: '하드웨어를 관리하는 소프트웨어',
    icon: '💻',
    what: '운영체제(Operating System, OS)는 컴퓨터의 총괄 관리자입니다. CPU, 메모리(RAM), 저장장치 등 모든 하드웨어를 관리하고, 프로그램들에게 "너는 이만큼 써", "이제 네 차례야"라고 자원을 나눠줍니다.',
    why: '여러 프로그램이 동시에 컴퓨터를 사용하려고 하면 문제가 생깁니다. 브라우저도 CPU를 쓰고 싶고, 음악 프로그램도 CPU를 쓰고 싶습니다. 운영체제가 없으면 이 프로그램들이 서로 CPU를 차지하려고 다투게 됩니다. 운영체제는 이 싸움을 중재합니다.',
    how: '운영체제는 CPU의 시간을 아주 작은 단위(타임 슬라이스, Time Slice)로 나눠서 여러 프로그램에게 골고루 배분합니다. 이 개념을 시분할(Time Sharing)이라고 합니다. 1초에 수백 번씩 "이제 브라우저 차례", "이제 음악 프로그램 차례"를 번갈아 실행하기 때문에, 사용자는 마치 여러 프로그램이 동시에 돌아가는 것처럼 느낍니다. 운영체제가 "누구에게 얼마큼 줄지" 결정하는 것을 스케줄링(Scheduling)이라고 합니다. 이렇게 여러 일을 동시에 처리하는 것을 멀티태스킹(Multitasking)이라고 합니다. 또한, 파일을 열 때는 저장장치에서 찾아 RAM에 올리고(로딩, Loading), 키보드를 누를 때는 그 입력을 처리합니다. 운영체제의 핵심은 커널(Kernel)이며, 하드웨어와 프로그램 사이에서 중재자 역할을 합니다. OS 내부를 들어가면 커널, 스케줄러, 메모리 관리자 등 핵심 구성 요소들을 확인할 수 있습니다.',
    relationships: ['운영체제(OS)는 CPU의 시간을 아주 작은 단위(타임 슬라이스)로 나눠 여러 프로그램에게 골고루 배분합니다(시분할, Time Sharing)', '어느 프로그램에게 다음 시간 슬라이스를 줄지 결정하는 것을 스케줄링(Scheduling)이라고 합니다', '여러 프로그램이 동시에 돌아가는 것처럼 보이는 것을 멀티태스킹(Multitasking)이라고 합니다', '커널(Kernel)은 운영체제의 핵심으로, 하드웨어와 직접 소통합니다', '스케줄러(Scheduler)는 어떤 프로그램이 다음에 실행될지 결정합니다', '메모리 관리자(Memory Manager)는 RAM 사용량을 관리합니다', '운영체제는 파일 시스템(File System)과 I/O도 관리합니다'],
    systemContext: '운영체제는 컴퓨터 시스템의 총괄 관리자입니다. Windows, macOS, Linux 등이 대표적인 운영체제입니다. 운영체제가 없으면 프로그램은 하드웨어에 직접 접근할 수 없어 작동이 불가능합니다. 컴퓨터를 켜면 가장 먼저 운영체제가 로드(Loading)됩니다. OS 내부를 들어가면 커널, 스케줄러, 메모리 관리자의 구조를 확인할 수 있습니다.',
    hasInterior: true,
  },
  'DNS (이름서버)': {
    name: 'DNS (이름서버)',
    tag: '이름을 주소로 변환하는 서버',
    icon: '📍',
    what: 'DNS(Domain Name System, 도메인네임시스템)는 웹사이트 이름을 실제 주소로 바꿔주는 역할을 합니다. "naver.com"이라고 치면, DNS가 이 이름에 해당하는 컴퓨터의 실제 주소(IP 주소, Internet Protocol Address)를 찾아줍니다.',
    why: '컴퓨터끼리 대화할 때는 숫자로 된 주소(IP 주소)를 사용합니다. 예를 들어 "125.209.200.135" 같은 숫자 말입니다. 하지만 사람은 이런 숫자를 외우기 어렵습니다. 그래서 "naver.com" 같은 도메인 이름(Domain Name)을 만들었고, DNS가 이 이름을 숫자 주소로 변환해줍니다.',
    how: '1. 여러분이 브라우저에 "naver.com"을 입력합니다. 2. 컴퓨터는 DNS 서버에게 "naver.com의 숫자 주소(IP 주소)가 뭐예요?"라고 질문합니다. 3. DNS 서버는 내부 데이터베이스에서 해당 도메인의 IP 주소를 찾아 "125.209.200.135입니다"라고 답변합니다. 4. 컴퓨터는 이제 이 숫자 주소로 접속합니다. DNS 내부를 들어가면 도메인 데이터베이스, 리졸버 캐시, 쿼리 프로세서를 확인할 수 있습니다.',
    relationships: ['DNS는 라우터(Router)를 통해 DNS 서버에게 질문합니다', '도메인 데이터베이스는 모든 도메인과 IP 주소의 연결 정보를 보관합니다', '리졸버 캐시는 자주 찾는 도메인의 결과를 임시 보관하여 빠르게 응답합니다', 'DNS 없이는 이름으로 웹사이트에 접근할 수 없습니다', '도메인(Domain) 이름은 1년에 약 만 원 정도로 등록할 수 있습니다'],
    systemContext: 'DNS는 인터넷의 전화번호부입니다. DNS 서버에 문제가 생기면, 웹사이트 이름을 입력해도 접속이 안 됩니다. 인터넷의 가장 기초적인 인프라 중 하나이며, 우리가 편리하게 웹을 이용할 수 있게 해주는 숨은 공로자입니다. DNS 내부를 들어가면 도메인 데이터베이스와 리졸버 캐시를 확인할 수 있습니다.',
    hasInterior: true,
  },
  '라우터 (공유기)': {
    name: '라우터 (공유기)',
    tag: '데이터 경로를 결정하는 장치',
    icon: '🚦',
    what: '라우터(Router)는 데이터가 갈 길을 정해주는 교차로입니다. 인터넷에 보내는 데이터는 하나의 직통길로 가지 않고, 여러 경로를 거쳐 목적지에 도달합니다. 라우터가 그 다음 경로를 결정합니다.',
    why: '인터넷은 전 세계 수백만 대의 컴퓨터가 연결된 거대한 네트워크(Network)입니다. 이 네트워크에서 데이터를 보내려면 여러 개의 중간 경로를 거쳐야 합니다. 라우터가 없으면 데이터가 어느 방향으로 가야 할지 몰라 헤매게 됩니다.',
    how: '데이터가 라우터에 도착하면, 라우터는 데이터에 적힌 목적지 주소를 확인합니다. 그리고 라우팅 테이블(Routing Table)을 참고하여 "이 데이터는 왼쪽으로 보내야 해" 또는 "이 데이터는 오른쪽 경로가 빠르겠군"이라고 결정합니다. 라우터 내부를 들어가면 라우팅 테이블, NAT, DHCP 서버 등을 확인할 수 있습니다. 마치 교차로에서 교통경찰이 차량의 방향을 정해주는 것과 같습니다.',
    relationships: ['라우팅 테이블(Routing Table)은 데이터가 갈 경로를 기록한 지도입니다', 'NAT(Network Address Translation)는 내부 주소를 외부 주소로 변환합니다', 'DHCP 서버는 각 기기에 IP 주소를 자동으로 할당합니다', '라우터는 DNS 서버에게 질문하여 도메인의 숫자 주소(IP)를 찾습니다', '여러분 집의 공유기(Access Point)도 하나의 라우터입니다'],
    systemContext: '라우터는 인터넷의 교차로입니다. 인터넷은 수많은 라우터가 서로 연결된 거대한 네트워크입니다. 여러분이 웹사이트를 열면, 데이터는 수십 개의 라우터를 거쳐 서버(Server)에 도달합니다. 라우터 내부를 들어가면 라우팅 테이블과 NAT 변환 과정을 확인할 수 있습니다.',
    hasInterior: true,
  },
  '방화벽 (화재벽)': {
    name: '방화벽 (화재벽)',
    tag: '보안 위협을 차단하는 보안 장치',
    icon: '🛡️',
    what: '방화벽(Firewall)은 컴퓨터의 보안 경비원입니다. 인터넷을 통해 들어오는 모든 데이터를 검사하고, 허용된 것만 들여보내고, 위험한 것은 막습니다.',
    why: '인터넷에는 좋지 않은 의도를 가진 사람이 많습니다. 방화벽 없이 인터넷에 연결되어 있으면, 누군가가 여러분의 컴퓨터에 원격으로 접속하여 파일을 훔치거나 시스템을 망가뜨릴 수 있습니다. 방화벽은 그 위험으로부터 컴퓨터를 지켜줍니다.',
    how: '방화벽은 들어오는 모든 데이터 패킷(Packet)을 하나하나 검사합니다. "이 데이터는 허용된 포트(Port)로 들어왔는가?", "이 요청은 안전한가?"를 판단합니다. 위험하다고 판단되면 데이터를 차단합니다. 패킷 필터링(Packet Filtering)이라고도 합니다. 마치 건물의 보안원이 출입증을 확인하고, 없는 사람은 들여보내지 않는 것과 같습니다.',
    relationships: ['방화벽(Firewall)은 라우터(Router) 뒤에 위치하여, 인터넷에서 들어오는 데이터를 먼저 검사합니다', '방화벽은 운영체제(OS)와 함께 컴퓨터의 보안을 담당합니다', '방화벽이 없으면 해커(Hacker)가 컴퓨터에 원격으로 접속할 수 있습니다', '네트워크 전체를 지키는 네트워크 방화벽과 개인 컴퓨터의 호스트 방화벽이 있습니다'],
    systemContext: '방화벽은 컴퓨터 보안의 첫 번째 방어선(Defense Line)입니다. 모든 컴퓨터는 방화벽을 활성화하고 있어야 합니다. 방화벽은 바이러스를 완전히 막아주는 것은 아니지만, 가장 기본적인 보호를 제공합니다.',
    hasInterior: true,
  },
  'HTTP (규약)': {
    name: 'HTTP (규약)',
    tag: '웹 데이터를 전송하는 통신 규칙',
    icon: '📜',
    what: 'HTTP(HyperText Transfer Protocol, 하이퍼텍스트전송프로토콜)는 웹에서 컴퓨터들이 서로 데이터를 주고받을 때 지켜야 하는 규칙(프로토콜, Protocol)입니다. 여러분이 웹사이트를 열면, 브라우저가 HTTP 규칙에 따라 서버(Server)에게 데이터를 요청하고, 서버가 그에 맞춰 응답합니다.',
    why: '서버와 브라우저가 서로 알아들을 수 있는 공통 언어가 필요합니다. 서버는 "이 데이터를 보내줘"라고 하고, 브라우저는 다른 언어로 대답하면 안 됩니다. HTTP가 이 공통 규칙을 정해줍니다. HTTP 없이는 웹페이지를 볼 수 없습니다.',
    how: '1. 브라우저가 서버에게 "이 페이지의 데이터를 달라"고 요청합니다. 이것을 GET 요청(Request)이라고 합니다. 2. 서버는 요청을 확인하고, 요청한 데이터를 보냅니다. 이것을 응답(Response)이라고 합니다. 3. 브라우저는 받은 데이터를 화면에 표시합니다. HTTP 내부를 들어가면 요청과 응답의 구조를 자세히 볼 수 있습니다. 서버가 보내는 응답에는 숫자 코드 상태 코드(Status Code)가 따라옵니다: 200은 "성공(OK)", 404는 "찾을 수 없음(Not Found)", 500은 "서버에 오류가 발생(Internal Server Error)"을 의미합니다.',
    relationships: ['HTTP 요청(Request)에는 메서드(GET, POST 등), URL, 헤더가 포함됩니다', 'HTTP 응답(Response)에는 상태 코드, 헤더, 본문(Body)이 포함됩니다', 'HTTP는 DNS가 찾아준 숫자 주소(IP)로 서버(Server)에게 접속합니다', 'HTTPS는 HTTP를 암호화한 보안 버전으로, TLS/SSL 암호화를 통해 중요한 정보를 안전하게 전송합니다'],
    systemContext: 'HTTP는 웹의 기본 언어입니다. 모든 웹사이트, 웹 앱(Web App), 모바일 앱의 서버(Server) 통신이 HTTP를 사용합니다. HTTP 내부를 들어가면 요청과 응답의 구조를 자세히 볼 수 있습니다.',
    hasInterior: true,
  },
};

export class InfoPanel {
  private el: HTMLElement;

  constructor() {
    this.el = document.getElementById('info-panel') ?? this.createElement();
    this.el.style.cssText = `
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      width: min(600px, 92vw); max-height: 55vh; overflow-y: auto;
      background: rgba(13,11,26,.95); border: 1px solid rgba(255,255,255,.15);
      border-radius: 20px; padding: 24px 26px; backdrop-filter: blur(16px);
      z-index: 8; box-shadow: 0 30px 80px rgba(0,0,0,.6);
      display: none; color: #e8e8f6; font-family: 'Segoe UI', system-ui, sans-serif;
    `;
    window.addEventListener('building-clicked', ((e: CustomEvent) => {
      this.showBuilding(e.detail);
    }) as EventListener);
    window.addEventListener('building-dismissed', () => {
      this.hide();
    });
  }

  private showBuilding(detail: { name: string; tag: string; icon: string }): void {
    const desc = BUILDING_DESCRIPTIONS[detail.name];

    if (desc) {
      const relHtml = desc.relationships.map(r =>
        `<li style="margin-bottom:6px;line-height:1.6;color:#b0b0d0;font-size:.88em">→ ${r}</li>`
      ).join('');

      this.el.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="font-size:1.6em">${detail.icon}</span>
          <div>
            <h3 style="font-size:1.2em;margin:0;color:#fff">${detail.name}</h3>
            <div style="font-size:.72em;padding:3px 10px;border-radius:10px;
              background:rgba(255,255,255,.1);display:inline-block;margin-top:4px;color:#a0a0c0">${detail.tag}</div>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.78em;color:#6c5ce7;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">무엇인가</div>
          <p style="line-height:1.7;font-size:.92em;color:#e0e0f0;margin:0">${desc.what}</p>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.78em;color:#00b894;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">왜 필요한가</div>
          <p style="line-height:1.7;font-size:.92em;color:#e0e0f0;margin:0">${desc.why}</p>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.78em;color:#fdcb6e;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">어떻게 작동하나</div>
          <p style="line-height:1.7;font-size:.92em;color:#e0e0f0;margin:0">${desc.how}</p>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.78em;color:#e17055;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">다른 부품과의 관계</div>
          <ul style="list-style:none;padding:0;margin:0">${relHtml}</ul>
        </div>

        <div style="margin-bottom:14px;padding:10px 14px;background:rgba(108,92,231,.1);border-radius:10px;border-left:3px solid #6c5ce7">
          <div style="font-size:.78em;color:#6c5ce7;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">시스템 전체 맥락</div>
          <p style="line-height:1.7;font-size:.88em;color:#c0c0e0;margin:0">${desc.systemContext}</p>
        </div>

        <div style="margin-top:14px;display:flex;gap:10px">
          ${desc.hasInterior ? '<button id="info-interior" style="background:linear-gradient(135deg,#6c5ce7,#00cec9);border:none;color:#fff;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:.85em;font-weight:500">내부 보기</button>' : ''}
          <button id="info-close" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);
            color:#fff;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:.85em">닫기</button>
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
