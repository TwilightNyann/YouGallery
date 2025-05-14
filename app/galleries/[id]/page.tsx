"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Type } from "lucide-react"
import GallerySidebar from "@/components/gallery-sidebar"
import PhotoGrid from "@/components/photo-grid"
import Navbar from "@/components/navbar"
import { useLanguage } from "@/contexts/language-context"
import { SimpleModal } from "@/components/simple-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data for photos by scene
const initialMockPhotosByScene = {
  "1": [
    { id: 1, url: "/placeholder.svg?height=300&width=400", name: "Photo 1", isFavorite: false },
    { id: 2, url: "/placeholder.svg?height=300&width=400", name: "Photo 2", isFavorite: true },
    { id: 3, url: "/placeholder.svg?height=300&width=400", name: "Photo 3", isFavorite: false },
    { id: 4, url: "/placeholder.svg?height=300&width=400", name: "Photo 4", isFavorite: false },
  ],
  "scene-123456": [
    { id: 5, url: "/placeholder.svg?height=300&width=400", name: "Scene 2 - Photo 1", isFavorite: false },
    { id: 6, url: "/placeholder.svg?height=300&width=400", name: "Scene 2 - Photo 2", isFavorite: false },
  ],
}

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const sceneFromUrl = searchParams.get("scene")
  const { toast } = useToast()

  const [galleryName, setGalleryName] = useState("New Gallery")
  const [shootingDate, setShootingDate] = useState("2024-03-05")
  const [isEditing, setIsEditing] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [selectedSceneId, setSelectedSceneId] = useState<string>(sceneFromUrl || "1") // Use scene from URL or default
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showPhotoNames, setShowPhotoNames] = useState(false)
  const [photosByScene, setPhotosByScene] = useState(initialMockPhotosByScene)
  const { t } = useLanguage()

  // Load gallery details from localStorage if available
  useEffect(() => {
    const storedName = localStorage.getItem(`gallery-${params.id}-name`)
    const storedDate = localStorage.getItem(`gallery-${params.id}-date`)
    const storedPhotosByScene = localStorage.getItem(`gallery-${params.id}-photos`)

    if (storedName) setGalleryName(storedName)
    if (storedDate) setShootingDate(storedDate)
    if (storedPhotosByScene) {
      try {
        setPhotosByScene(JSON.parse(storedPhotosByScene))
      } catch (e) {
        console.error("Failed to parse stored photos", e)
      }
    }
  }, [params.id])

  // Save photos to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`gallery-${params.id}-photos`, JSON.stringify(photosByScene))
  }, [photosByScene, params.id])

  // Update selected scene if URL parameter changes
  useEffect(() => {
    if (sceneFromUrl) {
      setSelectedSceneId(sceneFromUrl)
    }
  }, [sceneFromUrl])

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleSave = () => {
    setIsEditing(false)
    // Save changes to backend
  }

  const handleSceneSelect = useCallback((sceneId: string) => {
    setSelectedSceneId(sceneId)
  }, [])

  const handleUpload = () => {
    // Open upload modal for the selected scene
    setIsUploadModalOpen(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    const files = e.target.files
    if (files && files.length > 0) {
      console.log(`Uploading ${files.length} files to scene ${selectedSceneId}`)
      // In a real app, you would upload these files to your backend

      // Mock adding new photos
      const newPhotos = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        url: "/placeholder.svg?height=300&width=400", // In a real app, this would be the uploaded file URL
        name: file.name,
        isFavorite: false,
      }))

      setPhotosByScene((prev) => ({
        ...prev,
        [selectedSceneId]: [...(prev[selectedSceneId] || []), ...newPhotos],
      }))

      toast({
        title: t("gallery.uploadSuccess"),
        description: `${files.length} ${t("gallery.photosUploaded")}`,
      })
    }

    // Close the modal after upload
    setIsUploadModalOpen(false)
  }

  const handleGalleryNameChange = (name: string) => {
    setGalleryName(name)
    localStorage.setItem(`gallery-${params.id}-name`, name)
  }

  const handleShootingDateChange = (date: string) => {
    setShootingDate(date)
    localStorage.setItem(`gallery-${params.id}-date`, date)
  }

  const togglePhotoNames = () => {
    setShowPhotoNames(!showPhotoNames)
  }

  const handleFavoriteToggle = (photoId: number) => {
    setPhotosByScene((prev) => {
      const updatedPhotosByScene = { ...prev }

      // Find the scene that contains this photo
      Object.keys(updatedPhotosByScene).forEach((sceneId) => {
        updatedPhotosByScene[sceneId] = updatedPhotosByScene[sceneId].map((photo) =>
          photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo,
        )
      })

      return updatedPhotosByScene
    })

    toast({
      title: t("gallery.photoUpdated"),
      description: t("gallery.favoriteStatusChanged"),
    })
  }

  const handleDeletePhoto = (photoId: number) => {
    setPhotosByScene((prev) => {
      const updatedPhotosByScene = { ...prev }

      // Find the scene that contains this photo and remove it
      Object.keys(updatedPhotosByScene).forEach((sceneId) => {
        updatedPhotosByScene[sceneId] = updatedPhotosByScene[sceneId].filter((photo) => photo.id !== photoId)
      })

      return updatedPhotosByScene
    })

    toast({
      title: t("gallery.photoDeleted"),
      description: t("gallery.photoDeletedDescription"),
    })
  }

  // Get photos for the selected scene
  const currentScenePhotos = photosByScene[selectedSceneId] || []

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <GallerySidebar
          galleryId={params.id}
          galleryName={galleryName}
          shootingDate={shootingDate}
          onSceneSelect={handleSceneSelect}
          selectedSceneId={selectedSceneId}
          currentView="gallery"
          onGalleryNameChange={handleGalleryNameChange}
          onShootingDateChange={handleShootingDateChange}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={galleryName}
                      onChange={(e) => setGalleryName(e.target.value)}
                      className="text-2xl font-bold"
                    />
                    <Input type="date" value={shootingDate} onChange={(e) => setShootingDate(e.target.value)} />
                    <Button onClick={handleSave} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                      {t("gallery.save")}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{galleryName}</h1>
                    <p className="text-gray-500">{format(new Date(shootingDate), "MMMM d, yyyy")}</p>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-gray-500 hover:text-black"
                    >
                      {t("gallery.edit")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
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

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePhotoNames}
                  className={showPhotoNames ? "bg-gray-200" : ""}
                >
                  <Type className="h-5 w-5" />
                </Button>

                <Button className="bg-black text-white hover:bg-black/90" onClick={handleUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("gallery.upload")}
                </Button>
              </div>
            </div>

            {currentScenePhotos.length > 0 ? (
              <PhotoGrid
                photos={currentScenePhotos}
                sortBy={sortBy}
                showNames={showPhotoNames}
                onFavoriteToggle={handleFavoriteToggle}
                onDeletePhoto={handleDeletePhoto}
              />
            ) : (
              <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("gallery.noPhotos")}</h3>
                <p className="text-gray-500">{t("gallery.noPhotosDescription")}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Photos Modal */}
      <SimpleModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={t("gallery.uploadPhotos")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{t("gallery.uploadPhotosToScene")}</p>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">{t("gallery.dragAndDrop")}</p>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {t("gallery.browseFiles")}
              </Button>
            </label>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              {t("gallery.cancel")}
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  )
}
