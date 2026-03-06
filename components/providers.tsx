'use client'

import { usePathname } from "next/navigation"
import { AuthProvider } from "@/lib/auth-context"
import { ResidentsProvider } from "@/lib/residents-context"
import { PaymentProvider } from "@/lib/payment-context"
import { QRTProvider } from "@/lib/qrt-context"
import { CertificateProvider } from "@/lib/certificate-context"
import { BlotterProvider } from "@/lib/blotter-context"
import { AnnouncementsProvider } from "@/lib/announcements-context"
import { BayanihanProvider } from "@/lib/bayanihan-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const useLeanResidentStack =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/register/success" ||
    pathname === "/dashboard"

  const residentShell = (
    <AuthProvider>
      <QRTProvider>
        <AnnouncementsProvider>
          {children}
        </AnnouncementsProvider>
      </QRTProvider>
    </AuthProvider>
  )

  if (useLeanResidentStack) {
    return residentShell
  }

  return (
    <AuthProvider>
      <ResidentsProvider>
        <PaymentProvider>
          <QRTProvider>
            <CertificateProvider>
              <BlotterProvider>
                <AnnouncementsProvider>
                  <BayanihanProvider>
                    {children}
                  </BayanihanProvider>
                </AnnouncementsProvider>
              </BlotterProvider>
            </CertificateProvider>
          </QRTProvider>
        </PaymentProvider>
      </ResidentsProvider>
    </AuthProvider>
  )
}
