// Supabase 설정
const SUPABASE_URL = 'https://eeckxfisgkdbncugzroi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY2t4ZmlzZ2tkYm5jdWd6cm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2OTEyODcsImV4cCI6MjEwMDI2NzI4N30.TK3kPZYPkUS9p5kXr64nGuyFVlB8zta4rBkQZa7Qyrw';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 분리수거 데이터
let recyclingData = [];
let allVideos = [];
let currentCategory = 'all';
let currentUser = null;

// 페이지네이션 설정
const CLASS_PER_PAGE = 4;
const REF_PER_PAGE = 11;
let currentClassPage = 1;
let currentRefPage = 1;
let allClasses = [];
let filteredRefItems = [];

// 빠른 참조 데이터
const quickRefData = [
  { name: '검은색 플라스틱', bin: '일반쓰레기', binClass: 'bin-general', note: '재활용 선별 불가' },
  { name: '컵라면 용기', bin: '일반쓰레기', binClass: 'bin-general', note: '국물 오염으로 재활용 불가' },
  { name: '양면 코팅 종이컵', bin: '일반쓰레기', binClass: 'bin-general', note: '코팅으로 재활용 불가' },
  { name: '코팅된 종이', bin: '일반쓰레기', binClass: 'bin-general', note: '명함, 전단지, 포스터' },
  { name: '영수증(감열지)', bin: '일반쓰레기', binClass: 'bin-general', note: '재활용 불가' },
  { name: '고무장갑', bin: '일반쓰레기', binClass: 'bin-general', note: '재활용 불가' },
  { name: '충전선', bin: '일반쓰레기', binClass: 'bin-general', note: '혼합 소재로 재활용 불가' },
  { name: '거울', bin: '일반쓰레기', binClass: 'bin-general', note: '유리가 아니므로 일반쓰레기' },
  { name: '화장지', bin: '일반쓰레기', binClass: 'bin-general', note: '오염된 종이로 재활용 불가' },
  { name: '티백', bin: '일반쓰레기', binClass: 'bin-general', note: '재활용 불가' },
  { name: '봉제인형', bin: '일반쓰레기', binClass: 'bin-general', note: '소형: 특수규격봉투' },
  { name: '알루미늄 호일', bin: '일반쓰레기', binClass: 'bin-general', note: '오염 시 일반쓰레기' },
  { name: '투명 페트병', bin: '투명페트병 전용', binClass: 'bin-pet', note: '라벨 제거, 압착 필수' },
  { name: '유색 페트병', bin: '플라스틱류', binClass: 'bin-plastic', note: '무색 투명 PET병이 아닌 모든 유색' },
  { name: '재활용 표시 없는 비닐', bin: '플라스틱류', binClass: 'bin-plastic', note: '깨끗하면 배출 가능' },
  { name: 'PVC 제품', bin: '일반쓰레기', binClass: 'bin-general', note: '장판, PVC 파이프 등' },
  { name: 'PS 제품', bin: '플라스틱류', binClass: 'bin-plastic', note: '깨끗하면 배출, 오염 시 일반쓰레기' },
  { name: 'PP 제품', bin: '플라스틱류', binClass: 'bin-plastic', note: '도시락 용기, 식품 용기 등' },
  { name: 'HDPE 제품', bin: '플라스틱류', binClass: 'bin-plastic', note: '샴푸 용기, 세제 용기 등' },
  { name: 'LDPE 제품', bin: '플라스틱류', binClass: 'bin-plastic', note: '비닐봉지, 랩 등' },
  { name: 'OTHER 플라스틱', bin: '플라스틱류', binClass: 'bin-plastic', note: '혼합 소재 플라스틱' },
  { name: '비닐 vs 플라스틱', bin: '둘 다 플라스틱류', binClass: 'bin-plastic', note: '비닐은 부드럽고 투명, 플라스틱은 단단함' },
  { name: '랩 필름', bin: '일반쓰레기', binClass: 'bin-general', note: '재활용 불가' },
  { name: '비닐 식탁보', bin: '일반쓰레기', binClass: 'bin-general', note: '재활용 불가' },
  { name: '의료폐기물', bin: '의료폐기물 전용', binClass: 'bin-general', note: '병원·의원에서 전문 처리' },
  { name: '폐의약품', bin: '폐의약품 전용', binClass: 'bin-general', note: '약국·보건소 수거함' },
  { name: '폐건전지', bin: '건전지 전용', binClass: 'bin-battery', note: '소형: 종량제봉투, 대형: 전용수거함' },
  { name: '형광등', bin: '형광등 전용', binClass: 'bin-general', note: '破损 시 유해, 전용 용기에 배출' },
  { name: 'LED 전구', bin: '일반쓰레기', binClass: 'bin-general', note: '형광등와 달리 일반쓰레기' },
  { name: '폐의류', bin: '의류 수거함', binClass: 'bin-textile', note: '재사용 가능 의류는 수거함' },
  { name: '폐타이어', bin: '대형폐기물', binClass: 'bin-large', note: '폐타이어 전문 수거 업체' },
  { name: '폐유', bin: '폐유 전용', binClass: 'bin-oil', note: '식용유는 음식물, 기계유는 전용' },
  { name: '골판지', bin: '종이류', binClass: 'bin-paper', note: '테이프 제거 후 묶어서 배출' },
  { name: '종이팩', bin: '종이팩 전용', binClass: 'bin-paper', note: '우유팩, 두유팩 등 전용수거함' },
  { name: '스티로폼', bin: '플라스틱류', binClass: 'bin-plastic', note: '깨끗한 것은 플라스틱류로 배출' },
  { name: '유리병', bin: '유리류', binClass: 'bin-glass', note: '용도별 분리 (음료, 양념, 화장품)' },
  { name: '캔', bin: '금속류', binClass: 'bin-metal', note: '내용물 비우고 압착' },
  { name: '알루미늄 캔', bin: '금속류', binClass: 'bin-metal', note: ' Steel 캔과 분리' },
  { name: '鐵 캔', bin: '금속류', binClass: 'bin-metal', note: '알루미늄 캔과 분리' },
  { name: '스테인리스', bin: '금속류', binClass: 'bin-metal', note: '일반 금속류와 함께 배출' },
  { name: '냉장고', bin: '대형폐기물', binClass: 'bin-large', note: '무료 수거 또는 폐가전 수거' },
  { name: '세탁기', bin: '대형폐기물', binClass: 'bin-large', note: '무료 수거 또는 폐가전 수거' },
  { name: '에어컨', bin: '대형폐기물', binClass: 'bin-large', note: '무료 수거 또는 폐가전 수거' },
  { name: 'TV', bin: '대형폐기물', binClass: 'bin-large', note: '무료 수거 또는 폐가전 수거' },
  { name: '모니터', bin: '대형폐기물', binClass: 'bin-large', note: '무료 수거 또는 폐가전 수거' },
  { name: '가구', bin: '대형폐기물', binClass: 'bin-large', note: '폐소형가전 수거함 또는 대형폐기물' },
  { name: '매트리스', bin: '대형폐기물', binClass: 'bin-large', note: '대형폐기물 배출' },
];

