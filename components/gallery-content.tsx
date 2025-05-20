"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Type } from "lucide-react"
import PhotoGrid from "@/components/photo-grid"
import { useLanguage } from "@/contexts/language-context"
import { SimpleModal } from "@/components/simple-modal"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

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

interface GalleryContentProps {
  galleryId: string
  galleryName: string
  shootingDate: string
  selectedSceneId?: string // Додаємо проп для вибраної сцени
}

export default function GalleryContent({
  galleryId,
  galleryName,
  shootingDate,
  selectedSceneId = "1", // За замовчуванням використовуємо "1"
}: GalleryContentProps) {
  const { t } = useLanguage()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showPhotoNames, setShowPhotoNames] = useState(false)
  const [photosByScene, setPhotosByScene] = useState(initialMockPhotosByScene)
  const [scenes, setScenes] = useState<{ id: string; name: string }[]>([])
  const [selectedSceneName, setSelectedSceneName] = useState<string>("")
  const [allScenesDeleted, setAllScenesDeleted] = useState(false)

  // Load scenes and photos from localStorage
  useEffect(() => {
    const storedPhotosByScene = localStorage.getItem(`gallery-${galleryId}-photos`)
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
    const allScenesDeletedFlag = localStorage.getItem(`gallery-${galleryId}-all-scenes-deleted`) === "true"

    setAllScenesDeleted(allScenesDeletedFlag)

    if (storedPhotosByScene) {
      try {
        setPhotosByScene(JSON.parse(storedPhotosByScene))
      } catch (e) {
        console.error("Failed to parse stored photos", e)
      }
    } else if (!allScenesDeletedFlag) {
      // Only use mock data for new galleries, not when all scenes were intentionally deleted
      localStorage.setItem(`gallery-${galleryId}-photos`, JSON.stringify(initialMockPhotosByScene))
    } else {
      // If all scenes were deleted, initialize with empty photos object
      setPhotosByScene({})
    }

    if (storedScenes) {
      try {
        const parsedScenes = JSON.parse(storedScenes)
        setScenes(parsedScenes)
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
      }
    }
  }, [galleryId])

  // Add an event listener to update scene name when it changes
  useEffect(() => {
    // Function to handle scene name changes from other components
    const handleSceneNameChange = (event: CustomEvent) => {
      const { sceneId, newName } = event.detail
      if (sceneId === selectedSceneId) {
        setSelectedSceneName(newName)
      }
    }

    // Add event listener for scene name changes
    if (typeof window !== "undefined") {
      window.addEventListener("sceneNameChanged", handleSceneNameChange as EventListener)
    }

    // Clean up event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("sceneNameChanged", handleSceneNameChange as EventListener)
      }
    }
  }, [selectedSceneId])

  // Improve the scene name loading logic
  useEffect(() => {
    if (selectedSceneId) {
      // Always reload the scenes data from localStorage to ensure we have the latest
      const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
      if (storedScenes) {
        try {
          const parsedScenes = JSON.parse(storedScenes)
          setScenes(parsedScenes)

          // Find the selected scene
          const scene = parsedScenes.find((s: { id: string; name: string }) => s.id === selectedSceneId)
          if (scene) {
            setSelectedSceneName(scene.name)
          } else {
            setSelectedSceneName("")
          }
        } catch (e) {
          console.error("Failed to parse stored scenes", e)
        }
      } else {
        // If no scenes are stored yet, set scenes to empty array
        setScenes([])
        setSelectedSceneName("")
      }
    }
  }, [selectedSceneId, galleryId])

  // Let's add an event listener for the allScenesDeleted event

  // Update the useEffect to handle the case when all scenes are deleted
  useEffect(() => {
    // Function to handle when all scenes are deleted
    const handleAllScenesDeleted = (event: CustomEvent) => {
      const { galleryId: eventGalleryId } = event.detail
      if (eventGalleryId === galleryId) {
        // Update our local scenes state to empty
        setScenes([])
        setSelectedSceneName("")
        setAllScenesDeleted(true)
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
  }, [galleryId])

  // Add a listener for the scenesAvailable event to reset the allScenesDeleted state
  useEffect(() => {
    // Function to handle when scenes become available again
    const handleScenesAvailable = (event: CustomEvent) => {
      const { galleryId: eventGalleryId } = event.detail
      if (eventGalleryId === galleryId) {
        setAllScenesDeleted(false)
      }
    }

    // Add event listener for scenes available
    if (typeof window !== "undefined") {
      window.addEventListener("scenesAvailable", handleScenesAvailable as EventListener)
    }

    // Clean up event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scenesAvailable", handleScenesAvailable as EventListener)
      }
    }
  }, [galleryId])

  const handleSave = () => {
    setIsEditing(false)
    // Save changes to backend
  }

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

      const updatedPhotosByScene = {
        ...photosByScene,
        [selectedSceneId]: [...(photosByScene[selectedSceneId] || []), ...newPhotos],
      }

      setPhotosByScene(updatedPhotosByScene)

      // Зберігаємо оновлені фото в localStorage
      localStorage.setItem(`gallery-${galleryId}-photos`, JSON.stringify(updatedPhotosByScene))

      toast({
        title: t("gallery.uploadSuccess"),
        description: `${files.length} ${t("gallery.photosUploaded")}`,
      })
    }

    // Close the modal after upload
    setIsUploadModalOpen(false)
  }

  const togglePhotoNames = () => {
    setShowPhotoNames(!showPhotoNames)
  }

  const handleFavoriteToggle = (photoId: number) => {
    const updatedPhotosByScene = { ...photosByScene }

    // Find the scene that contains this photo
    Object.keys(updatedPhotosByScene).forEach((sceneId) => {
      updatedPhotosByScene[sceneId] = updatedPhotosByScene[sceneId].map((photo) =>
        photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo,
      )
    })

    setPhotosByScene(updatedPhotosByScene)

    // Зберігаємо оновлені фото в localStorage
    localStorage.setItem(`gallery-${galleryId}-photos`, JSON.stringify(updatedPhotosByScene))

    toast({
      title: t("gallery.photoUpdated"),
      description: t("gallery.favoriteStatusChanged"),
    })
  }

  const handleDeletePhoto = (photoId: number) => {
    const updatedPhotosByScene = { ...photosByScene }

    // Find the scene that contains this photo and remove it
    Object.keys(updatedPhotosByScene).forEach((sceneId) => {
      updatedPhotosByScene[sceneId] = updatedPhotosByScene[sceneId].filter((photo) => photo.id !== photoId)
    })

    setPhotosByScene(updatedPhotosByScene)

    // Зберігаємо оновлені фото в localStorage
    localStorage.setItem(`gallery-${galleryId}-photos`, JSON.stringify(updatedPhotosByScene))

    toast({
      title: t("gallery.photoDeleted"),
      description: t("gallery.photoDeletedDescription"),
    })
  }

  const handleSetAsCover = (photoId: number) => {
    // Store the cover photo ID in localStorage
    localStorage.setItem(`gallery-${galleryId}-cover`, photoId.toString())

    toast({
      title: t("gallery.coverUpdated"),
      description: t("gallery.coverUpdatedDescription"),
    })
  }

  // Get photos for the selected scene
  const currentScenePhotos = photosByScene[selectedSceneId] || []

  // Для відстеження стану
  useEffect(() => {
    console.log("GalleryContent - Selected Scene ID:", selectedSceneId)
    console.log("GalleryContent - Current Scene Photos:", currentScenePhotos)
  }, [selectedSceneId, currentScenePhotos])

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-4">
              <Input value={galleryName} className="text-xl sm:text-2xl font-bold" readOnly />
              <Input type="date" value={shootingDate} readOnly />
              <Button onClick={handleSave} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                {t("gallery.save")}
              </Button>
            </div>
          ) : (
            <div>
              {scenes.length > 0 && (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                    {selectedSceneId && selectedSceneName ? selectedSceneName : galleryName}
                  </h1>
                  {(!selectedSceneId || !selectedSceneName) && (
                    <p className="text-sm text-gray-500">{format(new Date(shootingDate), "MMMM d, yyyy")}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Only show controls when scenes exist */}
        {scenes.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("gallery.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("gallery.newest")}</SelectItem>
                <SelectItem value="oldest">{t("gallery.oldest")}</SelectItem>
                <SelectItem value="name">{t("gallery.name")}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-3 ml-auto sm:ml-0">
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
                <span className="hidden sm:inline">{t("gallery.upload")}</span>
                <span className="sm:hidden">{t("gallery.upload")}</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {currentScenePhotos.length > 0 ? (
        <PhotoGrid
          photos={currentScenePhotos}
          sortBy={sortBy}
          showNames={showPhotoNames}
          onFavoriteToggle={handleFavoriteToggle}
          onDeletePhoto={handleDeletePhoto}
          onSetAsCover={handleSetAsCover}
          galleryId={galleryId}
        />
      ) : scenes.length === 0 || !selectedSceneId ? (
        <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t("gallery.noScenes")}</h3>
          <p className="text-gray-500">{t("gallery.noScenesDescription")}</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("gallery.noPhotos")}</h3>
          <p className="text-gray-500">{t("gallery.noPhotosDescription")}</p>
        </div>
      )}

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
