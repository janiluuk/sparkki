# Verso — Design System & Style Instructions
> For coding agents. This file is the canonical design reference in this repo (`DESIGN_SYSTEM.md`).
> These rules override any generic defaults. Read before writing a single line of UI code.
> **2026 update:** expanded IA, navigation, footer, delivery strip, and status tokens are documented in **Spec addendum (Verso — 2026)** at the end of this file.

---

## Philosophy

Verso's visual identity is **dark, confident, and precise**. The aesthetic is inspired by high-craft developer tools and music software — not SaaS dashboards. It should feel like something a skilled person built with intention, not a template.

**One rule above all others:** if it looks like a generic Tailwind site, it's wrong. Every screen should feel unmistakably Verso.

---

## Colours

Define these as CSS custom properties on `:root`. Never hardcode hex values in component code — always reference variables.

```css
:root {
  /* Brand greens */
  --g:       #1DF5A0;   /* Primary accent — CTAs, active states, icons */
  --g2:      #0BBF78;   /* Hover state for green elements */
  --g3:      #085041;   /* Dark green — text on light green fills */

  /* Amber — secondary accent, warnings, DIY difficulty */
  --amber:   #F5A623;

  /* Backgrounds — layered dark surfaces */
  --bg:      #080C0A;   /* Page background */
  --bg2:     #0E1410;   /* Section background (footer, sidebar) */
  --bg3:     #141C18;   /* Card background */
  --bg4:     #1A2420;   /* Input background, nested elements */

  /* Borders */
  --border:  rgba(29, 245, 160, 0.12);   /* Default border */
  --border2: rgba(29, 245, 160, 0.25);   /* Hover / emphasis border */

  /* Text */
  --text:    #E8F2EE;   /* Primary text */
  --muted:   #7A9A8E;   /* Secondary text, descriptions */
  --dim:     #3D5248;   /* Tertiary — timestamps, metadata, labels */

  /* Semantic — status badges only */
  --status-pending:  #F5A623;
  --status-progress: #6495ED;
  --status-done:     #1DF5A0;
  --status-cancel:   #FF6B6B;
}
```

**Colour rules:**
- `--g` is used for: primary CTAs, active nav links, featured card borders, check icons, accent text, eyebrow lines, progress fills, stat deltas.
- `--amber` is used for: medium difficulty badges, warning states, pending status, secondary accent when green would clash.
- Never use `--g` and `--amber` on the same element.
- Never use white (`#ffffff`) as a background. The lightest surface is `--bg4`.
- Status colours (`--status-*`) are for badge fills only — 12–15% opacity fill, full colour text.
- Red (`#FF6B6B`) appears only for destructive actions and error states.
- No purples, blues, or teals anywhere outside the Discord block (which uses Discord's own `#5865F2`).

---

## Typography

### Font stack

```css
/* Display / headings */
font-family: 'Syne', sans-serif;

/* Body / UI */
font-family: 'DM Sans', sans-serif;

/* Monospace — labels, metadata, code, IDs, timestamps */
font-family: 'DM Mono', monospace;
```

Load from Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
```

Tailwind config:
```js
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      display: ['Syne', 'sans-serif'],
      sans:    ['DM Sans', 'sans-serif'],
      mono:    ['DM Mono', 'monospace'],
    },
  },
}
```

### Type scale

| Role | Font | Size | Weight | Colour | Notes |
|---|---|---|---|---|---|
| Hero title | Syne | 64–80px | 800 | `--text` | `letter-spacing: -2px` |
| Section title | Syne | 36–48px | 800 | `--text` | `letter-spacing: -1px` |
| Card title | Syne | 18–24px | 700 | `--text` | |
| Price / stat | Syne | 32–52px | 800 | `--text` or `--g` | `letter-spacing: -2px` |
| Body | DM Sans | 14–16px | 300–400 | `--muted` | `line-height: 1.65` |
| Body elder | DM Sans | 16–18px | 400 | `--text` | Minimum on public-facing pages |
| Eyebrow | DM Mono | 10–11px | 400 | `--g` | `letter-spacing: 0.15em`, uppercase |
| Label / meta | DM Mono | 10–12px | 400 | `--muted` or `--dim` | `letter-spacing: 0.08em`, uppercase |
| Nav link | DM Sans | 14px | 400 | `--muted` | hover → `--text` |
| Button | DM Sans | 14–15px | 600–700 | depends | |
| Table data | DM Mono | 11–13px | 400 | `--text` or `--muted` | |
| Badge | DM Mono | 10–11px | 400–500 | varies | `letter-spacing: 0.05em` |

**Typography rules:**
- `Syne 800` is reserved for display text — hero, section titles, prices, stat numbers. Never use it for body or captions.
- `DM Mono` is used for anything that is data, not prose: IDs, dates, counts, category labels, eyebrows, filter pills, badge text, monospace metadata.
- `DM Sans 300` (light) is the default body weight. Use 400 for important body copy. Never 500+ for body paragraphs.
- Minimum body size on public pages: **18px**. Elder accessibility requirement — non-negotiable.
- Minimum size anywhere: **11px** (DM Mono labels only).
- Negative letter-spacing (`-1px` to `-2px`) on all Syne display text. Positive letter-spacing (`0.08em`–`0.15em`) on all DM Mono labels.

---

## Spacing

Use an 8px base unit. All spacing is a multiple of 8.

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Icon gap, badge padding |
| `sm` | 8px | Internal card gap, tight rows |
| `md` | 16px | Card padding sides, grid gap |
| `lg` | 24px | Section internal padding |
| `xl` | 32px | Card padding (featured) |
| `2xl` | 48px | Section vertical padding |
| `3xl` | 64px | Page section padding |

**Tailwind mapping:**
- `gap-2` = 8px, `gap-3` = 12px, `gap-4` = 16px, `gap-6` = 24px, `gap-8` = 32px, `gap-12` = 48px, `gap-16` = 64px
- Section padding: `px-12 py-16` (48px / 64px)
- Nav padding: `px-12 py-5` (48px / 20px)
- Card padding: `p-7` (28px) standard, `p-9` (36px) featured

---

## Borders & Surfaces

```css
/* Standard border — all cards, dividers, inputs */
border: 1px solid var(--border);           /* rgba(29,245,160,0.12) */

