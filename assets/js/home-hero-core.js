(() => {
  // Scroll progress + header blur
  const pg = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    pg.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    header.classList.toggle('is-scrolled', h.scrollTop > 40);
  };
  // CRO-Fix 2026-07-03 web-design-agent: Progress-Bar zeigte auf frischem Seitenaufruf
  // (scrollTop=0, kein User-Scroll) faelschlich ~17% Fuellstand. Ursache: die spaeter im
  // Body stehenden Sale-Bar-/Header-Offset-Skripte veraendern die Seitenhoehe NACH diesem
  // ersten onScroll()-Aufruf, was Chrome-Scroll-Anchoring einen Phantom-Scroll-Event ausloesen
  // liess, den der bereits aktive Listener sofort in eine falsche Breite umrechnete. Fix:
  // Listener + Initial-Sync erst binden, nachdem Sale-Bar/Header-Layout (Ende des Body,
  // synchron VOR 'load') fertig eingehaengt ist.
  const bindOnScroll = () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };
  if (document.readyState === 'complete') bindOnScroll();
  else window.addEventListener('load', bindOnScroll, { once: true });

  // Theme toggle (persist in localStorage)
  const themeBtn = document.getElementById('theme-btn');
  const saved = localStorage.getItem('mbcs-theme');
  if (saved) document.documentElement.dataset.theme = saved;
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = cur;
    localStorage.setItem('mbcs-theme', cur);
  });

  // Reveal on scroll (+ gestaffeltes Erscheinen der Karten innerhalb von Grids)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      // Kinder zeitversetzt einblenden (Stagger) — fühlt sich lebendig an
      const kids = el.children;
      if (kids.length > 1 && kids.length <= 24) {
        for (let i = 0; i < kids.length; i++) kids[i].style.setProperty('--mo-d', (i * 70) + 'ms');
      }
      el.classList.add('is-visible','visible');
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .sr').forEach(el => io.observe(el));

  // Stat counter
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = +el.dataset.count;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1800);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          // Gold flash when counter reaches target
          el.classList.add('stat-flash');
          setTimeout(() => el.classList.remove('stat-flash'), 520);
        }
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(c => cio.observe(c));

  // Scroll-linked compass: fades AND rotates as user scrolls past hero (feels alive)
  const compassBackdrop = document.getElementById('compass-backdrop');
  if (compassBackdrop && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    compassBackdrop.setAttribute('data-scroll','1');
    let scrollRaf = 0;
    const heroEl = document.getElementById('hero');
    const updateCompass = () => {
      const sc = window.scrollY;
      const heroH = heroEl ? heroEl.offsetHeight : 800;
      const t = Math.min(1, sc / heroH);
      const fade = 1 - t * 0.85;
      compassBackdrop.style.setProperty('--scroll-fade', fade.toFixed(3));
      // Kompass dreht beim Scrollen aktiv mit (bis 90°) — komponiert mit der Dauerrotation des Bildes
      compassBackdrop.style.setProperty('--scroll-rot', (t * 90).toFixed(2) + 'deg');
      scrollRaf = 0;
    };
    window.addEventListener('scroll', () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(updateCompass);
    }, { passive: true });
    updateCompass();
  }

  // Hero bars
  const bars = document.getElementById('hero-bars');
  if (bars) {
    const rows = 5, cols = 7;
    const frag = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const depth = ((r + c) % 3) + 1;
        const delay = ((r * cols + c) * 73) % 1400;
        const b = document.createElement('div');
        b.className = 'hbar hbar-d' + depth;
        b.style.gridRow = (r + 1);
        b.style.gridColumn = (c + 1);
        b.style.animationDelay = delay + 'ms';
        frag.appendChild(b);
      }
    }
    bars.appendChild(frag);
    let rafId = 0;
    window.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = bars.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width - .5) * 2;
        const my = ((e.clientY - r.top) / r.height - .5) * 2;
        [...bars.children].forEach((el, i) => {
          const d = (i % 3) + 1;
          el.style.transform = `translate3d(${mx * d * 8}px, ${my * d * 6}px, 0)`;
        });
        rafId = 0;
      });
    });
  }

  // Ticker
  const tickerData = [
    { s: 'XAU', l: 'Gold',       p: 2418.40, c:  0.62 },
    { s: 'XAG', l: 'Silver',     p:   31.28, c:  1.12 },
    { s: 'WTI', l: 'Crude',      p:   82.44, c:  0.18 },
    { s: 'NG',  l: 'Nat Gas',    p:    2.91, c: -0.82 },
    { s: 'UXC', l: 'Uranium',    p:   94.25, c:  1.54 },
    { s: 'CU',  l: 'Copper',     p:    4.38, c:  0.41 },
    { s: 'BDI', l: 'Baltic Dry', p: 1584.00, c: -0.33 },
    { s: 'HH',  l: 'Henry Hub',  p:    3.02, c:  0.94 },
  ];
  const ticker = document.getElementById('ticker');
  const renderTicker = () => {
    ticker.innerHTML = tickerData.map(r => `
      <div class="ticker-row">
        <span class="ticker-sym">${r.s}</span>
        <span class="ticker-label">${r.l}</span>
        <span class="ticker-price">${r.p.toFixed(2)}</span>
        <span class="ticker-change ${r.c >= 0 ? 'up' : 'down'}">${r.c >= 0 ? '▲' : '▼'} ${Math.abs(r.c).toFixed(2)}%</span>
      </div>
    `).join('');
  };
  if (ticker) {
    renderTicker();
    setInterval(() => {
      tickerData.forEach(r => {
        const drift = (Math.random() - 0.48) * 0.12;
        r.p = Math.max(0.01, r.p * (1 + drift / 100));
        r.c = r.c + drift;
      });
      renderTicker();
    }, 2200);
  }

  // Mobile hamburger
  const hb = document.getElementById('navHamburger');
  const mob = document.getElementById('navMobile');
  if (hb && mob) {
    hb.addEventListener('click', () => {
      mob.classList.toggle('open');
      hb.setAttribute('aria-expanded', mob.classList.contains('open'));
    });
  }

  // Dropdown (desktop hover works via CSS, click toggle for touch)
  document.querySelectorAll('.dropdown-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      b.parentElement.classList.toggle('open');
    });
  });
})();
