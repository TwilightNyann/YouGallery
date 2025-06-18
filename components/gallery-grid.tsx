"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"
import { Loader2 } from "lucide-react"
import Link from "next/link"

type Gallery = {
  id: number
  name: string
  shooting_date: string
  created_at: string
  is_public: boolean
  is_password_protected: boolean
  photo_count: number
  cover_photo_id?: number
  cover_photo_url?: string
}

export default function GalleryGrid() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const data = await apiClient.getGalleries()
        setGalleries(data)
      } catch (error) {
        console.error("Failed to fetch galleries:", error)
        toast({
          title: "Error",
          description: "Failed to load galleries. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleries()
  }, [toast])

  // Listen for cover photo updates
  useEffect(() => {
    const handleCoverUpdated = () => {
      // Refresh galleries when cover is updated
      const fetchGalleries = async () => {
        try {
          const data = await apiClient.getGalleries()
          setGalleries(data)
        } catch (error) {
          console.error("Failed to refresh galleries:", error)
        }
      }
      fetchGalleries()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("coverPhotoUpdated", handleCoverUpdated)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("coverPhotoUpdated", handleCoverUpdated)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Galleries Yet</h2>
        <p className="text-gray-500 mb-6">Create your first gallery to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <Link href={`/galleries/${gallery.id}`} key={gallery.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {gallery.photo_count > 0 ? (
                  <img
                    src={
                      gallery.cover_photo_url || gallery.cover_photo_id
                        ? `/api/photos/${gallery.cover_photo_id}/thumbnail`
                        : `/api/galleries/${gallery.id}/thumbnail`
                    }
                    alt={gallery.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Try fallback thumbnail
                      if (e.currentTarget.src.includes("/thumbnail")) {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                      }
                    }}
                  />
                ) : (
                  <div className="text-gray-400">No photos</div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold truncate">{gallery.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(gallery.shooting_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{gallery.photo_count} photos</span>
                    <div className="flex mt-1">
                      {gallery.is_public && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Public
                        </span>
                      )}
                      {gallery.is_password_protected && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-1">
                          Protected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
