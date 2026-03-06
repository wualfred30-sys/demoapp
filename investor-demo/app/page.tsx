import Link from "next/link"

export default function InvestorDemoHome() {
  return (
    <main>
      <section className="hero">
        <div className="shell hero__frame">
          <div>
            <span className="hero__eyebrow">Investor demo architecture</span>
            <h1 className="hero__title">A resilient demo should open cleanly, everywhere.</h1>
            <p className="hero__copy">
              This dedicated flow strips the experience down to the story investors need to see:
              resident onboarding, barangay selection, portrait capture, and digital ID rendering
              inside the dashboard. No server routes. No heavy provider tree. No dependence on a
              fragile preview hostname.
            </p>

            <div className="hero__actions">
              <Link href="/register" className="button button--primary">Open investor demo</Link>
              <Link href="/dashboard" className="button button--ghost">View sample dashboard</Link>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <strong>Static</strong>
                <span>Deployable to a custom domain without API coupling</span>
              </div>
              <div className="hero__stat">
                <strong>Focused</strong>
                <span>Only the onboarding-to-ID story remains in scope</span>
              </div>
              <div className="hero__stat">
                <strong>Reliable</strong>
                <span>No dependency on the full app runtime for the demo path</span>
              </div>
            </div>
          </div>

          <div className="hero__card">
            <div>
              <p className="hero__card-label">Resident experience</p>
              <div className="hero__card-title">Register. Verify. Present the ID.</div>
            </div>

            <div className="hero__card-grid">
              <div>
                <span>Step 1</span>
                <strong>Capture photo</strong>
              </div>
              <div>
                <span>Step 2</span>
                <strong>Select barangay</strong>
              </div>
              <div>
                <span>Step 3</span>
                <strong>Render dashboard ID</strong>
              </div>
              <div>
                <span>Hosting</span>
                <strong>Static custom domain</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <span className="section__eyebrow">Why this exists</span>
          <h2 className="section__title">Separate the investor story from the full application stack.</h2>
          <p className="section__copy">
            The production app can keep its wider feature set. The investor demo should stay fast,
            deterministic, and easy to share, even when external preview infrastructure or local
            network quirks are not cooperating.
          </p>

          <div className="section__grid">
            <article className="section__card">
              <h3>Lean runtime</h3>
              <p>
                The demo uses a small local state layer instead of mounting the full application
                provider tree on first load.
              </p>
            </article>
            <article className="section__card">
              <h3>Portable hosting</h3>
              <p>
                Static export keeps the demo compatible with custom-domain hosting on Cloudflare
                Pages or similar static hosts.
              </p>
            </article>
            <article className="section__card">
              <h3>Clear narrative</h3>
              <p>
                Investors see the core value quickly: resident details in, digital ID out, presented
                inside a dashboard that feels finished.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
