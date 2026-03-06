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
    mobileNumber?: string
    email?: string
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
                        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2"
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

                        <div className="rounded-[28px] bg-[#0B1120] p-3 shadow-2xl">
                            <div style={{ aspectRatio: "1.6 / 1" }}>
                                <IDCardView resident={resident} side="front" />
                            </div>

                            <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Resident</p>
                                        <p className="text-sm font-semibold text-white">{resident.fullName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Barangay</p>
                                        <p className="text-sm font-semibold text-[#8BF5D3]">{resident.barangay ?? "-"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Address</p>
                                    <p className="text-sm text-white/85">{resident.address || "-"}</p>
                                </div>
                                {(resident.mobileNumber || resident.email) && (
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Mobile</p>
                                            <p className="text-sm text-white/85">{resident.mobileNumber || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Email</p>
                                            <p className="truncate text-sm text-white/85">{resident.email || "-"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
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
