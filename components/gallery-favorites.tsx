"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhotoGrid from "@/components/photo-grid"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

interface GalleryFavoritesProps {
  galleryId: string
}

export default function GalleryFavorites({ galleryId }: GalleryFavoritesProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [favoritePhotos, setFavoritePhotos] = useState<any[]>([])
  const { t } = useLanguage()
  const { toast } = useToast()

  // Load photos from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const storedPhotosByScene = localStorage.getItem(`gallery-${galleryId}-photos`)
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
  }, [galleryId])

  const handleFavoriteToggle = (photoId: number) => {
    // Get the current photos by scene
    const storedPhotosByScene = localStorage.getItem(`gallery-${galleryId}-photos`)
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
        localStorage.setItem(`gallery-${galleryId}-photos`, JSON.stringify(photosByScene))

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
    const storedPhotosByScene = localStorage.getItem(`gallery-${galleryId}-photos`)
    if (storedPhotosByScene) {
      try {
        const photosByScene = JSON.parse(storedPhotosByScene)

        // Remove the photo from all scenes
        Object.keys(photosByScene).forEach((sceneId) => {
          photosByScene[sceneId] = photosByScene[sceneId].filter((photo: any) => photo.id !== photoId)
        })

        // Save back to localStorage
        localStorage.setItem(`gallery-${galleryId}-photos`, JSON.stringify(photosByScene))

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

  return (
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
  )
}
