'use client'

import { usePathname } from "next/navigation"
import { Providers } from './providers'

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Keep the public landing page independent from the app provider stack.
  // If any client context fails during hydration, "/" should still remain usable.
  if (pathname === "/") {
    return <>{children}</>
  }

  return <Providers>{children}</Providers>
}
