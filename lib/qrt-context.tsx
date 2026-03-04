"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, memo, type ReactNode } from "react"

export interface QRTIDRequest {
  id: string
  qrtCode: string
  verificationCode: string
  userId: string
  fullName: string
  email: string
  phoneNumber: string
  birthDate: string
  age: number
  gender: string
  civilStatus: string
  birthPlace: string
  address: string
  height: string
  weight: string
  yearsResident: number
  citizenship: string
  emergencyContactName: string
  emergencyContactAddress: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  photoUrl: string
  idFrontImageUrl?: string
  idBackImageUrl?: string
  qrCodeData: string
  status: "pending" | "processing" | "ready" | "issued"
  issuedDate?: string
  expiryDate?: string
  createdAt: string
  updatedAt?: string
  paymentReference: string
  paymentTransactionId?: string
  requestType: "regular" | "rush"
  amount: number
}

export interface QRTVerificationLog {
  qrtCode: string
  verificationCode: string
  verifiedBy: string
  timestamp: string
  action: "qrt_verification"
}

interface QRTContextType {
  qrtIds: QRTIDRequest[]
  currentRequest: Partial<QRTIDRequest> | null
  isLoaded: boolean
  verificationLogs: QRTVerificationLog[]
  setCurrentRequest: (request: Partial<QRTIDRequest> | null) => void
  setCurrentRequestImmediate: (request: Partial<QRTIDRequest> | null) => void
  addQRTRequest: (request: QRTIDRequest) => Promise<QRTIDRequest | null>
  updateQRTStatus: (id: string, status: string, imageData?: { frontUrl: string; backUrl: string }) => Promise<void>
  getQRTByCode: (code: string) => QRTIDRequest | undefined
  findQRTByVerificationCode: (code: string) => Promise<QRTIDRequest | null>
  getUserQRTIds: (userId: string) => QRTIDRequest[]
  getQRTById: (id: string) => QRTIDRequest | undefined
  logVerification: (qrtCode: string, verificationCode: string, verifiedBy: string) => Promise<void>
  getVerificationLogs: () => QRTVerificationLog[]
  getQRTVerificationHistory: (qrtCode: string) => QRTVerificationLog[]
  refreshQRTIds: () => Promise<void>
}

const QRTContext = createContext<QRTContextType | undefined>(undefined)

const CURRENT_REQUEST_KEY = "barangay_qrt_current_request"

// Utility function to generate unique verification code
function generateVerificationCode(existingCodes: string[]): string {
  const year = new Date().getFullYear()
  let code: string
  let attempts = 0
  const maxAttempts = 100

  do {
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
    code = `VRF-${year}-${randomNum}`
    attempts++
  } while (existingCodes.includes(code) && attempts < maxAttempts)

  return code
}

