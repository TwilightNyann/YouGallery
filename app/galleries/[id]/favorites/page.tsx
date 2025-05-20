"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import PhotoGrid from "@/components/photo-grid"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

export default function GalleryFavoritesPage({ params }: { params: { id: string } }) {
  const [sortBy, setSortBy] = useState("newest")
  const [favoritePhotos, setFavoritePhotos] = useState<any[]>([])
  const { t } = useLanguage()
  const { toast } = useToast()

  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Load photos from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const storedPhotosByScene = localStorage.getItem(`gallery-${params.id}-photos`)
      if (storedPhotosByScene) {
        try {
          const photosByScene = JSON.parse(storedPhotosByScene)

          // Extract all favorited photos from all scenes
          const allFavorites: any[] = []
          Object.keys(photosByScene).forEach((sceneId) => {
            photosByScene[sceneId].forEach((photo: any) => {
              if (photo.isFavorite) {
                allFavorites.push({
                  ...photo,
                  sceneId,
                })
              }
            })
          })

          setFavoritePhotos(allFavorites)
        } catch (e) {
          console.error("Failed to parse stored photos", e)
        }
      }
    }

    loadFavorites()

    // Add event listener to reload favorites when localStorage changes
    window.addEventListener("storage", loadFavorites)
    return () => {
      window.removeEventListener("storage", loadFavorites)
    }
  }, [params.id])

  useEffect(() => {
    const storedName = localStorage.getItem(`gallery-${params.id}-name`)
    const storedDate = localStorage.getItem(`gallery-${params.id}-date`)

    if (storedName) setGalleryName(storedName)
    if (storedDate) setShootingDate(storedDate)
  }, [params.id])

  const handleGalleryNameChange = (name: string) => {
    setGalleryName(name)
    localStorage.setItem(`gallery-${params.id}-name`, name)
  }

  const handleShootingDateChange = (date: string) => {
    setShootingDate(date)
    localStorage.setItem(`gallery-${params.id}-date`, date)
  }

  const handleFavoriteToggle = (photoId: number) => {
    // Get the current photos by scene
    const storedPhotosByScene = localStorage.getItem(`gallery-${params.id}-photos`)
    if (storedPhotosByScene) {
      try {
        const photosByScene = JSON.parse(storedPhotosByScene)

        // Update the favorite status in all scenes
        Object.keys(photosByScene).forEach((sceneId) => {
          photosByScene[sceneId] = photosByScene[sceneId].map((photo: any) =>
            photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo,
          )
        })

        // Save back to localStorage
        localStorage.setItem(`gallery-${params.id}-photos`, JSON.stringify(photosByScene))

        // Update the local state
        setFavoritePhotos((prev) => prev.filter((photo) => photo.id !== photoId))

        toast({
          title: t("gallery.photoUpdated"),
          description: t("gallery.removedFromFavorites"),
        })
      } catch (e) {
        console.error("Failed to update favorites", e)
      }
    }
  }

  const handleDeletePhoto = (photoId: number) => {
    // Get the current photos by scene
    const storedPhotosByScene = localStorage.getItem(`gallery-${params.id}-photos`)
    if (storedPhotosByScene) {
      try {
        const photosByScene = JSON.parse(storedPhotosByScene)

        // Remove the photo from all scenes
        Object.keys(photosByScene).forEach((sceneId) => {
          photosByScene[sceneId] = photosByScene[sceneId].filter((photo: any) => photo.id !== photoId)
        })

        // Save back to localStorage
        localStorage.setItem(`gallery-${params.id}-photos`, JSON.stringify(photosByScene))

        // Update the local state
        setFavoritePhotos((prev) => prev.filter((photo) => photo.id !== photoId))

        toast({
          title: t("gallery.photoDeleted"),
          description: t("gallery.photoDeletedDescription"),
        })
      } catch (e) {
        console.error("Failed to delete photo", e)
      }
    }
  }

  // In a real app, you would fetch the gallery details
  // const galleryName = localStorage.getItem(`gallery-${params.id}-name`) || "Sample Gallery"
  // const shootingDate = localStorage.getItem(`gallery-${params.id}-date`) || "2024-05-11"

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <GallerySidebar
          galleryId={params.id}
          galleryName={galleryName}
          shootingDate={shootingDate}
          currentView="favorites"
          onGalleryNameChange={handleGalleryNameChange}
          onShootingDateChange={handleShootingDateChange}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">{t("gallery.favorites")}</h1>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("gallery.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("gallery.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("gallery.oldest")}</SelectItem>
                  <SelectItem value="name">{t("gallery.name")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {favoritePhotos.length > 0 ? (
              <PhotoGrid
                photos={favoritePhotos}
                sortBy={sortBy}
                onFavoriteToggle={handleFavoriteToggle}
                onDeletePhoto={handleDeletePhoto}
              />
            ) : (
              <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
                <p className="text-gray-500">{t("gallery.noFavorites")}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
