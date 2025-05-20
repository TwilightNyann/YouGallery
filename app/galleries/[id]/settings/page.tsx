"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function GallerySettingsPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")
  const [isPublic, setIsPublic] = useState(false)

  // Add password protection state
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Load gallery details from localStorage if available
  useEffect(() => {
    const storedName = localStorage.getItem(`gallery-${params.id}-name`)
    const storedDate = localStorage.getItem(`gallery-${params.id}-date`)

    if (storedName) setGalleryName(storedName)
    if (storedDate) setShootingDate(storedDate)
  }, [params.id])

  // Add this after the existing useEffect
  useEffect(() => {
    // Load password protection settings from localStorage
    const storedPasswordProtection = localStorage.getItem(`gallery-${params.id}-password-protected`)
    if (storedPasswordProtection) {
      setIsPasswordProtected(storedPasswordProtection === "true")
    }
  }, [params.id])

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Update the handleSave function to include password protection
  const handleSave = () => {
    // Save gallery name and date to localStorage
    localStorage.setItem(`gallery-${params.id}-name`, galleryName)
    localStorage.setItem(`gallery-${params.id}-date`, shootingDate)

    // In a real app, you would save the settings to the backend
    console.log("Saving settings:", { galleryName, shootingDate, isPublic })
  }

  // Add a function to handle password saving
  const handleSavePassword = () => {
    // Reset error
    setPasswordError("")

    // Validate password
    if (isPasswordProtected) {
      if (!password) {
        setPasswordError(t("gallery.passwordRequired"))
        return
      }

      if (password !== confirmPassword) {
        setPasswordError(t("gallery.passwordMismatch"))
        return
      }
    }

    // Save password protection settings
    localStorage.setItem(`gallery-${params.id}-password-protected`, isPasswordProtected.toString())

    if (isPasswordProtected && password) {
      // In a real app, you would hash the password before storing it
      localStorage.setItem(`gallery-${params.id}-password`, password)
    } else {
      // Remove password if protection is disabled
      localStorage.removeItem(`gallery-${params.id}-password`)
    }

    toast({
      title: t("gallery.settingsSaved"),
      description: t("gallery.passwordSettingsUpdated"),
    })
  }

  const handleGalleryNameChange = (name: string) => {
    setGalleryName(name)
  }

  const handleShootingDateChange = (date: string) => {
    setShootingDate(date)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <GallerySidebar
          galleryId={params.id}
          galleryName={galleryName}
          shootingDate={shootingDate}
          currentView="settings"
          onGalleryNameChange={handleGalleryNameChange}
          onShootingDateChange={handleShootingDateChange}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{t("gallery.settings")}</h1>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("gallery.generalSettings")}</CardTitle>
                  <CardDescription>{t("gallery.generalSettingsDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-name">{t("gallery.galleryName")}</Label>
                    <Input id="gallery-name" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shooting-date">{t("gallery.shootingDate")}</Label>
                    <Input
                      id="shooting-date"
                      type="date"
                      value={shootingDate}
                      onChange={(e) => setShootingDate(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                    {t("gallery.save")}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("gallery.privacySettings")}</CardTitle>
                  <CardDescription>{t("gallery.privacySettingsDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-public"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#B9FF66] focus:ring-[#B9FF66]"
                    />
                    <Label htmlFor="is-public" className="text-sm font-medium leading-none cursor-pointer">
                      {t("gallery.makePublic")}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{t("gallery.makePublicDescription")}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                    {t("gallery.save")}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("gallery.passwordProtection")}</CardTitle>
                  <CardDescription>{t("gallery.passwordProtectionDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-password-protected"
                      checked={isPasswordProtected}
                      onChange={(e) => setIsPasswordProtected(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#B9FF66] focus:ring-[#B9FF66]"
                    />
                    <Label htmlFor="is-password-protected" className="text-sm font-medium leading-none cursor-pointer">
                      {t("gallery.enablePasswordProtection")}
                    </Label>
                  </div>

                  {isPasswordProtected && (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="gallery-password">{t("gallery.password")}</Label>
                        <Input
                          id="gallery-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t("gallery.enterPassword")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">{t("gallery.confirmPassword")}</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t("gallery.confirmPasswordPlaceholder")}
                        />
                      </div>

                      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePassword} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                    {t("gallery.savePassword")}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">{t("gallery.dangerZone")}</CardTitle>
                  <CardDescription>{t("gallery.dangerZoneDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">{t("gallery.deleteGalleryWarning")}</p>
                  <Button variant="destructive">{t("gallery.deleteGallery")}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
