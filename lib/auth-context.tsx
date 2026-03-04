"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, memo, useCallback, useMemo } from "react"

export type UserRole = "resident" | "captain" | "secretary" | "treasurer"

interface User {
  id?: string
  fullName: string
  mobileNumber: string
  email: string
  address: string
  /** Canonical field – base64 data URI or remote URL for the user's photo */
  photoUrl?: string
  role?: UserRole
}

interface StaffUser {
  id: string
  fullName: string
  email: string
  role: "captain" | "secretary" | "treasurer"
}

interface AuthContextType {
  user: User | null
  staffUser: StaffUser | null
  isAuthenticated: boolean
  isStaffAuthenticated: boolean
  isLoading: boolean
  userRole: UserRole | null
  login: (userData: User) => void
  staffLogin: (staffData: StaffUser) => void
  logout: () => void
  staffLogout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = memo(({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false)
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

      // Load staff auth
      const storedStaff = localStorage.getItem("barangay_staff")
      const storedStaffAuth = localStorage.getItem("barangay_staff_auth")

      if (storedStaff && storedStaffAuth === "true") {
        try {
          setStaffUser(JSON.parse(storedStaff))
          setIsStaffAuthenticated(true)
        } catch (error) {
          console.error("Failed to parse staff user data:", error)
          localStorage.removeItem("barangay_staff")
          localStorage.removeItem("barangay_staff_auth")
          setStaffUser(null)
          setIsStaffAuthenticated(false)
        }
      }

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

      if (staffUser && isStaffAuthenticated) {
        localStorage.setItem("barangay_staff", JSON.stringify(staffUser))
        localStorage.setItem("barangay_staff_auth", "true")
      } else {
        localStorage.removeItem("barangay_staff")
        localStorage.removeItem("barangay_staff_auth")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [user, isAuthenticated, staffUser, isStaffAuthenticated, isLoading])

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

  const staffLogin = useCallback((staffData: StaffUser) => {
    setStaffUser(staffData)
    setIsStaffAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("barangay_user")
    localStorage.removeItem("barangay_auth")
  }, [])

  const staffLogout = useCallback(() => {
    setStaffUser(null)
    setIsStaffAuthenticated(false)
    localStorage.removeItem("barangay_staff")
    localStorage.removeItem("barangay_staff_auth")
  }, [])

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null)
  }, [])

  const userRole: UserRole | null = staffUser?.role || user?.role || null

  const value = useMemo(() => ({
    user,
    staffUser,
    isAuthenticated,
    isStaffAuthenticated,
    isLoading,
    userRole,
    login,
    staffLogin,
    logout,
    staffLogout,
    updateUser,
  }), [
    user,
    staffUser,
    isAuthenticated,
    isStaffAuthenticated,
    isLoading,
    userRole,
    login,
    staffLogin,
    logout,
    staffLogout,
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
