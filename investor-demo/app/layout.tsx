import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Barangay Linkod Investor Demo",
  description: "Static investor-facing demo for the Barangay Linkod resident registration and ID experience.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Aptos, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
