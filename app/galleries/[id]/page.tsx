"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import GallerySidebarMobile from "@/components/gallery-sidebar-mobile"
import GalleryContent from "@/components/gallery-content"
import GalleryFavorites from "@/components/gallery-favorites"
import GalleryDesign from "@/components/gallery-design"
import GallerySettings from "@/components/gallery-settings"

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"gallery" | "favorites" | "design" | "settings">("gallery")
  const router = useRouter()

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

  // Add a useEffect to handle the case when all scenes are deleted
  useEffect(() => {
    // Function to handle when all scenes are deleted
    const handleAllScenesDeleted = (event: CustomEvent) => {
      const { galleryId: eventGalleryId } = event.detail
      if (eventGalleryId === params.id) {
        // Clear the selected scene ID
        setSelectedSceneId(null)
      }
    }

    // Add event listener for all scenes deleted
    if (typeof window !== "undefined") {
      window.addEventListener("allScenesDeleted", handleAllScenesDeleted as EventListener)
    }

    // Clean up event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("allScenesDeleted", handleAllScenesDeleted as EventListener)
      }
    }
  }, [params.id])

  const handleGalleryNameChange = (name: string) => {
    setGalleryName(name)
    localStorage.setItem(`gallery-${params.id}-name`, name)
  }

  const handleShootingDateChange = (date: string) => {
    setShootingDate(date)
    localStorage.setItem(`gallery-${params.id}-date`, date)
  }

  const handleSceneSelect = (sceneId: string) => {
    if (sceneId === "") {
      setSelectedSceneId(null)
    } else {
      setSelectedSceneId(sceneId)
    }
  }

  const handleViewChange = (view: string) => {
    if (view === "gallery" || view === "favorites" || view === "design" || view === "settings") {
      setCurrentView(view)
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <GallerySidebarMobile
        galleryId={params.id}
        galleryName={galleryName}
        shootingDate={shootingDate}
        currentView={currentView}
        onViewChange={handleViewChange}
        onSceneSelect={handleSceneSelect}
        onGalleryNameChange={handleGalleryNameChange}
        onShootingDateChange={handleShootingDateChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <GallerySidebar
            galleryId={params.id}
            galleryName={galleryName}
            shootingDate={shootingDate}
            currentView={currentView}
            selectedSceneId={selectedSceneId}
            onSceneSelect={handleSceneSelect}
            onGalleryNameChange={handleGalleryNameChange}
            onShootingDateChange={handleShootingDateChange}
            onViewChange={handleViewChange}
          />
        </div>

        <main className="flex-1 overflow-y-auto">
          {currentView === "gallery" && (
            <GalleryContent
              galleryId={params.id}
              galleryName={galleryName}
              shootingDate={shootingDate}
              selectedSceneId={selectedSceneId}
            />
          )}
          {currentView === "favorites" && <GalleryFavorites galleryId={params.id} />}
          {currentView === "design" && (
            <GalleryDesign galleryId={params.id} galleryName={galleryName} shootingDate={shootingDate} />
          )}
          {currentView === "settings" && (
            <GallerySettings
              galleryId={params.id}
              galleryName={galleryName}
              shootingDate={shootingDate}
              onGalleryNameChange={handleGalleryNameChange}
              onShootingDateChange={handleShootingDateChange}
            />
          )}
        </main>
      </div>
    </div>
  )
}