const confusingItems = [
  '검은색 플라스틱', '컵라면 용기', '양면 코팅 종이컵', '코팅된 종이',
  '감열지', '고무장갑', '충전선', '거울', '알루미늄 호일',
  '화장지', '랩 필름', '티백', '의료폐기물', '폐의약품',
  'PVC 제품', 'PS 제품', '재활용 표시 없는 플라스틱', '재활용 표시 없는 비닐',
  '비닐 vs 플라스틱 구분', '재활용 표시 없는 비닐류'
];

// ============================================
// 데이터 로드
// ============================================
async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    recyclingData = data.items;
    allVideos = data.videos || [];
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    recyclingData = [];
    allVideos = [];
  }
}

// ============================================
// 인증 관련
// ============================================
async function initAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session?.user || null;
  updateAuthUI();
  
  supabaseClient.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
    checkAdminStatus();
    loadClasses();
  });
}

function updateAuthUI() {
  const authSection = document.getElementById('authSection');
  
  if (currentUser) {
    authSection.innerHTML = `
      <div class="user-info">
        <span>${currentUser.email}</span>
        <button id="logoutBtn" class="logout-btn">로그아웃</button>
      </div>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    authSection.innerHTML = `
      <button id="loginBtn" class="auth-btn">로그인</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', () => openModal('login'));
  }
}

function openModal(type) {
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authModalTitle');
  const form = document.getElementById('authForm');
  const toggleText = document.getElementById('authToggleText');
  const toggleBtn = document.getElementById('authToggleBtn');
  
  if (type === 'login') {
    title.textContent = '로그인';
    form.querySelector('button[type="submit"]').textContent = '로그인';
    toggleText.textContent = '계정이 없으신가요?';
    toggleBtn.textContent = '회원가입';
    form.dataset.mode = 'login';
  } else {
    title.textContent = '회원가입';
    form.querySelector('button[type="submit"]').textContent = '회원가입';
    toggleText.textContent = '이미 계정이 있으신가요?';
    toggleBtn.textContent = '로그인';
    form.dataset.mode = 'signup';
  }
  
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('authModal').classList.add('hidden');
  document.getElementById('authForm').reset();
  const errorEl = document.querySelector('.error-message');
  if (errorEl) errorEl.remove();
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const mode = e.target.dataset.mode;
  
  const errorEl = document.querySelector('.error-message');
  if (errorEl) errorEl.remove();
  
  try {
    let result;
    if (mode === 'login') {
      result = await supabaseClient.auth.signInWithPassword({ email, password });
    } else {
      result = await supabaseClient.auth.signUp({ email, password });
    }
    
    if (result.error) throw result.error;
    
    if (mode === 'signup') {
      const msg = document.createElement('p');
      msg.className = 'success-message';
      msg.textContent = '회원가입 완료! 이메일을 확인해주세요.';
      e.target.appendChild(msg);
      return;
    }
    
    closeModal();
  } catch (error) {
    const msg = document.createElement('p');
    msg.className = 'error-message';
    msg.textContent = error.message || '오류가 발생했습니다.';
    e.target.appendChild(msg);
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
}

// ============================================
// 클래스 관련 (페이징 적용)
// ============================================
async function loadClasses() {
  const classList = document.getElementById('classList');
  
  const { data: classes, error } = await supabaseClient
    .from('classes')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    classList.innerHTML = '<p class="placeholder-text">클래스를 불러올 수 없습니다.</p>';
    return;
  }
  
  if (!classes || classes.length === 0) {
    classList.innerHTML = '<p class="placeholder-text">등록된 클래스가 없습니다.</p>';
    return;
  }
  
  allClasses = classes;
  
  // 사용자 신청 내역 조회
  let userEnrollments = [];
  if (currentUser) {
    const { data } = await supabaseClient
      .from('enrollments')
      .select('class_id, status')
      .eq('user_id', currentUser.id)
      .eq('status', 'confirmed');
    userEnrollments = data || [];
  }
  
  renderClassPage(userEnrollments);
}

