"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import apiClient from "@/lib/api"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (token) {
        const userData = await apiClient.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("access_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", { email })
      const response = await apiClient.login({ email, password })
      console.log("Login response:", response)

      const userData = await apiClient.getCurrentUser()
      console.log("User data:", userData)

      setUser(userData)
    } catch (error) {
      console.error("Login error in context:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      console.log("Attempting registration with:", { name, email })
      const response = await apiClient.register({
        name,
        email,
        password,
        phone: phone || "",
      })
      console.log("Registration response:", response)

      // Auto-login after registration
      await login(email, password)
    } catch (error) {
      console.error("Registration error in context:", error)
      throw error
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    router.push("/login")
  }

  const updateProfile = async (data: { name?: string; email?: string; phone?: string }) => {
    try {
      const updatedUser = await apiClient.updateProfile(data)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error("Failed to update profile:", error)
      throw error
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiClient.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
    } catch (error) {
      console.error("Failed to update password:", error)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      await apiClient.deleteAccount()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Failed to delete account:", error)
      throw error
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
