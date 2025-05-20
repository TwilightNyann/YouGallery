"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface GallerySettingsProps {
  galleryId: string
  galleryName: string
  shootingDate: string
  onGalleryNameChange: (name: string) => void
  onShootingDateChange: (date: string) => void
}

export default function GallerySettings({
  galleryId,
  galleryName,
  shootingDate,
  onGalleryNameChange,
  onShootingDateChange,
}: GallerySettingsProps) {
  const { t } = useLanguage()
  const [isPublic, setIsPublic] = useState(false)

  // Add password protection state
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Add this after the existing useEffect
  useEffect(() => {
    // Load password protection settings from localStorage
    const storedPasswordProtection = localStorage.getItem(`gallery-${galleryId}-password-protected`)
    if (storedPasswordProtection) {
      setIsPasswordProtected(storedPasswordProtection === "true")
    }
  }, [galleryId])

  // Update the handleSave function to include password protection
  const handleSave = () => {
    // Save gallery name and date to localStorage
    onGalleryNameChange(galleryName)
    onShootingDateChange(shootingDate)

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
    localStorage.setItem(`gallery-${galleryId}-password-protected`, isPasswordProtected.toString())

    if (isPasswordProtected && password) {
      // In a real app, you would hash the password before storing it
      localStorage.setItem(`gallery-${galleryId}-password`, password)
    } else {
      // Remove password if protection is disabled
      localStorage.removeItem(`gallery-${galleryId}-password`)
    }

    toast({
      title: t("gallery.settingsSaved"),
      description: t("gallery.passwordSettingsUpdated"),
    })
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("gallery.settings")}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("gallery.generalSettings")}</CardTitle>
            <CardDescription>{t("gallery.generalSettingsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="gallery-name">{t("gallery.galleryName")}</Label>
              <Input id="gallery-name" value={galleryName} onChange={(e) => onGalleryNameChange(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shooting-date">{t("gallery.shootingDate")}</Label>
              <Input
                id="shooting-date"
                type="date"
                value={shootingDate}
                onChange={(e) => onShootingDateChange(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="p-4 sm:p-6 pt-0">
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
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
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
          <CardFooter className="p-4 sm:p-6 pt-0">
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
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
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
          <CardFooter className="p-4 sm:p-6 pt-0">
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
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <p className="text-sm text-gray-500 mb-4">{t("gallery.deleteGalleryWarning")}</p>
            <Button variant="destructive">{t("gallery.deleteGallery")}</Button>
          </CardContent>
          <CardFooter className="p-4 sm:p-6 pt-0"></CardFooter>
        </Card>
      </div>
    </div>
  )
}
