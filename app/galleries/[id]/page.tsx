"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import apiClient from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import GallerySidebarMobile from "@/components/gallery-sidebar-mobile"
import GalleryContent from "@/components/gallery-content"
import GalleryFavorites from "@/components/gallery-favorites"
import GalleryDesign from "@/components/gallery-design"
import { GallerySettings } from "@/components/gallery-settings"

interface Gallery {
  id: number
  name: string
  shooting_date: string
  is_public: boolean
  is_password_protected: boolean
  created_at: string
}

interface Scene {
  id: number
  name: string
  order_index: number
  photo_count: number
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"gallery" | "favorites" | "design" | "settings">("gallery")
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const galleryId = params.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    loadGalleryData()
  }, [isAuthenticated, galleryId, router])

  const loadGalleryData = async () => {
    try {
      setIsLoading(true)
      // Load gallery info and scenes
      const [galleryData, scenesData] = await Promise.all([
        apiClient.getGallery(Number.parseInt(galleryId)),
        apiClient.getScenes(Number.parseInt(galleryId)),
      ])
      setGallery(galleryData)
      setScenes(scenesData)

      // Встановити ім'я та дату з API
      setGalleryName(galleryData.name)
      setShootingDate(galleryData.shooting_date)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery")
    } finally {
      setIsLoading(false)
    }
  }

  const createScene = async () => {
    try {
      const newScene = await apiClient.createScene(Number.parseInt(galleryId), {
        name: `Scene ${scenes.length + 1}`,
      })
      setScenes([...scenes, newScene])
      toast({
        title: "Success",
        description: "Scene created successfully!",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create scene",
        variant: "destructive",
      })
    }
  }

  const handleGalleryNameChange = async (name: string) => {
    try {
      await apiClient.updateGallery(Number.parseInt(galleryId), { name })
      setGalleryName(name)
      // Оновити стан галереї
      if (gallery) {
        setGallery({ ...gallery, name })
      }
      toast({
        title: "Success",
        description: "Gallery name updated successfully!",
      })
    } catch (error) {
      console.error("Error updating gallery name:", error)
      toast({
        title: "Error",
        description: "Failed to update gallery name",
        variant: "destructive",
      })
    }
  }

  const handleShootingDateChange = async (date: string) => {
    try {
      await apiClient.updateGallery(Number.parseInt(galleryId), { shooting_date: date })
      setShootingDate(date)
      // Оновити стан галереї
      if (gallery) {
        setGallery({ ...gallery, shooting_date: date })
      }
      toast({
        title: "Success",
        description: "Shooting date updated successfully!",
      })
    } catch (error) {
      console.error("Error updating shooting date:", error)
      toast({
        title: "Error",
        description: "Failed to update shooting date",
        variant: "destructive",
      })
    }
  }

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

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Gallery not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/galleries">
            <Button>Back to Galleries</Button>
          </Link>
        </div>
      </div>
    )
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