/* Hover / emphasis border */
border: 1px solid var(--border2);          /* rgba(29,245,160,0.25) */

/* Featured card border — green, full opacity */
border: 1px solid var(--g);

/* Section dividers */
border-top: 1px solid var(--border);
```

**Border rules:**
- All borders are `1px solid`. Never `2px` except featured cards and focus rings.
- Border radius: `8px` (badges, inputs, small elements), `12px` (admin table, stat cards), `16px` (page cards, main sections).
- Tailwind: `rounded-lg` = 8px, `rounded-xl` = 12px, `rounded-2xl` = 16px — match these to context.
- No box shadows anywhere. Depth is achieved through layered background colours (`--bg` → `--bg2` → `--bg3` → `--bg4`), not shadows.
- No gradients on backgrounds except the Discord block (which uses a fixed indigo gradient — see Components section).

---

## Layout

### Site structure

```
fixed: BackgroundCanvas (Three.js, z-index: -1, pointer-events: none)
──────────────────────────────────────
<nav>          height: ~64px, sticky, backdrop-blur
<main>         flex-1, overflow content
<footer>       4-column grid, bg: --bg2
<footer-bottom> 1px border-top, flex row space-between
```

### Max width

```css
.container { max-width: 1100px; margin: 0 auto; padding: 0 48px; }
```

### Grid patterns

```css
/* Pricing cards, support tiers */
grid-template-columns: repeat(3, 1fr);

/* App tiles */
grid-template-columns: repeat(4, 1fr);

/* Guide cards */
grid-template-columns: repeat(3, 1fr);

/* Admin stats */
grid-template-columns: repeat(4, 1fr);

/* Footer */
grid-template-columns: 1fr 1fr 1fr 1fr;

/* Admin layout */
display: flex;
.sidebar { width: 220px; flex-shrink: 0; }
.body    { flex: 1; }
```

Always use `gap-4` (16px) between cards, `gap-3` (12px) between tight grids.

---

## Components

### Navigation

```html
<nav class="site-nav">
  <!-- Logo: Syne 800 24px, --g colour for "Verso" brand mark -->
  <div class="logo">Ver<span style="color: var(--text)">so</span></div>

  <!-- Links: DM Sans 14px --muted, hover → --text -->
  <ul class="links">...</ul>

  <!-- CTA: bg --g, text --bg, 14px 600, radius 8px, px-5 py-2.5 -->
  <a class="cta">Tilaa →</a>
