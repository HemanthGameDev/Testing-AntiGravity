/* ============================================================
   Auberge de La Belle Étoile — main.js v2
   Animations: loader, hero sequence, scroll reveal, 3D tilt,
   gallery mask, counters, carousel, cursor, parallax, tabs
   ============================================================ */
'use strict';

/* ---- REFS ---- */
const $  = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const loader     = $('#loader');
const loaderFill = $('#loaderFill');
const nav        = $('#nav');
const burger     = $('#burger');
const navMob     = $('#navMob');
const cursor     = $('#cursor');
const cursorRing = $('#cursorRing');
const btt        = $('#btt');
const carTrack   = $('#carTrack');
const carDots    = $('#carDots');
const heroPill   = $('#heroPill');
const hl1        = $('#hl1');
const hl2        = $('#hl2');
const heroSub    = $('#heroSub');
const heroActs   = $('#heroActs');
const heroStats  = $('#heroStats');
const statusBadge= $('#statusBadge');
const lb         = $('#lb');
const lbImg      = $('#lbImg');
const lbClose    = $('#lbClose');
const starField  = $('#starField');

/* ================================================================
   1. LOADER
================================================================ */
let prog = 0;
document.body.style.overflow = 'hidden';

const fillTimer = setInterval(() => {
  prog += Math.random() * 15 + 5;
  if (prog >= 100) { prog = 100; clearInterval(fillTimer); doneLoading(); }
  if (loaderFill) loaderFill.style.width = prog + '%';
}, 90);

function doneLoading() {
  setTimeout(() => {
    loader.classList.add('off');
    document.body.style.overflow = '';
    startHeroSequence();
    initObserver();
    initCounters();
    initGalleryMasks();
  }, 350);
}

/* ================================================================
   2. HERO ENTRANCE SEQUENCE
================================================================ */
function startHeroSequence() {
  // pill fade in
  setTimeout(() => {
    if (heroPill) { heroPill.style.opacity = '1'; heroPill.style.transform = 'translateY(0)'; }
  }, 100);

  // line 1
  setTimeout(() => { hl1 && hl1.classList.add('active'); }, 300);

  // line 2
  setTimeout(() => { hl2 && hl2.classList.add('active'); }, 550);

  // subtitle
  setTimeout(() => { heroSub && heroSub.classList.add('in'); }, 900);

  // buttons
  setTimeout(() => { heroActs && heroActs.classList.add('in'); }, 1150);

  // stats
  setTimeout(() => { heroStats && heroStats.classList.add('in'); }, 1380);
}

// Set initial states for hero elements
if (heroPill) { heroPill.style.opacity = '0'; heroPill.style.transform = 'translateY(12px)'; heroPill.style.transition = 'opacity .6s, transform .6s'; }

/* ================================================================
   3. STAR FIELD (Hero)
================================================================ */
if (starField) {
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation-duration:${Math.random()*4+2}s;
      animation-delay:${Math.random()*5}s;
    `;
    starField.appendChild(s);
  }
}

/* ================================================================
   4. CUSTOM CURSOR
================================================================ */
if (window.matchMedia('(pointer:fine)').matches && cursor && cursorRing) {
  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  const trackRing = () => {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  };
  requestAnimationFrame(trackRing);

  $$('a,button,.mcard,.g-item,.feat-item,.icard').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
}

/* ================================================================
   5. NAVBAR
================================================================ */
window.addEventListener('scroll', () => {
  nav.classList.toggle('on', window.scrollY > 50);
  btt.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

if (burger && navMob) {
  burger.addEventListener('click', () => {
    const open = navMob.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    navMob.setAttribute('aria-hidden', !open);
  });
  $$('a', navMob).forEach(a => a.addEventListener('click', () => {
    navMob.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    navMob.setAttribute('aria-hidden', 'true');
  }));
}

/* ================================================================
   6. SMOOTH SCROLL
================================================================ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 12;
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});

/* ================================================================
   7. SCROLL REVEAL (data-anim)
================================================================ */
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay) || (el.style.getPropertyValue('--d') ? parseFloat(el.style.getPropertyValue('--d')) * 1000 : 0);
      setTimeout(() => el.classList.add('in'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  $$('[data-anim]').forEach(el => obs.observe(el));

  // Line reveals
  const lineObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); lineObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  $$('.line-reveal').forEach(el => lineObs.observe(el));

  // Stat cards
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); statObs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  $$('.stat-card').forEach(el => statObs.observe(el));
}

/* ================================================================
   8. NUMBER COUNTERS
================================================================ */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const dur = 1800;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(2, -10 * p);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => obs.observe(el));
}

/* ================================================================
   9. GALLERY — MASK REVEAL + TILT + LIGHTBOX
================================================================ */
function initGalleryMasks() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay) || 0;
      setTimeout(() => e.target.classList.add('in'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$('.g-item').forEach(el => obs.observe(el));
}

// Lightbox
$$('.g-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
if (lbClose) lbClose.addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) closeLb(); });
document.addEventListener('keydown', e => e.key === 'Escape' && closeLb());

/* ================================================================
   10. 3D TILT — menu cards
================================================================ */
if (window.matchMedia('(pointer:fine)').matches) {
  $$('.mcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Magnetic buttons
  $$('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x*0.18}px,${y*0.18}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ================================================================
   11. HERO PARALLAX
================================================================ */
const heroBg = $('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${scrollY * 0.28}px)`;
  }, { passive: true });
}

