"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IDCardView } from "./id-card-view"

interface Resident {
    id: string
    fullName: string
    address: string
    precinctId?: string
    photoUrl?: string
    barangay?: string
}

interface IDCardProps {
    resident: Resident
    /** Optional layoutId for shared-element transition with inspection modal */
    layoutId?: string
    onClick?: () => void
}

export function IDCard({ resident, layoutId, onClick }: IDCardProps) {
    const [flipped, setFlipped] = useState(false)

    const handleFlip = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFlipped((prev) => !prev)
    }

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Card container — 1.6:1 aspect ratio */}
            <motion.div
                layoutId={layoutId}
                className="relative w-full cursor-pointer"
                style={{ aspectRatio: "1.6 / 1", perspective: 1000 }}
                onClick={onClick}
            >
                <motion.div
                    className="relative h-full w-full"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front */}
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                        <IDCardView resident={resident} side="front" />
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        <IDCardView resident={resident} side="back" />
                    </div>
                </motion.div>
            </motion.div>

            {/* Flip trigger — 48dp min touch target */}
            <button
                onClick={handleFlip}
                className="flex h-12 items-center gap-2 rounded-full border border-border bg-muted/50 px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={flipped ? "Show front of ID card" : "Show back of ID card"}
            >
                {flipped ? "← Show Front" : "Show Back →"}
            </button>
        </div>
    )
}
