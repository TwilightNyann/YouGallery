"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SimpleHeader from "@/components/simple-header"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/galleries")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Очищаємо попередню помилку
    setError(null)
    setIsLoading(true)

    try {
      console.log("Form submitted with:", { email, password: "***" })
      await login(email, password)
      console.log("Login successful, redirecting...")
      router.push("/galleries")
    } catch (error) {
      console.error("Login failed in component:", error)

      // Встановлюємо помилку для відображення
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Login failed. Please check your credentials and try again.")
      }
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
            <h1 className="text-3xl font-bold">{t("auth.login.title")}</h1>
            <p className="text-gray-600 mt-2">{t("auth.login.subtitle")}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{t("auth.login.password")}</Label>
                <Link href="/forgot-password" className="text-sm text-[#191A23] hover:text-[#B9FF66] underline">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#B9FF66] text-[#191A23] hover:bg-[#a8eb55]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : t("auth.login.signIn")}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              {t("auth.login.noAccount")}{" "}
              <Link href="/register" className="text-[#191A23] hover:text-[#B9FF66] font-medium">
                {t("auth.login.signUp")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