function renderClassPage(userEnrollments) {
  const classList = document.getElementById('classList');
  const totalPages = Math.ceil(allClasses.length / CLASS_PER_PAGE);
  const startIdx = (currentClassPage - 1) * CLASS_PER_PAGE;
  const endIdx = startIdx + CLASS_PER_PAGE;
  const pageClasses = allClasses.slice(startIdx, endIdx);
  
  classList.innerHTML = pageClasses.map(cls => {
    const isEnrolled = userEnrollments.some(e => e.class_id === cls.id);
    const isFull = cls.current_count >= cls.max_capacity;
    const remaining = cls.max_capacity - cls.current_count;
    
    return `
      <div class="class-card">
        <div class="class-header">
          <span class="class-name">${cls.name}</span>
          <span class="class-capacity ${isFull ? 'full' : ''}">
            ${isFull ? '마감' : `남은 자리: ${remaining}명`}
          </span>
        </div>
        <p class="class-description">${cls.description || ''}</p>
        <button 
          class="enroll-btn ${isEnrolled ? 'enrolled' : ''} ${isEnrolled ? 'cancel' : ''}"
          data-class-id="${cls.id}"
          data-enrolled="${isEnrolled}"
          ${!currentUser ? 'disabled' : ''}
        >
          ${!currentUser ? '로그인 후 신청 가능' : isEnrolled ? '신청 취소' : isFull ? '정원 마감' : '신청하기'}
        </button>
      </div>
    `;
  }).join('');
  
  // 신청 버튼 이벤트 연결
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', handleEnrollment);
  });
  
  // 클래스 페이징 렌더링
  renderPagination('classPagination', currentClassPage, totalPages, (page) => {
    currentClassPage = page;
    renderClassPage(userEnrollments);
  });
}

async function handleEnrollment(e) {
  const classId = e.target.dataset.classId;
  const isEnrolled = e.target.dataset.enrolled === 'true';
  
  if (!currentUser) {
    openModal('login');
    return;
  }
  
  e.target.disabled = true;
  
  try {
    if (isEnrolled) {
      const { data, error } = await supabaseClient.rpc('cancel_enrollment', {
        p_class_id: classId
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
    } else {
      const { data, error } = await supabaseClient.rpc('enroll_class', {
        p_class_id: classId
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
    }
    
    loadClasses();
  } catch (error) {
    alert(error.message || '신청 처리 중 오류가 발생했습니다.');
    e.target.disabled = false;
  }
}

// ============================================
// 페이지네이션 공통 함수
// ============================================
function renderPagination(containerId, currentPage, totalPages, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // 이전 버튼
  html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&lt; Prev</button>`;
  
  // 페이지 번호
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button data-page="1">1</button>`;
    if (startPage > 2) html += `<button disabled>...</button>`;
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<button disabled>...</button>`;
    html += `<button data-page="${totalPages}">${totalPages}</button>`;
  }
  
  // 다음 버튼
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next &gt;</button>`;
  
  container.innerHTML = html;
  
  // 이벤트 연결
  container.querySelectorAll('button:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page && page !== currentPage) {
        onPageChange(page);
      }
    });
  });
}

// ============================================
// 빠른 참조 관련
// ============================================
function initQuickRef() {
  filteredRefItems = [...quickRefData];
  renderRefPage();
  
  // 검색 이벤트
  document.getElementById('refSearchInput').addEventListener('input', filterRefItems);
  document.getElementById('refCategoryFilter').addEventListener('change', filterRefItems);
}

function filterRefItems() {
  const searchTerm = document.getElementById('refSearchInput').value.toLowerCase();
  const category = document.getElementById('refCategoryFilter').value;
  
  filteredRefItems = quickRefData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                          item.note.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || item.bin === category;
    return matchesSearch && matchesCategory;
  });
  
  currentRefPage = 1;
  renderRefPage();
}

