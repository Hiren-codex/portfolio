
'use strict';

/* ─── NAVBAR SCROLL ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 400);
}, { passive: true });

/* ─── MOBILE MENU ───────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close on link click
navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ─── ACTIVE NAV LINK ON SCROLL ──────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ─── SCROLL REVEAL ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay for siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const idx = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 80, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── TYPED TEXT EFFECT ──────────────────────────────────── */
const typedEl = document.getElementById('typed');
const words = [
  'Scalable Full-Stack Systems',
  'Resilient Cloud Backends',
  'Interactive Modern Frontends',
  'High-Performance REST APIs',
  'Robust Distributed Architectures'
];
let wIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const word = words[wIdx];
  if (deleting) {
    cIdx--;
    typedEl.textContent = word.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 55);
  } else {
    cIdx++;
    typedEl.textContent = word.slice(0, cIdx);
    if (cIdx === word.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 95);
  }
}
typeLoop();


/* ─── ROTATING SPIRAL GALAXY & COSMIC UNIVERSE SIMULATION ── */
(function initGalaxy() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 1. Spiral Galaxy Stars (centered behind hero text)
  const GALAXY_STARS = Math.min(280, Math.floor(window.innerWidth / 5));
  const ARMS = 3;
  const ARM_ANGLE = (Math.PI * 2) / ARMS;
  const stars = [];

  for (let i = 0; i < GALAXY_STARS; i++) {
    const dist = Math.pow(Math.random(), 1.6) * (Math.min(window.innerWidth, window.innerHeight) * 0.48) + 15;
    const armOffset = (i % ARMS) * ARM_ANGLE;
    const spiralAngle = dist * 0.0055 + armOffset + (Math.random() - 0.5) * 0.45;

    // Color gradient across galaxy (hot cyan core, magenta/violet spiral arms, cool white-blue edge)
    let color;
    const ratio = dist / (Math.min(window.innerWidth, window.innerHeight) * 0.48);
    if (ratio < 0.25) {
      color = 'rgba(255, 255, 255, ';
    } else if (ratio < 0.55) {
      color = 'rgba(168, 85, 247, '; // purple / violet
    } else if (ratio < 0.8) {
      color = 'rgba(236, 72, 153, '; // pink / magenta
    } else {
      color = 'rgba(6, 182, 212, ';  // cyan
    }

    stars.push({
      dist: dist,
      angle: spiralAngle,
      speed: (0.00065 + (1 / (dist + 30)) * 0.08) * (Math.random() > 0.5 ? 1 : 0.9),
      size: Math.random() * 1.8 + 0.5,
      baseAlpha: Math.random() * 0.6 + 0.35,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      color: color
    });
  }

  // 2. Distant Deep Space Background Stars (Universe field)
  const BACKGROUND_STARS = 120;
  const bgStars = Array.from({ length: BACKGROUND_STARS }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.5 + 0.1,
    twinkle: Math.random() * 0.02 + 0.005
  }));

  // 3. Cosmic Shooting Stars / Comets
  const shootingStars = [];
  function createShootingStar() {
    if (shootingStars.length >= 2) return;
    const startX = Math.random() * W * 0.8 + W * 0.1;
    const startY = Math.random() * (H * 0.4);
    const length = Math.random() * 90 + 60;
    const speed = Math.random() * 7 + 8;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // diagonal sweep

    shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      alpha: 1,
      life: 0
    });
  }

  // Interactive subtle mouse parallax on galaxy center
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - W / 2) * 0.05;
    targetY = (e.clientY - H / 2) * 0.05;
  }, { passive: true });

  let tick = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    tick += 0.02;

    // Smooth camera inertia
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    const centerX = W / 2 + mouseX;
    const centerY = (H * 0.45) + mouseY;

    // Draw deep universe stars
    bgStars.forEach(s => {
      s.alpha += Math.sin(tick * 2 + s.twinkle * 100) * 0.005;
      const a = Math.max(0.08, Math.min(0.8, s.alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + a + ')';
      ctx.fill();
    });

    // Draw galaxy core glow
    const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 160);
    coreGlow.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
    coreGlow.addColorStop(0.5, 'rgba(79, 70, 229, 0.1)');
    coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Draw rotating spiral galaxy stars
    stars.forEach(s => {
      s.angle += s.speed;
      const px = centerX + Math.cos(s.angle) * s.dist;
      const py = centerY + Math.sin(s.angle) * (s.dist * 0.65); // Elliptical perspective tilt

      const alpha = s.baseAlpha + Math.sin(tick * 3 + s.dist) * 0.15;
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color + Math.max(0.1, alpha) + ')';
      ctx.fill();

      // Halo for larger cluster stars
      if (s.size > 1.4) {
        ctx.beginPath();
        ctx.arc(px, py, s.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (alpha * 0.2) + ')';
        ctx.fill();
      }
    });

    // Random shooting stars
    if (Math.random() < 0.015) {
      createShootingStar();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const st = shootingStars[i];
      st.x += st.dx;
      st.y += st.dy;
      st.life++;
      st.alpha -= 0.02;

      if (st.alpha <= 0 || st.x > W || st.y > H) {
        shootingStars.splice(i, 1);
        continue;
      }

      const grad = ctx.createLinearGradient(
        st.x, st.y,
        st.x - st.dx * 2.5, st.y - st.dy * 2.5
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, ' + st.alpha + ')');
      grad.addColorStop(0.4, 'rgba(6, 182, 212, ' + (st.alpha * 0.7) + ')');
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.beginPath();
      ctx.moveTo(st.x, st.y);
      ctx.lineTo(st.x - st.dx * 2.5, st.y - st.dy * 2.5);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }
  animate();
})();


