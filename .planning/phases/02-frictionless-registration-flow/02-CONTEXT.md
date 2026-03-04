# Phase 2: Frictionless Registration Flow - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement a high-fidelity, multi-step registration wizard optimized for investor demonstrations. This includes relaxed validation, instant auto-fill capabilities, and a visual style matching the staff registration portal.

</domain>

<decisions>
## Implementation Decisions

### Wizard Structure
- **Multi-step Layout:** Progressive disclosure using 3-4 distinct steps (e.g., Account, Personal Info, ID Verification).
- **Navigation:** Smooth transitions between steps using Framer Motion (matching the reference dashboard's premium feel).

### Demo & Frictionless Experience
- **Real Auto-fill Integration:** Utilize the existing `IDScanner` and data extraction architecture. The "Demo Auto-fill" button should trigger the actual data parsing flow (using a pre-selected high-quality demo ID image) to demonstrate the real technical capability.
- **Frictionless Flow:** Relaxed validation for non-critical fields (like password confirmation or exact address formatting) ensures the demonstration remains smooth while showing off real tech.

### Visual Identity
- **Design Reference:** Replicate the aesthetic of the Next.js staff registration screens and the provided landing/loading screenshots.
- **Branding:** Consistent use of the **Linkod App logo** (no Bagong Pilipinas).
- **Loading States:** High-fidelity loading animations matching the "Linkod App registration loading.png" reference.

### Claude's Discretion
- Exact number and naming of wizard steps.
- Transition timings and easing functions.
- Layout of the success screen before the dashboard transition.

</decisions>

<specifics>
## Specific Ideas

- "Demo should auto-fill everything, including the ID scan."
- "Wizard style like the staff registration portal."
- Field list from existing code: fullName, email, mobileNumber, address.

</specifics>

<deferred>
## Deferred Ideas

- Full real-time ID verification — simulated for this showcase phase.
- Backend user creation — focused on the frontend "flow" for the showcase.

</deferred>

---

*Phase: 02-frictionless-registration-flow*
*Context gathered: 2026-03-04*