function renderRefPage() {
  const tbody = document.getElementById('refTableBody');
  const totalPages = Math.ceil(filteredRefItems.length / REF_PER_PAGE);
  const startIdx = (currentRefPage - 1) * REF_PER_PAGE;
  const endIdx = startIdx + REF_PER_PAGE;
  const pageItems = filteredRefItems.slice(startIdx, endIdx);
  
  if (pageItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#888;">검색 결과가 없습니다.</td></tr>';
  } else {
    tbody.innerHTML = pageItems.map(item => {
      const safeName = item.name.replace(/'/g, "\\'");
      return `
        <tr onclick="openItemDetailModal('${safeName}')" style="cursor:pointer" title="클릭하여 상세 가이드 보기">
          <td>${item.name}</td>
          <td class="${item.binClass}">${item.bin}</td>
          <td>${item.note}</td>
        </tr>
      `;
    }).join('');
  }
  
  // 빠른 참조 페이징 렌더링
  renderPagination('refPagination', currentRefPage, totalPages, (page) => {
    currentRefPage = page;
    renderRefPage();
  });
}

// ============================================
// 검색 기능
// ============================================
function isConfusingItem(name) {
  return confusingItems.includes(name);
}

function matchesCategory(item, category) {
  if (category === 'all') return true;
  
  const itemCategory = item.category;
  const bin = item.bin;
  
  if (category === '비닐') {
    return itemCategory.includes('비닐') || bin.includes('비닐');
  }
  
  if (category === '대형폐기물') {
    return itemCategory.includes('대형') || bin.includes('대형');
  }
  
  if (category === 'OTHER') {
    return itemCategory.includes('OTHER') ||
           item.name.toUpperCase().includes('OTHER') ||
           (item.aliases && item.aliases.some(alias => alias.toUpperCase().includes('OTHER')));
  }
  
  if (category === '플라스틱') {
    return itemCategory.includes('플라스틱') || itemCategory.includes('합성수지') || 
           itemCategory.includes('페트병') || bin.includes('플라스틱');
  }
  
  return itemCategory.includes(category) || bin.includes(category);
}

function searchItems(query, category = 'all') {
  let filtered = recyclingData;
  
  if (category !== 'all') {
    filtered = filtered.filter(item => matchesCategory(item, category));
  }
  
  if (!query || query.trim() === '') {
    return filtered;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  const matched = filtered.filter(item => {
    if (item.name.toLowerCase().includes(normalizedQuery)) return true;
    
    if (item.aliases && item.aliases.length > 0) {
      return item.aliases.some(alias => 
        alias.toLowerCase().includes(normalizedQuery)
      );
    }
    
    return false;
  });

  const seen = new Set();
  return matched.filter(item => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getBinClass(bin) {
  if (bin.includes('투명페트병')) return 'type-pet';
  if (bin.includes('플라스틱')) return 'type-plastic';
  if (bin.includes('종이')) return 'type-paper';
  if (bin.includes('유리')) return 'type-glass';
  if (bin.includes('금속')) return 'type-metal';
  if (bin.includes('건전지') || bin.includes('전지')) return 'type-battery';
  if (bin.includes('대형')) return 'type-large';
  if (bin.includes('의류') || bin.includes('폐의류')) return 'type-textile';
  if (bin.includes('폐유')) return 'type-oil';
  if (bin.includes('형광등') || bin.includes('LED')) return 'type-fluorescent';
  return 'type-general';
}

function renderResults(items, query) {
  const resultsContainer = document.getElementById('results');
  
  if (items.length === 0 && query) {
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>"${query}"에 대한 검색 결과가 없습니다.</p>
      </div>
    `;
    return;
  }
  
  if (items.length === 0) {
    resultsContainer.classList.add('hidden');
    return;
  }
  
  resultsContainer.classList.remove('hidden');
  resultsContainer.innerHTML = items.map(item => {
    const confusing = isConfusingItem(item.name);
    const safeName = item.name.replace(/'/g, "\\'");
    return `
      <div class="result-item ${confusing ? 'confusing' : ''}" onclick="openItemDetailModal('${safeName}')">
        <div class="result-header">
          <span class="result-name">${item.name}</span>
          ${confusing ? '<span class="confusing-badge">헷갈리는 품목</span>' : ''}
          <span class="bin-badge ${getBinClass(item.bin)}">${item.bin}</span>
        </div>
        ${item.aliases && item.aliases.length > 0 ? `
          <div class="result-alias">별명: ${item.aliases.join(', ')}</div>
        ` : ''}
        <div class="result-detail">
          <div class="detail-row">
            <span class="detail-label">배출 방법</span>
            <span class="detail-value">${item.disposalMethod}</span>
          </div>
          ${item.notes ? `
            <div class="detail-row">
              <span class="detail-label">참고사항</span>
              <span class="detail-value">${item.notes}</span>
            </div>
          ` : ''}
        </div>
        <button class="detail-btn" onclick="event.stopPropagation(); openItemDetailModal('${safeName}')">상세 가이드 & 출처 보기 🔍</button>
      </div>
    `;
  }).join('');
}

// ============================================
// 품목 상세 가이드 모달
// ============================================
function openItemDetailModal(name) {
  let item = recyclingData.find(i => i.name === name || (i.aliases && i.aliases.includes(name)));
  
  if (!item) {
    const quickRef = quickRefData.find(q => q.name === name);
    if (quickRef) {
      item = {
        name: quickRef.name,
        aliases: [],
        category: quickRef.bin,
        bin: quickRef.bin,
        disposalMethod: quickRef.note,
        notes: quickRef.note
      };
    }
  }

  if (!item) return;

  const modal = document.getElementById('itemDetailModal');
  const container = document.getElementById('itemDetailContent');
  const confusing = isConfusingItem(item.name);
  const binClass = getBinClass(item.bin || '');

  let detailedContentHTML = '';

  if (item.name === '유리병' || item.name.includes('유리병')) {
    detailedContentHTML = `
      <div class="item-detail-section tip">
        <h4>🎨 왜 색상별(무색, 녹색, 갈색)로 구분하여 배출해야 하나요?</h4>
        <p>유리병은 수거 후 고온(1,500℃ 이상)에서 녹여 다시 새로운 유리병으로 재생산됩니다.</p>
        <p>이때 무색(투명), 녹색, 갈색 유리병이 섞여 용해되면 유리의 투명도와 색상 균일성이 파괴되어 고품질 새 유리병을 만들 수 없습니다. 따라서 3가지 주요 색상별로 분류해 배출해야 순도 높고 고가치 자원으로 재활용됩니다.</p>
      </div>

      <div class="item-detail-section">
        <h4>🏷️ 상표(라벨) 제거는 의무인가요?</h4>
        <p><strong>아닙니다. '가능한 경우 제거'하는 권장 사항입니다.</strong></p>
        <ul>
          <li><strong>비닐 상표</strong>: 손으로 쉽게 떼어지는 비닐 포장 라벨은 떼어내어 비닐류로 별도 배출합니다.</li>
          <li><strong>종이 상표 / 접착 스티커</strong>: 유리병 재활용 공정(고온 알칼리 세척액)에서 세척 중 종이 상표와 접착제가 자동으로 용해되어 제거됩니다. 무리하게 억지로 떼어낼 필요 없이 배출하셔도 됩니다. (투명 페트병과 달리 미이행 시 과태료 부과 대상이 아닙니다.)</li>
        </ul>
      </div>

      <div class="item-detail-section tip">
        <h4>💰 빈용기 보증금 환급 제도</h4>
        <p>소주병, 맥주병 등 용기 겉면에 <strong>'빈용기보증금'</strong> 문구가 표기된 병은 파손되지 않게 깨끗이 모아 대형마트·슈퍼마켓 등 소매점에 반납하면 보증금(70원~130원)을 현금으로 환급받을 수 있습니다.</p>
      </div>

      <div class="item-detail-section warning">
        <h4>⚠️ 배출 시 주의사항 & 재활용 불가 유리</h4>
        <p>깨진 유리, 거울, 내열 식기, 도자기·사기그릇, 크리스탈, 판유리, 전구 등은 <strong>재활용 대상이 아닙니다.</strong></p>
        <p>신문지 등으로 여러 겹 싸서 종량제봉투에 담거나, 다량일 경우 특수규격마대에 담아 배출하세요.</p>
      </div>
    `;
  } else if (item.name.includes('깨진 유리') || item.name.includes('거울') || item.name.includes('사기')) {
    detailedContentHTML = `
      <div class="item-detail-section warning">
        <h4>🚨 깨진 유리 및 특수 유리 배출 가이드</h4>
        <p>깨진 유리, 거울, 내열 유리, 도자기류는 수거 작업자의 부상 위험 및 기계 고장을 일으켜 <strong>재활용이 불가</strong>합니다.</p>
        <ul>
          <li><strong>소량 배출</strong>: 신문지나 안 쓰는 상자로 여러 겹 꼼꼼히 싼 후 종량제봉투에 배출하세요.</li>
          <li><strong>다량 배출</strong>: 지자체 특수규격마대(불연성 쓰레기 봉투)를 구매하여 배출하세요.</li>
        </ul>
      </div>
    `;
  } else if (item.name.includes('OTHER') || item.name.includes('플라스틱 OTHER')) {
    detailedContentHTML = `
      <div class="item-detail-section warning">
        <h4>⚠️ 7번 OTHER 플라스틱 배출 가이드</h4>
        <p>용기나 포장재 바닥에 <strong>'7'</strong> 또는 <strong>'OTHER'</strong>로 표기된 플라스틱은 두 가지 이상의 재질이 섞인 복합 플라스틱입니다.</p>
        <p>재활용 선별장에서 재질별 기계 선별이 불가능하므로 <strong>종량제봉투(일반쓰레기)</strong>에 배출하는 것이 올바른 방법입니다.</p>
      </div>
    `;
  } else if (item.name.includes('투명') || item.name.includes('페트')) {
    detailedContentHTML = `
      <div class="item-detail-section tip">
        <h4>🥤 투명 페트병 전용 분리배출 가이드</h4>
        <p>무색 투명 페트병은 고품질 의류 원사 및 가방 등으로 재활용되는 귀중한 자원입니다.</p>
        <ul>
          <li><strong>라벨 제거 (필수 의무)</strong>: 라벨을 완전히 떼어 비닐류로 따로 배출해야 합니다. (미이행 시 과태료 대상)</li>
          <li><strong>압착 및 뚜껑</strong>: 내용물을 비우고 압착 후 뚜껑을 닫아 전용 수거함에 배출합니다.</li>
        </ul>
      </div>
    `;
  } else if (item.name.includes('종이팩') || item.name.includes('우유팩')) {
    detailedContentHTML = `
      <div class="item-detail-section tip">
        <h4>🥛 종이팩(우유팩·두유팩) 배출 가이드</h4>
        <p>종이팩은 고급 고급 펄프로 제작되어 일반 폐지와 섞이면 재활용되지 못하고 버려집니다.</p>
        <p>내용물을 비우고 씻은 후 펼쳐서 건조시킨 뒤 <strong>종이팩 전용 수거함</strong> 또는 주민센터 교환 사업(휴지/종량제봉투 교환)에 배출하세요.</p>
      </div>
    `;
  } else {
    detailedContentHTML = `
      <div class="item-detail-section">
        <h4>📋 올바른 분리배출 4원칙</h4>
        <ul>
          <li><strong>1. 비운다</strong>: 용기 안의 내용물을 완전히 비웁니다.</li>
          <li><strong>2. 헹군다</strong>: 음식물이나 이물질을 물로 깨끗이 헹웁니다.</li>
          <li><strong>3. 분리한다</strong>: 라벨, 뚜껑 등 다른 재질을 분리합니다.</li>
          <li><strong>4. 섞지 않는다</strong>: 종류별, 재질별로 구분하여 해당 수거함에 배출합니다.</li>
        </ul>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="item-detail-header">
      <div class="item-detail-title-row">
        <span class="item-detail-title">${item.name}</span>
        ${confusing ? '<span class="confusing-badge">헷갈리는 품목</span>' : ''}
        <span class="bin-badge ${binClass}">${item.bin}</span>
      </div>
      ${item.aliases && item.aliases.length > 0 ? `
        <div class="item-detail-alias">별명/관련 키워드: ${item.aliases.join(', ')}</div>
      ` : ''}
    </div>

    <div class="item-detail-section">
      <h4>📌 기본 배출 방법</h4>
      <p>${item.disposalMethod}</p>
      ${item.notes ? `<p><strong>참고사항:</strong> ${item.notes}</p>` : ''}
    </div>

    ${detailedContentHTML}

    <div class="source-box">
      <strong>🏛️ 공식 가이드 및 법적 출처</strong>
      • 환경부 훈령 「재활용가능자원의 분리수거 등에 관한 지침」 [별표 1]<br>
      • 서울특별시 자원순환과 분리배출 가이드라인 (2025-2026)<br>
      • 환경부 공식 앱 「내 손안의 분리배출」
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeItemDetailModal() {
  const modal = document.getElementById('itemDetailModal');
  if (modal) modal.classList.add('hidden');
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      currentCategory = tab.dataset.category;
      const query = document.getElementById('searchInput').value;
      const results = searchItems(query, currentCategory);
      renderResults(results, query);
    });
  });
}

// ============================================
// 관리자 관련
// ============================================
let isAdminUser = false;

async function checkAdminStatus() {
  if (!currentUser) {
    isAdminUser = false;
    updateAdminUI();
    return;
  }
  
  try {
    const { data, error } = await supabaseClient.rpc('is_admin', {
      p_user_id: currentUser.id
    });
    
    isAdminUser = !error && data === true;
  } catch {
    isAdminUser = false;
  }
  
  updateAdminUI();
}

function updateAdminUI() {
  const adminPanel = document.getElementById('adminPanel');
  if (isAdminUser) {
    adminPanel.classList.remove('hidden');
    loadAdminClasses();
  } else {
    adminPanel.classList.add('hidden');
  }
}

async function loadAdminClasses() {
  if (!isAdminUser) return;
  
  try {
    const { data: classes, error } = await supabaseClient
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const list = document.getElementById('adminClassList');
    if (!classes || classes.length === 0) {
      list.innerHTML = '<p class="placeholder-text">등록된 클래스가 없습니다.</p>';
      return;
    }
    
    list.innerHTML = classes.map(cls => `
      <div class="admin-class-card">
        <div class="admin-class-info">
          <strong>${cls.name}</strong>
          <span>${cls.description || ''}</span>
          <span class="class-capacity ${cls.current_count >= cls.max_capacity ? 'full' : ''}">
            ${cls.current_count}/${cls.max_capacity}
          </span>
        </div>
        <div class="admin-class-actions">
          <button class="edit-btn" data-id="${cls.id}" data-name="${cls.name}" data-desc="${cls.description || ''}" data-cap="${cls.max_capacity}">수정</button>
          <button class="delete-btn" data-id="${cls.id}">삭제</button>
          <button class="enrollments-btn" data-id="${cls.id}" data-name="${cls.name}">명단</button>
        </div>
      </div>
    `).join('');
    
    list.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditForm(btn.dataset));
    });
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteClass(btn.dataset.id));
    });
    list.querySelectorAll('.enrollments-btn').forEach(btn => {
      btn.addEventListener('click', () => showEnrollments(btn.dataset.id, btn.dataset.name));
    });
  } catch (error) {
    console.error('관리자 클래스 로드 실패:', error);
  }
}

