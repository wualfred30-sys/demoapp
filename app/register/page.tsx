"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AddressSelector } from "@/components/address-selector"
import { PhotoCapture } from "@/components/photo-capture"

const STEPS = ["Profile Photo", "Your Info", "Account"]

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-8 w-full max-w-sm px-3">
      <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-px bg-border" aria-hidden="true" />
        <div
          className="absolute left-0 top-4 h-px bg-[#00FFCC] transition-all duration-300"
          style={{ width: `${current === 0 ? 0 : (current / (STEPS.length - 1)) * 100}%` }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-3">
          {STEPS.map((label, i) => {
            const done = i < current
            const active = i === current

            return (
              <div key={label} className="flex flex-col items-center text-center">
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background text-xs font-bold transition-all
                    ${done
                      ? "bg-[#00FFCC] text-black"
                      : active
                        ? "border-2 border-[#00FFCC] text-[#00FFCC]"
                        : "border-2 border-border text-muted-foreground"
                    }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </div>
                <span
                  className={`mt-3 text-[10px] font-medium leading-tight ${active ? "text-[#00FFCC]" : done ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    mobileNumber: "",
    // Comment 1 fix: canonical field name is `photoUrl` end-to-end
    photoUrl: "",
    addressData: {
      region: "",
      province: "",
      city: "",
      barangay: "",
      street: ""
    },
    agreedToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  // Comment 3 fix: ref to force-stop the camera before leaving step 0
  const stopCameraRef = useRef<(() => void) | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError(null)
  }

  // Comment 3 fix: call this before any navigation away from step 0
  const leavePhotoStep = useCallback(() => {
    stopCameraRef.current?.()
  }, [])

  const validateStep0 = () => {
    // Photo capture is optional — always allow continuation
    setError(null)
    return true
  }

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError("Please enter the resident's full name.")
      return false
    }

    if (!formData.addressData.barangay) {
      setError("Please select the resident's barangay.")
      return false
    }

    setError(null)
    return true
  }

  const validateStep2 = () => {
    // Only strictly require email and password to create the account securely
    if (!formData.email || !formData.password) {
      setError("Please fill in email and password to create an account.")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return false
    }

    if (!formData.agreedToTerms) {
      setError("You must agree to the Privacy Policy to proceed.")
      return false
    }

    setError(null)
    return true
  }

  const handleNext = () => {
    setError(null)
    if (step === 0) {
      if (!validateStep0()) return
      // Comment 3 fix: stop camera before transitioning off the photo step
      leavePhotoStep()
    } else if (step === 1) {
      if (!validateStep1()) return
    }
    setStep((s) => s + 1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateStep2()) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Comment 4 fix: do NOT pass a runtime-generated id here — let auth-context
      // generate a stable UUID inside login() so it is assigned exactly once.
      // Comment 1 fix: use canonical `photoUrl` field.
      login({
        mobileNumber: formData.mobileNumber,
        fullName: formData.fullName,
        email: formData.email,
        photoUrl: formData.photoUrl,
        barangay: formData.addressData.barangay,
        address: [
          formData.addressData.street,
          formData.addressData.barangay,
          formData.addressData.city,
          formData.addressData.province,
        ].filter(Boolean).join(", "),
      })
      router.push("/register/success")
    } catch {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        <button
          onClick={() => {
            if (step > 0) {
              setStep((s) => s - 1)
            } else {
              // Comment 3 fix: stop camera on back navigation from step 0
              leavePhotoStep()
              router.push("/")
            }
          }}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {step > 0 ? "Back" : "Home"}
        </button>
      </header>

      <main className="flex-1 px-5 pt-8 pb-10">
        <StepProgress current={step} />

        {/* Step 0: Profile Photo */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile Photo</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Take a selfie for your digital ID. This is optional.
              </p>
            </div>
            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
            )}

            {/* Comment 2 fix: visual attachment indicator */}
            {formData.photoUrl && (
              <div className="flex items-center gap-2 rounded-xl bg-[#00FFCC]/10 px-4 py-2.5">
                <Check className="h-4 w-4 text-[#00CCAA]" strokeWidth={3} />
                <span className="text-sm font-semibold text-[#00CCAA]">Photo successfully attached</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <PhotoCapture
                onPhotoCaptured={(data) => {
                  // Comment 2 fix: committed immediately on capture; empty string means cleared
                  setFormData((prev) => ({ ...prev, photoUrl: data }))
                }}
                // Comment 3 fix: give parent access to stopCamera so step transitions can clean up
                onCameraStop={(stopFn) => { stopCameraRef.current = stopFn }}
              />
            </div>
            <Button
              className="h-14 w-full rounded-2xl bg-[#00FFCC] font-bold text-black hover:bg-[#00DDAA]"
              onClick={handleNext}
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="h-14 w-full rounded-2xl font-bold border-border"
              onClick={() => {
                // Comment 3 fix: stop camera before skipping
                leavePhotoStep()
                setFormData((prev) => ({ ...prev, photoUrl: "" }))
                setStep((s) => s + 1)
              }}
            >
              Skip for now
            </Button>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Information</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your personal details.
              </p>
            </div>
            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
            )}
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName">Full Name (as appears on ID)</Label>
                <Input
                  id="fullName" name="fullName"
                  value={formData.fullName} onChange={handleChange}
                  placeholder="Juan Dela Cruz"
                  className="h-11"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber" name="mobileNumber" type="tel"
                  value={formData.mobileNumber} onChange={handleChange}
                  placeholder="+63 912 345 6789"
                  className="h-11"
                />
              </div>
              <div className="grid gap-1.5 border border-[#E5E7EB] rounded-2xl p-4 bg-[#F9FAFB]">
                <Label className="mb-2 text-base font-bold">Complete Address</Label>
                <AddressSelector
                  value={formData.addressData}
                  onChange={(val) => setFormData(prev => ({ ...prev, addressData: val }))}
                />
              </div>
            </div>
            <Button
              className="h-14 w-full rounded-2xl bg-[#00FFCC] font-bold text-black hover:bg-[#00DDAA]"
              onClick={handleNext}
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Account Setup */}
        {step === 2 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Set up your login credentials.</p>
            </div>
            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
            )}
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" name="email" type="text"
                  value={formData.email} onChange={handleChange}
                  placeholder="your.email@example.com"
                  disabled={isLoading} className="h-11"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password" name="password" type="password"
                  value={formData.password} onChange={handleChange}
                  disabled={isLoading} className="h-11"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword" name="confirmPassword" type="password"
                  value={formData.confirmPassword} onChange={handleChange}
                  disabled={isLoading} className="h-11"
                />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreedToTerms"
                checked={formData.agreedToTerms}
                onCheckedChange={(c) => setFormData({ ...formData, agreedToTerms: c === true })}
                disabled={isLoading} className="mt-0.5"
              />
              <Label htmlFor="agreedToTerms" className="text-sm leading-tight text-muted-foreground">
                I agree to the Privacy Policy
              </Label>
            </div>
            <Button
              type="submit"
              className="h-14 w-full rounded-2xl bg-[#00FFCC] font-bold text-black hover:bg-[#00DDAA]"
              disabled={isLoading}
            >
              {isLoading ? "Creating account…" : "Register"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#00CCAA] hover:underline">Sign In</Link>
            </p>
          </form>
        )}
      </main>
    </div>
  )
}
