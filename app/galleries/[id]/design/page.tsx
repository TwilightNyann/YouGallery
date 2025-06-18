"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import GalleryDesign from "@/components/gallery-design"

export default function GalleryDesignPage({ params }: { params: { id: string } }) {
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
          <GalleryDesign galleryId={params.id} galleryName={galleryName} shootingDate={shootingDate} />
        </main>
      </div>
    </div>
  )
}
