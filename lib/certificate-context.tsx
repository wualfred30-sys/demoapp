"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, memo, useCallback, useMemo } from "react"
import { usePayment } from "./payment-context"

export interface CertificateRequest {
  id: string
  userId?: string
  certificateType: string
  purpose: string
  customPurpose?: string
  requestType: "regular" | "rush"
  amount: number
  paymentReference: string
  paymentTransactionId?: string
  serialNumber: string
  status: "processing" | "ready"
  createdAt: string
  readyAt?: string
  purok: string
  yearsOfResidency?: number
  residencySince?: string
  residentName?: string
  sex?: string
  sexOrientation?: string
  civilStatus?: string
  birthplace?: string
  occupation?: string
  monthlyIncome?: number
  validIdType?: string
  validIdNumber?: string
  staffSignature?: string
  signedBy?: string
  signedByRole?: string
  signedAt?: string
}

interface CertificateContextType {
  certificates: CertificateRequest[]
  currentRequest: Partial<CertificateRequest> | null
  setCurrentRequest: (request: Partial<CertificateRequest> | null) => void
  addCertificate: (cert: CertificateRequest) => Promise<void>
  updateCertificateStatus: (
    id: string,
    status: "processing" | "ready",
    signatureData?: {
      signature: string
      signedBy: string
      signedByRole: string
    },
  ) => Promise<void>
  getCertificate: (id: string) => CertificateRequest | undefined
  getVerificationUrl: (serialNumber: string) => string
  getCertificatesByPaymentStatus: (status: "pending" | "success" | "failed") => CertificateRequest[]
  getCertificatesByUserId: (userId: string) => CertificateRequest[]
  refreshCertificates: () => Promise<void>
  isLoaded: boolean
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined)

export const CertificateProvider = memo(({ children }: { children: ReactNode }) => {
  const [certificates, setCertificates] = useState<CertificateRequest[]>([])
  const [currentRequest, setCurrentRequest] = useState<Partial<CertificateRequest> | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { payments } = usePayment()

  useEffect(() => {
    const loadCertificates = async () => {
      // Supabase mock removed, load from local state only
      setCertificates([])
      setIsLoaded(true)
    }
    loadCertificates()
  }, [])

  const addCertificate = useCallback(async (cert: CertificateRequest) => {
    try {
      const newCert = {
        ...cert,
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      }
      setCertificates(prev => [newCert, ...prev])
    } catch (error) {
      console.error("[Certificates] Failed to add certificate:", error)
      throw error
    }
  }, [])

  const updateCertificateStatus = useCallback(async (
    id: string,
    status: "processing" | "ready",
    signatureData?: {
      signature: string
      signedBy: string
      signedByRole: string
    },
  ) => {
    try {
      setCertificates(prev => prev.map((cert) =>
        cert.id === id
          ? {
            ...cert,
            status,
            readyAt: status === "ready" ? new Date().toISOString() : undefined,
            ...(signatureData && {
              staffSignature: signatureData.signature,
              signedBy: signatureData.signedBy,
              signedByRole: signatureData.signedByRole,
              signedAt: new Date().toISOString(),
            }),
          }
          : cert,
      ))
    } catch (error) {
      console.error("[Certificates] Failed to update certificate status:", error)
      throw error
    }
  }, [])

  const getCertificate = useCallback((id: string) => {
    return certificates.find((cert) => cert.id === id)
  }, [certificates])

  const getVerificationUrl = useCallback((serialNumber: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://mawaque.gov.ph"
    return `${baseUrl}/verify/${serialNumber}`
  }, [])

  const getCertificatesByPaymentStatus = useCallback((status: "pending" | "success" | "failed") => {
    return certificates.filter((cert) => {
      if (!cert.paymentTransactionId) return false
      const payment = payments.find((p) => p.id === cert.paymentTransactionId)
      return payment?.status === status
    })
  }, [certificates, payments])

  const getCertificatesByUserId = useCallback((userId: string) => {
    return certificates.filter((cert) => cert.userId === userId)
  }, [certificates])

  const refreshCertificates = useCallback(async () => {
    // Supabase removed
  }, [])

  const setCurrentRequestCallback = useCallback((request: Partial<CertificateRequest> | null) => {
    setCurrentRequest(request)
  }, [])

  const value = useMemo(() => ({
    certificates,
    currentRequest,
    setCurrentRequest: setCurrentRequestCallback,
    addCertificate,
    updateCertificateStatus,
    getCertificate,
    getVerificationUrl,
    getCertificatesByPaymentStatus,
    getCertificatesByUserId,
    refreshCertificates,
    isLoaded,
  }), [
    certificates,
    currentRequest,
    setCurrentRequestCallback,
    addCertificate,
    updateCertificateStatus,
    getCertificate,
    getVerificationUrl,
    getCertificatesByPaymentStatus,
    getCertificatesByUserId,
    refreshCertificates,
    isLoaded,
  ])

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  )
})

export function useCertificates() {
  const context = useContext(CertificateContext)
  if (context === undefined) {
    throw new Error("useCertificates must be used within a CertificateProvider")
  }
  return context
}