/* ================================================================
   12. MENU TABS
================================================================ */
const tabBtns   = $$('.tab-btn');
const tabPanels = $$('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('on'); b.setAttribute('aria-selected','false'); });
    tabPanels.forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    btn.setAttribute('aria-selected','true');
    const panel = $('#p' + btn.dataset.tab);
    if (panel) {
      panel.classList.add('on');
      // stagger re-reveal for cards in new panel
      $$('.mcard', panel).forEach((c, i) => {
        c.classList.remove('in');
        setTimeout(() => c.classList.add('in'), i * 80);
      });
    }
  });
});

/* ================================================================
   13. REVIEWS CAROUSEL
================================================================ */
const cards = $$('.rcard');
let idx = 0;
let autoTimer;

const visible = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;

function buildDots() {
  if (!carDots) return;
  carDots.innerHTML = '';
  const pages = Math.ceil(cards.length / visible());
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('button');
    d.className = 'car-dot' + (i === 0 ? ' on' : '');
    d.setAttribute('role','tab');
    d.setAttribute('aria-label', `Page ${i+1}`);
    d.addEventListener('click', () => goTo(i));
    carDots.appendChild(d);
  }
}

function updateCar() {
  if (!carTrack || !cards[0]) return;
  const w = cards[0].getBoundingClientRect().width + 24;
  carTrack.style.transform = `translateX(-${idx * w}px)`;
  $$('.car-dot').forEach((d,i) => d.classList.toggle('on', i === idx));
}

function goTo(i) {
  const max = Math.max(0, cards.length - visible());
  idx = Math.max(0, Math.min(i, max));
  updateCar();
  resetAuto();
}

const startAuto = () => { autoTimer = setInterval(() => goTo(idx >= cards.length - visible() ? 0 : idx + 1), 5000); };
const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

$('#carPrev')?.addEventListener('click', () => goTo(idx - 1));
$('#carNext')?.addEventListener('click', () => goTo(idx + 1));

// Touch swipe
if (carTrack) {
  let tx = 0;
  carTrack.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  carTrack.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) goTo(idx + (diff > 0 ? 1 : -1));
  });
}

buildDots();
startAuto();
window.addEventListener('resize', () => { idx = 0; buildDots(); updateCar(); }, { passive: true });

/* ================================================================
   14. OPEN/CLOSED BADGE
================================================================ */
function checkOpen() {
  if (!statusBadge) return;
  const now  = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const day  = now.getDay();
  const t    = now.getHours() * 100 + now.getMinutes();
  const open = day >= 1 && day <= 6 && t >= 600 && t < 2200;
  statusBadge.className = 'status-badge ' + (open ? 'open-st' : 'closed-st');
  statusBadge.textContent = open ? 'Ouvert maintenant · Ferme à 22h00' : 'Actuellement fermé';
}
checkOpen();
setInterval(checkOpen, 60000);

/* ================================================================
   15. BACK TO TOP
================================================================ */
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ================================================================
   16. FEATURE ITEMS — stagger on hover
================================================================ */
$$('.feat-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.05}s`;
});

/* ================================================================
   17. INFO CARDS — entrance stagger
================================================================ */
const icardObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.icard').forEach((c, i) => setTimeout(() => c.classList.add('in'), i * 100));
    icardObs.disconnect();
  });
}, { threshold: 0.2 });
const icardContainer = $('.info-cards');
if (icardContainer) icardObs.observe(icardContainer);

// Give icards a data-anim so they participate in base reveal if needed
$$('.icard').forEach(c => {
  c.style.opacity    = '0';
  c.style.transform  = 'translateX(40px)';
  c.style.transition = 'opacity .6s var(--ease-out), transform .6s var(--ease-out)';
});

// Patch icard.in state (inline style override)
document.addEventListener('DOMContentLoaded', () => {});
// Simpler: extend observer to handle icards directly
const iObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const cards = $$('.icard');
    cards.forEach((c, i) => {
      setTimeout(() => {
        c.style.opacity   = '1';
        c.style.transform = 'translateX(0)';
      }, i * 110);
    });
    iObserver.disconnect();
  });
}, { threshold: 0.15 });
const iWrap = $('.info-cards');
if (iWrap) iObserver.observe(iWrap);
