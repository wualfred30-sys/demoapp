"use client"

import Image from "next/image"
import { BarangayQR } from "./barangay-qr"

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

interface IDCardViewProps {
    resident: Resident
    side: "front" | "back"
}

export function IDCardView({ resident, side }: IDCardViewProps) {
    if (side === "back") {
        return (
            <div
                className="relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-[#111827] p-5"
                style={{ backfaceVisibility: "hidden" }}
            >
                {/* Header strip */}
                <div className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-[#00FFCC]" />

                {/* QR Code */}
                <div className="rounded-xl bg-white p-3">
                    <BarangayQR resident={resident} size={110} />
                </div>

                {/* Label */}
                <p className="text-center text-xs font-medium text-[#9CA3AF]">
                    Scan to verify resident
                </p>

                <div className="rounded-xl border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#6B7280]">Resident Code</p>
                    <p className="mt-1 text-sm font-semibold text-white">{resident.id.slice(0, 8).toUpperCase()}</p>
                </div>

                {/* Barangay seal placeholder */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full border border-[#374151] bg-[#1F2937] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-[#00FFCC]">BL</span>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                        {resident.barangay ?? "Barangay Linkod"}
                    </span>
                </div>
            </div>
        )
    }

    // Front side
    return (
        <div
            className="relative flex h-full w-full flex-col justify-between rounded-2xl bg-[#111827] p-5 overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-[#00FFCC]" />

            {/* Header */}
            <div className="mt-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00FFCC]">
                    {resident.barangay ?? "Barangay Linkod"}
                </p>
                <p className="text-[11px] text-[#6B7280]">Resident Identification Card</p>
            </div>

            {/* Middle — photo + identity */}
            <div className="flex items-center gap-4">
                {/* Photo */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-[#00FFCC]/40 bg-[#1F2937]">
                    {resident.photoUrl ? (
                        <Image
                            src={resident.photoUrl}
                            alt={resident.fullName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="text-2xl font-bold text-[#374151]">
                                {resident.fullName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white leading-tight">
                        {resident.fullName}
                    </p>
                    <p className="truncate text-[11px] text-[#9CA3AF] leading-snug mt-0.5">
                        {resident.address || "-"}
                    </p>
                    {resident.mobileNumber && (
                        <p className="truncate text-[10px] font-medium text-[#D1D5DB] mt-1">
                            {resident.mobileNumber}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Precinct ID</p>
                    <p className="text-sm font-bold text-[#00FFCC]">
                        {resident.precinctId ?? "-"}
                    </p>
                </div>
                <div className="min-w-0 text-right">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Resident Code</p>
                    <p className="truncate text-[10px] text-[#374151] font-mono">{resident.id.slice(0, 8).toUpperCase()}</p>
                </div>
            </div>
        </div>
    )
}
