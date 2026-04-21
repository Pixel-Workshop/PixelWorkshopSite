# Pixel Workshop Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Pixel Workshop site from its current mixed light/neon theme into a cohesive Dark & Premium design inspired by Linear/Vercel/Raycast.

**Architecture:** Complete CSS rewrite replacing the current light+neon dual-theme system with a single dark theme. All 29 HTML files updated. Homepage gets structural changes (carousel → grid). Animations added via CSS keyframes + existing IntersectionObserver JS.

**Tech Stack:** HTML5, CSS3 (custom properties, keyframes, backdrop-filter), vanilla JS (IntersectionObserver)

---

## File Structure

**Rewrite:**
- `css/style.css` — Complete rewrite. Single dark theme replacing the light+neon dual system.

**Structural changes (new HTML structure):**
- `index.html` — New homepage with grid layout, dark hero, animations

**Restyle only (dark theme, updated footer/nav, same structure):**
- `about.html`
- `hire.html`
- `apps/*.html` (8 files)
- `support/*.html` (9 files including index)
- `privacy/*.html` (8 files)
- `privacy.html`
- `terms.html`

---

### Task 1: Rewrite CSS — Core Design System

**Files:**
- Rewrite: `css/style.css`

This task replaces the entire stylesheet. The new file contains the dark theme design system, layout primitives, and all component styles. We write it all at once because components reference shared variables.

- [ ] **Step 1: Write the new css/style.css with reset, variables, and base styles**

Write the first section of the new stylesheet:

```css
/* ============================================================
   PixelWorkshop — Dark Premium Theme
   ============================================================ */

/* === Reset === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* Core palette */
  --color-bg:           #050809;
  --color-surface:      rgba(255, 255, 255, 0.03);
  --color-surface-hover: rgba(255, 255, 255, 0.06);
  --color-text:         #FFFFFF;
  --color-muted:        rgba(255, 255, 255, 0.45);
  --color-faint:        rgba(255, 255, 255, 0.25);
  --color-border:       rgba(255, 255, 255, 0.06);
  --color-border-hover: rgba(124, 58, 237, 0.25);

  /* Accent */
  --color-accent:       #7C3AED;
  --color-accent-blue:  #3B82F6;
  --color-accent-light: rgba(124, 58, 237, 0.12);

  /* Typography */
  --font-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  /* Spacing & shape */
  --radius:     16px;
  --radius-sm:  10px;
  --radius-xs:  6px;
  --max-width:  1200px;
  --transition: 0.2s ease;

  /* Shadows */
  --shadow:       0 2px 16px rgba(0, 0, 0, 0.3);
  --shadow-md:    0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow:  0 4px 24px rgba(124, 58, 237, 0.25);

  /* Per-app accents */
  --app-accent:   #7C3AED;
}

.app--matchmint     { --app-accent: #059669; }
.app--refract       { --app-accent: #7c3aed; }
.app--forge         { --app-accent: #ca8a04; }
.app--retro         { --app-accent: #16a34a; }
.app--snooze        { --app-accent: #db2777; }
.app--calmly        { --app-accent: #0891b2; }
.app--constellation { --app-accent: #2563eb; }
.app--warfront      { --app-accent: #ea580c; }

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-base);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

img { max-width: 100%; display: block; }

a {
  color: var(--color-muted);
  text-decoration: none;
  transition: color var(--transition);
}

a:hover { color: #fff; }

/* === Layout === */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 32px;
}

.section         { padding: 100px 0; }
.section--alt    { background: rgba(255, 255, 255, 0.02); }

.divider {
  height: 1px;
  background: var(--color-border);
  max-width: var(--max-width);
  margin: 0 auto;
}

/* === Section Typography === */
.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(124, 58, 237, 0.7);
  margin-bottom: 12px;
  display: block;
}

.section-title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 16px;
}

.section-desc {
  font-size: 1rem;
  color: var(--color-muted);
  max-width: 480px;
  line-height: 1.7;
}
```

- [ ] **Step 2: Add scroll entrance animations**

Append to the file:

```css
/* === Scroll Entrance Animations === */
.animate-in {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-in.delay-1 { transition-delay: 0.1s; }
.animate-in.delay-2 { transition-delay: 0.2s; }
.animate-in.delay-3 { transition-delay: 0.3s; }
.animate-in.delay-4 { transition-delay: 0.4s; }

.animate-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Add navigation styles**

Append to the file:

```css
/* === Header / Nav === */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(5, 8, 9, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.nav__logo:hover { color: #fff; }

.nav__logo-pixel {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-blue) 100%);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav__logo-pixel svg {
  width: 14px;
  height: 14px;
  fill: #fff;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
}

.nav__links a {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-muted);
}

