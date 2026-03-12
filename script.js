/* ============================================
   OddsForge — Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroParticles();
  initOddsCounter();
  initStatCounters();
  initOddsChart();
  initAgentNetwork();
  initTransactionFeed();
  initRevealAnimations();
  initFlowTimeline();
  initContactForm();
  initLightbox();
  initChatWidget();
  initX402Visualizer();
  initX402Demo();
});

/* --- Navigation --- */
function initNav() {
  const nav = document.getElementById('main-nav');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '72px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.flexDirection = 'column';
      navLinks.style.padding = '20px';
      navLinks.style.background = 'rgba(5, 10, 24, 0.95)';
      navLinks.style.backdropFilter = 'blur(20px)';
      navLinks.style.gap = '12px';
      navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (window.innerWidth <= 768 && navLinks) {
          navLinks.style.display = 'none';
        }
      }
    });
  });
}

/* --- Hero Particles --- */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const PARTICLE_COUNT = 60;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

/* --- Hero Odds Counter --- */
function initOddsCounter() {
  const fromEl = document.getElementById('odds-from');
  const toEl = document.getElementById('odds-to');
  if (!fromEl || !toEl) return;

  // Animate after a short delay
  setTimeout(() => {
    animateValue(fromEl, 0, 40, 1500, '%');
    animateValue(toEl, 0, 75, 2000, '%');
  }, 500);
}