export const QRTProvider = memo(({ children }: { children: ReactNode }) => {
  const [qrtIds, setQrtIds] = useState<QRTIDRequest[]>([])
  const [currentRequest, setCurrentRequest] = useState<Partial<QRTIDRequest> | null>(null)
  const [verificationLogs, setVerificationLogs] = useState<QRTVerificationLog[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load current request from localStorage FIRST (synchronous)
    try {
      const storedCurrent = localStorage.getItem(CURRENT_REQUEST_KEY)
      if (storedCurrent) {
        const parsedCurrent = JSON.parse(storedCurrent)
        setCurrentRequest(parsedCurrent)
      }
    } catch (e) {
      console.error("[QRT Context] Failed to load from localStorage:", e)
    }

    // Set mock local data instead of Supabase
    setIsLoaded(true)
  }, [])

  const refreshQRTIds = useCallback(async () => {
    // No-op without Supabase
  }, [])

  const addQRTRequest = useCallback(async (request: QRTIDRequest): Promise<QRTIDRequest | null> => {
    try {
      setQrtIds((prev) => [request, ...prev])
      return request
    } catch (error) {
      console.error("[v0] Failed to add QRT request locally:", error)
      return request
    }
  }, [])

  const updateQRTStatus = useCallback(
    async (id: string, status: string, imageData?: { frontUrl: string; backUrl: string }) => {
      try {
        // Update local state
        setQrtIds((prev) =>
          prev.map((qrt) => {
            if (qrt.id === id) {
              return {
                ...qrt,
                status: status as QRTIDRequest["status"],
                updatedAt: new Date().toISOString(),
                ...(imageData && {
                  idFrontImageUrl: imageData.frontUrl,
                  idBackImageUrl: imageData.backUrl,
                }),
              }
            }
            return qrt
          }),
        )
      } catch (error) {
        console.error("Failed to update QRT status locally:", error)
      }
    },
    [],
  )

  const getQRTByCode = useCallback(
    (code: string) => {
      return qrtIds.find((qrt) => qrt.qrtCode === code)
    },
    [qrtIds],
  )

  const getUserQRTIds = useCallback(
    (userId: string) => {
      return qrtIds.filter((qrt) => qrt.userId === userId)
    },
    [qrtIds],
  )

  const getQRTById = useCallback(
    (id: string) => {
      return qrtIds.find((qrt) => qrt.id === id)
    },
    [qrtIds],
  )

  const findQRTByVerificationCode = useCallback(
    async (code: string): Promise<QRTIDRequest | null> => {
      // Return from local state
      const localMatch = qrtIds.find((qrt) => qrt.verificationCode === code)
      return localMatch || null
    },
    [qrtIds],
  )

  const logVerification = useCallback(async (qrtCode: string, verificationCode: string, verifiedBy: string) => {
    const newLog: QRTVerificationLog = {
      qrtCode,
      verificationCode,
      verifiedBy,
      timestamp: new Date().toISOString(),
      action: "qrt_verification",
    }
    // Update local state immediately
    setVerificationLogs((prev) => [newLog, ...prev])
  }, [])

  const getVerificationLogs = useCallback(() => {
    return verificationLogs
  }, [verificationLogs])

  const getQRTVerificationHistory = useCallback(
    (qrtCode: string) => {
      return verificationLogs.filter((log) => log.qrtCode === qrtCode)
    },
    [verificationLogs],
  )

  const setCurrentRequestCallback = useCallback((request: Partial<QRTIDRequest> | null) => {
    setCurrentRequest(request)
  }, [])

  const setCurrentRequestImmediate = useCallback((request: Partial<QRTIDRequest> | null) => {
    setCurrentRequest(request)
    try {
      if (request) {
        localStorage.setItem(CURRENT_REQUEST_KEY, JSON.stringify(request))
      } else {
        localStorage.removeItem(CURRENT_REQUEST_KEY)
      }
    } catch (error) {
      console.error("Failed to save current request:", error)
    }
  }, [])

  const value = useMemo(
    () => ({
      qrtIds,
      currentRequest,
      isLoaded,
      verificationLogs,
      setCurrentRequest: setCurrentRequestCallback,
      setCurrentRequestImmediate,
      addQRTRequest,
      updateQRTStatus,
      getQRTByCode,
      findQRTByVerificationCode,
      getUserQRTIds,
      getQRTById,
      logVerification,
      getVerificationLogs,
      getQRTVerificationHistory,
      refreshQRTIds,
    }),
    [
      qrtIds,
      currentRequest,
      isLoaded,
      verificationLogs,
      setCurrentRequestCallback,
      addQRTRequest,
      updateQRTStatus,
      getQRTByCode,
      findQRTByVerificationCode,
      getUserQRTIds,
      getQRTById,
      logVerification,
      getVerificationLogs,
      getQRTVerificationHistory,
      setCurrentRequestImmediate,
      refreshQRTIds,
    ],
  )

  return <QRTContext.Provider value={value}>{children}</QRTContext.Provider>
})

QRTProvider.displayName = "QRTProvider"

export function useQRT() {
  const context = useContext(QRTContext)
  if (context === undefined) {
    throw new Error("useQRT must be used within a QRTProvider")
  }
  return context
}

// Export utility function for use in components
export { generateVerificationCode }
