"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DemoIdCard } from "../../components/demo-id-card"
import { PhotoInput } from "../../components/photo-input"
import { StepProgress } from "../../components/step-progress"
import { InvestorDemoProfile, createEmptyProfile, saveInvestorProfile } from "../../lib/demo-storage"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<InvestorDemoProfile>(createEmptyProfile())
  const [error, setError] = useState("")

  useEffect(() => {
    setProfile((current) => ({ ...current, createdAt: current.createdAt || new Date().toISOString() }))
  }, [])

  const updateField = <K extends keyof InvestorDemoProfile>(field: K, value: InvestorDemoProfile[K]) => {
    setProfile((current) => ({ ...current, [field]: value }))
    if (error) {
      setError("")
    }
  }

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!profile.fullName.trim()) {
        setError("Enter the resident name so the dashboard ID has real identity data.")
        return false
      }

      if (!profile.barangay.trim()) {
        setError("Enter the target barangay for the ID preview.")
        return false
      }

      if (!profile.streetAddress.trim()) {
        setError("Enter the street or sitio address for the demo record.")
        return false
      }
    }

    setError("")
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return
    }

    setStep((current) => Math.min(current + 1, 2))
  }

  const handleBack = () => {
    setError("")
    setStep((current) => Math.max(current - 1, 0))
  }

  const handleSubmit = () => {
    saveInvestorProfile(profile)
    router.push("/dashboard")
  }

  return (
    <main className="form-shell">
      <div className="form-topbar">
        <Link href="/" className="text-link">Back to investor demo</Link>
      </div>

      <section className="panel form-card">
        <StepProgress currentStep={step} />

        {step === 0 && (
          <>
            <span className="section__eyebrow">Step 1</span>
            <h1>Capture the resident portrait.</h1>
            <p className="form-card__copy muted">
              On mobile devices the button opens the camera. On desktop it falls back to image
              selection. This keeps the demo reliable without a live camera dependency.
            </p>
            <PhotoInput value={profile.photoDataUrl} onChange={(value) => updateField("photoDataUrl", value)} />
          </>
        )}

        {step === 1 && (
          <>
            <span className="section__eyebrow">Step 2</span>
            <h1>Collect the resident details.</h1>
            <p className="form-card__copy muted">
              This is the exact data the investor needs to see moving cleanly into the dashboard ID.
            </p>

            <div className="field-grid">
              <div className="field">
                <label htmlFor="fullName">Resident full name</label>
                <input id="fullName" value={profile.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Maria Dela Cruz" />
              </div>

              <div className="field">
                <label htmlFor="barangay">Desired barangay</label>
                <input id="barangay" list="barangay-options" value={profile.barangay} onChange={(event) => updateField("barangay", event.target.value)} placeholder="Barangay Mawaque" />
                <datalist id="barangay-options">
                  <option value="Barangay Mawaque" />
                  <option value="Barangay Dau" />
                  <option value="Barangay Mabiga" />
                  <option value="Barangay Dolores" />
                  <option value="Barangay San Francisco" />
                </datalist>
              </div>

              <div className="field field--full">
                <label htmlFor="streetAddress">Street or sitio address</label>
                <input id="streetAddress" value={profile.streetAddress} onChange={(event) => updateField("streetAddress", event.target.value)} placeholder="Sitio Poblacion, Block 4 Lot 12" />
              </div>

              <div className="field">
                <label htmlFor="city">City or municipality</label>
                <input id="city" value={profile.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Mabalacat City" />
              </div>

              <div className="field">
                <label htmlFor="province">Province</label>
                <input id="province" value={profile.province} onChange={(event) => updateField("province", event.target.value)} placeholder="Pampanga" />
              </div>

              <div className="field">
                <label htmlFor="mobileNumber">Mobile number</label>
                <input id="mobileNumber" value={profile.mobileNumber} onChange={(event) => updateField("mobileNumber", event.target.value)} placeholder="+63 912 345 6789" />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={profile.email} onChange={(event) => updateField("email", event.target.value)} placeholder="resident@example.com" />
              </div>

              <div className="field field--full">
                <label htmlFor="occupation">Occupation</label>
                <input id="occupation" value={profile.occupation} onChange={(event) => updateField("occupation", event.target.value)} placeholder="Small business owner" />
                <span className="field__hint">Optional, but useful for a richer investor-facing ID preview.</span>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="section__eyebrow">Step 3</span>
            <h1>Preview the exact ID investors will see.</h1>
            <p className="form-card__copy muted">
              This review step makes the demo legible. The resident photo, barangay, and personal
              details are already bound to the dashboard card below.
            </p>

            <div className="summary-grid">
              <div className="summary-grid__item">
                <span>Resident</span>
                <strong>{profile.fullName || "Not set"}</strong>
              </div>
              <div className="summary-grid__item">
                <span>Barangay</span>
                <strong>{profile.barangay || "Not set"}</strong>
              </div>
              <div className="summary-grid__item">
                <span>Contact</span>
                <strong>{profile.mobileNumber || profile.email || "Not set"}</strong>
              </div>
              <div className="summary-grid__item">
                <span>Address</span>
                <strong>{profile.streetAddress || "Not set"}</strong>
              </div>
            </div>

            <DemoIdCard profile={profile} />
          </>
        )}

        {error ? <div className="error-box">{error}</div> : null}

        <div className="form-card__actions" style={{ marginTop: "28px" }}>
          {step > 0 ? <button type="button" className="button button--ghost" onClick={handleBack}>Back</button> : null}
          {step < 2 ? (
            <button type="button" className="button button--primary" onClick={handleNext}>Continue</button>
          ) : (
            <button type="button" className="button button--primary" onClick={handleSubmit}>Open dashboard</button>
          )}
        </div>
      </section>
    </main>
  )
}
