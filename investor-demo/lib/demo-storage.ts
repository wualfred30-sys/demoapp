export interface InvestorDemoProfile {
  id: string
  fullName: string
  barangay: string
  streetAddress: string
  city: string
  province: string
  mobileNumber: string
  email: string
  occupation: string
  photoDataUrl: string
  createdAt: string
}

const STORAGE_KEY = "investor_demo_profile"

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `demo_${Date.now()}`
}

export function createEmptyProfile(): InvestorDemoProfile {
  return {
    id: generateId(),
    fullName: "",
    barangay: "",
    streetAddress: "",
    city: "Mabalacat City",
    province: "Pampanga",
    mobileNumber: "",
    email: "",
    occupation: "",
    photoDataUrl: "",
    createdAt: new Date().toISOString(),
  }
}

export function loadInvestorProfile(): InvestorDemoProfile | null {
  if (typeof window === "undefined") {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<InvestorDemoProfile>
    return {
      ...createEmptyProfile(),
      ...parsed,
      id: parsed.id || generateId(),
      createdAt: parsed.createdAt || new Date().toISOString(),
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveInvestorProfile(profile: InvestorDemoProfile) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearInvestorProfile() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export function formatAddress(profile: InvestorDemoProfile) {
  return [profile.streetAddress, profile.barangay, profile.city, profile.province]
    .filter(Boolean)
    .join(", ")
}

export function getResidentCode(profile: InvestorDemoProfile) {
  return profile.id.replace(/-/g, "").slice(0, 8).toUpperCase()
}