</nav>
```

Sticky. `backdrop-filter: blur(12px)`. Border-bottom `1px solid var(--border)`. Background `rgba(8,12,10,0.92)` for scroll overlay.

---

### Eyebrow label

Used above every section title. Always `DM Mono`, always `--g`, always uppercase, always `letter-spacing: 0.15em`.

```html
<div class="eyebrow">
  <!-- Optional leading line: 20px wide, 1px height, bg --g, inline-block -->
  Palvelu — Helsinki
</div>
```

```css
.eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--g);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.eyebrow::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 1px;
  background: var(--g);
}
```

---

### Buttons

```css
/* Primary */
.btn-primary {
  background: var(--g);
  color: var(--bg);
  padding: 14px 28px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.2px;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--muted);
  padding: 14px 28px;
  border-radius: 10px;
  border: 1px solid var(--border2);
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 15px;
  transition: all 0.15s;
}
.btn-secondary:hover {
  color: var(--text);
  background: rgba(29, 245, 160, 0.05);
}

/* Small / inline */
.btn-sm {
  padding: 9px 18px;
  font-size: 13px;
  border-radius: 8px;
}
```

Minimum button height: **48px** on all public-facing pages (elder accessibility). Admin buttons can be 36px.

---

### Cards

```css
/* Standard card */
.card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--border2); }

/* Featured card (pricing, support) */
.card-featured {
  background: rgba(29, 245, 160, 0.04);
  border: 1px solid var(--g);
  border-radius: 16px;
  padding: 28px;
  position: relative;
}

/* Featured badge */
.card-featured::before {
  content: 'Suosituin';
  position: absolute;
  top: -12px;
  left: 24px;
  background: var(--g);
  color: var(--bg);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
  font-family: 'DM Mono', monospace;
  letter-spacing: 0.05em;
}
```

---

### Badges / pills

```css
.badge {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  padding: 3px 9px;
  border-radius: 99px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* Pre-installed */
.badge-pre { background: rgba(29,245,160,0.15); color: var(--g); }

/* Difficulty */
.badge-easy   { color: var(--g);     border: 1px solid rgba(29,245,160,0.3); }
.badge-medium { color: var(--amber); border: 1px solid rgba(245,166,35,0.3); }
.badge-hard   { color: #FF6B6B;      border: 1px solid rgba(255,107,107,0.3); }

/* Status */
.badge-pending  { background: rgba(245,166,35,0.15);  color: var(--status-pending); }
.badge-progress { background: rgba(100,149,237,0.15); color: var(--status-progress); }
.badge-done     { background: rgba(29,245,160,0.12);  color: var(--status-done); }
.badge-cancel   { background: rgba(255,107,107,0.12); color: var(--status-cancel); }

/* Filter pill (active/inactive) */
.pill         { border: 1px solid var(--border2); color: var(--muted); }
.pill.active  { background: rgba(29,245,160,0.12); color: var(--g); border-color: var(--g); }
```

---

### Speed bar (homepage hero widget)

```css
.speed-block {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  width: 340px;
}

/* Track */
.speed-track {
  height: 6px;
  background: var(--bg4);
  border-radius: 99px;
  overflow: hidden;
}

/* Before: red fill at 92% */
.fill-hdd { background: #FF6B6B; width: 92%; height: 100%; border-radius: 99px; }

/* After: green fill at 14% */
.fill-ssd { background: var(--g); width: 14%; height: 100%; border-radius: 99px; }
```

The verdict box below the bars:
```css
.speed-verdict {
  margin-top: 20px;
  padding: 14px;
  background: rgba(29,245,160,0.06);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--g);
  line-height: 1.5;
}
```

Animate the fill bars on page load using `IntersectionObserver`. CSS `transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1)` from `width: 0` to final value.

---

### Step strip (1-2-3)

```css
.steps-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--border);
}
.step-item {
  padding: 36px 40px;
  border-right: 1px solid var(--border);
  position: relative;
}
.step-item:last-child { border-right: none; }

/* Giant faded number */
.step-num {
  font-family: 'Syne', sans-serif;
  font-size: 52px;
  font-weight: 800;
  color: rgba(29, 245, 160, 0.08);
  line-height: 1;
  letter-spacing: -2px;
  margin-bottom: 12px;
}

/* Icon — top right, 20px, 30% opacity */
.step-icon {
  position: absolute;
  top: 36px;
  right: 36px;
  font-size: 20px;
  opacity: 0.3;
}
```

---

### Pricing card

```css
.card-tier { /* DM Mono, 11px, --muted, uppercase, letter-spacing 0.1em */ }

