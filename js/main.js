/**
 * Configuration
 * [IMPORTANT]: Replace these with your actual GitHub details.
 */
const GITHUB_USERNAME = 'google-deepmind'; // sample
const GITHUB_REPO = 'antigravity-demo'; // sample

/**
 * Data Models - Tools (Static)
 */
const toolsData = [
    {
        id: 'autorefactor',
        name: 'AutoRefactor',
        icon: '⚡',
        shortDesc: '레거시 코드 자동 정리 도구',
        fullDesc: '복잡한 스파게티 코드를 분석하여 최신 ES6+ 문법으로 자동 변환합니다. AI 기반으로 변수명 난독화를 해제하고 미사용 코드를 안전하게 제거하여 코드 품질을 즉각적으로 향상시킵니다.',
        downloadUrl: 'https://drive.google.com/uc?id=EXAMPLE_ID_1',
        /* [TIP] 새 버전을 추가하려면 아래 { } 블록을 복사해서 리스트 맨 위에 붙여넣으세요. */
        history: [
            // { ver: '2.5.0', date: '2025.01.01', note: '새로운 기능 설명...' },
            { ver: '2.4.0', date: '2024.12.24', note: 'TypeScript 제네릭 추론 엔진 업그레이드' },
            { ver: '2.3.0', date: '2024.11.15', note: 'AI 변수명 추천 정확도 98% 달성' },
            { ver: '2.0.0', date: '2024.10.01', note: '처리 속도 300% 향상 (Rust 포팅)' }
        ]
    },
    {
        id: 'pixelperfect',
        name: 'PixelPerfect',
        icon: '🎨',
        shortDesc: '디자인-코드 변환기',
        fullDesc: 'Figma 디자인을 사용자의 CSS 디자인 시스템(Token)에 맞춰 완벽한 코드로 변환합니다. Tailwind 유틸리티 클래스와 Vanilla CSS 변수 모드를 모두 지원합니다.',
        downloadUrl: 'https://drive.google.com/uc?id=EXAMPLE_ID_2',
        history: [
            { ver: '1.2.0', date: '2024.12.10', note: 'Grid/Flex 레이아웃 자동 감지 알고리즘 추가' },
            { ver: '1.0.0', date: '2024.11.20', note: '초기 릴리즈: Figma Plugin 연동' }
        ]
    },
    {
        id: 'db-visualizer',
        name: 'DB Visualizer',
        icon: '📊',
        shortDesc: '실시간 데이터베이스 시각화',
        fullDesc: '복잡한 SQL 쿼리 실행 결과를 실시간 인터랙티브 그래프로 시각화합니다. 데이터 간의 관계를 직관적으로 파악하고 병목 구간을 시각적으로 탐지할 수 있습니다.',
        downloadUrl: 'https://drive.google.com/uc?id=EXAMPLE_ID_3',
        history: [
            { ver: '0.9.0', date: '2024.12.29', note: '오픈 베타 테스트 시작 (속도 최적화)' }
        ]
    },
    {
        id: 'doc-gen-ai',
        name: 'DocGen AI',
        icon: '📝',
        shortDesc: '자동 문서화 에이전트',
        fullDesc: '소스 코드를 읽고 개발자 친화적인 API 문서와 README를 자동으로 생성합니다. 변경 사항을 감지하여 문서를 항상 최신 상태로 유지합니다.',
        downloadUrl: 'https://drive.google.com/uc?id=EXAMPLE_ID_4',
        history: [
            { ver: '0.5.0', date: '2025.01.01', note: '알파 테스트 예정' }
        ]
    }
];

