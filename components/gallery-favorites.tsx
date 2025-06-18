"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhotoGrid from "@/components/photo-grid"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"

interface GalleryFavoritesProps {
  galleryId: string
}

export default function GalleryFavorites({ galleryId }: GalleryFavoritesProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [favoritePhotos, setFavoritePhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const { toast } = useToast()

  // Load client favorites from backend
  useEffect(() => {
    loadClientFavorites()
  }, [galleryId])

  const loadClientFavorites = async () => {
    try {
      setLoading(true)
      console.log(`🔍 Loading client favorites for gallery ${galleryId}`)

      // Get all favorites for this gallery from backend
      const favorites = await apiClient.getGalleryFavorites(Number.parseInt(galleryId))
      console.log(`✅ Loaded ${favorites.length} client favorites:`, favorites)

      setFavoritePhotos(favorites)
    } catch (error) {
      console.error("❌ Error loading client favorites:", error)
      setFavoritePhotos([])
    } finally {
      setLoading(false)
    }
  }

  // Listen for favorite updates from public gallery
  useEffect(() => {
    const handleFavoriteUpdate = () => {
      console.log("🔄 Favorite updated, reloading...")
      loadClientFavorites()
    }

    // Listen for storage changes (when clients add/remove favorites)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes(`public-gallery-${galleryId}-favorites`)) {
        console.log("🔄 Client favorites changed in localStorage, reloading...")
        loadClientFavorites()
      }
    }

    // Listen for custom events
    window.addEventListener("clientFavoriteUpdated", handleFavoriteUpdate)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("clientFavoriteUpdated", handleFavoriteUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [galleryId])

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await apiClient.deletePhoto(photoId)

      // Remove from local state
      setFavoritePhotos((prev) => prev.filter((photo) => photo.id !== photoId))

      toast({
        title: t("gallery.photoDeleted"),
        description: t("gallery.photoDeletedDescription"),
      })
    } catch (error) {
      console.error("Failed to delete photo", error)
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t("gallery.favorites")}</h1>
          <p className="text-gray-600 mt-1">Photos liked by clients viewing your gallery</p>
        </div>

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
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-6">
            {favoritePhotos.length} photo{favoritePhotos.length !== 1 ? "s" : ""} liked by clients
          </p>
          <PhotoGrid
            photos={favoritePhotos}
            sortBy={sortBy}
            onDeletePhoto={handleDeletePhoto}
            enableReordering={false}
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No client favorites yet</h3>
            <p className="text-gray-500">
              When clients view your gallery and like photos, they will appear here. Share your gallery link to start
              collecting favorites!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
