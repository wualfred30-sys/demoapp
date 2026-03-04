/**
 * pdf-utils.ts
 * Low-level PDF helpers: DPI scaling, crop marks, page math.
 */

/** Standard ID card dimensions in mm (CR80) */
export const ID_CARD_MM = { width: 85.6, height: 54 } as const

/** Target print DPI */
export const PRINT_DPI = 300

/** mm → pixels at target DPI */
export function mmToPx(mm: number, dpi = PRINT_DPI): number {
    return Math.round((mm / 25.4) * dpi)
}

/** px → mm (72 dpi jsPDF unit system) */
export function pxToMm(px: number): number {
    return (px / 72) * 25.4
}

/** Center an element horizontally on an A4 page (210mm wide) */
export function centerOnA4(elementWidthMm: number): number {
    return (210 - elementWidthMm) / 2
}

/**
 * Draw crop marks around a rect on a jsPDF doc.
 * Marks are 5mm long, placed 3mm outside the rect.
 */
export function drawCropMarks(
    doc: import("jspdf").jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
    markLen = 5,
    gap = 3
): void {
    const origColor = doc.getDrawColor()
    doc.setDrawColor(180)
    doc.setLineWidth(0.1)

    // Top-left
    doc.line(x - gap - markLen, y, x - gap, y)
    doc.line(x, y - gap - markLen, x, y - gap)
    // Top-right
    doc.line(x + w + gap, y, x + w + gap + markLen, y)
    doc.line(x + w, y - gap - markLen, x + w, y - gap)
    // Bottom-left
    doc.line(x - gap - markLen, y + h, x - gap, y + h)
    doc.line(x, y + h + gap, x, y + h + gap + markLen)
    // Bottom-right
    doc.line(x + w + gap, y + h, x + w + gap + markLen, y + h)
    doc.line(x + w, y + h + gap, x + w, y + h + gap + markLen)

    doc.setDrawColor(origColor)
}
