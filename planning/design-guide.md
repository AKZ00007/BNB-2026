# acme.ai — Complete Reverse-Engineering Audit
> **Site:** https://saas-magicui.vercel.app/  
> **Stack:** Next.js 14 (App Router) · Tailwind CSS · Radix UI · Framer Motion · Magic UI · Lucide Icons · Inter font  
> **Purpose:** Full UX audit, design system extraction, animation docs, and no-code/low-code rebuild guide.

---

## TABLE OF CONTENTS

1. [Site Map & Information Architecture](#1-site-map--information-architecture)
2. [UX & Onboarding Funnel](#2-ux--onboarding-funnel)
3. [Visual Design System](#3-visual-design-system)
4. [Components Catalogue](#4-components-catalogue)
5. [Imagery, Icons & Media](#5-imagery-icons--media)
6. [Animations & Interactions](#6-animations--interactions)
7. [Front-End Architecture](#7-front-end-architecture)
8. [No-Code Section-by-Section Build Specs](#8-no-code-section-by-section-build-specs)
9. [Responsive Breakpoints](#9-responsive-breakpoints)
10. [Master Design Token Sheet (CSS)](#10-master-design-token-sheet)
11. [Tailwind Config](#11-tailwind-config)
12. [Animation Recipes (Copy-Paste Code)](#12-animation-recipes)
13. [Framer Build Guide](#13-framer-build-guide)
14. [Webflow Build Guide](#14-webflow-build-guide)
15. [React / Next.js Component Starters](#15-react--nextjs-component-starters)
16. [Final Rebuild Checklist](#16-final-rebuild-checklist)
17. [Recommended NPM Packages](#17-recommended-npm-packages)

---

## 1. SITE MAP & INFORMATION ARCHITECTURE

### Pages

| URL | Page | Purpose |
|---|---|---|
| `/` | Homepage | Full marketing landing page |
| `/blog` | Blog Index | Article listing grid |
| `/blog/introducing-acme-ai` | Blog Post | Single article with hero image, author, MDX content |
| `/login` | Login | Auth form (Google OAuth + GitHub OAuth + email/password) |
| `/signup` | Signup | Registration (first name, last name, email, password + GitHub OAuth) |

### Homepage Section Order (Top → Bottom)

1. **Navbar** — Logo + Nav links + Login + CTA
2. **Hero** — Announcement pill + H1 + subtitle + CTA + hero app screenshot
3. **Logo Bar** — "Trusted by leading teams" infinite-scroll marquee
4. **Problem** — 3-column pain-point cards (white bg)
5. **Solution** — 2×2 feature cards with app mockups (gray bg)
6. **How It Works** — 3-step accordion list + persistent right screenshot
7. **Testimonial Highlight** — Full-width centered quote slider with arrows
8. **Features** — 4-tab switcher + full-width app screenshot
9. **Testimonials Wall** — Infinite marquee card grid (3 rows, auto-scroll)
10. **Pricing** — Monthly/Yearly toggle + 3 pricing cards
11. **FAQ** — Accordion
12. **Blog Preview** — Single blog card
13. **CTA Banner** — Light pink full-width strip
14. **Footer** — 4-column links + copyright

### Nav Dropdown Menus (Radix NavigationMenu)

**Features dropdown** (480px wide, white card, shadow):
- Left col: Featured card "AI-Powered Automation" — pink bg `#FFF0F0`, grid icon, subtitle
- Right col (3 items): Task Automation · Workflow Optimization · Intelligent Scheduling

**Solutions dropdown** (560px wide, 2×3 grid):
- For Small Businesses · Enterprise · Developers · Healthcare · Finance · Education

---

## 2. UX & ONBOARDING FUNNEL

### Primary User Flow



### All CTAs & Entry Points

| Location | CTA Text | Destination |
|---|---|---|
| Navbar right | "Get Started for Free" | /signup |
| Navbar right | "Login" | /login |
| Hero center | "Get started for free" | /signup |
| Hero sub-note | "7 day free trial. No credit card required." | Trust signal only |
| Announcement pill | "Introducing Acme.ai" | /blog/introducing-acme-ai |
| Pricing (each plan) | "Subscribe" | /# (placeholder) |
| CTA Banner | "Get started for free" | /signup |

### Engagement Hooks
- Announcement pill: drives blog content discovery
- "No credit card required" removes sign-up friction
- Testimonial slider pauses scroll for social proof
- Pricing toggle creates perceived yearly savings
- FAQ accordion builds trust before final conversion
- `support@acme.ai` email link at FAQ bottom reduces last-mile anxiety

---

## 3. VISUAL DESIGN SYSTEM

### Color System

| Role | Hex | Usage |
|---|---|---|
| Primary Red | `#E8001D` | CTAs, icons, card titles, section labels, active states |
| Primary Red Hover | `#C0001A` | Button hover |
| Primary Light (Blush) | `#FEE2E2` | Icon circle backgrounds, announcement badge bg |
| Primary Ultra Light | `#FFF0F0` | CTA banner bg, announcement pill bg |
| Page Background | `#FFFFFF` | Default white |
| Surface Alt | `#F9FAFB` | Blog section, solution section bg |
| Surface 2 | `#F3F4F6` | Solution card backgrounds |
| Text Primary | `#111827` | All headings, nav links |
| Text Secondary | `#374151` | Body text, blog post text |
| Text Muted | `#6B7280` | Subtitles, captions, descriptions |
| Text Faint | `#9CA3AF` | Dates, "billed monthly", footer copyright |
| Border | `#E5E7EB` | Card borders, input borders, dividers |
| Star Yellow | `#F59E0B` | 5-star ratings in testimonials |
| Announcement Orange | `#FF8A65` | Left badge inside announcement pill |

### Typography

| Element | Font | Weight | Size | Line-Height |
|---|---|---|---|---|
| Logo wordmark | Inter | 700 | 16px | — |
| H1 Hero | Inter | 800 | clamp(52px, 5.5vw, 80px) | 1.1 |
| H2 Section titles | Inter | 800 | 44–48px | 1.2 |
| H3 Card titles | Inter | 700 | 20–24px | 1.3 |
| Body text | Inter | 400 | 16px | 1.6 |
| Section labels | Inter | 700 | 12px | — | ALL CAPS, letter-spacing 0.1em, red |
| Buttons | Inter | 600 | 14–15px | — |
| Price display | Inter | 800 | 56px | 1.0 |
| Caption / meta | Inter | 400 | 13–14px | — |
| Nav links | Inter | 500 | 15px | — |

### Spacing Scale

| Token | Value |
|---|---|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |
| space-20 | 80px |
| space-24 | 96px |

- **Section padding:** `py-24` (96px) standard; `py-16` (64px) smaller sections
- **Card padding:** `p-6` (24px)
- **Grid gap:** `gap-8` (32px) for 3-col; `gap-6` (24px) for pricing
- **Max content width:** 1200px centered
- **Navbar height:** 64px sticky

### Border Radius

| Token | Value | Used on |
|---|---|---|
| radius-sm | 6px | Inputs |
| radius-md | 8px | Chips, tags |
| radius-lg | 12px | Standard cards |
| radius-xl | 16px | Large cards, hero screenshot |
| radius-2xl | 20px | Pricing cards, auth card |
| radius-full | 9999px | Buttons, pills, avatars, badges |

---

## 4. COMPONENTS CATALOGUE

### Buttons

| Variant | Style |
|---|---|
| **Primary** | `bg-[#E8001D] text-white rounded-full px-6 py-3 font-semibold` + grid icon prefix; hover: `bg-[#C0001A] scale-[1.02]` transition 200ms |
| **Outline** | `border border-[#E5E7EB] text-gray-900 rounded-full px-6 py-2.5`; hover: `bg-gray-50` |
| **Subscribe Popular** | Primary style, `w-full` |
| **Subscribe Regular** | Outline style, `w-full` |
| **OAuth** | White, full-width, border, icon + label |
| **Auth Submit** | Primary style, `w-full rounded-md h-10` |

### Cards

| Type | Style |
|---|---|
| Problem card | No border/bg; 48px red soft-circle icon; bold title 20px; gray body 15px |
| Solution card | `bg-[#F3F4F6] rounded-2xl p-6`; red title; gray body; app thumbnail at bottom |
| Feature tab | Horizontal; active = 2px red bottom border; icon in red soft circle; crossfades content |
| Pricing (Basic/Enterprise) | `bg-white border-[#E5E7EB] border rounded-2xl p-8` |
| Pricing (Pro/Popular) | `border-2 border-[#E8001D] rounded-2xl`; red "★ Popular" badge top-right |
| Testimonial wall card | `bg-white border rounded-xl p-5 shadow-sm`; avatar + name + role + stars + quote |
| Testimonial highlight | Centered; large `❝` icon; italic quote; company logo; name + role below |
| Blog card | `bg-white border rounded-xl`; 16:9 thumbnail; date + title + excerpt |

### Navigation
- Navbar: sticky top, white, `border-bottom: 1px solid #E5E7EB`, z-100
- Features dropdown: 480px white card, shadow-md, rounded-xl, 2-col layout
- Solutions dropdown: 560px white card, 2×3 text grid
- Dropdown open animation: `opacity 0→1 + translateY(-8px→0)`, 200ms ease-out
- Logo: 24px SVG grid icon + "acme.ai" bold wordmark

### Forms

**Login:**
- 380px centered card, shadow-sm, border, rounded-2xl, p-8
- OAuth buttons (Google + GitHub) → divider → email + password inputs → submit
- Inputs: `border-[#E5E7EB] rounded-md h-10`; focus: red border + blush ring
- "Forgot your password?" red right-aligned link

**Signup:**
- Same card; 2-col row (first + last name); email; password
- "Create an account" red button + "Sign up with GitHub" outline button

### Accordion (FAQ)
- Radix UI `Accordion` — `type="single" collapsible`
- `border rounded-xl` per item; chevron rotates 180° on open
- Height: 0 → auto, 300ms ease-out
- Max-width 720px centered

### Pricing Toggle
- Radix UI `Switch` — pill, `bg-[#E8001D]` when checked
- "Monthly" and "Yearly" labels either side; React state swaps prices

---

## 5. IMAGERY, ICONS & MEDIA

### Hero App Screenshot
- **What:** 3-panel email client UI (sidebar / inbox list / email preview)
- **Style:** Flat UI product mockup (not a photo)
- **Source size:** ~1880×1000px | **Display width:** min(940px, 90vw) | **Ratio:** ~19:10
- **Styles:** `border border-[#E5E7EB] rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]`
- **Fade:** Bottom gradient overlay `from-white to-transparent h-32` fades into page bg
- **Content:** "Alicia Koch" account, Inbox 128 unread, thread from "William Smith"

### Logo Marquee Strip
- 8 logos: Spotify · Google · Microsoft · Amazon · Netflix · YouTube · Instagram · Uber
- Style: `filter: grayscale(100%) opacity(50%)`, height 28px each
- Continuous left-scroll, seamless loop (2× duplicated array)

### Icon Style
- Library: **Lucide React** (outline style, 1.5px stroke)
- Sizes: 16px inline / 20px nav / 24px section icons
- Color: `#E8001D` inside blush circles or on white bg
- Icon circle: `w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center`

### Solution Section Mockups
- Same email UI at ~300px wide inside solution cards
- Dotted grid texture on one card:
  `background-image: radial-gradient(#D1D5DB 1px, transparent 1px); background-size: 16px 16px`

### Blog Post Hero
- OG-style image: laptop icon + bold title + small screenshot
- White bg, illustration-style, ~16:9, `border rounded-2xl`

---

## 6. ANIMATIONS & INTERACTIONS

### Hero Text Blur-In
- **Trigger:** Page load
- **Target:** Each word of H1 individually
- **Effect:** `opacity: 0, filter: blur(12px)` → `opacity: 1, filter: blur(0px)`
- **Timing:** 700ms ease-out, stagger 80ms per word
- **Library:** Framer Motion

### Announcement Pill
- `opacity: 0, translateY: -8px` → `opacity: 1, translateY: 0`, 400ms, delay 0ms

### Hero CTA + Subtitle
- Blur-in, same as H1, delay: subtitle 400ms, CTA 600ms, trial note 750ms

### Hero Screenshot
- `opacity: 0, translateY: 40px` → `opacity: 1, translateY: 0`, 800ms ease-out, delay 800ms

### Logo Marquee
- CSS `@keyframes marquee {





### Logo Marquee
- **Trigger:** Continuous auto-play on page load
- **Effect:** `translateX(0) → translateX(-50%)`, linear, infinite
- **Timing:** 30s per loop
- **Hover:** `animation-play-state: paused`
- **Mask edges:** `mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent)`

### Scroll Entrance Animations (all sections)
- **Trigger:** Intersection Observer — element enters viewport (`margin: -80px`)
- **Effect:** `opacity: 0, translateY: 20px` → `opacity: 1, translateY: 0`
- **Timing:** 500ms ease-out
- **Stagger:** 100ms between sibling cards (Problem: 3 cards; Solution: 4 cards)

### Testimonials Wall (3-Row Marquee)
- 3 horizontal marquee rows stacked vertically, gap-4 between rows
- Row 1: scrolls LEFT, 35s
- Row 2: scrolls RIGHT, 40s (opposite direction creates visual depth)
- Row 3: scrolls LEFT, 30s
- Hover pauses the entire row
- Same seamless-loop technique as logo marquee (2× duplicated array)

### Testimonial Highlight Slider
- **Trigger:** Click prev/next arrow buttons
- **Effect:** Crossfade — `opacity: 0 → 1`, 300ms ease-in-out
- **Controls:** Two circle arrow buttons (40×40px, `border rounded-full`)
- **Auto-advance:** None — manual only
- 7 slides total (one per logo company: Google, Microsoft, Amazon, Netflix, YouTube, Instagram, Uber)

### Features Tab Switcher
- **Trigger:** Click on tab
- **Effect:** Active tab gets `border-bottom: 2px solid #E8001D`; screenshot below crossfades
- **Timing:** 300ms ease transition on screenshot opacity
- 4 tabs: AI-Powered Dashboard · Natural Language Processing · Predictive Analytics · Automated Reporting

### How It Works Accordion
- Radix Accordion, `type="single"` — only one step open at a time
- Active step: red 4px left vertical bar, description visible
- Inactive: collapsed description, lighter text color
- Click: 300ms height ease-out expansion
- Right-side screenshot: either static or crossfades per step

### Pricing Toggle
- Radix UI Switch
- `transition: background 200ms` on the pill
- `transition: transform 200ms` on the thumb sliding left→right
- React state change instantly swaps price numbers and billing note text

### FAQ Accordion
- Radix UI Accordion `type="single" collapsible`
- Chevron icon: `transition: transform 300ms` — rotates 180° on open
- Height: CSS grid trick (`grid-rows: 0fr → 1fr`) or Radix built-in `data-[state=open]` height animation

### Nav Dropdown
- **Trigger:** Click (not hover) — confirmed via Radix NavigationMenu
- **Effect:** `opacity: 0, translateY: -8px` → `opacity: 1, translateY: 0`, 200ms ease-out
- **Close:** Click outside or click same trigger again

### Button Hover States
- Primary red: `background-color → #C0001A; transform: scale(1.02)`, 200ms ease
- Outline: `background-color → #F9FAFB`, 150ms ease
- Blog card: `box-shadow increase + scale(1.01)`, 200ms ease

---

## 7. FRONT-END ARCHITECTURE

### Tech Stack (Inferred)

| Layer | Technology | Evidence |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | `/blog/[slug]` dynamic route, Vercel deployment, SSG |
| Styling | **Tailwind CSS** | Utility class rhythm, spacing scale matches Tailwind defaults |
| UI Primitives | **Radix UI** | `radix-«R...»` IDs on accordions, tabs, nav menu, dropdown, switch |
| Component Library | **Magic UI** | Marquee component, blur-in text (BlurText component from Magic UI) |
| Animations | **Framer Motion** | Hero blur, scroll-triggered entrances, slider transitions |
| Icons | **Lucide React** | Outline style, consistent 1.5px stroke weight |
| Font | **Inter** via `next/font/google` | Clean geometric sans-serif throughout |

### Component Tree (Estimated)

```
app/
├── layout.tsx                  ← Root layout: Navbar + global font + metadata
├── page.tsx                    ← Homepage (all sections assembled)
├── blog/
│   ├── page.tsx                ← Blog index: grid of article cards
│   └── [slug]/
│       └── page.tsx            ← Individual blog post (MDX or JSON)
├── login/
│   └── page.tsx                ← Auth: Login form
└── signup/
    └── page.tsx                ← Auth: Signup form

components/
├── ui/                         ← Primitive components
│   ├── button.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── switch.tsx              ← Radix Switch (pricing toggle)
│   ├── accordion.tsx           ← Radix Accordion (FAQ + How It Works)
│   ├── tabs.tsx                ← Radix Tabs (Features section)
│   └── navigation-menu.tsx    ← Radix NavigationMenu (nav dropdowns)
├── sections/                   ← Full page sections
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── LogoMarquee.tsx         ← Magic UI Marquee or custom CSS
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── HowItWorks.tsx          ← Radix Accordion
│   ├── TestimonialHighlight.tsx← Manual carousel (prev/next)
│   ├── Features.tsx            ← Radix Tabs
│   ├── TestimonialsWall.tsx    ← 3× Marquee rows
│   ├── Pricing.tsx             ← Radix Switch + pricing cards
│   ├── FAQ.tsx                 ← Radix Accordion
│   ├── BlogPreview.tsx
│   ├── CTABanner.tsx
│   └── Footer.tsx
└── shared/
    ├── BlurText.tsx            ← Magic UI / Framer Motion word blur
    ├── ScrollReveal.tsx        ← Framer Motion useInView wrapper
    ├── SectionLabel.tsx        ← Red uppercase label ("PROBLEM", "SOLUTION"…)
    └── AppMockup.tsx           ← Email UI screenshot image
```

---

## 8. NO-CODE SECTION-BY-SECTION BUILD SPECS

### NAVBAR

```
Frame: Fixed top, full-width, height 64px, bg #FFFFFF, z-index 100
Border-bottom: 1px solid #E5E7EB

Layout: Horizontal flex, space-between, align-center
Padding: px-8 (32px each side), max-width 1200px centered

LEFT: [Grid SVG 24px #111827] + ["acme.ai" Inter 16px bold #111827], gap 8px

CENTER: Flex row, gap 4px
  - "Features" text + ChevronDown 16px → on-click: show Features dropdown
  - "Solutions" text + ChevronDown 16px → on-click: show Solutions dropdown
  - "Blog" plain link

RIGHT: Flex row, gap 8px
  - Login: border 1px #E5E7EB, rounded-full, px 16 py 8, Inter 14px weight 600
    Hover: bg #F9FAFB, transition 150ms
  - Get Started: bg #E8001D, rounded-full, px 16 py 8, text white, Inter 14px weight 600
    Icon: LayoutGrid SVG 14px white, margin-right 6px
    Hover: bg #C0001A, scale 1.02, transition 200ms

FEATURES DROPDOWN (480px wide):
  bg white, rounded-xl, shadow-md, padding 16px
  Left col 200px: bg #FFF0F0, rounded-lg, padding 16px
    Grid icon 24px #E8001D
    Title "AI-Powered Automation" bold 16px #111827
    Description 13px #6B7280
  Right col: Vertical stack, gap 16px
    Each: Title bold 14px + Description 13px #6B7280
    Items: Task Automation | Workflow Optimization | Intelligent Scheduling
  Animation: opacity 0→1, translateY -8px→0, 200ms ease-out

SOLUTIONS DROPDOWN (560px wide):
  bg white, rounded-xl, shadow-md, padding 16px
  2×3 grid, gap 16px
  Each: Title bold 14px #111827 + Description 13px #6B7280
  Items: For Small Businesses | Enterprise | Developers | Healthcare | Finance | Education
  Same animation as Features dropdown
```

### HERO SECTION

```
Frame: Full-width, min-height 100vh, bg #FFFFFF
Padding: padding-top 96px (64px navbar + 32px gap), padding-bottom 64px
Layout: Vertical flex, align-center, gap 24px, text-align center

ANNOUNCEMENT PILL:
  Flex row, align-center, gap 8px
  Border: 1px solid #FFCDD2, bg #FFF5F5, radius 9999px, px 12, py 6
  Left badge: bg #FF8A65, radius 9999px, px 8, py 3, text white, 11px bold
              Content: "📣 Announcement"
  Divider: 1px vertical #FFCDD2, height 14px
  Link: "Introducing Acme.ai" — 13px, color #E8001D
  Animation: opacity 0→1, translateY -8px→0, 400ms ease-out

H1:
  "Automate your workflow with AI"
  Font: Inter, size clamp(52px, 5.5vw, 80px), weight 800, color #0A0A0A
  Line-height: 1.1, text-align center, max-width 800px
  Animation (word-by-word):
    initial: opacity 0, filter blur(12px)
    animate: opacity 1, filter blur(0px)
    duration: 700ms ease-out, stagger 80ms per word

SUBTITLE:
  "No matter what problem you have, our AI can help you solve it."
  Inter 18px weight 400, color #6B7280, max-width 480px, text-center
  Animation: same blur-in, delay 400ms

CTA BUTTON:
  bg #E8001D, radius 9999px, px 24, py 12
  Flex row, align-center, gap 8px
  Icon: LayoutGrid SVG 16px white
  Text: "Get started for free" Inter 15px weight 600 white
  Hover: bg #C0001A, scale 1.02, shadow 0 4px 14px rgba(232,0,29,0.35), 200ms
  Animation: opacity 0→1, scale 0.95→1, 400ms, delay 600ms

TRIAL NOTE:
  "7 day free trial. No credit card required."
  Inter 13px, color #9CA3AF, text-center
  Animation: opacity 0→1, 400ms, delay 750ms

HERO SCREENSHOT:
  Email client UI mockup image
  Max-width min(940px, 90vw), height auto
  Border: 1px solid #E5E7EB, radius 16px
  Shadow: 0 32px 64px -12px rgba(0,0,0,0.14)
  Bottom fade: absolute gradient overlay, height 128px, from-white to-transparent
  Animation: opacity 0→1, translateY 40px→0, 800ms ease-out, delay 800ms
```

### LOGO MARQUEE SECTION

```
Frame: Full-width, py 48px, bg #FFFFFF

Label:
  "TRUSTED BY LEADING TEAMS"
  Inter 12px weight 700, color #9CA3AF, letter-spacing 0.12em
  Text-center, margin-bottom 32px

Marquee container:
  overflow hidden
  Mask: linear-gradient(to right, transparent, white 8%, white 92%, transparent)

Track (inner):
  Flex row, gap 48px, align-center, width max-content
  Duplicate logo array ×2 for seamless loop
  Animation: translateX(0) → translateX(-50%), 30s linear infinite
  Hover: animation-play-state paused

Each logo:
  height 28px, width auto
  filter: grayscale(100%) opacity(50%)
  Logos: Spotify, Google, Microsoft, Amazon, Netflix, YouTube, Instagram, Uber
```

### PROBLEM SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF

Section label: "PROBLEM" — red, uppercase, letter-spacing 0.1em, 12px bold, text-center
H2: "Manually entering your data is a hassle."
    Inter 48px weight 800, text-center, color #111827, margin-bottom 64px

3-Column grid: grid-cols-3, gap 32px, max-width 960px, mx auto

Each card (no border/background):
  Icon circle: 48×48px, bg #FEE2E2, radius 9999px, flex center
    Icon: Lucide SVG 24px, color #E8001D
  Title: Inter 20px weight 700, color #111827, margin-top 16px
  Body: Inter 15px weight 400, color #6B7280, line-height 1.6, margin-top 8px

Cards:
  1. Brain icon → "Data Overload"
     "Businesses struggle to make sense of vast amounts of complex data..."
  2. Zap icon → "Slow Decision-Making"
     "Traditional data processing methods are too slow..."
  3. Shield icon → "Data Security Concerns"
     "With increasing cyber threats, businesses worry about the safety..."

Animation: ScrollReveal on each card, stagger 100ms, translateY 20px→0, 500ms
```

### SOLUTION SECTION

```
Frame: Full-width, py 96px, bg #F9FAFB

Section label: "SOLUTION"
H2: "Empower Your Business with AI Workflows"
    Inter 44px weight 800, text-center, color #111827
Subtitle: gray body text, max-width 600px, text-center, mx auto, mb 64px

2×2 grid: grid-cols-2, gap 24px, max-width 960px, mx auto

Each solution card:
  bg #F3F4F6, rounded-2xl (20px), padding 24px, overflow hidden
  Title: Inter 18px weight 700, color #E8001D, mb 8px
  Body: Inter 15px, color #6B7280, line-height 1.6, mb 16px
  Screenshot thumbnail: ~300px wide, rounded-xl, border #E5E7EB
  Optional texture on card 3: radial-gradient dot pattern overlay

Cards:
  1. "Advanced AI Algorithms" — "Our platform utilizes cutting-edge AI algorithms..."
  2. "Secure Data Handling" — "We prioritize your data security..."
  3. "Seamless Integration"



  4. "Customizable Solutions" — "Tailor our AI services to your specific needs..."

  Animation: ScrollReveal on each card, stagger 150ms, translateY 20px→0, 500ms
```

### HOW IT WORKS SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF

Section label: "HOW IT WORKS"
H2: "Just 3 steps to get started"
    Inter 48px weight 800, text-center, mb 64px

Layout: 2-column grid [LEFT 45% | RIGHT 55%], gap 48px, max-width 1100px mx auto

LEFT COLUMN — Step list (Radix Accordion, type="single"):
  Each step item:
    Container: border-left 4px solid (red if active, transparent if inactive)
               padding-left 24px, padding-y 20px, cursor pointer

    Step header (clickable trigger):
      Icon circle: 40×40px bg #FEE2E2 radius-full, Lucide icon 20px #E8001D
      Title: "1. Upload Your Data" — Inter 18px weight 700, color #111827

    Step body (collapses when inactive):
      Text: Inter 15px, color #6B7280, line-height 1.6, margin-top 8px
      Height animation: 0 → auto, 300ms ease-out

  Steps:
    1. Upload icon → "Simply upload your data to our secure platform..."
    2. Lightning/Play icon → "Our advanced AI algorithms automatically process..."
    3. Sparkle/Star icon → "Receive clear, actionable insights and recommendations..."

RIGHT COLUMN — Persistent screenshot:
  Email client mockup image
  Width 100%, rounded-2xl, border #E5E7EB, shadow-lg
  Optionally: crossfade to different screenshot per active step
```

### TESTIMONIAL HIGHLIGHT SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF

Section label: "TESTIMONIAL HIGHLIGHT"
H2: "What our customers are saying"
    Inter 44px weight 800, text-center, mb 48px

Quote area: max-width 700px, mx auto, text-center, flex-col, align-center, gap 16px

  Quotation mark:
    "❝" character or SVG, font-size 48px, color #E8001D, line-height 1

  Quote text:
    Inter 20px weight 400, italic, color #374151, line-height 1.7
    Text: "There is a lot of exciting stuff going on in the stars above us..."

  Company logo:
    Grayscale image, height 32px, mx auto, mt 24px

  Author name:
    Inter 16px weight 700, color #111827, mt 12px

  Author role:
    Inter 14px weight 400, color #9CA3AF

Navigation controls (centered below, mt 32px):
  Two circle buttons, flex row, gap 16px, justify-center
  Each: width 40px height 40px, border 1px #E5E7EB, radius 9999px, bg white
  Left: ChevronLeft icon 18px, disabled on slide 1 (opacity 40%)
  Right: ChevronRight icon 18px

Transition: opacity 0→1 crossfade, 300ms ease-in-out
7 slides total (Google, Microsoft, Amazon, Netflix, YouTube, Instagram, Uber)
```

### FEATURES SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF

Section label: "FEATURES"
H2: "User Flows and Navigational Structures"
    Inter 44px weight 800, text-center, mb 48px

Tab bar (Radix Tabs, 4 tabs, horizontal):
  Container: flex row, justify-center, gap 0, mb 48px
  Each tab trigger: width ~240px, flex-col, align-center, gap 8px, padding 16px
    Icon circle: 48×48px bg #FEE2E2 radius-full, icon 24px #E8001D
    Title: Inter 16px weight 700, color #111827, text-center
    Description: Inter 13px, color #6B7280, text-center
    Bottom border: none (inactive) | 2px solid #E8001D (active)
    Transition: border-color 200ms

  Tabs:
    1. BarChart icon → "AI-Powered Dashboard" / "Visualize trends and gain insights at a glance."
    2. Brain icon → "Natural Language Processing" / "Analyze text and extract sentiment effortlessly."
    3. TrendingUp icon → "Predictive Analytics" / "Forecast trends and make data-driven decisions."
    4. FileText icon → "Automated Reporting" / "Generate comprehensive reports with one click." ← default active

Content area below tabs:
  Full-width app screenshot (email UI mockup)
  rounded-2xl, border #E5E7EB, shadow-xl, width 100% max-width 1100px mx auto
  On tab switch: screenshot crossfades (opacity 0→1, 300ms ease)
```

### TESTIMONIALS WALL SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF, overflow hidden

Section label: "TESTIMONIALS"
H2: "What our customers are saying"
    Inter 44px weight 800, text-center, mb 64px

3 Marquee rows stacked vertically, gap 16px between rows:

  Row 1: direction LEFT, duration 35s
  Row 2: direction RIGHT, duration 40s  ← opposite direction
  Row 3: direction LEFT, duration 30s

Each testimonial card (width 320px, flex-shrink-0):
  bg #FFFFFF, border 1px #E5E7EB, rounded-xl (12px), padding 20px, shadow-sm

  Quote text:
    Inter 14px, color #374151, line-height 1.6, mb 12px
    Selected phrases: font-weight 700, color #E8001D, text-decoration underline

  Stars: "★★★★★" color #F59E0B, font-size 16px, mb 12px

  Divider: 1px solid #F3F4F6, mb 12px

  Author row: flex, gap 12px, align-center
    Avatar: 40×40px, radius 9999px, object-cover
    Name: Inter 14px weight 700, color #111827
    Role: Inter 12px, color #6B7280

Marquee mechanics:
  Each row's card array duplicated ×2 for seamless loop
  CSS animation: translateX(0→-50%) for left, translateX(-50%→0) for right
  Hover: animation-play-state: paused on row container

Side fade masks:
  mask-image: linear-gradient(to right, transparent, white 6%, white 94%, transparent)
```

### PRICING SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF

Section label: "PRICING"
H2: "Choose the plan that's right for you"
    Inter 44px weight 800, text-center

Toggle row (centered, mt 16px, mb 48px):
  Flex row, align-center, justify-center, gap 12px
  "Monthly" text: Inter 14px weight 600, color #111827 (active) / #9CA3AF (inactive)
  Switch: Radix UI Switch, width 44px height 24px, radius 9999px
    Track: bg #D1D5DB (unchecked) | bg #E8001D (checked), transition bg 200ms
    Thumb: 20×20px white circle, shadow-sm, transition transform 200ms
  "Yearly" text: same style as Monthly, inversed active state

3-column grid: grid-cols-3, gap 24px, max-width 960px, mx auto

BASIC CARD (left):
  bg white, border 1px #E5E7EB, rounded-2xl, padding 32px
  Plan label: "BASIC" — 11px uppercase tracking-wider color #9CA3AF, mb 8px
  Price: "$19" — Inter 56px weight 800 color #111827, inline
         "/ month" — Inter 18px weight 400 color #6B7280
  Billing: "billed monthly" — 13px color #9CA3AF, mb 24px
  Feature list: flex-col gap 12px
    Each: flex row gap 8px align-center
      Check icon: 16px color #E8001D
      Text: Inter 15px color #374151
    Features: 1 User | 5GB Storage | Basic Support | Limited API Access | Standard Analytics
  CTA button: "Subscribe" — outline, full-width, rounded-full, border #E5E7EB
  Footer note: "Perfect for individuals and small projects" — 13px #9CA3AF text-center mt 16px

PRO CARD (center — POPULAR):
  bg white, border 2px #E8001D, rounded-2xl, padding 32px, position relative
  Popular badge: position absolute, top -12px, right 20px
    bg #E8001D, radius 9999px, px 12 py 4
    Text "★ Popular" — Inter 12px weight 700 white
  Plan: "PRO", price "$49", same structure
  Features: 5 Users | 50GB Storage | Priority Support | Full API Access | Advanced Analytics
  CTA: "Subscribe" — bg #E8001D text white, full-width, rounded-full
  Footer: "Ideal for growing businesses and teams"

ENTERPRISE CARD (right):
  Same style as BASIC (outline border)
  Price: "$99"
  Features: Unlimited Users | 500GB Storage | 24/7 Premium Support | Custom Integrations | AI-Powered Insights
  Footer: "For large-scale operations and high-volume users"

YEARLY MODE (toggle on):
  Prices change: Basic $15 | Pro $39 | Enterprise $79
  Billing note changes to "billed yearly"
  Savings badge can be added: e.g. "Save 20%"
```

### FAQ SECTION

```
Frame: Full-width, py 96px, bg #FFFFFF

Section label: "FAQ"
H2: "Frequently asked questions"
    Inter 44px weight 800, text-center, mb 48px

Accordion container: max-width 720px, mx auto, flex-col, gap 12px

Each item (Radix Accordion.Item):
  border 1px #E5E7EB, rounded-xl, overflow hidden

  Trigger (full-width clickable row):
    flex, justify-between, align-center
    padding: px 20px py 16px
    Question: Inter 16px weight 500, color #111827, text-left
    Chevron: ChevronDown 18px color #6B7280
      data-[state=open]: rotate 180deg, transition 300ms
    Hover: bg #F9FAFB, transition 150ms

  Content (animated height):
    padding: px 20px pb 20px pt 0
    Text: Inter 15px weight 400, color #6B7280, line-height 1.65

  5 Questions:
    1. "What is acme.ai?"
       → "acme.ai is a platform that helps you build and manage your AI-powered applications. 
          It provides tools and services to streamline development and deployment of AI solutions."
    2. "How can I get started with acme.ai?"
    3. "What types of AI models does acme.ai support?"
    4. "Is acme.ai suitable for beginners in AI development?"
    5. "What kind of support does acme.ai provide?"

Footer note below accordion (mt 32px, text-center):
  "Still have questions? Email us at " + link "support@acme.ai"
  Inter 14px, color #6B7280; link: color #E8001D, no-underline, hover underline
```

### BLOG PREVIEW SECTION

```
Frame: Full-width, py 64px, bg #F9FAFB

Section label: "BLOG"
H2: "Latest Articles" — Inter 40px weight 800, text-center, mb 40px

Card grid: grid-cols-3 (collapses to 1 on mobile), gap 24px, max-width 1100px mx auto
Current content: 1 card (single blog post)

Blog card:
  bg white, border 1px #E5E7EB, rounded-xl, overflow hidden
  Entire card is a <Link> to /blog/introducing-acme-ai
  Hover: shadow-md, scale 1.01, transition 200ms

  Thumbnail: 16:9 ratio, OG-style image (laptop + title + mini screenshot)
  Date: "August 29, 2024 (1y ago)" — Inter 13px color #9CA3AF, pt 16px px 20px
  Title: "Introducing Acme.ai" — Inter 18px weight 700 color #111827, mt 4px px 20px
  Excerpt: "Introducing Acme.ai, a cutting-edge AI solution for modern businesses."
           Inter 14px color #6B7280, mt 6px px 20px pb 20px
```

### CTA BANNER SECTION

```
Frame: Full-width, py 80px, bg #FFF0F0 (light blush pink)
Border-radius: 0 (full bleed, no card)

Inner content: max-width 800px, mx auto, text-center, flex-col, align-center, gap 24px

Section label: "READY TO GET STARTED?"
  Inter 11px weight 700, uppercase, letter-spacing 0.15em, color #E8001D

H2: "Start your free trial today."
    Inter 44px weight 800, color #111827

CTA button:
  Same as Hero primary button
  "Get started for free" with grid icon
  bg #E8001D, rounded-full, px 24 py 12, white text

Animation: ScrollReveal — opacity 0→1, translateY 20px→0, 500ms
```

### FOOTER

```
Frame: Full-width, pt 64px pb 32px, bg #FFFFFF
Border-top: 1px solid #F3F4F6

TOP ROW: Logo [grid icon 24px + "acme.ai" bold 16px]

LINK COLUMNS: 4-col grid, gap 32px, mt 40px

  Column 1 "Product":
    Features | Pricing | Documentation | API

  Column 2 "Company":
    About Us | Careers | Blog | Press | Partners

  Column 3 "Resources":
    Community | Contact | Support | Status

  Column 4 "Social":
    🐦 Twitter | 📷 Instagram | ▶ Youtube
    (platform icon inline before each text)

Column headers: Inter 14px weight 700, color #111827, mb 16px
Link items: Inter 14px weight 400, color #6B7280, hover: color #111827, transition 150ms
Gap between links: 10px

BOTTOM BAR (border-top 1px #F3F4F6, mt 48px, pt 24px):
  Flex, justify-between, align-center

  LEFT: "Copyright © 2025 acme.ai – Automate your workflow with AI"
        Inter 13px, color #9CA3AF

  RIGHT: "Privacy Policy" | "Terms of Service"
         Inter 13px, color #6B7280, hover: underline, gap 24px between links
```

***

### AUTH PAGES

#### Login Page `/login`

```
Layout: full viewport, white bg, display flex, align



#### Login Page `/login`

```
Layout: full viewport, white bg, display flex, align-items center, justify-content center

Auth Card:
  width 380px, bg white, border 1px #E5E7EB, rounded-2xl (20px), shadow-sm, padding 32px

  Title: "Login" — Inter 24px weight 700, color #111827
  Subtitle: "Enter your email below to login to your account"
            Inter 14px weight 400, color #6B7280, mt 4px, mb 24px

  OAuth Buttons (stacked, gap 12px):
    [G icon 18px] "Login with Google"
    [GitHub icon 18px] "Login with GitHub"
    Style: border 1px #E5E7EB, bg white, radius 8px, height 40px, full-width
           Inter 14px weight 500, color #111827
           Hover: bg #F9FAFB, transition 150ms

  Divider (mt 24px mb 24px):
    Flex row, align-center, gap 12px
    Left line: flex-1, height 1px, bg #E5E7EB
    Text: "OR CONTINUE WITH" — Inter 11px weight 600, color #9CA3AF, uppercase, letter-spacing 0.08em
    Right line: same as left

  Form fields:
    Label: Inter 14px weight 500, color #374151, mb 4px
    Input: full-width, border 1px #E5E7EB, rounded-md (6px), height 40px, px 12px
           Inter 14px, color #111827, placeholder color #9CA3AF
           Focus: border-color #E8001D, box-shadow 0 0 0 3px rgba(232,0,29,0.12)
           Transition: border-color 150ms, box-shadow 150ms

    Field 1: Label "Email", input type email, placeholder "m@example.com"
    Field 2:
      Row: Label "Password" left + Link "Forgot your password?" right
      "Forgot your password?": Inter 13px color #E8001D, hover underline
      Input type password

  Submit: "Login" button — bg #E8001D, full-width, height 40px, rounded-md,
          Inter 14px weight 600 white, mt 8px
          Hover: bg #C0001A, transition 200ms

  Footer: mt 16px, text-center
    "Don't have an account? " Inter 14px color #6B7280
    "Sign up" — color #E8001D, font-weight 600, hover underline → /signup
```

#### Signup Page `/signup`

```
Same card layout as Login (380px, rounded-2xl, shadow-sm, p-8)

  Title: "Sign Up" — same style
  Subtitle: "Enter your information to create an account"

  Form fields (no OAuth at top):
    Row 1 (2-column, gap 12px):
      Left: Label "First name", input placeholder "Max"
      Right: Label "Last name", input placeholder "Robinson"
    Row 2: Label "Email", input type email, placeholder "m@example.com"
    Row 3: Label "Password", input type password

  Buttons (stacked, gap 12px, mt 8px):
    "Create an account" — red filled, full-width, rounded-md, height 40px
    "Sign up with GitHub" — outline, full-width, rounded-md, height 40px
      [GitHub icon 18px] before text

  Footer: "Already have an account? Sign in" → /login
```

#### Blog Index Page `/blog`

```
Navbar: same sticky navbar as homepage

Header area: full-width, pt 96px pb 64px, bg white, text-center
  H1: "Articles" — Inter 48px weight 800, color #111827
  Subtitle: "Latest news and updates from acme.ai"
            Inter 16px color #6B7280, mt 8px

Articles area: full-width, py 64px, bg #F9FAFB
  Grid: grid-cols-3, gap 24px, max-width 1100px, mx auto
  Currently 1 card (same blog card component as homepage)

Footer: same as homepage footer
```

#### Blog Post Page `/blog/[slug]`

```
Navbar: same sticky navbar

Content: max-width 680px, mx auto, py 64px, px 24px

Hero image block:
  Full-width within content column
  Image: OG-style graphic (laptop icon + "Introducing Acme.ai" + app thumbnail)
  Style: border 1px #E5E7EB, rounded-2xl, overflow hidden, width 100%, height auto

Post header (mt 32px):
  H1: "Introducing Acme.ai" — Inter 36px weight 800, color #111827
  Date: "August 29, 2024 (1y ago)" — Inter 14px color #9CA3AF, mt 8px
  Author row (mt 16px): flex, align-center, gap 12px
    Avatar: 40×40px, radius 9999px, object-cover
    Name "@dillionverma": Inter 15px weight 600 color #111827
    Handle: Inter 14px color #9CA3AF

Post body (mt 32px):
  H2: Inter 24px weight 700, color #111827, mt 40px mb 16px
  Paragraph: Inter 16px weight 400, color #374151, line-height 1.75, mb 16px
  List items: bullet, same size as paragraph
  Bold: font-weight 700, color #111827
  Links: color #E8001D, hover underline

Footer: same as homepage footer
```

---

## 9. RESPONSIVE BREAKPOINTS

```
Mobile  (< 640px  / sm):
  Navbar:        Hamburger menu (hidden desktop links), logo stays
  Hero H1:       font-size ~40px
  All grids:     grid-cols-1 (stacked)
  Marquee:       same auto-scroll, narrower visible area
  Pricing:       grid-cols-1, cards stacked
  Auth cards:    width 100%, mx 16px
  Footer:        grid-cols-2, then 1 on very small screens

Tablet  (640px – 1024px  / md–lg):
  Problem:       grid-cols-2 or grid-cols-1
  Solution:      grid-cols-2 (already 2-col)
  Features tabs: horizontal scroll if overflow
  Pricing:       grid-cols-1 or grid-cols-2
  How It Works:  stacked (screenshot moves below steps)

Desktop (> 1024px  / xl):
  Full layout as documented in all sections above
  Max content width: 1200px everywhere
  Navbar: full horizontal links visible
```

---

## 10. MASTER DESIGN TOKEN SHEET

```css
/* =============================================
   ACME.AI — COMPLETE DESIGN TOKENS
   ============================================= */

/* COLORS */
--color-primary:          #E8001D;   /* Main red: buttons, icons, active states */
--color-primary-hover:    #C0001A;   /* Darker red on hover */
--color-primary-light:    #FEE2E2;   /* Blush: icon bg circles, badge bg */
--color-primary-ultra:    #FFF0F0;   /* CTA banner bg, announcement pill bg */
--color-announcement-dot: #FF8A65;   /* Left badge inside announcement pill */

--color-bg:               #FFFFFF;   /* Page white background */
--color-surface:          #F9FAFB;   /* Alt section bg (blog, solution) */
--color-surface-2:        #F3F4F6;   /* Solution card backgrounds */

--color-text-primary:     #111827;   /* Headings, nav, bold labels */
--color-text-secondary:   #374151;   /* Body text, blog post text */
--color-text-muted:       #6B7280;   /* Subtitles, captions, descriptions */
--color-text-faint:       #9CA3AF;   /* Meta: dates, billing note, copyright */

--color-border:           #E5E7EB;   /* All borders: cards, inputs, dividers */
--color-border-light:     #F3F4F6;   /* Footer top border, very subtle dividers */

--color-star:             #F59E0B;   /* Testimonial 5-star ratings */

/* TYPOGRAPHY */
--font-family:              'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-10:             10px;
--font-size-11:             11px;
--font-size-12:             12px;
--font-size-13:             13px;
--font-size-14:             14px;
--font-size-15:             15px;
--font-size-16:             16px;
--font-size-18:             18px;
--font-size-20:             20px;
--font-size-24:             24px;
--font-size-32:             32px;
--font-size-36:             36px;
--font-size-40:             40px;
--font-size-44:             44px;
--font-size-48:             48px;
--font-size-56:             56px;   /* Pricing display price */
--font-size-hero:           clamp(52px, 5.5vw, 80px);

--font-weight-regular:      400;
--font-weight-medium:       500;
--font-weight-semibold:     600;
--font-weight-bold:         700;
--font-weight-extrabold:    800;

--line-height-tight:        1.1;
--line-height-snug:         1.2;
--line-height-normal:       1.4;
--line-height-relaxed:      1.6;
--line-height-loose:        1.75;

--letter-spacing-normal:    0;
--letter-spacing-wide:      0.08em;  /* section labels */
--letter-spacing-wider:     0.12em;  /* logo marquee label */

/* SPACING */
--space-1:   4px;   --space-2:   8px;   --space-3:  12px;
--space-4:  16px;   --space-5:  20px;   --space-6:  24px;
--space-8:  32px;   --space-10: 40px;   --space-12: 48px;
--space-16: 64px;   --space-20: 80px;   --space-24: 96px;

/* BORDER RADIUS */
--radius-sm:    6px;
--radius-md:    8px;
--radius-lg:    12px;
--radius-xl:    16px;
--radius-2xl:   20px;
--radius-full:  9999px;

/* SHADOWS */
--shadow-sm:    0 1px 2px rgba(0,0,0,0.05);
--shadow-md:    0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06);
--shadow-lg:    0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -2px rgba(0,0,0,0.05);
--shadow-xl:    0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04);
--shadow-hero:  0 32px 64px -12px rgba(0,0,0,0.14);  /* hero screenshot */
--shadow-cta:   0 4px 14px rgba(232,0,29,0.35);       /* primary button hover */

/* TRANSITIONS */
--transition-fast:    150ms ease;
--transition-base:    200ms ease;
--transition-medium:  300ms ease-out;
--transition-slow:    500ms ease-out;
--transition-hero:    700ms ease-out;

/* Z-INDEX */
--z-base:     0;
--z-above:    10;
--z-navbar:   100;
--z-dropdown: 200;
--z-modal:    300;
--z-toast:    400;

/* LAYOUT */
--max-width-content:  1200px;
--max-width-wide:     1100px;
--max-width-narrow:   720px;
--max-width-prose:    680px;
--max-width-auth:     380px;
--navbar-height:      64px;
```

---

## 11. TAILWIND CONFIG

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8001D',
          hover:   '#C0001A',
          light:   '#FEE2E2',
          ultra:   '#FFF0F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(52px, 5.5vw, 80px)', { lineHeight: '1.1' }],
      },
      maxWidth: {
        content: '1200px',
        prose:   '680px',
        narrow:  '720px',
        auth:    '380px',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        hero: '0 32px 64px -12px rgba(0,0,0,0.14)',
        cta:  '0 4px 14px rgba(232,0,29,0.35)',
      },
      animation: {
        'marquee':      'marquee 30s linear infinite',
        'marquee-rev':  'marquee-rev 35s linear infinite',
        'blur-in':      'blurIn 700ms ease-out forwards',
        'fade-in':      'fadeIn 500ms ease-out forwards',
        'slide-up':     'slideUp 500ms ease-out forwards',
        'accordion-down':   'accordion-down 300ms ease-out',
        'accordion-up':     'accordion-up 300ms ease-out',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        blurIn: {
          from: { opacity: '0', filter: 'blur(12px)' },
          to:   { opacity: '1', filter: 'blur(0px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translate


        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
    },
  },
  plugins: [],
}
```

***

## 12. ANIMATION RECIPES (Copy-Paste Code)

### A — Hero Blur-In Text (Framer Motion)

```tsx
// components/shared/BlurText.tsx
'use client'
import { motion } from 'framer-motion'

interface BlurTextProps {
  text: string
  className?: string
}

export function BlurText({ text, className }: BlurTextProps) {
  const words = text.split(' ')
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

// Usage:
// <BlurText
//   text="Automate your workflow with AI"
//   className="text-hero font-extrabold text-center text-gray-950 leading-tight"
// />
```

### B — Scroll-Triggered Entrance (Framer Motion)

```tsx
// components/shared/ScrollReveal.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

// Usage — stagger 3 cards with 100ms between each:
// <ScrollReveal delay={0}>   <ProblemCard /> </ScrollReveal>
// <ScrollReveal delay={0.1}> <ProblemCard /> </ScrollReveal>
// <ScrollReveal delay={0.2}> <ProblemCard /> </ScrollReveal>
```

### C — Infinite Marquee (CSS-only, no library needed)

```tsx
// components/shared/Marquee.tsx
interface MarqueeProps {
  items: React.ReactNode[]
  direction?: 'left' | 'right'
  duration?: number
  gap?: number
  pauseOnHover?: boolean
}

export function Marquee({
  items,
  direction = 'left',
  duration = 30,
  gap = 48,
  pauseOnHover = true,
}: MarqueeProps) {
  const animClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-rev'
  const hoverClass = pauseOnHover ? '[&:hover>*]:![animation-play-state:paused]' : ''

  return (
    <div
      className={`overflow-hidden ${hoverClass}`}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, white 8%, white 92%, transparent)',
      }}
    >
      <div
        className={`flex w-max ${animClass}`}
        style={{ gap: `${gap}px`, animationDuration: `${duration}s` }}
      >
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex-shrink-0 flex items-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### D — Pricing Toggle (Radix Switch)

```tsx
// components/sections/Pricing.tsx
'use client'
import { useState } from 'react'
import * as Switch from '@radix-ui/react-switch'

const plans = [
  {
    name: 'BASIC',
    monthly: 19,
    yearly: 15,
    features: ['1 User', '5GB Storage', 'Basic Support', 'Limited API Access', 'Standard Analytics'],
    note: 'Perfect for individuals and small projects',
    popular: false,
  },
  {
    name: 'PRO',
    monthly: 49,
    yearly: 39,
    features: ['5 Users', '50GB Storage', 'Priority Support', 'Full API Access', 'Advanced Analytics'],
    note: 'Ideal for growing businesses and teams',
    popular: true,
  },
  {
    name: 'ENTERPRISE',
    monthly: 99,
    yearly: 79,
    features: ['Unlimited Users', '500GB Storage', '24/7 Premium Support', 'Custom Integrations', 'AI-Powered Insights'],
    note: 'For large-scale operations and high-volume users',
    popular: false,
  },
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-content mx-auto px-8">
        {/* Label */}
        <p className="text-xs font-bold uppercase tracking-widest text-primary text-center mb-3">
          PRICING
        </p>
        {/* Heading */}
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-6">
          Choose the plan that's right for you
        </h2>
        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-semibold ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Monthly
          </span>
          <Switch.Root
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="w-11 h-6 rounded-full bg-gray-200 data-[state=checked]:bg-primary
                       transition-colors duration-200 relative outline-none cursor-pointer"
          >
            <Switch.Thumb
              className="block w-5 h-5 bg-white rounded-full shadow-sm
                         translate-x-0.5 data-[state=checked]:translate-x-[22px]
                         transition-transform duration-200"
            />
          </Switch.Root>
          <span className={`text-sm font-semibold ${isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Yearly
          </span>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'border-2 border-primary'
                  : 'border border-gray-200'
              } bg-white`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-5 bg-primary text-white
                                 text-xs font-bold px-3 py-1 rounded-full">
                  ★ Popular
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-6xl font-extrabold text-gray-900">
                  ${isYearly ? plan.yearly : plan.monthly}
                </span>
                <span className="text-lg text-gray-400 mb-2">/ month</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                billed {isYearly ? 'yearly' : 'monthly'}
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-primary">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`block w-full text-center py-2.5 rounded-full font-semibold
                            text-sm transition-all duration-200 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'border border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Subscribe
              </a>
              <p className="text-xs text-gray-400 text-center mt-4">{plan.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### E — FAQ Accordion (Radix UI)

```tsx
// components/sections/FAQ.tsx
'use client'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is acme.ai?',
    a: 'acme.ai is a platform that helps you build and manage your AI-powered applications. It provides tools and services to streamline the development and deployment of AI solutions.',
  },
  {
    q: 'How can I get started with acme.ai?',
    a: 'Simply sign up for a free account, upload your data, and let our AI algorithms do the rest. No credit card required for the 7-day trial.',
  },
  {
    q: 'What types of AI models does acme.ai support?',
    a: 'We support a wide range of AI models including NLP, predictive analytics, computer vision, and custom model integrations via our API.',
  },
  {
    q: 'Is acme.ai suitable for beginners in AI development?',
    a: 'Absolutely. Our platform is designed to be accessible to users of all skill levels with guided workflows and pre-built templates.',
  },
  {
    q: 'What kind of support does acme.ai provide?',
    a: 'We offer email support on all plans, priority support on Pro, and 24/7 premium support for Enterprise customers.',
  },
]

export function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-narrow mx-auto px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary text-center mb-3">
          FAQ
        </p>
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          Frequently asked questions
        </h2>
        <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <Accordion.Trigger
                className="flex w-full items-center justify-between px-5 py-4
                           text-left text-base font-medium text-gray-900
                           hover:bg-gray-50 transition-colors
                           [&[data-state=open]>svg]:rotate-180"
              >
                {faq.q}
                <ChevronDown
                  size={18}
                  className="text-gray-400 transition-transform duration-300 shrink-0 ml-4"
                />
              </Accordion.Trigger>
              <Accordion.Content
                className="overflow-hidden text-sm text-gray-500 leading-relaxed
                           data-[state=open]:animate-accordion-down
                           data-[state=closed]:animate-accordion-up"
              >
                <div className="px-5 pb-5 pt-1">{faq.a}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
        <p className="text-sm text-gray-400 text-center mt-8">
          Still have questions? Email us at{' '}
          <a href="mailto:support@acme.ai" className="text-primary hover:underline">
            support@acme.ai
          </a>
        </p>
      </div>
    </section>
  )
}
```

### F — Testimonials Wall (3-Row Marquee)

```tsx
// components/sections/TestimonialsWall.tsx
import { Marquee } from '@/components/shared/Marquee'

interface Testimonial {
  quote: string
  highlight?: string
  name: string
  role: string
  avatar: string
}

function TestimonialCard({ quote, highlight, name, role, avatar }: Testimonial) {
  const parts = highlight ? quote.split(highlight) : [quote]
  return (
    <div className="w-80 shrink-0 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        {parts[0]}
        {highlight && (
          <strong className="font-semibold text-primary underline">{highlight}</strong>
        )}
        {parts[1] ?? ''}
      </p>
      <div className="text-amber-400 text-base mb-3">★★★★★</div>
      <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
        <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt={name} />
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
}

const row1: Testimonial[] = 


  { quote: 'The AI-driven analytics from #QuantumInsights have revolutionized our product development cycle. Insights are now more accurate and faster than ever. A game-changer for tech companies.',
    highlight: 'A game-changer for tech companies.',
    name: 'Alex Rivera', role: 'CTO at InnovateTech', avatar: '/avatars/alex.jpg' },
  { quote: "Implementing #AIStream's customer prediction model has drastically improved our targeting strategy. Seeing a 50% increase in conversion rates! Highly recommend their solutions.",
    highlight: 'Seeing a 50% increase in conversion rates!',
    name: 'Samantha Lee', role: 'Marketing Director at NextGen Solutions', avatar: '/avatars/samantha.jpg' },
  { quote: "As a startup, we need to move fast and stay ahead. #CodeAI's automated coding assistant helps us do just that. Our development speed has doubled. Essential tool for any startup.",
    highlight: 'Our development speed has doubled.',
    name: 'Raj Patel', role: 'Founder & CEO at StartUp Grid', avatar: '/avatars/raj.jpg' },
]

const row2: Testimonial[] = [
  { quote: "#VoiceGen's AI-driven voice synthesis has made creating global products a breeze. Localization is now seamless and efficient. A must-have for global product teams.",
    highlight: 'Localization is now seamless and efficient.',
    name: 'Emily Chen', role: 'Product Manager at Digital Wave', avatar: '/avatars/emily.jpg' },
  { quote: "Leveraging #DataCrunch's AI for our financial models has given us an edge in predictive accuracy. Our investment strategies are now powered by real-time data analytics. Transformative for the finance industry.",
    highlight: 'Our investment strategies are now powered by real-time data analytics.',
    name: 'Michael Brown', role: 'Data Scientist at FinTech Innovations', avatar: '/avatars/michael.jpg' },
  { quote: "#LogiTech's supply chain optimization tools have drastically reduced our operational costs. Efficiency and accuracy in logistics have never been better.",
    highlight: 'Efficiency and accuracy in logistics have never been better.',
    name: 'Linda Wu', role: 'VP of Operations at LogiChain Solutions', avatar: '/avatars/linda.jpg' },
]

const row3: Testimonial[] = [
  { quote: "By integrating #GreenTech's sustainable energy solutions, we've seen a significant reduction in carbon footprint. Leading the way in eco-friendly business practices. Pioneering change in the industry.",
    highlight: 'Leading the way in eco-friendly business practices.',
    name: 'Carlos Gomez', role: 'Head of R&D at EcoInnovate', avatar: '/avatars/carlos.jpg' },
  { quote: "#TrendSetter's market analysis AI has transformed how we approach fashion trends. Our campaigns are now data-driven with higher customer engagement. Revolutionizing fashion marketing.",
    highlight: 'Our campaigns are now data-driven with higher customer engagement.',
    name: 'Aisha Khan', role: 'Chief Marketing Officer at Fashion Forward', avatar: '/avatars/aisha.jpg' },
  { quote: "Implementing #MediCareAI in our patient care systems has improved patient outcomes significantly. Technology and healthcare working hand in hand for better health. A milestone in medical technology.",
    highlight: 'Technology and healthcare working hand in hand for better health.',
    name: 'Tom Chen', role: 'Director of IT at HealthTech Solutions', avatar: '/avatars/tom.jpg' },
]

export function TestimonialsWall() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-content mx-auto px-8 mb-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary text-center mb-3">
          TESTIMONIALS
        </p>
        <h2 className="text-5xl font-extrabold text-center text-gray-900">
          What our customers are saying
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <Marquee items={row1.map((t, i) => <TestimonialCard key={i} {...t} />)} direction="left"  duration={35} />
        <Marquee items={row2.map((t, i) => <TestimonialCard key={i} {...t} />)} direction="right" duration={40} />
        <Marquee items={row3.map((t, i) => <TestimonialCard key={i} {...t} />)} direction="left"  duration={30} />
      </div>
    </section>
  )
}
```

### G — Primary Button Component

```tsx
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { LayoutGrid } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const sizeMap = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const variantMap = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-cta',
  outline: 'border border-gray-200 text-gray-900 bg-white hover:bg-gray-50',
  ghost:   'text-gray-700 hover:bg-gray-100',
}

export function Button({
  children,
  variant = 'primary',
  showIcon = false,
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-full',
        'transition-all duration-200 active:scale-[0.98] hover:scale-[1.02]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        sizeMap[size],
        variantMap[variant],
        className
      )}
      {...props}
    >
      {showIcon && variant === 'primary' && (
        <LayoutGrid size={16} className="shrink-0" />
      )}
      {children}
    </button>
  )
}
```

### H — SectionLabel Component

```tsx
// components/shared/SectionLabel.tsx
import { cn } from '@/lib/utils'

export function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn(
      'text-xs font-bold uppercase tracking-[0.1em] text-primary text-center mb-3',
      className
    )}>
      {children}
    </p>
  )
}

// Usage:
// <SectionLabel>PROBLEM</SectionLabel>
// <SectionLabel>SOLUTION</SectionLabel>
// <SectionLabel>PRICING</SectionLabel>
```

***

## 13. FRAMER BUILD GUIDE

### Project Setup

```
1. New project → Blank Canvas
2. Fonts panel → Add "Inter" (weights: 400, 500, 600, 700, 800)
3. Color Styles (add these):
   Primary:       #E8001D
   Primary Hover: #C0001A
   Primary Light: #FEE2E2
   Primary Ultra: #FFF0F0
   Text Primary:  #111827
   Text Muted:    #6B7280
   Border:        #E5E7EB
   Surface:       #F9FAFB
4. Breakpoints: Desktop 1280 | Tablet 768 | Mobile 390
5. Layout max-width: 1200px centered (use a Container component)
```

### Navbar Frame

```
Position: Fixed, Pin top+left+right, Height 64, bg white
Border: Bottom edge → 1px #E5E7EB

Stack (Horizontal, Space Between, align center, h 100%):
  Padding: Left 32, Right 32, max-width 1200 centered

  Logo group (Stack Horizontal, gap 8, align center):
    SVG Frame 24×24 [paste grid icon SVG]
    Text "acme.ai" — Inter 16 Bold #111827

  Nav links (Stack Horizontal, gap 4, align center):
    Text "Features" + ChevronDown SVG 16px → onClick: show Features overlay
    Text "Solutions" + ChevronDown SVG 16px → onClick: show Solutions overlay
    Link "Blog" → /blog

  Right group (Stack Horizontal, gap 8):
    Frame (Login button):
      Border 1 #E5E7EB, radius 9999, px 16, py 8
      Text "Login" Inter 14 600 #111827
      Hover: bg #F9FAFB, transition 150ms
    Frame (CTA button):
      bg #E8001D, radius 9999, px 16, py 8
      Stack Horizontal gap 6: [LayoutGrid SVG 14 white] + [Text "Get Started for Free" Inter 14 600 white]
      Hover: bg #C0001A, scale 1.02, transition 200ms

Dropdown Overlays (position absolute, top 64, z 200):
  Features (width 480, bg white, radius 12, shadow-md, p 16):
    Stack Horizontal gap 12:
      Left card (width 200, bg #FFF0F0, radius 8, p 16):
        SVG grid icon 24 #E8001D
        Text "AI-Powered Automation" Inter 16 700 #111827 mt 8
        Text description Inter 13 #6B7280 mt 4
      Right stack (flex 1, gap 16):
        3× item: Text bold 14 + Text 13 #6B7280
  Solutions (width 560, same style, 2×3 grid)
  Animation: opacity 0→1, y -8→0, 200ms easeOut on show
```

### Hero Section Frame

```
Frame: Full width, min-height 100vh, bg white
Padding: top 96, bottom 64

Stack Vertical, align center, gap 24, width 100%:

  Announcement Pill:
    Stack Horizontal, align center, gap 8
    Border 1 #FFCDD2, bg #FFF5F5, radius 9999, px 12, py 6
    Left badge: bg #FF8A65, radius 9999, px 8, py 3, Text "📣 Announcement" 11 700 white
    Separator: Frame 1×14, bg #FFCDD2
    Link text "Introducing Acme.ai" Inter 13 500 #E8001D
    Appear animation: opacity 0→1, y -8→0, 400ms easeOut, delay 0

  H1 Blur Text (Code Component):
    Use Framer Code Component → paste BlurText.tsx from Section 12A
    Props: text="Automate your workflow with AI"
           className="text-hero font-extrabold text-center text-gray-950"

  Subtitle:
    Text "No matter what problem you have, our AI can help you solve it."
    Inter 18 400 #6B7280, max-width 480, text-center
    Appear: opacity 0 blur 12→0, 700ms, delay 400ms

  CTA Button Frame:
    bg #E8001D, radius 9999, px 24, py 12
    Stack Horizontal gap 8 align center:
      SVG LayoutGrid 16 white
      Text "Get started for free" Inter 15 600 white
    Hover: bg #C0001A, scale 1.02, shadow 0 4 14 rgba(232,0,29,.35)
    Appear: opacity 0 scale .95→1, 400ms, delay 600ms

  Trial note:
    Text "7 day free trial. No credit card required."
    Inter 13 #9CA3AF, text-center
    Appear: opacity 0→1, 400ms, delay 750ms

  Hero Screenshot:
    Image component → email UI mockup
    Max width min(940, 90vw), border 1 #E5E7EB, radius 16, shadow hero
    Appear: opacity 0 y 40→0, 800ms easeOut, delay 800ms
    Gradient overlay: Frame absolute bottom 0 h 128 full-width
                      Fill: gradient top=transparent bottom=white
```

### Logo Marquee (Framer Code Component)

```tsx
// Paste as Code Component in Framer
import { motion } from "framer-motion"

const logos = ["Spotify","Google","Microsoft","Amazon","Netflix","YouTube","Instagram","Uber"]

export default function LogoMarquee() {
  return (
    <section style={{ padding: "48px 0", background: "white" }}>
      <p style={{ textAlign:"center", fontSize:12, fontWeight:700,
                  letterSpacing:"0.12em", color:"#9CA3AF", marginBottom:32,
                  textTransform:"uppercase" }}>
        TRUSTED BY LEADING TEAMS
      </p>
      <div style={{ overflow:"hidden",
                    maskImage:"linear-gradient(to right,transparent,white 8%,white 92%,transparent)" }}>
        <motion.div
          style={{ display:"flex", gap:48, alignItems:"center", width:"max-content" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} style={{ fontSize:18, fontWeight:700, color:"#9CA3AF",
                                   opacity:.6, whiteSpace:"nowrap" }}>
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

***

## 14. WEBFLOW BUILD GUIDE

### Global Setup

```
Site Settings → Fonts → Add "Inter" (400, 500, 600, 700, 800)

Global Swatches:
  Red Primary    #E8001D
  Red Hover      #C0001A
  Red Light      #FEE2E2
  Red Ultra      #FFF0F0
  Text Primary   #111827
  Text Muted     #6B7280
  Text Faint     #9CA3AF
  Border         #E5E7EB
  Surface        #F9FAFB

Custom CSS (Head code):
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; margin: 0; }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-rev {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .marquee-track-left  { animation: marquee     30s linear infinite; }
  .marquee-track-right { animation: marquee-rev 35s linear infinite; }
  .marquee-wrapper:hover .marquee-track-left,
  .


  .marquee-wrapper:hover .marquee-track-right {
    animation-play-state: paused;
  }
```

### Webflow — Navbar

```
Component: Webflow built-in Navbar
  Position: Fixed, z-index 100
  Height: 64px, bg white
  Custom attr: style="border-bottom:1px solid #E5E7EB;"
  Max-width container: 1200px, mx auto, px 32px

  Logo block (Div, flex row, gap 8, align center):
    Embed: paste grid SVG code, 24×24
    Text Block "acme.ai": Inter 16px bold #111827

  Nav links (use Webflow Dropdown for Features + Solutions):
    Dropdown panel style:
      Custom CSS class "nav-dropdown"
      background: white; border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.10); padding: 16px;

  Right CTAs (Div, flex row, gap 8):
    Login link: Custom class "btn-login"
      border:1px solid #E5E7EB; border-radius:9999px;
      padding:8px 16px; font-weight:600; font-size:14px; color:#111827;
    Get Started link: Custom class "btn-primary"
      background:#E8001D; color:white; border-radius:9999px;
      padding:8px 16px; font-weight:600; font-size:14px;
      transition: background 200ms, transform 200ms;
    btn-primary:hover { background:#C0001A; transform:scale(1.02); }
```

### Webflow — Hero Section

```
Section: min-height 100vh, bg white, display flex, align-items center, justify-content center
  Padding: top 96px, bottom 64px

  Inner div: max-width 1200px, width 90%, mx auto
    display flex, flex-direction column, align-items center, gap 24px

  Announcement pill:
    Div class "pill": display flex, align-items center, gap 8px
    border:1px solid #FFCDD2; background:#FFF5F5; border-radius:9999px; padding:6px 12px;
    Left span "badge": background:#FF8A65; border-radius:9999px; padding:3px 8px;
                        color:white; font-size:11px; font-weight:700;
    Link text: color:#E8001D; font-size:13px;
    Interaction → Page Load → Start: opacity 0, y -8 → End: opacity 1, y 0, 400ms easeOut

  H1 (Heading 1):
    Font: Inter 72px (desktop) bold, text-center, color #0A0A0A
    Interaction → Page Load:
      Add multiple spans wrapping each word (Webflow limitation: wrap manually)
      Each span: Start opacity 0, blur 12 → End opacity 1, blur 0, 700ms, stagger +80ms

  Subtitle (Paragraph):
    Inter 18px, color #6B7280, text-center, max-width 480px
    Same blur-in interaction, delay 400ms

  CTA button (Link Block, class "btn-primary-hero"):
    display flex, align-items center, gap 8px, width fit-content
    background:#E8001D; border-radius:9999px; padding:12px 24px;
    color:white; font-weight:600; font-size:15px;
    Add SVG embed for grid icon (16px white)
    Hover: background:#C0001A; transform:scale(1.02);
    Interaction delay: 600ms

  Trial note: Inter 13px, color #9CA3AF, text-center; opacity 0→1, delay 750ms

  Screenshot image:
    border-radius:16px; border:1px solid #E5E7EB;
    box-shadow:0 32px 64px -12px rgba(0,0,0,0.14); max-width:940px; width:90%;
    Interaction → Scroll into view: opacity 0 y 40 → opacity 1 y 0, 800ms easeOut
```

### Webflow — Logo Marquee

```html
<!-- Embed element inside Section -->
<div class="marquee-wrapper" style="overflow:hidden; padding:48px 0;
  mask-image:linear-gradient(to right,transparent,white 8%,white 92%,transparent);
  -webkit-mask-image:linear-gradient(to right,transparent,white 8%,white 92%,transparent);">
  <div class="marquee-track-left"
       style="display:flex; gap:48px; align-items:center; width:max-content;">
    <!-- paste each logo img twice -->
    <img src="spotify.svg"   style="height:28px;opacity:.5;filter:grayscale(1);" alt="Spotify">
    <img src="google.svg"    style="height:28px;opacity:.5;filter:grayscale(1);" alt="Google">
    <img src="microsoft.svg" style="height:28px;opacity:.5;filter:grayscale(1);" alt="Microsoft">
    <img src="amazon.svg"    style="height:28px;opacity:.5;filter:grayscale(1);" alt="Amazon">
    <img src="netflix.svg"   style="height:28px;opacity:.5;filter:grayscale(1);" alt="Netflix">
    <img src="youtube.svg"   style="height:28px;opacity:.5;filter:grayscale(1);" alt="YouTube">
    <img src="instagram.svg" style="height:28px;opacity:.5;filter:grayscale(1);" alt="Instagram">
    <img src="uber.svg"      style="height:28px;opacity:.5;filter:grayscale(1);" alt="Uber">
    <!-- duplicate all 8 again below for seamless loop -->
  </div>
</div>
```

### Webflow — Pricing Toggle

```html
<!-- Embed for pricing toggle JS -->
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('pricing-toggle');
    if (!toggle) return;
    toggle.addEventListener('change', function () {
      const yearly = toggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
      });
      document.querySelectorAll('.billing-note').forEach(function (el) {
        el.textContent = yearly ? 'billed yearly' : 'billed monthly';
      });
    });
  });
</script>

<!-- Price element HTML: -->
<span data-monthly="19" data-yearly="15">19</span>
<span class="billing-note">billed monthly</span>
```

### Webflow — Interactions Summary

```
All section cards (Problem, Solution, Features, Testimonials, Pricing, FAQ, Blog, CTA):
  Trigger: "Scroll into view"
  Action: Start state → opacity 0, Move Y 20px
          End state   → opacity 1, Move Y 0
  Duration: 500ms, Easing: Ease Out
  Offset: bottom of viewport trigger at 80% (element enters at 20% from bottom)

Staggered children (e.g. 3 Problem cards):
  Add "Affect children with stagger" in Webflow interaction
  Stagger: 100ms
```

***

## 15. REACT / NEXT.JS COMPONENT STARTERS

### Full Page Shell

```tsx
// app/page.tsx
import Navbar               from '@/components/sections/Navbar'
import Hero                 from '@/components/sections/Hero'
import LogoMarquee          from '@/components/sections/LogoMarquee'
import Problem              from '@/components/sections/Problem'
import Solution             from '@/components/sections/Solution'
import HowItWorks           from '@/components/sections/HowItWorks'
import TestimonialHighlight from '@/components/sections/TestimonialHighlight'
import Features             from '@/components/sections/Features'
import TestimonialsWall     from '@/components/sections/TestimonialsWall'
import { Pricing }          from '@/components/sections/Pricing'
import { FAQ }              from '@/components/sections/FAQ'
import BlogPreview          from '@/components/sections/BlogPreview'
import CTABanner            from '@/components/sections/CTABanner'
import Footer               from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main className="font-sans bg-white text-gray-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <Problem />
      <Solution />
      <HowItWorks />
      <TestimonialHighlight />
      <Features />
      <TestimonialsWall />
      <Pricing />
      <FAQ />
      <BlogPreview />
      <CTABanner />
      <Footer />
    </main>
  )
}
```

### Footer Component

```tsx
// components/sections/Footer.tsx
import Link from 'next/link'
import { Twitter, Instagram, Youtube } from 'lucide-react'

const links = {
  Product:   ['Features', 'Pricing', 'Documentation', 'API'],
  Company:   ['About Us', 'Careers', 'Blog', 'Press', 'Partners'],
  Resources: ['Community', 'Contact', 'Support', 'Status'],
}

const social = [
  { label: 'Twitter',   icon: Twitter,   href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Youtube',   icon: Youtube,   href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-content mx-auto px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-sm" />
            ))}
          </div>
          <span className="font-bold text-base text-gray-900">acme.ai</span>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-gray-900 mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Social</h4>
            <ul className="flex flex-col gap-2.5">
              {social.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <Link href={href} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <Icon size={14} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Copyright © 2025 acme.ai – Automate your workflow with AI
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:underline">Privacy Policy</Link>
            <Link href="#" className="text-xs text-gray-500 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

### CTA Banner Component

```tsx
// components/sections/CTABanner.tsx
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

export default function CTABanner() {
  return (
    <section className="py-20 bg-[#FFF0F0] w-full">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto px-8 flex flex-col items-center text-center gap-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
            READY TO GET STARTED?
          </p>
          <h2 className="text-5xl font-extrabold text-gray-900">
            Start your free trial today.
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover
                       text-white font-semibold text-sm px-6 py-3 rounded-full
                       transition-all duration-200 hover:scale-[1.02] hover:shadow-cta"
          >
            <LayoutGrid size={16} />
            Get started for free
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}
```

***

## 16. FINAL REBUILD CHECKLIST

Use this ordered list to build the site from scratch:

```
SETUP
  [ ] 1.  Init Next.js 14 app: npx create-next-app@latest --typescript --tailwind --app
  [ ] 2.  Install all packages (see Section 17)
  [ ] 3.  Configure tailwind.config.js (copy from Section 11)
  [ ] 4.  Add CSS variables to globals.css (copy from Section 10)
  [ ] 5.  Set up next/font for Inter in app/layout.tsx
  [ ] 6.  Create /lib/utils.ts with cn() helper (clsx + tailwind-merge)

SHARED COMPONENTS
  [ ] 7.  Build Button component (primary, outline, ghost variants)
  [ ] 8.  Build SectionLabel component
  [ ] 9.  Build ScrollReveal component (Framer Motion useInView)
  [ ] 10. Build BlurText component (Framer Motion word blur)
  [ ] 11. Build Marquee component (CSS infinite scroll, pause on hover)

LAYOUT
  [ ] 12. Build Navbar with Radix NavigationMenu + Features/Solutions dropdowns
  [ ] 13. Build Footer with 4-column link grid + social icons
  [ ] 14. Create app/layout.tsx with Navbar + Footer wrapper

HOMEPAGE SECTIONS (top to bottom)
  [ ] 15. Hero section (announcement pill + H1 BlurText + subtitle + CTA + screenshot)
  [ ] 16. LogoMarquee section (Marqu
  [ ] 16. LogoMarquee section (Marquee component + 8 logos)
  [ ] 17. Problem section (3-col grid, ScrollReveal stagger)
  [ ] 18. Solution section (2×2 grid, gray bg, screenshot thumbnails)
  [ ] 19. HowItWorks section (Radix Accordion + right screenshot)
  [ ] 20. TestimonialHighlight section (manual prev/next slider)
  [ ] 21. Features section (Radix Tabs + crossfade screenshot)
  [ ] 22. TestimonialsWall section (3× Marquee rows, opposite directions)
  [ ] 23. Pricing section (Radix Switch toggle + 3 cards)
  [ ] 24. FAQ section (Radix Accordion)
  [ ] 25. BlogPreview section (card grid)
  [ ] 26. CTABanner section (pink bg, ScrollReveal)

ADDITIONAL PAGES
  [ ] 27. /blog page (Articles heading + card grid + footer)
  [ ] 28. /blog/[slug] page (hero image + author + MDX body)
  [ ] 29. /login page (centered auth card + OAuth + form)
  [ ] 30. /signup page (centered auth card + 2-col name row + form)

POLISH
  [ ] 31. Add scroll-triggered entrance to every section (ScrollReveal)
  [ ] 32. Add hover states to all buttons, cards, links
  [ ] 33. Add mobile responsive layouts (grid-cols-1, hamburger nav)
  [ ] 34. Add bottom gradient fade overlay on hero screenshot
  [ ] 35. Add edge fade masks on all marquee components
  [ ] 36. Test FAQ accordion animation (height 0↔auto)
  [ ] 37. Test pricing toggle (monthly↔yearly price swap)
  [ ] 38. Add <meta> tags, OG image, favicon (grid icon)
  [ ] 39. Deploy to Vercel
```

***

## 17. RECOMMENDED NPM PACKAGES

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.x | App Router framework |
| `react` / `react-dom` | 18.x | Core React |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 3.x | Utility-first CSS |
| `framer-motion` | 11.x | Hero blur-in, scroll reveals, slider transitions |
| `@radix-ui/react-accordion` | latest | FAQ + How It Works collapsible |
| `@radix-ui/react-navigation-menu` | latest | Navbar dropdowns (Features, Solutions) |
| `@radix-ui/react-switch` | latest | Pricing Monthly/Yearly toggle |
| `@radix-ui/react-tabs` | latest | Features section tab switcher |
| `lucide-react` | latest | All icons (outline style) |
| `clsx` | latest | Conditional className utility |
| `tailwind-merge` | latest | Merge Tailwind classes safely in cn() |
| `next/font` | (built-in) | Load Inter font with zero layout shift |
| `@tailwindcss/typography` | latest | Blog post MDX body styling (prose class) |

### Install Command

```bash
npm install framer-motion \
  @radix-ui/react-accordion \
  @radix-ui/react-navigation-menu \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  lucide-react \
  clsx \
  tailwind-merge \
  @tailwindcss/typography
```

### `lib/utils.ts`

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

***

*End of document — acme.ai Full Reverse-Engineering Audit*
*Total sections: 17 | Pages audited: 5 | Components documented: 40+*
