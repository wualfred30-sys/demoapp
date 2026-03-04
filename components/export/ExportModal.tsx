"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface Resident {
    id: string
    fullName: string
    address: string
    precinctId?: string
    barangay?: string
}

interface ExportModalProps {
    resident: Resident
    open: boolean
    onClose: () => void
}

type Step = "idle" | "generating" | "ready" | "done"

export function ExportModal({ resident, open, onClose }: ExportModalProps) {
    const [step, setStep] = useState<Step>("idle")

    const handleExport = async () => {
        setStep("generating")

        // Dynamically import generators to avoid SSR issues
        const { generateIDPdf } = await import("@/lib/pdf-template")
        const { generateQRTIDImages } = await import("@/lib/qrt-id-generator-canvas")

        const placeholder =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

        let frontImg = placeholder
        let backImg = placeholder

        try {
            const qrtCode = `QRT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`
            const verificationCode = String(Math.floor(Math.random() * 1000000)).padStart(6, "0")

            const generated = await generateQRTIDImages({
                qrtCode,
                verificationCode,
                fullName: resident.fullName,
                birthDate: "",
                address: resident.address,
                gender: "",
                civilStatus: "",
                birthPlace: "",
                photoUrl: "",
                issuedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                emergencyContactName: "",
                emergencyContactPhone: "",
                emergencyContactRelationship: "",
                emergencyContactAddress: "",
                qrCodeData: "",
                precinctNumber: resident.precinctId,
            })

            if (generated.success) {
                frontImg = generated.frontImageUrl || placeholder
                backImg = generated.backImageUrl || placeholder
            }

            const doc = await generateIDPdf(resident, frontImg, backImg)
            doc.save(`${resident.fullName.replace(/\s+/g, "_")}_Barangay_ID.pdf`)
            setStep("done")

            // Celebrate!
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#28FA93", "#ffffff", "#111827"],
            })
        } catch {
            setStep("idle")
        }
    }

    const handleClose = () => {
        setStep("idle")
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl bg-background p-6 pb-safe-area-inset-bottom"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Handle */}
                        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />

                        {/* Close */}
                        <button
                            onClick={handleClose}
                            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                            aria-label="Close export"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Content */}
                        {step !== "done" ? (
                            <>
                                <div className="mb-6 flex flex-col gap-1">
                                    <h2 className="text-xl font-bold text-foreground">Export Digital ID</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Download a print-ready A4 PDF with crop marks at 300 DPI.
                                    </p>
                                </div>

                                {/* Resident summary */}
                                <div className="mb-6 rounded-xl border border-border bg-muted/40 p-4">
                                    <p className="text-sm font-semibold text-foreground">{resident.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{resident.address}</p>
                                    {resident.precinctId && (
                                        <p className="mt-1 text-xs font-medium text-[#28FA93]">Precinct {resident.precinctId}</p>
                                    )}
                                </div>

                                <Button
                                    className="h-14 w-full rounded-2xl text-base font-semibold bg-[#28FA93] text-white shadow-[0_4px_14px_rgba(40,250,147,0.3)] hover:bg-[#22EA8A] transition-all active:scale-[0.98]"
                                    onClick={handleExport}
                                    disabled={step === "generating"}
                                >
                                    {step === "generating" ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating PDF…
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-5 w-5" />
                                            Download PDF
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#28FA93]/15">
                                    <Check className="h-8 w-8 text-[#28FA93]" strokeWidth={2.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-foreground">ID Downloaded!</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Your PDF is saved to your downloads.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-2 h-12 w-full rounded-2xl"
                                    onClick={handleClose}
                                >
                                    Close
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
