"use client"

import { QRCodeSVG } from "qrcode.react"

interface Resident {
    id: string
    fullName: string
    address: string
    precinctId?: string
    barangay?: string
    mobileNumber?: string
}

interface BarangayQRProps {
    resident: Resident
    size?: number
}

export function BarangayQR({ resident, size = 120 }: BarangayQRProps) {
    const payload = JSON.stringify({
        id: resident.id,
        name: resident.fullName,
        address: resident.address,
        barangay: resident.barangay ?? "-",
        mobileNumber: resident.mobileNumber ?? "-",
        precinct: resident.precinctId ?? "-",
    })

    return (
        <QRCodeSVG
            value={payload}
            size={size}
            bgColor="#ffffff"
            fgColor="#111827"
            level="M"
            includeMargin={false}
        />
    )
}
