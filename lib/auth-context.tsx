"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, memo, useCallback, useMemo } from "react"

export type UserRole = "resident"

interface User {
  id?: string
  fullName: string
  mobileNumber: string
  email: string
  address: string
  barangay?: string
  /** Canonical field – base64 data URI or remote URL for the user's photo */
  photoUrl?: string
  role?: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  userRole: UserRole | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = memo(({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Load resident auth
      const storedUser = localStorage.getItem("barangay_user")
      const storedAuth = localStorage.getItem("barangay_auth")

      if (storedUser && storedAuth === "true") {
        try {
          const parsed = JSON.parse(storedUser)
          // Backward-compat: migrate legacy `photoBase64` key to the canonical `photoUrl`
          if (parsed.photoBase64 && !parsed.photoUrl) {
            parsed.photoUrl = parsed.photoBase64
            delete parsed.photoBase64
          }
          // Ensure every loaded user has a stable id
          if (!parsed.id) {
            parsed.id = typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `user_${Date.now()}`
          }
          if (!parsed.barangay && typeof parsed.address === "string") {
            const addressParts = parsed.address.split(",").map((part: string) => part.trim()).filter(Boolean)
            parsed.barangay = addressParts.length > 1 ? addressParts[1] : undefined
          }
          setUser(parsed)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Failed to parse resident user data:", error)
          localStorage.removeItem("barangay_user")
          localStorage.removeItem("barangay_auth")
          setUser(null)
          setIsAuthenticated(false)
        }
      }

      // This demo is resident-only. Clear any legacy staff auth state.
      localStorage.removeItem("barangay_staff")
      localStorage.removeItem("barangay_staff_auth")

      setIsLoading(false)
    }
    load()
  }, [])

  // Debounced save for auth state
  useEffect(() => {
    if (isLoading) return

    const timer = setTimeout(() => {
      if (user && isAuthenticated) {
        localStorage.setItem("barangay_user", JSON.stringify(user))
        localStorage.setItem("barangay_auth", "true")
      } else {
        localStorage.removeItem("barangay_user")
        localStorage.removeItem("barangay_auth")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [user, isAuthenticated, isLoading])

  const login = useCallback((userData: User) => {
    // Guarantee a stable id is assigned once at login time, never at render time
    const stableUser: User = {
      ...userData,
      id: userData.id || (
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `user_${Date.now()}`
      ),
    }
    setUser(stableUser)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("barangay_user")
    localStorage.removeItem("barangay_auth")
    localStorage.removeItem("barangay_staff")
    localStorage.removeItem("barangay_staff_auth")
  }, [])

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null)
  }, [])

  const userRole: UserRole | null = user?.role || null

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    updateUser,
  }), [
    user,
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    updateUser,
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