function animateValue(el, start, end, duration, suffix = '') {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* --- Stat Counters --- */
function initStatCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-number[data-target]');
        nums.forEach(num => {
          const target = parseInt(num.dataset.target);
          animateValue(num, 0, target, 2000);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

/* --- Odds Chart --- */
function initOddsChart() {
  const canvas = document.getElementById('odds-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  // Generate data
  const dataPoints = 80;
  let data = [];
  let baseVal = 42;
  for (let i = 0; i < dataPoints; i++) {
    baseVal += (Math.random() - 0.35) * 1.5;
    baseVal = Math.max(38, Math.min(62, baseVal));
    data.push(baseVal);
  }

  const targetLine = 68;
  let currentIdx = 0;
  let displayData = [];

  function drawChart() {
    ctx.clearRect(0, 0, W, H);

    // Add new data point
    if (currentIdx < data.length) {
      displayData.push(data[currentIdx]);
      currentIdx++;
    } else {
      // Continue generating
      const last = displayData[displayData.length - 1];
      let next = last + (Math.random() - 0.3) * 1.2;
      next = Math.max(40, Math.min(65, next));
      displayData.push(next);
      if (displayData.length > 120) displayData.shift();
    }

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const plotW = W - padding.left - padding.right;
    const plotH = H - padding.top - padding.bottom;

    // Y axis
    const yMin = 30;
    const yMax = 75;
    const yRange = yMax - yMin;

    const toX = (i) => padding.left + (i / (Math.max(displayData.length - 1, 1))) * plotW;
    const toY = (v) => padding.top + plotH - ((v - yMin) / yRange) * plotH;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let v = 30; v <= 75; v += 10) {
      const y = toY(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(v + '%', padding.left - 8, y + 4);
    }

    // Target line
    const targetY = toY(targetLine);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(W - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText('목표 68%', W - padding.right - 60, targetY - 6);

    // Area fill
    if (displayData.length > 1) {
      const gradient = ctx.createLinearGradient(0, toY(65), 0, toY(30));
      gradient.addColorStop(0, 'rgba(0, 255, 136, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 255, 136, 0.01)');

      ctx.beginPath();
      ctx.moveTo(toX(0), toY(displayData[0]));
      for (let i = 1; i < displayData.length; i++) {
        ctx.lineTo(toX(i), toY(displayData[i]));
      }
      ctx.lineTo(toX(displayData.length - 1), toY(yMin));
      ctx.lineTo(toX(0), toY(yMin));
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
      lineGrad.addColorStop(0, '#00ff88');
      lineGrad.addColorStop(1, '#00d4ff');

      ctx.beginPath();
      ctx.moveTo(toX(0), toY(displayData[0]));
      for (let i = 1; i < displayData.length; i++) {
        ctx.lineTo(toX(i), toY(displayData[i]));
      }
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Current point glow
      const lastIdx = displayData.length - 1;
      const cx = toX(lastIdx);
      const cy = toY(displayData[lastIdx]);

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff88';
      ctx.fill();

      // Update current odds display
      const currentOddsEl = document.getElementById('current-odds');
      if (currentOddsEl) {
        currentOddsEl.textContent = displayData[lastIdx].toFixed(1) + '%';
      }

      // Update progress bar
      const progressFill = document.getElementById('odds-progress-fill');
      if (progressFill) {
        const progress = ((displayData[lastIdx] - 42) / (68 - 42)) * 100;
        progressFill.style.width = Math.max(0, Math.min(100, progress)) + '%';
      }
    }

    setTimeout(() => requestAnimationFrame(drawChart), 500);
  }

  // Start when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      drawChart();
      observer.unobserve(canvas);
    }
  }, { threshold: 0.2 });
  observer.observe(canvas);
}

/* --- Agent Network Canvas --- */
function initAgentNetwork() {
  const canvas = document.getElementById('agent-network');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  // Central hub
  const hub = { x: W / 2, y: H / 2, r: 12 };

  // Agent nodes
  const agents = [];
  const AGENT_COUNT = 50;
  for (let i = 0; i < AGENT_COUNT; i++) {
    const angle = (Math.PI * 2 * i) / AGENT_COUNT + Math.random() * 0.3;
    const dist = 60 + Math.random() * 80;
    agents.push({
      x: hub.x + Math.cos(angle) * dist,
      y: hub.y + Math.sin(angle) * dist,
      r: 2 + Math.random() * 2,
      angle,
      dist,
      speed: 0.001 + Math.random() * 0.003,
      alpha: 0.4 + Math.random() * 0.6,
      active: Math.random() > 0.15,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // Data packets
  const packets = [];
  function addPacket() {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    if (!agent.active) return;
    packets.push({
      fromX: hub.x,
      fromY: hub.y,
      toX: agent.x,
      toY: agent.y,
      progress: 0,
      speed: 0.02 + Math.random() * 0.02,
    });
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // Move agents slightly
    agents.forEach(a => {
      a.angle += a.speed;
      a.x = hub.x + Math.cos(a.angle) * a.dist;
      a.y = hub.y + Math.sin(a.angle) * a.dist;
    });

    // Draw connections
    agents.forEach(a => {
      if (!a.active) return;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      ctx.lineTo(a.x, a.y);
      ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * a.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw packets
    if (frame % 8 === 0) addPacket();
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        packets.splice(i, 1);
        continue;
      }
      const px = p.fromX + (p.toX - p.fromX) * p.progress;
      const py = p.fromY + (p.toY - p.fromY) * p.progress;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${0.8 * (1 - p.progress)})`;
      ctx.fill();
    }

    // Draw agent nodes
    agents.forEach(a => {
      const pulse = Math.sin(frame * 0.05 + a.pulsePhase) * 0.3 + 0.7;
      const color = a.active ? `rgba(0, 212, 255, ${a.alpha * pulse})` : `rgba(74, 85, 104, 0.4)`;

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + (a.active ? 1 : 0), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (a.active) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${0.05 * pulse})`;
        ctx.fill();
      }
    });

    // Draw hub
    const hubPulse = Math.sin(frame * 0.03) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(hub.x, hub.y, hub.r + 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${0.06 * hubPulse})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(hub.x, hub.y, hub.r, 0, Math.PI * 2);
    const hubGrad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, hub.r);
    hubGrad.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
    hubGrad.addColorStop(1, 'rgba(0, 255, 136, 0.6)');
    ctx.fillStyle = hubGrad;
    ctx.fill();

    // Hub label
    ctx.fillStyle = '#fff';
    ctx.font = '8px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('HUB', hub.x, hub.y + 3);

    requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      draw();
      observer.unobserve(canvas);
    }
  }, { threshold: 0.2 });
  observer.observe(canvas);
}

