# Phase 1: Brand, Layout & Dashboard - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the premium visual identity (Neon Mint) and the core application shell (Header + Dashboard Container). This phase delivers the "look and feel" that will host the registration and ID generation.

</domain>

<decisions>
## Implementation Decisions

### Layout & Navigation
- **No Sidebar:** The application flow (Registration to Dashboard) must be sidebar-free. Minimalist, focused center-column layout.
- **Sticky Header:** Contains only the essential navigation and the brand logo.
- **Responsive Shell:** Optimized for mobile and desktop without layout shifts.

### Branding & Logo
- **Logo Usage:** Exclusively use the **Linkod App logo** in the header. Do NOT include the Bagong Pilipinas logo.
- **Color Palette:** Neon Mint (#00FFA3) for primary actions/accents. Zinc/Deep Slate background for a high-contrast, premium "Investor" feel.
- **Typography:** Montserrat (or similar bold sans-serif) for high readability and a modern aesthetic.

### Dashboard Behavior
- **Focus:** The dashboard is a container for the generated ID card. 
- **Instant Result:** On landing, the dashboard must instantly display the user's generated ID card based on their registration data.
- **Simplified UI:** No complex metric cards, operations tables, or sidebar navigation.

### Claude's Discretion
- Exact spacing and padding for the dashboard container.
- Implementation of the Framer Motion transitions between registration and dashboard.
- Button hover states and micro-interactions.

</decisions>

<specifics>
## Specific Ideas

- "Registration to Dashboard should be as simple as possible."
- "The dashboard should feel like the result of the registration—showing the ID card immediately."
- Visual reference for accent: Neon Mint (#00FFA3).

</specifics>

<deferred>
## Deferred Ideas

- Sidebar navigation — explicitly removed for this flow.
- Bagong Pilipinas logo — explicitly removed for this app.
- Complex analytics/metric cards — deferred to keep the showcase simple.

</deferred>

---

*Phase: 01-brand-layout-dashboard*
*Context gathered: 2026-03-03*
