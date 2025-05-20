"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import { useLanguage } from "@/contexts/language-context"
import { Paintbrush } from "lucide-react"

export default function GalleryDesignPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")

  // Load gallery details from localStorage if available
  useEffect(() => {
    const storedName = localStorage.getItem(`gallery-${params.id}-name`)
    const storedDate = localStorage.getItem(`gallery-${params.id}-date`)

    if (storedName) setGalleryName(storedName)
    if (storedDate) setShootingDate(storedDate)
  }, [params.id])

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleGalleryNameChange = (name: string) => {
    setGalleryName(name)
    localStorage.setItem(`gallery-${params.id}-name`, name)
  }

  const handleShootingDateChange = (date: string) => {
    setShootingDate(date)
    localStorage.setItem(`gallery-${params.id}-date`, date)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <GallerySidebar
          galleryId={params.id}
          galleryName={galleryName}
          shootingDate={shootingDate}
          currentView="design"
          onGalleryNameChange={handleGalleryNameChange}
          onShootingDateChange={handleShootingDateChange}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">{t("gallery.design")}</h1>
            </div>

            <div className="bg-[#F3F3F3] rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <Paintbrush className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t("gallery.designInDevelopment")}</h2>
              <p className="text-gray-600 max-w-md mx-auto">{t("gallery.designInDevelopmentMessage")}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
