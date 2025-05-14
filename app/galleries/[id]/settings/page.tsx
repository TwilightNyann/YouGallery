"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GallerySettingsPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [galleryName, setGalleryName] = useState("Sample Gallery")
  const [shootingDate, setShootingDate] = useState("2024-05-11")
  const [isPublic, setIsPublic] = useState(false)

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleSave = () => {
    // In a real app, you would save the settings to the backend
    console.log("Saving settings:", { galleryName, shootingDate, isPublic })
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
