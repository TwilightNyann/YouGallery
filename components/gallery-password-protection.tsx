"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { apiClient } from "@/lib/api"

interface GalleryPasswordProtectionProps {
  galleryId: number
  galleryName: string
  onPasswordVerified: () => void
}

export function GalleryPasswordProtection({
  galleryId,
  galleryName,
  onPasswordVerified,
}: GalleryPasswordProtectionProps) {
  const { t } = useLanguage()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password) {
      setError("Please enter a password")
      return
    }

    try {
      setIsLoading(true)
      const response = await apiClient.checkGalleryPassword(galleryId, password)

      if (response.success) {
        // Store the access token for this gallery in sessionStorage
        sessionStorage.setItem(`gallery-${galleryId}-access`, "true")
        onPasswordVerified()
      } else {
        setError("Incorrect password")
      }
    } catch (error) {
      console.error("Error checking password:", error)
      setError("Failed to verify password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Protected Gallery</CardTitle>
          <CardDescription>
            The gallery "{galleryName}" is password protected. Please enter the password to view it.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter gallery password"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#B9FF66] text-black hover:bg-[#a8eb55]" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access Gallery"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