/* ─── SKILLS TABS ────────────────────────────────────────── */
const tabBtns   = document.querySelectorAll('.tab[data-tab]');
const panels    = document.querySelectorAll('.skills-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    panels.forEach(panel => {
      const active = panel.id === 'tab-' + target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });

    // Animate skill bars in newly visible panel
    setTimeout(animateSkillBars, 50);

    // Re-observe reveal items in the new panel
    const newPanel = document.getElementById('tab-' + target);
    newPanel.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
      }
    });
  });
});

/* ─── SKILL BAR ANIMATION ────────────────────────────────── */
function animateSkillBars() {
  const activePanel = document.querySelector('.skills-panel.active');
  if (!activePanel) return;
  activePanel.querySelectorAll('.skill-fill').forEach(fill => {
    fill.classList.add('animated');
  });
}

// Observe skills section to trigger bar animations
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateSkillBars();
  }, { threshold: 0.2 }).observe(skillsSection);
}

/* ─── PROJECT FILTER ─────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ─── INTERACTIVE DEVELOPER CONSOLE & CONNECT HUB ─────────── */
const terminalBody   = document.getElementById('terminalBody');
const terminalForm   = document.getElementById('terminalForm');
const terminalInput  = document.getElementById('terminalInput');
const toastPopup     = document.getElementById('toastPopup');

function showToast(msg) {
  if (!toastPopup) return;
  toastPopup.textContent = msg || 'Copied to clipboard! 🚀';
  toastPopup.classList.add('show');
  setTimeout(() => {
    toastPopup.classList.remove('show');
  }, 2600);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied ' + text + ' to clipboard! 📋');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied to clipboard! 📋');
  });
}

// Copy buttons
const copyEmailQuickBtn  = document.getElementById('copyEmailQuickBtn');
const copyEmailActionBtn = document.getElementById('copyEmailActionBtn');

if (copyEmailQuickBtn) {
  copyEmailQuickBtn.addEventListener('click', () => copyToClipboard('hirenkachhadiya1@gmail.com'));
}
if (copyEmailActionBtn) {
  copyEmailActionBtn.addEventListener('click', () => copyToClipboard('hirenkachhadiya1@gmail.com'));
}