.card-price {
  font-family: 'Syne', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 4px;
}
.card-price sup { font-size: 22px; color: var(--muted); font-weight: 400; vertical-align: super; }

.card-saving { /* DM Mono, 11px, --g */ }

/* Feature row */
.card-feature {
  font-size: 13px;
  color: var(--muted);
  padding: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 300;
}
.card-feature::before { content: '✓'; color: var(--g); font-size: 12px; }
```

---

### Guide card

```css
.guide-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}

/* Green underline reveal on hover */
.guide-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--g);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s;
}
.guide-card:hover::after { transform: scaleX(1); }
.guide-card:hover { border-color: var(--border2); }

.guide-num { /* DM Mono, 10px, --dim, uppercase */ }
.guide-title { /* Syne 700, 17px, --text, line-height 1.3 */ }
```

---

### App tile

```css
.app-tile {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}
.app-tile:hover,
.app-tile.open {
  border-color: var(--g2);
  background: rgba(29, 245, 160, 0.05);
}

/* Icon container */
.app-icon {
  width: 40px; height: 40px;
  background: var(--bg4);
  border-radius: 10px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.app-name { /* DM Sans 500, 12px, --text */ }
.app-cat  { /* DM Mono, 10px, --dim, uppercase, letter-spacing 0.06em */ }
```

**Alternative panel** — expands below the selected tile row. Never a modal.

```css
.alt-panel {
  background: var(--bg3);
  border: 1px solid var(--g);
  border-radius: 16px;
  padding: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}

.alt-item {
  background: var(--bg4);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 10px;
}
.alt-item-name { /* DM Sans 600, 14px, --text */ }
.alt-item-desc { /* DM Sans 300, 12px, --muted, line-height 1.5 */ }
```

---

### Support cards

Same structure as pricing cards. Featured card (`border: 1px solid var(--g)`) is the "Täysi tuki" tier.

Include/exclude rows:
```css
.support-item {
  font-size: 13px;
  color: var(--muted);
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-weight: 300;
}
.support-item-icon { color: var(--g); }      /* ✓ */
.support-item-cross { color: var(--dim); }   /* ✗ */
```

---

### Discord block

The only place with a non-dark-green palette. Use a fixed indigo gradient — do not make it responsive to the rest of the design tokens.

```css
.discord-block {
  background: linear-gradient(135deg, #2C2F5B 0%, #1E1F3A 100%);
  border: 1px solid rgba(88, 101, 242, 0.3);
  border-radius: 16px;
  padding: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* Channel list */
.discord-channel {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #5865F2;
}
.discord-channel::before { content: '# '; }

/* CTA button */
.discord-btn {
  background: #5865F2;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}
```

---

### Admin panel

#### Sidebar

```css
.admin-sidebar {
  width: 220px;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  flex-shrink: 0;
}

.admin-nav-item {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.12s;
}
.admin-nav-item.active {
  color: var(--g);
  background: rgba(29, 245, 160, 0.06);
  border-left-color: var(--g);
}

/* Section labels in sidebar */
.admin-section-label {
  padding: 16px 20px 6px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

#### Stat cards

```css
.stat-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}
.stat-label { /* DM Mono, 10px, --muted, uppercase */ }
.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -1px;
}
.stat-delta { /* DM Mono, 11px, --g for positive */ }
```

Colour the stat value when it has semantic meaning:
- Pending count → `color: var(--amber)`
- Done count → `color: var(--g)`
- Revenue → `color: var(--text)` (neutral)

#### Order table

```css
.order-table {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

/* Header row */
.order-table-header {
  background: var(--bg4);
  border-bottom: 1px solid var(--border);
  /* DM Mono, 10px, --dim, uppercase, letter-spacing 0.1em */
}

/* Data row */
.order-row {
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}
.order-row:hover { background: rgba(29, 245, 160, 0.03); }
.order-row:last-child { border-bottom: none; }

/* Column text styles */
.order-id    { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--dim); }
.order-name  { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); }
.order-tier  { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--muted); }
.order-price { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text); }
.order-date  { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--dim); }
```

---

## Three.js background (BackgroundCanvas)

**Behaviour spec:**
- 80–120 `IcosahedronGeometry(0.3, 0)` meshes
- Random sizes: scale 0.3–1.5 uniform
- `MeshBasicMaterial` with `wireframe: true`
- 85% of meshes: `color: 0x1DF5A0`, `opacity: 0.06–0.18`
- 15% of meshes: `color: 0xF5A623`, `opacity: 0.05–0.10`
- Slow drift: velocity `±0.003` units/frame on x and y only, z = 0
- Slow rotation: `rotation.x += 0.002`, `rotation.y += 0.001` per frame
- Wrap at canvas edges: reverse velocity when `|position.x| > 22` or `|position.y| > 17`
- Camera: `PerspectiveCamera(60)`, `position.z = 20`, no movement
- Lighting: `AmbientLight` only
- Renderer: `{ alpha: true, antialias: true }` — transparent background
- Cap at 30fps: skip frame if `now - lastFrame < 33ms`
- Pause on `document.hidden`
- Destroy + dispose on component unmount
- `prefers-reduced-motion: reduce` → pause all animation, render one centered static shape
- Canvas CSS: `position: fixed; inset: 0; z-index: -1; pointer-events: none`
- Never use `OrbitControls` or any user-interactive camera

---

## Motion & transitions

```css
/* Standard hover transition */
transition: all 0.15s ease;

/* Border colour only */
transition: border-color 0.2s ease;

/* Speed bar fill (scroll-triggered) */
transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);

/* Guide card underline */
transition: transform 0.2s ease;

/* Guide card underline keyframe start */
transform: scaleX(0);
transform-origin: left;
```

**Animation rules:**
- No bounce, spring, or physics on any UI element (those belong to Three.js only).
- No full-page transitions or route animations in MVP.
- The speed bar fill is the hero animation — it must feel satisfying. Use the cubic-bezier above, not `ease` or `linear`.
- All interactive hover states should respond in `≤150ms`.
- Respect `prefers-reduced-motion`: wrap all `@keyframes` usage in `@media (prefers-reduced-motion: no-preference)`.

---

## Tailwind config summary

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      colors: {
        g:      '#1DF5A0',
        g2:     '#0BBF78',
        g3:     '#085041',
        amber:  '#F5A623',
        bg:     '#080C0A',
        bg2:    '#0E1410',
        bg3:    '#141C18',
        bg4:    '#1A2420',
        text:   '#E8F2EE',
        muted:  '#7A9A8E',
        dim:    '#3D5248',
        statusPending:  '#F5A623',
        statusProgress: '#6495ED',
        statusDone:     '#1DF5A0',
        statusCancel:   '#FF6B6B',
      },
      borderColor: {
        DEFAULT: 'rgba(29,245,160,0.12)',
        em:      'rgba(29,245,160,0.25)',
        brand:   '#1DF5A0',
      },
    },
  },
  plugins: [],
} satisfies Config
```

> **Implementation note:** In this repo, theme colours are wired to the same tokens as `:root` in `app/globals.css` (e.g. `canvas` → `var(--bg)`) so Tailwind utilities stay aligned with the “no hardcoded hex in components” rule. Prefer utilities like `bg-card`, `text-ink`, and `border-em` from `tailwind.config.ts`.

---

## Accessibility rules

These are non-negotiable and apply to every component.

- Minimum body font size on public pages: **18px** (`text-lg` in Tailwind)
- Minimum font size anywhere: **11px** (DM Mono labels only)
- Minimum tap target size: **48×48px** on all public pages, 36px in admin
- All interactive elements must have a visible focus ring:
  ```css
  :focus-visible {
    outline: 2px solid var(--g);
    outline-offset: 2px;
  }
  ```
- All images must have `alt` attributes. Decorative images use `alt=""`
- All form inputs must have a visible `<label>` or `aria-label`
- Colour contrast: `--text` on `--bg3` meets WCAG AA. `--muted` on `--bg` does not — never use `--muted` for body text that users need to read.
- Skip-to-content link at the top of the root layout (visually hidden, visible on focus)
- Never rely on colour alone to convey status — always pair with text or icon

---

## Do not

- Use `Inter`, `Roboto`, `Arial`, or any system font stack
- Use `box-shadow` for depth (use layered backgrounds instead)
- Use gradients except on the Discord block
- Use any colour outside the defined palette
- Use `--muted` for body text that requires reading (contrast too low)
- Use `--g` for large text blocks (too bright, causes eye strain)
- Use `position: sticky` inside scrollable containers (causes rendering bugs)
- Add `cursor: pointer` to non-interactive elements
- Use `100vh` on mobile (use `100dvh` or `min-h-screen` with Tailwind)
- Use `!important` anywhere
- Hardcode colours inline — always reference CSS variables or Tailwind tokens

---

## Spec addendum (Verso — 2026)

This addendum incorporates the expanded product IA and component specs. **Brand in this repository is Verso** (`verso.fi`). Where the source template referred to another codename, routes below point at what exists in code today.

### Route map — target vs current

| Area | Target IA | Current Verso path |
|------|-----------|-------------------|
| Home | `/` | `/` |
| Service + wizard | `/palvelu` | `/palvelu` |
| Info hub (sidebar) | `/tietoa`, `/tietoa/linux`, … | `/info` (single hub until split) |
| App alternatives | `/tietoa/sovellukset/windows`, `/mac` | `/sovellukset` (add OS tabs + `sourceOs` in data when ready) |
| DIY | `/itse` | `/itse` |
| About | `/meista` | `/about` |
| Community | `/meista/yhteiso` | `/yhteiso` |
| Support | `/tuki` | `/tuki` |
| Care subscription | `/care` | *planned* |
| Compatibility DB | `/koneet` | *planned* |
| Social tier | `/vire-for-good` | *planned — rename to `/verso-for-good` when shipping* |

### Primary navigation (implemented)

1. **Palvelu** → `/palvelu`  
2. **Tietoa ▾** — dropdown: Linux / vakaus / huolia → `/info`; Sovellukset Windows & Mac → `/sovellukset`  
3. **Tee itse** → `/itse`  
4. **Meistä ▾** — Yritys → `/about`; Yhteisö & Discord → `/yhteiso`  
5. **Tuki** → `/tuki`  
6. **Tilaa →** (CTA, right) → `/palvelu`  

Dropdown shell: `background: var(--bg3)`, `border: 1px solid var(--border2)`, `border-radius: 10px`, `padding: 8px`, `min-width: 200px`. Row links: `padding: 7px 12px`, `border-radius: 6px`, hover `color: var(--g)` and `background: rgba(29,245,160,0.08)`. Implemented with native `<details>` / `<summary>` for keyboard + mobile without extra JS.

### Delivery strip (homepage, below nav)

Five equal columns, `border-top` + `border-bottom` on strip, `background: var(--bg2)`. Each cell: icon (green), title (`--text`, 13px semibold), subtitle (`--muted`, 13px light). Copy order: nouto kotoa → postitus → omatoiminen tuonti → 2–5 arkipäivää → 90 pv tuki. Implemented as `DeliveryStrip` + `DeliveryStripGate` (home only).

### Footer (four columns)

Grid: `1.5fr` brand column + three equal columns on large screens. **Palvelu:** miten toimii (`/#steps-title`), hinnat (`/#pricing-title`), B2B (`/palvelu/b2b`), tilaa (`/palvelu`). **Tietoa:** Linux Mintistä (`/info`), sovellukset (`/sovellukset`), tee itse (`/itse`), yhteisö (`/yhteiso`). **Yhteys:** email, tuki (`/tuki`), tietosuoja (`/tietosuoja`).

### Order wizard — HDD removal step (planned)

Card between delivery and support: amber-tinted border `rgba(245,166,35,0.25)`, background `rgba(245,166,35,0.07)`. Three radio options: Vire removes HDD (+€20, default), customer removes (+€0), keep HDD (+€0, not recommended). **Not implemented until pricing + Prisma + Stripe reflect the fee.**

### Delivery wizard cards (planned)

Three-column selectable cards with green border on selection; copy as in spec. Align with `DeliveryMethod` in Prisma when shipping postage surcharges.

### Info hub `/tietoa` layout (planned)

Two-column: fixed `220px` sidebar (`--bg2`), body `padding: 32px 36px`. Mirror admin sidebar pattern.

### Common concerns `/tietoa/huolia` (planned)

Two-column concern cards: question row with amber icon, answer body `13px` `--muted`, `strong` in `--g`.

### Vire Care `/care` (planned)

Three-tier cards; timeline Day 75 / 88 / 90 / 91+. Use status colours for timeline cells.

### Compatibility `/koneet` (planned)

Search bar + model cards + status badges (`badge-g` / `badge-a` / `badge-r`).

### Starter kit + Verso for Good (planned)

Specs as in source template; use `--g` for featured prices, no extra gradients except Discord block and documented “for good” banner gradient.

### Status badge tokens

Use `statusPending`, `statusProgress`, `statusDone`, `statusCancel` from Tailwind (mapped to `--status-*`) for badge **text**; fills at 12–15% opacity per colour rules in **Colours** section above.
