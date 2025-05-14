"use client"

import { useEffect } from "react"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import { useLanguage } from "@/contexts/language-context"
import { Paintbrush } from "lucide-react"

export default function GalleryDesignPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // In a real app, you would fetch the gallery details
  const galleryName = "Sample Gallery"
  const shootingDate = "2024-05-11"

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <GallerySidebar
          galleryId={params.id}
          galleryName={galleryName}
          shootingDate={shootingDate}
          currentView="design"
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