.nav__links a:hover { color: #fff; }
```

- [ ] **Step 4: Add button styles**

Append to the file:

```css
/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  border: none;
  text-decoration: none;
  font-family: var(--font-base);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-blue));
  color: #fff;
  box-shadow: 0 4px 24px rgba(124, 58, 237, 0.3);
}

.btn--primary:hover {
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.45);
  transform: translateY(-1px);
  color: #fff;
}

.btn--outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn--outline:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-1px);
}

.btn--sm {
  padding: 10px 20px;
  font-size: 0.85rem;
}

.btn--app-store {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all var(--transition);
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn--app-store:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn--app-store svg { width: 20px; height: 20px; flex-shrink: 0; fill: #fff; }
.btn__label-top  { font-size: 0.63rem; font-weight: 400; display: block; line-height: 1; opacity: 0.6; }
.btn__label-main { font-size: 0.95rem; font-weight: 700; display: block; line-height: 1.2; }
```

- [ ] **Step 5: Add hero section styles with animations**

Append to the file:

```css
/* === Hero (Home) === */
.hero {
  padding: 140px 0 100px;
  position: relative;
  overflow: hidden;
  text-align: center;
}

/* Animated aurora glow */
.hero::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 800px;
  height: 800px;
  background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, rgba(59, 130, 246, 0.06) 35%, transparent 65%);
  pointer-events: none;
  animation: aurora-drift 8s ease-in-out infinite;
}

/* Dot grid */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

@keyframes aurora-drift {
  0%, 100% { transform: translate(-50%, -60%) scale(1); }
  33%      { transform: translate(-47%, -58%) scale(1.05); }
  66%      { transform: translate(-53%, -62%) scale(0.98); }
}

.hero__inner {
  position: relative;
  z-index: 1;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
}

.hero__eyebrow-dot {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

.hero__title {
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #fff 30%, rgba(124, 58, 237, 0.6) 70%, rgba(59, 130, 246, 0.6) 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 6s linear infinite;
}

@keyframes shimmer {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero__subtitle {
  font-size: 1.15rem;
  color: var(--color-muted);
  max-width: 520px;
  margin: 0 auto 40px;
  line-height: 1.7;
}

.hero__cta {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

/* === Stats Bar === */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: 56px;
}

.stats-bar__item {
  padding: 0 32px;
  text-align: center;
  border-right: 1px solid var(--color-border);
}

.stats-bar__item:last-child { border-right: none; }

.stats-bar__number {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-bar__label {
  font-size: 0.75rem;
  color: var(--color-faint);
  margin-top: 4px;
}
```

- [ ] **Step 6: Add app grid styles**

Append to the file:

```css
/* === App Grid === */
.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 48px;
}

.app-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  display: block;
}

.app-card:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.app-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 13px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.app-card__icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-card__category {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-faint);
  margin-bottom: 6px;
}

.app-card__name {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.app-card__desc {
  font-size: 0.82rem;
  color: var(--color-muted);
  line-height: 1.5;
}

.app-card__badge {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  background: rgba(202, 138, 4, 0.15);
  color: #ca8a04;
  border: 1px solid rgba(202, 138, 4, 0.2);
}
```

- [ ] **Step 7: Add bento grid / values styles**

Append to the file:

```css
/* === Bento Grid (Values) === */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 48px;
}

.bento-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 32px 28px;
  transition: all 0.25s ease;
}

.bento-card:hover {
  border-color: rgba(124, 58, 237, 0.2);
  background: var(--color-surface-hover);
}

.bento-card__emoji {
  font-size: 1.6rem;
  margin-bottom: 14px;
  display: block;
}

.bento-card__title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #fff;
}

.bento-card__desc {
  font-size: 0.85rem;
  color: var(--color-muted);
  line-height: 1.6;
}
```

- [ ] **Step 8: Add about strip, footer, and breadcrumb styles**

Append to the file:

```css
/* === About Strip === */
.about-strip {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.about-strip__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 64px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.about-strip__text { max-width: 560px; }

.about-strip__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  color: #fff;
}

.about-strip__desc {
  font-size: 0.95rem;
  color: var(--color-muted);
  line-height: 1.7;
}