function openEditForm(dataset) {
  document.getElementById('classFormTitle').textContent = '클래스 수정';
  document.getElementById('editClassId').value = dataset.id;
  document.getElementById('className').value = dataset.name;
  document.getElementById('classDescription').value = dataset.desc;
  document.getElementById('classCapacity').value = dataset.cap;
  document.getElementById('classForm').classList.remove('hidden');
  document.getElementById('addClassBtn').classList.add('hidden');
}

async function saveClass(e) {
  e.preventDefault();
  
  const editId = document.getElementById('editClassId').value;
  const name = document.getElementById('className').value;
  const description = document.getElementById('classDescription').value;
  const capacity = parseInt(document.getElementById('classCapacity').value);
  
  try {
    let result;
    if (editId) {
      result = await supabaseClient.rpc('admin_update_class', {
        p_class_id: editId,
        p_name: name,
        p_description: description,
        p_max_capacity: capacity
      });
    } else {
      result = await supabaseClient.rpc('admin_add_class', {
        p_name: name,
        p_description: description,
        p_max_capacity: capacity
      });
    }
    
    if (result.error) throw result.error;
    if (!result.data.success) throw new Error(result.data.message);
    
    closeClassForm();
    loadAdminClasses();
    loadClasses();
  } catch (error) {
    alert('저장 실패: ' + (error.message || '오류가 발생했습니다.'));
  }
}

