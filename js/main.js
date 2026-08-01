/* =====================================================================
   자림인포시스템(주) — 렌더링 스크립트
   ⚠ 이 파일은 "동작"을 담당합니다. 문구 수정은 js/site-data.js 에서 하세요.
   ===================================================================== */

/* ---------- 유틸 ---------- */
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function currentPage() {
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p;
}

/* ---------- 헤더 ---------- */
function renderHeader() {
  const mount = document.getElementById('site-header-mount');
  if (!mount) return;
  const active = currentPage();
  const navHtml = SITE.nav.map(item => {
    const isActive = item.href === active ? ' active' : '';
    return `<a href="${item.href}" class="${isActive.trim()}">${item.label}</a>`;
  }).join('');

  mount.innerHTML = `
    <header class="site-header">
      <div class="wrap">
        <a href="index.html" class="brand">
          <img class="brand-logo" src="${SITE.company.partnerLogo}" alt="iPECS 공식 로고" loading="lazy" onerror="this.style.display='none'">
          <span>자림인포시스템<span class="dot">.</span></span>
          <span class="brand-en">iPECS OFFICIAL PARTNER</span>
        </a>
        <nav class="main-nav" id="main-nav">${navHtml}</nav>
        <div style="display:flex; align-items:center; gap:10px;">
          <a class="header-cta" href="${SITE.company.telHref}">
            <span class="ping"></span> ${SITE.company.tel}
          </a>
          <button class="nav-toggle" id="nav-toggle" aria-label="메뉴 열기"><span></span></button>
        </div>
      </div>
    </header>
  `;

  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('main-nav').classList.toggle('open');
  });
}

/* ---------- 푸터 ---------- */
function renderFooter() {
  const mount = document.getElementById('site-footer-mount');
  if (!mount) return;
  const c = SITE.company;
  const navHtml = SITE.nav.map(i => `<a href="${i.href}">${i.label}</a>`).join('');

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-top">
          <div>
            <div class="footer-brand">자림인포시스템<span class="dot">.</span></div>
            <div class="footer-meta">
              <span>대표이사 ${c.ceo}</span>
              <span>사업자등록번호 ${c.bizNo}</span>
            </div>
            <div class="footer-meta">
              <span>${c.address}</span>
            </div>
            <div class="footer-meta">
              <span>대표번호 ${c.tel}</span>
              <span>이메일 ${c.email}</span>
              <span>${c.hours}</span>
            </div>
          </div>
          <nav class="footer-nav">${navHtml}</nav>
        </div>
        <div class="footer-copy">© ${c.copyrightYear} ${c.name}. All Rights Reserved. · 취급 브랜드 iPECS(舊 에릭슨엘지 엔터프라이즈)는 각 사의 상표입니다.</div>
      </div>
    </footer>
  `;
}

/* ---------- 노드(네트워크 토폴로지) 배경 SVG 생성 ---------- */
function renderNodeField(mountId, opts) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const o = Object.assign({ nodes: 26, w: 1200, h: 520, seed: 7 }, opts || {});
  let seed = o.seed;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  const pts = [];
  for (let i = 0; i < o.nodes; i++) {
    pts.push({ x: rand() * o.w, y: rand() * o.h, live: rand() > 0.82 });
  }
  let lines = '';
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 190) {
        const cls = (pts[i].live && pts[j].live) ? 'ln-live' : 'ln';
        lines += `<line class="${cls}" x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}"/>`;
      }
    }
  }
  let nodes = '';
  pts.forEach(p => {
    nodes += `<circle class="${p.live ? 'nd-live' : 'nd'}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.live ? 3 : 2.2}"/>`;
  });

  mount.innerHTML = `
    <div class="node-field">
      <svg viewBox="0 0 ${o.w} ${o.h}" preserveAspectRatio="xMidYMid slice">
        ${lines}${nodes}
      </svg>
    </div>
  `;
}

