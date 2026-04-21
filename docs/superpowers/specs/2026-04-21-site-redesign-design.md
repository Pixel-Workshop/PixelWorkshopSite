# Pixel Workshop Site Redesign — Design Spec

## Overview

Complete visual redesign of the Pixel Workshop website from its current mixed light/neon theme to a cohesive **Dark & Premium** aesthetic inspired by Linear, Vercel, and Raycast. The goal is to make the site look like it was built by a serious app studio, not a hobbyist.

## Design Direction

**Theme:** Dark & Premium
- Dark backgrounds (#050809 base) throughout the entire site
- Subtle purple-to-blue gradient accents (#7C3AED → #3B82F6)
- Glass/frosted effects on nav and interactive elements
- Restrained color — let the app icons be the pops of color
- Inter font for all typography

**Tone:** Confident, restrained, premium. No "indie" or "scrappy" language.

## Pages In Scope

All pages get the dark theme treatment:
1. **Homepage** (index.html) — full redesign
2. **About** (about.html) — restyle for dark theme
3. **App detail pages** (8 pages in apps/) — restyle for dark theme
4. **Support hub + per-app support** (9 pages in support/) — restyle for dark theme
5. **Privacy policy pages** (8 pages in privacy/ + privacy.html) — restyle for dark theme
6. **Terms** (terms.html) — restyle for dark theme
7. **Hire** (hire.html) — restyle for dark theme

## Homepage Design

### Navigation
- Sticky, glass-blur background (rgba dark with backdrop-filter)
- Logo left, links right (Apps, About, Support)
- Border-bottom: subtle rgba white line
- Height: 60px

### Hero Section
- Full-width dark section with centered text
- Background: animated radial gradient glow (purple/blue) that slowly drifts — creates living aurora effect
- Dot grid pattern overlay (static, subtle)
- Glass pill badge: "App Studio — Richmond, VA" with pulsing dot
- **Title:** "No Ads. No Subscriptions. Just Software." with gradient text shimmer animation (colors slowly shift)
- Subtitle: "We build focused iOS apps that respect your time, your privacy, and your home screen. Eight apps. Zero compromise."
- Two CTA buttons: gradient primary ("Explore Our Apps"), ghost outline ("About Us")
- Stats bar below CTAs: "8 Apps Shipped" | "0 Ads or Trackers" | "4.5★ Avg Rating" — numbers use gradient text

### App Grid Section
- Section label: "Our Apps"
- Title: "The Collection"
- Desc: "Games, tools, and experiences — each built to do one thing exceptionally well."
- **4-column grid** (2-col on mobile) showing all 8 apps
- Each card: glass background, subtle border, colored gradient icon placeholder, category label, app name, short description
- Hover effect: accent-color glow border, slight scale-up, icon shadow pulse
- "Coming Soon" badge on ForgeSets and Warfront: 1944
- Cards link to respective app detail pages
- Cards use actual app icons from assets/icons/

### Values Section
- Section label: "Our Approach"
- Title: "Built different, on purpose."
- **3-column bento grid** (1-col on mobile), 6 cards:
  1. No Ads, Ever
  2. Privacy by Default
  3. No Subscription Traps
  4. Built to Be Fast
  5. One Job, Done Right
  6. Always Shipping
- Each card: glass background, emoji icon, title, description
- Hover: border accent glow

### About Strip
- Gradient background band (purple/blue tinted)
- Left: section label + heading + description
- Right: "About Us" and "Support" ghost buttons

### Footer
- Dark background with subtle top border
- 4 columns: Brand, Apps (top 4), Support (hub + contact), Company (about, privacy, terms)
- Tagline: "App studio. Thoughtful software, no compromise."
- Copyright line at bottom

## Animations

### 1. Scroll-triggered fade-ins
- Elements with `.animate-in` fade up (opacity 0→1, translateY 28px→0) when 10% visible
- Staggered delays (.delay-1 through .delay-4) so elements cascade
- Easing: cubic-bezier(0.16, 1, 0.3, 1), duration 0.55s
- Already exists, keep and apply to all sections

### 2. Animated hero glow
- The radial gradient blob behind the hero title slowly drifts position and scale
- CSS animation, ~8s cycle, infinite loop
- Subtle movement — max ~30px drift in any direction
- Creates a "living aurora" effect

### 3. App card hover effects
- On hover: border transitions to app's accent color (with glow), card translateY(-4px), background brightens slightly
- Icon gets enhanced box-shadow
- Transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1)

### 4. Gradient text shimmer on hero title
- The background-gradient on the h1 slowly shifts via `background-position` animation
- ~6s cycle, infinite, linear
- Subtle — gradient just shifts between white/purple/blue range

## Other Pages — Dark Theme Treatment

### About Page
- Same dark background, nav, footer as homepage
- Hero section: dark with location badge, updated title "We Build Software Worth Keeping."
- Story section, build steps, values grid — all restyled with glass cards on dark backgrounds
- Stats cards use gradient numbers

### App Detail Pages
- Dark background throughout
- App hero: icon with colored glow shadow, breadcrumb, badges
- Screenshots section: horizontal scroll with dark padding
- Features grid: glass cards with emoji icons
- Support CTA section

### Support, Privacy, Terms Pages
- Dark background with light text
- Card-based layouts where applicable
- Forms (support pages) restyled for dark theme
- FAQ accordions restyled

### Hire Page
- Dark background
- Process steps and pricing cards restyled as glass cards
- Contact form restyled for dark

## Color System

```
--color-bg:           #050809
--color-bg-surface:   rgba(255, 255, 255, 0.03)
--color-bg-hover:     rgba(255, 255, 255, 0.06)
--color-text:         #FFFFFF
--color-text-muted:   rgba(255, 255, 255, 0.45)
--color-text-faint:   rgba(255, 255, 255, 0.25)
--color-border:       rgba(255, 255, 255, 0.06)
--color-border-hover: rgba(124, 58, 237, 0.25)
--color-accent:       #7C3AED
--color-accent-blue:  #3B82F6
--color-section-alt:  rgba(255, 255, 255, 0.02)
```

### Per-app accent colors (for card hover glows and detail pages)
```
Match Mint:            #059669
Refract:               #7c3aed
ForgeSets:             #ca8a04
Retro Handheld:        #16a34a
Solve To Snooze:       #db2777
Calmly:                #0891b2
Constellation Restore: #2563eb
Warfront: 1944:        #ea580c
```

## Typography

- **Font:** Inter (Google Fonts), fallback to system stack
- **Hero title:** clamp(2.8rem, 6vw, 4.5rem), weight 800, tracking -0.04em
- **Section titles:** clamp(1.6rem, 3.5vw, 2.4rem), weight 800, tracking -0.03em
- **Body:** 1rem, weight 400, line-height 1.6
- **Labels:** 0.72rem, weight 700, uppercase, tracking 0.12em
- **Small text:** 0.82-0.85rem

## Technical Approach

- Pure HTML/CSS/JS — no build tools, no frameworks (matches existing stack)
- All new styles go in css/style.css, replacing existing theme system
- Remove the `.theme-neon` system entirely — dark is now the default
- Page-specific styles can use `<style>` blocks in the page head where needed
- Animations are CSS-only (no JS animation libraries)
- Scroll-triggered fade-ins use existing IntersectionObserver JS pattern
