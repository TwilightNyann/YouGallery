"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"
import { Eye, ImageIcon, HardDrive, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + " B"
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB"
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }
}

// Mock data for galleries
const mockGalleries = [
  {
    id: 1,
    title: "Nature Collection",
    date: "2024-03-05",
    photos: 32,
    uploadedPhotos: 45, // Total uploaded (some might be deleted)
    views: 245,
    size: 1.2 * 1024 * 1024 * 1024, // 1.2 GB in bytes
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Urban Landscapes",
    date: "2024-03-04",
    photos: 24,
    uploadedPhotos: 30,
    views: 187,
    size: 850 * 1024 * 1024, // 850 MB in bytes
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Portrait Series",
    date: "2024-03-03",
    photos: 45,
    uploadedPhotos: 52,
    views: 320,
    size: 1.5 * 1024 * 1024 * 1024, // 1.5 GB in bytes
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Abstract Art",
    date: "2024-03-02",
    photos: 18,
    uploadedPhotos: 25,
    views: 156,
    size: 450 * 1024 * 1024, // 450 MB in bytes
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Travel Memories",
    date: "2024-03-01",
    photos: 64,
    uploadedPhotos: 80,
    views: 278,
    size: 2.3 * 1024 * 1024 * 1024, // 2.3 GB in bytes
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Family Gathering",
    date: "2024-02-28",
    photos: 42,
    uploadedPhotos: 50,
    views: 195,
    size: 1.1 * 1024 * 1024 * 1024, // 1.1 GB in bytes
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function GalleryStatistics() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [galleryCoverPhotos, setGalleryCoverPhotos] = useState<{ [key: string]: string }>({})

  // Add this useEffect to load cover photos
  useEffect(() => {
    // Load cover photos for each gallery
    const coverPhotos: { [key: string]: string } = {}

    mockGalleries.forEach((gallery) => {
      const coverId = localStorage.getItem(`gallery-${gallery.id}-cover`)
      if (coverId) {
        // Find the photo URL in the gallery's photos
        const storedPhotosByScene = localStorage.getItem(`gallery-${gallery.id}-photos`)
        if (storedPhotosByScene) {
          try {
            const photosByScene = JSON.parse(storedPhotosByScene)
            // Look through all scenes for the photo
            Object.values(photosByScene).forEach((photos: any[]) => {
              const coverPhoto = photos.find((photo) => photo.id.toString() === coverId)
              if (coverPhoto) {
                coverPhotos[gallery.id] = coverPhoto.url
              }
            })
          } catch (e) {
            console.error("Failed to parse stored photos", e)
          }
        }
      }
    })

    setGalleryCoverPhotos(coverPhotos)
  }, [])

  // Filter galleries based on search term
  const filteredGalleries = mockGalleries.filter((gallery) =>
    gallery.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">{t("gallery.statistics")}</h2>
        <Input
          className="w-full sm:max-w-xs"
          placeholder={t("gallery.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGalleries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("gallery.noGalleriesFound")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGalleries.map((gallery) => (
            <Card key={gallery.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full md:w-48 h-auto md:h-48 relative">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:rounded-none md:rounded-l-lg">
                      <img
                        src={galleryCoverPhotos[gallery.id] || gallery.thumbnail || "/placeholder.svg"}
                        alt={gallery.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold">{gallery.title}</h3>
                      <p className="text-gray-500 text-sm">{format(new Date(gallery.date), "MMMM d, yyyy")}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-blue-100 mr-2 md:mr-3">
                          <ImageIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-semibold">{gallery.photos}</p>
                          <p className="text-xs text-gray-500">{t("gallery.photos")}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-amber-100 mr-2 md:mr-3">
                          <Upload className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-semibold">{gallery.uploadedPhotos}</p>
                          <p className="text-xs text-gray-500">{t("gallery.uploadedPhotos")}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-green-100 mr-2 md:mr-3">
                          <Eye className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-semibold">{gallery.views}</p>
                          <p className="text-xs text-gray-500">{t("gallery.views")}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-purple-100 mr-2 md:mr-3">
                          <HardDrive className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-semibold">{formatFileSize(gallery.size)}</p>
                          <p className="text-xs text-gray-500">{t("gallery.size")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