async function deleteClass(classId) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  
  try {
    const { data, error } = await supabaseClient.rpc('admin_delete_class', {
      p_class_id: classId
    });
    if (error) throw error;
    if (!data.success) throw new Error(data.message);
    
    loadAdminClasses();
    loadClasses();
  } catch (error) {
    alert('삭제 실패: ' + (error.message || '오류가 발생했습니다.'));
  }
}

async function showEnrollments(classId, className) {
  try {
    const { data, error } = await supabaseClient.rpc('admin_get_enrollments', {
      p_class_id: classId
    });
    if (error) throw error;
    if (!data.success) throw new Error(data.message);
    
    document.getElementById('enrollmentModalTitle').textContent = className + ' - 신청자 명단';
    
    const list = document.getElementById('enrollmentList');
    if (!data.enrollments || data.enrollments.length === 0) {
      list.innerHTML = '<p class="placeholder-text">신청자가 없습니다.</p>';
    } else {
      list.innerHTML = `
        <table class="enrollment-table">
          <thead>
            <tr>
              <th>이메일</th>
              <th>상태</th>
              <th>신청일</th>
            </tr>
          </thead>
          <tbody>
            ${data.enrollments.map(e => `
              <tr>
                <td>${e.email}</td>
                <td>${e.status === 'confirmed' ? '확인' : '취소'}</td>
                <td>${new Date(e.created_at).toLocaleDateString('ko-KR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    
    document.getElementById('enrollmentModal').classList.remove('hidden');
  } catch (error) {
    alert('명단 로드 실패: ' + (error.message || '오류가 발생했습니다.'));
  }
}

function closeClassForm() {
  document.getElementById('classForm').classList.add('hidden');
  document.getElementById('addClassBtn').classList.remove('hidden');
  document.getElementById('classFormEl').reset();
  document.getElementById('editClassId').value = '';
}

function setupAdminEvents() {
  document.getElementById('addClassBtn').addEventListener('click', () => {
    document.getElementById('classFormTitle').textContent = '새 클래스 추가';
    document.getElementById('classForm').classList.remove('hidden');
    document.getElementById('addClassBtn').classList.add('hidden');
  });
  
  document.getElementById('cancelFormBtn').addEventListener('click', closeClassForm);
  document.getElementById('classFormEl').addEventListener('submit', saveClass);
  
  document.getElementById('closeEnrollmentModal').addEventListener('click', () => {
    document.getElementById('enrollmentModal').classList.add('hidden');
  });
}

// ============================================
// 초기화
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  await initAuth();
  setupCategoryTabs();
  setupAdminEvents();
  loadClasses();
  initQuickRef();
  renderVideoBanner();
  
  const searchInput = document.getElementById('searchInput');
  let debounceTimer;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value;
      const results = searchItems(query, currentCategory);
      renderResults(results, query);
    }, 150);
  });
  
  // 모달 이벤트
  document.querySelector('#authModal .close').addEventListener('click', closeModal);
  document.getElementById('authToggleBtn').addEventListener('click', () => {
    const mode = document.getElementById('authForm').dataset.mode;
    openModal(mode === 'login' ? 'signup' : 'login');
  });
  document.getElementById('authForm').addEventListener('submit', handleAuth);
  
  window.addEventListener('click', (e) => {
    if (e.target.id === 'authModal') closeModal();
    if (e.target.id === 'videoPlayerModal') closeVideoPlayer();
    if (e.target.id === 'videoLibraryModal') closeVideoLibrary();
    if (e.target.id === 'itemDetailModal') closeItemDetailModal();
  });

  const closeItemDetailBtn = document.getElementById('closeItemDetailModal');
  if (closeItemDetailBtn) {
    closeItemDetailBtn.addEventListener('click', closeItemDetailModal);
  }

  document.getElementById('closeVideoPlayerModal').addEventListener('click', closeVideoPlayer);
  document.getElementById('closeVideoLibraryModal').addEventListener('click', closeVideoLibrary);
  document.getElementById('videoSearchInput').addEventListener('input', renderVideoLibrary);
  document.getElementById('videoCategoryFilter').addEventListener('change', renderVideoLibrary);
  
  searchInput.focus();
});

