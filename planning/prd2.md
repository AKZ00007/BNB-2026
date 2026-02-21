# PRD-2: Frontend Style Migration — Source → Target

## 1. Objective

Migrate the **Apple-style scrollytelling UI** from the source reference project (`bnb-trail-frontend`) into the existing target LaunchPad AI project — upgrading the visual layer while **preserving 100% of existing functionality**.

> [!CAUTION]
> Source folder `bnb-trail-frontend/` is **READ-ONLY**. Zero modifications allowed.

---

## 2. Project Comparison & Compatibility Analysis

### 2.1 Version Matrix

| Dependency | Source (`bnb-trail-frontend`) | Target (`bnb-project-1`) | Conflict? | Resolution |
|---|---|---|---|---|
| **Next.js** | `16.1.6` | `^15.1.6` (15.5.12 installed) | ⚠️ MAJOR | Keep Target v15. Source components are compatible. |
| **React** | `19.2.3` | `^19.0.0` | ✅ Minor | Keep Target 19.0. API-compatible. |
| **Tailwind CSS** | `^4` (v4 `@theme` syntax) | `^3.4.17` (v3 `config.cjs`) | 🔴 BREAKING | Keep Target v3. Manually translate `@theme` vars → `tailwind.config.cjs` entries. |
| **Framer Motion** | `^12.34.3` | ❌ Not installed | 🔴 MISSING | **Install** `framer-motion@^11` (last v3-compatible stable). |
| **GSAP** | `^3.14.2` | ❌ Not installed | ⚠️ MISSING | Not needed — source only imports GSAP but doesn't use it. Skip. |
| **Lucide React** | `^0.575.0` | `^0.469.0` | ✅ OK | Keep Target version. Same icon API. |
| **Recharts** | ❌ Not installed | `^2.15.4` | ✅ OK | Keep in Target. Charts untouched. |
| **Wagmi/Viem** | ❌ Not installed | `^2.14.10` / `^2.21.56` | ✅ OK | Keep in Target. Wallet/deploy untouched. |
| **PostCSS** | `@tailwindcss/postcss@^4` | `postcss@^8.5.6` | ⚠️ | Keep Target PostCSS v8 (Tailwind v3). |
| **TypeScript** | `^5` | `^5` | ✅ OK | Same. |

### 2.2 Architecture Differences

| Aspect | Source | Target | Impact |
|---|---|---|---|
| **CSS System** | Tailwind v4 `@theme inline` + `oklch()` colors | Tailwind v3 `tailwind.config.cjs` + hex colors | Must translate colors manually |
| **File Structure** | `src/app/`, `src/components/` | `app/`, `components/` (no `src/`) | Adjust imports when porting |
| **Font** | Inter via `next/font/google` (`--font-inter`) | Inter + JetBrains Mono (same approach) | Compatible |
| **Dark Mode** | `className="dark"` on `<html>` | `className="dark"` on `<html>` | ✅ Identical |
| **Components** | 3 visual-only components | 15+ functional components | Add source components alongside existing ones |

### 2.3 Asset Analysis

| Asset | Source | Details |
|---|---|---|
| BNB Coin Frames | `public/image-frames/` | **240 PNG files**, ~320KB-1.4MB each, **total ~225MB** |
| Frame naming | `Smoothly_transition_from_..._{0001-0240}.png` | Sequential numbering, used for scroll-synced canvas animation |

> [!WARNING]
> **225MB of images** is very large for a web project. Consider compressing to WebP (would reduce to ~60-80MB) or loading only key frames for performance.

---

## 3. What We Extract from Source (READ-ONLY)

### 3.1 Color Palette

| Token | Source Hex | Current Target | Action |
|---|---|---|---|
| `brand-charcoal` (BG) | `#050505` | `#0A0A0F` (bg-base) | Add as new token |
| `brand-navy` (cards) | `#0A0A0C` | `#121218` (bg-surface) | Add as new token |
| `brand-gold` (primary) | `#F3BA2F` | `#F0B90B` (gold) | Keep target — nearly identical |
| `brand-cyan` (accent) | `#00D6FF` | Not in target | **Add** as `cyan` accent |
| `border` | `rgba(255,255,255,0.1)` | `rgba(255,255,255,0.1)` | ✅ Already matches |

### 3.2 Typography

| Property | Source Value | Target Value | Action |
|---|---|---|---|
| Font Family | Inter (sans) | Inter + JetBrains Mono | ✅ Already matches |
| Hero H1 | `text-6xl md:text-8xl font-bold tracking-tighter` | `text-4xl md:text-6xl font-bold` | Increase sizes to match source |
| Body text | `text-xl md:text-2xl text-white/60` | `text-text-secondary` | Update hero section text sizing |

### 3.3 Components to Port

| Component | Source File | What It Does | Migration Approach |
|---|---|---|---|
| **ScrollytellingCanvas** | `ScrollytellingCanvas.tsx` | Canvas-based 240-frame scroll animation | Port as new component, add to landing page |
| **NarrativeBlocks** | `NarrativeBlocks.tsx` | Scroll-linked text sections with Framer Motion transforms | Port as new component, replace landing hero |
| **Navbar** | `Navbar.tsx` | Scroll-aware floating nav with backdrop blur | Extract **style patterns** only, apply to existing `header.tsx` |

### 3.4 Visual Patterns to Apply Globally

| Pattern | Source Implementation | Apply To |
|---|---|---|
| **Gradient button** | Gold→Cyan gradient ring with dark inner fill | All primary CTAs across all pages |
| **Backdrop blur nav** | `bg-[#050505]/75 backdrop-blur-md` on scroll | Existing `header.tsx` |
| **Selection color** | `selection:bg-brand-cyan/30 selection:text-white` | `layout.tsx` body class |