/* === Footer === */
.site-footer {
  border-top: 1px solid var(--color-border);
  padding: 48px 0 32px;
}

.footer__top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 32px;
}

.footer__brand-block { display: flex; flex-direction: column; gap: 12px; }

.footer__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.footer__logo-pixel {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-blue));
  border-radius: 6px;
}

.footer__tagline {
  font-size: 0.82rem;
  color: var(--color-faint);
  max-width: 200px;
  line-height: 1.5;
}

.footer__nav-group { display: flex; flex-direction: column; gap: 14px; }

.footer__nav-heading {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-faint);
}

.footer__nav-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer__nav-links a { font-size: 0.85rem; color: var(--color-muted); }
.footer__nav-links a:hover { color: #fff; }

.footer__copy {
  font-size: 0.75rem;
  color: var(--color-faint);
}

/* === Breadcrumb === */
.breadcrumb {
  font-size: 0.82rem;
  color: var(--color-faint);
  margin-bottom: 32px;
}

.breadcrumb a { color: var(--color-muted); }
.breadcrumb a:hover { color: #fff; }
.breadcrumb__sep { opacity: 0.35; margin: 0 6px; }
```

- [ ] **Step 9: Add app detail page styles**

Append to the file:

```css
/* === App Detail Hero === */
.app-hero {
  padding: 72px 0 60px;
  border-bottom: 1px solid var(--color-border);
}

.app-hero__inner {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
}

.app-hero__icon {
  width: 100px;
  height: 100px;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(var(--app-accent), 0.1);
  flex-shrink: 0;
}

.app-hero__icon img { width: 100%; height: 100%; object-fit: cover; }

.app-hero__text { flex: 1; min-width: 260px; }

.app-hero__category {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 10px;
}

.app-hero__title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 14px;
}

.app-hero__desc {
  font-size: 1rem;
  color: var(--color-muted);
  max-width: 480px;
  line-height: 1.75;
  margin-bottom: 28px;
}

.app-card__platform-badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  color: var(--color-muted);
}

/* === Screenshots === */
.screenshots {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0 16px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.screenshots::-webkit-scrollbar { height: 4px; }
.screenshots::-webkit-scrollbar-track { background: transparent; }
.screenshots::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.screenshot {
  flex: 0 0 auto;
  scroll-snap-align: start;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--color-border);
}

.screenshot img {
  height: 480px;
  width: auto;
  display: block;
}

/* === Features Grid === */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 24px;
  transition: border-color 0.2s ease;
}

.feature-item:hover {
  border-color: rgba(124, 58, 237, 0.15);
}

.feature-item__icon {
  font-size: 1.4rem;
  margin-bottom: 12px;
  display: block;
}

.feature-item__title {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #fff;
}

.feature-item__desc {
  font-size: 0.82rem;
  color: var(--color-muted);
  line-height: 1.6;
}
```

- [ ] **Step 10: Add support, FAQ, form, and legal page styles**

Append to the file:

```css
/* === Support Cards === */
.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.support-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 24px;
  text-decoration: none;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
}

.support-card:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  color: #fff;
}

.support-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.support-card__icon img { width: 100%; height: 100%; object-fit: cover; }

.support-card__name {
  font-weight: 700;
  font-size: 1rem;
}

.support-card__category {
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* === FAQ === */
.faq-list {
  margin-top: 40px;
  border-top: 1px solid var(--color-border);
}

.faq-item {
  border-bottom: 1px solid var(--color-border);
}

.faq-item__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0;
  background: none;
  border: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-base);
  transition: color var(--transition);
}

.faq-item__question:hover { color: var(--color-accent); }

.faq-item__chevron {
  width: 20px;
  height: 20px;
  color: var(--color-muted);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.faq-item.open .faq-item__chevron { transform: rotate(180deg); }

.faq-item__answer {
  display: none;
  padding: 0 0 20px;
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.7;
}

.faq-item.open .faq-item__answer { display: block; }

/* === Contact Form === */
.contact-form {
  margin-top: 40px;
  max-width: 560px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 0.9rem;
  font-family: var(--font-base);
  transition: border-color var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-faint);
}

