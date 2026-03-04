"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-5">
        <div className="flex flex-col items-center mt-[-60px]">
          <div className="h-32 w-32 relative mb-6 animate-pulse">
            <Image
              src="/images/cat-logo.svg"
              alt="Cat Logo"
              fill
              priority
              className="object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-[36px] font-black leading-none tracking-tight text-[#333333] mb-3 text-center">
            Barangay Linkod
          </h1>
          <p className="text-[15px] text-[#777777] font-medium mb-16 text-center max-w-[280px]">
            Connecting you to your barangay services.
          </p>
          <div className="h-2 w-6 bg-[#28FA93] rounded-full animate-bounce"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10 relative">
      <div className="flex w-full max-w-sm flex-col items-center flex-1 justify-center mt-[-40px]">
        {/* Logo */}
        <div className="h-32 w-32 relative mb-6">
          <Image
            src="/images/cat-logo.svg"
            alt="Cat Logo"
            fill
            priority
            className="object-contain drop-shadow-md"
          />
        </div>

        {/* Headlines */}
        <h1 className="text-[40px] font-black leading-[1.05] tracking-tight text-[#333333] text-center mb-4">
          Barangay<br />
          Linkod App
        </h1>

        <p className="text-[15px] font-medium leading-relaxed text-[#777777] text-center mb-10 max-w-[280px]">
          Connecting you to your barangay services.
        </p>

        {/* CTAs */}
        <div className="flex w-full flex-col gap-4">
          <Button
            asChild
            className="h-[56px] w-full rounded-full bg-[#28FA93] hover:bg-[#22EA8A] text-[18px] font-bold text-white shadow-[0_8px_20px_rgba(40,250,147,0.25)] transition-all active:scale-[0.98]"
          >
            <Link href="/register">
              Get Started
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-[56px] w-full rounded-full border border-gray-200 bg-[#EFEFEF] hover:bg-[#E5E5E5] text-[18px] font-bold italic text-[#555555] transition-all active:scale-[0.98]"
          >
            <Link href="/login" className="not-italic">
              Sign in
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 flex flex-col items-center">
        <span className="text-[11px] font-semibold text-[#888888] mb-2 uppercase tracking-wide">Sponsored by</span>
        <div className="flex items-center gap-1.5 font-bold text-[#005DFE] text-2xl tracking-tighter">
          <div className="relative flex items-center justify-center">
            <div className="h-7 w-7 rounded-full bg-[#005DFE] flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <div className="absolute h-9 w-9 border-2 border-[#005DFE] border-r-transparent rounded-full opacity-60"></div>
          </div>
          <span className="ml-1">GCash</span>
        </div>
      </div>
    </main>
  )
}
