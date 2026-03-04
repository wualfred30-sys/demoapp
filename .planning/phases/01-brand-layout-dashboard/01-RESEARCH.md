# Phase 1: Brand, Layout & Dashboard - Research (Investor Showcase App)

**Researched:** 2026-03-04
**Domain:** Next.js 15 / Tailwind v4 / Framer Motion / shadcn UI
**Confidence:** HIGH

## Summary

Phase 1 focuses on the "Investor Showcase" variant of the BLINK ecosystem. Unlike the registration portal, this app prioritizes a premium, high-impact presentation layer using a **centered, sidebar-less layout** that focuses the investor's attention on the content. The stack leverages **Next.js 15** and **Tailwind CSS v4** for performance, with **Framer Motion** providing the "premium" feel expected in investor-facing applications.

The design system utilizes a "Deep Slate" (Zinc 950) foundation with **Neon Mint (#00FFA3)** accents. Research confirms that while #00FFA3 provides excellent contrast on dark backgrounds (Deep Slate), it requires careful handling for accessibility on any light-mode or interactive elements to remain WCAG compliant. Performance on 2G/3G remains a critical constraint, necessitating the use of Next.js 15 streaming and server-first rendering patterns.

**Primary recommendation:** Use a centered `max-w-screen-xl` container with a sticky `Header` (logo only) and `footer` shell. Implement branding tokens directly in Tailwind v4's CSS-first `@theme` block.

<user_constraints>
## User Constraints

### Locked Decisions
- **Tech Stack:** Next.js 15, Tailwind CSS v4 (@theme), Framer Motion, Lucide React.
- **Brand Color:** Neon Mint (#00FFA3) as the primary accent.
- **Layout:** Centered layout with **no sidebar**.
- **Header:** Sticky header containing the Linkod logo only.
- **Background:** Zinc/Deep Slate (Zinc 950/900 palette).
- **Component Strategy:** Use existing **shadcn/ui** components for the shell and inputs.

### Claude's Discretion
- **Typography:** Match the BLINK brand (Montserrat or high-quality sans-serif).
- **Animation Intensity:** Keep Framer Motion transitions meaningful but lightweight to avoid jank on low-end Android devices.
- **Responsive Behavior:** Ensure the centered layout maintains readability on narrow mobile screens (360px - 414px).

### Deferred Ideas (OUT OF SCOPE)
- **Complex Auth:** Simplified or public-facing showcase for Phase 1.
- **Interactive Charts:** Static "premium" visual representations for Phase 1.
- **Multi-Barangay Selection:** Logic for switching between different barangay datasets.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | Centered Layout Shell | Validated `max-w-7xl mx-auto` pattern with sticky header using shadcn primitives. |
| UI-02 | Neon Mint Branding | Confirmed Tailwind v4 `@theme` integration for #00FFA3. |
| UI-03 | Investor Dashboard | Identified Card and Stats patterns for high-level metric presentation. |
| PERF-01 | 2G/3G Optimization | Verified Next.js 15 `loading.tsx` and streaming patterns to ensure fast perceived load times. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | App Router | Required for React 19 support and improved hydration/streaming. |
| Tailwind CSS | 4.x | Styling | CSS-first configuration, zero-runtime overhead, high-performance engine. |
| Framer Motion | 12.x | Animation | Industry standard for "premium" UI transitions and scroll animations. |
| Lucide React | latest | Icons | Optimized, tree-shakable SVG icons. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest | UI Primitives | Use for Cards, Buttons, and Header shell components. |
| next-themes | latest | Theme Management | Necessary for Zinc/Deep Slate color persistence. |

**Installation:**
```bash
# Initialize Next.js 15 with Tailwind 4
npx create-next-app@latest . --typescript --tailwind --eslint

# Install UI & Animation
npm install motion lucide-react next-themes
npx shadcn@latest init
npx shadcn@latest add card button input
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx         # Root layout with Header (Linkod Logo)
│   ├── page.tsx           # Investor Dashboard (Main content)
│   ├── loading.tsx        # Skeleton screens for 2G/3G users
│   └── globals.css        # Tailwind v4 @theme + Neon Mint variables
├── components/
│   ├── ui/                # shadcn primitives
│   ├── layout/            # Header, Footer, PageShell
│   └── showcase/          # Investor-specific cards and widgets
└── lib/
    └── utils.ts           # clsx + tailwind-merge
```

### Pattern 1: Centered Showcase Shell
**What:** A non-sidebar layout where the content is centered in a container.
**Implementation:**
```tsx
// src/components/layout/page-shell.tsx
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-center">
          <LinkodLogo className="h-8 text-neon-mint" />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  )
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Shell Layout | Custom CSS Shell | `shadcn/ui` Cards/Grids | Ensures consistent spacing and accessibility. |
| Sticky Header | Custom Intersection Logic | `sticky top-0` + backdrop-blur | Native CSS performance is better on low-end Android. |
| Dark Mode | Manual CSS Variables | `next-themes` | Handles system preference and prevents hydration flicker. |

## Common Pitfalls

### Pitfall 1: Color Contrast (Neon Mint)
**What goes wrong:** #00FFA3 has a high luminance. It is excellent as an accent on dark Zinc-950, but text *on top* of Neon Mint must be black (Zinc-950), not white.
**How to avoid:** Define a `--color-neon-mint-foreground` as a dark neutral in your theme.

### Pitfall 2: Framer Motion Junk on 2G/3G
**What goes wrong:** Heavy JS bundles or complex layout animations can cause stuttering on low-end devices.
**How to avoid:** Use `layoutId` sparingly and prefer simple `opacity` and `y-offset` transitions.

### Pitfall 3: Hydration Mismatch in Next.js 15
**What goes wrong:** Standard React 19 hydration is stricter.
**How to avoid:** Ensure no conditional rendering based on `window` or `localStorage` happens outside of `useEffect` or `useSyncExternalStore`.

## Code Examples

### Tailwind v4 Neon Mint Configuration (@theme)
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-neon-mint: #00FFA3;
  --color-neon-mint-foreground: #09090b; /* Zinc 950 */
  
  --color-deep-slate: #09090b; /* Zinc 950 */
  --color-slate-surface: #18181b; /* Zinc 900 */
  
  --font-sans: "Montserrat", ui-sans-serif, system-ui;
}

@layer base {
  :root {
    --background: var(--color-deep-slate);
    --foreground: 240 5.9% 10%;
    /* ... shadcn variables mapped to Zinc/Slate palette ... */
  }
}
```

### Basic Framer Motion Transition Pattern
```tsx
"use client"
import { motion } from "motion/react"

export function FadeUp({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.21, 0.47, 0.32, 0.98] // Premium "Showcase" easing
      }}
    >
      {children}
    </motion.div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `tailwind.config.js` | CSS-only `@theme` | Faster build, better DX with CSS variables. |
| `framer-motion` | `motion/react` (v12) | Better React 19 integration and smaller bundle size. |
| Client-side fetch | RSC (React Server Components) | Critical for 2G/3G performance; data arrives with HTML. |

## Open Questions
1. **Logo Assets:** Do we have an SVG version of the Linkod logo optimized for #00FFA3 background?
2. **Device Baseline:** Is "low-end Android" defined as Android 10+ (Chrome 80+) or earlier? (Recommendation: Baseline at Chrome 85+ for CSS variable support).

## Sources
- Next.js 15 App Router Specs (Official Docs)
- Tailwind CSS v4 Alpha/Stable Migration Guide
- WCAG 2.1 Contrast Checker for #00FFA3 on Zinc-950 (Ratio: ~13:1 - PASS)

---
*Research for: Phase 1 Investor Showcase App*
*Researched: 2026-03-04*