// ============================================
// 교육 영상 섹션
// ============================================
let videoCarouselIndex = 0;
const VIDEO_PER_PAGE = 4;

function getYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?#]+)/);
  return match ? match[1] : url;
}

function renderVideoBanner() {
  const container = document.getElementById('videoBanner');
  if (!container || allVideos.length === 0) {
    if (container) container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  videoCarouselIndex = 0;
  renderVideoCarousel();
}

function renderVideoCarousel() {
  const container = document.getElementById('videoBanner');
  if (!container) return;
  const totalPages = Math.ceil(allVideos.length / VIDEO_PER_PAGE);
  const start = videoCarouselIndex * VIDEO_PER_PAGE;
  const pageVideos = allVideos.slice(start, start + VIDEO_PER_PAGE);

  container.innerHTML = `
    <div class="video-section-header">
      <h2>교육 영상</h2>
      <button class="view-all-btn" onclick="openVideoLibrary()">전체 보기 →</button>
    </div>
    <div class="video-carousel">
      <button class="carousel-arrow" onclick="videoPrev()" ${videoCarouselIndex === 0 ? 'disabled' : ''}>&#9664;</button>
      <div class="video-grid">
        ${pageVideos.map(v => `
          <div class="video-card" onclick="playVideo('${v.id}')" style="cursor:pointer">
            <div class="video-thumb">
              <img src="https://img.youtube.com/vi/${getYouTubeId(v.url)}/mqdefault.jpg" alt="${v.title}" loading="lazy">
              <span class="video-duration">${v.duration || ''}</span>
            </div>
            <div class="video-info">
              <div class="video-title">${v.title}</div>
              <div class="video-meta">${v.category || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="carousel-arrow" onclick="videoNext()" ${videoCarouselIndex >= totalPages - 1 ? 'disabled' : ''}>&#9654;</button>
    </div>
  `;
}

function videoPrev() {
  if (videoCarouselIndex > 0) { videoCarouselIndex--; renderVideoCarousel(); }
}

function videoNext() {
  const totalPages = Math.ceil(allVideos.length / VIDEO_PER_PAGE);
  if (videoCarouselIndex < totalPages - 1) { videoCarouselIndex++; renderVideoCarousel(); }
}

function playVideo(id) {
  const video = allVideos.find(v => v.id === id);
  if (!video) return;
  const modal = document.getElementById('videoPlayerModal');
  const container = document.getElementById('videoPlayerContent');
  container.innerHTML = `
    <div class="video-player-wrapper">
      <iframe src="https://www.youtube.com/embed/${getYouTubeId(video.url)}?autoplay=1" frameborder="0" allowfullscreen allow="autoplay"></iframe>
    </div>
    <div class="video-player-info">
      <h3>${video.title}</h3>
      <p>${video.description || ''}</p>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeVideoPlayer() {
  const modal = document.getElementById('videoPlayerModal');
  modal.classList.add('hidden');
  document.getElementById('videoPlayerContent').innerHTML = '';
}

// ============================================
// 교육 영상 라이브러리
// ============================================
function openVideoLibrary() {
  const modal = document.getElementById('videoLibraryModal');
  modal.classList.remove('hidden');
  document.getElementById('videoSearchInput').value = '';
  const categories = [...new Set(allVideos.map(v => v.category).filter(Boolean))];
  const select = document.getElementById('videoCategoryFilter');
  select.innerHTML = '<option value="all">전체</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
  renderVideoLibrary();
}

function closeVideoLibrary() {
  document.getElementById('videoLibraryModal').classList.add('hidden');
}

function renderVideoLibrary() {
  const container = document.getElementById('videoLibraryGrid');
  const query = document.getElementById('videoSearchInput').value.toLowerCase();
  const category = document.getElementById('videoCategoryFilter').value;

  let filtered = allVideos;
  if (category !== 'all') {
    filtered = filtered.filter(v => v.category === category);
  }
  if (query) {
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(query) ||
      (v.description && v.description.toLowerCase().includes(query)) ||
      (v.keywords && v.keywords.some(k => k.toLowerCase().includes(query)))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results"><p>해당 영상이 없습니다.</p></div>';
    document.getElementById('videoCount').textContent = '';
    return;
  }

  container.innerHTML = filtered.map(v => `
    <div class="video-card" onclick="playVideo('${v.id}')" style="cursor:pointer">
      <div class="video-thumb">
        <img src="https://img.youtube.com/vi/${getYouTubeId(v.url)}/mqdefault.jpg" alt="${v.title}" loading="lazy">
        <span class="video-duration">${v.duration || ''}</span>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">${v.category || ''} · ${v.publishedAt || ''}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('videoCount').textContent = `총 ${filtered.length}개 영상`;
}
