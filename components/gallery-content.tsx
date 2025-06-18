"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Type, X } from "lucide-react"
import PhotoGrid from "@/components/photo-grid"
import { useLanguage } from "@/contexts/language-context"
import { SimpleModal } from "@/components/simple-modal"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"

interface Photo {
  id: number
  url: string
  name: string
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  order_index: number
  scene_id: number
  created_at: string
  isFavorite?: boolean
}

interface Scene {
  id: number
  name: string
  order_index: number
  gallery_id: number
  photos?: Photo[]
}

interface GalleryContentProps {
  galleryId: string
  galleryName: string
  shootingDate: string
  selectedSceneId?: string
}

export default function GalleryContent({ galleryId, galleryName, shootingDate, selectedSceneId }: GalleryContentProps) {
  const { t } = useLanguage()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showPhotoNames, setShowPhotoNames] = useState(false)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedSceneName, setSelectedSceneName] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedCount, setUploadedCount] = useState(0)

  // Load scenes and photos from API
  useEffect(() => {
    if (galleryId && !isNaN(Number(galleryId))) {
      loadScenes()
    }
  }, [galleryId])

  useEffect(() => {
    if (selectedSceneId && !isNaN(Number(selectedSceneId))) {
      loadPhotos()
      const scene = scenes.find((s) => s.id === Number(selectedSceneId))
      if (scene) {
        setSelectedSceneName(scene.name)
      }
    } else {
      setSelectedSceneName("")
      setPhotos([])
    }
  }, [selectedSceneId, scenes])

  // Додати useEffect для слухання змін імені сцени:
  useEffect(() => {
    const handleSceneNameChanged = (event: CustomEvent) => {
      const { sceneId, newName } = event.detail
      if (sceneId.toString() === selectedSceneId) {
        setSelectedSceneName(newName)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("sceneNameChanged", handleSceneNameChanged as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("sceneNameChanged", handleSceneNameChanged as EventListener)
      }
    }
  }, [selectedSceneId])

  // Додати слухач для оновлення галереї:
  useEffect(() => {
    const handleGalleryUpdated = (event: CustomEvent) => {
      const { galleryId: updatedGalleryId, name, shooting_date } = event.detail
      if (updatedGalleryId === galleryId) {
        // Галерея оновлена, але ми не показуємо дату тут
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("galleryUpdated", handleGalleryUpdated as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("galleryUpdated", handleGalleryUpdated as EventListener)
      }
    }
  }, [galleryId])

  const loadScenes = async () => {
    try {
      setLoading(true)
      const galleryIdNum = Number(galleryId)
      if (isNaN(galleryIdNum)) {
        throw new Error("Invalid gallery ID")
      }
      const scenesData = await apiClient.getScenes(galleryIdNum)
      setScenes(scenesData)
    } catch (error) {
      console.error("Error loading scenes:", error)
      toast({
        title: "Error",
        description: "Failed to load scenes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPhotos = async () => {
    if (!selectedSceneId) return

    const sceneIdNum = Number(selectedSceneId)
    if (isNaN(sceneIdNum)) {
      console.error("Invalid scene ID:", selectedSceneId)
      return
    }

    try {
      setLoading(true)
      const photosData = await apiClient.getPhotos(sceneIdNum)
      setPhotos(photosData)
    } catch (error) {
      console.error("Error loading photos:", error)
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleUpload = () => {
    setIsUploadModalOpen(true)
    setSelectedFiles([])
    setUploadProgress(0)
    setUploadedCount(0)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files))
    }
    e.target.value = ""
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0 || !selectedSceneId) return

    const sceneIdNum = Number(selectedSceneId)
    if (isNaN(sceneIdNum)) {
      toast({
        title: "Error",
        description: "Invalid scene selected",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadedCount(0)

    try {
      const uploadedPhotos: Photo[] = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // Update progress
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
        setUploadedCount(i + 1)

        try {
          // Upload file to API
          const uploadedPhoto = await apiClient.uploadPhoto(sceneIdNum, file)
          uploadedPhotos.push(uploadedPhoto)
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error)
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          })
        }
      }

      // Reload photos to get updated list
      await loadPhotos()

      toast({
        title: "Upload Complete",
        description: `${uploadedPhotos.length} photos uploaded successfully`,
      })

      // Close modal and reset state
      setIsUploadModalOpen(false)
      setSelectedFiles([])
      setIsUploading(false)
      setUploadProgress(0)
      setUploadedCount(0)
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Upload Error",
        description: "Failed to upload photos",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  const togglePhotoNames = () => {
    setShowPhotoNames(!showPhotoNames)
  }

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await apiClient.deletePhoto(photoId)
      await loadPhotos() // Reload photos
      toast({
        title: "Photo Deleted",
        description: "Photo has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      })
    }
  }

  const handleSetAsCover = async (photoId: number) => {
    try {
      // Call API to set photo as gallery cover
      await apiClient.setGalleryCover(photoId)
      toast({
        title: "Cover Set",
        description: "Photo has been set as gallery cover",
      })

      // Dispatch event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("coverPhotoUpdated", {
            detail: { galleryId, photoId },
          }),
        )
      }
    } catch (error) {
      console.error("Error setting cover:", error)
      toast({
        title: "Error",
        description: "Failed to set photo as cover",
        variant: "destructive",
      })
    }
  }

  // Check if we have a valid scene selected
  const hasValidScene = selectedSceneId && !isNaN(Number(selectedSceneId))

  if (loading && scenes.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-4">
              <Input value={galleryName || ""} className="text-xl sm:text-2xl font-bold" readOnly />
              <Input type="date" value={shootingDate || ""} readOnly />
              <Button onClick={handleSave} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                Save
              </Button>
            </div>
          ) : (
            <div>
              {scenes.length > 0 && (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                    {hasValidScene && selectedSceneName ? selectedSceneName : galleryName}
                  </h1>
                </>
              )}
            </div>
          )}
        </div>

        {scenes.length > 0 && hasValidScene && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
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
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {photos.length > 0 ? (
        <PhotoGrid
          photos={photos}
          sortBy={sortBy}
          showNames={showPhotoNames}
          onDeletePhoto={handleDeletePhoto}
          onSetAsCover={handleSetAsCover}
          galleryId={galleryId}
        />
      ) : scenes.length === 0 ? (
        <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
          <h3 className="text-lg font-medium mb-2">No scenes available</h3>
          <p className="text-gray-500">Create scenes to organize your photos</p>
        </div>
      ) : !hasValidScene ? (
        <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
          <h3 className="text-lg font-medium mb-2">Select a scene</h3>
          <p className="text-gray-500">Choose a scene from the sidebar to view photos</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No photos in this scene</h3>
          <p className="text-gray-500">Upload photos to get started</p>
        </div>
      )}

      <SimpleModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Photos">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Upload photos to the selected scene</p>

          {/* File Selection */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Drag and drop files here or click to browse</p>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button
                className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse Files
              </Button>
            </label>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])} className="text-gray-500">
                  Clear All
                </Button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading photos...</span>
                <span>
                  {uploadedCount} of {selectedFiles.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#B9FF66] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            {selectedFiles.length > 0 && (
              <Button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
              >
                {isUploading
                  ? "Uploading..."
                  : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? "Photo" : "Photos"}`}
              </Button>
            )}
          </div>
        </div>
      </SimpleModal>
    </div>
  )
}
