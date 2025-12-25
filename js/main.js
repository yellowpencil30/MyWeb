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
        id: 'curriculum-uploader',
        name: '주간학습안내 자동 업로더',
        icon: '📤',
        shortDesc: '다음주 주간학습안내 자동 업로드',
        fullDesc: '선생님은 다음주 주간학습안내 파일만 준비하세요. 프로그램이 학교 홈페이지 로그인부터 게시판 선택, 글쓰기, 파일 첨부까지 모든 과정을 자동으로 수행합니다. 더 이상 반복적인 업로드 작업에 시간을 뺏기지 마세요.<br>(현재는 인천시 동부교육청 초등학교를 대상으로 합니다.)',
        downloadUrl: 'https://drive.google.com/file/d/1_ZEWk9cJe6ZhDpCQJv7tbUoHwAmYVffC/view?usp=drive_link',
        /* [TIP] 새 버전을 추가하려면 아래 { } 블록을 복사해서 리스트 맨 위에 붙여넣으세요. */
        usage: '1. 학교 홈페이지 계정 정보를 입력합니다.(아이디 로그인만 지원합니다.)<br>2. 업로드할 다음주 주간학습안내 파일(hwp)을 선택합니다.<br>3. "업로드 시작" 버튼을 클릭합니다.<br>4. 프로그램이 자동으로 접속하여 게시글을 등록합니다.',
        history: [
            // { ver: '2.5.0', date: '2025.01.01', note: '새로운 기능 설명...' },
            { ver: '1.0.0', date: '2025.12.25', note: '제발 작동해라, 얍!' }
        ]
    },
    {
        id: 'weekly-scheduler',
        name: 'NEIS 주간학습안내 자동화',
        icon: '📅',
        shortDesc: 'PDF 분석 및 나이스(NEIS) 자동 입력 도구',
        fullDesc: '나이스 주간학습안내 입력을 AI로 자동화하세요. PDF 파일만 업로드하면 Gemini가 시간표를 추출하여, 로그인부터 입력, 저장까지의 전 과정을 스스로 수행합니다.',
        downloadUrl: 'https://drive.google.com/uc?id=EXAMPLE_ID_2',
        usage: '1. 본인의 나이스 계정 정보를 입력합니다.<br>2. 학기, 과목, 학년 관련 정보를 입력합니다.<br>3. 주간학습안내 파일을 찾습니다. (PDF만 지원)<br>4. "업로드 시작" 버튼을 클릭합니다.<br>5. 프로그램이 나이스에 접속하여 주간학습안내를 자동으로 입력합니다.',
        history: [
            { ver: '0.0.0', date: '2025.12.25', note: '준비중(가까운 지인에게 테스트를 부탁했습니다.)' },
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
        
        <h3>사용 방법</h3>
        <div class="usage-section fade-in">
            <div class="usage-content">
                ${tool.usage || '사용 방법이 등록되지 않았습니다.'}
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
