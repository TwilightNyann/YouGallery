"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ImageIcon,
  Heart,
  Paintbrush,
  Settings,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  LinkIcon,
  Copy,
  Check,
  Edit2,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { SimpleModal } from "@/components/simple-modal"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"

interface Scene {
  id: number
  name: string
  order_index: number
  gallery_id: number
  photo_count?: number
}

interface GallerySidebarProps {
  galleryId: string
  galleryName: string
  shootingDate: string
  onSceneSelect?: (sceneId: string) => void
  selectedSceneId?: string | null
  currentView?: "gallery" | "favorites" | "design" | "settings"
  onGalleryNameChange?: (name: string) => void
  onShootingDateChange?: (date: string) => void
  onViewChange?: (view: string) => void
}

export default function GallerySidebar({
  galleryId,
  galleryName,
  shootingDate,
  onSceneSelect = () => {},
  selectedSceneId = null,
  currentView = "gallery",
  onGalleryNameChange = () => {},
  onShootingDateChange = () => {},
  onViewChange = () => {},
}: GallerySidebarProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [expandedScenes, setExpandedScenes] = useState(true)
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null)
  const [newSceneName, setNewSceneName] = useState("")
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditingGallery, setIsEditingGallery] = useState(false)
  const [editedGalleryName, setEditedGalleryName] = useState(galleryName)
  const [editedShootingDate, setEditedShootingDate] = useState(shootingDate)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  // Update local state when props change
  useEffect(() => {
    setEditedGalleryName(galleryName)
    setEditedShootingDate(shootingDate)
  }, [galleryName, shootingDate])

  // Focus input when editing starts
  useEffect(() => {
    if (editingSceneId && editInputRef.current) {
      setTimeout(() => {
        if (editInputRef.current) {
          editInputRef.current.focus()
          editInputRef.current.select()
        }
      }, 50)
    }
  }, [editingSceneId])

  // Load scenes from API when component mounts
  useEffect(() => {
    if (galleryId) {
      loadScenes()
    }
  }, [galleryId])

  const loadScenes = async () => {
    try {
      setIsLoading(true)
      const scenesData = await apiClient.getScenes(Number.parseInt(galleryId))
      console.log("Loaded scenes for gallery", galleryId, ":", scenesData)
      setScenes(scenesData)

      // If no scene is selected and we have scenes, select the first one
      if (!selectedSceneId && scenesData.length > 0 && currentView === "gallery") {
        onSceneSelect(scenesData[0].id.toString())
      }
    } catch (error) {
      console.error("Error loading scenes:", error)
      toast({
        title: "Error",
        description: "Failed to load scenes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddScene = async () => {
    try {
      const newScene = await apiClient.createScene(Number.parseInt(galleryId), {
        name: `Scene ${scenes.length + 1}`,
      })
      console.log("Created new scene:", newScene)
      await loadScenes() // Reload scenes
      onSceneSelect(newScene.id.toString()) // Select the new scene
      toast({
        title: "Success",
        description: "Scene created successfully!",
      })
    } catch (error) {
      console.error("Error creating scene:", error)
      toast({
        title: "Error",
        description: "Failed to create scene",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (sceneId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("Delete clicked for scene:", sceneId)
    setSceneToDelete(sceneId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteScene = async () => {
    if (!sceneToDelete) return

    try {
      await apiClient.deleteScene(sceneToDelete)
      await loadScenes()

      // If the deleted scene was selected, clear selection
      if (selectedSceneId === sceneToDelete.toString()) {
        onSceneSelect("")
      }

      toast({
        title: "Success",
        description: "Scene deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting scene:", error)
      toast({
        title: "Error",
        description: "Failed to delete scene",
        variant: "destructive",
      })
    }

    setIsDeleteModalOpen(false)
    setSceneToDelete(null)
  }

  const handleSaveSceneName = async (sceneId: number) => {
    if (!newSceneName.trim()) {
      setEditingSceneId(null)
      return
    }

    try {
      await apiClient.updateScene(sceneId, { name: newSceneName })
      await loadScenes()
      setEditingSceneId(null)
      setNewSceneName("")

      // Диспетчер події для оновлення імені сцени в інших компонентах
      if (typeof window !== "undefined") {
        const event = new CustomEvent("sceneNameChanged", {
          detail: { sceneId, newName: newSceneName },
        })
        window.dispatchEvent(event)
      }

      toast({
        title: "Success",
        description: "Scene name updated successfully!",
      })
    } catch (error) {
      console.error("Error updating scene:", error)
      toast({
        title: "Error",
        description: "Failed to update scene name",
        variant: "destructive",
      })
    }
  }

  const handleSceneClick = (sceneId: number) => {
    // When clicking on a scene, always switch to gallery view
    if (currentView !== "gallery") {
      onViewChange?.("gallery")
      setTimeout(() => {
        onSceneSelect(sceneId.toString())
      }, 10)
    } else {
      onSceneSelect(sceneId.toString())
    }
  }

  const handleEditScene = (sceneId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const scene = scenes.find((s) => s.id === sceneId)
    if (scene) {
      setEditingSceneId(sceneId)
      setNewSceneName(scene.name)
    }
  }

  const handleSaveGalleryDetails = async () => {
    try {
      await Promise.all([onGalleryNameChange(editedGalleryName), onShootingDateChange(editedShootingDate)])
      setIsEditingGallery(false)

      // Диспетчер події для оновлення галереї в інших компонентах
      if (typeof window !== "undefined") {
        const event = new CustomEvent("galleryUpdated", {
          detail: {
            galleryId,
            name: editedGalleryName,
            shooting_date: editedShootingDate,
          },
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error("Error updating gallery details:", error)
    }
  }

  // Generate public gallery link
  const galleryLink =
    typeof window !== "undefined" ? `${window.location.origin}/gallery/${galleryId}` : `/gallery/${galleryId}`

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(galleryLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Link Copied!",
        description: "Gallery link has been copied to clipboard",
      })
    })
  }

  const shouldShowScenes = true
  const selectedScene = selectedSceneId ? scenes.find((scene) => scene.id.toString() === selectedSceneId) : null
  const formattedDate = shootingDate ? format(new Date(shootingDate), "MMMM d, yyyy") : ""

  return (
    <>
      <div className="w-64 bg-[#F3F3F3] flex flex-col h-full">
        {/* Header section */}
        <div className="p-6 pb-2">
          {isEditingGallery ? (
            <div className="mb-4 space-y-3">
              <Input
                value={editedGalleryName}
                onChange={(e) => setEditedGalleryName(e.target.value)}
                className="font-bold text-lg"
                placeholder="Gallery name"
              />
              <Input
                type="date"
                value={editedShootingDate}
                onChange={(e) => setEditedShootingDate(e.target.value)}
                className="text-sm"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
                  onClick={handleSaveGalleryDetails}
                >
                  {t("gallery.save")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-4 group relative">
              <h2 className="font-bold text-xl mb-1">{galleryName}</h2>
              <p className="text-sm text-gray-500">{formattedDate}</p>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditingGallery(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <button
            className="flex items-center text-sm font-medium mb-2"
            onClick={() => setExpandedScenes(!expandedScenes)}
          >
            {expandedScenes ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
            <ImageIcon className="h-4 w-4 mr-2" />
            {t("gallery.scenes")}
          </button>
        </div>

        {/* Scrollable scenes section */}
        <div className="px-6 overflow-y-auto flex-1">
          {shouldShowScenes && expandedScenes && (
            <div className="pl-7 space-y-2 mb-2">
              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Loading scenes...</p>
                </div>
              ) : (
                scenes.map((scene) => (
                  <div
                    key={scene.id}
                    className={`flex items-center group ${
                      selectedSceneId === scene.id.toString() ? "bg-[#E3E3E3] rounded" : ""
                    }`}
                  >
                    {editingSceneId === scene.id ? (
                      <div className="flex items-center space-x-2 w-full pr-2 py-1 mt-1">
                        <Input
                          ref={editInputRef}
                          value={newSceneName}
                          onChange={(e) => setNewSceneName(e.target.value)}
                          className="h-7 text-sm"
                          autoFocus
                          onBlur={() => handleSaveSceneName(scene.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveSceneName(scene.id)
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <button
                          className={`text-sm flex-1 text-left px-2 py-1 hover:text-[#B9FF66] cursor-pointer ${
                            selectedSceneId === scene.id.toString() ? "font-medium" : ""
                          }`}
                          onClick={() => handleSceneClick(scene.id)}
                        >
                          {scene.name}
                          {scene.photo_count !== undefined && (
                            <span className="text-xs text-gray-400 ml-1">({scene.photo_count})</span>
                          )}
                        </button>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditScene(scene.id, e)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => handleDeleteClick(scene.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <Button variant="ghost" className="text-sm text-[#B9FF66] hover:text-[#a8eb55] pl-7" onClick={handleAddScene}>
            <Plus className="h-4 w-4 mr-1" />
            {t("gallery.addScene")}
          </Button>
        </div>

        {/* Static navigation section */}
        <div className={`p-6 pt-4 border-t border-gray-200 ${shouldShowScenes ? "mt-auto" : "mt-4 flex-1"}`}>
          <nav className="space-y-2 mb-4">
            <button
              onClick={() => onViewChange?.("favorites")}
              className={`flex items-center text-sm hover:text-black ${
                currentView === "favorites" ? "text-black font-medium" : "text-gray-700"
              }`}
            >
              <Heart className="h-4 w-4 mr-2" />
              {t("gallery.favorites")}
            </button>
            <button
              onClick={() => onViewChange?.("design")}
              className={`flex items-center text-sm hover:text-black ${
                currentView === "design" ? "text-black font-medium" : "text-gray-700"
              }`}
            >
              <Paintbrush className="h-4 w-4 mr-2" />
              {t("gallery.design")}
            </button>
            <button
              onClick={() => onViewChange?.("settings")}
              className={`flex items-center text-sm hover:text-black ${
                currentView === "settings" ? "text-black font-medium" : "text-gray-700"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              {t("gallery.settings")}
            </button>
          </nav>

          {/* Copy Link Button */}
          <div className="pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-sm"
              onClick={() => setIsLinkModalOpen(true)}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {t("gallery.copyLink")}
            </Button>
          </div>
        </div>
      </div>

      {/* Share Link Modal */}
      <SimpleModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title={t("gallery.shareGallery")}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{t("gallery.shareLinkDescription")}</p>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                value={galleryLink}
                readOnly
                className="pr-10 text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-gray-500"
                onClick={copyLinkToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]" onClick={() => setIsLinkModalOpen(false)}>
              {t("gallery.ok")}
            </Button>
          </div>
        </div>
      </SimpleModal>

      {/* Delete Scene Confirmation Modal */}
      <SimpleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("gallery.deleteScene")}
      >
        <div className="space-y-4">
          <p>{t("gallery.deleteSceneConfirmation")}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              {t("gallery.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteScene}>
              {t("gallery.delete")}
            </Button>
          </div>
        </div>
      </SimpleModal>
    </>
  )
}
