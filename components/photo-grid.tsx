"use client"

import { useState } from "react"
import { MoreVertical, Heart, Trash2, Download, Eye, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SimpleModal } from "@/components/simple-modal"
import { useLanguage } from "@/contexts/language-context"

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

interface PhotoGridProps {
  photos: Photo[]
  sortBy: string
  showNames: boolean
  onDeletePhoto: (photoId: number) => void
  onSetAsCover: (photoId: number) => void
  galleryId: string
}

export default function PhotoGrid({ photos, sortBy, showNames, onDeletePhoto, onSetAsCover }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const { t } = useLanguage()

  // Get API base URL for constructing full image URLs
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Sort photos based on sortBy prop
  const sortedPhotos = [...photos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "name":
        return a.original_filename.localeCompare(b.original_filename)
      default:
        return 0
    }
  })

  // Construct full URL for images
  const getImageUrl = (photo: Photo) => {
    if (photo.url.startsWith("http")) {
      return photo.url
    }
    // Construct full URL with API base
    return `${API_BASE_URL}${photo.url}`
  }

  const handleImageError = (photoId: number, url: string) => {
    console.error(`Failed to load image: ${url}`)
    setImageErrors((prev) => new Set([...prev, photoId]))
  }

  const handleImageLoad = (photoId: number, url: string) => {
    console.log(`Successfully loaded image: ${url}`)
    setImageErrors((prev) => {
      const newSet = new Set(prev)
      newSet.delete(photoId)
      return newSet
    })
  }

  const handleDownload = async (photo: Photo) => {
    try {
      const imageUrl = getImageUrl(photo)
      const headers: HeadersInit = {}

      // Add ngrok header if using ngrok
      if (API_BASE_URL.includes("ngrok")) {
        headers["ngrok-skip-browser-warning"] = "true"
      }

      const response = await fetch(imageUrl, { headers })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = photo.original_filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading photo:", error)
      alert("Failed to download photo. Please try again.")
    }
  }

  const handleDeleteClick = (photo: Photo) => {
    setPhotoToDelete(photo)
  }

  const confirmDelete = () => {
    if (photoToDelete) {
      onDeletePhoto(photoToDelete.id)
      setPhotoToDelete(null)
    }
  }

  const handleSetAsCover = (photo: Photo) => {
    console.log(`🖼️ PhotoGrid: Setting photo ${photo.id} as cover`)
    onSetAsCover(photo.id)
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-[#F3F3F3] rounded-lg">
        <p className="text-gray-500">No photos in this scene</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sortedPhotos.map((photo) => {
          const imageUrl = getImageUrl(photo)
          return (
            <div
              key={photo.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                {imageErrors.has(photo.id) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Image not found</p>
                      <p className="text-xs text-gray-400 mt-1">{photo.filename}</p>
                      <p className="text-xs text-gray-400 mt-1">URL: {imageUrl}</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={photo.original_filename}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(photo.id, imageUrl)}
                    onLoad={() => handleImageLoad(photo.id, imageUrl)}
                    crossOrigin="anonymous"
                  />
                )}

                {/* Actions menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-black/40 hover:bg-black/60 text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedPhoto(photo)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Photo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(photo)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetAsCover(photo)}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Set as Cover
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(photo)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Favorite indicator */}
                {photo.isFavorite && (
                  <div className="absolute bottom-2 right-2">
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </div>
                )}
              </div>

              {/* Photo name */}
              {showNames && (
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate" title={photo.original_filename}>
                    {photo.original_filename}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Photo detail dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0 sm:p-6">
          {selectedPhoto && (
            <div className="relative aspect-[4/3]">
              {imageErrors.has(selectedPhoto.id) ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Image not available</p>
                    <p className="text-sm text-gray-400 mt-2">{selectedPhoto.filename}</p>
                    <p className="text-sm text-gray-400 mt-2">URL: {getImageUrl(selectedPhoto)}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={getImageUrl(selectedPhoto) || "/placeholder.svg"}
                  alt={selectedPhoto.original_filename}
                  className="w-full h-full object-contain"
                  onError={() => handleImageError(selectedPhoto.id, getImageUrl(selectedPhoto))}
                  onLoad={() => handleImageLoad(selectedPhoto.id, getImageUrl(selectedPhoto))}
                  crossOrigin="anonymous"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3 flex justify-between items-center">
                <p className="text-white text-sm">{selectedPhoto.original_filename}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <SimpleModal isOpen={!!photoToDelete} onClose={() => setPhotoToDelete(null)} title="Delete Photo">
        <div className="space-y-4">
          <p>Are you sure you want to delete this photo?</p>
          <p className="font-medium">{photoToDelete?.original_filename}</p>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </SimpleModal>
    </>
  )
}