.form-group textarea {
  min-height: 140px;
  resize: vertical;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.form-group select option {
  background: #111;
  color: #fff;
}

.form-success {
  display: none;
  background: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: var(--radius-sm);
  padding: 20px;
  color: #4ade80;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* === Legal Content === */
.legal-content {
  max-width: 720px;
}

.legal-content h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 40px 0 12px;
  color: #fff;
}

.legal-content h2:first-child { margin-top: 0; }

.legal-content p,
.legal-content li {
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.75;
  margin-bottom: 12px;
}

.legal-content a { color: var(--color-accent); }
.legal-content a:hover { color: #fff; }

.legal-content ul { padding-left: 20px; margin-bottom: 16px; }
.legal-content strong { color: rgba(255, 255, 255, 0.7); }
```

- [ ] **Step 11: Add about page specific styles**

Append to the file:

```css
/* === About Page === */
.about-hero {
  padding: 100px 0 80px;
  position: relative;
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 65%);
  pointer-events: none;
}

.about-hero__inner { position: relative; z-index: 1; max-width: 700px; }

.about-hero__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  margin-bottom: 24px;
  color: #fff;
}

.about-hero__lead {
  font-size: 1.15rem;
  color: var(--color-muted);
  line-height: 1.75;
}

.about-hero__lead strong { color: #fff; }

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 100px;
  padding: 6px 16px 6px 10px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: 28px;
}

.location-badge__pin { font-size: 1rem; line-height: 1; }

/* Story grid */
.story-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
  align-items: start;
}

.story-body p {
  font-size: 0.95rem;
  color: var(--color-muted);
  line-height: 1.8;
  margin-bottom: 16px;
}

.story-body strong { color: #fff; }

/* Stat cards */
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 12px;
}

.stat-card__number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-card__label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.stat-card__desc {
  font-size: 0.8rem;
  color: var(--color-muted);
  line-height: 1.5;
}

/* Build steps */
.build-steps {
  margin-top: 48px;
}

.build-step {
  display: flex;
  gap: 28px;
  padding: 32px 0;
  border-bottom: 1px solid var(--color-border);
  align-items: flex-start;
}

.build-step:last-child { border-bottom: none; }

.build-step__number {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-blue));
  color: #fff;
  font-size: 0.9rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.build-step__content { flex: 1; }

.build-step__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.build-step__desc {
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.7;
}

/* Values grid (about page) */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 48px;
}

.value-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: all 0.25s ease;
}

.value-card:hover {
  border-color: rgba(124, 58, 237, 0.15);
  background: var(--color-surface-hover);
}

.value-card__emoji { font-size: 1.6rem; margin-bottom: 14px; display: block; }
.value-card__title { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
.value-card__desc { font-size: 0.85rem; color: var(--color-muted); line-height: 1.65; }

/* CTA strip (about page) */
.cta-strip {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.06) 100%);
  border-top: 1px solid var(--color-border);
  text-align: center;
  padding: 80px 0;
}

.cta-strip__title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
  color: #fff;
}

.cta-strip__desc {
  font-size: 1rem;
  color: var(--color-muted);
  margin-bottom: 32px;
}

.cta-strip__actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}
```

- [ ] **Step 12: Add hire page and coming-soon badge styles**

Append to the file:

```css
/* === Hire Page === */
.hire-hero {
  padding: 100px 0 80px;
  position: relative;
  overflow: hidden;
}

.hire-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(124, 58, 237, 0.06) 1.5px, transparent 1.5px);
  background-size: 30px 30px;
  pointer-events: none;
}

.hire-hero__inner { position: relative; z-index: 1; max-width: 700px; }

.hire-hero__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  margin-bottom: 24px;
  color: #fff;
}

.hire-hero__lead {
  font-size: 1.2rem;
  color: var(--color-muted);
  line-height: 1.8;
  max-width: 580px;
  margin-bottom: 32px;
}

.hire-hero__lead strong { color: #fff; }

/* Pricing cards */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 48px;
}

.pricing-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.25s ease;
}

.pricing-card:hover {
  border-color: rgba(124, 58, 237, 0.15);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.pricing-card--featured {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent), var(--shadow-md);
}

.pricing-card__header {
  padding: 28px 28px 20px;
  border-bottom: 1px solid var(--color-border);
}

.pricing-card--featured .pricing-card__header {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-blue) 100%);
  border-bottom: none;
}

.pricing-card__tier {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 8px;
}

.pricing-card--featured .pricing-card__tier { color: rgba(255,255,255,0.7); }

