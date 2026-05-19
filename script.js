/* ============================================
   ALEX CIPHER — CYBERSECURITY PORTFOLIO
   script.js — Modular & Clean v2
   ============================================ */

'use strict';

// ░░ PRELOADER ░░
const Preloader = (() => {
  const el = document.getElementById('preloader');
  const init = () => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
      setTimeout(() => {
        el.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1200);
    });
  };
  return { init };
})();

// ░░ THEME ░░
const Theme = (() => {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  let current = localStorage.getItem('theme') || 'dark';

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', theme);
    current = theme;
    if (window._bgThemeUpdate) window._bgThemeUpdate(theme);
  };

  const init = () => {
    apply(current);
    btn.addEventListener('click', () => apply(current === 'dark' ? 'light' : 'dark'));
  };
  return { init, getCurrent: () => current };
})();

// ░░ CANVAS PARTICLE BACKGROUND ░░
const BgCanvas = (() => {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let theme = 'dark';
  let W, H;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : (Math.random() < 0.5 ? -5 : H + 5);
      this.vx = (Math.random() - 0.5) * 0.30;
      this.vy = (Math.random() - 0.5) * 0.30;
      this.r = Math.random() * 1.0 + 0.3;
      this.alpha = Math.random() * 0.35 + 0.06;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      // Dark: terminal green; Light: tactical olive
      ctx.fillStyle = theme === 'dark'
        ? `rgba(79,142,255,${this.alpha})`
        : `rgba(29,78,216,${this.alpha * 0.5})`;
      ctx.fill();
    }
  }

  const COUNT = 85;
  const MAX_DIST = 120;

  const build = () => { particles = Array.from({ length: COUNT }, () => new Particle()); };

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = theme === 'dark'
            ? `rgba(79,142,255,${a})`
            : `rgba(29,78,216,${a * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  };

  let rafId;
  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    rafId = requestAnimationFrame(loop);
  };

  const init = () => {
    resize();
    build();
    loop();
    canvas.style.opacity = '0.5';
    window.addEventListener('resize', () => { resize(); build(); }, { passive: true });
    window._bgThemeUpdate = (t) => { theme = t; };
  };

  return { init };
})();

// ░░ CUSTOM CURSOR ░░
const Cursor = (() => {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  const init = () => {
    if (window.matchMedia('(hover: none)').matches) return;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    const animRing = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();

    const interactables = 'a, button, .project-card, .service-card, .cert-card, .skill-card, .tool-card, .contact-card, .stag, .interest-tag, .social-link';
    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
      el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
    });
  };
  return { init };
})();

// ░░ NAVBAR ░░
const Navbar = (() => {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  const setActive = () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  const init = () => {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
      setActive();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  };
  return { init };
})();

// ░░ TYPING EFFECT ░░
const Typing = (() => {
  const el = document.getElementById('typedText');
  const strings = [
    'Cyber Security Student',
    'Ethical Hacking Enthusiast',
    'Network Security Learner',
    'Penetration Tester',
    'Web Security Researcher',
    'Bug Bounty Hunter',
  ];
  let si = 0, ci = 0, deleting = false;
  const TYPE = 80, DELETE = 40, PAUSE = 1800;

  const tick = () => {
    const s = strings[si];
    if (!deleting) {
      el.textContent = s.slice(0, ++ci);
      if (ci === s.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = s.slice(0, --ci);
      if (ci === 0) { deleting = false; si = (si + 1) % strings.length; }
    }
    setTimeout(tick, deleting ? DELETE : TYPE);
  };

  const init = () => setTimeout(tick, 900);
  return { init };
})();

// ░░ SCROLL REVEAL ░░
const ScrollReveal = (() => {
  const init = () => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => observer.observe(el));
  };
  return { init };
})();

// ░░ COUNTER ANIMATION ░░
const Counters = (() => {
  const init = () => {
    const els = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          let n = 0;
          const step = Math.max(1, Math.ceil(target / 60));
          const interval = setInterval(() => {
            n = Math.min(n + step, target);
            el.textContent = n + '+';
            if (n >= target) clearInterval(interval);
          }, 20);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    els.forEach(el => observer.observe(el));
  };
  return { init };
})();

// ░░ BACK TO TOP ░░
const BackTop = (() => {
  const btn = document.getElementById('backTop');
  const init = () => {
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  return { init };
})();

// ░░ SMOOTH ANCHOR SCROLL ░░
const SmoothNav = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  };
  return { init };
})();

// ░░ CV DOWNLOAD ░░
const CVDownload = (() => {
  const init = () => {
    ['downloadCV', 'downloadCV2'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', e => {
        e.preventDefault();
        // Replace 'cv.pdf' with your actual CV file placed in the same folder
        const link = document.createElement('a');
        link.href = 'cv.pdf';
        link.download = 'Alex_Cipher_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  };
  return { init };
})();

// ░░ GLITCH ON HERO NAME ░░
const GlitchEffect = (() => {
  const init = () => {
    const el = document.querySelector('.hero-name');
    if (!el) return;
    el.classList.add('glitch-text');
    el.setAttribute('data-text', el.textContent);
  };
  return { init };
})();

// ░░ LAZY IMAGES ░░
const LazyImages = (() => {
  const init = () => {
    if ('loading' in HTMLImageElement.prototype) return;
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          io.unobserve(img);
        }
      });
    });
    imgs.forEach(img => io.observe(img));
  };
  return { init };
})();

// ░░ CONTACT CARD RIPPLE ░░
const ContactRipple = (() => {
  const init = () => {
    document.querySelectorAll('.contact-card').forEach(card => {
      card.addEventListener('click', function (e) {
        if (this.tagName === 'DIV') return; // skip non-links
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position:absolute;
          width:${size}px;height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top - size/2}px;
          border-radius:50%;
          background:rgba(0,212,255,0.12);
          transform:scale(0);
          animation:ripple 0.5s ease;
          pointer-events:none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Inject ripple keyframe
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
    document.head.appendChild(style);
  };
  return { init };
})();

// ░░ BOOT — Initialize All Modules ░░
document.addEventListener('DOMContentLoaded', () => {
  Preloader.init();
  Theme.init();
  BgCanvas.init();
  Cursor.init();
  Navbar.init();
  Typing.init();
  ScrollReveal.init();
  Counters.init();
  BackTop.init();
  SmoothNav.init();
  CVDownload.init();
  GlitchEffect.init();
  LazyImages.init();
  ContactRipple.init();

  // Dev console signature
  console.log('%c[ALEX_CIPHER] v2.0 — Portfolio Loaded', 'color:#00d4ff;font-family:monospace;font-size:14px;font-weight:bold;');
  console.log('%c> All systems operational. Stay curious, stay ethical.', 'color:#32ff7e;font-family:monospace;font-size:12px;');
});