/**
 * Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupMobileMenu();

    renderToolsList();
    renderRecentReleases();

    // Initial Route Handler
    handleLocation();

    // Browser Back Button Handler
    window.addEventListener('popstate', handleLocation);

    // Fetch Dynamic Content
    fetchJournalFromGitHub();

    // Default select first tool
    selectTool(toolsData[0].id);
});

// --- Routing (SPA) ---
function handleLocation() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'home';
    switchView(view);
}

function navigateTo(viewId) {
    const url = new URL(window.location);
    url.searchParams.set('view', viewId);
    window.history.pushState({}, '', url);
    switchView(viewId);
}

function switchView(viewId) {
    window.scrollTo(0, 0);

    // Update Nav UI
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.target === viewId);
    });

    // Update Section Visibility
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active', 'fade-in');
        if (v.id === `${viewId}-view`) {
            v.classList.add('active', 'fade-in');
        }
    });

    // Sidebar Close (Mobile)
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
}

// --- Navigation & Mobile ---
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            navigateTo(target);
        });
    });
}

function setupMobileMenu() {
    const btn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (!btn || !sidebar) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== btn) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Global Nav Helpers
window.navigateToTools = function () { navigateTo('tools'); }
window.navigateToHome = function () { navigateTo('home'); }


// --- Tools View Logic ---
function renderRecentReleases() {
    const container = document.getElementById('latest-release-container');
    if (!container) return;

    // Render logic (using first item as 'Latest' or maybe dynamic?)
    // For now, mapping all tools as requested previously
    container.innerHTML = toolsData.map(tool => `
        <div class="latest-card">
            <div class="latest-header">
                <span class="version-badge">New v${tool.history[0].ver}</span>
                <h3>${tool.name}</h3>
            </div>
            <p>${tool.history[0].note}</p>
            <button class="text-link" onclick="selectTool('${tool.id}'); navigateToTools();">자세히 보기 &rarr;</button>
        </div>
    `).join('');
}

function renderToolsList() {
    const listContainer = document.querySelector('.tool-list');
    listContainer.innerHTML = toolsData.map(tool => `
        <div class="tool-item" onclick="selectTool('${tool.id}')" data-id="${tool.id}">
            <div class="tool-header">
                <span class="tool-icon">${tool.icon}</span>
                <span class="tool-name">${tool.name}</span>
            </div>
            <div style="font-size:13px; color:#888;">${tool.shortDesc}</div>
        </div>
    `).join('');
}

window.selectTool = function (id) {
    document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.tool-item[data-id="${id}"]`)?.classList.add('selected');

    const tool = toolsData.find(t => t.id === id);
    if (!tool) return;

    const detailContainer = document.querySelector('.tool-detail');
    const timelineHtml = tool.history.map((h) => `
        <div class="timeline-item">
            <div>
                <span class="ver-num">v${h.ver}</span>
                <span class="ver-date">${h.date}</span>
            </div>
            <div class="ver-notes">${h.note}</div>
        </div>
    `).join('');

    detailContainer.innerHTML = `
        <div class="detail-header fade-in">
            <h2 class="detail-title">
                ${tool.icon} ${tool.name} 
                <span class="tag">v${tool.history[0].ver}</span>
            </h2>
            <p class="detail-desc">${tool.fullDesc}</p>
            <a href="${tool.downloadUrl}" target="_blank" class="cta-button" style="font-size:14px; padding:12px 24px; display:inline-block; text-decoration:none;">
                다운로드
            </a>
            <div style="font-size:12px; color:#999; margin-top:8px;">
                * 외부 다운로드 페이지로 이동합니다.
            </div>
        </div>
        
        <h3>업데이트 내역</h3>
        <div class="version-timeline fade-in">
            ${timelineHtml}
        </div>
    `;
}

// --- Integration: GitHub Issues (Journal) ---
async function fetchJournalFromGitHub() {
    const container = document.getElementById('journal-feed');

    // Explicit API Call to ensure connection
    const apiUrl = `https://api.github.com/repos/yellowpencil30/MyWeb/issues?state=open&labels=journal`;
    console.log('Fetching Journal from:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const issues = await response.json();
        if (issues.length === 0) {
            container.innerHTML = '<div style="padding:20px; color:#666;">아직 작성된 일지가 없습니다.</div>';
            return;
        }

        container.innerHTML = issues.map(issue => `
            <article class="micro-post fade-in">
                <div class="post-header">
                    <div class="avatar" style="background-image:url(${issue.user.avatar_url}); background-size:cover;"></div>
                    <div>
                    <div class="author-name">${issue.user.login}</div>
                    <div class="post-date">${new Date(issue.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <h3 style="font-size:18px; margin-bottom:8px;">${issue.title}</h3>
                <p class="post-content" style="white-space: pre-wrap;">${issue.body}</p>
            </article>
        `).join('');

    } catch (e) {
        console.error('Journal Fetch Failed:', e);
        // User Friendly Error / Sample Mode
        container.innerHTML = `
            <div style="padding:40px; text-align:center; color:#999; border: 1px dashed #ddd; border-radius: 12px;">
                <h3 style="margin-bottom:8px;">연동 대기 중</h3>
                <p>GitHub API 설정이 필요하거나, 일지를 불러오지 못했습니다.</p>
                <div style="margin-top:16px; font-size:12px; color:#ccc;">
                   (Check console for details)
                </div>
            </div>
        `;
    }
}
