"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { IDCardView } from "./id-card-view"

interface Resident {
    id: string
    fullName: string
    address: string
    precinctId?: string
    photoUrl?: string
    barangay?: string
}

interface IDInspectionModalProps {
    resident: Resident | null
    open: boolean
    onClose: () => void
}

export function IDInspectionModal({ resident, open, onClose }: IDInspectionModalProps) {
    if (!resident) return null

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-40 bg-black/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        layoutId={`id-card-${resident.id}`}
                        className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 max-w-sm mx-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    >
                        {/* Close button — 48dp */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Close ID preview"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Full-size card — front view in modal */}
                        <div style={{ aspectRatio: "1.6 / 1" }}>
                            <IDCardView resident={resident} side="front" />
                        </div>

                        <p className="mt-3 text-center text-xs text-white/50">
                            Tap outside to close
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
