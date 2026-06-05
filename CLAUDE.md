# CLAUDE.md — MB Capital Strategies

## Project Overview

**MB Capital Strategies** (`mbcapitalstrategies.com`) is a German-language static website focused on dividend investing in hard assets (energy, shipping, mining, pipelines). It is authored by Marco Bozem and hosted on **GitHub Pages** with a custom domain via `CNAME`.

This is **not** a JavaScript/Node.js application — it is a **static HTML site** with ~149 hand-authored HTML pages, inline CSS/JS, and a handful of utility scripts for batch operations.

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | GitHub Pages (custom domain: `mbcapitalstrategies.com`) |
| Language | Static HTML, inline CSS, vanilla JavaScript |
| Font | Montserrat (Google Fonts, weights 400–800) |
| Monetization | Google AdSense (`ca-pub-7097302643579933`) |
| Analytics | Google Consent Mode v2 (DSGVO/GDPR compliant) |
| Structured Data | JSON-LD (Schema.org: FAQPage, BreadcrumbList, BlogPosting, WebApplication, Organization, WebSite) |
| Build Scripts | Python 3 (batch HTML transformations), Node.js/ESM (sitemap generation) |

**There is no build step, bundler, or framework.** Pages are served as-is from the repository root.

## Repository Structure

```
/                           # Root = GitHub Pages document root
├── index.html              # Homepage (~1654 lines, self-contained with inline <style>)
├── CNAME                   # Custom domain: mbcapitalstrategies.com
├── robots.txt              # Crawl directives + sitemap references
├── ads.txt                 # AdSense publisher verification (pub-7097302643579933)
├── site.webmanifest        # PWA manifest (icons, theme #0f1115)
│
├── blog/                   # 65 article pages + 9 redirect stubs + index (stock analyses, market news, guides)
│   ├── index.html          # Blog listing page with 7-category filter (Mining, Upstream, Shipping, Midstream, Dividenden, Rechner, BDC)
│   ├── styles.css          # Shared stylesheet for blog + most content pages (1332 lines, 20 CSS custom properties)
│   └── styles.min.css      # Minified version of styles.css for production
│
├── tools/                  # Interactive financial calculators (8 tools)
│   ├── dividendenrechner.html
│   ├── yield-on-cost-rechner.html
│   ├── dividenden-snowball-rechner.html
│   ├── dividend-snowball-yoc-pro.html
│   ├── dividenden-reinvest-rechner.html
│   ├── dividenden-wachstumsrechner.html
│   ├── finanzielle-freiheit-rechner.html
│   └── shipping-cashflow-rechner.html
│
├── rechner/                # Calculator index page
│   └── index.html
│
├── podcast/                # Podcast pages (7 episodes + index)
│   ├── index.html
│   ├── styles.css          # Podcast-specific styles (121 lines, shares design tokens)
│   ├── der-finanzfeuer-talk.html
│   ├── mein-weg-zur-dividendenstrategie-2025.html
│   ├── timing-ist-alles-dividendenstrategie-podcast-2025.html
│   ├── maritime-investments-schifffahrtsaktien-2025.html
│   ├── bdc-aktien-erklaert-2025.html
│   ├── mining-serie-high-dividend-ressourcen-2025-2028.html
│   └── pipeline-aktien-analyse-2025.html
│
├── glossar/                # Financial glossary system (196 terms → 152 unique anchors)
│   ├── index.html          # Glossary page with search/filter + dynamic SEO via ?begriff= param
│   ├── terms.json          # Term→slug mapping (used for auto-linking)
│   ├── glossar.js          # Glossary page logic (search, filter, Schema.org, URL params)
│   ├── autolink-glossar.js # Client-side glossary term auto-linker
│   ├── shipping-cluster.html  # Shipping terminology hub
│   ├── aisc-mining.html    # Mining cost definitions (AISC)
│   ├── tce-rate.html       # Shipping TCE rate glossary
│   └── *.html              # 23 specialized glossary pages (baltic-dry-index, bdc, capex, cashflow-cover, dayrate, debt-ebitda, dividend-cut, dividend-yield, ebitda, free-cashflow, hard-assets, midstream, mlp, payout-ratio, special-dividend, superzyklus, time-charter, upstream, yield-on-cost, etc.)
│
├── assets/
│   └── js/
│       ├── nav.js          # Shared nav injection + cookie consent + scroll effects + article schema (v3, 525 lines)
│       ├── nav.min.js      # Minified version of nav.js for production
│       └── glossar-linking.js  # Auto-links glossary terms in article content
│
├── shipping/               # Shipping sector hub (index.html)
├── shipping-aktien/        # Shipping stocks index (index.html)
├── midstream/              # Pipeline/midstream sector hub (index.html)
├── mining-aktien/          # Mining stocks index (index.html, lists 22 analyses)
├── upstream-aktien/        # Upstream oil & gas stocks index (index.html, lists 12 analyses)
├── rohstoffe/              # Commodity deep-dives
│   ├── kupfer-superzyklus.html
│   ├── nickel-superzyklus.html
│   ├── uran-superzyklus.html
│   └── zink-superzyklus.html
├── kategorien/             # Category pages
│   ├── high-yield-aktien.html
│   ├── mining-aktien.html
│   └── rohstoff-superzyklus-2025-2030.html
├── bestenlisten/           # "Best of" annual lists — 2026 pages + 2025 redirect stubs
│   ├── beste-lng-aktien-2026.html
│   ├── beste-tanker-aktien-2026.html
│   ├── top-5-high-yield-aktien-2026.html
│   ├── beste-lng-aktien-2025.html          # redirect stub → 2026
│   ├── beste-tanker-aktien-2025.html       # redirect stub → 2026
│   └── top-5-high-yield-aktien-2025.html   # redirect stub → 2026
├── dividendenstrategie/    # Dividend strategy guide
│   ├── index.html          # Main dividend strategy page
│   ├── abgeltungssteuer.html  # Capital gains tax guide (Abgeltungssteuer)
│   └── bdc-aktien/         # BDC stocks sub-section
│       └── index.html
├── depot-strategie/        # Portfolio strategy with embedded Parqet widgets (index.html)
├── hard-asset-guide/       # Hard asset investing guide (index.html)
├── ueber-marco-bozem/      # About the author (index.html)
│
├── sitemap.xml             # Master sitemap index (8 sub-sitemaps)
├── sitemap-main.xml        # Core pages sitemap (18 URLs)
├── sitemap-blog.xml        # Blog articles sitemap (65 URLs)
├── sitemap-tools.xml       # Calculator tools sitemap (9 URLs)
├── sitemap-video.xml       # Video sitemap (20 YouTube embeds)
├── sitemap-kategorien.xml  # Category pages (10 URLs)
├── sitemap-bestenlisten.xml # Best-of lists (3 URLs)
├── sitemap-investing.xml   # Investing.com hub (1 URL)
├── sitemap-travel.xml      # Travel content (1 URL, listed in robots.txt but not in sitemap index)
├── glossar-sitemap.xml     # Auto-generated glossary sitemap (23 URLs)
│
├── 404.html                # Custom 404 error page (GitHub Pages)
├── datenschutz.html        # Privacy policy (DSGVO)
├── impressum.html          # Legal notice (German law requirement)
├── toolbox.html            # Recommended brokers & tools (with affiliate links)
├── blogindex.html          # Alternative blog listing
├── investing-analysen.html # Investing.com analyses hub
├── rohstoff-superzyklus-master.html  # Commodity supercycle master page
├── googleecd17b151bd5b1c1.html      # Google Search Console verification
│
├── add_nav.py              # Adds canonical nav to pages missing it (10 target pages)
├── fix_nav.py              # Standardizes nav dropdowns across ALL HTML pages
├── add_faq_schema.py       # Injects FAQPage JSON-LD into 10 mining/upstream articles
├── add_faq_to_blog.py      # Adds FAQPage JSON-LD schema to blog articles missing one (context-aware Q&As)
├── add_breadcrumb_to_blog.py # Adds BreadcrumbList JSON-LD schema to blog articles missing one
├── add_glossar_blog_links.py # Adds relevant blog article links to glossary pages' related sections
├── inject_author_sources.py  # Injects author bio box into blog articles
├── rename_mining_2026.py   # Renames articles from -2025 to -2026 with redirect stubs
├── .claude/scripts/validate-site.py  # Site validation (used by Daily-Optimize, not deployed)
├── build-glossar-sitemap.mjs  # Node.js ESM script to generate glossar-sitemap.xml
│
├── Logo.png                # Brand logo (used in nav, schema, everywhere)
├── marco.jpg               # Author photo (used in author bio injection)
├── background.jpg          # Homepage background image
├── BannermitMarco.jpg      # Author banner image
├── favicon.ico             # Standard favicon
├── favicon-16x16.png       # 16px favicon
├── favicon-32x32.png       # 32px favicon
├── apple-touch-icon.png    # Apple touch icon (180px)
├── android-chrome-*.png    # Android PWA icons (192px, 512px)
└── *.jpg, *.jpeg           # Infographic charts (commodity demand, supply gaps, etc.)
```

## Blog Content Inventory

The 65 blog content pages (+ 9 redirect stubs) break down by sector per `blog/index.html` categories:

| Category | `data-category` | Count | Examples |
|---|---|---|---|
| Mining | `mining` | 23 | BHP, Rio Tinto, Vale, Barrick Gold, Glencore, Kazatomprom, AngloGold, Fresnillo, Central Asia Metals, Exxaro, Gerdau, Valterra |
| Upstream Oil & Gas | `upstream` | 16 | Equinor, Petrobras, Devon Energy, ENI, OMV, Repsol, Aker BP, APA, Cardinal Energy, Coterra, Ecopetrol, Panoro, Woodside |
| Shipping & Tanker | `shipping` | 9 | Green Shipping 2026, Hidden Champions, LNG/Tanker picks, Konsolidierung, Tanker-Charterraten |
| Midstream / Pipeline | `midstream` | 5 | Pembina, TC Energy, Enbridge, ONEOK, Pipeline Finale |
| Dividenden | `dividenden` | 5 | 10%-Yield picks, 5% stabil, Rohstoff-Superzyklus, Quellensteuer |
| BDC & High-Yield | `bdc` | 2 | Newtek vs Hercules, Crescent vs Blue Owl |
| Rechner | `rechner` | 2 | Shipping Cashflow Rechner, Alle Finanzrechner |

Additional blog pages not in index filters: Toolbox/Broker review, Wise/Airalo travel, Debitum reality check, market news articles.

**Redirect stubs** (9 files): Mining articles renamed from `-2025.html` to `-2026.html`. Old URLs use `<meta http-equiv="refresh">` + `<meta name="robots" content="noindex, follow">` + canonical pointing to new URL.

**Blog index filters** (`blog/index.html`): 7 category buttons filter articles via `data-category` attributes on `.post` cards using vanilla JS.

## Design System

### CSS Custom Properties (`/blog/styles.css`)

```css
/* Color Palette */
--gold: #d4af37;                              /* Primary accent / brand gold */
--gold-strong: #e0bd55;                       /* Bright gold for gradients */
--gold-dim: rgba(212,175,55,0.12);            /* Subtle gold backgrounds */
--gold-border: rgba(212,175,55,0.22);         /* Border color */
--bg: #0f1115;                                /* Dark background */
--bg-soft: #151821;                           /* Slightly lighter background */
--bg-card: #1a1f2b;                           /* Card background */
--glass: rgba(21,24,33,0.75);                 /* Glassmorphism background */
--text: #f5f6fa;                              /* Primary text (near-white) */
--text-soft: #cfd6e6;                         /* Secondary text */
--text-muted: #9aa6c0;                        /* Muted text */

/* Layout */
--radius: 16px;                               /* Standard border radius */
--radius-sm: 10px;                            /* Small element radius */
--transition: 0.28s cubic-bezier(0.4,0,0.2,1);  /* Easing function */

/* Shadows */
--shadow-card: 0 4px 20px rgba(0,0,0,0.3);
--shadow-hover: 0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.18);
--shadow-gold: 0 0 30px rgba(212,175,55,0.15);  /* Gold glow effect */
```

### Visual Style

