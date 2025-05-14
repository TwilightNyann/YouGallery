"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  const { t } = useLanguage()
  const router = useRouter()

  // Update local state when props change
  useEffect(() => {
    setEditedGalleryName(galleryName)
    setEditedShootingDate(shootingDate)
  }, [galleryName, shootingDate])

  // Load scenes from localStorage when component mounts
  useEffect(() => {
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
    if (storedScenes) {
      try {
        setScenes(JSON.parse(storedScenes))
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
      }
    }
  }, [galleryId])

  const handleAddScene = () => {
    const newScene = {
      id: `scene-${Date.now()}`,
      name: "New Scene",
    }

    // Update local state
    const updatedScenes = [...scenes, newScene]
    setScenes(updatedScenes)

    // Store scenes in localStorage to persist across page navigation
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

    // Select the newly created scene
    if (currentView === "gallery") {
      onSceneSelect(newScene.id)
    } else {
      // Navigate to gallery view with the new scene selected
      router.push(`/galleries/${galleryId}?scene=${newScene.id}`)
    }
  }

  const handleDeleteScene = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent scene selection when deleting
    const updatedScenes = scenes.filter((scene) => scene.id !== sceneId)
    setScenes(updatedScenes)

    // Update localStorage
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

    // If the deleted scene was selected, select the first available scene
    if (selectedSceneId === sceneId && updatedScenes.length > 0) {
      if (currentView === "gallery") {
        onSceneSelect(updatedScenes[0].id)
      }
    }
  }

  const handleSaveSceneName = (sceneId: string) => {
    const updatedScenes = scenes.map((scene) => (scene.id === sceneId ? { ...scene, name: newSceneName } : scene))
    setScenes(updatedScenes)
    setEditingSceneId(null)

    // Update localStorage
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))
  }

  const handleEditScene = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent scene selection when editing
    const scene = scenes.find((s) => s.id === sceneId)
    if (scene) {
      setEditingSceneId(sceneId)
      setNewSceneName(scene.name)
    }
  }

  const handleSceneClick = (sceneId: string) => {
    if (currentView === "gallery") {
      onSceneSelect(sceneId)
    } else {
      // Navigate to gallery view with the selected scene
      router.push(`/galleries/${galleryId}?scene=${sceneId}`)
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

  // Get the current scene name if a scene is selected
  const selectedScene = selectedSceneId ? scenes.find((scene) => scene.id === selectedSceneId) : null
  const displayName = selectedScene ? selectedScene.name : galleryName
  const formattedDate = shootingDate ? format(new Date(shootingDate), "MMMM d, yyyy") : ""

  return (
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
            <h2 className="font-bold text-xl mb-1">{displayName}</h2>
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
      {expandedScenes && (
        <div className="px-6 overflow-y-auto flex-1">
          <div className="pl-7 space-y-2 mb-2">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={`flex items-center group ${selectedSceneId === scene.id ? "bg-[#E3E3E3] rounded" : ""}`}
              >
                {editingSceneId === scene.id ? (
                  <div className="flex items-center space-x-2 w-full pr-2">
                    <Input
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
                        onClick={(e) => handleEditScene(scene.id, e)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleDeleteScene(scene.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <Button variant="ghost" className="text-sm text-[#B9FF66] hover:text-[#a8eb55] pl-7" onClick={handleAddScene}>
            <Plus className="h-4 w-4 mr-1" />
            {t("gallery.addScene")}
          </Button>
        </div>
      )}

      {/* Static navigation section */}
      <div className="p-6 pt-4 border-t border-gray-200 mt-auto">
        <nav className="space-y-2 mb-4">
          <Link
            href={`/galleries/${galleryId}/favorites`}
            className={`flex items-center text-sm hover:text-black ${
              currentView === "favorites" ? "text-black font-medium" : "text-gray-700"
            }`}
          >
            <Heart className="h-4 w-4 mr-2" />
            {t("gallery.favorites")}
          </Link>
          <Link
            href={`/galleries/${galleryId}/design`}
            className={`flex items-center text-sm hover:text-black ${
              currentView === "design" ? "text-black font-medium" : "text-gray-700"
            }`}
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            {t("gallery.design")}
          </Link>
          <Link
            href={`/galleries/${galleryId}/settings`}
            className={`flex items-center text-sm hover:text-black ${
              currentView === "settings" ? "text-black font-medium" : "text-gray-700"
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("gallery.settings")}
          </Link>
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
    </div>
  )
}