const COMMAND_RESPONSES = {
  "status": `
    <p class="t-success">🟢 <strong>ACTIVE & AVAILABLE:</strong></p>
    <p>• Location: <strong>Germany</strong> (Open to Relocation & Remote)</p>
    <p>• Target Roles: <strong>Full-Stack Engineer / Frontend Engineer / AI-Agentic Architect</strong></p>
    <p>• Languages: <strong>German (B2 Certified)</strong> &bull; <strong>English (Fluent)</strong></p>
    <p>• Notice Period: <strong>Immediate / Flexible</strong></p>
  `,
  "skills": `
    <p class="t-accent">⚡ <strong>CORE TECHNICAL ARCHITECTURE:</strong></p>
    <p>• <strong>Frontend:</strong> React 18, TypeScript, Vite, Tailwind CSS, Responsive UX</p>
    <p>• <strong>Mobile:</strong> React Native, Expo Go, Cross-Platform Architecture</p>
    <p>• <strong>Backend & Data:</strong> Node.js, Express, REST APIs, RBAC Security, SQL</p>
    <p>• <strong>Agentic AI:</strong> Claude Code, Cursor, Antigravity, MCP Toolchains (Figma MCP)</p>
  `,
  "projects": `
    <p class="t-warning">🚀 <strong>PRODUCTION & LIVE PROJECTS:</strong></p>
    <p>1. <strong>FutureGEN (CodingLight):</strong> Live on Port 3000 (Multi-Model Autonomous Coding Agent)</p>
    <p>2. <strong>Glowy+ Telehealth:</strong> <a href="https://telehealth-platform-far30n6ml-bg-46f3.vercel.app/" target="_blank" style="color:#38bdf8;">Live on Vercel ↗</a> (Next.js 14 &amp; GLP-1 Medical Platform)</p>
    <p>3. <strong>Glowy+ Mobile App:</strong> Live on Port 4444 (Expo Go / React Native)</p>
    <p>4. <strong>Glowy Supplier & Admin:</strong> Live on Port 5001/supplier (RBAC Governance)</p>
    <p>5. <strong>Developer Portfolio:</strong> <a href="https://hirenkumar-portfolio.vercel.app/" target="_blank" style="color:#38bdf8;">Live on Vercel ↗</a> &bull; <a href="https://github.com/Hiren-codex/portfolio" target="_blank" style="color:#a855f7;">GitHub ↗</a></p>
  `,
  "portfolio": `
    <p class="t-accent">🌌 <strong>HIRENKUMAR DEVELOPER PORTFOLIO:</strong></p>
    <p>• <strong>Live URL:</strong> <a href="https://hirenkumar-portfolio.vercel.app/" target="_blank" style="color:#38bdf8;">https://hirenkumar-portfolio.vercel.app</a></p>
    <p>• <strong>GitHub Repo:</strong> <a href="https://github.com/Hiren-codex/portfolio" target="_blank" style="color:#a855f7;">github.com/Hiren-codex/portfolio</a></p>
    <p>• <strong>Stack:</strong> HTML5, CSS3 Glassmorphism, 60fps Canvas Particle Galaxy Engine, Vanilla JS, Vercel Edge CDN</p>
  `,
  "futuregen": `
    <p class="t-accent">🤖 <strong>FUTUREGEN (CodingLight) • Autonomous Coding Agent:</strong></p>
    <p>• <strong>Overview:</strong> Multi-model autonomous coding agent transforming natural language prompts into production-ready full-stack software architectures.</p>
    <p>• <strong>Live App:</strong> <a href="http://localhost:3000/" target="_blank" style="color:#38bdf8;">http://localhost:3000</a></p>
    <p>• <strong>GitHub Repo:</strong> <a href="https://github.com/businessgurukula1-dot/codinglight" target="_blank" style="color:#a855f7;">github.com/businessgurukula1-dot/codinglight</a></p>
    <p>• <strong>Core Tech:</strong> Next.js, React, TypeScript, FastAPI, Docker, Container Tools, Multi-Model LLM Orchestration</p>
  `,
  "codinglight": `
    <p class="t-accent">🤖 <strong>FUTUREGEN (Formerly CodingLight):</strong></p>
    <p>• See full agentic system at <a href="http://localhost:3000/" target="_blank" style="color:#38bdf8;">http://localhost:3000</a> or inspect repo at <a href="https://github.com/businessgurukula1-dot/codinglight" target="_blank" style="color:#a855f7;">GitHub</a>.</p>
  `,
  "why-hire": `
    <p class="t-success">💡 <strong>VALUE PROPOSITION:</strong></p>
    <p>• Bridges rapid AI-assisted development with rock-solid software craftsmanship</p>
    <p>• Full lifecycle agility: from agile client communication to zero-error deployment</p>
    <p>• Bilingual efficiency (German B2 & English) integrated in German engineering workflows</p>
  `,
  "contact": `
    <p class="t-accent">📬 <strong>DIRECT CONTACT INFO:</strong></p>
    <p>• Email: <a href="mailto:hirenkachhadiya1@gmail.com" style="color:#38bdf8;">hirenkachhadiya1@gmail.com</a></p>
    <p>• WhatsApp / Phone: <a href="https://wa.me/919510508406" target="_blank" style="color:#34d399;">+91 95105 08406</a></p>
    <p>• LinkedIn: <a href="https://www.linkedin.com/in/hiren-kachhadiya-297157184" target="_blank" style="color:#818cf8;">linkedin.com/in/hiren-kachhadiya-297157184</a></p>
  `,
  "help": `
    <p class="t-dim">Available commands: <strong>status</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>futuregen</strong>, <strong>why-hire</strong>, <strong>contact</strong>, <strong>clear</strong></p>
  `
};

