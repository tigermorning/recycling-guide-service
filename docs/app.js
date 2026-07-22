// Supabase 설정
const SUPABASE_URL = 'https://eeckxfisgkdbncugzroi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY2t4ZmlzZ2tkYm5jdWd6cm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2OTEyODcsImV4cCI6MjEwMDI2NzI4N30.TK3kPZYPkUS9p5kXr64nGuyFVlB8zta4rBkQZa7Qyrw';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 분리수거 데이터
let recyclingData = [];
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
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    recyclingData = [];
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
  
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('authModal').style.display = 'none';
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
    tbody.innerHTML = pageItems.map(item => `
      <tr>
        <td>${item.name}</td>
        <td class="${item.binClass}">${item.bin}</td>
        <td>${item.note}</td>
      </tr>
    `).join('');
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
    return itemCategory.includes('OTHER');
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
  
  return filtered.filter(item => {
    if (item.name.toLowerCase().includes(normalizedQuery)) return true;
    
    if (item.aliases && item.aliases.length > 0) {
      return item.aliases.some(alias => 
        alias.toLowerCase().includes(normalizedQuery)
      );
    }
    
    return false;
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
    return `
      <div class="result-item ${confusing ? 'confusing' : ''}">
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
      </div>
    `;
  }).join('');
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
    const { data, error } = await supabaseClient.rpc('admin_get_classes');
    if (error) throw error;
    if (!data.success) throw new Error(data.message);
    
    const list = document.getElementById('adminClassList');
    if (!data.classes || data.classes.length === 0) {
      list.innerHTML = '<p class="placeholder-text">등록된 클래스가 없습니다.</p>';
      return;
    }
    
    list.innerHTML = data.classes.map(cls => `
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
    
    // 이벤트 연결
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
  document.querySelector('.close').addEventListener('click', closeModal);
  document.getElementById('authToggleBtn').addEventListener('click', () => {
    const mode = document.getElementById('authForm').dataset.mode;
    openModal(mode === 'login' ? 'signup' : 'login');
  });
  document.getElementById('authForm').addEventListener('submit', handleAuth);
  
  window.addEventListener('click', (e) => {
    if (e.target.id === 'authModal') closeModal();
  });
  
  searchInput.focus();
});
