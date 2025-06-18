"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ImageIcon } from "lucide-react"
import apiClient from "@/lib/api"

interface Gallery {
  id: number
  name: string
  shooting_date: string
  is_public: boolean
  is_password_protected: boolean
  created_at: string
  view_count?: number
  scenes?: Array<{
    id: number
    name: string
    photos?: Array<{
      id: number
      file_size: number
    }>
  }>
}

export default function GalleryStatistics() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    try {
      setIsLoading(true)
      const galleriesData = await apiClient.getGalleries()

      // Get detailed info for each gallery
      const galleriesWithDetails = await Promise.all(
        galleriesData.map(async (gallery: any) => {
          try {
            const galleryDetails = await apiClient.getGallery(gallery.id)
            return {
              ...gallery,
              scenes: galleryDetails.scenes || [],
              view_count: galleryDetails.view_count || 0,
            }
          } catch (error) {
            console.error(`Error loading gallery ${gallery.id} details:`, error)
            return {
              ...gallery,
              scenes: [],
              view_count: 0,
            }
          }
        }),
      )

      setGalleries(galleriesWithDetails)
    } catch (error) {
      console.error("Failed to load galleries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredGalleries = galleries.filter((gallery) => gallery.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getPhotoCount = (gallery: Gallery) => {
    if (!gallery.scenes) return 0
    return gallery.scenes.reduce((total, scene) => {
      return total + (scene.photos?.length || 0)
    }, 0)
  }

  const getStorageSize = (gallery: Gallery) => {
    if (!gallery.scenes) return "0 MB"

    const totalBytes = gallery.scenes.reduce((total, scene) => {
      if (!scene.photos) return total
      return (
        total +
        scene.photos.reduce((sceneTotal, photo) => {
          return sceneTotal + (photo.file_size || 0)
        }, 0)
      )
    }, 0)

    const totalMB = totalBytes / (1024 * 1024)
    if (totalMB < 1) {
      return `${Math.round(totalBytes / 1024)} KB`
    } else if (totalMB < 1024) {
      return `${totalMB.toFixed(1)} MB`
    } else {
      return `${(totalMB / 1024).toFixed(2)} GB`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold">Gallery Statistics</h2>
          <Input className="w-full sm:max-w-xs" placeholder="Search galleries..." disabled />
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Gallery Statistics</h2>
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Search galleries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGalleries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No galleries found</h3>
          <p className="text-gray-500">
            {galleries.length === 0
              ? "Create your first gallery to see statistics here"
              : "No galleries match your search criteria"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGalleries.map((gallery) => (
            <Card key={gallery.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{gallery.name}</h3>
                  <p className="text-gray-500 text-sm">Created: {new Date(gallery.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-sm">
                    Shooting date: {new Date(gallery.shooting_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{getPhotoCount(gallery)}</p>
                    <p className="text-sm text-gray-500">Photos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{gallery.view_count || 0}</p>
                    <p className="text-sm text-gray-500">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{gallery.is_public ? "Public" : "Private"}</p>
                    <p className="text-sm text-gray-500">Visibility</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{getStorageSize(gallery)}</p>
                    <p className="text-sm text-gray-500">Storage</p>
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