function executeTerminalCommand(cmdRaw) {
  if (!terminalBody) return;
  const cmd = cmdRaw.trim().toLowerCase();
  if (!cmd) return;

  if (cmd === 'clear') {
    terminalBody.innerHTML = '';
    return;
  }

  // Append input command line
  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-line';
  cmdLine.innerHTML = '<span class="t-prompt">hiren@portfolio:~$</span> <span class="t-cmd">' + escapeHtml(cmd) + '</span>';
  terminalBody.appendChild(cmdLine);

  // Output response
  const outLine = document.createElement('div');
  outLine.className = 'terminal-output';

  if (COMMAND_RESPONSES[cmd]) {
    outLine.innerHTML = COMMAND_RESPONSES[cmd];
  } else if (cmd === 'email' || cmd === 'mail') {
    copyToClipboard('hirenkachhadiya1@gmail.com');
    outLine.innerHTML = '<p class="t-success">📋 Copied hirenkachhadiya1@gmail.com to clipboard!</p>';
  } else {
    outLine.innerHTML = '<p style="color:#f87171;">Command not found: "' + escapeHtml(cmd) + '". Type <span class="t-cmd">help</span> or click command chips above.</p>';
  }

  terminalBody.appendChild(outLine);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Chip clicks
document.querySelectorAll('.t-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const cmd = chip.getAttribute('data-cmd');
    executeTerminalCommand(cmd);
  });
});

if (terminalForm && terminalInput) {
  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = terminalInput.value;
    terminalInput.value = '';
    executeTerminalCommand(cmd);
  });
}