/* ---------- 홈: 히어로 ---------- */
function renderHero() {
  const mount = document.getElementById('hero-mount');
  if (!mount) return;
  const h = SITE.hero;
  mount.innerHTML = `
    <div class="eyebrow">${h.eyebrow}</div>
    <h1><span>${h.title1}</span><span>${h.title2}</span></h1>
    <p class="desc">${h.desc}</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="${h.ctaPrimary.href}">${h.ctaPrimary.label}</a>
      <a class="btn btn-ghost" href="${h.ctaSecondary.href}">${h.ctaSecondary.label}</a>
    </div>
  `;
}

/* ---------- 홈: 상태판 ---------- */
function renderStats() {
  const mount = document.getElementById('stats-mount');
  if (!mount) return;
  mount.innerHTML = SITE.stats.map(s => `
    <div class="stat">
      <div class="stat-value"><span class="count" data-final="${s.value}">0</span>${s.unit ? `<span class="unit">${s.unit}</span>` : ''}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

/* ---------- 브랜드 변경 안내 ---------- */
function renderBrandNotice() {
  const mount = document.getElementById('brand-notice-mount');
  if (!mount) return;
  const b = SITE.brandNotice;
  mount.innerHTML = `
    <div class="brand-notice">
      <div class="badge-col">
        <div class="rename-chip">에릭슨엘지<br>엔터프라이즈</div>
        <div class="rename-arrow">↓ 2025 사명변경</div>
        <div class="rename-chip now">iPECS<br>(아이펙스)</div>
      </div>
      <div>
        <h3>${b.title}</h3>
        <p>${b.body}</p>
      </div>
    </div>
  `;
}

/* ---------- 홈: 제품 요약 카드 ---------- */
function renderProductSummary() {
  const mount = document.getElementById('product-summary-mount');
  if (!mount) return;
  mount.innerHTML = SITE.productSummary.map(p => `
    <a class="pcard" href="products.html#${p.id}">
      ${p.img ? `<div class="pcard-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.closest('.pcard-img').style.display='none'"></div>` : ''}
      <span class="tag">${p.tag}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="pcard-more">자세히 보기 →</span>
    </a>
  `).join('');
}

/* ---------- 홈: 실적 로고 스트립 ---------- */
function renderHomeAchievements() {
  const mount = document.getElementById('home-achv-mount');
  if (!mount) return;
  mount.innerHTML = `<div class="achv-strip">${
    SITE.homeAchievements.map(a => `<div class="achv-chip">${a}</div>`).join('')
  }</div>`;
}

/* ---------- 회사소개: 인트로 ---------- */
function renderAboutIntro() {
  const mount = document.getElementById('about-intro-mount');
  if (!mount) return;
  const a = SITE.aboutIntro;
  mount.innerHTML = `<h2>${a.title}</h2><p style="margin-top:16px;color:var(--steel);font-size:16px;max-width:70ch;">${a.body}</p>`;
}

/* ---------- 회사소개: 연혁 ---------- */
function renderHistory() {
  const mount = document.getElementById('history-mount');
  if (!mount) return;
  mount.innerHTML = `<div class="timeline">${
    SITE.history.map(h => `
      <div class="tl-item">
        <div class="tl-year">${h.year}</div>
        <div class="tl-text">${h.text}</div>
      </div>
    `).join('')
  }</div>`;
}

/* ---------- 회사소개: 주요 실적 전체 ---------- */
function renderAchievements() {
  const mount = document.getElementById('achievements-mount');
  if (!mount) return;
  mount.innerHTML = `<div class="achv-table">${
    SITE.achievements.map(a => `
      <div class="achv-row">
        <div class="yy">${a.year}</div>
        <div class="tx">${a.text}</div>
      </div>
    `).join('')
  }</div>`;
}

/* ---------- 제품소개: 목차 + 상세 ---------- */
function renderProducts() {
  const jumpMount = document.getElementById('product-jump-mount');
  const listMount = document.getElementById('product-list-mount');
  if (!listMount) return;

  if (jumpMount) {
    jumpMount.innerHTML = SITE.products.map(p => `<a href="#${p.id}">${p.name}</a>`).join('');
  }

  listMount.innerHTML = SITE.products.map(p => `
    <div class="product-detail" id="${p.id}">
      ${p.img ? `<div class="product-detail-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.closest('.product-detail-img').style.display='none'"></div>` : ''}
      <div class="product-detail-body">
        <div class="cat">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="tagline">${p.tagline}</div>
        <p class="desc">${p.desc}</p>
        <div class="spec-table">
          ${p.specs.map(s => `
            <div class="spec-row">
              <div class="k">${s.k}</div>
              <div class="v">${s.v}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- 고객지원: 연락처 카드 ---------- */
function renderContactInfo() {
  const mount = document.getElementById('contact-info-mount');
  if (!mount) return;
  const c = SITE.company;
  mount.innerHTML = `
    <div class="info-card">
      <div class="info-row"><div class="k">TEL</div><div class="v"><a href="${c.telHref}">${c.tel}</a></div></div>
      <div class="info-row"><div class="k">EMAIL</div><div class="v"><a href="mailto:${c.email}">${c.email}</a></div></div>
      <div class="info-row"><div class="k">ADDRESS</div><div class="v">${c.address}</div></div>
      <div class="info-row"><div class="k">HOURS</div><div class="v">${c.hours}</div></div>
      <div class="info-row"><div class="k">대표이사</div><div class="v">${c.ceo}</div></div>
      <div class="info-row"><div class="k">사업자번호</div><div class="v">${c.bizNo}</div></div>
      <div class="info-row"><div class="k">사업내용</div><div class="v">${c.bizScope}</div></div>
    </div>
  `;
}

/* ---------- 고객지원: FAQ ---------- */
function renderFaq() {
  const mount = document.getElementById('faq-mount');
  if (!mount) return;
  mount.innerHTML = `
    <div class="info-card">
      ${SITE.contactPage.faq.map(f => `
        <div class="faq-item">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 하단 공통 CTA ---------- */
function renderCtaBand() {
  const mount = document.getElementById('cta-band-mount');
  if (!mount) return;
  const c = SITE.company;
  mount.innerHTML = `
    <div class="cta-band">
      <div>
        <h3>도입을 검토 중이신가요?</h3>
        <p>전화 한 통이면 규모에 맞는 견적을 안내해 드립니다. ${c.tel}</p>
      </div>
      <a class="btn btn-signal" href="contact.html">지금 문의하기</a>
    </div>
  `;
}

/* ---------- 홈: 브랜드 필름(유튜브 썸네일 → 클릭 시 유튜브 재생) ---------- */
function renderVideo() {
  const mount = document.getElementById('video-section-mount');
  if (!mount) return;
  const v = SITE.video;
  const watchUrl = `https://www.youtube.com/watch?v=${v.youtubeId}`;
  const thumbHi = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;
  const thumbFallback = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
  mount.innerHTML = `
    <div class="section-head">
      <span class="kicker">${v.kicker}</span>
      <h2>${v.title}</h2>
      <p>${v.desc}</p>
    </div>
    <div class="video-frame-wrap">
      <a class="video-frame video-frame--facade" href="${watchUrl}" target="_blank" rel="noopener" aria-label="${v.title} - 유튜브에서 재생">
        <img src="${thumbHi}" alt="${v.title} 썸네일" loading="lazy"
             onerror="this.onerror=null; this.src='${thumbFallback}';">
        <span class="video-play-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
        <span class="video-frame__badge">YouTube에서 재생</span>
      </a>
    </div>
    <p class="video-caption">
      ${v.caption}
      <a href="${watchUrl}" target="_blank" rel="noopener" class="video-fallback-link">유튜브에서 바로 보기 ↗</a>
    </p>
  `;
}

/* ---------- 상태판 숫자 카운트업 애니메이션 ---------- */
function animateCount(el) {
  const final = el.dataset.final || el.textContent;
  const hasComma = final.includes(',');
  const suffixMatch = final.match(/[^0-9,]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : '';
  const numeric = parseInt(final.replace(/[^0-9]/g, ''), 10) || 0;
  const duration = 1300;
  const startTime = performance.now();

  function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * numeric);
    el.textContent = (hasComma ? val.toLocaleString('en-US') : String(val)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  }
  requestAnimationFrame(tick);
}

function setupCounters() {
  const bar = document.getElementById('stats-mount');
  if (!bar) return;
  const counts = bar.querySelectorAll('.count');
  if (!counts.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counts.forEach(animateCount);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(bar);
  } else {
    counts.forEach(animateCount);
  }
}

/* ---------- 제품 카드 3D 틸트(마우스 인터랙션) ---------- */
function setupTilt() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (reduceMotion || coarsePointer) return;

  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- 제품 이미지 동적 효과 (로딩 페이드인 · 스크롤 등장 · 은은한 플로팅) ---------- */
function setupImageEffects() {
  const boxes = document.querySelectorAll('.pcard-img, .product-detail-img');
  if (!boxes.length) return;

  boxes.forEach(box => {
    const img = box.querySelector('img');
    if (!img) return;
    const markLoaded = () => {
      img.classList.add('loaded');
      // 로딩 스켈레톤(shimmer) 애니메이션을 멈추고 은은한 플로팅 모션으로 전환
      requestAnimationFrame(() => box.classList.add('img-ready'));
    };
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', () => box.classList.remove('img-ready'), { once: true });
    }
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    boxes.forEach(box => io.observe(box));
  } else {
    boxes.forEach(box => box.classList.add('in-view'));
  }
}

/* ---------- 제품소개: 규모별 비교표 ---------- */
function renderComparisonTable() {
  const mount = document.getElementById('comparison-mount');
  if (!mount) return;
  const c = SITE.comparisonTable;
  mount.innerHTML = `
    <div class="compare-head">
      <h2>${c.title}</h2>
      <p>${c.desc}</p>
    </div>
    <div class="compare-table">
      <div class="compare-row compare-row--head">
        <div>사업장 규모</div><div>지점 구성</div><div>추천 제품</div><div>이유</div>
      </div>
      ${c.rows.map(r => `
        <div class="compare-row">
          <div class="mono" data-label="사업장 규모">${r.size}</div>
          <div data-label="지점 구성">${r.sites}</div>
          <div class="compare-pick" data-label="추천 제품">${r.pick}</div>
          <div data-label="이유">${r.reason}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 홈: 도입 프로세스 ---------- */
function renderProcess() {
  const mount = document.getElementById('process-mount');
  if (!mount) return;
  const p = SITE.process;
  mount.innerHTML = `
    <div class="section-head">
      <span class="kicker">${p.kicker}</span>
      <h2>${p.title}</h2>
      <p>${p.desc}</p>
    </div>
    <div class="process-rail">
      ${p.steps.map((s, i) => `
        <div class="process-step" style="--i:${i}">
          <div class="process-step__no">${s.no}</div>
          <h4>${s.title}</h4>
          <p>${s.desc}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 홈: 선택 이유 ---------- */
const DIFF_ICONS = {
  shield: '<path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z"/>',
  map: '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16"/><path d="M15 5v16"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  headset: '<path d="M3 13a9 9 0 0 1 18 0"/><path d="M21 13v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z"/><path d="M3 13v4a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/>',
};
function renderDifferentiators() {
  const mount = document.getElementById('differentiators-mount');
  if (!mount) return;
  mount.innerHTML = SITE.differentiators.map(d => `
    <div class="diff-card">
      <svg class="diff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${DIFF_ICONS[d.icon] || ''}</svg>
      <h4>${d.title}</h4>
      <p>${d.desc}</p>
    </div>
  `).join('');
}

/* ---------- 헤더 스크롤 그림자 ---------- */
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- 페이지 로드 시 공통 실행 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderHero();
  renderStats();
  renderBrandNotice();
  renderVideo();
  renderProductSummary();
  renderProcess();
  renderDifferentiators();
  renderHomeAchievements();
  renderAboutIntro();
  renderHistory();
  renderAchievements();
  renderProducts();
  renderComparisonTable();
  renderContactInfo();
  renderFaq();
  renderCtaBand();

  renderNodeField('hero-node-field', { nodes: 30, seed: 11 });
  setupImageEffects();
  setupCounters();
  setupTilt();
  setupHeaderScroll();
});