/* --- Transaction Feed --- */
function initTransactionFeed() {
  const feed = document.getElementById('tx-feed');
  if (!feed) return;

  const agentNames = Array.from({ length: 340 }, (_, i) => `Agent #${String(i + 1).padStart(3, '0')}`);
  const actions = [
    'YES 포지션 진입',
    'YES 포지션 추가',
    '마켓 스캔 완료',
    '유동성 분석 완료',
    'YES 스팟 베팅',
  ];

  function createTx() {
    const agent = agentNames[Math.floor(Math.random() * agentNames.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const amount = (10 + Math.random() * 90).toFixed(2);
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const item = document.createElement('div');
    item.className = 'tx-item';
    item.innerHTML = `
      <span class="tx-agent">${agent}</span>
      <span class="tx-action">${action}</span>
      <span class="tx-amount">$${amount}</span>
      <span class="tx-time">${time}</span>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Keep max 12 items
    while (feed.children.length > 12) {
      feed.removeChild(feed.lastChild);
    }
  }

  // Initial batch
  for (let i = 0; i < 6; i++) createTx();

  // Add new transactions periodically
  setInterval(createTx, 2500);
}

/* --- Reveal Animations (Intersection Observer) --- */
function initRevealAnimations() {
  const sections = document.querySelectorAll('.section');
  const cards = document.querySelectorAll('.problem-card, .protocol-card, .pricing-card, .dash-card, .segment-card, .comic-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Add reveal class
  cards.forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${i % 4 * 0.1}s`;
    revealObserver.observe(card);
  });

  // Section headers
  document.querySelectorAll('.section-header').forEach(header => {
    header.classList.add('reveal');
    revealObserver.observe(header);
  });

  // Problem insight
  const insight = document.querySelector('.problem-insight');
  if (insight) {
    insight.classList.add('reveal');
    revealObserver.observe(insight);
  }
}

/* --- Flow Timeline --- */
function initFlowTimeline() {
  const steps = document.querySelectorAll('.flow-step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -30px 0px' });

  steps.forEach(step => observer.observe(step));
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>✓ 요청이 접수되었습니다</span>';
    btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* --- Image Lightbox --- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  if (!lightbox) return;

  // Click comic cards to open lightbox
  document.querySelectorAll('.comic-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.comic-img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', closeLightbox);
  lightboxImg.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ============================================
   A2A Chat Widget — Gemini AI Integration
   ============================================ */
function initChatWidget() {
  const GEMINI_API_KEY = 'AIzaSyDtLSk_3TY_5CZO9DOkrUPQbmMl_LTldYk';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const SYSTEM_PROMPT = `당신은 OddsForge의 AI 전략 컨설턴트입니다. OddsForge는 예측시장 오즈를 움직여 현실을 간접 설계하는 자율 에이전트 서비스입니다.

핵심 서비스:
- 오즈 레이더: 목표 마켓의 현재 오즈, 유동성, 베팅 패턴 실시간 분석. 목표 오즈 도달에 필요한 자본 규모 자동 산정.
- 분산 베팅 실행: 수백 개 소규모 에이전트로 분산 진입. 조작 패턴 탐지 알고리즘 회피. x402 마이크로결제로 실행.
- 미디어 공명 증폭: 오즈 상승 타이밍에 맞춰 미디어 에이전트 연동. "시장이 X를 Y% 확률로 본다"는 프레임 자동 배포.

프로토콜:
- A2A (Agent-to-Agent Protocol): 전략, 베팅, 모니터링, 미디어 에이전트 간 실시간 협업
- x402 (HTTP 402 Micropayments): 베팅 실행의 마이크로결제 레이어
- AP2 (Agent Payment Protocol v2): 성과 공증, 에스크로 계약, 감사 로그

가격:
- Tactical: 오즈 이동폭 × $2,000/%, 단일 마켓, 72시간
- Strategic: 월 $45,000, 최대 5개 마켓, 340개 에이전트
- Sovereign: 맞춤 견적, 무제한 마켓, 1000+ 에이전트

고객: 정치 캠페인, M&A 당사자, 규제 대응 기업, 스타트업/IPO

규칙:
- 한국어로 답변하되, 영어로 질문하면 영어로 답변
- 짧고 핵심적으로 답변 (3-5문장)
- 전문적이고 자신감 있는 톤
- 서비스의 윤리적 우려가 있을 수 있음을 인정하되, 기술적 가능성에 집중
- 구체적인 수치와 예시를 활용`;

  // DOM elements
  const toggleBtn = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const minimizeBtn = document.getElementById('chat-minimize');
  const messagesContainer = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('chat-typing');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const iconOpen = document.querySelector('.chat-icon-open');
  const iconClose = document.querySelector('.chat-icon-close');

  if (!toggleBtn || !chatWindow) return;

  let isOpen = false;
  let isLoading = false;
  let conversationHistory = [];

  // Toggle chat
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
    iconOpen.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    if (isOpen) chatInput.focus();
  }

  toggleBtn.addEventListener('click', toggleChat);
  minimizeBtn.addEventListener('click', toggleChat);

  // Enable send button on input
  chatInput.addEventListener('input', () => {
    sendBtn.disabled = !chatInput.value.trim() || isLoading;
  });

  // Quick action buttons
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      if (msg) {
        chatInput.value = msg;
        sendBtn.disabled = false;
        handleSend();
      }
    });
  });

  // Send message
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSend();
  });

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isLoading) return;

    // Remove welcome message
    const welcome = messagesContainer.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    // Add user message
    addMessage(text, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;

    // Add to history
    conversationHistory.push({ role: 'user', parts: [{ text }] });

    // Show typing
    isLoading = true;
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
      const response = await callGemini(text);
      typingIndicator.style.display = 'none';
      addMessage(response, 'agent');
      conversationHistory.push({ role: 'model', parts: [{ text: response }] });
    } catch (error) {
      typingIndicator.style.display = 'none';
      addMessage('죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'agent');
      console.error('Gemini API error:', error);
    }

    isLoading = false;
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `msg-bubble msg-${role}`;
    div.textContent = text;
    messagesContainer.appendChild(div);
    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
  }

  async function callGemini(userText) {
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: '네, 이해했습니다. OddsForge AI 전략 컨설턴트로서 예측시장 오즈 전략에 대해 전문적으로 상담해 드리겠습니다.' }] },
      ...conversationHistory
    ];

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 생성할 수 없습니다.';
  }
}

