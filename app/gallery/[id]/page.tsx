"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import JSZip from "jszip"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"
import { Heart, Download, ChevronLeft, ChevronRight, X, Menu } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import apiClient from "@/lib/api"

interface Photo {
  id: number
  url: string
  filename: string
  original_filename: string
  caption?: string
  isFavorite?: boolean
  order_index?: number
}

interface Scene {
  id: number
  name: string
  photos: Photo[]
  photo_count?: number
}

interface Gallery {
  id: number
  name: string
  shooting_date: string
  is_public: boolean
  is_password_protected: boolean
  scenes: Scene[]
}

interface GalleryDesign {
  layout: "grid" | "masonry"
  showPhotoNames: boolean
  backgroundColor: string
  cardStyle: "rounded" | "square"
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { t } = useLanguage()
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<string>("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [enteredPassword, setEnteredPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [design, setDesign] = useState<GalleryDesign>({
    layout: "grid",
    showPhotoNames: true,
    backgroundColor: "#FFFFFF",
    cardStyle: "rounded",
  })
  const [userFavorites, setUserFavorites] = useState<Set<number>>(new Set())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")

  // Download states
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState("")

  // Generate session ID for anonymous users
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedSessionId = localStorage.getItem("gallery-session-id")
      if (!storedSessionId) {
        storedSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("gallery-session-id", storedSessionId)
      }
      setSessionId(storedSessionId)
    }
  }, [])

  useEffect(() => {
    loadGalleryData()
  }, [id])

  const loadGalleryData = async () => {
    try {
      setIsLoading(true)
      console.log(`🔍 Loading gallery data for ID: ${id}`)

      // Try to load public gallery data
      const galleryData = await apiClient.getPublicGallery(Number.parseInt(id))
      console.log(`✅ Gallery data loaded:`, galleryData)

      setGallery(galleryData)
      setScenes(galleryData.scenes || [])
      setIsPasswordProtected(galleryData.is_password_protected)

      if (!galleryData.is_password_protected) {
        setIsAuthenticated(true)
        setPhotos(galleryData.scenes?.flatMap((scene: Scene) => scene.photos) || [])
      }

      // Load design settings
      const storedDesign = localStorage.getItem(`gallery-${id}-design`)
      if (storedDesign) {
        try {
          setDesign(JSON.parse(storedDesign))
        } catch (e) {
          console.error("Failed to parse design settings", e)
        }
      }

      // Load user favorites
      await loadUserFavorites()
    } catch (error) {
      console.error("❌ Error loading gallery:", error)

      // Показуємо більш детальну інформацію про помилку
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("❌ Error details:", errorMessage)

      toast.error("Gallery not found", {
        description: `Error: ${errorMessage}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserFavorites = async () => {
    try {
      const favorites = await apiClient.getUserFavorites(sessionId)
      const favoriteIds = new Set(favorites.map((fav: any) => fav.id))
      setUserFavorites(favoriteIds)
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.checkGalleryPassword(Number.parseInt(id), enteredPassword)
      setIsAuthenticated(true)
      setPhotos(scenes.flatMap((scene) => scene.photos))
      toast.success("Access Granted", {
        description: "Welcome to the gallery",
      })
    } catch (error) {
      toast.error("Incorrect Password", {
        description: "Please try again",
      })
    }
  }

  const toggleUserFavorite = async (photoId: number) => {
    try {
      const result = await apiClient.toggleFavorite(photoId, sessionId)

      const newFavorites = new Set(userFavorites)
      if (result.is_favorite) {
        newFavorites.add(photoId)
      } else {
        newFavorites.delete(photoId)
      }
      setUserFavorites(newFavorites)

      toast.success(result.is_favorite ? "Added to favorites" : "Removed from favorites")
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Failed to update favorite")
    }
  }

  const downloadPhoto = (photo: Photo) => {
    // Create a temporary link to download the photo
    const link = document.createElement("a")
    link.href = photo.url
    link.download = photo.original_filename || photo.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadGallery = async () => {
    if (scenes.length === 0) {
      alert("No photos to download")
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)
    setDownloadStatus("Preparing download...")

    try {
      const zip = new JSZip()
      const allPhotos = scenes.flatMap((scene) => scene.photos)
      let downloadedCount = 0

      // Create folders for each scene
      for (const scene of scenes) {
        const sceneFolder = zip.folder(scene.name)

        if (sceneFolder && scene.photos.length > 0) {
          setDownloadStatus(`Processing ${scene.name}...`)

          for (const photo of scene.photos) {
            try {
              // Fetch the image
              const response = await fetch(photo.url)
              if (response.ok) {
                const blob = await response.blob()

                // Get file extension from URL or default to jpg
                const urlParts = photo.url.split(".")
                const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split("?")[0] : "jpg"
                const fileName = `${photo.original_filename || photo.filename}.${extension}`

                // Add to zip
                sceneFolder.file(fileName, blob)

                downloadedCount++
                const progress = (downloadedCount / allPhotos.length) * 90 // Reserve 10% for zip generation
                setDownloadProgress(progress)
                setDownloadStatus(`Downloaded ${downloadedCount} of ${allPhotos.length} photos...`)
              } else {
                console.warn(`Failed to download ${photo.filename}`)
              }
            } catch (error) {
              console.error(`Error downloading ${photo.filename}:`, error)
            }
          }
        }
      }

      setDownloadStatus("Creating zip file...")
      setDownloadProgress(95)

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: "blob" })

      setDownloadStatus("Starting download...")
      setDownloadProgress(100)

      // Create download link
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${gallery?.name.replace(/[^a-z0-9]/gi, "_")}_Gallery.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)

      setDownloadStatus("Download completed!")

      // Reset after a delay
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
        setDownloadStatus("")
      }, 2000)
    } catch (error) {
      console.error("Error creating gallery download:", error)
      setDownloadStatus("Download failed. Please try again.")
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
        setDownloadStatus("")
      }, 3000)
    }
  }

  const downloadCurrentView = async () => {
    const photosToDownload = getDisplayedPhotos()

    if (photosToDownload.length === 0) {
      alert("No photos to download")
      return
    }

    if (photosToDownload.length === 1) {
      // Single photo download
      downloadPhoto(photosToDownload[0])
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)
    setDownloadStatus("Preparing download...")

    try {
      const zip = new JSZip()
      let downloadedCount = 0

      const folderName = showFavorites
        ? "Favorites"
        : selectedScene === "all"
          ? "All_Photos"
          : scenes.find((s) => s.id.toString() === selectedScene)?.name || "Photos"

      setDownloadStatus(`Processing ${folderName}...`)

      for (const photo of photosToDownload) {
        try {
          // Fetch the image
          const response = await fetch(photo.url)
          if (response.ok) {
            const blob = await response.blob()

            // Get file extension from URL or default to jpg
            const urlParts = photo.url.split(".")
            const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split("?")[0] : "jpg"
            const fileName = `${photo.original_filename || photo.filename}.${extension}`

            // Add to zip
            zip.file(fileName, blob)

            downloadedCount++
            const progress = (downloadedCount / photosToDownload.length) * 90
            setDownloadProgress(progress)
            setDownloadStatus(`Downloaded ${downloadedCount} of ${photosToDownload.length} photos...`)
          } else {
            console.warn(`Failed to download ${photo.filename}`)
          }
        } catch (error) {
          console.error(`Error downloading ${photo.filename}:`, error)
        }
      }

      setDownloadStatus("Creating zip file...")
      setDownloadProgress(95)

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: "blob" })

      setDownloadStatus("Starting download...")
      setDownloadProgress(100)

      // Create download link
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${gallery?.name.replace(/[^a-z0-9]/gi, "_")}_${folderName}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)

      setDownloadStatus("Download completed!")

      // Reset after a delay
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
        setDownloadStatus("")
      }, 2000)
    } catch (error) {
      console.error("Error creating download:", error)
      setDownloadStatus("Download failed. Please try again.")
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
        setDownloadStatus("")
      }, 3000)
    }
  }

  const getDisplayedPhotos = () => {
    if (showFavorites) {
      // Show all favorite photos from all scenes
      const allPhotos = scenes.flatMap((scene) => scene.photos)
      return allPhotos
        .filter((photo) => userFavorites.has(photo.id))
        .sort((a, b) => {
          if (a.order_index !== undefined && b.order_index !== undefined) {
            return a.order_index - b.order_index
          }
          return a.id - b.id
        })
    }

    if (selectedScene === "all") {
      return scenes
        .flatMap((scene) => scene.photos)
        .sort((a, b) => {
          if (a.order_index !== undefined && b.order_index !== undefined) {
            return a.order_index - b.order_index
          }
          return a.id - b.id
        })
    }

    const scene = scenes.find((s) => s.id.toString() === selectedScene)
    return scene
      ? scene.photos.sort((a, b) => {
          if (a.order_index !== undefined && b.order_index !== undefined) {
            return a.order_index - b.order_index
          }
          return a.id - b.id
        })
      : []
  }

  // Construct full URL for images
  const getImageUrl = (photo: Photo) => {
    // Якщо URL вже повний (починається з http), використовуємо його
    if (photo.url && photo.url.startsWith("http")) {
      return photo.url
    }

    // Якщо URL відносний, додаємо базовий URL API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    // Якщо URL починається з /api, використовуємо його з базовим URL
    if (photo.url && photo.url.startsWith("/api")) {
      return `${API_BASE_URL}${photo.url}`
    }

    // Fallback - будуємо URL з filename
    return `${API_BASE_URL}/api/photos/view/${photo.filename}`
  }

  const getImageHeight = (index: number) => {
    if (design.layout === "masonry") {
      // Generate consistent random heights for masonry layout
      const heights = [250, 300, 350, 400, 450]
      return heights[index % heights.length]
    }
    return 300
  }

  const getTotalFavorites = () => {
    return scenes.reduce((total, scene) => {
      return total + scene.photos.filter((photo) => userFavorites.has(photo.id)).length
    }, 0)
  }

  const openPhoto = (photo: Photo) => {
    const photos = getDisplayedPhotos()
    const index = photos.findIndex((p) => p.id === photo.id)
    setCurrentPhotoIndex(index)
    setSelectedPhoto(photo)
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    const photos = getDisplayedPhotos()
    let newIndex = currentPhotoIndex

    if (direction === "prev") {
      newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1
    } else {
      newIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0
    }

    setCurrentPhotoIndex(newIndex)
    setSelectedPhoto(photos[newIndex])
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedPhoto) return

    if (e.key === "ArrowLeft") {
      e.preventDefault()
      navigatePhoto("prev")
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      navigatePhoto("next")
    } else if (e.key === "Escape") {
      e.preventDefault()
      setSelectedPhoto(null)
    }
  }

  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedPhoto, currentPhotoIndex])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery Not Found</h1>
          <p className="text-gray-600 mb-4">This gallery may be private or does not exist.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isPasswordProtected && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">{gallery.name}</h1>
          <p className="text-center mb-6">This gallery is password protected</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter gallery password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Access Gallery
            </Button>
          </form>
        </div>
      </div>
    )
  }

  const displayedPhotos = getDisplayedPhotos()

  const getCurrentSceneName = () => {
    if (showFavorites) return "Your Favorite Photos"
    if (selectedScene === "all") return "All Photos"

    const scene = scenes.find((s) => s.id.toString() === selectedScene)
    return scene ? scene.name : "Gallery"
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: design.backgroundColor }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                <div className="font-bold text-xl flex items-center">
                  <div className="mr-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" fill="black" />
                      <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white" />
                    </svg>
                  </div>
                  YouGallery
                </div>
              </Link>

              <div>
                <h1 className="text-xl font-bold">{gallery.name}</h1>
                {gallery.shooting_date && (
                  <p className="text-sm text-gray-500">{format(new Date(gallery.shooting_date), "MMMM d, yyyy")}</p>
                )}
              </div>
            </div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet - Only for mobile */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[85%] max-w-sm p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">{getCurrentSceneName()}</h2>
              <p className="text-sm text-gray-500">
                {showFavorites ? `${getTotalFavorites()} favorite photos` : `${displayedPhotos.length} photos`}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Favorites Toggle */}
              <div className="p-4 border-b">
                <Button
                  variant={showFavorites ? "default" : "outline"}
                  onClick={() => {
                    setShowFavorites(!showFavorites)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full justify-start ${
                    showFavorites ? "bg-[#B9FF66] text-black hover:bg-[#a8eb55]" : ""
                  }`}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites ({getTotalFavorites()})
                </Button>
              </div>

              {/* Scene Navigation */}
              {!showFavorites && scenes.length > 0 && (
                <div className="p-4">
                  <h3 className="font-medium mb-3">Scenes</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedScene === "all" ? "default" : "ghost"}
                      onClick={() => {
                        setSelectedScene("all")
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      All Photos ({scenes.reduce((total, scene) => total + scene.photos.length, 0)})
                    </Button>
                    {scenes.map((scene) => (
                      <Button
                        key={scene.id}
                        variant={selectedScene === scene.id.toString() ? "default" : "ghost"}
                        onClick={() => {
                          setSelectedScene(scene.id.toString())
                          setMobileMenuOpen(false)
                        }}
                        className="w-full justify-start"
                      >
                        {scene.name} ({scene.photos.length})
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Download Actions */}
            <div className="p-4 border-t space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  downloadCurrentView()
                  setMobileMenuOpen(false)
                }}
                disabled={isDownloading || displayedPhotos.length === 0}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download {showFavorites ? "Favorites" : selectedScene === "all" ? "All" : "Scene"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  downloadGallery()
                  setMobileMenuOpen(false)
                }}
                disabled={isDownloading || scenes.length === 0}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Gallery
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4 flex-1">
              {showFavorites && (
                <Button variant="ghost" size="sm" onClick={() => setShowFavorites(false)} className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Gallery
                </Button>
              )}

              {!showFavorites && scenes.length > 0 && (
                <div className="flex-1 overflow-x-auto hidden md:block">
                  <Tabs value={selectedScene} onValueChange={setSelectedScene} className="w-full">
                    <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                      <TabsTrigger value="all" className="whitespace-nowrap">
                        All Photos ({scenes.reduce((total, scene) => total + scene.photos.length, 0)})
                      </TabsTrigger>
                      {scenes.map((scene) => (
                        <TabsTrigger key={scene.id} value={scene.id.toString()} className="whitespace-nowrap">
                          {scene.name} ({scene.photos.length})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              )}

              {/* Mobile Scene Tabs - Only show if not in favorites and has scenes */}
              {!showFavorites && scenes.length > 0 && (
                <div className="md:hidden overflow-x-auto w-full">
                  <div className="flex space-x-2 min-w-max">
                    <Button
                      variant={selectedScene === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedScene("all")}
                      className="whitespace-nowrap"
                    >
                      All ({scenes.reduce((total, scene) => total + scene.photos.length, 0)})
                    </Button>
                    {scenes.map((scene) => (
                      <Button
                        key={scene.id}
                        variant={selectedScene === scene.id.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedScene(scene.id.toString())}
                        className="whitespace-nowrap"
                      >
                        {scene.name} ({scene.photos.length})
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCurrentView}
                disabled={isDownloading || displayedPhotos.length === 0}
                className="hidden md:flex"
              >
                <Download className="h-4 w-4 mr-2" />
                Download {showFavorites ? "Favorites" : selectedScene === "all" ? "All" : "Scene"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={downloadGallery}
                disabled={isDownloading || scenes.length === 0}
                className="hidden md:flex"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Gallery
              </Button>

              <Button
                variant={showFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                className={`hidden md:flex ${showFavorites ? "bg-[#B9FF66] text-black hover:bg-[#a8eb55]" : ""}`}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites ({getTotalFavorites()})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Download Progress Modal */}
      <Dialog open={isDownloading} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Download className="h-6 w-6 text-[#B9FF66]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Downloading Gallery</h3>
              <p className="text-sm text-gray-600 mt-1">{downloadStatus}</p>
            </div>
            <div className="space-y-2">
              <Progress value={downloadProgress} className="w-full" />
              <p className="text-xs text-gray-500">{Math.round(downloadProgress)}% complete</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{getCurrentSceneName()}</h2>
          <p className="text-gray-600">
            {showFavorites
              ? "Photos you've liked from this gallery"
              : selectedScene === "all"
                ? `${displayedPhotos.length} photos across ${scenes.length} scenes`
                : `${displayedPhotos.length} photos in this scene`}
          </p>
        </div>

        {displayedPhotos.length > 0 ? (
          <div
            className={`
              ${
                design.layout === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                  : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
              }
            `}
          >
            {displayedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className={`
                  relative group bg-white shadow-sm hover:shadow-md transition-shadow
                  ${design.cardStyle === "rounded" ? "rounded-lg" : ""}
                  ${design.layout === "masonry" ? "break-inside-avoid mb-4" : ""}
                `}
              >
                <div
                  className="relative overflow-hidden cursor-pointer"
                  style={{
                    height: design.layout === "grid" ? (window.innerWidth < 640 ? 200 : 300) : getImageHeight(index),
                  }}
                  onClick={() => openPhoto(photo)}
                >
                  <Image
                    src={getImageUrl(photo) || "/placeholder.svg"}
                    alt={photo.original_filename || "Gallery photo"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleUserFavorite(photo.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${userFavorites.has(photo.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadPhoto(photo)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* User favorite indicator */}
                  {userFavorites.has(photo.id) && (
                    <div className="absolute top-2 left-2">
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </div>
                  )}
                </div>

                {/* Photo name */}
                {design.showPhotoNames && (
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{photo.original_filename || photo.filename}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No photos yet</h2>
            <p className="text-gray-500">
              {showFavorites
                ? "You haven't liked any photos yet. Click the heart icon on photos to add them to your favorites."
                : "The photographer hasn't uploaded any photos to this gallery yet."}
            </p>
          </div>
        )}
      </main>

      {/* Photo Detail Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 border-0 bg-black/95">
          {selectedPhoto && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation buttons */}
              {getDisplayedPhotos().length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={() => navigatePhoto("prev")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={() => navigatePhoto("next")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Photo */}
              <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                <Image
                  src={getImageUrl(selectedPhoto) || "/placeholder.svg"}
                  alt={selectedPhoto.original_filename || "Gallery photo"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Photo info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">
                      {selectedPhoto.original_filename || selectedPhoto.filename}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <span>
                        {currentPhotoIndex + 1} of {getDisplayedPhotos().length}
                      </span>
                      {userFavorites.has(selectedPhoto.id) && (
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                          <span>Favorite</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleUserFavorite(selectedPhoto.id)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Heart
                        className={`h-4 w-4 ${userFavorites.has(selectedPhoto.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      {userFavorites.has(selectedPhoto.id) ? "Remove" : "Like"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadPhoto(selectedPhoto)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer - Fixed at bottom */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="text-center text-sm text-gray-500">
            <p>
              Powered by{" "}
              <Link href="/" className="text-black hover:text-[#B9FF66]">
                YouGallery
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
