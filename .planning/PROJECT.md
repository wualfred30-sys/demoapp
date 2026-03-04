# Investor Showcase App

## What This Is

A high-fidelity web application showcase designed for investors. It adapts the "Barangay Linkod" system into a premium, minimalist portal that demonstrates core capabilities like resident management and instant ID generation with zero friction.

## Core Value

Deliver a "wow" experience for investors by showcasing a visually stunning, responsive dashboard and a seamless ID generation flow that works instantly with minimal data entry.

## Requirements

### Validated

(None yet — initial showcase build)

### Active

- [ ] **UI-01**: Implement Neon Mint (#00FFA3) design system with Zinc/Deep Slate palette
- [ ] **UI-02**: Replicate Admin Dashboard layout (256px sidebar, sticky header, metric cards)
- [ ] **UX-01**: Implement "Showcase Mode" to temporarily disable non-critical form parameters
- [ ] **UX-02**: Add "Demo Data" pre-fill functionality for rapid ID generation
- [ ] **FEAT-01**: Refine Canvas-based ID generation for higher visual quality and branding
- [ ] **FEAT-02**: Implement instant client-side ID preview and generation
- [ ] **PERF-01**: Optimize animations and transitions using Framer Motion

### Out of Scope

- Full production database integration (focus on local/mock state for showcase)
- Real-time backend verification of IDs (mocked for demo)
- Complex multi-step official document requests (simplified for showcase)

## Context

- **Design Reference:** `C:\Users\ampoy\Barangay Linkod Project\BarangayLinkodWeb_Admin_Dashboard` (Neon Mint, Minimalist Zinc)
- **Current Tech:** Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, Supabase (for optional persistence)
- **Base Code:** Existing Barangay Linkod Next.js app in the current folder

## Constraints

- **Visual Fidelity:** Must match the reference dashboard's high-contrast, minimalist aesthetic exactly.
- **Frictionless:** Users (investors) should be able to see the full value without encountering "required field" errors or complex setups.
- **Performance:** Transitions must be buttery smooth (LCP < 2.5s).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pivot to Investor Showcase | Focus on presentation and core value for fundraising | — Pending |
| Adopt Neon Mint Theme | Modern, high-tech aesthetic from reference dashboard | — Pending |
| Relax Parameters | Ensure the demo never breaks during a live presentation | — Pending |

---
*Last updated: 2026-03-03 after initialization*