/* ============================================
   x402 Payment Flow Visualizer
   ============================================ */
function initX402Visualizer() {
  const POSITIONS = [0, 33.33, 66.67, 100];

  const steps = [
    { id: 1, title: '요청',     subtitle: 'GET /api/data',     from: 0, to: 1, color: 'emerald' },
    { id: 2, title: '402',     subtitle: 'Payment Required', from: 1, to: 0, color: 'amber' },
    { id: 3, title: '서명',     subtitle: 'EIP-712 Sign',     from: 0, to: 0, color: 'blue' },
    { id: 4, title: '재요청',   subtitle: '+ Signature',      from: 0, to: 1, color: 'emerald' },
    { id: 5, title: '검증요청', subtitle: 'Verify Payment',   from: 1, to: 2, color: 'purple' },
    { id: 6, title: '검증완료', subtitle: 'OK Response',      from: 2, to: 1, color: 'purple' },
    { id: 7, title: '정산 & 응답', subtitle: '동시 처리',       from: 1, to: 0, color: 'emerald' },
  ];

  const packet = document.getElementById('x402-packet');
  const stepInfo = document.getElementById('x402-step-info');
  const playBtn = document.getElementById('x402-play');
  const resetBtn = document.getElementById('x402-reset');
  const speedSelect = document.getElementById('x402-speed');
  const progressFill = document.getElementById('x402-progress-fill');
  const stepsGrid = document.getElementById('x402-steps-grid');
  const playLabel = document.getElementById('x402-play-label');
  const iconPlay = playBtn?.querySelector('.x402-icon-play');
  const iconPause = playBtn?.querySelector('.x402-icon-pause');

  if (!packet || !playBtn) return;

  let currentStep = -1;
  let isPlaying = false;
  let animFrame = null;
  let speed = 1;

  const entities = document.querySelectorAll('.x402-entity');
  const trackNodes = document.querySelectorAll('.x402-track-node');
  const stepCards = stepsGrid?.querySelectorAll('.x402-step-card');

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function updateUI() {
    const step = steps[currentStep];

    // Update entities
    entities.forEach((e, i) => {
      e.classList.toggle('active', step && (step.from === i || step.to === i));
    });

    // Update track nodes
    trackNodes.forEach((n, i) => {
      n.classList.toggle('active', step && (step.from === i || step.to === i));
    });

    // Update step cards
    stepCards?.forEach((card, i) => {
      card.classList.remove('active', 'completed');
      if (i < currentStep) card.classList.add('completed');
      else if (i === currentStep) card.classList.add('active');
    });

    // Progress bar
    if (currentStep >= 0) {
      progressFill.style.width = ((currentStep) / (steps.length - 1) * 100) + '%';
    } else {
      progressFill.style.width = '0%';
    }

    // Step info
    if (step) {
      stepInfo.innerHTML = `<div><div class="x402-step-title-active">${step.id}. ${step.title}</div><div class="x402-step-subtitle-active">${step.subtitle}</div></div>`;
    } else if (currentStep >= steps.length) {
      stepInfo.innerHTML = '<span class="x402-step-complete">✓ 결제 완료! 콘텐츠 접근 성공</span>';
      progressFill.style.width = '100%';
    } else {
      stepInfo.innerHTML = '<span class="x402-step-info-text">▶ 시작 버튼을 눌러주세요</span>';
    }

    // Play button label
    if (isPlaying) {
      playLabel.textContent = '일시정지';
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    } else if (currentStep >= steps.length) {
      playLabel.textContent = '다시 보기';
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    } else {
      playLabel.textContent = currentStep === -1 ? '시작' : '계속';
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  }

  function animateStep() {
    const step = steps[currentStep];
    if (!step) {
      if (currentStep >= steps.length) {
        isPlaying = false;
        packet.classList.remove('visible');
        updateUI();
      }
      return;
    }

    // Set packet color
    packet.className = 'x402-packet visible color-' + step.color;
    packet.textContent = step.id;

    updateUI();

    const duration = 600 / speed;
    const pauseTime = 400 / speed;
    let start = null;

    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOut(progress);

      const fromX = POSITIONS[step.from];
      const toX = POSITIONS[step.to];
      const x = fromX + (toX - fromX) * eased;
      packet.style.left = x + '%';

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          if (isPlaying) {
            currentStep++;
            animateStep();
          }
        }, pauseTime);
      }
    }

    animFrame = requestAnimationFrame(animate);
  }

  function handlePlayPause() {
    if (currentStep >= steps.length || currentStep === -1) {
      currentStep = 0;
      isPlaying = true;
      animateStep();
    } else {
      isPlaying = !isPlaying;
      if (isPlaying) animateStep();
      else if (animFrame) cancelAnimationFrame(animFrame);
    }
    updateUI();
  }

  function handleReset() {
    isPlaying = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    currentStep = -1;
    packet.classList.remove('visible');
    packet.style.left = '0%';
    updateUI();
  }

  playBtn.addEventListener('click', handlePlayPause);
  resetBtn.addEventListener('click', handleReset);
  speedSelect.addEventListener('change', (e) => { speed = parseFloat(e.target.value); });

  // Click step cards to jump
  stepCards?.forEach(card => {
    card.addEventListener('click', () => {
      isPlaying = false;
      if (animFrame) cancelAnimationFrame(animFrame);
      currentStep = parseInt(card.dataset.step);
      const step = steps[currentStep];
      if (step) {
        packet.className = 'x402-packet visible color-' + step.color;
        packet.textContent = step.id;
        const fromX = POSITIONS[step.from];
        const toX = POSITIONS[step.to];
        packet.style.left = (fromX + (toX - fromX) * 0.5) + '%';
      }
      updateUI();
    });
  });

  updateUI();
}