---

## 4. Migration Tasks (Step-by-Step)

### Task 1: Install Framer Motion
**File:** `package.json`
- Run: `npm install framer-motion@^11`
- This is the only new dependency needed.
- **Do NOT upgrade** Next.js, React, Tailwind, or PostCSS.

### Task 2: Add Source Brand Colors to Tailwind Config
**File:** `tailwind.config.cjs`
- Add `brand-charcoal: '#050505'`
- Add `brand-navy: '#0A0A0C'` 
- Add `cyan` accent color scale with `'#00D6FF'` as DEFAULT
- Keep all existing colors intact (gold, purple, bg, text tokens)

### Task 3: Copy Image Frames to Target Public Folder
**Action:** Copy `bnb-trail-frontend/public/image-frames/` → `public/image-frames/`
- 240 PNG files, ~225MB total
- These are referenced by the ScrollytellingCanvas component

### Task 4: Port ScrollytellingCanvas Component
**New File:** `components/hero/ScrollytellingCanvas.tsx`
- Copy source component logic (canvas + scroll-based frame switching)
- Adjust imports: `@/lib/utils` path already exists in target
- Replace any Tailwind v4 classes with v3 equivalents
- No functionality changes

### Task 5: Port NarrativeBlocks Component
**New File:** `components/hero/NarrativeBlocks.tsx`
- Copy source component (Framer Motion scroll-linked text blocks)
- Update brand color classes: `text-brand-gold` → `text-gold`, `text-brand-cyan` → `text-cyan`
- Adjust CTA buttons to link to existing `/create` and `/templates` routes
- No functionality changes

### Task 6: Redesign Landing Page (`app/page.tsx`)
**File:** `app/page.tsx`
- Replace current static hero with ScrollytellingCanvas + NarrativeBlocks
- Set page height to `min-h-[400vh]` for scroll animation
- Keep all existing feature cards, steps, stats, footer sections
- Apply source typography sizing (larger headings, tighter tracking)
- Apply source color accents (cyan highlights alongside gold)

### Task 7: Upgrade Header with Scroll-Aware Blur
**File:** `components/layout/header.tsx`
- Add Framer Motion `useScroll` hook
- Apply backdrop-blur on scroll (transparent → `bg-[#050505]/75 backdrop-blur-md`)
- Add gradient ring button style to "Connect Wallet" CTA
- Keep all existing navigation links and dropdown intact

### Task 8: Apply Source Button Styles Globally
**Files:** All page files (`app/*/page.tsx`)
- Replace flat gold buttons with gradient ring style (gold→cyan border, dark fill)
- Apply to: Create Token CTA, Template "Use This" buttons, Launchpad "Participate" button
- Keep all onClick handlers and functionality identical

### Task 9: Update globals.css with Source Accent Utilities
**File:** `app/globals.css`
- Add `selection:bg-cyan-400/30` to body
- Add `brand-gradient` utility (gold → cyan instead of gold → purple)
- Keep all existing glass-card, animation, and border utilities

### Task 10: Verify All Pages
**Action:** Test every route compiles and renders correctly
- `/` — Landing with scroll animation
- `/create` — Wizard works, template apply works
- `/templates` — Gallery loads, modal opens
- `/amm` — Charts render, sliders work
- `/growth` — All Recharts render
- `/plu` — Milestone tracker works
- `/launchpad` — Cards and modal work
- `/explorer` — Table renders
- `/dashboard` — Configs load

---

## 5. Files Modified vs Created

| Action | File | Scope |
|---|---|---|
| **MODIFY** | `package.json` | Add framer-motion dependency |
| **MODIFY** | `tailwind.config.cjs` | Add brand-charcoal, brand-navy, cyan colors |
| **MODIFY** | `app/globals.css` | Add selection style, brand-gradient utility |
| **MODIFY** | `app/layout.tsx` | Add selection class to body |
| **MODIFY** | `app/page.tsx` | Replace hero with scroll animation, keep feature sections |
| **MODIFY** | `components/layout/header.tsx` | Add scroll-aware blur + gradient button style |
| **NEW** | `components/hero/ScrollytellingCanvas.tsx` | Ported from source |
| **NEW** | `components/hero/NarrativeBlocks.tsx` | Ported from source |
| **COPY** | `public/image-frames/` (240 files) | From source public folder |

> **Total:** 6 modified files, 2 new components, 240 image assets copied.

---

## 6. What DOES NOT Change (Protected)

- ❌ No changes to `bnb-trail-frontend/` (source folder)
- ❌ No Tailwind v3 → v4 upgrade
- ❌ No Next.js 15 → 16 upgrade
- ❌ No React version change
- ❌ No changes to: API routes, lib/ functions, types/, contracts/, tests/
- ❌ No changes to Recharts chart logic or data
- ❌ No changes to wallet connect, deploy flow, wizard steps
- ❌ No changes to any page's business logic

---

## 7. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| 225MB images slow page load | Medium | Lazy-load frames, show loading bar (source already has this) |
| Framer Motion SSR issues | Low | All animated components are `'use client'` |
| Tailwind v4 class syntax in source | Medium | Manually translate `@theme` → config entries before porting |
| Header scroll handler conflicts with existing nav | Low | Test dropdown + blur interaction |

---

## 8. Execution Order

```
Task 1 (framer-motion install) 
  → Task 2 (tailwind colors)
  → Task 3 (copy images)
  → Task 4 (ScrollytellingCanvas)
  → Task 5 (NarrativeBlocks) 
  → Task 6 (landing page redesign)
  → Task 7 (header upgrade)
  → Task 8 (button styles)
  → Task 9 (globals.css)
  → Task 10 (full verification)
```

Each task is independent enough to verify before moving to the next.