/* ─── PROJECT DETAIL MODAL ───────────────────────────────── */
const PROJECT_MODAL_DATA = {
  futuregen: {
    badges: [
      { text: '🤖 AI Autonomous Agent', style: 'background:rgba(6,182,212,0.15);color:#22d3ee;border-color:rgba(6,182,212,0.3);' },
      { text: '⭐ Active Live App', style: 'background:rgba(59,130,246,0.15);color:#60a5fa;border-color:rgba(59,130,246,0.3);' },
      { text: '🐙 GitHub', style: 'background:rgba(255,255,255,0.1);color:#e2e8f0;' }
    ],
    title: 'FutureGEN • Autonomous Coding Agent',
    subtitle: 'Multi-Model Autonomous Software Architecture & Container Verification (formerly CodingLight)',
    problem: 'Modern engineering teams spend hours scaffolding repetitive boilerplates, orchestrating complex multi-tier APIs, and testing deployment environments. FutureGEN bridges the gap by translating natural language prompts into verified, production-grade full-stack architectures using autonomous AI coding agents.',
    features: [
      'Natural Language to Architecture: Scaffolds full-stack apps (SaaS dashboards, FastAPI backends, RAG chatbots, Next.js storefronts) directly from prompts.',
      'Autonomous Multi-Model Execution: Coordinates specialized LLM reasoning loops to generate production-ready code with strict typing.',
      'Container Tool Verification: Validates execution in isolated container runtimes with automated syntax and test checks.',
      'Live Web Interface: Real-time generation feedback, architecture blueprints, and rapid deployment capabilities.',
      'GitHub Integration: Connected directly to GitHub for version control and automated continuous delivery.'
    ],
    techStack: ['Next.js', 'React 18', 'TypeScript', 'FastAPI / Python', 'Docker', 'Autonomous Agents', 'Container Tools', 'REST API'],
    metrics: '⚡ Transforms natural language into complete, container-verified software architectures in seconds with zero-defect typing.',
    liveUrl: 'http://localhost:3000/',
    liveText: 'Visit Live App (Port 3000) ↗',
    gitUrl: 'https://github.com/businessgurukula1-dot/codinglight',
    gitText: 'View GitHub Repo ↗'
  },
  'glowy-web': {
    badges: [
      { text: '🩺 HealthTech / Telehealth', style: 'background:rgba(99,102,241,0.15);color:#818cf8;border-color:rgba(99,102,241,0.3);' },
      { text: '⭐ Active Live App', style: '' },
      { text: '🐙 GitHub', style: 'background:rgba(255,255,255,0.1);color:#e2e8f0;' }
    ],
    title: 'Glowy+ • GLP-1 Weight Loss & Modern Telehealth',
    subtitle: 'Clinical Telehealth Platform for Physician Consultations & GLP-1 Care',
    problem: 'Accessing specialized GLP-1 weight loss care requires secure physician evaluations, prescription tracking, and streamlined billing. Glowy+ provides a modern, clinical telehealth infrastructure ensuring compliance and patient engagement.',
    features: [
      'Digital patient onboarding and clinical intake evaluation workflows.',
      'Physician portal for consultation review and prescription management.',
      'Stripe billing integration with automated webhooks and subscription plans.',
      'HIPAA-ready architecture with secure authenticated user dashboards.'
    ],
    techStack: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'Telehealth EMR'],
    metrics: '🚀 Sub-second server-rendered pages with automated checkout flow and secure patient auth.',
    liveUrl: 'https://telehealth-platform-far30n6ml-bg-46f3.vercel.app/',
    liveText: 'Visit Live Telehealth (Vercel) ↗',
    gitUrl: 'https://github.com/Hiren-codex/telehealth-platform.git',
    gitText: 'View GitHub Repo ↗'
  },
  'glowy-mobile': {
    badges: [
      { text: 'Cross-Platform Mobile', style: '' },
      { text: '📱 Expo Go', style: 'background:rgba(16,185,129,0.15);color:#34d399;' },
      { text: '🦊 GitLab', style: 'background:rgba(226,67,41,0.15);color:#fc6d26;' }
    ],
    title: 'Glowy+ • Cross-Functional Mobile App',
    subtitle: 'Native Mobile Experience Powered by React Native & Expo Go',
    problem: 'Sustained behavioral habits require on-the-go accessibility with offline capabilities, so users never lose momentum due to connectivity drops.',
    features: [
      'Native gestures, tactile haptics, and habit streak tracking loops.',
      'Offline-first architecture with persistent local caching via AsyncStorage.',
      'Unified codebase providing 100% feature parity across iOS and Android.',
      'Automated testing and CI/CD pipelines managed via GitLab.'
    ],
    techStack: ['React Native', 'Expo Go', 'TypeScript', 'AsyncStorage', 'GitLab CI', 'Mobile UX'],
    metrics: '📱 Smooth 60fps animations with instant offline state recovery and cross-device sync.',
    liveUrl: 'http://localhost:4444/',
    liveText: 'Visit Live Web (Port 4444) ↗',
    gitUrl: 'https://gitlab.com/businessgurukula1/Glowify-Mindset/-/tree/8f69469737965d1385ae182c498739bc85dc70ee/',
    gitText: 'View GitLab Repo ↗'
  },
  'glowy-portal': {
    badges: [
      { text: 'Enterprise Admin', style: '' },
      { text: '⭐ Active Live App', style: 'background:rgba(234,88,12,0.15);color:#fb923c;' },
      { text: '🦊 GitLab', style: 'background:rgba(226,67,41,0.15);color:#fc6d26;' }
    ],
    title: 'Glowy Supplier & Admin Portal',
    subtitle: 'Centralized Enterprise Supplier Governance & Operations Platform',
    problem: 'Operating a growing ecosystem requires strict multi-tenant governance, Role-Based Access Control (RBAC), supplier onboarding workflows, and comprehensive audit trails.',
    features: [
      'Role-Based Access Control (RBAC) with granular permission trees and JWT security.',
      'Automated supplier onboarding, verification, and contract management pipelines.',
      'Operational analytics dashboards tracking supplier KPIs and fulfillment rates.',
      'Complete immutable audit logging for enterprise compliance.'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'RBAC Auth', 'Supplier Workflows', 'REST API', 'GitLab CI/CD'],
    metrics: '🛡️ Zero security incidents, sub-100ms API response latency, and complete regulatory compliance.',
    liveUrl: 'http://localhost:5001/supplier',
    liveText: 'Visit Live Portal (Port 5001) ↗',
    gitUrl: 'https://gitlab.com/businessgurukula1/Glowy-admin-portal/-/tree/3e917bcf35efddd5b92e5c7e27c375e74ae1f6d1',
    gitText: 'View GitLab Repo ↗'
  }
};

