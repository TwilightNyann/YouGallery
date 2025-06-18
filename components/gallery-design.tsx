"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Grid,
  LayoutGrid,
  Eye,
  Type,
  Palette,
  Square,
  SquareUserRoundIcon as RoundedCorner,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface GalleryDesign {
  layout: "grid" | "masonry"
  showPhotoNames: boolean
  backgroundColor: string
  cardStyle: "rounded" | "square"
}

interface GalleryDesignProps {
  galleryId: string
  galleryName: string
  shootingDate: string
}

export default function GalleryDesign({ galleryId, galleryName, shootingDate }: GalleryDesignProps) {
  const { t } = useLanguage()
  const [design, setDesign] = useState<GalleryDesign>({
    layout: "grid",
    showPhotoNames: true,
    backgroundColor: "#FFFFFF",
    cardStyle: "rounded",
  })

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [mockupPhotos] = useState([
    {
      id: 1,
      name: "Sunset Beach",
      url: "/placeholder.svg?height=400&width=600",
      isFavorite: true,
    },
    {
      id: 2,
      name: "Mountain Vista",
      url: "/placeholder.svg?height=500&width=600",
      isFavorite: false,
    },
    {
      id: 3,
      name: "City Lights",
      url: "/placeholder.svg?height=350&width=600",
      isFavorite: true,
    },
    {
      id: 4,
      name: "Forest Path",
      url: "/placeholder.svg?height=450&width=600",
      isFavorite: false,
    },
    {
      id: 5,
      name: "Ocean Waves",
      url: "/placeholder.svg?height=300&width=600",
      isFavorite: true,
    },
    {
      id: 6,
      name: "Desert Dunes",
      url: "/placeholder.svg?height=400&width=600",
      isFavorite: false,
    },
  ])

  useEffect(() => {
    const storedDesign = localStorage.getItem(`gallery-${galleryId}-design`)
    if (storedDesign) {
      try {
        setDesign(JSON.parse(storedDesign))
      } catch (e) {
        console.error("Failed to parse design settings", e)
      }
    }
  }, [galleryId])

  const handleSaveDesign = () => {
    localStorage.setItem(`gallery-${galleryId}-design`, JSON.stringify(design))
    toast.success("Design Saved", {
      description: "Gallery design has been saved successfully",
    })
  }

  const updateDesign = (updates: Partial<GalleryDesign>) => {
    setDesign((prev) => ({ ...prev, ...updates }))
  }

  const getPreviewUrl = () => {
    return typeof window !== "undefined" ? `${window.location.origin}/gallery/${galleryId}` : `/gallery/${galleryId}`
  }

  const handlePreviewGallery = () => {
    const previewUrl = getPreviewUrl()
    window.open(previewUrl, "_blank")
  }

  const getImageHeight = (index: number) => {
    if (design.layout === "masonry") {
      const heights = [200, 250, 300, 350, 400]
      return heights[index % heights.length]
    }
    return 200
  }

  const getDeviceClass = () => {
    switch (previewDevice) {
      case "mobile":
        return "w-[375px] h-[667px]"
      case "tablet":
        return "w-[768px] h-[1024px]"
      default:
        return "w-full h-[600px]"
    }
  }

  const getGridCols = () => {
    if (previewDevice === "mobile") {
      return design.layout === "grid" ? "grid-cols-1" : "columns-1"
    }
    if (previewDevice === "tablet") {
      return design.layout === "grid" ? "grid-cols-2" : "columns-2"
    }
    return design.layout === "grid" ? "grid-cols-3" : "columns-3"
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gallery Design</h1>
            <p className="text-gray-600">Customize how your gallery appears to visitors</p>
          </div>

          <div className="w-full">
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LayoutGrid className="h-5 w-5 mr-2" />
                    Layout Style
                  </CardTitle>
                  <CardDescription>Choose how photos are arranged</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateDesign({ layout: "grid" })}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        design.layout === "grid"
                          ? "border-[#B9FF66] bg-[#B9FF66]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Grid className="h-6 w-6" />
                      <span className="text-sm font-medium">Grid</span>
                      <span className="text-xs text-gray-500">Equal sized photos</span>
                    </button>

                    <button
                      onClick={() => updateDesign({ layout: "masonry" })}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        design.layout === "masonry"
                          ? "border-[#B9FF66] bg-[#B9FF66]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <LayoutGrid className="h-6 w-6" />
                      <span className="text-sm font-medium">Masonry</span>
                      <span className="text-xs text-gray-500">Pinterest-style</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Square className="h-5 w-5 mr-2" />
                    Card Style
                  </CardTitle>
                  <CardDescription>Choose the shape of photo cards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateDesign({ cardStyle: "rounded" })}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        design.cardStyle === "rounded"
                          ? "border-[#B9FF66] bg-[#B9FF66]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RoundedCorner className="h-6 w-6" />
                      <span className="text-sm font-medium">Rounded</span>
                    </button>

                    <button
                      onClick={() => updateDesign({ cardStyle: "square" })}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        design.cardStyle === "square"
                          ? "border-[#B9FF66] bg-[#B9FF66]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Square className="h-6 w-6" />
                      <span className="text-sm font-medium">Square</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Display Options
                  </CardTitle>
                  <CardDescription>Control what information is shown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Type className="h-4 w-4" />
                      <Label htmlFor="show-names">Show photo names</Label>
                    </div>
                    <Switch
                      id="show-names"
                      checked={design.showPhotoNames}
                      onCheckedChange={(checked) => updateDesign({ showPhotoNames: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Background Color
                  </CardTitle>
                  <CardDescription>Set the page background color</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={design.backgroundColor}
                      onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={design.backgroundColor}
                      onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {["#FFFFFF", "#F3F3F3", "#E5E5E5", "#1E1E1E", "#B9FF66"].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateDesign({ backgroundColor: color })}
                        className={`w-full h-8 rounded border-2 ${
                          design.backgroundColor === color ? "border-gray-400" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleSaveDesign} className="w-full bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
              Save Design
            </Button>

            <Button variant="outline" className="w-full" onClick={handlePreviewGallery}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Gallery
            </Button>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Live Preview</h2>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-2 rounded ${previewDevice === "desktop" ? "bg-[#B9FF66]" : "bg-gray-100"}`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-2 rounded ${previewDevice === "tablet" ? "bg-[#B9FF66]" : "bg-gray-100"}`}
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-2 rounded ${previewDevice === "mobile" ? "bg-[#B9FF66]" : "bg-gray-100"}`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className={`${getDeviceClass()} border rounded-lg overflow-hidden shadow-lg bg-white`}
                style={{ backgroundColor: design.backgroundColor }}
              >
                <div className="bg-white border-b p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm">{galleryName}</h3>
                      <p className="text-xs text-gray-500">Preview Mode</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-b p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="px-2 py-1 bg-[#B9FF66] rounded text-xs">All</div>
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs">Landscape</div>
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs">Nature</div>
                    </div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">♥ 3</div>
                  </div>
                </div>

                <div className="p-3 overflow-y-auto" style={{ height: previewDevice === "mobile" ? "500px" : "400px" }}>
                  <div
                    className={`
                      ${design.layout === "grid" ? `grid ${getGridCols()} gap-2` : `${getGridCols()} gap-2 space-y-2`}
                    `}
                  >
                    {mockupPhotos.slice(0, previewDevice === "mobile" ? 4 : 6).map((photo, index) => (
                      <div
                        key={photo.id}
                        className={`
                          relative overflow-hidden bg-white shadow-sm group
                          ${design.cardStyle === "rounded" ? "rounded-lg" : ""}
                          ${design.layout === "masonry" ? "break-inside-avoid mb-2" : ""}
                        `}
                      >
                        <div
                          className="relative bg-gray-200"
                          style={{
                            height:
                              design.layout === "grid"
                                ? previewDevice === "mobile"
                                  ? 120
                                  : 100
                                : getImageHeight(index) * 0.6,
                          }}
                        >
                          <Image src={photo.url || "/placeholder.svg"} alt={photo.name} fill className="object-cover" />

                          <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                              <div
                                className={`w-2 h-2 ${photo.isFavorite ? "bg-red-500" : "bg-gray-400"}`}
                                style={{
                                  clipPath:
                                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                                }}
                              />
                            </div>
                            <div className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-400" />
                            </div>
                          </div>

                          {photo.isFavorite && (
                            <div className="absolute top-1 left-1">
                              <div
                                className="w-3 h-3 bg-red-500"
                                style={{
                                  clipPath:
                                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {design.showPhotoNames && (
                          <div className="p-2">
                            <p className="text-xs font-medium truncate">{photo.name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-t p-2 text-center">
                  <p className="text-xs text-gray-500">Powered by YouGallery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