- **Dark theme** with gold (#d4af37) accents throughout
- **Glassmorphism** cards with `backdrop-filter: blur()` and semi-transparent backgrounds
- **Montserrat** font family (400–800 weights via Google Fonts)
- Gradient gold headings using `-webkit-background-clip: text`
- Hover effects: `translateY(-6px)` lift with gold border glow
- Reading progress bar on article pages (gold gradient, fixed top)
- Scroll reveal animations via IntersectionObserver (`.reveal` → `.visible`, threshold 8%)

### Key CSS Classes

| Class | Purpose |
|---|---|
| `.nav`, `.nav-inner`, `.nav-links` | Main sticky navigation bar |
| `.nav-hamburger`, `.nav-mobile` | Mobile navigation (breakpoint: 700px) |
| `.dropdown`, `.dropdown-btn`, `.dropdown-content` | Dropdown menus in nav |
| `.container`, `.page-wrapper` | Content wrapper (max-width: 960px) |
| `.page-header` | Centered page title section with gold gradient |
| `.article-hero`, `.article-hero .inner` | Full-width article header with gradient background |
| `.article-body` | Article content wrapper (max-width: 860px) |
| `.article-meta` | Article metadata line (date, author, category) |
| `.post`, `.card` | Glassmorphism content cards |
| `.posts`, `.grid` | Card grid layouts |
| `.btn`, `.btn-secondary` | Gold pill buttons |
| `.info-box` | Blue-gold info callout (border-left: 4px solid #d4af37) |
| `.risk-box` | Red risk callout (border-left: 4px solid #ff6b6b) |
| `.success-box` | Green success callout |
| `.key-takeaway` | Highlighted takeaway with star icon |
| `.metrics-grid`, `.metric-card` | Financial metrics display grid |
| `.metric-value`, `.metric-label` | Metric card content elements |
| `.table-wrapper`, `.data-table` | Styled data tables |
| `.cta-box` | Call-to-action box with gold top border |
| `.related-articles` | Related content links section |
| `.breadcrumbs` | Navigation breadcrumbs (max-width: 900px) |
| `.author-box`, `.author-info` | Author bio card |
| `.disclaimer` | Legal disclaimer box |
| `.reveal` | Scroll-triggered fade-in animation |
| `.section-label` | Uppercase gold pill label |
| `.section-label-grid` | Section labels in blog index grid |
| `.filter-bar`, `.filter-btn` | Blog category filter UI |
| `.video-wrapper` | Responsive 16:9 YouTube embed container |
| `.site-footer`, `.footer-inner`, `.footer-bottom` | Page footer |
| `.reading-progress` | Reading progress bar (injected by nav.js) |

## Stylesheets

There are **two main CSS sources** — pages use one or the other:

1. **`/blog/styles.css`** — The shared design system stylesheet (1332 lines, 20 CSS custom properties). Used by blog articles, tools, rechner, podcast pages, and most content pages. Referenced as `<link rel="stylesheet" href="/blog/styles.css?v=3">`.

2. **Inline `<style>` blocks** — The homepage (`index.html`) and some older pages embed their own styles directly. These share the same design tokens but may have page-specific additions.

Some pages include **both** the shared stylesheet and additional inline `<style>` overrides (e.g., `.info-box`, `.risk-box`, `.breadcrumbs` styling).

**`/podcast/styles.css`** (121 lines) — Podcast-specific styles extending the shared design system.

## Navigation

### Shared Navigation (`/assets/js/nav.js` — v3)

All pages should include:
```html
<script src="/assets/js/nav.js" defer></script>
```

This script (525 lines) is the **single source of truth** for navigation across all 100+ pages. It provides:

- **Nav HTML injection** — replaces `<nav class="nav">` or `<header class="nav">` elements with the canonical navigation HTML at runtime. A nav change in `nav.js` propagates to every page automatically.
- **Hamburger menu** toggle for mobile (< 700px)
- **Dropdown menus** (hover on desktop, click on mobile)
- **Scroll reveal** animation (IntersectionObserver on `.reveal` elements, threshold 0.08, rootMargin `0px 0px -40px 0px`)
- **Reading progress bar** (on pages with `.article-body`, `article`, or `.article-hero`)
- **Active nav link** highlighting based on current URL path
- **Author bio injection** on `/blog/*` article pages (auto-inserts Marco Bozem bio with links to YouTube and LinkedIn)
- **Article schema injection** — auto-generates `BlogPosting` JSON-LD for blog articles that lack one (fixes E-E-A-T for legacy articles)
- **Cookie consent banner** (DSGVO-compliant, Google Consent Mode v2, stored in `localStorage` as `mbcs_consent_v1`)

### nav.js Boot Order

```
DOMContentLoaded →
  1. injectNav()           — creates nav DOM (must run first)
  2. setupHamburger()      — mobile menu toggle
  3. setupDropdowns()      — dropdown hover/click
  4. setupScrollReveal()   — IntersectionObserver on .reveal
  5. setupReadingProgress() — progress bar for articles
  6. setupActiveNav()      — highlight current page link
  7. setupAuthorBio()      — inject author card on blog articles
  8. injectArticleSchema() — inject BlogPosting JSON-LD if missing
  9. setupCookieBanner()   — only if no prior consent stored
```

### nav.js Page Detection Logic

Blog article detection uses two slightly different filters:

**Author bio injection** (`setupAuthorBio`):
```javascript
path.startsWith('/blog/') &&
path !== '/blog/' &&
!path.endsWith('index.html') &&
!path.endsWith('alle-finanzrechner.html')
```

**Article schema injection** (`injectArticleSchema`) — stricter:
```javascript
path.startsWith('/blog/') &&
path !== '/blog/' &&
!path.endsWith('index.html') &&
!path.endsWith('alle-finanzrechner.html') &&
!path.endsWith('meine-toolbox-broker-tools-plattformen-2025.html') &&
!path.endsWith('wise-airalo-vietnam-erfahrungen.html')
```

### Canonical Navigation HTML

The canonical nav is defined in **three places** (keep them in sync):
1. **`/assets/js/nav.js`** `injectNav()` function — the runtime source of truth
2. **`add_nav.py`** `CANONICAL_NAV_HTML` constant — for batch-adding nav to new pages
3. **`fix_nav.py`** `CANONICAL_NAV` constant — for batch-fixing nav across all pages

### Desktop Nav Links

- **Startseite** → `/`
- **Depot** → `/depot-strategie/`
- **Hard Asset Guide** → `/hard-asset-guide/`
- **Themen** dropdown:
  - Shipping Aktien → `/shipping-aktien/`
  - Pipelines / Midstream → `/midstream/`
  - Mining Aktien → `/mining-aktien/`
  - Upstream Aktien → `/upstream-aktien/`
  - Dividendenstrategie → `/dividendenstrategie/`
  - (separator)
  - High-Yield & BDC → `/kategorien/high-yield-aktien.html`
  - Rohstoff Superzyklus → `/rohstoff-superzyklus-master.html`
  - (separator)
  - Beste LNG-Aktien 2026 → `/bestenlisten/beste-lng-aktien-2026.html`
  - Beste Tanker-Aktien 2026 → `/bestenlisten/beste-tanker-aktien-2026.html`
  - Top 5 High-Yield 2026 → `/bestenlisten/top-5-high-yield-aktien-2026.html`
- **Podcast** dropdown:
  - Alle Podcasts → `/podcast/`
  - (separator)
  - Finanzfeuer Talk → `/podcast/der-finanzfeuer-talk.html`
  - Dividenden-Journey → `/podcast/mein-weg-zur-dividendenstrategie-2025.html`
  - Timing & Zyklen → `/podcast/timing-ist-alles-dividendenstrategie-podcast-2025.html`
  - (separator)
  - Maritime / Shipping → `/podcast/maritime-investments-schifffahrtsaktien-2025.html`
  - BDC Aktien → `/podcast/bdc-aktien-erklaert-2025.html`
  - Mining Serie → `/podcast/mining-serie-high-dividend-ressourcen-2025-2028.html`
- **Blog** → `/blog/`
- **Investing.com** → `/investing-analysen.html`
- **Rechner** (highlighted gold) → `/rechner/`

### Mobile Nav Links (< 700px)

Navigation section (8 links): Startseite, Depot-Strategie, Hard Asset Guide, Blog, Alle Rechner, Investing.com, Toolbox, Glossar

Themen section (6 links): Shipping, Midstream, Mining, Upstream, High-Yield, Rohstoff Superzyklus

Podcast section (3 links): Finanzfeuer Talk, Dividenden-Journey, Timing & Zyklen

When adding new pages, they only need a stub `<nav class="nav"></nav>` element — `nav.js` injects the full HTML at runtime. For pages that must work without JS, use the `CANONICAL_NAV_HTML` from `add_nav.py`.

### Cookie Consent Banner

- **Consent key**: `mbcs_consent_v1` in `localStorage`
- **States**: `null` (first visit, shows banner), `'granted'` (ads + analytics on), `'denied'` (essential only)
- **Google Consent Mode v2**: Sets `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`
- **Banner buttons**: "Alle akzeptieren" (gold primary) / "Nur notwendige" (outline secondary)
- **Banner CSS**: Injected dynamically by nav.js (fixed bottom, glassmorphism, z-index 9999)
- **Privacy link**: Points to `/datenschutz.html`

## SEO Conventions

### Every page should include:

1. **`<title>`** — Descriptive, includes "| MB Capital Strategies" suffix
2. **`<meta name="description">`** — Unique, keyword-rich description
3. **`<link rel="canonical">`** — Absolute URL to `https://mbcapitalstrategies.com/...`
4. **Open Graph tags** (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
5. **Twitter Card tags** (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
6. **`<meta name="author" content="Marco Bozem">`**
7. **Favicon links** — Standard set:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico">
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
   <link rel="manifest" href="/site.webmanifest">
   <meta name="theme-color" content="#0f1115">
   ```

### Structured Data (JSON-LD)

- **Blog articles**: `BreadcrumbList` + `BlogPosting` (auto-injected by `nav.js` if missing) + optional `FAQPage`
- **Tool pages**: `WebApplication` (with `applicationCategory: "FinanceApplication"`, `price: "0"`) + `FAQPage`
- **Homepage**: `FAQPage` + `WebSite` + `Organization`
- **Hub/index pages**: `BreadcrumbList`

Note: `nav.js` automatically injects `BlogPosting` schema for `/blog/*` article pages that don't already include one. The injected schema includes author (`Marco Bozem`), publisher (`MB Capital Strategies`), `sameAs` links (YouTube, LinkedIn), and date extraction from meta tags or URL patterns. This ensures E-E-A-T compliance for legacy articles without manual edits.

### Author Bio Auto-Injection

`nav.js` automatically inserts an `.author-box` card on blog article pages with:
- Photo: `/marco.jpg` (62x62)
- Name: Marco Bozem (links to `/ueber-marco-bozem/`)
- Bio text: "Unabhängiger Investor & Gründer von MB Capital Strategies..."
- Links: Über Marco, YouTube (`@mbcapitalstrategies`), LinkedIn

Insertion point (in priority order): `.breadcrumbs` → `.breadcrumb` → `section.container` → `.page-wrapper` → `.container h1` → `nav.nav`

### Sitemaps

The site uses a **sitemap index** pattern (`sitemap.xml` → 8 sub-sitemaps):

| Sitemap | URLs | Content |
|---|---|---|
| `sitemap-main.xml` | 18 | Core pages (hub pages, legal, about) |
| `sitemap-blog.xml` | 65 | Blog articles (all sectors) |
| `sitemap-tools.xml` | 9 | Calculator tools |
| `sitemap-video.xml` | 20 | YouTube video embeds with full video schema |
| `sitemap-kategorien.xml` | 10 | Category hub pages |
| `sitemap-bestenlisten.xml` | 3 | Annual best-of lists (2026 editions only) |
| `sitemap-investing.xml` | 1 | Investing.com analyses hub |
| `sitemap-travel.xml` | 1 | Travel content (listed in `robots.txt` but not in `sitemap.xml` index) |
| `glossar-sitemap.xml` | 23 | Glossary terms (auto-generated from `terms.json`) |

**When adding new pages**, update the relevant sub-sitemap XML file. Do NOT include redirect stubs (`noindex` pages) in sitemaps.

## Utility Scripts

### Python Scripts (batch HTML transformations)

These scripts are **one-off or maintenance tools** — they modify HTML files in-place:

| Script | Purpose | Targets |
|---|---|---|
| `add_nav.py` | Adds canonical nav to pages missing it or replaces old `<header>` navs | 10 specific pages (shipping, rohstoffe, glossar, kategorien, blog) |
| `fix_nav.py` | Standardizes nav dropdowns (Themen + Podcast) across ALL pages | Every `.html` file in repo (recursive walk) |
| `add_faq_schema.py` | Injects FAQPage JSON-LD (5 Q&As each) into mining + upstream articles | 10 blog articles (Thungela, Whitehaven, Yancoal, BHP, Fortescue, Rio Tinto, Vale, Glencore, Kazatomprom) |
| `add_faq_to_blog.py` | Adds context-aware FAQPage JSON-LD to blog articles missing one | Blog articles without existing FAQPage schema |
| `add_breadcrumb_to_blog.py` | Adds BreadcrumbList JSON-LD schema to blog articles missing one | Blog articles without existing BreadcrumbList schema |
| `add_glossar_blog_links.py` | Adds relevant blog article links to glossary pages' related sections | Glossary `*.html` pages (skips pages with 2+ existing blog links) |
| `inject_author_sources.py` | Injects author bio box HTML into blog articles | Blog article pages |
| `rename_mining_2026.py` | Renames articles from `-2025` to `-2026` with redirect stubs | 9 mining slugs + updates blog/index.html, sitemap-blog.xml, cross-references |
| `.claude/scripts/validate-site.py` | Site-weite Validierung (Meta-Tags, JSON-LD, Broken Links, SEO, Disclaimer) | Alle HTML-Dateien — Output als Text oder `--json`. Liegt in `.claude/` damit es nicht auf GitHub Pages deployed wird |

These scripts use hardcoded `BASE` paths. Current values:
- `add_nav.py`: `BASE = '/home/user/Mbcapitalstategieslanding'`
- `fix_nav.py`: `BASE = '/home/user/Mbcapitalstategieslanding'`
- `add_faq_schema.py`: `BASE = '/home/user/Mbcapitalstategieslanding/blog'`
- `rename_mining_2026.py`: `BASE = '/home/user/Mbcapitalstategieslanding'`

Update the `BASE` variable if running in a different environment.

#### `fix_nav.py` — Details

- Regex-replaces "Sektoren" or "Themen" dropdown blocks with canonical version
- Updates mobile nav labels "Sektoren" → "Themen"
- **Homepage special handling**: Removes duplicate "Upstream Aktien" links, updates `/blog/index.html` → `/blog/` references
- Processes homepage separately, then walks all other HTML files

#### `rename_mining_2026.py` — Redirect Stub Pattern

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=https://mbcapitalstrategies.com/blog/[new-slug].html">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://mbcapitalstrategies.com/blog/[new-slug].html">
  <title>Weitergeleitet…</title>
</head>
<body>
  <p>Diese Seite wurde verschoben. <a href="...">Klicke hier, falls du nicht automatisch weitergeleitet wirst.</a></p>
</body>
</html>
```

### Node.js Script

| Script | Purpose |
|---|---|
| `build-glossar-sitemap.mjs` | Reads `glossar/terms.json`, deduplicates slugs, generates `glossar-sitemap.xml` with URLs like `https://mbcapitalstrategies.com/glossar/?begriff=<slug>` |

Run with: `node build-glossar-sitemap.mjs`

## Glossary System

The glossary (`/glossar/`) consists of:

1. **`terms.json`** — Maps 196 German/English financial terms to 152 unique URL-safe anchors. Categories:
   - Core financial (15): Dividende, Cashflow, EBITDA, KGV, ROE, NAV, REIT...
   - Valuation & ratios (20+): KBV, KUV, PEG, Forward KGV, EV/EBITDA, Debt-to-Equity...
   - Shipping general (22): VLCC, Panamax, Suezmax, Capesize, Bulk Carrier, Baltic Dry Index...
   - Shipping 2026 regulations (34+): ETS Maritime, FuelEU, CII, EEXI, Dual Fuel, Retrofit, Rotor-Sail...
   - Mining & resources (17+): AISC, Ore Grade, Uranium, Yellowcake, Eisenerz, Kupfer...
   - Dividends (6+): DPS, DRIP, Dividend Coverage, Sonderdividende...
   - Midstream & MLPs (4+): MLP, K-1, Distributable Cash Flow, Pipeline...
   - Oil & Gas (4+): Upstream, Downstream, NGL, Throughput...
   - Macro & advanced (15+): DCF, WACC, Beta, Commodity Supercycle, Value Trap, Margin of Safety...

2. **`glossar.js`** — Powers the glossary index page with search/filter and dynamic SEO (title, description, Schema.org based on URL `?begriff=` parameter). Auto-opens and highlights term from URL param.

3. **`autolink-glossar.js`** / **`assets/js/glossar-linking.js`** — Client-side scripts that auto-link glossary terms found in article text. Fetches `/glossar/terms.json`, protects existing `<a>` tags, then replaces term matches with links to `/glossar/?begriff=anchor` or `/glossar/#anchor`. Uses word boundaries and case-insensitive matching.

4. **Specialized glossary pages** (23 pages total):
   - `shipping-cluster.html` — Shipping terminology hub
   - `aisc-mining.html` — Mining cost definitions (All-In Sustaining Costs)
   - `tce-rate.html` — Shipping Time Charter Equivalent rates
   - `baltic-dry-index.html`, `bdc.html`, `capex.html`, `cashflow-cover.html`, `dayrate.html`, `debt-ebitda.html`, `dividend-cut.html`, `dividend-yield.html`, `ebitda.html`, `free-cashflow.html`, `hard-assets.html`, `midstream.html`, `mlp.html`, `payout-ratio.html`, `special-dividend.html`, `superzyklus.html`, `time-charter.html`, `upstream.html`, `yield-on-cost.html` — Additional financial concept deep-dives

When adding new financial terms, add them to `terms.json` and regenerate the sitemap with `node build-glossar-sitemap.mjs`.

## Page Patterns

### Blog Article Template

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <!-- Favicons -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0f1115">

  <!-- AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7097302643579933" crossorigin="anonymous"></script>

  <meta charset="UTF-8">
  <!-- AUSNAHME (Marco 05.06.2026): AdSense-Tag NICHT auf reine Conversion-/Funnel-Seiten
       OHNE Ad-Slots setzen — konkret newsletter-sample.html + newsletter.html. Der Tag
       zeigt dort keine Werbung (keine <ins class="adsbygoogle">), löst aber Googles
       EU-Pflicht-CMP (IAB TCF, „210 Partner") aus → schadet der Premium-Conversion.
       Beim AdSense-Code-Sweep diese beiden Seiten überspringen. -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="https://mbcapitalstrategies.com/blog/[slug].html">
  <title>[Company] – [Subtitle] | MB Capital Strategies</title>
  <meta name="description" content="[SEO description]">
  <meta name="author" content="Marco Bozem">

  <!-- Open Graph + Twitter -->
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="...">
  <meta property="og:url" content="...">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="stylesheet" href="/blog/styles.css?v=3">

  <!-- JSON-LD: BlogPosting -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "[Title]",
    "description": "[Description]",
    "author": { "@type": "Person", "name": "Marco Bozem", "url": "https://mbcapitalstrategies.com/ueber-marco-bozem/" },
    "publisher": { "@type": "Organization", "name": "MB Capital Strategies", "logo": { "@type": "ImageObject", "url": "https://mbcapitalstrategies.com/Logo.png" } },
    "mainEntityOfPage": "https://mbcapitalstrategies.com/blog/[slug].html",
    "datePublished": "[ISO date]",
    "dateModified": "[ISO date]",
    "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 }
  }
  </script>

  <!-- JSON-LD: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://mbcapitalstrategies.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://mbcapitalstrategies.com/blog/" },
      { "@type": "ListItem", "position": 3, "name": "[Title]", "item": "https://mbcapitalstrategies.com/blog/[slug].html" }
    ]
  }
  </script>

  <!-- JSON-LD: FAQPage (optional, 5 Q&As) -->

  <!-- Inline <style> overrides (if needed) -->
</head>
<body>
  <nav class="nav"></nav>  <!-- nav.js injects full nav HTML here -->

  <nav class="breadcrumbs">
    <a href="/">Startseite</a> ›
    <a href="/blog/">Blog</a> ›
    <span>[Current Article]</span>
  </nav>

  <!-- Author bio is auto-injected by nav.js after breadcrumbs -->

  <section class="article-hero">
    <div class="inner">
      <h1>[Title]</h1>
      <div class="article-meta">
        <span>Published: [Date]</span>
        <span>Marco Bozem</span>
        <span>[Category]</span>
      </div>
    </div>
  </section>

  <article class="article-body">
    <!-- Content sections with h2/h3, paragraphs, tables -->
    <div class="info-box"><strong>Info:</strong> [Key information]</div>
    <div class="risk-box"><strong>Risiko:</strong> [Risk factors]</div>
    <div class="key-takeaway"><p>[Key insight]</p></div>
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-value">10%</span>
        <span class="metric-label">Dividendenrendite</span>
      </div>
    </div>
    <div class="video-wrapper">
      <iframe src="https://www.youtube.com/embed/[id]" ...></iframe>
    </div>

    <div class="cta-box">
      <h3>[Call to Action]</h3>
      <a href="[link]" class="btn">Action Button</a>
    </div>
    <div class="related-articles">
      <h3>Verwandte Artikel</h3>
      <ul><li><a href="...">Title</a></li></ul>
    </div>
    <div class="disclaimer">
      <strong>Disclaimer:</strong> Keine Anlageberatung. Alle Angaben ohne Gewähr.
    </div>
  </article>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col"><h4>Section</h4><a href="...">Link</a></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 MB Capital Strategies &middot; Marco Bozem</span>
    </div>
  </footer>

  <script src="/assets/js/nav.js" defer></script>
  <script src="/assets/js/glossar-linking.js" defer></script>
</body>
</html>
```

### Tool Page Template

Tool pages (calculators) include:
- `WebApplication` JSON-LD schema (with `applicationCategory: "FinanceApplication"`, `price: "0"`)
- `FAQPage` JSON-LD with tool-specific questions
- Interactive JavaScript calculator (inline `<script>`)
- SEO-optimized text content below the calculator
- Same nav, favicon, AdSense setup as blog articles

### Section Hub Template (e.g., `/shipping-aktien/index.html`)

Hub pages list articles for a sector with card grids (`.posts` / `.grid`), use the shared design system, and typically include:
- `BreadcrumbList` JSON-LD
- Card grid of related articles
- Sector overview text
- CTA box linking to related tools or guides

### Homepage (`index.html`)

Self-contained (~1654 lines) with ALL styles inline. Features:
- Hero section with background image
- Sector cards (Shipping, Mining, Midstream, Upstream, Dividendenstrategie)
- Featured articles grid
- YouTube embed
- Tool/calculator showcase
- Newsletter/CTA sections
- Own inline nav (NOT from nav.js — must be updated manually)

## Content Conventions

- **Language**: All content is in **German** (`lang="de"`)
- **Disclaimer**: Every analysis article must include a legal disclaimer: "Keine Anlageberatung. Alle Angaben ohne Gewähr."
- **Author**: Marco Bozem — all articles attributed to him
- **Date format**: German format in display, ISO 8601 in Schema.org (`datePublished`, `dateModified`)
- **URLs**: Use lowercase, hyphenated slugs. Year suffix pattern: `aktie-analyse-2026.html`. When renaming year suffixes (e.g., 2025→2026), keep the old file as a `<meta http-equiv="refresh">` redirect stub with `<meta name="robots" content="noindex, follow">`
- **Images**: Root-level JPEGs/PNGs for charts and infographics. Use `loading="lazy"` for below-fold images
- **YouTube embeds**: Wrapped in `.video-wrapper` for responsive 16:9 aspect ratio
- **AdSense**: Include on all public pages: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7097302643579933" crossorigin="anonymous"></script>`
- **Affiliate links**: Broker/tool recommendations in `toolbox.html` and some articles contain affiliate links with disclosure

## Development Workflow

1. **No build step required** — edit HTML/CSS/JS files directly
2. **Test locally** — open HTML files in a browser or use a local server (`python -m http.server`)
3. **Maintain nav consistency** — use `fix_nav.py` or `add_nav.py` after adding new pages
4. **Update sitemaps** — manually edit the relevant `sitemap-*.xml` when adding/removing pages
5. **Regenerate glossary sitemap** — run `node build-glossar-sitemap.mjs` after editing `terms.json`
6. **Deployment** — push to `main` branch; GitHub Pages auto-deploys

## Common Tasks

### Adding a New Blog Article
1. Create `blog/<slug>.html` following the blog article template above
2. Include favicon links, AdSense script, meta tags (title, description, author, canonical, OG, Twitter)
3. Add `<link rel="stylesheet" href="/blog/styles.css?v=3">`
4. Add JSON-LD `BreadcrumbList` schema (3 items: Startseite → Blog → Article)
5. Add JSON-LD `BlogPosting` schema (or rely on nav.js auto-injection for legacy articles)
6. Optionally add `FAQPage` schema (5 relevant Q&As for E-E-A-T)
7. Add stub `<nav class="nav"></nav>` (nav.js injects full nav at runtime)
8. Add breadcrumbs, article-hero, article-body, disclaimer, footer
9. Include `<script src="/assets/js/nav.js" defer></script>` and optionally `<script src="/assets/js/glossar-linking.js" defer></script>`
10. Add entry to `sitemap-blog.xml` with appropriate priority and changefreq
11. Add card entry to `blog/index.html` (with correct `data-category`) and relevant sector hub pages

### Adding a New Calculator Tool
1. Create `tools/<name>.html` following tool page template
2. Add `WebApplication` + `FAQPage` JSON-LD schemas
3. Include interactive JS calculator in inline `<script>`
4. Add entry to `sitemap-tools.xml`
5. Add card to `rechner/index.html`

### Renaming Articles (Year Updates, e.g., 2025→2026)
1. Copy old file to new filename (e.g., `xyz-2025.html` → `xyz-2026.html`)
2. Update title, canonical URL, breadcrumb name, dateModified in new file
3. Replace old file content with redirect stub (meta refresh + noindex + canonical to new URL)
4. Update `blog/index.html` card links
5. Update `sitemap-blog.xml` (replace old URL, keep only new)
6. Update cross-references in other blog articles and hub pages
7. Use `rename_mining_2026.py` as a reference for automating this process

### Updating Navigation Site-Wide
1. Update the nav HTML in **all three sources**: `injectNav()` in `/assets/js/nav.js`, `CANONICAL_NAV_HTML` in `add_nav.py`, and `CANONICAL_NAV` in `fix_nav.py`
2. Since `nav.js` injects the nav at runtime, most pages update automatically after step 1
3. Run `python3 fix_nav.py` to update the static HTML nav in all pages (for no-JS fallback and initial render)
4. Manually verify the homepage (`index.html`) as it has its own inline nav that must be updated separately

### Adding Glossary Terms
1. Add term → slug mapping to `glossar/terms.json`
2. Run `node build-glossar-sitemap.mjs` to regenerate `glossar-sitemap.xml`
3. Terms are automatically linked in articles via `glossar-linking.js`

## Social & External Links

| Platform | URL |
|---|---|
| YouTube | `https://www.youtube.com/@mbcapitalstrategies` |
| LinkedIn | `https://www.linkedin.com/in/marco-bozem-182173295` |
| Website | `https://mbcapitalstrategies.com` |
| Author Page | `/ueber-marco-bozem/` |

## Agent & Workflow System

Dieses Projekt nutzt ein Multi-Agent-System mit automatischem Triggering. Der **Orchestrator** erkennt aus Marcos Input den richtigen Workflow und spawnt die passenden Sub-Agents. Alle Agents arbeiten im Kontext von MB Capital Strategies (Dividenden-Investing in Hard Assets).

### Grundregeln

- **Sprache**: Alle Outputs auf **Deutsch**, außer Reddit/Medium (Englisch)
- **Autor**: Immer Marco Bozem / MB Capital Strategies
- **Scope-Kontrolle**: Jeder Agent/Sub-Agent darf NUR auf die Dateien und Daten zugreifen, die er für seine aktuelle Aufgabe braucht — kein Zugriff auf fremde Pipelines oder unrelated Files
- **Parallelisierung**: Sub-Agents innerhalb einer Phase laufen parallel (via `Agent` tool), Phasen laufen sequentiell
- **Oversight**: Ab ≥3 parallelen Sub-Agents wird der Oversight-Agent automatisch als Letzter gespawnt

---

### 1. Orchestrator (Haupt-Agent)

**Trigger**: Automatisch bei jedem Input — ist die erste Entscheidungsebene
**Rolle**: Erkennt aus dem Kontext die richtige Pipeline und delegiert

| Schritt | Aktion |
|---|---|
| 1 | Input analysieren: Was will Marco? (Ticker? News? Depot? Code? Wochenrückblick?) |
| 2 | Pipeline wählen (siehe Trigger-Tabelle unten) |
| 3 | Aufgabe in Teilaufgaben zerlegen |
| 4 | Entscheiden: parallel oder sequentiell |
| 5 | Sub-Agents spawnen, Ergebnisse einsammeln |
| 6 | QA über das Gesamtergebnis |
| 7 | Kontroll-Bericht liefern |

**Trigger-Routing-Tabelle:**

| Input-Muster | Pipeline |
|---|---|
| Ticker-Symbol, Aktienname, Unternehmensname ohne weiteren Kontext | → Volle-Produktion |
| "Wochenrückblick", "Sonntag", "KW", "diese Woche" | → Wochenrückblick |
| "Breaking", "Eilmeldung", "schnell", "sofort", "Crash", "Div-Cut" | → Breaking-News |
| "Depot", "kaufen", "nachkaufen", "Allokation", "€ investieren", "Position", "Sparrate" | → Portfolio-Agent |
| "Plane Feature", "Dashboard", "App", "Design" | → Architect-Agent |
| "Baue", "Implementiere", "Code", "Fix", "Bug" | → Developer-Agent (ggf. mit Architect vorher) |
| "Prüfe", "Code Review", "Test" | → QA-Agent |
| "Publish", "Push", "Deploy", "Workflow", "Automatisiere", "Kalender", "Was steht an?" | → Automation-Agent |
| "Optimiere", "Optimize", "Self-Improve", "Skill verbessern", "täglich optimieren" | → Daily-Optimize-Agent (oder `/loop 24h /daily-optimize`) |

---

### 2. Volle-Produktion (Standard-Pipeline)

**Trigger**: Ticker, Aktie oder Thema ohne weiteren Kontext
**Aufgabe**: 1 Thema rein → alles fertig raus. 6 Phasen automatisch.

#### Phase 1: Research (4 Sub-Agents parallel)

| Sub-Agent | Aufgabe | Zugriff |
|---|---|---|
| Research-1: Finanzkennzahlen | Bilanz, FCF, Payout Ratio, Bewertung (KGV, KBV, EV/EBITDA) | Web-Recherche, Finanzportale |
| Research-2: Dividenden | Historie, Wachstumsrate, Prognose, Sonderdividenden, YOC-Potenzial | Web-Recherche |
| Research-3: Sektor/Markt | Rohstoffpreise, Zyklusposition, Angebot/Nachfrage, Regulierung | Web-Recherche |
| Research-4: News/Katalysatoren | Aktuelle News, Management-Änderungen, M&A, Geopolitik | Web-Recherche |

#### Phase 2: YouTube-Skript (1 Agent)

- **Länge**: 1.500–2.500 Wörter
- **Struktur**: Hook → Intro → Hauptteil (3–5 Kapitel) → Fazit → CTA
- **Extras**: Schnitt-Anweisungen, B-Roll-Sequenzen, Thumbnail-Prompt (Midjourney/DALL-E)
- **Stil**: Klar, direkt, keine Floskeln. Marco-Tonalität: sachlich-optimistisch, Zahlen-getrieben
- **Zugriff**: NUR Research-Ergebnisse aus Phase 1

#### Phase 3: Multi-Plattform (4 Sub-Agents parallel)

| Sub-Agent | Plattformen | Format |
|---|---|---|
| Plattform-1 | LinkedIn + Investing.com | LinkedIn: 1.300 Zeichen, Hook-Frage-Einleitung. Investing.com: 800–1.200 Wörter, Analyse-Format |
| Plattform-2 | Reddit + Medium | Englisch. Reddit: Due-Diligence-Post. Medium: 1.000–1.500 Wörter |
| Plattform-3 | Wallstreet-Online + Wertpapier-Forum + Goldseiten | Deutsch, Forum-Stil, Kennzahlen-lastig |
| Plattform-4 | Website (HTML) | Blog-Artikel aus Template (siehe Blog Article Template oben), SEO-optimiert |

**Zugriff**: NUR Research-Ergebnisse + YT-Skript aus Phase 1–2

#### Phase 4: QA/Oversight

- Oversight-Agent prüft Cross-Konsistenz aller Outputs
- Bei Fehlern: automatisch fixen

#### Phase 5: Output

- Alles gebündelt, copy-paste ready
- Pro Plattform ein klar getrennter Block

#### Phase 6: Save + Deploy (3 Sub-Agents parallel)

| Sub-Agent | Aufgabe | Zugriff |
|---|---|---|
| Save-1 | Dateien speichern (alle Plattformen) | Nur Output-Dateien schreiben |
| Save-2 | Notion-Einträge erstellen | Notion API |
| Save-3 | Website deployen (GitHub Pages) | Nur `blog/`, `sitemap-blog.xml`, `blog/index.html`, relevante Hub-Pages |

---

### 3. Wochenrückblick-Pipeline

**Trigger**: "Wochenrückblick", "Sonntag", "KW", "diese Woche"
**Aufgabe**: Wöchentlicher Marktüberblick, jeden Sonntag

#### Research (4 Sub-Agents parallel)

| Sub-Agent | Aufgabe |
|---|---|
| Wochen-Research-1 | Indizes + Makro (DAX, S&P 500, Zinsen, Inflation, Arbeitsmarkt) |
| Wochen-Research-2 | Rohstoffe (Öl, Gas, Gold, Kohle, Kupfer, Uran) |
| Wochen-Research-3 | Shipping (BDI, BDTI, BCTI, Container-Raten, Tanker-Raten) |
| Wochen-Research-4 | Aktien-News + Geopolitik (Div-Ankündigungen, Earnings, Konflikte) |

#### Content

- YT-Skript: 1.000–1.800 Wörter
- Kürzere Plattform-Versionen (LinkedIn, Forum, Website)
- Ausblick nächste Woche (Earnings, Events, Makro-Termine)

---

### 4. Breaking-News-Pipeline

**Trigger**: "Breaking", "Eilmeldung", "schnell", "sofort", "Crash", "Div-Cut", "dringend"
**Aufgabe**: Abgespeckte Pipeline für eilige Themen. 3 Phasen statt 6.

#### Phase 1: Quick-Research (1 Agent, max. 2 Min.)

Schnelle Fakten-Sammlung, keine tiefe Analyse

#### Phase 2: Content (3 Sub-Agents parallel)

| Sub-Agent | Aufgabe |
|---|---|
| Breaking-1 | YT-Short (≤60s) ODER Quick-Take (5–8 Min) |
| Breaking-2 | LinkedIn + Reddit (kurz, reaktiv) |
| Breaking-3 | Website (kurzer SEO-Artikel, 400–600 Wörter) |

#### Phase 3: Save

Schnell speichern und deployen

**Nach dem Breaking**: Automatisch Volle-Produktion vorschlagen ("Soll ich jetzt die vollständige Analyse starten?")

---

### 5. Portfolio-Agent

**Trigger**: "Depot", "kaufen", "nachkaufen", "Allokation", "€ investieren", "Position", "Sparrate", "Portfolio"
**Rolle**: Sparringspartner für Kaufentscheidungen — denkt wie ein Contrarian-Kapitalallokierer

**Verhalten:**
- **BREMST** bei: FOMO, Zyklus-Hoch, Mini-Positionen (<1% Depot), überbewerteten Sektoren
- **PUSHT** bei: Zyklus-Tief, Panik-Verkäufen, Cashflow-Rendite >10%, historisch günstiger Bewertung
- **YOC ≥8%** immer hervorheben

**Automatische Risiko-Checks:**
1. Sektor-Klumpenrisiko (max. 30% in einem Sektor)
2. Länder-Klumpenrisiko (Emerging Markets, Steuerrisiko)
3. Dividenden-Cut-Risiko (Payout >80%, sinkender FCF)
4. Währungsrisiko (AUD, BRL, ZAR, NOK)

**Output-Format**: 3 Sätze + Zahlen, kurz & knapp. Keine langen Abhandlungen.
**Zugriff**: Depot-Daten (wenn vorhanden), Web-Recherche für aktuelle Kurse/Kennzahlen

---

### 6. Architect-Agent

**Trigger**: "Plane Feature", "Dashboard", "App", "Design", "Architektur"
**Rolle**: PLANT und SPEZIFIZIERT — schreibt KEINEN Code

**Aufgaben:**
- Kennt die Projektstruktur (statische Website + ggf. separate App-Projekte)
- Bricht Features in konkrete Tasks für den Developer-Agent
- Definiert: Scope, Akzeptanzkriterien, Risiken, Abhängigkeiten
- Output: Task-Liste mit klaren Anforderungen pro Task

**Zugriff**: Nur Projektstruktur lesen (Dateibaum, bestehender Code), KEINE Schreibrechte

---

### 7. Developer-Agent

**Trigger**: "Baue", "Implementiere", "Code", "Fix", "Bug", "Feature implementieren"
**Rolle**: Schreibt VOLLSTÄNDIGEN, lauffähigen Code (Marco codet nicht selbst)

**Regeln:**
- Dark + Gold Theme Pflicht (CSS Custom Properties aus `blog/styles.css`)
- Tests mitliefern wo sinnvoll
- Nach jeder Implementierung: Verbesserungen vorschlagen
- Kommentare auf Deutsch, Variablen/Funktionen auf Englisch
- Für Website: HTML/CSS/JS only (kein Framework, kein Build-Step)

**Sub-Agents bei größeren Features (parallel):**

| Sub-Agent | Aufgabe |
|---|---|
| Dev-1 | Frontend-Komponente A |
| Dev-2 | Frontend-Komponente B |
| Dev-3 | Backend-Endpoint (falls relevant) |
| Dev-4 | Tests schreiben |

**Zugriff**: Nur die Dateien, die für das aktuelle Feature relevant sind. Kein Zugriff auf Content-Pipelines.

---

### 8. QA-Agent

**Trigger**: "Prüfe", "Code Review", "Test", "Qualitäts-Check"
**Rolle**: Prüft Code + Content auf Qualität

**Prüfbereiche Code:**
- Security (XSS, Injection, OWASP Top 10)
- Bugs (Logik, Edge Cases, Null-Checks)
- Performance (Bundle Size, Lazy Loading, Render-Performance)
- Code Quality (DRY, SOLID, Naming)
- Theme-Konformität (Dark + Gold, CSS Custom Properties)
- Test-Abdeckung

**Prüfbereiche Content:**
- Fakten-Konsistenz (Zahlen stimmen überein)
- SEO (Title, Description, Schema.org, Canonical)
- Plattform-Fit (LinkedIn ≠ Reddit ≠ Forum)

**Bewertung:**
- ✅ **Ship it** — Alles gut
- ⚠️ **Fix first** — Konkrete Fixes liefern (nicht nur reporten!)
- ❌ **Rewrite** — Grundlegendes Problem

**Zugriff**: Read-only auf den zu prüfenden Code/Content. Schreibzugriff NUR für Fixes.

---

### 9. Automation-Agent

**Trigger**: "Publish", "Push", "Deploy", "Workflow", "Automatisiere", "Kalender", "Was steht an?", "Status"
**Rolle**: Automatisiert den gesamten Publish + Deploy + Tracking Workflow

**Fähigkeiten:**

| Befehl | Aktion |
|---|---|
| "Publish" / "Deploy" | Website auf GitHub Pages deployen (git add, commit, push) |
| "Notion sync" | Notion-Einträge erstellen (YT Video, Blog, Research, Distribution) |
| "Status" | Übersicht: letzte Produktionen, offene Tasks |
| "Kalender" / "Was steht an?" | Upload-Plan anzeigen, kommende Events/Earnings |
| "Session-Briefing" | Bei neuer Session: Kalender, letzte Produktionen, offene Tasks, Markt-Events |

**Zugriff**: Git-Operationen, Sitemap-Dateien, `blog/index.html`, Notion API, Google Calendar API

---

### 10. Oversight-Agent (Qualitäts-Überblick)

**Trigger**: Automatisch als letzter Agent wenn ≥3 Sub-Agents parallel gearbeitet haben
**Rolle**: Chefredakteur — sieht das große Ganze nach paralleler Arbeit

**Prüft:**
- Cross-Konsistenz (gleiche Zahlen in YT-Skript, LinkedIn, Website?)
- Kernbotschaft (roter Faden vorhanden?)
- Daten-Integrität (Quellen korrekt zitiert?)
- Plattform-Fit (jede Version passt zum Kanal?)
- SEO (Title, Description, Schema, Canonical korrekt?)
- Monetarisierung (AdSense, Affiliate-Links wo relevant?)
- Bei Code: Architektur, Integration, Konsistenz, Test-Abdeckung, Bundle-Impact

**Fix-Prioritäten:**
- 🔴 **Muss-Fixes**: Sofort fixen (falsche Zahlen, broken Links, Security)
- 🟡 **Sollte-Fixes**: Wenn möglich fixen (Stil, SEO-Optimierung)
- 🟢 **Nice-to-have**: Für nächstes Mal merken

**Output**: Oversight-Report mit Gesamt-Score (X/10) + Entscheidung:
- ✅ **Freigabe** — Alles bereit
- ⚠️ **Fixes nötig** — Konkrete Fixes, dann Freigabe
- ❌ **Redo** — Zurück an den zuständigen Agent

---

### 11. Cowork-Skill

**Trigger**: "Cowork", "zusammen arbeiten", "gemeinsam", "arbeite mit mir an"
**Rolle**: Interaktiver Pair-Working-Modus für Tasks, die Marcos aktive Beteiligung brauchen

**Prinzipien:**
- **Minimaler Zugriff**: Liest/schreibt NUR die Dateien, die für die aktuelle Aufgabe relevant sind
- **Kein eigenständiges Deployment**: Fragt IMMER bevor gepusht/deployed wird
- **Schritt-für-Schritt**: Zeigt jeden Schritt, wartet auf Marcos OK
- **Scope-Lock**: Beim Start wird der Scope definiert (z.B. "nur blog/xyz.html bearbeiten") — darüber hinaus kein Zugriff

**Ablauf:**
1. Marco beschreibt die Aufgabe
2. Cowork-Agent definiert den Scope (welche Dateien, welche Aktionen)
3. Marco bestätigt den Scope
4. Agent arbeitet Schritt für Schritt, zeigt Zwischenergebnisse
5. Bei jedem Schritt: Marco bestätigt oder korrigiert
6. Am Ende: Zusammenfassung was gemacht wurde

**Zugriff-Regeln:**
- ✅ Dateien lesen, die zum definierten Scope gehören
- ✅ Dateien schreiben/editieren im definierten Scope
- ✅ Web-Recherche wenn für die Aufgabe nötig
- ❌ Kein Zugriff auf Dateien außerhalb des Scopes
- ❌ Kein automatisches Deployment (immer fragen)
- ❌ Keine parallelen Sub-Agents (Cowork = synchron, transparent)

---

### 12. Daily-Optimize-Agent (Selbst-Optimierung)

**Trigger**: Automatisch via `/loop 24h /daily-optimize` — läuft täglich bis Marco manuell stoppt
**Rolle**: Systematische Selbst-Optimierung aller Skills, Agents, Workflows, CSS, JS, HTML-Templates und Scripts

**Prinzip**: Jeden Tag 2-3 Bereiche durchgehen, Verbesserungen finden und automatisch umsetzen. Nur implementieren wenn das Ergebnis besser ist — sonst reverten.

**Tagesplan (Rotation):**

| Tag | Bereiche |
|---|---|
| Montag | CLAUDE.md Agent-Definitionen + CSS Design System |
| Dienstag | JavaScript (nav.js, glossar-linking.js) + HTML-Templates |
| Mittwoch | SEO & Sitemaps + Python Utility Scripts |
| Donnerstag | Glossar-System + Performance & Ladezeiten |
| Freitag | Content-Konsistenz + Neue Skill-/Agent-Ideen |
| Samstag | Freier Fokus auf größte Pain-Points der Woche |
| Sonntag | Review der Woche + Wochenrückblick-Prep |

**10 Optimierungs-Bereiche:**
1. CLAUDE.md — Agent-Definitionen, Trigger-Routing, Zugriffs-Matrizen
2. CSS — Custom Properties, tote Regeln, Responsiveness, Accessibility
3. JavaScript — Performance, Fehlerbehandlung, Schema.org Injection
4. HTML-Templates — Meta-Tags, JSON-LD, Favicon, AdSense
5. SEO & Sitemaps — Coverage, lastmod, Canonical URLs, robots.txt
6. Python Scripts — BASE-Pfade, Idempotenz, Dokumentation
7. Glossar — terms.json Vollständigkeit, Sitemap, Auto-Linking
8. Performance — Bilder, Minified CSS/JS, Lazy Loading
9. Content — Disclaimer, Author-Attribution, Copyright-Jahr, Footer
10. Neue Skills — Wiederkehrende Aufgaben automatisieren

**Sicherheits-Mechanismen:**
- Jede Änderung = eigener Git-Commit (einfach revertbar)
- Branch-Isolation (nie auf main)
- Validierung vor Commit (`python3 .claude/scripts/validate-site.py`)
- Kein Deployment ohne Marcos OK
- Bei Verschlechterung → sofort `git revert`

**Validierungs-Script**: `.claude/scripts/validate-site.py` — Automatische Prüfung auf fehlende Meta-Tags, Broken Links, Schema-Fehler, fehlende Disclaimers, veraltete Copyright-Jahre

**Output**: Daily Optimization Report mit Änderungen, Findings und Vorschlägen

**Starten**: `/loop 24h /daily-optimize`
**Stoppen**: Marco sagt manuell "aufhören" oder stoppt den Loop

**Zugriff**: Alle Projektdateien lesen + schreiben, Git-Operationen, KEINE externen APIs, KEIN Deployment

---

### 13. Video-Editor-Agent

**Trigger**: "Short", "Shorts", "Clip", "Schnitt", "Video schneiden", "Sequenzen", "Template", "B-Roll", "Opus Clip", "Longvideo bearbeiten", "Video", "Longvideo", "Chart", "Grafik"
**Rolle**: Marcos Video-Editor & Visual Designer. Marco filmt sich selbst (Talking Head) — der Agent übernimmt ALLES danach: Schnitt, Charts erstellen, Grafiken designen, Sequenzen zusammenbauen, Visuals einbinden, Color Grade, Untertitel, Chapters, Intro/Outro, YouTube SEO. Besser als Opus Clip, weil kontextbewusst (kennt Marcos Stil, Themen, Zielgruppe).

**Arbeitsteilung:**
- **Marco**: Filmt Talking Head, liefert Skript/Transkript, nimmt Screenshares auf
- **Agent**: Schneidet, erstellt Charts + Grafiken + Metric-Cards, baut Sequenzen, fügt Overlays/Wasserzeichen/Untertitel ein, exportiert, optimiert für YouTube

**Kernprinzip**: Kein Zuschauer soll länger als 15 Sekunden das gleiche Bild sehen. Abwechslung, Energie und visuelle Spannung sind Pflicht — bei Shorts UND Longvideos.

---

#### Modus A: Shorts aus Longvideos

**Input**: YT-Skript (aus Phase 2) oder bestehendes Longvideo-Transkript
**Output**: 3–5 Short-Kandidaten, jeweils production-ready

**Short-Template-Struktur** (≤60 Sekunden):

```
[0-3s]   HOOK          — Provokante Frage / Schock-Zahl / Kontroverse These
[3-8s]   KONTEXT       — 1 Satz: Warum ist das relevant?
[8-40s]  KERNINHALT    — Die beste Stelle aus dem Longvideo (1 Insight, 1 Zahl, 1 Fazit)
[40-50s] PAYOFF        — Was bedeutet das für den Zuschauer?
[50-58s] CTA           — "Ganzes Video oben rechts" / "Abonnieren für mehr"
[58-60s] END-SCREEN    — Logo / Abo-Animation
```

**Short-Typen (Templates):**

| Template | Hook-Stil | Beispiel |
|---|---|---|
| **Schock-Zahl** | Zahl + Pause + Erklärung | "15% Dividende. Und das ist kein Scam." |
| **Kontroverse** | Gegenthese + Beweis | "Alle sagen, Kohle ist tot. Die Zahlen sagen was anderes." |
| **Vergleich** | A vs B, schneller Schnitt | "BHP vs Rio Tinto — wer zahlt mehr Dividende?" |
| **Listicle** | Top 3/5 mit Countdown | "3 Aktien mit über 10% Dividende" |
| **News-React** | Breaking + Einordnung | "Dividende gestrichen! Was jetzt?" |
| **Erklärer** | Komplexes simpel in 45s | "Was ist AISC? In 45 Sekunden erklärt." |

**Für jeden Short-Kandidaten wird geliefert:**
1. **Hook-Text** (die ersten 3 Sekunden — entscheidet über Retention)
2. **Skript** (Wort-für-Wort, mit Zeitmarken)
3. **Schnitt-Anweisungen** (Cuts, Zooms, Text-Overlays, Sequenz-Wechsel)
4. **Thumbnail-Prompt** (Midjourney/DALL-E: Gesicht + Zahl + Emotion)
5. **Caption/Untertitel** (für TikTok/Reels-Format)
6. **Relevanz-Score** (1–10: wie viral-tauglich ist dieser Clip?)

**Ranking-Kriterien für Short-Auswahl:**
- Hook-Stärke (provokant genug für 3s-Entscheidung?)
- Eigenständigkeit (verständlich ohne Longvideo?)
- Zahlen-Dichte (Shorts mit konkreten Zahlen performen besser)
- Emotions-Trigger (Angst, Gier, Überraschung, Neugier)
- CTA-Passung (leitet zum Longvideo weiter?)

---

#### Modus B: Longvideo-Produktion (Schnittplan + Dynamik)

**Input**: YT-Skript (aus Phase 2) oder rohes Skript von Marco
**Output**: Vollständiger Schnittplan mit Spannungsbogen, dynamischen Sequenzen, Templates, Hooks und B-Roll — production-ready

**Ziel**: Jedes Longvideo soll sich anfühlen wie eine Netflix-Doku über Finanzen — nicht wie ein statischer Talking-Head-Monolog.

---

##### Longvideo-Templates (Video-Strukturen)

Jedes Longvideo folgt einem Template, das den Spannungsbogen vorgibt:

| Template | Struktur | Dauer | Wann verwenden |
|---|---|---|---|
| **Deep-Dive Analyse** | Cold Open → Intro → 4-5 Kapitel → Fazit → CTA | 12-20 Min | Einzelaktien-Analyse (Barrick, BHP, Equinor) |
| **Vergleich (A vs B)** | Cold Open → Vorstellung A → Vorstellung B → Head-to-Head → Gewinner → CTA | 10-15 Min | BHP vs Rio Tinto, Enbridge vs TC Energy |
| **Top-Liste** | Cold Open → Countdown (5→1) mit steigender Intensität → Bonus-Pick → CTA | 8-12 Min | Top 5 Dividenden-Aktien, Beste Mining-Aktien |
| **Sektor-Überblick** | Cold Open → Makro-Kontext → 3-4 Sub-Sektoren → Favoriten → CTA | 15-25 Min | Shipping 2026, Mining-Superzyklus |
| **News/Reaktion** | Schock-Opener → Was ist passiert → Einordnung → Was tun → CTA | 5-10 Min | Dividenden-Cut, Crash, Übernahme |
| **Wochenrückblick** | Teaser der Highlights → Makro → Rohstoffe → Shipping → Aktien → Ausblick → CTA | 10-18 Min | Sonntags-Rückblick |
| **Erklärer/Guide** | Problem → Warum wichtig → Schritt-für-Schritt → Praxis-Beispiel → CTA | 8-15 Min | Was ist AISC?, Dividendenstrategie, YOC erklärt |

---

##### Spannungsbogen (Retention-Architektur)

Jedes Longvideo hat einen bewussten Spannungsbogen, der die Zuschauer hält:

```
ENERGIE
  ▲
  │   ██                              ██
  │   ██  ░░░░                    ████████
  │   ██  ░░░░  ░░░░          ████████████
  │   ██  ░░░░  ░░░░  ██   ██████████████
  │   ██  ░░░░  ░░░░  ██  ███████████████  ██
  │───██──░░░░──░░░░──██──███████████████──██──→
  │  Cold  Intro  K1   K2    K3    Fazit  CTA
  │  Open              ↑          ↑
  │              Mid-Hook    Climax
  └──────────────────────────────────────────→ ZEIT
```

**Pflicht-Hooks im Longvideo:**

| Hook-Typ | Platzierung | Zweck | Beispiel |
|---|---|---|---|
| **Cold Open** | 0:00-0:15 | Sofort fesseln, beste Stelle vorziehen | "Diese Aktie zahlt 15% Dividende — und niemand redet drüber." |
| **Pattern Interrupt** | Alle 2-3 Min | Aufmerksamkeit zurückholen | Sequenzwechsel, Soundeffekt, Zoom, Frage an Zuschauer |
| **Open Loop** | Ende Kapitel 1-2 | Vorwärts-Tease: "Gleich zeig ich euch..." | "Aber das Beste kommt noch — die Dividenden-Prognose." |
| **Mid-Hook** | ~50% des Videos | Größter Wow-Moment, verhindert Absprung | Schock-Zahl, kontroverses Statement, überraschendes Ergebnis |
| **Micro-CTAs** | Alle 4-5 Min | Engagement triggern | "Schreibt in die Kommentare: Würdet ihr kaufen?" |
| **Climax** | ~80% des Videos | Fazit/Ergebnis mit maximaler Energie | Das finale Urteil, die Empfehlung, der Gewinner |
| **End-CTA** | Letzte 20s | Abo, Like, nächstes Video | "Wenn euch das gefallen hat — Abo da lassen!" |

---

##### Sequenz-Types (Visuelle Bausteine)

| Sequenz | Dauer | Beschreibung | Wann einsetzen | Energie-Level |
|---|---|---|---|---|
| **Cold Open** | 5-15s | Bester Moment des Videos vorweggezogen | IMMER am Anfang | 🔴 Hoch |
| **Talking Head** | 10-30s | Marco spricht in Kamera, Brustbild | Standard-Delivery | 🟡 Mittel |
| **Talking Head + Gestikulieren** | 10-30s | Marco mit aktiver Körpersprache, näher | Begeisterung, Warnung | 🔴 Hoch |
| **Screenshare** | 10-30s | Chart, Tabelle, Website, Finanzportal | Kennzahlen, Kursverläufe, Beweise | 🟡 Mittel |
| **Screenshare + Voice-Over** | 15-45s | Marco erklärt über dem Chart | Detaillierte Daten-Analyse | 🟢 Ruhig |
| **Infografik** | 5-15s | Animierte Grafik mit Zahlen (Balken, Kreise, Timelines) | Vergleiche, Rankings, Entwicklungen | 🟡 Mittel |
| **B-Roll Stock** | 3-8s | Stock-Footage (Schiffe, Minen, Pipelines, Börse) | Sektor-Übergänge, Stimmung setzen | 🟢 Ruhig |
| **B-Roll + Voice-Over** | 8-20s | Stock-Footage mit Marco-Kommentar drüber | Sektor-Einführung, Atmosphäre | 🟢 Ruhig |
| **Text-Overlay Fullscreen** | 3-5s | Große Zahl/Fakt allein auf Screen | Schock-Zahlen, Key-Facts, Kapitel-Opener | 🔴 Hoch |
| **Split-Screen** | 10-20s | Zwei Werte/Charts/Aktien nebeneinander | Vergleichs-Analysen (A vs B) | 🟡 Mittel |
| **Zoom-In (Slow)** | 2-3s | Langsamer Zoom auf Marcos Gesicht | Betonung, wichtige Aussage, "Achtung!" | 🔴 Hoch |
| **Zoom-Out (Reveal)** | 2-3s | Von Detail auf Gesamtbild | Kontext-Wechsel, big-picture Moment | 🟡 Mittel |
| **Jump-Cut Montage** | 5-15s | Schnelle Schnitte, 3-5 Aussagen hintereinander | Tempo, Energie, Aufzählungen | 🔴 Hoch |
| **Whip-Pan / Swipe** | 1-2s | Schneller Schwenk als Übergang | Kapitel-Wechsel, Themenwechsel | 🔴 Hoch |
| **Picture-in-Picture** | 10-30s | Marco klein in Ecke, Chart/Grafik groß | Daten erklären + Persönlichkeit behalten | 🟡 Mittel |
| **Bullet-Point Animation** | 10-20s | Punkte erscheinen nacheinander auf Screen | Zusammenfassungen, Pro/Contra-Listen | 🟡 Mittel |
| **Lower-Third** | dauerhaft | Name + Titel-Einblendung | Intro, nach jedem Kapitelwechsel | — |
| **Progress-Bar / Kapitel-Marker** | dauerhaft | Visuelle Fortschrittsanzeige | Optional, für Struktur | — |
| **Sound-Design** | 0.5-2s | Whoosh, Pop, Ding bei Übergängen/Zahlen | Pattern Interrupts, Betonung | 🔴 Hoch |
| **Endscreen** | 15-20s | Abo + nächstes Video + Social Links + Kompass | IMMER am Ende | 🟡 Mittel |

---

##### Dynamik-Regeln (Tempo & Energie-Management)

**Das Video darf NIE einschlafen.** Diese Regeln stellen sicher, dass die Energie stimmt:

1. **Max. 15 Sekunden gleiche Sequenz** — danach MUSS ein visueller Wechsel kommen (Cut, Overlay, Zoom, B-Roll)
2. **Sequenz-Sandwich**: Nie zwei gleiche Sequenzen hintereinander. Schema: Talking Head → Screenshare → Talking Head → B-Roll → Talking Head → Infografik
3. **Energie-Welle**: Abwechselnd 🔴 Hoch → 🟢 Ruhig → 🔴 Hoch. Nie länger als 60s auf gleicher Energie
4. **Kapitel-Opener immer 🔴**: Jedes neue Kapitel startet mit Text-Overlay oder Zoom-In oder Jump-Cut (nie sanft!)
5. **Daten = Screenshare/Infografik**: Kennzahlen NIEMALS nur verbal — IMMER visuell unterstützen
6. **B-Roll bei Sektorwechsel**: Wenn der Sektor wechselt → 3-8s B-Roll als Brücke
7. **Sound-Design bei Zahlen**: Jede Key-Zahl bekommt einen Sound-Akzent (Pop, Ding, Whoosh)
8. **Engagement-Trigger alle 4-5 Min**: Frage an Zuschauer, Kommentar-CTA, Umfrage-Verweis, Community-Tab

**Beispiel Dynamik-Flow (5 Minuten Ausschnitt):**
```
00:00 🔴 Text-Overlay: "KAPITEL 3: DIVIDENDEN" (3s, Sound: Whoosh)
00:03 🟡 Talking Head: Marco erklärt Dividenden-Politik (12s)
00:15 🔴 Zoom-In: "Und jetzt wird's spannend..." (2s)
00:17 🟡 Screenshare: Dividenden-Chart 2018-2026 (15s, Voice-Over)
00:32 🔴 Text-Overlay: "15,3% YIELD" (3s, Sound: Ding)
00:35 🟡 Talking Head: Marco bewertet (10s)
00:45 🟢 B-Roll: Goldmine aerial + Voice-Over (8s)
00:53 🔴 Jump-Cut Montage: "Stabil. Wachsend. Sicher." (5s)
00:58 🟡 PiP: Marco klein, YOC-Rechnung groß (20s)
01:18 🔴 Split-Screen: YOC heute vs YOC in 5 Jahren (12s)
01:30 🟢 Talking Head: Risiken besprechen (15s)
01:45 🔴 Bullet-Points: 3 Risiken nacheinander einblenden (10s)
01:55 🟡 Screenshare: Payout-Ratio-Tabelle (12s)
02:07 🔴 Zoom-In: "Aber hier ist der Clou..." (Open Loop!) (3s)
02:10 🟡 Talking Head: Einordnung (15s)
02:25 🔴 Text-Overlay: Micro-CTA "Würdet ihr kaufen? → Kommentare!" (5s)
...
```

---

##### Longvideo Schnittplan-Format (pro Kapitel)

```
## Kapitel 2: Dividenden-Historie (02:15 - 04:30)
Kernaussage: "Barrick Gold hat 10 Jahre am Stück Dividende gezahlt — trotz Goldpreis-Crash"
Energie-Profil: 🔴 Start → 🟡 Mitte → 🔴 Climax → 🟢 Übergang

| Timecode | Sequenz | Inhalt | Sound | Energie | Notiz |
|---|---|---|---|---|---|
| 02:15-02:18 | Text-Overlay | "10 JAHRE DIVIDENDE" (groß, gold) | Whoosh | 🔴 | Kapitel-Opener, Fade-In |
| 02:18-02:20 | Zoom-In | Marco: Staunen-Gesicht | — | 🔴 | Pattern Interrupt |
| 02:20-02:35 | Talking Head | Marco erklärt Historie | — | 🟡 | Brustbild, normal |
| 02:35-02:38 | B-Roll | Goldbarren / Tresor | — | 🟢 | Visueller Wechsel |
| 02:38-02:55 | Screenshare | Dividenden-Chart 2015-2026 | — | 🟡 | Langsamer Zoom auf Anstieg |
| 02:55-02:58 | Text-Overlay | "15,3%" (fullscreen, gold) | Ding! | 🔴 | Key-Zahl hervorheben |
| 02:58-03:05 | Zoom-In | Marco: "Und das Beste..." | — | 🔴 | Open Loop! |
| 03:05-03:25 | PiP | Marco klein, YOC-Rechnung groß | — | 🟡 | Zahlen nacheinander einblenden |
| 03:25-03:30 | B-Roll | Goldmine aerial shot | — | 🟢 | Übergang zum nächsten Punkt |
| 03:30-03:45 | Jump-Cut Montage | "Stabil. Wachsend. Nachhaltig." (3 Cuts) | Pop, Pop, Pop | 🔴 | Tempo-Boost! |
| 03:45-04:15 | Talking Head + Lower-Third | Bewertung + Fazit Dividenden | — | 🟡 | Ruhig, überzeugend |
| 04:15-04:25 | Bullet-Points | 3 Key-Takeaways einblenden | — | 🟡 | Zusammenfassung |
| 04:25-04:30 | Whip-Pan | Transition zum nächsten Kapitel | Swipe-Sound | 🔴 | Sauberer Übergang |
```

---

##### Longvideo Cold Open Templates

Der Cold Open entscheidet ob der Zuschauer bleibt. 6 Templates:

| Template | Struktur | Beispiel |
|---|---|---|
| **Schock-Zahl** | Zahl fullscreen (3s) → Marco reagiert (5s) → "In diesem Video..." (5s) | "15% Dividende." [Beat] Marco: "Und das ist kein Scam." |
| **Kontroverses Statement** | Marco-Aussage (5s) → Gegenbeweis-Montage (5s) → "Lasst mich erklären." (3s) | "Kohle-Aktien sind die beste Dividenden-Quelle 2026." |
| **Zukunfts-Tease** | Ergebnis vorwegnehmen (5s) → "Aber erstmal von vorne..." (3s) | "Am Ende dieses Videos wirst du wissen, welche Aktie 20% Rendite bringt." |
| **Frage** | Frage an Kamera (5s) → Kurze Montage (5s) → "Finden wir's raus." (3s) | "Was passiert, wenn der Ölpreis auf 100$ steigt?" |
| **News-Hook** | Breaking-Graphic (3s) → Marco reagiert (5s) → Einordnung (5s) | [Ticker-Animation] "BHP kürzt die Dividende — was bedeutet das?" |
| **Countdown-Tease** | "Heute: 5 Aktien über 10%" (3s) → Quick-Montage aller 5 (7s) → "Los geht's" (3s) | Schnelle Logos/Charts aller Picks, dann deep dive |

---

##### B-Roll-Bibliothek (Standard-Keywords pro Sektor)

| Sektor | Stock-Footage Keywords |
|---|---|
| Mining | Open pit mine, gold bars, excavator, mineral processing, aerial mine, conveyor belt, smelting, drill core |
| Shipping | Container ship, tanker, port loading, ocean aerial, LNG carrier, dry dock, crane loading, canal transit |
| Pipeline/Midstream | Pipeline aerial, gas plant, refinery, storage tanks, compressor station, pipeline welding |
| Upstream Oil & Gas | Oil rig, offshore platform, drilling, oil field, pumpjack, fracking, flare stack |
| Dividenden/Finanzen | Stock market, trading floor, cash counting, growth chart, bank vault, coins, calculator |
| Makro/News | Central bank, press conference, city skyline, breaking news, parliament, inflation chart |
| Allgemein/Übergänge | Globe spinning, compass, clock, calendar, sunrise, city timelapse, ocean waves |

##### Sound-Design Bibliothek

| Sound | Einsatz | Häufigkeit |
|---|---|---|
| **Whoosh** | Kapitel-Opener, Swipe-Transitions | Jeder Kapitelwechsel |
| **Ding / Pop** | Key-Zahlen erscheinen, Bullet-Points | Bei jeder wichtigen Zahl |
| **Bass Drop (subtil)** | Schock-Momente, dramatische Aussagen | Max. 2-3x pro Video |
| **Aufsteigende Tonfolge** | Positive Entwicklung, steigende Charts | Rankings, Countdown |
| **Ticker-Sound** | Zahlen zählen hoch/runter | Rendite-Berechnungen |
| **Ambient Pad** | Hintergrund bei Screenshares, B-Roll | Durchgehend leise |
| **Click / Snap** | Jump-Cuts, schnelle Wechsel | Jump-Cut Montagen |

---

#### Modus B+: Chart-Design & Daten-Visualisierung

**Keine Standard-Charts.** Jeder Chart und jede Grafik im Video muss zum MB Capital Strategies Brand passen: Dark Theme + Gold.

**Chart-Styleguide:**

```
Hintergrund:     #0f1115 (near-black) oder #151821 (soft dark)
Primär-Farbe:    #d4af37 (Gold) — Hauptlinie, Balken, Highlights
Sekundär:        #e0bd55 (Bright Gold) — Vergleichslinie, Hover
Positiv:         #00c853 (Grün) — Kursanstieg, Dividenden-Wachstum
Negativ:         #ff5252 (Rot) — Kursverfall, Risiken, Cuts
Neutral:         #9aa6c0 (Muted Blue) — Durchschnitt, Benchmark
Grid/Achsen:     rgba(255,255,255,0.08) — Fast unsichtbar, clean
Text/Labels:     #f5f6fa (Near-White) — Montserrat, sauber
```

**Chart-Typen und wann sie eingesetzt werden:**

| Chart-Typ | Einsatz | Design-Regel |
|---|---|---|
| **Linien-Chart** | Kursverläufe, Dividenden-Historie, Rohstoffpreise | Gold-Linie auf dunklem Grund, Fläche darunter leicht gold-transparent |
| **Balken-Chart** | Vergleiche (Dividendenrendite, AISC, KGV) | Gold-Balken, dezente Schatten, Werte über den Balken |
| **Donut/Pie** | Portfolioverteilung, Sektor-Mix, Payout-Ratio | Gold-Gradient, Segmente mit Glow-Effekt |
| **Split-Vergleich** | A vs B (Aktien, Sektoren, Kennzahlen) | Links Gold, Rechts Silber/Weiß, klare Trennung |
| **Wasserfall** | FCF-Bridge, Kosten-Aufschlüsselung, AISC-Berechnung | Grün (positiv), Rot (negativ), Gold (Total) |
| **Gauge/Tacho** | Bewertungs-Score, Risiko-Level, Payout-Ratio | Kompass-inspiriertes Design, Nadel zeigt auf Wert |
| **Timeline** | Dividenden-Geschichte, Superzyklus-Phasen | Horizontale Linie mit Gold-Dots, animiert |
| **Heatmap** | Sektor-Performance, Korrelationen | Rot→Gold→Grün Gradient |

##### Chart-Erstellung: Python (matplotlib + plotly)

**Primär-Tool**: Python mit matplotlib/plotly — generiert Charts direkt im MB Capital Strategies Branding als PNG/SVG (für Thumbnails, Infografiken) oder als MP4 (für Video-Einbindung).

**matplotlib MB Capital Theme (wiederverwendbar):**
```python
import matplotlib.pyplot as plt
import matplotlib as mpl

# MB Capital Strategies Theme
MBCS_THEME = {
    'bg': '#0f1115',
    'bg_soft': '#151821',
    'gold': '#d4af37',
    'gold_bright': '#e0bd55',
    'green': '#00c853',
    'red': '#ff5252',
    'text': '#f5f6fa',
    'text_muted': '#9aa6c0',
    'grid': 'rgba(255,255,255,0.08)',
}

def apply_mbcs_style():
    """Wendet MB Capital Strategies Dark+Gold Theme auf alle Charts an."""
    plt.rcParams.update({
        'figure.facecolor': MBCS_THEME['bg'],
        'axes.facecolor': MBCS_THEME['bg'],
        'axes.edgecolor': MBCS_THEME['text_muted'],
        'axes.labelcolor': MBCS_THEME['text'],
        'text.color': MBCS_THEME['text'],
        'xtick.color': MBCS_THEME['text_muted'],
        'ytick.color': MBCS_THEME['text_muted'],
        'grid.color': '#ffffff14',
        'grid.alpha': 0.08,
        'font.family': 'Montserrat',
        'font.size': 14,
        'figure.figsize': (19.2, 10.8),  # 1920x1080
        'figure.dpi': 100,
        'savefig.facecolor': MBCS_THEME['bg'],
        'savefig.edgecolor': 'none',
        'savefig.bbox': 'tight',
        'savefig.pad_inches': 0.5,
    })

# Beispiel: Dividenden-Verlauf Chart
apply_mbcs_style()
years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
dividends = [0.80, 1.00, 0.60, 1.50, 2.00, 1.80, 2.20, 2.50, 2.80]

fig, ax = plt.subplots()
ax.fill_between(years, dividends, alpha=0.15, color=MBCS_THEME['gold'])
ax.plot(years, dividends, color=MBCS_THEME['gold'], linewidth=3, marker='o', markersize=8)
ax.set_title('Barrick Gold — Dividende pro Aktie (USD)', fontsize=22, fontweight='bold', color=MBCS_THEME['gold'])
ax.set_xlabel('Jahr')
ax.set_ylabel('Dividende (USD)')
ax.grid(True, alpha=0.08)
# Key-Zahl hervorheben
ax.annotate('$2.80', xy=(2026, 2.80), fontsize=28, fontweight='bold',
            color=MBCS_THEME['gold_bright'], ha='center',
            xytext=(0, 20), textcoords='offset points')
plt.savefig('chart-dividenden.png')
```

**plotly (für interaktive Charts / animierte Exports):**
```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Bar(
    x=['BHP', 'Rio Tinto', 'Vale', 'Glencore', 'Barrick'],
    y=[7.2, 5.8, 12.1, 8.5, 3.2],
    marker_color=['#d4af37', '#d4af37', '#e0bd55', '#d4af37', '#d4af37'],
    text=['7.2%', '5.8%', '12.1%', '8.5%', '3.2%'],
    textposition='outside', textfont=dict(size=18, color='#f5f6fa')
))
fig.update_layout(
    title=dict(text='Dividendenrendite Mining-Aktien 2026', font=dict(size=26, color='#d4af37')),
    paper_bgcolor='#0f1115', plot_bgcolor='#0f1115',
    font=dict(family='Montserrat', color='#f5f6fa'),
    xaxis=dict(gridcolor='rgba(255,255,255,0.08)'),
    yaxis=dict(gridcolor='rgba(255,255,255,0.08)', title='Rendite (%)'),
    width=1920, height=1080
)
fig.write_image('chart-mining-yields.png')
# Animiert als HTML (für Screenshare):
fig.write_html('chart-mining-yields.html')
```

**Chart-Typen mit Code-Mustern:**

| Chart | Python-Tool | Ausgabe | Video-Einbindung |
|---|---|---|---|
| Linien (Kursverläufe) | `matplotlib` plot + fill_between | PNG 1920x1080 | Als Screenshare oder PiP-Overlay |
| Balken (Vergleiche) | `plotly` Bar | PNG oder animiertes HTML | Screenshare mit Zoom |
| Donut (Portfolioverteilung) | `matplotlib` pie + wedgeprops | PNG (transparent) | Als Overlay auf Talking Head |
| Split-Vergleich (A vs B) | `matplotlib` subplots (2 nebeneinander) | PNG 1920x1080 | Split-Screen Sequenz |
| Wasserfall (FCF-Bridge) | `plotly` Waterfall | PNG | Screenshare, animiert einblenden |
| Gauge/Tacho | `plotly` Indicator | PNG | Fullscreen 3-5s |
| Timeline | `matplotlib` scatter + annotate | PNG | Screenshare mit horizontalem Scroll |
| Heatmap | `plotly` Heatmap | PNG | Screenshare |

##### Visual-Assets erstellen: HTML-Templates (Screenshot → Video)

Für aufwändige Grafiken die über Charts hinausgehen — Metric-Cards, Vergleichstabellen, Scorecards — können **HTML-Templates** im MB Capital Brand erstellt und per Screenshot (Puppeteer/Playwright) als Bild exportiert werden:

```html
<!-- Kennzahlen-Card für Video-Overlay (1920x1080) -->
<div style="width:1920px;height:1080px;background:#0f1115;display:flex;align-items:center;justify-content:center;gap:40px;padding:60px;font-family:Montserrat">
  <div style="background:#1a1f2b;border:1px solid rgba(212,175,55,0.22);border-radius:16px;padding:40px;text-align:center;min-width:280px">
    <div style="color:#d4af37;font-size:56px;font-weight:800">15.3%</div>
    <div style="color:#9aa6c0;font-size:20px;margin-top:8px">Dividendenrendite</div>
  </div>
  <div style="background:#1a1f2b;border:1px solid rgba(212,175,55,0.22);border-radius:16px;padding:40px;text-align:center;min-width:280px">
    <div style="color:#00c853;font-size:56px;font-weight:800">42%</div>
    <div style="color:#9aa6c0;font-size:20px;margin-top:8px">Payout Ratio</div>
  </div>
  <div style="background:#1a1f2b;border:1px solid rgba(212,175,55,0.22);border-radius:16px;padding:40px;text-align:center;min-width:280px">
    <div style="color:#e0bd55;font-size:56px;font-weight:800">4.2x</div>
    <div style="color:#9aa6c0;font-size:20px;margin-top:8px">EV/EBITDA</div>
  </div>
  <div style="background:#1a1f2b;border:1px solid rgba(212,175,55,0.22);border-radius:16px;padding:40px;text-align:center;min-width:280px">
    <div style="color:#ff5252;font-size:56px;font-weight:800">1.8x</div>
    <div style="color:#9aa6c0;font-size:20px;margin-top:8px">Debt/EBITDA</div>
  </div>
</div>
```

**Screenshot-Export:**
```bash
# Mit Puppeteer (Node.js)
npx puppeteer screenshot metrics-card.html --width 1920 --height 1080 --output metrics.png

# Mit Playwright (Python)
python -c "
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('file:///path/to/metrics-card.html')
    page.screenshot(path='metrics.png')
    browser.close()
"
```

##### Visuals ins Video einbinden: Sequenz-Assembly Pipeline

So werden Charts, Grafiken und Visuals konkret ins Video eingebunden:

**Schritt 1: Assets generieren**
```bash
# Charts mit Python erstellen
python generate_charts.py --ticker GOLD --output ./assets/
# → assets/chart-dividenden.png, assets/chart-yield-comparison.png, assets/metrics-card.png
```

**Schritt 2: Statische Bilder → Video-Clips (mit Dauer + Animationen)**
```bash
# Bild → 5s Video-Clip (mit Zoom-In Effekt)
ffmpeg -loop 1 -i chart-dividenden.png -c:v libx264 -t 5 \
  -vf "scale=2160:1216,zoompan=z='min(zoom+0.001,1.15)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080" \
  -pix_fmt yuv420p chart-dividenden-zoom.mp4

# Bild → 4s Video-Clip (statisch, Fade-In)
ffmpeg -loop 1 -i metrics-card.png -c:v libx264 -t 4 \
  -vf "scale=1920:1080,fade=t=in:st=0:d=0.5" \
  -pix_fmt yuv420p metrics-fadein.mp4

# Bild → 6s Video-Clip (Pan von links nach rechts)
ffmpeg -loop 1 -i chart-timeline.png -c:v libx264 -t 6 \
  -vf "scale=2880:1080,crop=1920:1080:x='(in_w-out_w)*t/6':y=0" \
  -pix_fmt yuv420p timeline-pan.mp4
```

**Schritt 3: Text-Overlays / Zahlen-Einblendungen erzeugen**
```bash
# Große Gold-Zahl auf dunklem Hintergrund (Fullscreen, 3s)
ffmpeg -f lavfi -i "color=c=#0f1115:s=1920x1080:d=3" \
  -vf "drawtext=text='15.3%% YIELD':fontcolor=#d4af37:fontsize=120:fontfile=Montserrat-Bold.ttf:\
  x=(w-text_w)/2:y=(h-text_h)/2,fade=t=in:st=0:d=0.3,fade=t=out:st=2.5:d=0.5" \
  -c:v libx264 -pix_fmt yuv420p text-yield.mp4

# Animierter Zähler (0% → 15.3% in 3 Sekunden)
ffmpeg -f lavfi -i "color=c=#0f1115:s=1920x1080:d=3" \
  -vf "drawtext=text='%{eif\\:15.3*t/3\\:d\\:0}.%{eif\\:mod(153*t/3\\,10)\\:d\\:0}%%':\
  fontcolor=#d4af37:fontsize=140:fontfile=Montserrat-Bold.ttf:\
  x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -pix_fmt yuv420p counter-yield.mp4

# Lower-Third (Name + Titel, 5s mit Ein/Ausblendung)
ffmpeg -f lavfi -i "color=c=#0f1115@0.7:s=600x80:d=5" \
  -vf "drawtext=text='Marco Bozem':fontcolor=#d4af37:fontsize=28:fontfile=Montserrat-Bold.ttf:x=20:y=10,\
  drawtext=text='MB Capital Strategies':fontcolor=#9aa6c0:fontsize=18:fontfile=Montserrat-Regular.ttf:x=20:y=48,\
  fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5" \
  -c:v libx264 -pix_fmt yuv420p lower-third.mp4
```

**Schritt 4: Alles zusammenfügen (Sequenz-Assembly)**
```bash
# Filelist erstellen (Reihenfolge = Schnittplan)
cat > filelist.txt << 'EOF'
file 'cold-open.mp4'
file 'intro-talking-head.mp4'
file 'text-yield.mp4'
file 'chart-dividenden-zoom.mp4'
file 'talking-head-analyse.mp4'
file 'metrics-fadein.mp4'
file 'broll-goldmine.mp4'
file 'talking-head-fazit.mp4'
file 'counter-yield.mp4'
file 'endscreen.mp4'
EOF

# Zusammenfügen (alle Clips müssen gleiche Auflösung/Codec haben)
ffmpeg -f concat -safe 0 -i filelist.txt -c copy assembled.mp4

# Falls unterschiedliche Formate: Re-encode
ffmpeg -f concat -safe 0 -i filelist.txt \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -r 30 -s 1920x1080 \
  assembled.mp4
```

**Schritt 5: Chart/Visual als Overlay auf Talking Head (PiP)**
```bash
# Chart als Picture-in-Picture (Marco links klein, Chart rechts groß)
ffmpeg -i talking-head.mp4 -i chart-dividenden.png \
  -filter_complex "[1:v]scale=1200:675[chart];\
  [0:v]scale=640:360[marco];\
  [chart][marco]overlay=x=10:y=H-h-10[out]" \
  -map "[out]" -map 0:a -c:v libx264 -c:a copy pip-output.mp4

# Overlay: Transparentes Metrik-Card über Talking Head
ffmpeg -i talking-head.mp4 -i metrics-card-transparent.png \
  -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.85[overlay];\
  [0:v][overlay]overlay=x=(W-w)/2:y=H-h-50:enable='between(t,5,10)'[out]" \
  -map "[out]" -map 0:a pip-metrics.mp4
```

**Kompletter Workflow (1 Befehl):**
```bash
# generate-video-assets.sh — Generiert alle Visuals für ein Video
#!/bin/bash
TICKER=$1  # z.B. "GOLD" oder "BHP"

echo "📊 Charts generieren..."
python generate_charts.py --ticker $TICKER --output ./assets/$TICKER/

echo "🎬 Video-Clips aus Charts..."
for img in ./assets/$TICKER/*.png; do
  name=$(basename "$img" .png)
  ffmpeg -loop 1 -i "$img" -c:v libx264 -t 5 \
    -vf "scale=1920:1080,fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5" \
    -pix_fmt yuv420p "./clips/$TICKER/${name}.mp4" -y
done

echo "📝 Text-Overlays..."
# (Generiert aus Schnittplan-Daten)

echo "🔗 Sequenz-Assembly..."
ffmpeg -f concat -safe 0 -i ./clips/$TICKER/filelist.txt \
  -c:v libx264 -preset fast -crf 18 "./output/${TICKER}-assembled.mp4"

echo "🎨 Color Grade..."
ffmpeg -i "./output/${TICKER}-assembled.mp4" -vf "
  eq=contrast=1.1:brightness=-0.02:saturation=0.9:gamma=1.05,
  curves=r='0/0 0.25/0.22 0.5/0.5 0.75/0.78 1/1':b='0/0 0.5/0.45 1/0.95',
  unsharp=5:5:0.5,vignette=PI/5
" -c:a copy "./output/${TICKER}-final.mp4"

echo "✅ Fertig: ./output/${TICKER}-final.mp4"
```

**Screenshare-Regeln:**
1. **Nie den rohen Bildschirm zeigen** — immer mit Rahmen/Overlay (dunkler Rand, Logo unten rechts)
2. **Zoom auf relevante Daten** — nie den ganzen Screen, sondern auf die Key-Zahl zoomen
3. **Highlights**: Relevante Zahlen mit Gold-Circle oder Gold-Unterstreichung markieren
4. **Cursor-Bewegung**: Langsam, bewusst, keine hektischen Mausbewegungen
5. **Browser-Tabs**: Aufräumen! Nur relevante Tabs sichtbar
6. **Charts IMMER im Brand** — Python-generiert oder HTML-Template, niemals Standard-Excel

---

#### Modus B++: Color Grading & Visual Polish

**Jedes Video wird visuell optimiert** — nicht einfach raw aus der Kamera. MB Capital Strategies hat einen cinematic, premium Look.

**Color-Grading-Profil (Marcos Look):**

```
Schatten:        Leicht angehoben (nicht crushed-black, sondern #0f1115-Niveau)
Mitteltöne:      Neutral bis leicht warm (Hautfarbe natürlich, nicht orange)
Highlights:      Warm-Gold Tint (passend zu Brand-Gold #d4af37)
Kontrast:        Mittel-Hoch (premium, aber nicht harsh)
Sättigung:       Leicht reduziert (-10-15%), Gold-Töne selektiv boosten
Schärfe:         Leicht erhöht für Details (Gesicht, Text, Charts)
Vignette:        Subtil (-15%), zieht Fokus auf Mitte/Gesicht
```

**ffmpeg Color Grading (Basic):**
```bash
# Cinematic Dark-Gold Look
ffmpeg -i input.mp4 -vf "
  eq=contrast=1.1:brightness=-0.02:saturation=0.9:gamma=1.05,
  curves=r='0/0 0.25/0.22 0.5/0.5 0.75/0.78 1/1':g='0/0 0.5/0.48 1/1':b='0/0 0.5/0.45 1/0.95',
  unsharp=5:5:0.5:5:5:0.0,
  vignette=PI/5
" -c:a copy output-graded.mp4

# Nur Farbtemperatur wärmer (Gold-Tint)
ffmpeg -i input.mp4 -vf "colortemperature=temperature=6800" -c:a copy output-warm.mp4
```

**LUT-Empfehlungen (für DaVinci Resolve / Premiere):**

| LUT | Stil | Passt zu |
|---|---|---|
| **Cinematic Gold** (custom) | Warme Highlights, dunkle Schatten, Gold-Push | Standard für alle Videos |
| **Film Noir Light** | Hoher Kontrast, desaturiert, dramatisch | News-Reaktionen, Crash-Videos |
| **Clean Corporate** | Neutral, scharf, professionell | Screenshare-heavy Videos, Guides |

**Visual-Polish-Checkliste (vor Export):**

| Check | Beschreibung |
|---|---|
| ✅ Color Grade | Cinematic Dark-Gold Look angewendet |
| ✅ Weißabgleich | Konsistent über alle Clips (kein Farbsprung bei Cuts) |
| ✅ Belichtung | Marcos Gesicht gleichmäßig ausgeleuchtet, keine dunklen Stellen |
| ✅ Schärfe | Gesicht scharf, Hintergrund leicht weich (Tiefenunschärfe wenn möglich) |
| ✅ Audio-Level | -14 LUFS (YouTube Standard), keine Peaks über -1dB |
| ✅ Audio-EQ | Bass leicht boosten (Stimme voller), Höhen klar (Verständlichkeit) |
| ✅ De-Esser | Zischlaute reduziert |
| ✅ Noise Reduction | Hintergrundrauschen entfernt (Audio + Video) |
| ✅ Lower-Thirds | Korrekt platziert, Montserrat Font, Gold auf Dark |
| ✅ Endscreen | 15-20s, Abo-Button, nächstes Video, Kompass-Logo |
| ✅ Thumbnail | 2+ Varianten generiert |

**Audio-Optimierung mit ffmpeg:**
```bash
# Lautstärke normalisieren auf -14 LUFS (YouTube-Standard)
ffmpeg -i input.mp4 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:v copy output-normalized.mp4

# Noise Reduction (leichtes Rauschen entfernen)
ffmpeg -i input.mp4 -af "afftdn=nf=-25" -c:v copy output-denoised.mp4

# De-Esser (Zischlaute reduzieren)
ffmpeg -i input.mp4 -af "firequalizer=gain_entry='entry(4000,0);entry(6000,-4);entry(8000,-3)'" -c:v copy output-deessed.mp4

# Komplett: Denoise + Normalize + EQ (Bass boost, Clarity)
ffmpeg -i input.mp4 -af "
  afftdn=nf=-25,
  firequalizer=gain_entry='entry(80,2);entry(200,1);entry(3000,1.5);entry(6000,-2);entry(8000,-1)',
  loudnorm=I=-14:TP=-1:LRA=11
" -c:v copy output-polished.mp4
```

---

#### Modus C: Thumbnail-Generator (Nano Banana + DALL-E 3)

**Für jedes Video (Long + Short) werden Thumbnails generiert.**

**Primär-Tool: [Nano Banana](https://nanobanana.im/)**
- Spezialisiert auf YouTube-Thumbnails (trainiert auf Millionen hochperformante Thumbnails)
- Erhält Marcos Gesicht/Identität, verstärkt Gesichtsausdrücke (surprised, excited, shocked)
- Optimiert für CTR (Click-Through-Rate)
- Output: 4–8 Varianten pro Video

**Sekundär-Tool: DALL-E 3 (via ChatGPT)**
- Für aufwändigere Hintergründe, Szenen, kreative Composites
- Conversational Iteration: per Text beschreiben und verfeinern
- Gut für Split-Screens, Infografik-Thumbnails, abstrakte Konzepte

**Thumbnail-Prompt-Template (Nano Banana):**
```
Foto von Marco Bozem, [EMOTION], Blick in Kamera,
Text-Overlay: "[MAX 3-4 WÖRTER]",
Hintergrund: [SEKTOR-BEZOGEN],
Goldener Kompass-Icon unten rechts als Brand-Mark,
Stil: Dark Theme, Gold-Akzente, YouTube-Thumbnail, 1280x720
```

**Thumbnail-Prompt-Template (DALL-E 3 / ChatGPT):**
```
Create a YouTube thumbnail, 1280x720, cinematic:
- Left: Marco Bozem (man in striped shirt) with [EMOTION], looking at camera
- Right: Large text "[ZAHL/KEYWORD]" in gold on dark background
- Bottom-right corner: small golden compass icon (brand mark)
- Background: [SEKTOR-SZENE], slightly blurred
- Style: Professional, high contrast, dramatic lighting
- Colors: Dark (#0f1115) with gold (#d4af37) accents
```

**Beispiel-Prompts:**
- `Marco, shocked face, text "15% DIVIDENDE", gold mining background, golden compass bottom-right, dark theme`
- `Marco pointing at chart, text "BHP vs RIO", split screen, red/green arrows, compass brand mark`
- `Marco serious face, text "CRASH?", oil rig background, compass needle pointing down, dramatic lighting`

**Marcos Thumbnail-Styleguide (basierend auf bestehendem Stil):**

```
┌─────────────────────────────────────────┐
│                                         │
│  [Marco links]     [GROSSE ZAHL rechts] │
│  Brustbild         Gold/Gelb, fett      │
│  Emotion!          z.B. "15%"           │
│                                         │
│           [KEYWORD/FRAGE]               │
│           z.B. "CASHFLOW?"              │
│                                         │
│  [Sektor-Hintergrund: dunkel]    [Dauer]│
└─────────────────────────────────────────┘
```

**Brand-Elemente (IMMER verwenden):**
- **Marco Bozem** — Gesicht, gestreiftes Hemd, authentisch (Wiedererkennungswert)
- **Kompass** — MB Capital Strategies Brand-Symbol. Steht für Navigation durch die Finanzmärkte. Als Icon/Overlay in Ecke oder als subtiles Hintergrund-Element
- **Dunkler Hintergrund** (near-black, konsistent mit Website #0f1115)
- **Gold/Gelb-Akzente** (#d4af37) — Zahlen, Highlights, Kompass-Details
- **Große Zahlen** in Gold/Gelb (Dividendenrendite, Wachstum, Kursziel)
- **Sektor-Bilder** als Hintergrund (Ölfeld, Goldmine, Schiff, Pipeline, Raffinerie)
- **Trigger-Wörter** mit Fragezeichen: "ZU TEUER?", "RESET?", "CASHFLOW?", "FÄLLT"

**Kompass-Einsatz in Thumbnails:**

| Platzierung | Wann | Beispiel |
|---|---|---|
| Ecke unten-rechts (klein, 80x80px) | Standard bei jedem Thumbnail | Goldener Kompass als Wasserzeichen/Brand-Mark |
| Hintergrund (groß, transparent 10-15% Opacity) | Bei allgemeinen Themen (Wochenrückblick, Strategie) | Kompass als subtiles Overlay hinter Marco |
| Nadel zeigt auf Zahl/Keyword | Bei Empfehlungen / "Richtung" | Kompass-Nadel zeigt auf "15% YIELD" |
| Zentral (mittelgroß) | Bei Branding-Videos (Kanal-Trailer, Intro) | Kompass als Hauptelement |

**Thumbnail-Regeln:**
1. **Marco IMMER links**, Zahl IMMER rechts (Eye-Tracking-optimiert: Gesicht links fängt Blick, Zahl rechts hält ihn)
2. **Gesichtsausdruck betonen** — Nano Banana nutzen um Emotion zu verstärken (shocked bei Crash, excited bei hoher Rendite)
3. **Max. 3-4 Wörter Text** (muss auf Mobile lesbar sein — 50%+ der Views kommen vom Handy)
4. **Kontrast**: dunkler Hintergrund, helle/goldene Schrift (#d4af37 oder #e0bd55)
5. **Eine Zahl > keine Zahl** — Zahlen IMMER prominent (das ist dein Markenzeichen)
6. **Fragezeichen bei kontroversen Themen** — triggert Neugier ("ÖL 100$?", "RESET?")
7. **A/B-Test**: Immer 2+ Varianten generieren, beste per YouTube Analytics wählen
8. **Kein Kleingedrucktes** — Aktienname darf kleiner sein, aber Zahl + Keyword müssen GROSS sein

**Weitere Thumbnail-Tools (Alternativen):**

| Tool | Stärke | Preis |
|---|---|---|
| [Nano Banana](https://nanobanana.im/) | YouTube-spezialisiert, Gesichts-Erhaltung, CTR-optimiert | Kostenlos / Premium |
| [DALL-E 3](https://chatgpt.com/) (ChatGPT) | Kreative Hintergründe, Conversational | ChatGPT Plus |
| [Thumblr.io](https://thumblr.io/) | Schnell, günstig, 4-8 Varianten in <60s | $10–24/mo |
| [Midjourney](https://www.midjourney.com/) | Höchste Bildqualität für Hintergründe | Subscription |
| [Canva AI](https://www.canva.com/) | Templates + Quick-Edits, gut für Text-Overlays | Free / Pro |
| [Pikzels](https://pikzels.com/) | FaceSwap, YouTube-dedicated | $40–80/mo |

---

#### Modus D: Direkter Video-Schnitt (wenn technisch machbar)

Wenn eine Video-Datei vorhanden ist (MP4, MOV), kann der Agent **direkt schneiden** statt nur Pläne zu liefern:

**Voraussetzung**: `ffmpeg` installiert (Standard auf Linux/Mac, via `brew install ffmpeg` oder `apt install ffmpeg`)

**Fähigkeiten:**

| Aktion | Tool | Beschreibung |
|---|---|---|
| **Clip extrahieren** | `ffmpeg -ss HH:MM:SS -to HH:MM:SS -i input.mp4 -c copy clip.mp4` | Einzelne Clips aus Longvideo schneiden (verlustfrei) |
| **Shorts schneiden** | ffmpeg mit präzisen Timecodes | Short-Kandidaten direkt als MP4 exportieren |
| **Zusammenfügen** | `ffmpeg -f concat -i filelist.txt -c copy output.mp4` | Clips in Reihenfolge zusammenfügen |
| **Text-Overlays** | `ffmpeg -vf drawtext=` | Titel, Zahlen, CTAs als Text-Overlay einbrennen |
| **Aspect Ratio** | `ffmpeg -vf crop=ih*9/16:ih` | 16:9 → 9:16 für Shorts/Reels umwandeln |
| **Thumbnail** | `ffmpeg -ss HH:MM:SS -frames:v 1 thumb.jpg` | Frame als Thumbnail extrahieren |
| **Untertitel** | `ffmpeg -vf subtitles=subs.srt` | SRT-Untertitel einbrennen (für Shorts) |
| **Fade/Transition** | `ffmpeg -af afade -vf fade` | Audio/Video-Fades an Übergängen |
| **Speed Ramp** | `ffmpeg -filter:v setpts=0.5*PTS` | Tempo beschleunigen (Jump-Cuts, B-Roll) |

**Workflow bei verfügbarem Video:**

```
1. Marco liefert: Video-Datei + Skript (oder Transkript)
2. Agent erstellt Schnittplan mit exakten Timecodes
3. Marco bestätigt (oder Cowork-Modus)
4. Agent schneidet direkt:
   a) Longvideo: Intro trimmen, Pausen raus, B-Roll-Stellen markieren
   b) Shorts: 3-5 Clips extrahiert, 9:16 gecroppt, Untertitel eingebrannt
5. Output: Fertige MP4s + Thumbnail-JPGs
```

**Post-Production Pipeline (automatisch nach jedem Schnitt):**
```
1. Schnitt fertig → 2. Color Grade anwenden → 3. Audio normalisieren →
4. Lower-Thirds + Text-Overlays → 5. Sound-Design → 6. Export (1080p/4K)
```

**Limitierungen:**
- Kein Motion Graphics / After Effects (nur Text-Overlays, Fades, Crops, Color Grading)
- Keine B-Roll-Insertion (B-Roll muss separat bereitstehen, wird dann via concat eingefügt)
- Für aufwändige Edits: Schnittplan als EDL/XML für DaVinci/Premiere exportieren
- Complex Color Grading (LUTs, Power Windows): besser in DaVinci Resolve

**EDL-Export für Premiere/DaVinci:**
```
TITLE: [Video-Titel]
001  input.mp4  V  C  00:00:05:00 00:00:35:00 00:00:00:00 00:00:30:00
002  input.mp4  V  C  00:01:15:00 00:02:45:00 00:00:30:00 00:02:00:00
...
```

---

#### Modus E: Whisper-Transkription & Auto-Untertitel

**Input**: Video-Datei (MP4/MOV) von Marco
**Output**: Exakte Timestamps + gestylte Untertitel (SRT) + YouTube-Chapters

**Whisper AI für Transkription:**
```bash
# Transkript mit Timestamps generieren (Deutsch)
whisper input.mp4 --language de --model medium --output_format srt --output_dir ./subs/

# Höhere Genauigkeit (dauert länger)
whisper input.mp4 --language de --model large-v3 --output_format all --output_dir ./subs/
# → Erzeugt: input.srt, input.vtt, input.txt, input.json (mit Wort-Level-Timestamps)
```

**Untertitel stylen (Gold auf Dark, nicht YouTube-Standard):**
```bash
# SRT → Styled ASS (Advanced SubStation Alpha) für gebrandete Untertitel
# Montserrat Bold, Gold (#d4af37), schwarzer Outline, zentriert unten
cat > styled-subs.ass << 'ASSEOF'
[Script Info]
Title: MB Capital Strategies Subtitles
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: MBCS,Montserrat,52,&H0037AFD4,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,3,1,2,40,40,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
ASSEOF

# SRT → ASS konvertieren mit Branding
ffmpeg -i input.mp4 -vf "subtitles=subs.ass:force_style='FontName=Montserrat,FontSize=26,PrimaryColour=&H0037AFD4,OutlineColour=&H00000000,Outline=2,Shadow=1'" \
  -c:a copy output-with-subs.mp4
```

**Untertitel-Regeln:**
- **Font**: Montserrat Bold, Größe 48-56px (lesbar auf Mobile)
- **Farbe**: Gold (#d4af37) mit schwarzem Outline (2px) und leichtem Schatten
- **Position**: Zentriert unten, 60px Abstand zum Rand
- **Max. 2 Zeilen**, max. 42 Zeichen pro Zeile
- **Keyword-Highlighting**: Wichtige Wörter (Zahlen, Aktiennamen) in Bright Gold (#e0bd55) oder Weiß
- **Shorts**: IMMER Untertitel einbrennen (viele schauen ohne Ton)
- **Longvideos**: Als separate SRT-Datei hochladen (YouTube generiert Captions)

---

#### Modus F: Branded Intro / Outro / Wasserzeichen

**Kompass-Wasserzeichen (dauerhaft im Video):**
```bash
# Kompass-Logo als permanentes Wasserzeichen (unten rechts, 80x80, 30% Opacity)
ffmpeg -i input.mp4 -i Logo.png \
  -filter_complex "[1:v]scale=80:80,format=rgba,colorchannelmixer=aa=0.3[watermark];\
  [0:v][watermark]overlay=x=W-w-30:y=H-h-30[out]" \
  -map "[out]" -map 0:a -c:v libx264 -c:a copy output-watermarked.mp4
```

**Branded Intro (3-5s Kompass-Animation):**
```
[0.0-0.5s]  Schwarzer Screen, Fade-In
[0.5-2.0s]  Goldener Kompass dreht sich langsam ein (oder Nadel schwingt ein)
[2.0-3.0s]  "MB CAPITAL STRATEGIES" Text erscheint rechts neben Kompass (Gold, Montserrat)
[3.0-3.5s]  Kurzer Gold-Flash/Glow, dann Fade zu Content
```

```bash
# Statisches Intro aus Logo (3s mit Fade)
ffmpeg -loop 1 -i Logo.png -f lavfi -i "color=c=#0f1115:s=1920x1080:d=3.5" \
  -filter_complex "[1:v][0:v]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t,0.5,3)',\
  fade=t=in:st=0:d=0.5,fade=t=out:st=3:d=0.5[out]" \
  -map "[out]" -c:v libx264 -t 3.5 intro.mp4

# Intro + Hauptvideo + Outro zusammenfügen
ffmpeg -f concat -safe 0 -i <(echo -e "file 'intro.mp4'\nfile 'main-video.mp4'\nfile 'outro.mp4'") \
  -c:v libx264 -c:a aac final-video.mp4
```

**Branded Outro / Endscreen (15-20s):**
```
[0-2s]    Fade von letztem Frame zu dunklem Hintergrund
[2-5s]    Kompass zentriert, "Danke fürs Zuschauen!" in Gold
[5-15s]   Zwei Video-Empfehlungen (Karten links + rechts), Abo-Button Mitte
[15-18s]  Social Links: YouTube, LinkedIn, Website
[18-20s]  Fade-Out, Kompass bleibt als letztes Bild
```

**Endscreen-Regeln:**
- YouTube-Endscreen-Elemente (Abo, Video) können erst in den letzten 20s platziert werden
- Hintergrund: #0f1115 mit Kompass (30% Opacity) als Wasserzeichen
- Immer 2 Video-Empfehlungen (nächstes Video + bestes Video der Playlist)
- CTA-Text: "Abonnieren für wöchentliche Dividenden-Analysen"

---

#### Modus G: YouTube Chapters & SEO

**Auto-Chapters aus Schnittplan generieren:**

Der Schnittplan enthält Kapitel mit Timecodes. Daraus werden automatisch YouTube-Chapters:

```python
# chapters_from_schnittplan.py
schnittplan = [
    {"time": "0:00", "title": "Intro"},
    {"time": "0:15", "title": "Cold Open: 15% Dividende?"},
    {"time": "1:30", "title": "Unternehmensüberblick"},
    {"time": "4:15", "title": "Dividenden-Historie"},
    {"time": "7:30", "title": "Kennzahlen & Bewertung"},
    {"time": "10:45", "title": "Risiken & Chancen"},
    {"time": "13:20", "title": "Mein Fazit"},
    {"time": "15:00", "title": "Outro"},
]

# Für YouTube-Beschreibung:
chapters_text = "\n".join([f"{ch['time']} {ch['title']}" for ch in schnittplan])
print(chapters_text)
```

**YouTube-Chapters-Regeln:**
- Erstes Chapter MUSS bei `0:00` starten (YouTube-Pflicht)
- Mindestens 3 Chapters, idealerweise 5-8
- Jedes Chapter min. 10 Sekunden lang
- Titel: kurz, keyword-reich, beschreibend (max. 50 Zeichen)
- Keine Emojis in Chapter-Titeln (wirkt unseriös für Finanz-Content)

**YouTube SEO-Optimierung (pro Video):**

Der Agent generiert für jedes Video:

| Element | Regeln | Beispiel |
|---|---|---|
| **Titel** | Max. 60 Zeichen, Keyword vorne, Zahl wenn möglich, kein Clickbait | "Barrick Gold Aktie: 15% Dividende — Analyse 2026" |
| **Beschreibung** | Erste 2 Zeilen = Hook (sichtbar vor "Mehr anzeigen"), dann Chapters, dann Links | "Barrick Gold zahlt aktuell 15% Dividende. Ist die Aktie ein Kauf? In diesem Video..." |
| **Tags** | 15-20 Tags, Mix aus broad + specific, Deutsch + Englisch | barrick gold, barrick gold aktie, dividende, mining aktien, gold aktie 2026 |
| **Hashtags** | 3 Hashtags unter dem Titel (YouTube zeigt max. 3 über dem Titel) | #Dividende #Mining #Aktienanalyse |
| **Kategorie** | "Education" oder "People & Blogs" | Education |
| **Sprache** | Deutsch (de) | — |
| **Thumbnail** | Siehe Modus C | — |

**SEO-Template für YouTube-Beschreibung:**
```
[HOOK — 2 Sätze, Keywords vorne, neugierig machen]

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📊 KAPITEL:
0:00 Intro
[CHAPTERS AUS SCHNITTPLAN]

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🔗 LINKS:
🧮 Dividendenrechner: https://mbcapitalstrategies.com/tools/dividendenrechner.html
📖 Blog-Artikel: https://mbcapitalstrategies.com/blog/[SLUG].html
🌐 Website: https://mbcapitalstrategies.com

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📌 MEHR VON MIR:
💼 LinkedIn: https://www.linkedin.com/in/marco-bozem-182173295
🎙️ Alle Podcasts: https://mbcapitalstrategies.com/podcast/

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

⚠️ DISCLAIMER:
Keine Anlageberatung. Alle Angaben ohne Gewähr. Investitionen in Wertpapiere bergen Risiken.

#[KEYWORD1] #[KEYWORD2] #[KEYWORD3]
```

**Analytics-Feedback-Loop:**

Nach Veröffentlichung (7-14 Tage) analysiert der Agent die YouTube-Daten:

| Metrik | Ziel | Aktion bei Verfehlung |
|---|---|---|
| **CTR (Thumbnail)** | >5% | Neues Thumbnail testen (A/B), Titel anpassen |
| **Avg. View Duration** | >50% des Videos | Schnittplan anpassen: mehr Pattern Interrupts, kürzere Kapitel |
| **Retention Drop-Off** | Kein Drop >15% an einer Stelle | Stelle analysieren: zu lang? Zu monoton? → nächstes Video verbessern |
| **Impressions** | Wachsend (WoW) | SEO-Titel/Tags optimieren, mehr Keywords |
| **Subscriber Conversion** | >2% der Viewer | CTA-Platzierung anpassen, End-CTA verstärken |
| **Comments** | >10 pro Video | Mehr Engagement-Trigger einbauen ("Schreibt in die Kommentare...") |

**Retention-Kurven-Analyse:**
```
Retention
100% ██
 90% ██░░
 80% ██░░██
 70% ██░░██░░░░
 60% ██░░██░░░░██████
 50% ██░░██░░░░██████████──── ZIEL: >50% am Ende
 40% ██░░██░░░░██████████████
      │  │  │       │      │
    Intro │ K2     K3    Fazit
         K1
         ↑
    DROP? → Hier war's zu langweilig → Nächstes Mal: Pattern Interrupt!
```

---

#### Modus H: Multi-Format Export

Jedes Video wird in allen relevanten Formaten exportiert:

| Format | Ratio | Plattform | Besonderheiten |
|---|---|---|---|
| **16:9** (1920x1080) | Landscape | YouTube (Long), Desktop | Standard-Export, höchste Qualität |
| **9:16** (1080x1920) | Portrait | YouTube Shorts, TikTok, Instagram Reels | Untertitel eingebrannt, Musik (wenn Short) |
| **1:1** (1080x1080) | Quadrat | LinkedIn, X/Twitter, Facebook | Untertitel eingebrannt, kürzere Version |
| **4:5** (1080x1350) | Portrait | Instagram Feed | Optional, nur wenn Post geplant |

**ffmpeg Format-Konvertierung:**
```bash
# 16:9 → 9:16 (Smart Crop: Fokus auf Marcos Gesicht, Mitte)
ffmpeg -i input-16x9.mp4 \
  -vf "crop=ih*9/16:ih:iw/2-ih*9/32:0" \
  -c:a copy output-9x16.mp4

# 16:9 → 1:1 (Quadrat: obere Mitte, Gesicht bleibt drin)
ffmpeg -i input-16x9.mp4 \
  -vf "crop=ih:ih:iw/2-ih/2:0" \
  -c:a copy output-1x1.mp4

# 16:9 → 9:16 mit Blur-Hintergrund (Video oben, Blur unten — TikTok-Style)
ffmpeg -i input-16x9.mp4 \
  -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:200:color=#0f1115[fg];\
  [0:v]scale=1080:1920,boxblur=20:5[bg];\
  [bg][fg]overlay=(W-w)/2:(H-h)/2[out]" \
  -map "[out]" -map 0:a output-9x16-blur.mp4

# Batch-Export alle Formate
for fmt in "16x9:1920:1080" "9x16:1080:1920" "1x1:1080:1080"; do
  IFS=':' read -r name w h <<< "$fmt"
  ffmpeg -i final-video.mp4 -vf "scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=#0f1115" \
    -c:a copy "output-${name}.mp4"
done
```

**Plattform-spezifische Anpassungen:**

| Plattform | Max. Dauer | Untertitel | Musik | Wasserzeichen |
|---|---|---|---|---|
| YouTube (Long) | unbegrenzt | SRT separat hochladen | ❌ Keine | ✅ Kompass klein |
| YouTube Shorts | 60s | ✅ Eingebrannt (Gold) | ✅ Leise (-20dB) | ✅ Kompass klein |
| TikTok | 10 Min (aber 60s optimal) | ✅ Eingebrannt (Gold) | ✅ Leise (-20dB) | ✅ Kompass klein |
| X/Twitter | 2:20 Min | ✅ Eingebrannt (Gold) | Optional | ✅ Kompass |
| LinkedIn | 10 Min | ✅ Eingebrannt (Weiß) | ❌ Keine | ✅ Kompass |
| Instagram Reels | 90s | ✅ Eingebrannt (Gold) | ✅ Leise | ✅ Kompass |

---

#### Modus I: Musik (nur Shorts / Reels / TikTok)

**WICHTIG: Musik NUR bei Shorts/Reels/TikTok — NICHT bei Longvideos.** Bei Longvideos ist Musik störend und lenkt von der Analyse ab.

**Musik-Regeln für Shorts:**
- **Lautstärke**: -18 bis -22dB unter der Stimme (Marco muss IMMER klar verständlich sein)
- **Stil**: Ambient, Lo-Fi, minimal Electronic — KEIN Beat-Drop, KEINE Vocals
- **Stimmung**: Passend zum Thema (siehe Tabelle unten)
- **Lizenz**: NUR royalty-free / copyright-free (YouTube Content ID safe)

**Musik-Mood pro Thema:**

| Thema | Mood | Stil-Keywords |
|---|---|---|
| Positive Analyse (hohe Rendite, Wachstum) | Optimistisch, aufsteigend | Light corporate, uplifting ambient, soft piano |
| Negative News (Crash, Div-Cut) | Dramatisch, ernst | Dark ambient, tension, cinematic drone |
| Vergleich (A vs B) | Neutral, spannend | Minimal electronic, pulse, ticking |
| Erklär-Content (Guide, Glossar) | Ruhig, fokussiert | Lo-fi study, soft ambient, gentle pad |
| Wochenrückblick | Energisch, zusammenfassend | Upbeat corporate, positive news |

**Royalty-Free Musik-Quellen:**

| Quelle | Preis | Qualität | Link |
|---|---|---|---|
| YouTube Audio Library | Kostenlos | Gut | In YouTube Studio enthalten |
| Epidemic Sound | $15/mo | Sehr gut | epidemicsound.com |
| Artlist | $10/mo | Sehr gut | artlist.io |
| Pixabay Music | Kostenlos | Mittel | pixabay.com/music |
| Free Music Archive | Kostenlos | Mittel-Gut | freemusicarchive.org |

**Musik einbinden mit ffmpeg:**
```bash
# Musik unter Stimme mischen (-20dB leiser als Stimme)
ffmpeg -i short-video.mp4 -i background-music.mp3 \
  -filter_complex "[1:a]volume=0.1[music];[0:a][music]amix=inputs=2:duration=first:dropout_transition=3[out]" \
  -map 0:v -map "[out]" -c:v copy short-with-music.mp4

# Musik mit Fade-In (2s) und Fade-Out (3s vor Ende)
ffmpeg -i short-video.mp4 -i background-music.mp3 \
  -filter_complex "[1:a]volume=0.1,afade=t=in:st=0:d=2,afade=t=out:st=55:d=3[music];\
  [0:a][music]amix=inputs=2:duration=first[out]" \
  -map 0:v -map "[out]" -c:v copy short-with-music-faded.mp4

# Ducking: Musik automatisch leiser wenn Marco spricht (Sidechain)
ffmpeg -i short-video.mp4 -i background-music.mp3 \
  -filter_complex "[0:a]asplit[voice][sc];[1:a]volume=0.15[music];\
  [music][sc]sidechaincompress=threshold=0.02:ratio=8:attack=50:release=300[ducked];\
  [voice][ducked]amix=inputs=2:duration=first[out]" \
  -map 0:v -map "[out]" -c:v copy short-ducked.mp4
```

---

#### Modus J: Transitions-Bibliothek (ffmpeg-Befehle)

Konkrete, sofort einsetzbare Transitions zwischen Sequenzen:

**Fade (Standard-Übergang):**
```bash
# Cross-Fade zwischen zwei Clips (1s Überblendung)
ffmpeg -i clip1.mp4 -i clip2.mp4 \
  -filter_complex "[0:v]fade=t=out:st=4:d=1[v0];\
  [1:v]fade=t=in:st=0:d=1[v1];\
  [v0][v1]concat=n=2:v=1:a=0[out]" \
  -map "[out]" crossfade.mp4

# Fade to Black (0.5s)
ffmpeg -i clip.mp4 -vf "fade=t=out:st=4.5:d=0.5:color=#0f1115" fade-to-black.mp4

# Fade from Black (0.5s)
ffmpeg -i clip.mp4 -vf "fade=t=in:st=0:d=0.5:color=#0f1115" fade-from-black.mp4
```

**Zoom-Transition (Punch-In):**
```bash
# Zoom-In Punch (schneller Zoom auf Mitte, 0.3s)
ffmpeg -i clip.mp4 -vf "zoompan=z='if(between(t,4.7,5.0),min(zoom+0.15,1.5),1)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080" zoom-punch.mp4
```

**Slide / Push (Schiebeübergang):**
```bash
# Slide Links → Rechts (clip2 schiebt clip1 raus)
ffmpeg -i clip1.mp4 -i clip2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=slideleft:duration=0.5:offset=4.5[out]" \
  -map "[out]" slide-left.mp4

# Slide Rechts → Links
ffmpeg -i clip1.mp4 -i clip2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=slideright:duration=0.5:offset=4.5[out]" \
  -map "[out]" slide-right.mp4

# Slide von unten (gut für Kapitelwechsel)
ffmpeg -i clip1.mp4 -i clip2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=slideup:duration=0.5:offset=4.5[out]" \
  -map "[out]" slide-up.mp4
```

**Wipe (Goldener Vorhang-Effekt):**
```bash
# Wipe Links → Rechts
ffmpeg -i clip1.mp4 -i clip2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=wipeleft:duration=0.7:offset=4.3[out]" \
  -map "[out]" wipe-left.mp4

# Radial Wipe (Kreis-Übergang)
ffmpeg -i clip1.mp4 -i clip2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=circleopen:duration=0.8:offset=4.2[out]" \
  -map "[out]" circle-wipe.mp4
```

**Glitch / Flash (Pattern Interrupt):**
```bash
# Kurzer Weiß-Flash (0.1s, Gold-Tint) — für Schock-Zahlen
ffmpeg -i clip.mp4 \
  -vf "geq=r='if(between(t,5.0,5.1),255,r(X,Y))':g='if(between(t,5.0,5.1),200,g(X,Y))':b='if(between(t,5.0,5.1),50,b(X,Y))'" \
  gold-flash.mp4
```

**Alle verfügbaren xfade-Transitions:**

| Transition | Effekt | Einsatz |
|---|---|---|
| `fade` | Sanfte Überblendung | Standard, ruhige Übergänge |
| `slideleft` / `slideright` | Schieben horizontal | Kapitelwechsel, Themenwechsel |
| `slideup` / `slidedown` | Schieben vertikal | Neue Sektion, Überraschung |
| `wipeleft` / `wiperight` | Wisch-Effekt | Formaler Übergang |
| `circleopen` / `circleclose` | Kreis öffnet/schließt | Fokus auf neue Info |
| `dissolve` | Pixel-Auflösung | Traum-Sequenz, Rückblick |
| `pixelize` | Verpixelung → scharf | Reveal-Effekt |
| `smoothleft` / `smoothright` | Weicher Schub | Eleganter Kapitelwechsel |
| `horzopen` / `horzclose` | Horizontaler Vorhang | Dramatisch |
| `vertopen` / `vertclose` | Vertikaler Vorhang | Dramatisch |

**Transition-Regeln:**
1. **Standard**: `fade` (0.5s) — für 80% der Übergänge
2. **Kapitelwechsel**: `slideleft` (0.5s) — klar, sauber
3. **Pattern Interrupt**: Gold-Flash (0.1s) — bei Schock-Zahlen
4. **B-Roll → Talking Head**: `fade` (0.3s, kurz) — unsichtbar, smooth
5. **Talking Head → Screenshare**: `circleopen` (0.5s) — Fokus-Shift
6. **NIE**: Mehr als 2 verschiedene Transitions pro Kapitel (wirkt unruhig)
7. **NIE**: Transitions länger als 1s (außer bei bewusstem Stimmungswechsel)

---

#### Video-Editor-Agent Sub-Agents (bei Volle-Produktion)

| Sub-Agent | Aufgabe |
|---|---|
| Video-Edit-1 | Short-Kandidaten generieren + direkt schneiden (9:16, Untertitel, Musik, Transitions) |
| Video-Edit-2 | Longvideo schneiden: Charts/Grafiken erstellen, Sequenzen zusammenbauen, Overlays, Wasserzeichen, Intro/Outro, Transitions, Color Grade |
| Video-Edit-3 | Thumbnail-Prompts + Frame-Extraktion (Long + alle Shorts) |
| Video-Edit-4 | YouTube SEO + Multi-Format Export (16:9, 9:16, 1:1) + Chapters |

**Zugriff**: NUR YT-Skript aus Phase 2 + Research-Daten aus Phase 1 + Video-Datei (wenn vorhanden). Kein Zugriff auf Website-Code oder andere Plattform-Outputs. `ffmpeg` + `whisper` + `python` für Video-/Chart-Operationen.

---

### Pipeline-Übersicht

| Pipeline | Ablauf | Typische Dauer |
|---|---|---|
| **Volle-Produktion** | Research (4 parallel) → YT-Skript → Video-Edit (3 parallel) → Multi-Plattform (4 parallel) → QA/Oversight → Output → Save+Deploy (3 parallel) | Komplett |
| **Wochenrückblick** | Research (4 parallel) → Skript → Video-Edit → Plattformen → QA → Save | Mittel |
| **Breaking-News** | Quick-Research → Content (3 parallel) → Video-Edit (Short only) → Save | Schnell |
| **Shorts-Only** | Longvideo/Transkript → Video-Editor (Modus A) → 3-5 Shorts → Save | Kurz |
| **Video-Schnitt** | Video + Skript → Video-Editor (Modus B+D) → Schnittplan + Cuts → Export | Mittel |
| **Feature-Pipeline** | Architect → Developer (ggf. Sub-Agents) → QA | Je nach Scope |
| **Bugfix-Pipeline** | Architect analysiert → Developer fixt → QA prüft | Kurz |
| **Website-Pipeline** | SEO-Check → Architect → Developer → QA → Deploy | Mittel |
| **Daily-Optimize** | Bereiche auswählen → Analyse → Optimierung → Validierung → Commit+Push → Report | Täglich (Loop) |

### Sub-Agent Spawn-Regeln

1. **Maximal 4 Sub-Agents** pro Phase (Performance + Kontrollierbarkeit)
2. **Jeder Sub-Agent bekommt nur den Kontext**, den er braucht — nicht den gesamten Pipeline-State
3. **Ergebnisse werden vom Orchestrator eingesammelt** und an die nächste Phase weitergegeben
4. **Bei Fehler eines Sub-Agents**: Orchestrator entscheidet ob Retry, Skip, oder Abbruch
5. **Oversight wird automatisch gespawnt** wenn ≥3 Sub-Agents parallel gearbeitet haben

## MCP Server Integration

Die folgenden MCP-Server werden für die verschiedenen Pipelines benötigt. Sie ermöglichen den Agents direkten API-Zugriff auf die Plattformen.

### Benötigte MCP-Server

| MCP-Server | Genutzt von | Zweck |
|---|---|---|
| **YouTube Data API** | Volle-Produktion, Wochenrückblick, Breaking-News, Automation | Video-Upload-Metadaten, Thumbnails, Playlists, Analytics |
| **LinkedIn API** | Plattform-Sub-Agent 1, Breaking-News | Posts erstellen/planen, Engagement-Daten |
| **Reddit API** (PRAW) | Plattform-Sub-Agent 2, Breaking-News | Posts in Subreddits (r/dividends, r/stocks, r/ValueInvesting) |
| **Notion API** | Automation-Agent, Save-Sub-Agents | Datenbanken: YT Videos, Blog-Artikel, Research, Distribution-Tracker |
| **Google Calendar API** | Automation-Agent | Upload-Plan, Earnings-Termine, Markt-Events |
| **GitHub API** | Automation-Agent, Save-Sub-Agent 3 | Website-Deployment (git push), PR-Management |
| **Investing.com** | Plattform-Sub-Agent 1 | Analysen veröffentlichen (manuell/API wo verfügbar) |
| **Medium API** | Plattform-Sub-Agent 2 | Englische Artikel publizieren |

### Forum-Plattformen (kein API-Zugriff — manuell/Clipboard)

Diese Plattformen haben keine offizielle API. Content wird als **copy-paste ready** Output geliefert:

| Plattform | Format | Hinweis |
|---|---|---|
| **Wallstreet-Online** | BBCode/HTML, Deutsch, Kennzahlen-lastig | Forum-Stil, Tabellen mit Kennzahlen |
| **Wertpapier-Forum** | BBCode/Markdown, Deutsch, Detail-Analyse | Längerer Format, Investment-These |
| **Goldseiten** | HTML/Text, Deutsch, Rohstoff-Fokus | Commodity-Sektor-Bezug betonen |

### MCP-Server Konfiguration

MCP-Server werden in der Claude Code Konfiguration (`~/.claude/settings.json` oder Projekt-`.claude/settings.json`) definiert:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_..."
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-google-calendar"],
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "...",
        "GOOGLE_REFRESH_TOKEN": "..."
      }
    },
    "youtube": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-youtube"],
      "env": {
        "YOUTUBE_API_KEY": "..."
      }
    },
    "reddit": {
      "command": "npx",
      "args": ["-y", "mcp-server-reddit"],
      "env": {
        "REDDIT_CLIENT_ID": "...",
        "REDDIT_CLIENT_SECRET": "...",
        "REDDIT_USERNAME": "...",
        "REDDIT_PASSWORD": "..."
      }
    },
    "linkedin": {
      "command": "npx",
      "args": ["-y", "mcp-server-linkedin"],
      "env": {
        "LINKEDIN_ACCESS_TOKEN": "..."
      }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-fetch"]
    }
  }
}
```

### Zugriffs-Matrix (Agent → MCP-Server)

| Agent | YouTube | LinkedIn | Reddit | Notion | Calendar | GitHub | Fetch |
|---|---|---|---|---|---|---|---|
| Orchestrator | — | — | — | — | ✅ (Briefing) | — | — |
| Research-Sub-Agents | — | — | — | — | — | — | ✅ |
| YT-Skript | ✅ (Metadaten) | — | — | — | — | — | — |
| Plattform-1 (LinkedIn+Investing) | — | ✅ | — | — | — | — | ✅ |
| Plattform-2 (Reddit+Medium) | — | — | ✅ | — | — | — | ✅ |
| Plattform-3 (Foren) | — | — | — | — | — | — | — |
| Plattform-4 (Website) | — | — | — | — | — | ✅ | — |
| Portfolio-Agent | — | — | — | — | — | — | ✅ |
| Automation-Agent | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Save-Sub-Agents | — | — | — | ✅ | — | ✅ | — |
| QA/Oversight | — | — | — | — | — | — | — |
| Cowork-Skill | — | — | — | — | — | — | ✅ (optional) |

**Wichtig**: Jeder Agent darf NUR die MCP-Server nutzen, die in der Zugriffs-Matrix für ihn freigegeben sind. Der `fetch` MCP-Server ist der General-Purpose Web-Fetcher für Research.

## Important Notes

- **No package.json or npm dependencies** — the only Node.js usage is `build-glossar-sitemap.mjs` (runs with bare Node.js, uses only `fs` built-in)
- **No test suite** — this is a content site; verify changes by visual inspection in the browser
- **GitHub Pages deployment** — the repository root IS the site root; every file is publicly accessible
- **DSGVO compliance** — cookie consent banner is mandatory; do not add tracking without consent flow
- **Inline styles on homepage** — `index.html` is self-contained (~1654 lines) with all styles inline; changes to the design system in `blog/styles.css` do NOT automatically affect it
- **Homepage nav is separate** — `index.html` has its own inline nav that is NOT replaced by `nav.js`. Must be updated manually when nav changes.
- **Python scripts use hardcoded paths** — update `BASE` variable if running outside the expected environment
- **AdSense publisher ID** — `ca-pub-7097302643579933` (referenced in `ads.txt` and all page headers)
- **robots.txt** — Disallows `/admin/`, `/draft/`, `/tmp/`, `/private/`. Allows all CSS/JS for mobile-friendly testing. Lists 9 sitemaps (master index + 8 sub-sitemaps; note: `sitemap-video.xml` is referenced in `sitemap.xml` index but not in `robots.txt`).
- **Redirect stubs** must include `<meta name="robots" content="noindex, follow">` to prevent indexing of old URLs
- **Blog article exclusions** — `nav.js` excludes `alle-finanzrechner.html` from both author bio and schema injection. Additionally, `meine-toolbox-broker-tools-plattformen-2025.html` and `wise-airalo-vietnam-erfahrungen.html` are excluded from schema injection only (they still get author bio)
- **Custom 404 page** — `404.html` is served by GitHub Pages for all 404 errors, styled consistently with the site design