const projectModal   = document.getElementById('projectModal');
const modalCloseBtn  = document.getElementById('modalCloseBtn');
const modalTitle     = document.getElementById('modalTitle');
const modalSubtitle  = document.getElementById('modalSubtitle');
const modalBadges    = document.getElementById('modalBadges');
const modalProblem   = document.getElementById('modalProblem');
const modalFeatures  = document.getElementById('modalFeatures');
const modalTechStack = document.getElementById('modalTechStack');
const modalMetrics   = document.getElementById('modalMetrics');
const modalLiveBtn   = document.getElementById('modalLiveBtn');
const modalGitBtn    = document.getElementById('modalGitBtn');

function openProjectModal(key) {
  const data = PROJECT_MODAL_DATA[key];
  if (!data || !projectModal) return;

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
  if (modalProblem) modalProblem.textContent = data.problem;
  if (modalMetrics) modalMetrics.textContent = data.metrics;

  if (modalBadges) {
    modalBadges.innerHTML = (data.badges || []).map(b => {
      const styleAttr = b.style ? `style="${b.style}"` : '';
      return `<span class="project-tag" ${styleAttr}>${b.text}</span>`;
    }).join('');
  }

  if (modalFeatures) {
    modalFeatures.innerHTML = (data.features || []).map(f => `<li>${f}</li>`).join('');
  }

  if (modalTechStack) {
    modalTechStack.innerHTML = (data.techStack || []).map(t => `<span>${t}</span>`).join('');
  }

  if (modalLiveBtn) {
    if (data.liveUrl) {
      modalLiveBtn.style.display = 'inline-flex';
      modalLiveBtn.href = data.liveUrl;
      modalLiveBtn.textContent = data.liveText || 'Visit Live App ↗';
    } else {
      modalLiveBtn.style.display = 'none';
    }
  }

  if (modalGitBtn) {
    if (data.gitUrl) {
      modalGitBtn.style.display = 'inline-flex';
      modalGitBtn.href = data.gitUrl;
      modalGitBtn.textContent = data.gitText || 'View Repository ↗';
      if (data.gitUrl.includes('github.com')) {
        modalGitBtn.style.borderColor = 'rgba(255,255,255,0.3)';
        modalGitBtn.style.color = '#fff';
      } else {
        modalGitBtn.style.borderColor = '#e24329';
        modalGitBtn.style.color = '#fc6d26';
      }
    } else {
      modalGitBtn.style.display = 'none';
    }
  }

  projectModal.classList.add('active');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Bind all Details buttons
document.querySelectorAll('.view-details-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const key = btn.getAttribute('data-project') || btn.closest('.project-card')?.getAttribute('data-project');
    if (key) openProjectModal(key);
  });
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
    closeProjectModal();
  }
});