.pricing-card__price {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.pricing-card__subtitle {
  font-size: 0.82rem;
  color: var(--color-muted);
}

.pricing-card--featured .pricing-card__subtitle { color: rgba(255,255,255,0.65); }

.pricing-card__body { padding: 24px 28px 28px; }

.pricing-card__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pricing-card__features li {
  font-size: 0.875rem;
  color: var(--color-muted);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
}

.pricing-card__features li::before {
  content: '✓';
  color: var(--color-accent);
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.pricing-note {
  text-align: center;
  font-size: 0.82rem;
  color: var(--color-muted);
  margin-top: 24px;
}

.hire-form-wrap { max-width: 620px; }

/* === Coming Soon Badge === */
.badge--coming-soon {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 12px;
  background: rgba(202, 138, 4, 0.12);
  color: #ca8a04;
  border: 1px solid rgba(202, 138, 4, 0.2);
  border-radius: var(--radius-xs);
}

.badge--coming-soon::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #ca8a04;
  border-radius: 50%;
}
```

- [ ] **Step 13: Add responsive styles**

Append to the file:

```css
/* === Responsive === */
@media (max-width: 900px) {
  .app-grid { grid-template-columns: repeat(2, 1fr); }
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
  .story-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .container { padding: 0 20px; }
  .section { padding: 72px 0; }
  .hero { padding: 100px 0 80px; }

  .app-grid { grid-template-columns: 1fr; }
  .bento-grid { grid-template-columns: 1fr; }

  .stats-bar { flex-wrap: wrap; gap: 16px; }
  .stats-bar__item { border-right: none; padding: 0 20px; }

  .about-strip__inner { flex-direction: column; align-items: flex-start; }

  .nav__hide-mobile { display: none; }

  .about-hero { padding: 80px 0 60px; }
  .hire-hero { padding: 80px 0 60px; }

  .screenshot img { height: 360px; }

  .pricing-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 14: Verify the CSS file is complete**

Run: `wc -l css/style.css`
Expected: approximately 800-900 lines (a major reduction from the previous 2451 lines)

- [ ] **Step 15: Commit**

```bash
git add css/style.css
git commit -m "feat: complete CSS rewrite — dark premium theme replacing light+neon system"
```

---

### Task 2: Rewrite Homepage

**Files:**
- Rewrite: `index.html`

- [ ] **Step 1: Write the new index.html**

Write the complete homepage file. Key structural changes from current:
- Remove carousel, replace with 4-column app grid
- Add hero with gradient shimmer animation
- Add animated aurora glow in hero
- Add stats bar with gradient numbers
- Add bento grid values section
- Add about strip
- Simplified footer

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pixel Workshop — Focused iOS Apps</title>
  <meta name="description" content="Pixel Workshop builds focused iOS apps with no ads, no subscriptions, and no bloat. Eight apps. Zero compromise." />
  <meta property="og:title" content="Pixel Workshop — Focused iOS Apps" />
  <meta property="og:description" content="No ads. No subscriptions. Just software." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <header class="site-header">
    <div class="container">
      <nav class="nav">
        <a href="index.html" class="nav__logo">
          <div class="nav__logo-pixel">
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <rect x="1" y="1" width="3" height="3"/><rect x="6" y="1" width="3" height="3"/>
              <rect x="1" y="6" width="3" height="3"/><rect x="6" y="6" width="3" height="3"/>
            </svg>
          </div>
          Pixel Workshop
        </a>
        <ul class="nav__links">
          <li><a href="index.html">Apps</a></li>
          <li><a href="about.html">About</a></li>
          <li class="nav__hide-mobile"><a href="support/index.html">Support</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero__inner">
        <div class="hero__eyebrow animate-in">
          <span class="hero__eyebrow-dot"></span>
          App Studio — Richmond, VA
        </div>
        <h1 class="hero__title animate-in delay-1">No Ads. No Subscriptions.<br>Just Software.</h1>
        <p class="hero__subtitle animate-in delay-2">We build focused iOS apps that respect your time, your privacy, and your home screen. Eight apps. Zero compromise.</p>
        <div class="hero__cta animate-in delay-3">
          <a href="#apps" class="btn btn--primary">Explore Our Apps</a>
          <a href="about.html" class="btn btn--outline">About Us</a>
        </div>
        <div class="stats-bar animate-in delay-4">
          <div class="stats-bar__item">
            <div class="stats-bar__number">8</div>
            <div class="stats-bar__label">Apps Shipped</div>
          </div>
          <div class="stats-bar__item">
            <div class="stats-bar__number">0</div>
            <div class="stats-bar__label">Ads or Trackers</div>
          </div>
          <div class="stats-bar__item">
            <div class="stats-bar__number">4.5★</div>
            <div class="stats-bar__label">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="divider"></div>

  <section class="section" id="apps">
    <div class="container">
      <span class="section-label animate-in">Our Apps</span>
      <h2 class="section-title animate-in delay-1">The Collection</h2>
      <p class="section-desc animate-in delay-2">Games, tools, and experiences — each built to do one thing exceptionally well.</p>

      <div class="app-grid animate-in delay-3">
        <a href="apps/match-mint.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/matchmint_icon.svg" alt="Match Mint" /></div>
          <div class="app-card__category">Puzzle</div>
          <div class="app-card__name">Match Mint</div>
          <div class="app-card__desc">Memory puzzle with combos, special tiles, and daily leaderboards.</div>
        </a>
        <a href="apps/refract.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/refract_icon.png" alt="Refract" /></div>
          <div class="app-card__category">Puzzle</div>
          <div class="app-card__name">Refract</div>
          <div class="app-card__desc">Guide beams through mirrors and prisms with AR support.</div>
        </a>
        <a href="apps/forge-sets.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/forgesets_icon.png" alt="ForgeSets" /></div>
          <div class="app-card__category">AI Coach</div>
          <div class="app-card__name">ForgeSets</div>
          <div class="app-card__desc">AI-powered strength training, fully on-device.</div>
          <span class="app-card__badge">Coming Soon</span>
        </a>
        <a href="apps/retro-handheld.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/retrohandheld_icon.png" alt="Retro Handheld" /></div>
          <div class="app-card__category">Emulator</div>
          <div class="app-card__name">Retro Handheld</div>
          <div class="app-card__desc">Multi-system retro gaming with controller support and save states.</div>
        </a>
        <a href="apps/solve-to-snooze.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/solvetosnooze_icon.png" alt="Solve To Snooze" /></div>
          <div class="app-card__category">Productivity</div>
          <div class="app-card__name">Solve To Snooze</div>
          <div class="app-card__desc">Smart alarm challenges that actually get you out of bed.</div>
        </a>
        <a href="apps/calmly.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/calmy_icon.png" alt="Calmly" /></div>
          <div class="app-card__category">Focus Timer</div>
          <div class="app-card__name">Calmly</div>
          <div class="app-card__desc">Pomodoro timer with Apple Watch, streaks, and Siri Shortcuts.</div>
        </a>
        <a href="apps/constellation-restore-game.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/stars_icon.png" alt="Constellation Restore" /></div>
          <div class="app-card__category">Puzzle</div>
          <div class="app-card__name">Constellation Restore</div>
          <div class="app-card__desc">Restore star patterns with AR sky-finding.</div>
        </a>
        <a href="apps/warfront-1944.html" class="app-card">
          <div class="app-card__icon"><img src="assets/icons/warfront1944_icon.png" alt="Warfront: 1944" /></div>
          <div class="app-card__category">Strategy</div>
          <div class="app-card__name">Warfront: 1944</div>
          <div class="app-card__desc">WWII real-time strategy with base building and campaigns.</div>
          <span class="app-card__badge">Coming Soon</span>
        </a>
      </div>
    </div>
  </section>

  <div class="divider"></div>

  <section class="section">
    <div class="container">
      <span class="section-label animate-in">Our Approach</span>
      <h2 class="section-title animate-in delay-1">Built different, on purpose.</h2>

      <div class="bento-grid animate-in delay-2">
        <div class="bento-card">
          <span class="bento-card__emoji">🚫</span>
          <p class="bento-card__title">No Ads, Ever</p>
          <p class="bento-card__desc">Your experience is the product, not your attention. We don't run ads.</p>
        </div>
        <div class="bento-card">
          <span class="bento-card__emoji">🔒</span>
          <p class="bento-card__title">Privacy by Default</p>
          <p class="bento-card__desc">Your data stays on your device. We don't collect, track, or sell it.</p>
        </div>
        <div class="bento-card">
          <span class="bento-card__emoji">💰</span>
          <p class="bento-card__title">No Subscription Traps</p>
          <p class="bento-card__desc">Pay once or download free. No features hidden behind paywalls.</p>
        </div>
        <div class="bento-card">
          <span class="bento-card__emoji">⚡</span>
          <p class="bento-card__title">Built to Be Fast</p>
          <p class="bento-card__desc">Performance is a feature. Instant launch, smooth scrolling, minimal battery drain.</p>
        </div>
        <div class="bento-card">
          <span class="bento-card__emoji">🎯</span>
          <p class="bento-card__title">One Job, Done Right</p>
          <p class="bento-card__desc">Each app does one thing exceptionally well. No feature bloat.</p>
        </div>
        <div class="bento-card">
          <span class="bento-card__emoji">🌱</span>
          <p class="bento-card__title">Always Shipping</p>
          <p class="bento-card__desc">We listen to users and iterate fast. More apps are always in the works.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="about-strip">
    <div class="about-strip__inner">
      <div class="about-strip__text">
        <span class="section-label">About Pixel Workshop</span>
        <h2 class="about-strip__title">Built by a small team,<br>driven by quality.</h2>
        <p class="about-strip__desc">We're an app studio in Richmond, VA. We combine deliberate design with AI-assisted development to ship software that respects your time and your home screen.</p>
      </div>
      <div style="display:flex;gap:12px;flex-shrink:0;">
        <a href="about.html" class="btn btn--outline">About Us</a>
        <a href="support/index.html" class="btn btn--outline">Support</a>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand-block">
          <div class="footer__logo">
            <div class="footer__logo-pixel"></div>
            Pixel Workshop
          </div>
          <p class="footer__tagline">App studio. Thoughtful software, no compromise.</p>
        </div>
        <div class="footer__nav-group">
          <p class="footer__nav-heading">Apps</p>
          <ul class="footer__nav-links">
            <li><a href="apps/retro-handheld.html">Retro Handheld</a></li>
            <li><a href="apps/match-mint.html">Match Mint</a></li>
            <li><a href="apps/refract.html">Refract</a></li>
            <li><a href="apps/calmly.html">Calmly</a></li>
          </ul>
        </div>
        <div class="footer__nav-group">
          <p class="footer__nav-heading">Support</p>
          <ul class="footer__nav-links">
            <li><a href="support/index.html">Support Hub</a></li>
          </ul>
        </div>
        <div class="footer__nav-group">
          <p class="footer__nav-heading">Company</p>
          <ul class="footer__nav-links">
            <li><a href="about.html">About Us</a></li>
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms of Use</a></li>
          </ul>
        </div>
      </div>
      <p class="footer__copy">&copy; <span id="year"></span> Pixel Workshop LLC. All rights reserved. &middot; Richmond, VA</p>
    </div>
  </footer>

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(function(el) {
      observer.observe(el);
    });
  </script>

</body>
</html>
```

- [ ] **Step 2: Verify the homepage renders correctly**

Run: `python3 -m http.server 8000` and open http://localhost:8000

Check:
- Dark background renders
- Hero text has gradient shimmer animation
- Aurora glow drifts behind hero
- App grid shows all 8 apps in 4 columns
- All app icons load correctly
- Hover effects work on app cards (glow border, lift)
- Scroll animations trigger as you scroll down
- Footer renders correctly

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite homepage — dark premium design with app grid and animations"
```

---

### Task 3: Update About Page

**Files:**
- Modify: `about.html`

- [ ] **Step 1: Rewrite about.html for dark theme**

Keep the same content structure but update:
- Remove any `<style>` blocks or inline neon styles
- Use the shared dark CSS classes
- Update the Google Fonts link and OG meta tags
- Update footer to match homepage (simplified)
- Update tagline, fix "8 Apps Shipped" stat
- Hero title: "We Build Software Worth Keeping."
- CTA desc: "Our apps are available on the App Store. No account required, no strings attached."
- Use `btn--primary` for the main CTA button

The full HTML follows the same nav/footer pattern as the homepage. Keep all existing section structure (hero, story grid, build steps, values, CTA strip) — just ensure all classes match the new CSS.

- [ ] **Step 2: Verify about page renders correctly**

Check: dark background, section styling, stat cards with gradient numbers, build steps with gradient number badges.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: restyle about page for dark premium theme"
```

---

### Task 4: Update All App Detail Pages

**Files:**
- Modify: `apps/match-mint.html`, `apps/refract.html`, `apps/forge-sets.html`, `apps/retro-handheld.html`, `apps/solve-to-snooze.html`, `apps/calmly.html`, `apps/constellation-restore-game.html`, `apps/warfront-1944.html`

- [ ] **Step 1: Update apps/match-mint.html as the template**

Update the file with:
- Google Fonts link in head
- OG meta tags
- Dark theme body (no theme class needed, dark is default)
- Keep `class="app--matchmint"` on body for accent color
- Shared nav and footer matching homepage
- All existing content sections preserved (hero, screenshots, features, support CTA)
- All CSS classes matching the new stylesheet

- [ ] **Step 2: Apply the same pattern to the remaining 7 app pages**

For each file, apply the same structural updates as match-mint.html:
- `apps/refract.html` (body class: `app--refract`)
- `apps/forge-sets.html` (body class: `app--forge`)
- `apps/retro-handheld.html` (body class: `app--retro`)
- `apps/solve-to-snooze.html` (body class: `app--snooze`)
- `apps/calmly.html` (body class: `app--calmly`)
- `apps/constellation-restore-game.html` (body class: `app--constellation`)
- `apps/warfront-1944.html` (body class: `app--warfront`)

Keep each page's unique content (descriptions, screenshots, features) — only update the chrome (nav, footer, head, styling classes).

- [ ] **Step 3: Verify all app detail pages render correctly**

Spot-check at least 3 pages: one puzzle (match-mint), one utility (calmly), one coming-soon (warfront-1944).

- [ ] **Step 4: Commit**

```bash
git add apps/
git commit -m "feat: restyle all 8 app detail pages for dark premium theme"
```

---

### Task 5: Update Support Pages

**Files:**
- Modify: `support/index.html`, `support/match-mint.html`, `support/refract.html`, `support/forge-sets.html`, `support/retro-handheld.html`, `support/solve-to-snooze.html`, `support/calmly.html`, `support/constellation-restore-game.html`, `support/warfront-1944.html`

- [ ] **Step 1: Update support/index.html (support hub)**

Update with dark theme nav/footer, Google Fonts, clean support card grid using `.support-grid` and `.support-card` classes.

- [ ] **Step 2: Update all per-app support pages**

Each support page needs: dark theme nav/footer, Google Fonts, FAQ accordion styling using `.faq-list`, `.faq-item` classes. Contact form styling using `.contact-form`, `.form-group` classes. Keep all existing FAQ content.

- [ ] **Step 3: Verify support hub and at least one per-app support page**

- [ ] **Step 4: Commit**

```bash
git add support/
git commit -m "feat: restyle all support pages for dark premium theme"
```

---

### Task 6: Update Privacy, Terms, and Hire Pages

**Files:**
- Modify: `privacy.html`, `terms.html`, `hire.html`, `privacy/match-mint.html`, `privacy/refract.html`, `privacy/forge-sets.html`, `privacy/retro-handheld.html`, `privacy/solve-to-snooze.html`, `privacy/calmly.html`, `privacy/constellation-restore-game.html`, `privacy/warfront-1944.html`

- [ ] **Step 1: Update privacy.html and terms.html**

Dark theme nav/footer, Google Fonts, legal content using `.legal-content` class.

- [ ] **Step 2: Update all per-app privacy pages**

Same treatment as the main privacy page. Dark nav/footer, Google Fonts, `.legal-content` class.

- [ ] **Step 3: Update hire.html**

Remove the `<style>` block (all styles are now in the shared CSS). Dark theme nav/footer, Google Fonts. Keep all existing content (services, process, pricing, contact form).

- [ ] **Step 4: Verify privacy, terms, and hire pages**

- [ ] **Step 5: Commit**

```bash
git add privacy.html terms.html hire.html privacy/
git commit -m "feat: restyle privacy, terms, and hire pages for dark premium theme"
```

---

### Task 7: Final Verification and Cleanup

- [ ] **Step 1: Full site walkthrough**

Visit every page type and verify:
- Homepage: hero animations, app grid, values, about strip, footer
- About: all sections render, stats show correctly
- App detail: at least 3 pages, screenshots scroll, features grid works
- Support hub: card grid renders
- Support page: FAQ accordion works
- Privacy/Terms: legal content readable
- Hire: pricing cards, form renders

- [ ] **Step 2: Mobile responsive check**

Resize browser to 375px width and check:
- Nav collapses correctly (Support link hidden)
- App grid goes to single column
- Hero text scales down
- Stats bar wraps
- All sections are readable

- [ ] **Step 3: Remove stale files/code**

Check for any orphaned references:
- Old carousel JS in index.html should be removed (replaced by grid)
- Any remaining `theme-neon` references in CSS or HTML
- Any `neon-hero`, `neon-showcase`, `neon-stats-bar` class references

Run: `grep -r "theme-neon\|neon-hero\|neon-showcase\|carousel" --include="*.html" --include="*.css" -l`

Remove any found references.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup — remove stale neon/carousel references"
```
