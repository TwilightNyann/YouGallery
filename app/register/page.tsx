"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import SimpleHeader from "@/components/simple-header"
// Remove: import Footer from "@/components/footer"
// import Footer from "@/components/footer"
// Remove: import apiClient from "@/lib/api"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Remove: const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  // const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  const { register, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/galleries")
    }
  }, [isAuthenticated, router])

  // Remove the entire useEffect block that tests API connection
  // Test API connection on component mount
  // useEffect(() => {
  //   const testConnection = async () => {
  //     try {
  //       const isConnected = await apiClient.testConnection()
  //       setConnectionStatus(isConnected ? "connected" : "disconnected")
  //     } catch (error) {
  //       console.error("Connection test failed:", error)
  //       setConnectionStatus("disconnected")
  //     }
  //   }

  //   testConnection()
  // }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      router.push("/galleries")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div className="flex-grow flex items-center justify-center bg-[#F3F3F3] py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{t("auth.register.title")}</h1>
            <p className="text-gray-600 mt-2">{t("auth.register.subtitle")}</p>
          </div>

          {/* Remove the three Alert components that show connection status (checking, disconnected, connected) */}
          {/* Connection Status */}
          {/* {connectionStatus === "checking" && (
            <Alert className="mb-4">
              <AlertDescription>Checking API connection...</AlertDescription>
            </Alert>
          )}

          {connectionStatus === "disconnected" && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Cannot connect to API server. Please check your connection and try again.
                <br />
                <small className="text-xs">API URL: {process.env.NEXT_PUBLIC_API_URL}</small>
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === "connected" && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">✓ Connected to API server</AlertDescription>
            </Alert>
          )} */}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.register.name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.register.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.register.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("auth.register.confirmPassword")}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#B9FF66] text-[#191A23] hover:bg-[#a8eb55]"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : t("auth.register.createAccount")}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              {t("auth.register.haveAccount")}{" "}
              <Link href="/login" className="text-[#191A23] hover:text-[#B9FF66] font-medium">
                {t("auth.register.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Remove: <Footer /> */}
      {/* <Footer /> */}
    </main>
  )
}
