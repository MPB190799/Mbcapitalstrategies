/**
 * MB Capital Strategies – Shared Navigation + Scroll Reveal + Reading Progress
 * + Cookie Consent (DSGVO/GDPR) + Author Bio Injection + Article Schema Injection
 *
 * v3 – Nav HTML injection: one source of truth for navigation across all 100+ pages
 */
(function () {
  'use strict';

  /* ── Non-blocking Font Loading ── */
  /* Guard: skip if page already has Outfit loaded or preloaded (blog pages do this inline).
     Prevents duplicate 4-family font bundle (was causing +2-4s LCP on blog pages). */
  var hasOutfit = document.querySelector('link[href*="Outfit"]') ||
                  document.querySelector('link[href*="outfit"]') ||
                  document.querySelector('link[rel="preload"][as="style"][href*="Outfit"]') ||
                  document.querySelector('link[rel="preload"][as="font"][href*="outfit"]');
  if (!hasOutfit) {
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    /* Slim bundle: only Outfit + IBM Plex Mono — DM Serif/Cormorant removed (unused on blog/landing pages, added ~800ms font-parse overhead). */
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(fontLink);
  }

  /* ── Premium Polish: subtle gold corner glow + mini compass watermark on every sub-page ── */
  if (!document.documentElement.hasAttribute('data-luxe-v3') && !document.getElementById('mbcs-premium-polish')) {
    var style = document.createElement('style');
    style.id = 'mbcs-premium-polish';
    style.textContent = ''
      + '.mbcs-corner-glow{position:fixed;pointer-events:none;z-index:1;opacity:.55;will-change:transform}'
      + '.mbcs-corner-glow.top-right{top:-160px;right:-160px;width:520px;height:520px;background:radial-gradient(circle,rgba(212,175,55,.18),rgba(212,175,55,0) 65%);filter:blur(8px)}'
      + '.mbcs-corner-glow.bottom-left{bottom:-200px;left:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,175,55,.12),rgba(212,175,55,0) 60%);filter:blur(10px);animation:mbcsAuroraDrift 22s ease-in-out infinite alternate}'
      + '@keyframes mbcsAuroraDrift{0%{transform:translate(0,0)}100%{transform:translate(80px,-60px)}}'
      + '.mbcs-mini-compass{position:fixed;right:24px;bottom:24px;width:64px;height:64px;z-index:2;opacity:.18;pointer-events:none;transition:opacity .4s ease}'
      + '.mbcs-mini-compass:hover{opacity:.42}'
      + '.mbcs-mini-compass svg{width:100%;height:100%;animation:mbcsCompassSpin 90s linear infinite}'
      + '@keyframes mbcsCompassSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'
      + '@media(max-width:640px){.mbcs-mini-compass{display:none}}'
      + '@media(prefers-reduced-motion:reduce){.mbcs-corner-glow,.mbcs-mini-compass svg{animation:none}}';
    document.head.appendChild(style);
    document.addEventListener('DOMContentLoaded', function(){
      var a = document.createElement('div'); a.className = 'mbcs-corner-glow top-right';
      var b = document.createElement('div'); b.className = 'mbcs-corner-glow bottom-left';
      document.body.appendChild(a); document.body.appendChild(b);

      /* Mini compass watermark — bottom right */
      var c = document.createElement('div'); c.className = 'mbcs-mini-compass'; c.setAttribute('aria-hidden','true');
      c.innerHTML = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
        + '<circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" stroke-width="1" opacity=".7"/>'
        + '<circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" stroke-width=".5" opacity=".4"/>'
        + '<polygon points="50,8 54,50 50,58 46,50" fill="#d4af37" opacity=".9"/>'
        + '<polygon points="92,50 50,46 42,50 50,54" fill="#d4af37" opacity=".55"/>'
        + '<polygon points="50,92 46,50 50,42 54,50" fill="#d4af37" opacity=".55"/>'
        + '<polygon points="8,50 50,46 58,50 50,54" fill="#d4af37" opacity=".55"/>'
        + '<circle cx="50" cy="50" r="3.5" fill="#d4af37"/>'
        + '</svg>';
      document.body.appendChild(c);
    });
  }

  /* ── Google Consent Mode v2 Defaults (MUST be set before GA4 loads) ── */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };

  var CONSENT_KEY = 'mbcs_consent_v1';
  var existingConsent = localStorage.getItem(CONSENT_KEY);

  window.gtag('consent', 'default', {
    'ad_storage':         existingConsent === 'granted' ? 'granted' : 'denied',
    'analytics_storage':  existingConsent === 'granted' ? 'granted' : 'denied',
    'ad_user_data':       existingConsent === 'granted' ? 'granted' : 'denied',
    'ad_personalization': existingConsent === 'granted' ? 'granted' : 'denied'
  });

  // ── Google Analytics 4 (loaded AFTER consent defaults are set) ──
  // Guard: skip if page already has a GTM/GA4 script tag (blog pages load it in <head>).
  // Prevents double GA4 initialisation and duplicate HTTP request on blog pages.
  if (!document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
    (function() {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-J1NWEPPKNE';
      document.head.appendChild(s);
      window.gtag('js', new Date());
      window.gtag('config', 'G-J1NWEPPKNE', { anonymize_ip: true });
    })();
  }

  /* ── Boot ── */
  /* Pages marked with data-luxe-v3="1" on <html> manage their own nav,
     background, reveals, dropdowns and scroll progress. We still want
     this script to handle cookie consent on those pages. */
  var LUXE_V3 = document.documentElement.getAttribute('data-luxe-v3') === '1';

  document.addEventListener('DOMContentLoaded', function () {
    if (!LUXE_V3) {
      injectBackgroundEffects(); /* gold waves + aurora orbs */
      injectNav();          /* must run first – creates nav DOM */
      setupHamburger();
      setupDropdowns();
      setupScrollReveal();
      setupReadingProgress();
      setupActiveNav();
    }
    setupAuthorBio();
    injectArticleSchema();
    // CMP-Stacking-Guard v3 (web-design-agent 2026-06-14 fix):
    // Wenn AdSense auf der Seite ist, ist Google Funding Choices DER CMP — eigener Banner VERBOTEN.
    // Problem v2: Selbst wenn googlefc erkannt wurde, erschien eigener Banner NACH CMP (sequentieller Stack).
    // Fix v3: Wenn adsbygoogle-Tag auf Seite vorhanden → eigenen Banner komplett unterdrücken.
    //         Google's CMP übernimmt Consent vollständig. Nur auf reinen GA4-Seiten (kein AdSense)
    //         eigenen leichten Banner zeigen.
    if (!existingConsent) {
      // AdSense-Erkennung: deterministisch, nicht timing-abhängig
      var hasAdSense = (typeof window.adsbygoogle !== 'undefined') ||
                       document.querySelector('ins.adsbygoogle') !== null ||
                       document.querySelector('script[src*="adsbygoogle.js"]') !== null;

      if (hasAdSense) {
        // AdSense vorhanden → Google Funding Choices übernimmt. Eigener Banner suppressed.
        // GA4 consent mode defaults greifen via gtag('consent','default') im <head>.
      } else {
        // Kein AdSense → eigenen leichten Banner nach kurzer Wartezeit zeigen
        var cmpCheckAttempts = 0;
        var cmpMaxAttempts = 15; // 15 × 100ms = 1.5s auf reinen GA4-Seiten
        function checkCmpAndMaybeShowBanner() {
          cmpCheckAttempts++;
          if (typeof window.__tcfapi === 'function') {
            window.__tcfapi('addEventListener', 2, function(tcData, success) {
              if (success && (tcData.eventStatus === 'useractioncomplete' ||
                              tcData.eventStatus === 'tcloaded')) {
                if (!localStorage.getItem(CONSENT_KEY)) setupCookieBanner();
              }
            });
            return;
          }
          if (cmpCheckAttempts < cmpMaxAttempts) {
            setTimeout(checkCmpAndMaybeShowBanner, 100);
            return;
          }
          if (!localStorage.getItem(CONSENT_KEY)) setupCookieBanner();
        }
        setTimeout(checkCmpAndMaybeShowBanner, 300);
      }
    }
  });

  /* ═══════════════════════════════════════════════════════════
     BACKGROUND EFFECTS — Gold Wave Lines + Aurora Orbs
     Injected on every page for consistent premium look.
  ═══════════════════════════════════════════════════════════ */
  function injectBackgroundEffects() {
    /* Skip if already present (e.g. homepage has them inline) */
    if (document.querySelector('.bg-lines') || document.querySelector('.bg-wave')) return;

    /* Aurora Orbs */
    var orbs = document.createElement('div');
    orbs.className = 'bg-lines';
    orbs.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span>';
    document.body.insertBefore(orbs, document.body.firstChild);

    /* Gold Wave SVG Lines */
    var wave = document.createElement('div');
    wave.className = 'bg-wave';
    wave.innerHTML =
      '<svg viewBox="0 0 2400 1200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0,600 C200,300 400,900 600,600 C800,300 1000,900 1200,600 C1400,300 1600,900 1800,600 C2000,300 2200,900 2400,600" fill="none" stroke="url(#wg1)" stroke-width="1.5" opacity=".7"/>' +
        '<path d="M0,500 C200,250 400,750 600,500 C800,250 1000,750 1200,500 C1400,250 1600,750 1800,500 C2000,250 2200,750 2400,500" fill="none" stroke="url(#wg1)" stroke-width="1" opacity=".3"/>' +
        '<defs><linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#d4af37" stop-opacity="0"/><stop offset="30%" stop-color="#d4af37" stop-opacity=".6"/><stop offset="50%" stop-color="#f0d060" stop-opacity="1"/><stop offset="70%" stop-color="#d4af37" stop-opacity=".6"/><stop offset="100%" stop-color="#d4af37" stop-opacity="0"/></linearGradient></defs>' +
      '</svg>' +
      '<svg viewBox="0 0 2400 1200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0,700 C250,400 500,1000 750,700 C1000,400 1250,1000 1500,700 C1750,400 2000,1000 2250,700 C2400,550 2400,700 2400,700" fill="none" stroke="url(#wg2)" stroke-width="1.2" opacity=".6"/>' +
        '<defs><linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e8c95a" stop-opacity="0"/><stop offset="40%" stop-color="#d4af37" stop-opacity=".8"/><stop offset="60%" stop-color="#f0d060" stop-opacity=".8"/><stop offset="100%" stop-color="#d4af37" stop-opacity="0"/></linearGradient></defs>' +
      '</svg>';
    document.body.insertBefore(wave, document.body.firstChild);
  }

  /* ═══════════════════════════════════════════════════════════
     NAV INJECTION
     Replaces the nav element on every page with the canonical
     navigation HTML from the homepage (gold standard).
     One change here = consistent nav on all 100+ pages.
  ═══════════════════════════════════════════════════════════ */
  function injectNav() {
    var existing = document.querySelector('nav.nav, header.nav');
    if (!existing) return;

    var html =
      '<nav class="nav" id="main-nav">' +
        '<div class="nav-inner">' +
          '<a href="/" class="nav-brand">' +
            '<picture><source srcset="/Logo.webp" type="image/webp"><img src="/Logo.png" alt="MB Capital Strategies" width="44" height="44" loading="eager"></picture>' +
            '<span>MB Capital Strategies</span>' +
          '</a>' +
          '<div class="nav-links">' +
            '<a href="/">Startseite</a>' +
            '<a href="/depot-strategie/">Depot</a>' +
            '<a href="/hard-asset-guide/">Hard Asset Guide</a>' +
            '<div class="dropdown">' +
              '<button class="dropdown-btn" aria-haspopup="true">Themen &#x25be;</button>' +
              '<div class="dropdown-content">' +
                '<a href="/shipping-aktien/">🚢 Shipping Aktien</a>' +
                '<a href="/midstream/">🛢️ Pipelines / Midstream</a>' +
                '<a href="/mining-aktien/">⛏️ Mining Aktien</a>' +
                '<a href="/upstream-aktien/">🛢️ Upstream Aktien</a>' +
                '<a href="/wasser/">🌊 Wasser</a>' +
                '<a href="/reits/">🏢 REITs</a>' +
                '<a href="/pharma/">💊 Pharma</a>' +
                '<a href="/defensiv/">🛡️ Defensiv</a>' +
                '<a href="/dividendenstrategie/">💰 Dividendenstrategie</a>' +
                '<hr>' +
                '<a href="/kategorien/high-yield-aktien.html">🏦 High-Yield &amp; BDC</a>' +
                '<a href="/rohstoff-superzyklus-master.html">🌋 Rohstoff Superzyklus</a>' +
                '<hr>' +
                '<a href="/bestenlisten/beste-lng-aktien-2026.html">🔥 Beste LNG-Aktien 2026</a>' +
                '<a href="/bestenlisten/beste-tanker-aktien-2026.html">🚢 Beste Tanker-Aktien 2026</a>' +
                '<a href="/bestenlisten/top-5-high-yield-aktien-2026.html">💸 Top 5 High-Yield 2026</a>' +
              '</div>' +
            '</div>' +
            '<div class="dropdown">' +
              '<button class="dropdown-btn" aria-haspopup="true">Podcast &#x25be;</button>' +
              '<div class="dropdown-content">' +
                '<a href="/podcast/">🎧 Alle Podcasts</a>' +
                '<hr>' +
                '<a href="/podcast/der-finanzfeuer-talk.html">🔥 Finanzfeuer Talk</a>' +
                '<a href="/podcast/mein-weg-zur-dividendenstrategie-2025.html">💰 Dividenden-Journey</a>' +
                '<a href="/podcast/timing-ist-alles-dividendenstrategie-podcast-2025.html">⏱️ Timing &amp; Zyklen</a>' +
                '<hr>' +
                '<a href="/podcast/maritime-investments-schifffahrtsaktien-2025.html">🚢 Maritime / Shipping</a>' +
                '<a href="/podcast/bdc-aktien-erklaert-2025.html">🏦 BDC Aktien</a>' +
                '<a href="/podcast/mining-serie-high-dividend-ressourcen-2025-2028.html">⛏️ Mining Serie</a>' +
              '</div>' +
            '</div>' +
            '<a href="/blog/">Blog</a>' +
            '<a href="/investing-analysen.html">Investing.com</a>' +
            '<a href="/rechner/" class="nav-highlight">Rechner</a>' +
            '<div class="dropdown">' +
              '<button class="dropdown-btn" aria-haspopup="true">Newsletter &#x25be;</button>' +
              '<div class="dropdown-content">' +
                '<a href="/insider/">📬 Kostenloser Wochen-Insider</a>' +
                '<a href="/newsletter/" style="color:#d4af37;font-weight:500;">✦ Premium Earnings · 5 €</a>' +
              '</div>' +
            '</div>' +
            '<a href="/newsletter/" class="nav-highlight" style="border-color:#d4af37;color:#d4af37;">Premium 5€ ✦</a>' +
            '<a href="https://mbcapitalstrategiesgloabal.com/" target="_blank" rel="noopener" class="nav-highlight" style="border-color:rgba(255,255,255,0.25);color:#f5f6fa;">🌐 English</a>' +
          '</div>' +
          '<button class="nav-hamburger" id="navHamburger" aria-label="Menü öffnen" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
        '<nav class="nav-mobile" id="navMobile" aria-label="Mobile Navigation">' +
          '<div class="mob-label">Navigation</div>' +
          '<a href="/">🏠 Startseite</a>' +
          '<a href="/depot-strategie/">📊 Depot-Strategie</a>' +
          '<a href="/hard-asset-guide/">🧱 Hard Asset Guide</a>' +
          '<a href="/blog/">📰 Blog</a>' +
          '<a href="/rechner/">🧮 Alle Rechner</a>' +
          '<a href="/investing-analysen.html">🔗 Investing.com</a>' +
          '<a href="/toolbox.html">🧰 Toolbox</a>' +
          '<a href="/glossar/">📗 Glossar</a>' +
          '<div class="mob-label">Newsletter</div>' +
          '<a href="/insider/">📬 Kostenloser Wochen-Insider</a>' +
          '<a href="/newsletter/" style="color:#d4af37;font-weight:500;">✦ Premium Earnings · 5 €</a>' +
          '<div class="mob-label">Themen</div>' +
          '<a href="/shipping-aktien/">🚢 Shipping Aktien</a>' +
          '<a href="/midstream/">🛢️ Midstream / Pipelines</a>' +
          '<a href="/mining-aktien/">⛏️ Mining Aktien</a>' +
          '<a href="/upstream-aktien/">🛢️ Upstream Aktien</a>' +
          '<a href="/wasser/">🌊 Wasser</a>' +
          '<a href="/reits/">🏢 REITs</a>' +
          '<a href="/pharma/">💊 Pharma</a>' +
          '<a href="/defensiv/">🛡️ Defensiv</a>' +
          '<a href="/dividendenstrategie/">💰 Dividendenstrategie</a>' +
          '<a href="/kategorien/high-yield-aktien.html">🏦 High-Yield &amp; BDC</a>' +
          '<a href="/rohstoff-superzyklus-master.html">🌋 Rohstoff Superzyklus</a>' +
          '<div class="mob-label">Podcast</div>' +
          '<a href="/podcast/">🎧 Alle Podcasts</a>' +
          '<a href="/podcast/der-finanzfeuer-talk.html">🔥 Finanzfeuer Talk</a>' +
          '<a href="/podcast/mining-serie-high-dividend-ressourcen-2025-2028.html">⛏️ Mining Serie</a>' +
          '<div class="mob-label">International</div>' +
          '<a href="https://mbcapitalstrategiesgloabal.com/" target="_blank" rel="noopener">🌐 English Website</a>' +
        '</nav>' +
      '</nav>';

    /* Replace the existing nav element (works for both <nav> and <header>) */
    existing.outerHTML = html;
  }

  /* ── Hamburger / Mobile Nav ── */
  function setupHamburger() {
    var hamburger = document.getElementById('navHamburger');
    var mobileNav  = document.getElementById('navMobile');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Dropdowns ── */
  function setupDropdowns() {
    var dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function (dropdown) {
      var btn = dropdown.querySelector('.dropdown-btn');
      if (!btn) return;

      btn.addEventListener('click', function (e) {
        if (window.innerWidth < 700) {
          e.stopPropagation();
          dropdown.classList.toggle('open');
        }
      });
    });

    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (d) {
        if (!d.contains(e.target)) d.classList.remove('open');
      });
    });
  }

  /* ── Scroll Reveal ── */
  function setupScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ── Reading Progress Bar ── */
  function setupReadingProgress() {
    var isArticle = document.querySelector('.article-body, article, .article-hero');
    if (!isArticle) return;

    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.id = 'readingProgress';
    document.body.insertBefore(bar, document.body.firstChild);

    function updateProgress() {
      var scrollTop  = window.scrollY || document.documentElement.scrollTop;
      var docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct        = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── Mark current nav link as active ── */
  function setupActiveNav() {
    var path  = window.location.pathname;
    var links = document.querySelectorAll('.nav-links a, .nav-mobile a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if ((path === href) || (href.length > 1 && path.startsWith(href) && href !== '/')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     AUTHOR BIO INJECTION
     Automatically injects a visible author bio on all blog
     article pages. Skips index and tool-listing pages.
  ═══════════════════════════════════════════════════════════ */
  function setupAuthorBio() {
    var path = window.location.pathname;

    var isBlogArticle = (
      path.startsWith('/blog/') &&
      path !== '/blog/' &&
      !path.endsWith('index.html') &&
      !path.endsWith('alle-finanzrechner.html')
    );
    if (!isBlogArticle) return;
    if (document.querySelector('.author-bio-inject')) return;

    /* CRO 2026-07-05 web-design-agent: prefer inserting right after the
       article's own <h1> instead of the breadcrumb. Previously the bio
       card landed directly after the breadcrumb nav — i.e. BEFORE the
       headline — pushing the actual article title (and LCP element)
       below a 62px-photo + 5-link trust card on mobile. Confirmed live
       via Playwright (rio-tinto-analyse-2026.html, 390x844): H1 was not
       visible without scrolling. Byline-after-title is the standard,
       expected reading order (title -> author -> body) and keeps the
       headline the first above-the-fold content again. No CLS change
       (element count/size identical, only insertion point moves). */
    var anchor = (
      document.querySelector('.container h1') ||
      document.querySelector('h1') ||
      document.querySelector('nav.breadcrumb') ||
      document.querySelector('nav.breadcrumbs') ||
      document.querySelector('.breadcrumb') ||
      document.querySelector('.breadcrumbs') ||
      document.querySelector('section.container') ||
      document.querySelector('.page-wrapper') ||
      null
    );

    /* Fallback: insert after the main nav */
    if (!anchor) {
      anchor = document.querySelector('#main-nav, nav.nav');
    }
    if (!anchor) return;

    var bio = document.createElement('div');
    bio.className = 'author-box author-bio-inject';
    bio.innerHTML =
      '<a href="/ueber-marco-bozem/" style="flex-shrink:0;">' +
        '<img src="/marco.jpg" alt="Marco Bozem – MB Capital Strategies"' +
          ' width="62" height="62" loading="lazy">' +
      '</a>' +
      '<div class="author-info">' +
        '<h4><a href="/ueber-marco-bozem/" style="color:inherit;text-decoration:none;">' +
          'Marco Bozem</a></h4>' +
        '<p>' +
          'Unabhängiger Investor &amp; Gründer von MB Capital Strategies. ' +
          'Fokus auf Hard Assets: Energie, Shipping, Mining &amp; Midstream-Pipelines. ' +
          '<a href="/ueber-marco-bozem/" style="color:#d4af37;">Über Marco →</a>' +
          '&nbsp;·&nbsp;' +
          '<a href="https://www.youtube.com/@mbcapitalstrategies"' +
            ' target="_blank" rel="noopener" style="color:#d4af37;">YouTube DE</a>' +
          '&nbsp;·&nbsp;' +
          '<a href="https://www.youtube.com/@MBCapitalStrategiesGlobal"' +
            ' target="_blank" rel="noopener" style="color:#d4af37;">YouTube Global</a>' +
          '&nbsp;·&nbsp;' +
          '<a href="https://www.linkedin.com/in/marco-bozem-182173295"' +
            ' target="_blank" rel="noopener" style="color:#d4af37;">LinkedIn</a>' +
          '&nbsp;·&nbsp;' +
          '<a href="https://www.linkedin.com/company/mb-capital-strategies/"' +
            ' target="_blank" rel="noopener" style="color:#d4af37;">Unternehmen</a>' +
        '</p>' +
      '</div>';

    anchor.insertAdjacentElement('afterend', bio);
  }

  /* ═══════════════════════════════════════════════════════════
     ARTICLE SCHEMA INJECTION
     Automatically adds BlogPosting JSON-LD to blog articles
     that don't already have an Article/BlogPosting schema.
     This fixes YMYL / E-E-A-T anonymity for legacy articles.
  ═══════════════════════════════════════════════════════════ */
  function injectArticleSchema() {
    var path = window.location.pathname;

    var isBlogArticle = (
      path.startsWith('/blog/') &&
      path !== '/blog/' &&
      !path.endsWith('index.html') &&
      !path.endsWith('alle-finanzrechner.html') &&
      !path.endsWith('meine-toolbox-broker-tools-plattformen-2025.html') &&
      !path.endsWith('wise-airalo-vietnam-erfahrungen.html')
    );
    if (!isBlogArticle) return;

    /* Check if Article/BlogPosting schema already exists */
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        var data = JSON.parse(scripts[i].textContent || scripts[i].innerText);
        if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting') return;
        if (data['@graph']) {
          for (var j = 0; j < data['@graph'].length; j++) {
            var t = data['@graph'][j]['@type'];
            if (t === 'Article' || t === 'BlogPosting') return;
          }
        }
      } catch (e) { /* skip malformed JSON */ }
    }

    /* Extract headline from h1 or title */
    var h1El = document.querySelector('h1');
    var headline = h1El ? h1El.textContent.trim().replace(/^[^\w]+/, '') : document.title;

    /* Extract description from meta description */
    var descMeta = document.querySelector('meta[name="description"]');
    var description = descMeta ? descMeta.getAttribute('content') : '';

    /* Extract date from URL (year pattern) or og:updated_time */
    var datePublished = extractDateFromPage();

    /* Extract canonical URL */
    var canonicalEl = document.querySelector('link[rel="canonical"]');
    var url = canonicalEl ? canonicalEl.getAttribute('href') : window.location.href;

    /* Extract image from og:image */
    var imgMeta = document.querySelector('meta[property="og:image"]');
    var image = imgMeta ? imgMeta.getAttribute('content') : 'https://mbcapitalstrategies.com/marco.jpg';

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': headline.substring(0, 110),
      'description': description,
      'url': url,
      'image': image,
      'datePublished': datePublished,
      'dateModified': datePublished,
      'author': {
        '@type': 'Person',
        'name': 'Marco Bozem',
        'url': 'https://mbcapitalstrategies.com/ueber-marco-bozem/',
        'sameAs': [
          'https://www.youtube.com/@mbcapitalstrategies',
          'https://www.youtube.com/@MBCapitalStrategiesGlobal',
          'https://www.linkedin.com/in/marco-bozem-182173295',
          'https://www.linkedin.com/company/mb-capital-strategies/'
        ]
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'MB Capital Strategies',
        'url': 'https://mbcapitalstrategies.com/',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://mbcapitalstrategies.com/Logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': url
      }
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function extractDateFromPage() {
    /* 1. Try article:published_time meta */
    var pt = document.querySelector('meta[property="article:published_time"]');
    if (pt) return pt.getAttribute('content');

    /* 2. Try datePublished in existing ld+json */
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        var d = JSON.parse(scripts[i].textContent || scripts[i].innerText);
        if (d.datePublished) return d.datePublished;
      } catch (e) {}
    }

    /* 3. Extract from URL: analyse-2026, februar-2026, etc. */
    var path = window.location.pathname;
    var m2026 = path.match(/\b2026\b/);
    var m2025 = path.match(/\b2025\b/);

    if (m2026) {
      /* Month hints in URL */
      if (/januar/.test(path))   return '2026-01-15';
      if (/februar/.test(path))  return '2026-02-15';
      if (/maerz/.test(path))    return '2026-03-15';
      return '2026-01-01';
    }
    if (m2025) return '2025-06-01';

    return '2025-01-01';
  }

  /* ── Cookie Consent Banner (DSGVO) ──────────────────────────
     Shows bottom-sticky banner on first visit.
     Uses Google Consent Mode v2.
  ─────────────────────────────────────────────────────────── */
  function setupCookieBanner() {
    var style = document.createElement('style');
    style.textContent =
      '#cookie-banner{' +
        'position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
        'background:rgba(5,5,8,0.97);' +
        'border-top:1px solid rgba(212,175,55,0.35);' +
        'padding:16px 20px;' +
        'font-family:"Outfit",system-ui,sans-serif;' +
        'font-size:0.85rem;color:#ccc;' +
        'backdrop-filter:blur(12px);' +
      '}' +
      '#cookie-banner-inner{' +
        'max-width:1100px;margin:0 auto;' +
        'display:flex;flex-wrap:wrap;align-items:center;gap:14px;' +
      '}' +
      '#cookie-banner-inner p{margin:0;flex:1;min-width:200px;line-height:1.6;}' +
      '#cookie-banner-inner a{color:#d4af37;}' +
      '#cookie-buttons{display:flex;gap:10px;flex-shrink:0;}' +
      '.cookie-btn{' +
        'padding:9px 18px;border:none;border-radius:8px;' +
        'font-weight:700;font-size:0.83rem;cursor:pointer;' +
        'font-family:inherit;' +
      '}' +
      '.cookie-btn-primary{background:#d4af37;color:#000;}' +
      '.cookie-btn-primary:hover{filter:brightness(1.1);}' +
      '.cookie-btn-secondary{' +
        'background:transparent;color:#9aa6c0;' +
        'border:1px solid rgba(212,175,55,0.25);' +
      '}' +
      '.cookie-btn-secondary:hover{color:#d4af37;border-color:#d4af37;}';

    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML =
      '<div id="cookie-banner-inner">' +
        '<p>' +
          'Diese Website verwendet Cookies für Werbeanzeigen (Google AdSense), ' +
          'eingebettete YouTube-Videos und Affiliate-Links. ' +
          'Mehr dazu in der <a href="/datenschutz.html">Datenschutzerklärung</a>.' +
        '</p>' +
        '<div id="cookie-buttons">' +
          '<button id="cookie-accept" class="cookie-btn cookie-btn-primary">Alle akzeptieren</button>' +
          '<button id="cookie-decline" class="cookie-btn cookie-btn-secondary">Nur notwendige</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'granted');
      window.gtag('consent', 'update', {
        'ad_storage':         'granted',
        'analytics_storage':  'granted',
        'ad_user_data':       'granted',
        'ad_personalization': 'granted'
      });
      banner.remove();
    });

    document.getElementById('cookie-decline').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'denied');
      banner.remove();
    });
  }

  // ── Conversion Tracking: Newsletter-Anmeldung ──
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && form.getAttribute('data-type') === 'subscription') {
      if (window.gtag) {
        window.gtag('event', 'newsletter_signup', {
          'event_category': 'conversion',
          'event_label': window.location.pathname
        });
      }
    }
  });

  // ── Conversion Tracking: Affiliate-Link-Klicks ──
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[rel*="sponsored"]');
    if (el && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        'event_category': 'monetization',
        'event_label': el.hostname || el.href,
        'page': window.location.pathname
      });
    }
  });

}());
