let recyclingData = [];

async function loadData() {
    try {
        const response = await fetch('data.json');
        recyclingData = await response.json();
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        recyclingData = [];
    }
}

function searchItems(query) {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return recyclingData.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(lowerQuery);
        const aliasMatch = item.aliases && item.aliases.some(alias => 
            alias.toLowerCase().includes(lowerQuery)
        );
        return nameMatch || aliasMatch;
    });
}

function getCategoryClass(category) {
    const categoryMap = {
        '플라스틱': 'plastic',
        '종이': 'paper',
        '유리': 'glass',
        '금속': 'metal',
        '일반쓰레기': 'general',
        '혼합': 'mixed'
    };
    return categoryMap[category] || 'general';
}

function displayResults(results, query) {
    const resultsDiv = document.getElementById('results');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-result">
                <p>"${query}"에 대한 검색 결과가 없습니다</p>
                <p>다른 키워드로 검색해 보세요</p>
            </div>
        `;
        return;
    }
    
    const html = results.map(item => `
        <div class="result-item">
            <h3>${item.name}</h3>
            <div class="info-row">
                <span class="label">분리수거함</span>
                <span class="value">
                    <span class="category-badge ${getCategoryClass(item.category)}">
                        ${item.category}
                    </span>
                </span>
            </div>
            <div class="info-row">
                <span class="label">배출 방법</span>
                <span class="value">${item.disposalMethod}</span>
            </div>
            ${item.notes ? `
            <div class="info-row">
                <span class="label">참고사항</span>
                <span class="value">${item.notes}</span>
            </div>
            ` : ''}
        </div>
    `).join('');
    
    resultsDiv.innerHTML = html;
}

function handleSearch() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    
    if (!query) return;
    
    const results = searchItems(query);
    displayResults(results, query);
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', handleSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            const results = searchItems(query);
            displayResults(results, query);
        }
    });
});
