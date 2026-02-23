# Lovable-Style UI Overhaul Plan for Token Wizard

This document outlines the detailed plan to rebuild the Token Creation pages (`app/create/*`) to exactly match the provided Lovable.dev IDE design specifications.

## 1. Global Architecture & Design System
- **Theme:** Deep Dark Mode. Primary UI background `#000000` or `#09090b`.
- **Glassmorphism:** Overlays and command bars use `bg-[rgba(20,20,20,0.8)]` with `backdrop-blur-[16px]`.
- **Typography:** Refine fonts to 13px-14px for UI labels (Medium weight), 32px-36px bold for main headers. (Geist Sans or Inter).
- **Accents:** Cyan/Teal (`#22D3EE`) for active states/primary toggles. Purple (`#9900FF`) to Blue (`#00CCFF`) gradients for glow effects and premium banners.
- **Icons:** Standardize all Lucide React icons to `strokeWidth={1.5}`.

## 2. Step-by-Step Implementation Plan

### Phase 1: Left Navigation Sidebar (`WizardSidebar.tsx`)
- **Width:** Fixed 260px.
- **Background:** Solid Matte Black (`#0c0c0c`).
- **Components to Add/Modify:**
  - **Workspace Dropdown:** "Akshay's Launchpad" style select with a 32px avatar logo.
  - **Primary Navigation:** Home, Search, Resources. Active state gets a subtle grey background (`bg-[#1a1a1a]`). Flex-column with 12px gap.
  - **Projects Group:** Label "Projects" (grey text). Items: All projects, Starred, Shared with me.
  - **Recents Group:** Dynamic list with hover-triggered actions (Edit, 3-dots).
  - **Footer Cards:** 
    - *Share Card*: Rounded box, gift icon, referral text.
    - *Upgrade Banner*: Prominent box, lightning bolt, purple-to-blue gradient border.
    - *User Profile*: 32px avatar + Inbox dot.
- **Styling:** `transition-colors`, active states.

### Phase 2: Main Content Area & Command Bar (`GoalInputStep.tsx`)
- **Background:** Implement CSS Animated Mesh Gradient (Pink `#FF3366` / Purple `#9900FF` / Cyan `#00CCFF`), slow-pulse, infinite transition.
- **Command Bar:** 
  - Centered input (`backdrop-blur-[16px] bg-black/60`). 
  - Add floating submenu button (`+`), Plan toggle switch (Cyan), Mic icon, and Circular Send arrow.
- **Dashboard Grid (Templates/Projects):** 
  - Tab system: "Recently viewed", "Templates". Slide transitions on switch.
  - 16:9 thumbnail cards dynamically fetched or styled placeholders. 4px lift-on-hover effect.
  - Quick actions anchored bottom-right.

### Phase 3: Loading States (`AILoadingStep.tsx`)
- **Animations:** Fading scale-ups via `framer-motion`.
- **Visuals:** Pulsing skeleton loaders or typewriter-style "Thoughts" as the AI generates the tokenomics.

### Phase 4: Project Preview / Editor (`ConfigPreviewStep.tsx`)
- **Header Bar:** Central "Preview" toggle, "History" viewer, right-aligned "Publish/Deploy" and "Upgrade" buttons.
- **Interaction Pane (Left side):** Shows AI "Thoughts" and a task checklist. (Adapted `ConfigSidebar.tsx`).
- **Preview Iframe (Right side):** A large, responsive container rendering the generated tokenomics charts.

## 3. Execution Strategy
We will implement this systematically, replacing the current wizard modules with these Exact-Match Lovable UI components. We will ensure the typography, colors, and border-radii perfectly align with the design spec.
