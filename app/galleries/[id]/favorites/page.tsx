"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import GallerySidebar from "@/components/gallery-sidebar"
import PhotoGrid from "@/components/photo-grid"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"
import { useRouter } from "next/navigation"

export default function GalleryFavoritesPage({ params }: { params: { id: string } }) {
  const [sortBy, setSortBy] = useState("newest")
  const [favoritePhotos, setFavoritePhotos] = useState<any[]>([])
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")
  const [isLoading, setIsLoading] = useState(true)

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Load gallery data and favorites
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setIsLoading(true)

        // Load gallery details
        const gallery = await apiClient.getGallery(Number(params.id))
        setGalleryName(gallery.name)
        setShootingDate(gallery.shooting_date)

        // Load favorites
        const favorites = await apiClient.getGalleryFavorites(Number(params.id))
        console.log("Loaded favorites:", favorites)
        setFavoritePhotos(favorites)
      } catch (error) {
        console.error("Error loading gallery data:", error)
        toast({
          title: t("gallery.error"),
          description: t("gallery.errorLoadingData"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadGalleryData()
  }, [params.id, t, toast])

  const handleGalleryNameChange = (name: string) => {
    setGalleryName(name)
  }

  const handleShootingDateChange = (date: string) => {
    setShootingDate(date)
  }

  const handleFavoriteToggle = async (photoId: number) => {
    try {
      await apiClient.toggleFavorite(photoId)

      // Update local state
      setFavoritePhotos((prev) => prev.filter((photo) => photo.id !== photoId))

      toast({
        title: t("gallery.photoUpdated"),
        description: t("gallery.removedFromFavorites"),
      })
    } catch (error) {
      console.error("Failed to update favorite:", error)
      toast({
        title: t("gallery.error"),
        description: t("gallery.errorUpdatingFavorite"),
        variant: "destructive",
      })
    }
  }

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await apiClient.deletePhoto(photoId)

      // Update local state
      setFavoritePhotos((prev) => prev.filter((photo) => photo.id !== photoId))

      toast({
        title: t("gallery.photoDeleted"),
        description: t("gallery.photoDeletedDescription"),
      })
    } catch (error) {
      console.error("Failed to delete photo:", error)
      toast({
        title: t("gallery.error"),
        description: t("gallery.errorDeletingPhoto"),
        variant: "destructive",
      })
    }
  }

  const handleSetAsCover = async (photoId: number) => {
    try {
      await apiClient.setGalleryCover(photoId)
      toast({
        title: t("gallery.coverUpdated"),
        description: t("gallery.coverUpdatedDescription"),
      })
    } catch (error) {
      console.error("Failed to set cover photo:", error)
      toast({
        title: t("gallery.error"),
        description: t("gallery.errorSettingCover"),
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
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
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </main>
        </div>
      </div>
    )
  }

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
                showNames={true}
                onFavoriteToggle={handleFavoriteToggle}
                onDeletePhoto={handleDeletePhoto}
                onSetAsCover={handleSetAsCover}
                galleryId={params.id}
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