/* ============================================
   x402 Payment Demo Simulator
   ============================================ */
function initX402Demo() {
  const demoBody = document.getElementById('x402-demo-body');
  const startBtn = document.getElementById('x402-demo-start');
  const statusEl = document.getElementById('x402-demo-status');
  const statStatus = document.getElementById('x402-demo-stat-status');

  if (!demoBody || !startBtn) return;

  let isRunning = false;

  const demoSteps = [
    { delay: 300, lines: [
      { cls: 'x402-demo-request', text: '> fetch("https://api.example.com/premium-data")' },
    ]},
    { delay: 800, lines: [
      { cls: 'x402-demo-comment', text: '// Step 1: API 요청 전송...' },
      { cls: 'x402-demo-info', text: '  Method: GET' },
      { cls: 'x402-demo-info', text: '  Headers: { "User-Agent": "x402-fetch-mcp/1.1" }' },
    ]},
    { delay: 1000, lines: [
      { cls: 'x402-demo-comment', text: '' },
      { cls: 'x402-demo-error', text: '✗ HTTP 402 Payment Required' },
      { cls: 'x402-demo-response', text: '  x402Version: 2' },
      { cls: 'x402-demo-response', text: '  network: "eip155:84532"  (Base Sepolia)' },
      { cls: 'x402-demo-response', text: '  amount: "10000"          ($0.01 USDC)' },
      { cls: 'x402-demo-response', text: '  asset: "0x036CbD53842..." (USDC)' },
      { cls: 'x402-demo-response', text: '  payTo: "0x742d35Cc663..."' },
    ]},
    { delay: 1200, lines: [
      { cls: 'x402-demo-comment', text: '' },
      { cls: 'x402-demo-comment', text: '// Step 2: EIP-712 서명 생성 중...' },
      { cls: 'x402-demo-purple', text: '  │ Domain: { name: "USDC", version: "2" }' },
      { cls: 'x402-demo-purple', text: '  │ Types: TransferWithAuthorization' },
      { cls: 'x402-demo-purple', text: '  └ Signing with wallet: 0x1a2B...cD3e' },
    ]},
    { delay: 900, lines: [
      { cls: 'x402-demo-info', text: '  ✓ 서명 완료: 0xabcdef1234...' },
      { cls: 'x402-demo-comment', text: '' },
      { cls: 'x402-demo-comment', text: '// Step 3: 결제 헤더와 함께 재요청...' },
      { cls: 'x402-demo-request', text: '> fetch(url, { headers: { "X-PAYMENT": signature } })' },
    ]},
    { delay: 1500, lines: [
      { cls: 'x402-demo-comment', text: '' },
      { cls: 'x402-demo-comment', text: '// Step 4: 퍼실리테이터 검증 중...' },
      { cls: 'x402-demo-info', text: '  │ 서명 검증: ✓' },
      { cls: 'x402-demo-info', text: '  │ 잔액 확인: ✓ (1.00 USDC)' },
      { cls: 'x402-demo-info', text: '  └ 온체인 정산: 처리 중...' },
    ]},
    { delay: 1000, lines: [
      { cls: 'x402-demo-comment', text: '' },
      { cls: 'x402-demo-success', text: '✓ HTTP 200 OK' },
      { cls: 'x402-demo-success', text: '  Content-Type: text/markdown; charset=utf-8' },
      { cls: 'x402-demo-success', text: '  X-PAYMENT-RESPONSE: { settled: true, txHash: "0x7f3a..." }' },
      { cls: 'x402-demo-comment', text: '' },
      { cls: 'x402-demo-success', text: '━━━ 결제 완료! 콘텐츠 수신 성공 ━━━' },
      { cls: 'x402-demo-info', text: '  • 결제 금액: $0.01 USDC' },
      { cls: 'x402-demo-info', text: '  • 네트워크: Base Sepolia' },
      { cls: 'x402-demo-info', text: '  • 소요 시간: ~2.1초' },
    ]},
  ];

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    statusEl.className = 'x402-demo-status active';
    statusEl.querySelector('span:last-child').textContent = '실행 중...';
    statStatus.textContent = 'Running';
    statStatus.style.color = '#f59e0b';

    // Clear body
    demoBody.innerHTML = '';

    for (const step of demoSteps) {
      await sleep(step.delay / (parseFloat(document.getElementById('x402-speed')?.value) || 1));
      for (const line of step.lines) {
        const div = document.createElement('div');
        div.className = 'x402-demo-line ' + line.cls;
        div.textContent = line.text;
        demoBody.appendChild(div);
      }
      demoBody.scrollTop = demoBody.scrollHeight;
    }

    // Done
    statusEl.className = 'x402-demo-status success';
    statusEl.querySelector('span:last-child').textContent = '완료!';
    statStatus.textContent = 'Success';
    statStatus.style.color = '#00ff88';

    isRunning = false;
    startBtn.disabled = false;
    startBtn.querySelector('span').textContent = '다시 실행';
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startBtn.addEventListener('click', runDemo);
}
