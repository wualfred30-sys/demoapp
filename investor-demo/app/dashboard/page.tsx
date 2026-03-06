"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DemoIdCard } from "../../components/demo-id-card"
import { InvestorDemoProfile, clearInvestorProfile, createEmptyProfile, formatAddress, loadInvestorProfile } from "../../lib/demo-storage"

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<InvestorDemoProfile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = loadInvestorProfile()
    setProfile(stored)
    setIsLoaded(true)
  }, [])

  const handleReset = () => {
    clearInvestorProfile()
    setProfile(createEmptyProfile())
    router.push("/register")
  }

  if (!isLoaded) {
    return (
      <main className="dashboard-shell">
        <section className="panel dashboard__panel empty-state">
          <p className="muted">Loading the investor demo dashboard.</p>
        </section>
      </main>
    )
  }

  if (!profile || !profile.fullName) {
    return (
      <main className="dashboard-shell">
        <section className="panel dashboard__panel empty-state">
          <span className="section__eyebrow">No resident profile</span>
          <h1 className="section__title">Start the registration demo first.</h1>
          <p className="section__copy">
            This dashboard expects the investor-demo registration flow to populate a resident
            profile in local demo storage.
          </p>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: "22px" }}>
            <Link href="/register" className="button button--primary">Go to registration</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">
      <div className="dashboard-topbar">
        <Link href="/" className="text-link">Investor demo home</Link>
        <div className="dashboard__actions">
          <Link href="/register" className="button button--ghost">Edit resident</Link>
          <button type="button" className="button button--secondary" onClick={handleReset}>Reset demo</button>
        </div>
      </div>

      <section className="dashboard__header">
        <div>
          <span className="section__eyebrow">Dashboard result</span>
          <h1 className="dashboard__title">The resident ID is now visible inside the dashboard.</h1>
          <p className="dashboard__copy">
            This screen proves the demo-critical promise: the chosen barangay, captured portrait,
            and resident details move directly into a usable digital ID surface.
          </p>
        </div>
      </section>

      <section className="dashboard__hero">
        <div className="panel dashboard__panel">
          <DemoIdCard profile={profile} />

          <div className="dashboard__pills">
            <div className="dashboard__pill">
              <strong>Barangay</strong>
              <span>{profile.barangay}</span>
            </div>
            <div className="dashboard__pill">
              <strong>Address</strong>
              <span>{profile.city}, {profile.province}</span>
            </div>
            <div className="dashboard__pill">
              <strong>State</strong>
              <span>Client-only investor demo</span>
            </div>
          </div>
        </div>

        <aside className="panel dashboard__panel">
          <div className="dashboard__meta">
            <div className="dashboard__meta-item">
              <span>Resident name</span>
              <strong>{profile.fullName}</strong>
            </div>
            <div className="dashboard__meta-item">
              <span>Full address</span>
              <strong>{formatAddress(profile)}</strong>
            </div>
            <div className="dashboard__meta-item">
              <span>Contact</span>
              <strong>{profile.mobileNumber || profile.email || "Not provided"}</strong>
            </div>
            <div className="dashboard__meta-item">
              <span>Occupation</span>
              <strong>{profile.occupation || "Not provided"}</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
