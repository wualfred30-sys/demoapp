// Canvas-based QR ID generator that works in v0's environment
// This replaces the Konva-based generator which has React reconciler issues

export interface QRTIDData {
  qrtCode: string
  verificationCode: string
  fullName: string
  birthDate: string
  address: string
  gender: string
  civilStatus: string
  birthPlace: string
  photoUrl: string
  issuedDate: string
  expiryDate: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  emergencyContactAddress: string
  qrCodeData: string
  precinctNumber?: string
}

export interface GenerateQRTIDResult {
  success: boolean
  frontImageUrl?: string
  backImageUrl?: string
  error?: string
}

// Helper to load image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Helper to draw rounded rect
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export async function generateQRTIDImages(data: QRTIDData): Promise<GenerateQRTIDResult> {
  console.log("[v0] Canvas Generator: Starting ID generation...")

  try {
    // Generate front image
    const frontCanvas = document.createElement("canvas")
    frontCanvas.width = 856
    frontCanvas.height = 540
    const frontCtx = frontCanvas.getContext("2d")!

    // Parse Address for dynamic branding
    const safeAddress = data.address || "Barangay Mawaque, Mabalacat City, Pampanga"
    const safeAddressLower = safeAddress.toLowerCase()

    const isTaytay = safeAddressLower.includes("taytay") && safeAddressLower.includes("rizal")

    let isTaytaySpecific = false
    let brgyName = "MAWAQUE"
    let TopH1 = "REPUBLIKA NG PILIPINAS"
    let TopH2 = "MABALACAT CITY, PAMPANGA"
    let TopH3 = "BARANGAY MAWAQUE"

    let cityLogoPath = "/images/logo.png"
    let brgyLogoPath = "/images/bagongpilipinas-logo-main.png"
    let primaryColor = "#10b981" // Emerald
    let secondaryColor = "#059669"

    if (isTaytay) {
      isTaytaySpecific = true
      TopH1 = "REPUBLIKA NG PILIPINAS"
      TopH2 = "PROVINCE OF RIZAL, MUNICIPALITY OF TAYTAY"
      cityLogoPath = "/images/seals/City_of_taytay.svg"
      primaryColor = "#1e3a8a" // Deep blue for Taytay
      secondaryColor = "#1e40af"

      if (safeAddressLower.includes("sta. ana")) { brgyName = "STA. ANA"; brgyLogoPath = "/images/seals/Sta_Ana.svg" }
      else if (safeAddressLower.includes("muzon")) { brgyName = "MUZON"; brgyLogoPath = "/images/seals/Muzon.svg" }
      else if (safeAddressLower.includes("san juan")) { brgyName = "SAN JUAN"; brgyLogoPath = "/images/seals/San_Juan.svg" }
      else if (safeAddressLower.includes("san isidro")) { brgyName = "SAN ISIDRO"; brgyLogoPath = "/images/seals/San_Isidro.svg" }
      else if (safeAddressLower.includes("dolores")) { brgyName = "DOLORES"; brgyLogoPath = "/images/seals/Dolores.svg" }
      else { brgyName = "TAYTAY"; brgyLogoPath = "/images/seals/City_of_taytay.svg" }

      TopH3 = "BARANGAY " + brgyName
    } else {
      // Generic logic based on commas (Street, Barangay, City, Province)
      const parts = safeAddress.split(',').map(p => p.trim())
      if (parts.length >= 4) {
        brgyName = parts[1].toUpperCase()
        TopH2 = `${parts[2]}, ${parts[3]}`.toUpperCase()
        TopH3 = `BARANGAY ${brgyName}`
      }
      primaryColor = "#0f172a" // Slate for generic
      secondaryColor = "#1e293b"
    }

    // Background gradient - abstract modern background
    const bgGradient = frontCtx.createLinearGradient(0, 0, 856, 540)
    bgGradient.addColorStop(0, "#f8fafc")
    bgGradient.addColorStop(0.5, "#ffffff")
    bgGradient.addColorStop(1, "#f1f5f9")
    frontCtx.fillStyle = bgGradient
    frontCtx.fillRect(0, 0, 856, 540)

    // Add subtle background waves/patterns for premium feel
    frontCtx.beginPath()
    frontCtx.moveTo(0, 540)
    frontCtx.quadraticCurveTo(428, 400, 856, 480)
    frontCtx.lineTo(856, 540)
    frontCtx.lineTo(0, 540)
    frontCtx.fillStyle = `${primaryColor}10` // 10% opacity
    frontCtx.fill()

    // Header bar (Premium thicker header for official feel)
    const headerGradient = frontCtx.createLinearGradient(0, 0, 856, 0)
    headerGradient.addColorStop(0, primaryColor)
    headerGradient.addColorStop(0.5, secondaryColor)
    headerGradient.addColorStop(1, primaryColor)
    frontCtx.fillStyle = headerGradient
    frontCtx.shadowColor = "rgba(0,0,0,0.2)"
    frontCtx.shadowBlur = 10
    frontCtx.shadowOffsetY = 4
    frontCtx.fillRect(0, 0, 856, 85)
    frontCtx.shadowColor = "transparent" // reset shadow

    // Central Header Text
    frontCtx.fillStyle = "#ffffff"
    frontCtx.textAlign = "center"
    frontCtx.font = "bold 13px 'Trebuchet MS', Arial, sans-serif"
    frontCtx.fillText(TopH1, 428, 26)
    frontCtx.font = "bold 16px 'Trebuchet MS', Arial, sans-serif"
    frontCtx.fillText(TopH2, 428, 48)
    frontCtx.font = "black 24px 'Trebuchet MS', Arial, sans-serif"
    frontCtx.fillStyle = "#fbbf24" // Gold for Barangay Name
    frontCtx.fillText(TopH3, 428, 72)
    frontCtx.textAlign = "left" // reset

    // Draw City Logo (TOP LEFT)
    try {
      const cityLogo = await loadImage(cityLogoPath)
      frontCtx.drawImage(cityLogo, 30, 10, 65, 65)
    } catch (e) {
      console.log("[v0] Could not load city logo:", cityLogoPath)
    }

    // Draw Barangay Logo (TOP RIGHT)
    try {
      const brgyLogo = await loadImage(brgyLogoPath)
      frontCtx.drawImage(brgyLogo, 856 - 65 - 30, 10, 65, 65)
    } catch (e) {
      console.log("[v0] Could not load barangay logo:", brgyLogoPath)
    }

    // "QR ID" title badge on the left side below photo, so we just label it somewhere else
    // Photo placeholder/frame with premium rounded design
    frontCtx.strokeStyle = primaryColor
    frontCtx.lineWidth = 4
    roundRect(frontCtx, 38, 110, 192, 234, 12)
    frontCtx.stroke()
    frontCtx.fillStyle = "#f3f4f6"
    roundRect(frontCtx, 40, 112, 188, 230, 10)
    frontCtx.fill()

    // Try to load and draw photo
    try {
      if (data.photoUrl && data.photoUrl.startsWith("data:")) {
        const photo = await loadImage(data.photoUrl)
        // clip to rounded rect
        frontCtx.save()
        roundRect(frontCtx, 40, 112, 188, 230, 10)
        frontCtx.clip()
        frontCtx.drawImage(photo, 40, 112, 188, 230)
        frontCtx.restore()
      }
    } catch (e) {
      console.log("[v0] Could not load photo, using placeholder")
      frontCtx.fillStyle = "#9ca3af"
      frontCtx.font = "16px Arial"
      frontCtx.textAlign = "center"
      frontCtx.fillText("Photo Not Available", 134, 227)
      frontCtx.textAlign = "left"
    }

    // QR ID Title
    frontCtx.fillStyle = primaryColor
    frontCtx.font = "900 32px 'Trebuchet MS', Arial"
    frontCtx.textAlign = "center"
    frontCtx.fillText("OFFICIAL QR ID", 134, 385)
    frontCtx.textAlign = "left"

    // Verification code box
    frontCtx.fillStyle = secondaryColor
    roundRect(frontCtx, 38, 405, 192, 45, 8)
    frontCtx.fill()

    frontCtx.fillStyle = "#ffffff"
    frontCtx.font = "bold 13px Arial"
    frontCtx.textAlign = "center"
    frontCtx.fillText("ID NUMBER", 134, 423)
    frontCtx.font = "bold 18px Arial"
    frontCtx.fillText(data.qrtCode, 134, 442) // Displaying QRT ID as ID NUMBER
    frontCtx.textAlign = "left"

    // Safe fallbacks for missing data
    const safeFullName = data.fullName || "—"
    const safeBirthDate = data.birthDate || "—"
    const safeGender = data.gender || "—"
    const safeCivilStatus = data.civilStatus || "—"
    const safeBirthPlace = data.birthPlace || "—"

    // Personal info section
    let currentY = 145
    const drawFieldCombo = (label1: string, val1: string, label2: string, val2: string, yPos: number, x2: number) => {
      frontCtx.fillStyle = "#64748b"
      frontCtx.font = "bold 14px Arial"
      frontCtx.fillText(label1, 260, yPos)
      frontCtx.fillText(label2, x2, yPos)

      frontCtx.fillStyle = "#0f172a"
      frontCtx.font = "bold 22px Arial"
      frontCtx.fillText(val1, 260, yPos + 24)
      frontCtx.fillText(val2, x2, yPos + 24)
    }

    frontCtx.fillStyle = "#64748b"
    frontCtx.font = "bold 14px Arial"
    frontCtx.fillText("FULL NAME (Last, First, M.I.)", 260, 130)
    frontCtx.fillStyle = "#0f172a"
    frontCtx.font = "black 36px 'Trebuchet MS', Arial"
    frontCtx.fillText(safeFullName.toUpperCase(), 260, 168)

    drawFieldCombo("DATE OF BIRTH", safeBirthDate, "GENDER", safeGender, 220, 520)
    drawFieldCombo("CIVIL STATUS", safeCivilStatus, "BLOOD TYPE", "—", 280, 520)

    frontCtx.fillStyle = "#64748b"
    frontCtx.font = "bold 14px Arial"
    frontCtx.fillText("COMPLETE ADDRESS", 260, 340)
    frontCtx.fillStyle = "#0f172a"
    frontCtx.font = "bold 20px Arial"

    // Word wrap address
    const words = safeAddress.toUpperCase().split(" ")
    let line = ""
    let addressY = 368
    for (const word of words) {
      const testLine = line + word + " "
      if (frontCtx.measureText(testLine).width > 560) {
        frontCtx.fillText(line, 260, addressY)
        line = word + " "
        addressY += 28
      } else {
        line = testLine
      }
    }
    frontCtx.fillText(line, 260, addressY)

    // Watermark
    frontCtx.save()
    frontCtx.globalAlpha = 0.04
    frontCtx.font = "bold 140px Arial"
    frontCtx.translate(428, 300)
    frontCtx.rotate(-0.25)
    frontCtx.fillStyle = "#000000"
    frontCtx.textAlign = "center"
    frontCtx.fillText("BARANGAY ID", 0, 0)
    frontCtx.restore()

    // Footer bar
    const footerGradient = frontCtx.createLinearGradient(0, 485, 856, 540)
    footerGradient.addColorStop(0, primaryColor)
    footerGradient.addColorStop(1, secondaryColor)
    frontCtx.fillStyle = footerGradient
    frontCtx.fillRect(0, 485, 856, 55)

    frontCtx.fillStyle = "#ffffff"
    frontCtx.font = "bold 15px Arial"
    frontCtx.fillText(`Issued: ${data.issuedDate}`, 38, 518)
    frontCtx.font = "13px Arial"
    frontCtx.fillStyle = "rgba(255,255,255,0.8)"
    frontCtx.fillText(`Valid until: ${data.expiryDate}`, 210, 518)

    frontCtx.textAlign = "right"
    frontCtx.font = "bold 13px Arial"
    frontCtx.fillStyle = "#ffffff"
    if (isTaytaySpecific) {
      frontCtx.fillText(`Property of ${TopH3}, ${TopH1}`, 818, 510)
    } else {
      frontCtx.fillText(`Property of ${TopH3}`, 818, 510)
    }
    frontCtx.fillStyle = "rgba(255,255,255,0.8)"
    frontCtx.font = "italic 12px Arial"
    frontCtx.fillText("Return to authorities if found.", 818, 528)
    frontCtx.textAlign = "left"


    // ----------------------------------------------------
    // Generate BACK image
    // ----------------------------------------------------
    const backCanvas = document.createElement("canvas")
    backCanvas.width = 856
    backCanvas.height = 540
    const backCtx = backCanvas.getContext("2d")!

    // Background
    const backBgGradient = backCtx.createLinearGradient(0, 0, 856, 540)
    backBgGradient.addColorStop(0, "#f8fafc")
    backBgGradient.addColorStop(1, "#f1f5f9")
    backCtx.fillStyle = backBgGradient
    backCtx.fillRect(0, 0, 856, 540)

    // Header
    backCtx.fillStyle = "#dc2626" // Red for emergency
    backCtx.fillRect(0, 0, 856, 55)

    backCtx.fillStyle = "#ffffff"
    backCtx.font = "bold 26px 'Trebuchet MS', Arial"
    backCtx.textAlign = "center"
    backCtx.fillText("EMERGENCY CONTACT INFORMATION", 428, 38)
    backCtx.textAlign = "left"

    const safeEmergencyContactName = data.emergencyContactName || "—"
    const safeEmergencyContactRelationship = data.emergencyContactRelationship || "—"
    const safeEmergencyContactPhone = data.emergencyContactPhone || "—"
    const safeEmergencyContactAddress = data.emergencyContactAddress || "—"

    // Emergency contact details
    backCtx.fillStyle = "#64748b"
    backCtx.font = "bold 15px Arial"
    backCtx.fillText("CONTACT PERSON", 50, 105)
    backCtx.fillStyle = "#0f172a"
    backCtx.font = "black 32px 'Trebuchet MS', Arial"
    backCtx.fillText(safeEmergencyContactName.toUpperCase(), 50, 142)

    backCtx.fillStyle = "#64748b"
    backCtx.font = "bold 15px Arial"
    backCtx.fillText("RELATIONSHIP", 50, 185)
    backCtx.fillStyle = "#0f172a"
    backCtx.font = "bold 24px Arial"
    backCtx.fillText(safeEmergencyContactRelationship.toUpperCase(), 50, 212)

    backCtx.fillStyle = "#64748b"
    backCtx.font = "bold 15px Arial"
    backCtx.fillText("CONTACT NUMBER", 50, 255)
    backCtx.fillStyle = "#dc2626"
    backCtx.font = "bold 34px Arial"
    backCtx.fillText(safeEmergencyContactPhone, 50, 292)

    backCtx.fillStyle = "#64748b"
    backCtx.font = "bold 15px Arial"
    backCtx.fillText("ADDRESS", 50, 335)
    backCtx.fillStyle = "#0f172a"
    backCtx.font = "bold 20px Arial"

    // address wrap for emergency
    const emWords = safeEmergencyContactAddress.toUpperCase().split(" ")
    let emLine = ""
    let emAddressY = 365
    for (const word of emWords) {
      const testLine = emLine + word + " "
      if (backCtx.measureText(testLine).width > 450) {
        backCtx.fillText(emLine, 50, emAddressY)
        emLine = word + " "
        emAddressY += 26
      } else {
        emLine = testLine
      }
    }
    backCtx.fillText(emLine, 50, emAddressY)

    // Verification QR Code section
    backCtx.fillStyle = "#ffffff"
    roundRect(backCtx, 550, 90, 250, 250, 16)
    backCtx.shadowColor = "rgba(0,0,0,0.1)"
    backCtx.shadowBlur = 15
    backCtx.shadowOffsetY = 5
    backCtx.fill()
    backCtx.shadowColor = "transparent"

    // Try to draw QR code if available
    if (data.qrCodeData) {
      try {
        const qrImg = await loadImage(data.qrCodeData)
        backCtx.drawImage(qrImg, 565, 105, 220, 220)
      } catch (e) {
        backCtx.fillStyle = "#9ca3af"
        backCtx.font = "16px Arial"
        backCtx.textAlign = "center"
        backCtx.fillText("QR Code Not Available", 675, 215)
        backCtx.textAlign = "left"
      }
    }

    backCtx.fillStyle = primaryColor
    backCtx.font = "bold 15px Arial"
    backCtx.textAlign = "center"
    backCtx.fillText("SCAN TO VERIFY", 675, 365)
    backCtx.fillStyle = "#64748b"
    backCtx.font = "14px Arial"
    backCtx.fillText(data.verificationCode, 675, 385)
    backCtx.textAlign = "left"

    // Terms and Conditions footer
    backCtx.fillStyle = "#f1f5f9"
    backCtx.fillRect(0, 420, 856, 120)
    backCtx.fillStyle = "#e2e8f0"
    backCtx.fillRect(0, 420, 856, 2)

    backCtx.fillStyle = "#475569"
    backCtx.font = "bold 15px Arial"
    backCtx.fillText("TERMS & CONDITIONS:", 50, 450)

    backCtx.fillStyle = "#64748b"
    backCtx.font = "13px Arial"
    backCtx.fillText("1. This identification card is officially issued by the local barangay government.", 50, 470)
    backCtx.fillText("2. It is non-transferable and must be presented upon request by persons in authority.", 50, 488)
    backCtx.fillText("3. In case of loss or destruction, notify the Barangay Hall immediately for replacement.", 50, 506)
    backCtx.fillText("4. Unauthorized creation, alteration, or duplication is strictly forbidden by law.", 50, 524)

    backCtx.fillStyle = primaryColor
    backCtx.font = "bold 14px Arial"
    backCtx.textAlign = "right"
    backCtx.fillText(`ID NO: ${data.qrtCode}`, 806, 450)

    // Set smoothing to false for crisp text
    frontCtx.imageSmoothingEnabled = false
    backCtx.imageSmoothingEnabled = false

    // Export to data URLs
    const frontImageUrl = frontCanvas.toDataURL("image/png")
    const backImageUrl = backCanvas.toDataURL("image/png")

    console.log("[v0] Canvas Generator: SUCCESS - Both images generated")

    return {
      success: true,
      frontImageUrl,
      backImageUrl,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("[v0] Canvas Generator: EXCEPTION:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Downloads an image data URL as a file
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
