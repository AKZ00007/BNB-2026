# Design & Theme Guide

## AI Token Launchpad Designer

**Version:** 1.0
**Design Philosophy:** Premium dark-mode fintech meets crypto-native confidence
**Last Updated:** February 18, 2026

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout Grid](#4-spacing--layout-grid)
5. [Glassmorphism & Surfaces](#5-glassmorphism--surfaces)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Borders & Dividers](#7-borders--dividers)
8. [Iconography](#8-iconography)
9. [Animation & Motion](#9-animation--motion)
10. [Component Design](#10-component-design)
11. [Screen-by-Screen Design Direction](#11-screen-by-screen-design-direction)
12. [Responsive Breakpoints](#12-responsive-breakpoints)
13. [Accessibility](#13-accessibility)
14. [Do's and Don'ts](#14-dos-and-donts)

---

## 1. Design Philosophy

### Core Aesthetic

The AI Token Launchpad Designer is a **premium, confidence-building tool** for BNB Chain founders. Every visual decision must reinforce two feelings:

> **"This platform knows what it's doing."** → Clean, data-rich, professional
> **"My token launch is in safe hands."** → Trust signals, smooth animations, zero visual clutter

### Design Pillars

| Pillar | What It Means | How It Shows Up |
|--------|--------------|-----------------|
| **Dark Elegance** | Deep, immersive dark backgrounds | Near-black base (`#0A0A0F`), no pure white text |
| **Data Confidence** | Numbers and charts feel premium | Clean data tables, glowing accent graphs, ample whitespace |
| **Glassmorphic Depth** | Layered, frosted-glass surfaces | Semi-transparent cards with blur, subtle borders |
| **BNB Identity** | Rooted in the BNB Chain ecosystem | BNB Gold primary accent, chain iconography |
| **Progressive Clarity** | Reveal complexity gradually | Wizard pattern, expandable sections, tooltips |

### Design Inspirations

Draw from these premium crypto/fintech products:

- **Linear** — Clean dark UI, subtle gradients, excellent typography
- **Vercel Dashboard** — Minimal, data-focused, glassmorphic cards
- **Dune Analytics** — Data-heavy but breathable, great chart design
- **Stripe** — Trust through polish, micro-interactions, smooth transitions
- **PancakeSwap** — BNB ecosystem familiarity, friendly but professional

---

## 2. Color System

### 2.1 Background Colors (Dark Mode)

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--bg-base` | `240° 20% 4%` | `#0A0A0F` | Page background, deepest layer |
| `--bg-surface` | `240° 15% 8%` | `#121218` | Cards, panels, containers |
| `--bg-surface-raised` | `240° 12% 12%` | `#1A1A22` | Hover states, elevated cards |
| `--bg-surface-overlay` | `240° 10% 16%` | `#24242E` | Modals, dropdowns, popovers |
| `--bg-input` | `240° 12% 10%` | `#16161E` | Input fields, text areas |

### 2.2 Primary Accent — BNB Gold

The signature gradient that anchors this product in the BNB ecosystem.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--gold-400` | `43° 96% 56%` | `#F0B90B` | BNB brand gold (primary CTA highlight) |
| `--gold-300` | `43° 100% 65%` | `#FFD54F` | Hover highlights, active states |
| `--gold-500` | `43° 90% 45%` | `#D4A30A` | Pressed states, subtle accents |
| `--gold-100` | `43° 80% 90%` | `#FFF3D0` | Gold tint for text emphasis |

### 2.3 Secondary Accent — Deep Purple

Creates depth and premium feel when blended with gold in gradients.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--purple-400` | `270° 70% 55%` | `#8B5CF6` | Secondary accent, links |
| `--purple-300` | `270° 80% 70%` | `#A78BFA` | Hover, lighter accent |
| `--purple-500` | `270° 65% 40%` | `#6D28D9` | Deep accent, gradient end |
| `--purple-900` | `270° 50% 15%` | `#1E0A3C` | Purple tint background |

### 2.4 Signature Gradient

```css
/* Primary hero gradient — BNB Gold → Deep Purple */
--gradient-hero: linear-gradient(135deg, #F0B90B 0%, #8B5CF6 50%, #6D28D9 100%);

/* Subtle card border gradient */
--gradient-border: linear-gradient(135deg, rgba(240, 185, 11, 0.3), rgba(139, 92, 246, 0.3));

/* Glass background with gradient tint */
--gradient-glass: linear-gradient(135deg, rgba(240, 185, 11, 0.05), rgba(139, 92, 246, 0.05));

/* Text gradient for headlines */
--gradient-text: linear-gradient(90deg, #F0B90B, #A78BFA);
```

### 2.5 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#22C55E` | Successful deploy, positive metrics, "Good" scenario |
| `--success-muted` | `rgba(34, 197, 94, 0.15)` | Success background tint |
| `--warning` | `#EAB308` | Caution states, "Normal" scenario |
| `--warning-muted` | `rgba(234, 179, 8, 0.15)` | Warning background tint |
| `--error` | `#EF4444` | Failed transactions, validation errors, "Bad" scenario |
| `--error-muted` | `rgba(239, 68, 68, 0.15)` | Error background tint |
| `--info` | `#3B82F6` | Informational tooltips, links |
| `--info-muted` | `rgba(59, 130, 246, 0.15)` | Info background tint |

### 2.6 Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#F1F1F4` | Headings, primary body text |
| `--text-secondary` | `#A1A1AA` | Descriptions, labels, secondary text |
| `--text-tertiary` | `#71717A` | Placeholders, disabled text |
| `--text-on-accent` | `#0A0A0F` | Text on gold buttons / accent backgrounds |

### 2.7 Chart Colors (Simulation Graphs)

| Scenario | Color | Hex | Line Style |
|----------|-------|-----|------------|
| **Good (+50%)** | Emerald Green | `#22C55E` | Solid, 2.5px |
| **Normal (Stable)** | Amber / Gold | `#F0B90B` | Solid, 2.5px |
| **Bad (-30%)** | Red | `#EF4444` | Dashed, 2px |
| **Grid Lines** | Zinc-800 | `#27272A` | Dotted, 0.5px |
| **Tooltip BG** | Surface + Blur | `rgba(18, 18, 24, 0.95)` | — |

---

## 3. Typography

### 3.1 Font Stack

```css
/* Primary — Clean, modern sans-serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace — For code, addresses, configs */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

> [!TIP]
> Load only weights 400, 500, 600, and 700 of Inter from Google Fonts to minimize load time. Use the `font-display: swap` strategy.

### 3.2 Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| **Display** | 48px / 3rem | 700 (Bold) | 1.1 | -0.02em | Hero headline only |
| **H1** | 36px / 2.25rem | 700 | 1.2 | -0.02em | Page titles |
| **H2** | 28px / 1.75rem | 600 (Semi) | 1.3 | -0.01em | Section headings |
| **H3** | 22px / 1.375rem | 600 | 1.4 | -0.01em | Card headings, subsections |
| **H4** | 18px / 1.125rem | 600 | 1.4 | 0 | Widget labels |
| **Body L** | 16px / 1rem | 400 | 1.6 | 0 | Primary body text |
| **Body M** | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text, table cells |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | 0.02em | Labels, timestamps, badges |
| **Overline** | 11px / 0.6875rem | 600 | 1.2 | 0.08em | Uppercase section labels |
| **Mono** | 13px / 0.8125rem | 400 | 1.5 | 0 | Wallet addresses, JSON config, tx hashes |

### 3.3 Gradient Text (Headlines)

For the hero headline and major page titles, use a gradient text effect:

```css
.gradient-text {
  background: linear-gradient(90deg, #F0B90B, #A78BFA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Use sparingly** — only for:
- Hero headline: *"End Token Crashes."*
- Dashboard greeting: *"Your Launches"*
- Success screen title: *"Deployed Successfully"*

---

## 4. Spacing & Layout Grid

### 4.1 Base Unit

All spacing uses a **4px base unit** (multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps (icon-to-label) |
| `--space-2` | 8px | Inline element spacing |
| `--space-3` | 12px | Small padding (badges, chips) |
| `--space-4` | 16px | Default padding (cards, inputs) |
| `--space-5` | 20px | Medium gaps |
| `--space-6` | 24px | Section gaps within cards |
| `--space-8` | 32px | Section separation |
| `--space-10` | 40px | Large section gaps |
| `--space-12` | 48px | Page-level section breaks |
| `--space-16` | 64px | Hero section vertical padding |
| `--space-20` | 80px | Major page section spacing |

### 4.2 Layout Grid

```
Max content width:  1280px (80rem)
Sidebar width:      280px (fixed on desktop, drawer on mobile)
Column gap:         24px
Page horizontal padding: 24px (desktop), 16px (mobile)
```

### 4.3 Page Layout Pattern

```
┌──────────────────────────────────────────────────┐
│  HEADER (64px height, sticky)                    │
│  Logo | Nav | [Connect Wallet]                   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────┐  ┌─────────────────────────────────┐ │
│  │        │  │                                 │ │
│  │  SIDE  │  │         MAIN CONTENT            │ │
│  │  BAR   │  │                                 │ │
│  │ 280px  │  │        max 960px                │ │
│  │        │  │                                 │ │
│  └────────┘  └─────────────────────────────────┘ │
│                                                  │
├──────────────────────────────────────────────────┤
│  FOOTER (minimal, 48px)                          │
└──────────────────────────────────────────────────┘
```

---

## 5. Glassmorphism & Surfaces

### 5.1 Glass Card (Primary Surface)

The defining visual element of this product. Every card, panel, and container uses this style:

```css
.glass-card {
  background: rgba(18, 18, 24, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
}

.glass-card:hover {
  background: rgba(26, 26, 34, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}
```

### 5.2 Glass Variants

| Variant | Opacity | Blur | Border Opacity | Usage |
|---------|---------|------|----------------|-------|
| **Default** | 60% | 16px | 6% | Standard cards |
| **Prominent** | 70% | 20px | 10% | Results dashboard cards, CTA areas |
| **Subtle** | 40% | 8px | 4% | Background panels, sidebar |
| **Overlay** | 80% | 24px | 12% | Modals, dialogs |

### 5.3 Gradient Border Cards (Special Moments)

For high-emphasis cards (config results, deploy success), use a gradient border:

```css
.gradient-border-card {
  position: relative;
  background: rgba(18, 18, 24, 0.8);
  border-radius: 16px;
  padding: 24px;
}

.gradient-border-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(240, 185, 11, 0.4), rgba(139, 92, 246, 0.4));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

---

## 6. Shadows & Elevation

Since this is a **dark UI**, shadows are subtle. Use **glow effects** instead for elevation cues:

| Level | CSS | Usage |
|-------|-----|-------|
| **None** | `box-shadow: none;` | Flat elements |
| **Low** | `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);` | Dropdown menus |
| **Medium** | `box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);` | Modals, popovers |
| **High** | `box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);` | Full-screen overlays |
| **Gold Glow** | `box-shadow: 0 0 20px rgba(240, 185, 11, 0.15);` | Primary CTA hover |
| **Purple Glow** | `box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);` | Active/focus states |
| **Success Glow** | `box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);` | Deploy success card |

---

## 7. Borders & Dividers

| Element | Style |
|---------|-------|
| **Card borders** | `1px solid rgba(255, 255, 255, 0.06)` |
| **Card borders (hover)** | `1px solid rgba(255, 255, 255, 0.12)` |
| **Input borders** | `1px solid rgba(255, 255, 255, 0.1)` |
| **Input borders (focus)** | `1px solid #F0B90B` (gold accent) |
| **Dividers** | `1px solid rgba(255, 255, 255, 0.06)` |
| **Table row separators** | `1px solid rgba(255, 255, 255, 0.04)` |

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small buttons, badges, chips |
| `--radius-md` | 10px | Inputs, dropdowns |
| `--radius-lg` | 16px | Cards, panels |
| `--radius-xl` | 20px | Modals, hero sections |
| `--radius-full` | 9999px | Pill buttons, avatars |

---

## 8. Iconography

### Icon System: Lucide React

- **Size**: 20px default, 16px for inline, 24px for navigation
- **Stroke Width**: 1.75px (slightly lighter than default for elegance)
- **Color**: Inherit from text color (`currentColor`)
- **Accent icons**: Use gold (`#F0B90B`) for action icons (deploy, launch)

### Key Icons to Use

| Context | Icon | Lucide Name |
|---------|------|-------------|
| Wallet connected | Wallet | `Wallet` |
| Launch / Deploy | Rocket | `Rocket` |
| AI / Config | Sparkles | `Sparkles` |
| Charts / Simulation | BarChart3 | `BarChart3` |
| Settings / Edit | Settings | `Settings` |
| Success | CheckCircle | `CheckCircle2` |
| Error | AlertCircle | `AlertCircle` |
| Info | Info | `Info` |
| Copy address | Copy | `Copy` |
| External link (BscScan) | ExternalLink | `ExternalLink` |
| Expand section | ChevronDown | `ChevronDown` |
| Anti-sniper | Shield | `ShieldCheck` |
| Vesting / Time | Clock | `Clock` |
| Token | Coins | `Coins` |

---

## 9. Animation & Motion

### 9.1 Motion Principles

- **Purposeful** — Every animation must communicate a state change
- **Fast** — Default duration is 200ms; never exceed 500ms for UI transitions
- **Subtle** — Users should feel the motion, not watch it
- **Consistent** — Same easing curve everywhere

### 9.2 Easing Curves

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);       /* Primary — exits fast, lands soft */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* Symmetric transitions */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy — confetti, success */
```

### 9.3 Animation Catalog

| Animation | Duration | Easing | Trigger | CSS / Framer Motion |
|-----------|----------|--------|---------|---------------------|
| **Fade In** | 300ms | ease-out | Page/section load | `opacity: 0 → 1`, `translateY: 8px → 0` |
| **Slide In (cards)** | 400ms | ease-out | Results appear | `opacity: 0 → 1`, `translateY: 20px → 0` |
| **Stagger children** | 400ms + 80ms/child | ease-out | List/grid items | Sequential delay on each child |
| **Pulse (CTA)** | 2s, infinite | ease-in-out | Deploy button idle | `scale: 1 → 1.02 → 1`, soft gold glow |
| **Skeleton shimmer** | 1.5s, infinite | linear | Loading states | Gradient sweep left-to-right |
| **Progress bar** | Variable | linear | AI processing | Width animation with % |
| **Confetti burst** | 3s, once | spring | Deploy success | Particle explosion from button |
| **Tooltip** | 150ms | ease-out | Hover | `opacity: 0 → 1`, `translateY: 4px → 0` |
| **Modal entrance** | 250ms | ease-out | Open | `opacity: 0 → 1`, `scale: 0.95 → 1` |
| **Chart line draw** | 800ms | ease-out | Graph render | SVG stroke-dashoffset animation |
| **Counter roll** | 600ms | ease-out | Social proof | Number counting up animation |
| **Checkbox / Toggle** | 200ms | spring | State change | Scale + color transition |

### 9.4 Loading States

> [!IMPORTANT]
> **Never show a blank screen.** Every async operation must have a loading state.

**AI Processing (the most visible loading state):**

```
┌──────────────────────────────────────────┐
│                                          │
│     ⬡ ⬡ ⬡  (animated hexagon dots)      │
│                                          │
│   "Analyzing 50+ successful launches..." │
│   ━━━━━━━━━━━━━━━━━━━━━░░░░░  68%       │
│                                          │
│   Step 2 of 3: Optimizing config...      │
│                                          │
└──────────────────────────────────────────┘
```

- Cycle through 3 progress messages:
  1. *"Analyzing 50+ successful launches..."*
  2. *"Optimizing your tokenomics config..."*
  3. *"Running price simulations..."*
- Progress bar is **estimated** (not real), advances smoothly
- Use the **gold → purple gradient** for the progress fill

---

## 10. Component Design

### 10.1 Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `linear-gradient(135deg, #F0B90B, #D4A30A)` | `#0A0A0F` (dark) | None | Main CTAs: "Launch Your Token", "Deploy" |
| **Secondary** | `transparent` | `#F1F1F4` | `1px solid rgba(255,255,255,0.12)` | Secondary actions: "Re-simulate", "Save" |
| **Ghost** | `transparent` | `#A1A1AA` | None | Tertiary: "Cancel", "Skip" |
| **Destructive** | `rgba(239,68,68,0.15)` | `#EF4444` | `1px solid rgba(239,68,68,0.3)` | "Delete Config" |
| **Success** | `rgba(34,197,94,0.15)` | `#22C55E` | `1px solid rgba(34,197,94,0.3)` | "View on BscScan" |

**Button sizes:**

| Size | Height | Padding (H) | Font Size | Radius |
|------|--------|-------------|-----------|--------|
| **Small** | 32px | 12px | 13px | 6px |
| **Default** | 40px | 16px | 14px | 10px |
| **Large** | 48px | 24px | 16px | 12px |
| **Hero** | 56px | 32px | 16px, bold | 14px |

### 10.2 Input Fields

```css
.input {
  height: 44px;
  background: rgba(22, 22, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0 16px;
  color: #F1F1F4;
  font-size: 14px;
  transition: border-color 200ms ease-out, box-shadow 200ms ease-out;
}

.input:focus {
  border-color: #F0B90B;
  box-shadow: 0 0 0 3px rgba(240, 185, 11, 0.1);
  outline: none;
}

.input::placeholder {
  color: #71717A;
}
```

### 10.3 Chat Bubbles (Wizard)

| Type | Background | Border Radius | Alignment |
|------|-----------|---------------|-----------|
| **User message** | `linear-gradient(135deg, rgba(240,185,11,0.15), rgba(139,92,246,0.1))` | `16px 16px 4px 16px` | Right |
| **AI response** | `rgba(18, 18, 24, 0.8)` | `16px 16px 16px 4px` | Left |
| **System info** | `rgba(59, 130, 246, 0.1)` | `12px` | Center |

### 10.4 Chips / Tags (Goal Templates)

```css
.chip {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  background: rgba(240, 185, 11, 0.08);
  border: 1px solid rgba(240, 185, 11, 0.2);
  border-radius: 9999px;
  color: #FFD54F;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.chip:hover {
  background: rgba(240, 185, 11, 0.15);
  border-color: rgba(240, 185, 11, 0.4);
}
```

### 10.5 Data Table (Config Display)

| Element | Style |
|---------|-------|
| **Header row** | `background: rgba(255,255,255,0.03)`, uppercase overline text, `#71717A` |
| **Data cells** | Body M (14px), `#F1F1F4`, mono font for numbers |
| **Row hover** | `background: rgba(255,255,255,0.03)` |
| **Row dividers** | `1px solid rgba(255,255,255,0.04)` |
| **Highlight cells** | Gold text (`#F0B90B`) for key metrics (TGE %, LP %) |

### 10.6 Badges / Status Indicators

| Status | Background | Text | Dot Color |
|--------|-----------|------|-----------|
| **Draft / Saved** | `rgba(161,161,170,0.1)` | `#A1A1AA` | `#71717A` |
| **Testnet** | `rgba(59,130,246,0.1)` | `#3B82F6` | `#3B82F6` |
| **Mainnet / Live** | `rgba(34,197,94,0.1)` | `#22C55E` | `#22C55E` |
| **Failed** | `rgba(239,68,68,0.1)` | `#EF4444` | `#EF4444` |
| **Pro** | `linear-gradient(135deg, rgba(240,185,11,0.15), rgba(139,92,246,0.1))` | Gradient text | — |

### 10.7 Tooltips

```css
.tooltip {
  background: rgba(18, 18, 24, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #A1A1AA;
  max-width: 240px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

---

## 11. Screen-by-Screen Design Direction

### Screen 1: Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER  [Logo]     Home | Features | Docs    [Connect]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────── Hero Section (Full-width gradient bg) ──────┐ │
│  │                                                         │ │
│  │  End Token Crashes.  ← gradient text (gold→purple)      │ │
│  │  Launch with AI-Backed Confidence.  ← #A1A1AA           │ │
│  │                                                         │ │
│  │  [  🚀 Launch Your Token  ]  ← gold button, pulsing    │ │
│  │                                                         │ │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ← social proof          │ │
│  │  │ 1.2K │  │ 99%  │  │ 50+  │  counters                │ │
│  │  │Configs│  │Deploy│  │Launches│                         │ │
│  │  └──────┘  └──────┘  └──────┘                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌── Feature 1 ──┐ ┌── Feature 2 ──┐ ┌── Feature 3 ──┐    │
│  │ ✨ AI Config  │ │ 📊 Simulations│ │ 🚀 1-Click    │    │
│  │               │ │               │ │    Deploy      │    │
│  └───────────────┘ └───────────────┘ └───────────────┘    │
│                                                             │
│  [ Embedded demo video (16:9, rounded corners) ]            │
│                                                             │
│  [  Launch Your Token  ]  ← repeated CTA                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design notes:**
- Hero background: Mesh gradient radiating from center — faint `#F0B90B` (gold) and `#6D28D9` (purple) with radial fade
- Social proof counters: Counter with roll-up animation on scroll
- Feature cards: Glass cards with icon (gold accent), title, 1-line desc
- Demo video: Rounded-lg, subtle border, play button overlay

### Screen 2: Wizard (Goals Input)

**Design notes:**
- **Layout**: Split-panel — chat on left (60%), helper panel on right (40%)
- **Progress stepper**: 3 dots at top with connecting line, active step = gold dot
- **Chat input**: Large textarea at bottom, send button with gold accent
- **Goal chips**: Row of pill-shaped chips above input: `"Raise $50k"`, `"Stable 30 days"`, `"Anti-sniper"`
- **Chat bubbles**: User messages right-aligned with gradient tint; AI responses left-aligned with glass surface
- **Form toggle**: Tab switch at top — `Chat | Form` — active tab underline in gold
- **Form fields**: Clean label-above-input layout, sliders with gold handles

### Screen 3: Results Dashboard

**Design notes:**
- **Config table**: Glass card at top, data in tabular format, key values highlighted in gold mono text
- **Simulation graphs**: 3 Recharts line graphs in a responsive grid, each in a glass card
  - X-axis: Days (30 or 90)
  - Y-axis: Price ($)
  - Color-coded by scenario (green / gold / red dashed)
  - Gradient fill below the line (very subtle: 5% opacity)
  - Active tooltip on hover with glass background
- **"Why this?" cards**: Expandable accordion items — collapsed shows 1-line summary, expanded shows full explanation with historical references
- **Deploy CTA area**: Prominent gradient-border card at bottom with "Deploy to Testnet" button and network selector

### Screen 4: Deploy Flow

**Design notes:**
- **Step progress**: Horizontal 4-step stepper: Mint → Vesting → LP → Success
  - Completed step = gold checkmark
  - Active step = pulsing gold spinner
  - Pending step = dim circle
- **Gas estimation card**: Glass card showing estimated gas in BNB + USD equivalent
- **Transaction cards**: Stacked glass cards with: tx hash (mono, truncated), status badge, BscScan external link
- **Success state**: Confetti particle burst, green glow on success card, BscScan link as a prominent green button

### Screen 5: User Dashboard

**Design notes:**
- **Config cards**: Grid of glass cards (3-column on desktop, 1 on mobile)
  - Card shows: token name (H4), creation date (caption), status badge (Saved / Testnet / Mainnet)
  - Hover: subtle elevation increase, border brightens
  - Quick actions via icon buttons at bottom of card
- **Empty state**: Illustrated icon (gold + purple), text: *"No launches yet. Create your first config."*, CTA button
- **Usage bar** (Free Tier): `3/3 configs used` — progress bar fading gold → purple
- **Upgrade banner**: Gradient-border card with "Upgrade to Pro" CTA

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|-----------|-------|-----------------|
| **Desktop** | ≥ 1280px | Full layout: sidebar + main content |
| **Laptop** | ≥ 1024px | Sidebar collapses to icons; content expands |
| **Tablet** | ≥ 768px | No sidebar; hamburger menu; single-column charts |
| **Mobile** | ≥ 375px | Full single-column; bottom-sheet modals |

### Responsive Rules

- **Desktop-first**: Design for 1440px wide, scale down
- **Navigation**: Horizontal nav on desktop → hamburger drawer on mobile
- **Charts**: Side-by-side on desktop → stacked vertically on mobile
- **Wizard**: Split-panel on desktop → tabbed panels on mobile
- **Modals**: Centered overlay on desktop → bottom-sheet on mobile
- **Tables**: Horizontal scroll on mobile with sticky first column
- **Touch targets**: Minimum 44px × 44px on mobile

---

## 13. Accessibility

### 13.1 Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Color contrast** | All text meets WCAG AA (4.5:1 for body, 3:1 for large) |
| **Keyboard navigation** | All interactive elements reachable via Tab, activated via Enter/Space |
| **ARIA labels** | All buttons, icons, and interactive elements have descriptive `aria-label` |
| **Focus indicators** | Visible focus ring: `2px solid #F0B90B` with `3px offset` |
| **Screen reader** | Semantic HTML (`nav`, `main`, `section`, `article`), proper heading hierarchy |
| **Reduced motion** | Respect `prefers-reduced-motion` — disable all animations |
| **High contrast mode** | Toggle in settings — increase border/text contrast, remove glass blur |

### 13.2 Focus Ring Style

```css
:focus-visible {
  outline: 2px solid #F0B90B;
  outline-offset: 3px;
  border-radius: 4px;
}
```

---

## 14. Do's and Don'ts

### ✅ Do

- Use the **gold → purple gradient** as the signature brand element
- Keep backgrounds **deep and dark** — never go lighter than `#1A1A22` for surfaces
- Use **glassmorphism consistently** — every elevated surface is glass
- Add **micro-animations** to every state change (hover, focus, load, success)
- Use **mono font** for all blockchain data (addresses, tx hashes, config values)
- Leave **generous whitespace** — let the data breathe
- Use **semantic colors** consistently (green = good, gold = neutral, red = bad)
- Show **loading states** for every async operation
- Use **staggered animations** when multiple items appear at once

### ❌ Don't

- Don't use **pure white** (`#FFFFFF`) anywhere — max is `#F1F1F4` for primary text
- Don't use **pure black** (`#000000`) backgrounds — min is `#0A0A0F`
- Don't use **more than 2 gradients** on any single screen
- Don't animate anything **longer than 500ms** for UI transitions
- Don't use **thin fonts** (weight < 400) — readability suffers on dark backgrounds
- Don't place **text directly on gradients** without a glass/dark overlay
- Don't use **generic blue links** — use gold (`#F0B90B`) or purple (`#A78BFA`)
- Don't use **box shadows for elevation** — use glow effects and border opacity changes
- Don't use **rounded-full** on cards — reserve for pills, badges, and avatars only
- Don't make **charts colorful for decoration** — each color must mean something

---

## Quick Reference: CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --bg-base: #0A0A0F;
  --bg-surface: #121218;
  --bg-surface-raised: #1A1A22;
  --bg-surface-overlay: #24242E;
  --bg-input: #16161E;

  /* Brand */
  --gold-400: #F0B90B;
  --gold-300: #FFD54F;
  --gold-500: #D4A30A;
  --purple-400: #8B5CF6;
  --purple-300: #A78BFA;
  --purple-500: #6D28D9;

  /* Semantic */
  --success: #22C55E;
  --warning: #EAB308;
  --error: #EF4444;
  --info: #3B82F6;

  /* Text */
  --text-primary: #F1F1F4;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;
  --text-on-accent: #0A0A0F;

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 400ms;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #F0B90B 0%, #8B5CF6 50%, #6D28D9 100%);
  --gradient-text: linear-gradient(90deg, #F0B90B, #A78BFA);
  --gradient-border: linear-gradient(135deg, rgba(240,185,11,0.4), rgba(139,92,246,0.4));
}
```

---

*This document is the single source of truth for all visual decisions across the AI Token Launchpad Designer. Every component, screen, and interaction should be validated against this guide before implementation.*
