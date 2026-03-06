# Demo Audit Appendix

## Purpose

This appendix reclassifies the existing production-oriented audit findings for the current investor demo milestone. It does not weaken the production audit in [AUDIT.md](C:\Users\ampoy\Investor Showcase App\Investor Showcase App\Investor_showcase_app\Investor_showcase_app\AUDIT.md). It explains what must be fixed now for the demo story to work and what remains deferred production risk.

## Canonical Demo Funnel

The only demo-critical resident journey for this milestone is:

`register -> dashboard`

Success means the app can:
- capture a resident photo
- capture resident identity and address data
- capture the selected barangay
- persist the resident profile
- render the same resident data on the dashboard ID

QRT and production-grade issuance flows are explicitly secondary for this milestone.

## Reclassification Matrix

| Finding Area | Production Severity | Demo Impact | Disposition |
| --- | --- | --- | --- |
| Fake resident/staff auth | Critical | Low for investor demo | Defer; keep documented in `AUDIT.md` |
| PII in localStorage | Critical | Low for investor demo if contained to demo environment | Defer; keep documented in `AUDIT.md` |
| Public verification/API trust gaps | Critical/High | Low for current demo funnel | Defer; keep documented in `AUDIT.md` |
| Missing server-side validation | Critical | Low for current demo funnel | Defer; keep documented in `AUDIT.md` |
| Hardcoded barangay display on resident ID surfaces | Medium | High | Fix now |
| Incomplete resident profile contract for photo/barangay | Medium | High | Fix now |
| Register flow not reliably carrying profile data to dashboard | High | High | Fix now |
| QRT request issues unrelated to `register -> dashboard` | Medium/High | Low | Defer for later milestone |

## Must-Fix Now

- Make barangay a first-class resident field in the canonical auth/profile object
- Persist the selected barangay during registration
- Persist the captured photo during registration
- Ensure the dashboard ID reads resident data from that canonical object
- Remove hardcoded barangay display from resident-facing ID surfaces

## Deferred Production Hardening

- real authentication and authorization
- server-side validation and persistence
- Philippine privacy/compliance hardening beyond demo containment
- public verification and API trust-boundary remediation
- long-term retention and deletion controls

## Approval Standard For This Demo Milestone

The demo is acceptable for investor visualization when:
- a user can register with a selected barangay
- a captured photo persists across the resident session
- the dashboard ID shows the resident's actual name, address, barangay, and photo
- no secondary QRT or production-only issue blocks that flow
