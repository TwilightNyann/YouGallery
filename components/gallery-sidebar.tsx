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
import { toast } from "sonner"

interface Scene {
  id: string
  name: string
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
  // Start with only one scene by default
  const [scenes, setScenes] = useState<Scene[]>([{ id: "1", name: "New Scene" }])
  const [expandedScenes, setExpandedScenes] = useState(true)
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null)
  const [newSceneName, setNewSceneName] = useState("")
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditingGallery, setIsEditingGallery] = useState(false)
  const [editedGalleryName, setEditedGalleryName] = useState(galleryName)
  const [editedShootingDate, setEditedShootingDate] = useState(shootingDate)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
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

  // Load scenes from localStorage when component mounts
  useEffect(() => {
    loadScenes()
  }, [galleryId])

  // Function to load scenes from localStorage
  const loadScenes = () => {
    // Check if scenes were intentionally deleted
    const allScenesDeleted = localStorage.getItem(`gallery-${galleryId}-all-scenes-deleted`) === "true"

    // Initialize with default scene if no scenes exist AND scenes weren't intentionally deleted
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)

    if (!storedScenes || JSON.parse(storedScenes).length === 0) {
      if (!allScenesDeleted) {
        // Only create a default scene if this is a new gallery (not one where all scenes were deleted)
        const defaultScene = { id: "1", name: "New Scene" }
        const initialScenes = [defaultScene]

        // Save to localStorage and state
        localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(initialScenes))
        setScenes(initialScenes)

        // Select the default scene if we're in gallery view
        if (currentView === "gallery" && (!selectedSceneId || selectedSceneId === "")) {
          onSceneSelect(defaultScene.id)
        }
      } else {
        // If all scenes were intentionally deleted, keep the scenes array empty
        setScenes([])
      }
    } else {
      try {
        const parsedScenes = JSON.parse(storedScenes)
        setScenes(parsedScenes)

        // If no scene is selected yet, select the first one
        if (currentView === "gallery" && (!selectedSceneId || selectedSceneId === "")) {
          onSceneSelect(parsedScenes[0].id)
        }
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
      }
    }
  }

  const handleAddScene = () => {
    // Clear the "all scenes deleted" flag when a new scene is added
    localStorage.removeItem(`gallery-${galleryId}-all-scenes-deleted`)

    // Dispatch an event to notify other components that scenes are now available
    if (typeof window !== "undefined") {
      const event = new CustomEvent("scenesAvailable", {
        detail: { galleryId },
      })
      window.dispatchEvent(event)

      // Also dispatch a custom event for scene added
      const sceneAddedEvent = new CustomEvent("sceneAdded")
      window.dispatchEvent(sceneAddedEvent)
    }

    const newScene = {
      id: `scene-${Date.now()}`,
      name: "New Scene",
    }

    // Update local state
    const updatedScenes = [...scenes, newScene]
    setScenes(updatedScenes)

    // Store scenes in localStorage to persist across page navigation
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

    // Don't automatically navigate to the new scene
    toast({
      title: t("gallery.sceneAdded"),
      description: t("gallery.sceneAddedDescription"),
    })
  }

  const handleDeleteClick = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent scene selection when deleting
    e.preventDefault() // Add this to ensure the event doesn't bubble up

    console.log("Delete clicked for scene:", sceneId)
    setSceneToDelete(sceneId)
    setIsDeleteModalOpen(true)
  }

  // Update the handleDeleteScene function to properly handle deleting the active scene
  const handleDeleteScene = () => {
    if (!sceneToDelete) return

    console.log("Deleting scene with ID:", sceneToDelete)

    // Get the current scenes from localStorage to ensure we're working with the latest data
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
    let currentScenes = []

    if (storedScenes) {
      try {
        currentScenes = JSON.parse(storedScenes)
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
        currentScenes = [...scenes] // Fallback to current state
      }
    } else {
      currentScenes = [...scenes] // Fallback to current state
    }

    // Filter out the scene with the specified ID
    const updatedScenes = currentScenes.filter((scene) => scene.id !== sceneToDelete)

    // Log before and after for debugging
    console.log("Before deletion:", currentScenes)
    console.log("After deletion:", updatedScenes)

    // Update state and localStorage
    setScenes(updatedScenes)
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

    // If the deleted scene was selected
    if (selectedSceneId === sceneToDelete) {
      if (updatedScenes.length > 0) {
        // Select the first available scene
        if (currentView === "gallery") {
          onSceneSelect(updatedScenes[0].id)
        }
      } else {
        // No scenes left, notify parent with empty string
        onSceneSelect("")
      }
    }

    // If this was the last scene, trigger a custom event to notify other components
    if (updatedScenes.length === 0) {
      // Set a flag in localStorage to indicate that all scenes were intentionally deleted
      localStorage.setItem(`gallery-${galleryId}-all-scenes-deleted`, "true")

      if (typeof window !== "undefined") {
        const event = new CustomEvent("allScenesDeleted", {
          detail: { galleryId },
        })
        window.dispatchEvent(event)

        // Also dispatch a custom event for scene deleted
        const sceneDeletedEvent = new CustomEvent("sceneDeleted")
        window.dispatchEvent(sceneDeletedEvent)
      }
    } else {
      // Dispatch a custom event for scene deleted
      if (typeof window !== "undefined") {
        const sceneDeletedEvent = new CustomEvent("sceneDeleted")
        window.dispatchEvent(sceneDeletedEvent)
      }
    }

    // Close the modal
    setIsDeleteModalOpen(false)
    setSceneToDelete(null)

    toast({
      title: t("gallery.sceneDeleted"),
      description: t("gallery.sceneDeletedDescription"),
    })
  }

  // Update the handleSaveSceneName function to ensure immediate updates
  const handleSaveSceneName = (sceneId: string) => {
    if (!newSceneName.trim()) {
      // Don't save empty names
      setEditingSceneId(null)
      return
    }

    const updatedScenes = scenes.map((scene) => (scene.id === sceneId ? { ...scene, name: newSceneName } : scene))

    setScenes(updatedScenes)
    setEditingSceneId(null)

    // Update localStorage
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

    // Always notify the parent component about the scene update
    // This ensures the scene name is updated everywhere immediately
    if (sceneId === selectedSceneId) {
      // Force a re-selection to update the scene name in the parent
      onSceneSelect(sceneId)

      // Trigger a custom event to notify other components about the scene name change
      if (typeof window !== "undefined") {
        const event = new CustomEvent("sceneNameChanged", {
          detail: { sceneId, newName: newSceneName },
        })
        window.dispatchEvent(event)
      }
    }
  }

  // Update the handleSceneClick function to ensure proper view switching
  const handleSceneClick = (sceneId: string) => {
    // When clicking on a scene, always switch to gallery view
    if (currentView !== "gallery") {
      onViewChange?.("gallery")

      // Small delay to ensure view change happens before scene selection
      setTimeout(() => {
        onSceneSelect(sceneId)
      }, 10)
    } else {
      // If already in gallery view, just select the scene
      onSceneSelect(sceneId)
    }
  }

  const handleEditScene = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent scene selection when editing
    const scene = scenes.find((s) => s.id === sceneId)
    if (scene) {
      setEditingSceneId(sceneId)
      setNewSceneName(scene.name)
    }
  }

  const handleSaveGalleryDetails = () => {
    onGalleryNameChange(editedGalleryName)
    onShootingDateChange(editedShootingDate)
    setIsEditingGallery(false)

    // Store in localStorage for persistence
    localStorage.setItem(`gallery-${galleryId}-name`, editedGalleryName)
    localStorage.setItem(`gallery-${galleryId}-date`, editedShootingDate)
  }

  const galleryLink =
    typeof window !== "undefined" ? `${window.location.origin}/galleries/${galleryId}` : `/galleries/${galleryId}`

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(galleryLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Always show scenes regardless of view
  const shouldShowScenes = true

  // Get the current scene name if a scene is selected
  const selectedScene = selectedSceneId ? scenes.find((scene) => scene.id === selectedSceneId) : null
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

        {/* Scrollable scenes section - only shown in gallery view */}
        <div className="px-6 overflow-y-auto flex-1">
          {shouldShowScenes && expandedScenes && (
            <div className="pl-7 space-y-2 mb-2">
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  className={`flex items-center group ${selectedSceneId === scene.id ? "bg-[#E3E3E3] rounded" : ""}`}
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
                          selectedSceneId === scene.id ? "font-medium" : ""
                        }`}
                        onClick={() => handleSceneClick(scene.id)}
                      >
                        {scene.name}
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
              ))}
            </div>
          )}

          {/* Always show the Add Scene button in the same position */}
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
