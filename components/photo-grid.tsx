"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Heart, Trash2, MoreVertical, Eye, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { SimpleModal } from "@/components/simple-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Photo {
  id: number
  url: string
  name: string
  isFavorite?: boolean
}

interface PhotoGridProps {
  photos: Photo[]
  sortBy: string
  showNames?: boolean
  onFavoriteToggle?: (photoId: number) => void
  onDeletePhoto?: (photoId: number) => void
  onSetAsCover?: (photoId: number) => void
  galleryId?: string
}

export default function PhotoGrid({
  photos,
  sortBy,
  showNames = false,
  onFavoriteToggle = () => {},
  onDeletePhoto = () => {},
  onSetAsCover = () => {},
  galleryId,
}: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  const { t } = useLanguage()

  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [rightClickedPhoto, setRightClickedPhoto] = useState<Photo | null>(null)

  const sortedPhotos = [...photos].sort((a, b) => {
    if (sortBy === "newest") {
      return b.id - a.id
    } else if (sortBy === "oldest") {
      return a.id - b.id
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  const handleFavoriteToggle = (photo: Photo) => {
    onFavoriteToggle(photo.id)
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

  const handleContextMenu = (e: React.MouseEvent, photo: Photo) => {
    e.preventDefault() // Prevent default browser context menu
    setRightClickedPhoto(photo)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
  }

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuPosition(null)
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleSetAsCover = (photo: Photo) => {
    if (galleryId) {
      // Store the cover photo ID in localStorage
      localStorage.setItem(`gallery-${galleryId}-cover`, photo.id.toString())
      onSetAsCover(photo.id)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {sortedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-[4/3] rounded-lg overflow-hidden group"
            onClick={() => setSelectedPhoto(photo)}
            onContextMenu={(e) => handleContextMenu(e, photo)}
          >
            <Image
              src={photo.url || "/placeholder.svg"}
              alt={photo.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Three dots menu */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/40 border-none hover:bg-black/60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPhoto(photo)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t("gallery.viewPhoto")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFavoriteToggle(photo)
                    }}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${photo.isFavorite ? "fill-[#B9FF66]" : ""}`} />
                    {photo.isFavorite ? t("gallery.removeFromFavorites") : t("gallery.addToFavorites")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetAsCover(photo)
                    }}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {t("gallery.setAsCover")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(photo)
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("gallery.deletePhoto")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Photo name display */}
            {showNames && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
                <p className="text-white text-sm truncate">{photo.name}</p>
              </div>
            )}

            {/* Favorite indicator */}
            {photo.isFavorite && (
              <div className="absolute top-2 left-2">
                <Heart className="h-5 w-5 fill-[#B9FF66] stroke-[#B9FF66]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo detail dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0 sm:p-6">
          {selectedPhoto && (
            <div className="relative aspect-[4/3]">
              <Image
                src={selectedPhoto.url || "/placeholder.svg"}
                alt={selectedPhoto.name}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3 flex justify-between items-center">
                <p className="text-white text-sm">{selectedPhoto.name}</p>
                {selectedPhoto.isFavorite && <Heart className="h-5 w-5 fill-[#B9FF66] stroke-[#B9FF66]" />}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <SimpleModal
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        title={t("gallery.deletePhotoTitle")}
      >
        <div className="space-y-4">
          <p>{t("gallery.deletePhotoConfirmation")}</p>
          <p className="font-medium">{photoToDelete?.name}</p>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>
              {t("gallery.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("gallery.delete")}
            </Button>
          </div>
        </div>
      </SimpleModal>

      {/* Context Menu */}
      {contextMenuPosition && rightClickedPhoto && (
        <div
          className="fixed z-50 bg-white rounded-md shadow-md py-1 border border-gray-200 w-48"
          style={{
            top: `${Math.min(contextMenuPosition.y, window.innerHeight - 200)}px`,
            left: `${Math.min(contextMenuPosition.x, window.innerWidth - 150)}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100"
            onClick={() => {
              setSelectedPhoto(rightClickedPhoto)
              setContextMenuPosition(null)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            {t("gallery.viewPhoto")}
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100"
            onClick={() => {
              handleFavoriteToggle(rightClickedPhoto)
              setContextMenuPosition(null)
            }}
          >
            <Heart className={`mr-2 h-4 w-4 ${rightClickedPhoto.isFavorite ? "fill-[#B9FF66]" : ""}`} />
            {rightClickedPhoto.isFavorite ? t("gallery.removeFromFavorites") : t("gallery.addToFavorites")}
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100"
            onClick={() => {
              handleSetAsCover(rightClickedPhoto)
              setContextMenuPosition(null)
            }}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {t("gallery.setAsCover")}
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 text-red-600"
            onClick={() => {
              handleDeleteClick(rightClickedPhoto)
              setContextMenuPosition(null)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("gallery.deletePhoto")}
          </button>
        </div>
      )}
    </>
  )
}
