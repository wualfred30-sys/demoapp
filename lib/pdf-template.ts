/**
 * pdf-template.ts
 * Generates an A4 jsPDF document containing 2 ID cards (front+back) with crop marks.
 */

import jsPDF from "jspdf"
import {
    ID_CARD_MM,
    centerOnA4,
    drawCropMarks,
} from "./pdf-utils"

interface Resident {
    id: string
    fullName: string
    address: string
    precinctId?: string
    barangay?: string
}

/**
 * generateIDPdf
 *
 * Lays out 2 ID card placeholders on a single A4 page (portrait).
 * Pass `frontImageDataUrl` and `backImageDataUrl` from canvas capture
 * of the IDCardView components.
 */
export async function generateIDPdf(
    resident: Resident,
    frontImageDataUrl: string,
    backImageDataUrl: string
): Promise<jsPDF> {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    })

    const { width: cardW, height: cardH } = ID_CARD_MM

    // --- Front card: vertically centred in top half ---
    const frontX = centerOnA4(cardW)
    const frontY = 40 // 40mm from top

    doc.addImage(frontImageDataUrl, "PNG", frontX, frontY, cardW, cardH)
    drawCropMarks(doc, frontX, frontY, cardW, cardH)

    // --- Back card: in bottom half ---
    const backX = centerOnA4(cardW)
    const backY = frontY + cardH + 30 // 30mm gap

    doc.addImage(backImageDataUrl, "PNG", backX, backY, cardW, cardH)
    drawCropMarks(doc, backX, backY, cardW, cardH)

    // --- Footer label ---
    doc.setFontSize(8)
    doc.setTextColor(160)
    doc.text(
        `${resident.barangay ?? "Barangay Linkod"}  ·  ${resident.fullName}  ·  ID: ${resident.id.slice(0, 8).toUpperCase()}`,
        105,
        280,
        { align: "center" }
    )

    return doc
}
