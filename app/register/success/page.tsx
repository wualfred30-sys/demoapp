"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Download } from "lucide-react"
import { ExportModal } from "@/components/export/ExportModal"
import { useAuth } from "@/lib/auth-context"

export default function RegisterSuccessPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [exportOpen, setExportOpen] = useState(false)

  // Comment 4 fix: user.id is stable — assigned by auth-context at login time.
  // Use empty string as a sentinel; the page only renders after successful registration
  // so `user` is guaranteed to have a stable id at this point.
  const resident = {
    id: user?.id ?? "",
    fullName: user?.fullName ?? "Resident",
    address: user?.address ?? "",
    barangay: "Barangay Linkod",
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 items-center justify-center p-6 mt-[-40px]">
        <div className="flex w-full max-w-sm flex-col items-center flex-1 justify-center">
          {/* Checkmark */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#28FA93]/20">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#28FA93]">
                <Check className="h-8 w-8 text-white" strokeWidth={4} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-center text-[32px] font-black leading-none tracking-tight text-[#333333]">
            Registration<br />Successful!
          </h1>

          {/* Body */}
          <p className="mb-10 text-center text-[15px] font-medium leading-relaxed text-[#777777] max-w-[280px]">
            Your account has been created. You can now download your digital ID.
          </p>

          <div className="flex w-full flex-col gap-4">
            {/* Export ID — primary CTA */}
            <Button
              onClick={() => setExportOpen(true)}
              className="h-[56px] w-full rounded-full bg-[#28FA93] hover:bg-[#22EA8A] text-[18px] font-bold text-white shadow-[0_8px_20px_rgba(40,250,147,0.25)] transition-all active:scale-[0.98]"
            >
              <Download className="mr-2 h-5 w-5" />
              Export Digital ID
            </Button>

            {/* Dashboard — secondary */}
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="h-[56px] w-full rounded-full border border-gray-200 bg-[#EFEFEF] hover:bg-[#E5E5E5] text-[18px] font-bold text-[#555555] transition-all active:scale-[0.98]"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        resident={resident}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  )
}
