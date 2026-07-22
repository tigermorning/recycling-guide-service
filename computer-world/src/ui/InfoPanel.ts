interface BuildingDescription {
  name: string;
  tag: string;
  icon: string;
  metaphor: string;
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
    metaphor: '메인보드는 사무실입니다. 모든 부품이 들어있는 큰 건물이죠. 책상, 서랍, 서류함이 모두 여기 안에 있습니다.',
    what: '메인보드(Mainboard, 마더보드)는 컴퓨터 안의 모든 부품이 서로 이야기할 수 있게 해주는 큰 회로 기판입니다. 기술 용어로는 PWB(Printed Wired Board)라고도 합니다. CPU, 캐시, RAM, 저장장치 등 모든 부품이 초록색 기판(PCB) 위의 금색 배선(Trace)을 통해 서로 연결되어 있습니다.',
    why: '컴퓨터는 하나의 부품으로 만들어지지 않습니다. CPU, 메모리, 저장장치 등 여러 부품이 각자의 역할을 합니다. 그런데 이 부품들이 서로 대화할 수 없으면 아무 일도 일어나지 않습니다. 메인보드는 이 모든 부품을 하나로 연결하는 회로 기판입니다.',
    how: '메인보드는 초록색 기판(PCB) 위에 수많은 금색 배선(Trace)이 그어져 있습니다. 이 배선들이 부품들이 서로 대화하는 통로입니다. CPU를 꽂는 소켓(Socket), RAM을 꽂는 슬롯(Slot), 저장장치를 연결하는 SATA 포트 등이 모두 이 판 위에 있습니다. 배선이 곧 도로이고, 부품들이 곧 건물인 셈입니다.',
    relationships: ['CPU는 메인보드의 소켓(Socket)에 꽂혀 있고, 이 배선(Trace)을 통해 RAM과 대화합니다', 'RAM은 메인보드의 DIMM 슬롯에 꽂혀 있어 CPU가 부르면 바로 응답합니다', '저장장치는 메인보드의 SATA 포트에 연결되어 있어 파일을 보관하고 꺼냅니다', 'GPU는 메인보드의 PCIe 슬롯에 꽂혀 화면 그리는 일을 돕습니다'],
    systemContext: '메인보드가 없으면 부품들은 각자 섬처럼 고립됩니다. CPU는 RAM에 접근할 수 없고, 저장장치는 데이터를 보낼 수 없습니다. 메인보드는 컴퓨터의 뼈대이자 골격이며, 모든 부품이 하나의 시스템으로 작동하게 만드는 기반입니다.',
  },
  'CPU (중앙처리장치)': {
    name: 'CPU (중앙처리장치)',
    tag: '계산과 처리를 담당하는 핵심 칩',
    icon: '🖥️',
    metaphor: 'CPU는 책상입니다. 사무실 안에서 문서를 작성하고, 계산하고, 결론을 내리는 곳이죠.',
    what: 'CPU(Central Processing Unit)는 컴퓨터의 두뇌입니다. "2 더하기 2는 4"처럼 단순한 계산부터, 게임을 실행하거나 동영상을 재생하는 것처럼 복잡한 작업까지, 컴퓨터가 하는 모든 일이 이 칩 안에서 일어납니다.',
    why: '컴퓨터는 매 순간 수백만 번의 연산을 합니다. "이 글자를 화면에 보여줘", "이 버튼을 누르면 무엇을 해야 하지?" 같은 지시가 쉴 새 없이 쏟아집니다. CPU가 없으면 이 모든 계산을 할 수 있는 장치가 없어집니다.',
    how: 'CPU 안에는 ALU(산술논리연산장치)는 숫자를 더하고 빼는 연산을 수행합니다. 제어장치(CU)는 "이제 이 명령어를 실행해"라고 지시를 내립니다. 레지스터는 지금 당장 필요한 데이터를 잠시 보관하는 작고 빠른 저장소입니다. 코어가 많을수록 동시에 여러 명령어를 처리할 수 있습니다. 이 모든 과정은 클럭 속도에 맞춰 매초 수억 번 반복됩니다.',
    relationships: ['ALU는 숫자를 더하고 빼고 곱하는 실제 계산을 수행합니다', '제어장치(CU)는 어떤 명령어를 언제 실행할지 결정합니다', '레지스터는 지금 당장 쓸 데이터를 잠시 보관합니다', 'CPU가 데이터가 필요하면, 먼저 자기 안에 있는 캐시에서 찾습니다', '캐시에 없으면 RAM에서 가져옵니다', '운영체제(OS)는 CPU의 시간을 여러 프로그램에게 골고루 나눠줍니다'],
    systemContext: 'CPU는 컴퓨터 시스템의 중심입니다. 프로그램은 결국 CPU가 실행하는 명령어들의 나열입니다. CPU가 빠르면 컴퓨터 전체가 빨라지고, CPU가 느리면 아무리 좋은 부품이 있어도 컴퓨터가 느립니다.',
    hasInterior: true,
  },
  'CPU 내장 캐시': {
    name: 'CPU 내장 캐시',
    tag: 'CPU 칩 안에 내장된 가장 빠른 기억',
    icon: '📦',
    metaphor: '캐시는 책상 아래 서랍입니다. 자주 쓰는 서류를 여기에 두면 바로 꺼낼 수 있습니다.',
    what: '캐시(Cache)는 CPU 칩 안에 직접 내장된 아주 작은 저장소입니다. 기술적으로는 SRAM으로 만들어져 있어 매우 빠르지만 용량이 작습니다. CPU가 자주 쓰는 데이터를 여기에 두면, 매번 멀리 있는 RAM까지 갈 필요 없이 바로 꺼낼 수 있습니다.',
    why: 'CPU는 아주 빠르게 일합니다. 그런데 데이터를 가져오는 곳이 느리면 CPU가 기다려야 합니다. RAM에서 데이터를 가져오는 데 시간이 걸리면, CPU는 그 시간 동안 놀게 됩니다(버블, Bubble). 캐시는 CPU의 속도에 맞춰 데이터를 바로바로 공급함으로써 이 문제를 해결합니다.',
    how: 'CPU 안의 캐시는 세 단계로 나뉩니다: L1 캐시(가장 작고 가장 빠름, 각 코어 안에 있음) → L2 캐시(조금 크고 조금 느림, 코어 옆) → L3 캐시(가장 크고 가장 느림, 여러 코어가 공유). CPU가 어떤 데이터를 필요로 하면, 먼저 L1에서 찾고, 없으면 L2로, 그래도 없으면 L3로, 마지막으로 RAM에서 가져옵니다. 거기 있으면 바로 꺼내 씁니다(히트, Hit). 거기 없으면 RAM에서 가져와서 캐시에도 복사해 둡니다(미스, Miss).',
    relationships: ['L1 캐시는 각 CPU 코어 안에 직접 내장되어 있습니다(가장 빠름)', 'L2 캐시는 CPU 코어 옆에 있습니다(L1보다 느리지만 더 큼)', 'L3 캐시는 모든 코어가 공유합니다(L2보다 느리지만 가장 큼)', '캐시에 데이터가 없으면(미스) RAM에서 가져옵니다', 'RAM은 캐시보다 약 100배 느리지만, 훨씬 많은 데이터를 보관할 수 있습니다'],
    systemContext: '컴퓨터의 메모리는 계층 구조(Memory Hierarchy)로 되어 있습니다. CPU 안의 캐시(가장 빠름) → CPU 밖의 RAM(중간) → 저장장치(가장 느림) 순으로, 속도와 용량 사이의 절충안입니다.',
  },
  'RAM (메모리)': {
    name: 'RAM (메모리)',
    tag: '임시로 데이터를 보관하는 장치',
    icon: '🗄️',
    metaphor: 'RAM은 서류함입니다. 사무실 안, 책상 근처에 있어 바로 꺼낼 수 있습니다. 전원이 꺼지면 모두 사라집니다.',
    what: 'RAM(Random Access Memory)은 컴퓨터가 지금 당장 사용하는 것들을 보관하는 곳입니다. 웹 브라우저를 열면, 게임을 실행하면, 음악을 틀면, 그 프로그램들의 데이터가 모두 RAM에 올라갑니다.',
    why: '저장장치는 느립니다. 프로그램을 실행할 때마다 저장장치에서 데이터를 가져오면 너무 느릴 것입니다. 그래서 CPU 근처에 빠른 임시 저장소가 필요합니다. RAM이 그 역할을 합니다. 하지만 전원이 꺼지면 RAM의 내용은 모두 사라집니다(휘발성, Volatile).',
    how: '프로그램을 실행하면, 저장장치에 있는 프로그램 파일이 RAM으로 복사됩니다. CPU는 RAM에서 명령어를 읽어 실행합니다. 작업이 끝나면 RAM에서 지워지고, 결과만 저장장치에 영구 보관됩니다.',
    relationships: ['RAM은 CPU보다 느리지만, 저장장치보다는 훨씬 빠릅니다', 'CPU가 필요하면 RAM에서 데이터를 가져가서 처리합니다', 'RAM에 보관된 데이터는 전원이 꺼지면 모두 사라집니다(휘발성)', '운영체제(OS)는 RAM의 여유 공간을 여러 프로그램에게 나눠줍니다'],
    systemContext: 'RAM은 컴퓨터의 단기 기억입니다. 충분한 RAM이 있으면 여러 프로그램을 동시에 쾌적하게 사용할 수 있습니다(멀티태스킹). RAM이 부족하면 프로그램이 느려지거나 아예 실행되지 않을 수 있습니다.',
    hasInterior: true,
  },
  '저장장치 (SSD/HDD)': {
    name: '저장장치 (SSD/HDD)',
    tag: '데이터를 영구 보관하는 장치',
    icon: '🏭',
    metaphor: '저장장치는 사무실 뒤편 창고입니다. 책상에서 가장 먼 거리에 있어 데이터를 꺼내느라 시간이 걸리지만, 모든 파일을 영구적으로 보관합니다.',
    what: '저장장치(Storage)는 컴퓨터의 장기 기억입니다. 문서, 사진, 프로그램, 영화 등 모든 파일이 여기에 영구적으로 보관됩니다. 비휘발성(Non-Volatile) 메모리라 전원이 꺼져도 데이터가 사라지지 않습니다.',
    why: 'RAM은 전원이 꺼지면 내용이 모두 사라집니다. 그렇다면 "컴퓨터를 껐다가 다시 켜면 어떻게 하지?"라는 의문이 듭니다. 답은 저장장치입니다. 저장장치는 전원 없이도 데이터를 안전하게 보관합니다.',
    how: '저장장치는 메인보드에서 케이블(SATA 또는 M.2)로 분리된 별도 장치입니다. 파일을 저장하면, 저장장치 안의 플래시 메모리 또는 자기 디스크에 기록됩니다. SSD는 빠르고 내구성이 좋고, HDD는 느리지만 넓어서 많은 파일을 보관합니다.',
    relationships: ['저장장치는 메인보드에 케이블로 연결된 별도 장치입니다', '저장장치는 RAM보다 느리지만, 데이터가 사라지지 않습니다(비휘발성)', '프로그램은 저장장치에 설치되고, 실행될 때 RAM으로 복사됩니다(로딩)', '운영체제(OS)도 저장장치에 저장되어 있다가 부팅 시 RAM으로 로드됩니다'],
    systemContext: '저장장치는 컴퓨터의 장기 기억입니다. 만약 저장장치가 없다면, 컴퓨터를 껐다가 다시 켤 때 모든 프로그램과 파일이 사라질 것입니다.',
    hasInterior: true,
  },
  '운영체제 (OS)': {
    name: '운영체제 (OS)',
    tag: '하드웨어를 관리하는 소프트웨어',
    icon: '💻',
    metaphor: '운영체제는 관리사무소입니다. CPU, 메모리, 저장장치 등 모든 자원을 관리하고, 프로그램들에게 자원을 나눠줍니다.',
    what: '운영체제(Operating System)는 컴퓨터의 총괄 관리자입니다. CPU, 메모리(RAM), 저장장치 등 모든 하드웨어를 관리하고, 프로그램들에게 "너는 이만큼 써", "이제 네 차례야"라고 자원을 나눠줍니다.',
    why: '여러 프로그램이 동시에 컴퓨터를 사용하려고 하면 문제가 생깁니다. 브라우저도 CPU를 쓰고 싶고, 음악 프로그램도 CPU를 쓰고 싶습니다. 운영체제가 없으면 이 프로그램들이 서로 CPU를 차지하려고 다투게 됩니다.',
    how: '운영체제는 CPU의 시간을 아주 작은 단위(타임 슬라이스)로 나눠서 여러 프로그램에게 골고루 배분합니다(시분할, Time Sharing). 1초에 수백 번씩 번갈아 실행하기 때문에, 사용자는 마치 여러 프로그램이 동시에 돌아가는 것처럼 느립니다. "누구에게 얼마큼 줄지" 결정하는 것을 스케줄링(Scheduling)이라고 합니다.',
    relationships: ['운영체제는 CPU의 시간을 아주 작은 단위로 나눠 여러 프로그램에게 골고루 배분합니다(시분할)', '어느 프로그램에게 다음 시간 슬라이스를 줄지 결정하는 것을 스케줄링이라고 합니다', '여러 프로그램이 동시에 돌아가는 것처럼 보이는 것을 멀티태스킹이라고 합니다', '커널(Kernel)은 운영체제의 핵심으로, 하드웨어와 직접 소통합니다'],
    systemContext: '운영체제는 컴퓨터 시스템의 총괄 관리자입니다. Windows, macOS, Linux 등이 대표적인 운영체제입니다. 운영체제가 없으면 프로그램은 하드웨어에 직접 접근할 수 없어 작동이 불가능합니다.',
    hasInterior: true,
  },
  'GPU (그래픽처리장치)': {
    name: 'GPU (그래픽처리장치)',
    tag: '화면을 그리는 전문 칩',
    icon: '🎮',
    metaphor: 'GPU는 화면에 보이는 모든 그림과 영상을 그리는 전문가입니다. CPU가 수학 문제를 푸는 것이라면, GPU는 그림을 그리는 것입니다!',
    what: 'GPU(Graphics Processing Unit)는 컴퓨터 화면에 보이는 모든 것을 그리는 전문가입니다. 게임의 화면, 동영상, 웹사이트의 이미지, 3D 애니메이션이 모두 GPU가 그립니다.',
    why: '화면에는 수백만 개의 작은 점(픽셀)이 있습니다. 각 픽셀의 색상을 하나하나 계산하려면 엄청난 연산이 필요합니다. CPU는 이런 반복적인 대량 연산에 적합하지 않습니다. GPU는 수천 개의 작은 계산 장치(코어)를 동시에 사용해 이 일을 효율적으로 처리합니다.',
    how: 'GPU는 메인보드의 PCIe 슬롯에 꽂히는 확장 카드입니다. 안에 수천 개의 셰이더 코어(Shader Core)가 들어 있습니다. 각 셰이더 코어가 화면의 작은 영역을 담당하여 동시에 색상을 계산합니다(렌더링). GPU에는 전용 메모리 VRAM이 있어 대량의 그래픽 데이터를 보관합니다.',
    relationships: ['GPU는 메인보드의 PCIe 슬롯에 꽂히는 별도의 확장 카드입니다', '셰이더 코어는 수천 개가 있어 동시에 많은 연산을 수행합니다', 'VRAM은 그래픽 전용 메모리로, CPU의 RAM과 별도입니다', 'GPU는 CPU의 지시를 받아 화면을 렌더링합니다'],
    systemContext: 'GPU는 컴퓨터의 그래픽 전문가입니다. 게임을 하거나 3D 작업을 할 때 GPU의 성능이 중요합니다. 최근에는 AI 학습에도 활용되면서 CPU만큼 중요해지고 있습니다.',
    hasInterior: true,
  },
  'DNS (이름서버)': {
    name: 'DNS (이름서버)',
    tag: '이름을 주소로 변환하는 서버',
    icon: '📍',
    metaphor: 'DNS는 이름을 주소로 바꿔주는 안내판입니다. "naver.com"이라고 적힌 안내판을 보면, 실제 IP 주소 방향을 가리켜줍니다.',
    what: 'DNS(Domain Name System)는 웹사이트 이름을 실제 주소로 바꿔주는 역할을 합니다. "naver.com"이라고 치면, DNS가 이 이름에 해당하는 컴퓨터의 실제 주소(IP 주소)를 찾아줍니다.',
    why: '컴퓨터끼리 대화할 때는 숫자로 된 주소(IP 주소)를 사용합니다. 하지만 사람은 이런 숫자를 외우기 어렵습니다. 그래서 "naver.com" 같은 도메인 이름을 만들었고, DNS가 이 이름을 숫자 주소로 변환해줍니다.',
    how: '1. 브라우저에 "naver.com"을 입력합니다. 2. 컴퓨터는 DNS 서버에게 "naver.com의 숫자 주소가 뭐예요?"라고 질문합니다. 3. DNS 서버는 내부 데이터베이스에서 해당 도메인의 IP 주소를 찾아 "125.209.200.135입니다"라고 답변합니다. 4. 컴퓨터는 이제 이 숫자 주소로 접속합니다.',
    relationships: ['DNS는 라우터를 통해 DNS 서버에게 질문합니다', '도메인 데이터베이스는 모든 도메인과 IP 주소의 연결 정보를 보관합니다', '리졸버 캐시는 자주 찾는 도메인의 결과를 임시 보관하여 빠르게 응답합니다', 'DNS 없이는 이름으로 웹사이트에 접근할 수 없습니다'],
    systemContext: 'DNS는 인터넷의 전화번호부입니다. DNS 서버에 문제가 생기면, 웹사이트 이름을 입력해도 접속이 안 됩니다.',
    hasInterior: true,
  },
  '라우터 (공유기)': {
    name: '라우터 (공유기)',
    tag: '데이터 경로를 결정하는 장치',
    icon: '🚦',
    metaphor: '라우터는 데이터가 갈 길을 정해주는 교차로입니다. 마치 교차로에서 차량이 어디로 갈지 정해지는 것처럼, 데이터도 라우터에서 목적지를 정합니다.',
    what: '라우터(Router)는 데이터가 갈 길을 정해주는 교차로입니다. 인터넷에 보내는 데이터는 하나의 직통길로 가지 않고, 여러 경로를 거쳐 목적지에 도달합니다. 라우터가 그 다음 경로를 결정합니다.',
    why: '인터넷은 전 세계 수백만 대의 컴퓨터가 연결된 거대한 네트워크입니다. 이 네트워크에서 데이터를 보내려면 여러 개의 중간 경로를 거쳐야 합니다. 라우터가 없으면 데이터가 어느 방향으로 가야 할지 몰라 헤매게 됩니다.',
    how: '데이터가 라우터에 도착하면, 라우터는 데이터에 적힌 목적지 주소를 확인합니다. 그리고 라우팅 테이블(Routing Table)을 참고하여 "이 데이터는 왼쪽으로 보내야 해" 또는 "이 데이터는 오른쪽 경로가 빠르겠군"이라고 결정합니다.',
    relationships: ['라우팅 테이블은 데이터가 갈 경로를 기록한 지도입니다', 'NAT는 내부 주소를 외부 주소로 변환합니다', 'DHCP 서버는 각 기기에 IP 주소를 자동으로 할당합니다', '여러분 집의 공유기도 하나의 라우터입니다'],
    systemContext: '라우터는 인터넷의 교차로입니다. 인터넷은 수많은 라우터가 서로 연결된 거대한 네트워크입니다.',
    hasInterior: true,
  },
  '방화벽 (화재벽)': {
    name: '방화벽 (화재벽)',
    tag: '보안 위협을 차단하는 보안 장치',
    icon: '🛡️',
    metaphor: '방화벽은 컴퓨터의 보안 경비원입니다. 마치 건물의 문을 지키는 경비원처럼요.',
    what: '방화벽(Firewall)은 컴퓨터의 보안 경비원입니다. 인터넷을 통해 들어오는 모든 데이터를 검사하고, 허용된 것만 들여보내고, 위험한 것은 막습니다.',
    why: '인터넷에는 좋지 않은 의도를 가진 사람이 많습니다. 방화벽 없이 인터넷에 연결되어 있으면, 누군가가 여러분의 컴퓨터에 원격으로 접속하여 파일을 훔치거나 시스템을 망가뜨릴 수 있습니다.',
    how: '방화벽은 들어오는 모든 데이터 패킷을 하나하나 검사합니다. "이 데이터는 허용된 포트로 들어왔는가?", "이 요청은 안전한가?"를 판단합니다. 위험하다고 판단되면 데이터를 차단합니다. 마치 건물의 보안원이 출입증을 확인하고, 없는 사람은 들여보내지 않는 것과 같습니다.',
    relationships: ['방화벽은 라우터 뒤에 위치하여, 인터넷에서 들어오는 데이터를 먼저 검사합니다', '방화벽은 운영체제와 함께 컴퓨터의 보안을 담당합니다', '방화벽이 없으면 해커가 컴퓨터에 원격으로 접속할 수 있습니다'],
    systemContext: '방화벽은 컴퓨터 보안의 첫 번째 방어선입니다. 모든 컴퓨터는 방화벽을 활성화하고 있어야 합니다.',
    hasInterior: true,
  },
  'HTTP (규약)': {
    name: 'HTTP (규약)',
    tag: '웹 데이터를 전송하는 통신 규칙',
    icon: '📜',
    metaphor: 'HTTP는 인터넷에서 데이터가 오가는 기본 규칙입니다. 마치 규칙서처럼, 웹이 작동하는 방법을 정해놓은 문서입니다.',
    what: 'HTTP(HyperText Transfer Protocol)는 웹에서 컴퓨터들이 서로 데이터를 주고받을 때 지켜야 하는 규칙(프로토콜)입니다. 브라우저가 열면, HTTP 규칙에 따라 서버에게 데이터를 요청하고, 서버가 그에 맞춰 응답합니다.',
    why: '서버와 브라우저가 서로 알아들을 수 있는 공통 언어가 필요합니다. HTTP가 이 공통 규칙을 정해줍니다. HTTP 없이는 웹페이지를 볼 수 없습니다.',
    how: '1. 브라우저가 서버에게 "이 페이지의 데이터를 달라"고 요청합니다(GET 요청). 2. 서버는 요청을 확인하고, 요청한 데이터를 보냅니다(응답). 3. 브라우저는 받은 데이터를 화면에 표시합니다. 상태 코드: 200은 "성공", 404는 "찾을 수 없음", 500은 "서버 오류"를 의미합니다.',
    relationships: ['HTTP 요청에는 메서드(GET, POST 등), URL, 헤더가 포함됩니다', 'HTTP 응답에는 상태 코드, 헤더, 본문이 포함됩니다', 'HTTP는 DNS가 찾아준 IP로 서버에게 접속합니다', 'HTTPS는 HTTP를 암호화한 보안 버전입니다'],
    systemContext: 'HTTP는 웹의 기본 언어입니다. 모든 웹사이트, 웹 앱, 모바일 앱의 서버 통신이 HTTP를 사용합니다.',
    hasInterior: true,
  },
  'HTTPS (보안규약)': {
    name: 'HTTPS (보안규약)',
    tag: '암호화된 웹 데이터 전송 규칙',
    icon: '🔒',
    metaphor: 'HTTPS는 HTTP를 보안으로 감싼 버전입니다. 마치 편지를 밀봉 봉투에 넣어 보내는 것처럼, 데이터를 암호화하여 전송합니다.',
    what: 'HTTPS(HyperText Transfer Protocol Secure)는 HTTP의 보안 강화 버전입니다. 데이터를 암호화하여 전송하기 때문에, 중간에 누가 가로채도 내용을 읽을 수 없습니다. 브라우저 주소창의 자물쇠 아이콘은 HTTPS를 사용한다는 뜻입니다.',
    why: 'HTTP는 데이터를 평문으로 전송합니다. 따라서 해커가 네트워크를 가로채면 비밀번호, 신용카드 번호 등 민감한 정보를 탈취할 수 있습니다. HTTPS는 TLS/SSL 암호화를 사용하여 이 위협을 차단합니다.',
    how: '1. 브라우저가 서버에게 접속 요청을 보냅니다. 2. 서버는 SSL 인증서를 보내 인증합니다. 3. 브라우저와 서버는 암호화 키를 교환합니다. 4. 이후 모든 데이터는 이 키로 암호화되어 전송됩니다. 중간에 가로채더라도 내용을 해독할 수 없습니다.',
    relationships: ['HTTPS는 HTTP + TLS/SSL 암호화의 조합입니다', '방화벽은 HTTPS 트래픽도 검사할 수 있지만, 암호화 때문에 내용 확인이 어렵습니다', '인터넷 쇼핑, 브라우징, 로그인 등 민감한 데이터는 반드시 HTTPS를 사용해야 합니다'],
    systemContext: 'HTTPS는 현대 웹의 표준입니다. 구글, 페이스북 등 대부분의 웹사이트가 HTTPS를 사용하며, HTTP는 보안이 필요한 곳에서 사용이 금지되고 있습니다.',
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

        <div style="margin-bottom:14px;padding:12px 16px;background:rgba(255,215,0,.08);border-left:3px solid #ffd700;border-radius:0 10px 10px 0">
          <div style="font-size:.78em;color:#ffd700;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">비유로 이해하기</div>
          <p style="line-height:1.7;font-size:.92em;color:#e0e0f0;margin:0">${desc.metaphor}</p>
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
