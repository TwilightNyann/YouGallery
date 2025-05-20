"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Menu, Heart, Paintbrush, Settings, ImageIcon, LinkIcon, Plus, Edit2, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface GallerySidebarMobileProps {
  galleryId: string
  galleryName: string
  shootingDate: string
  currentView: "gallery" | "favorites" | "design" | "settings"
  onViewChange: (view: string) => void
  onSceneSelect: (sceneId: string) => void
  onGalleryNameChange?: (name: string) => void
  onShootingDateChange?: (date: string) => void
}

export default function GallerySidebarMobile({
  galleryId,
  galleryName,
  shootingDate,
  currentView,
  onViewChange,
  onSceneSelect,
  onGalleryNameChange = () => {},
  onShootingDateChange = () => {},
}: GallerySidebarMobileProps) {
  const { t } = useLanguage()
  const [scenes, setScenes] = useState<{ id: string; name: string }[]>([])
  const [open, setOpen] = useState(false)
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null)
  const [isEditingGallery, setIsEditingGallery] = useState(false)
  const [editedGalleryName, setEditedGalleryName] = useState(galleryName)
  const [editedShootingDate, setEditedShootingDate] = useState(shootingDate)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Update local state when props change
  useEffect(() => {
    setEditedGalleryName(galleryName)
    setEditedShootingDate(shootingDate)
  }, [galleryName, shootingDate])

  // Load scenes from localStorage when component mounts or when sheet is opened
  useEffect(() => {
    if (open) {
      loadScenes()
    }
  }, [galleryId, open])

  // Add an event listener to reload scenes when localStorage changes
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `gallery-${galleryId}-scenes`) {
        loadScenes()
      }
    }

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events from desktop sidebar
    const handleSceneAdded = () => {
      loadScenes()
    }

    const handleSceneDeleted = () => {
      loadScenes()
    }

    window.addEventListener("sceneAdded", handleSceneAdded)
    window.addEventListener("sceneDeleted", handleSceneDeleted)
    window.addEventListener("scenesAvailable", handleSceneAdded)

    // Clean up event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sceneAdded", handleSceneAdded)
      window.removeEventListener("sceneDeleted", handleSceneDeleted)
      window.removeEventListener("scenesAvailable", handleSceneAdded)
    }
  }, [galleryId])

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

  const loadScenes = () => {
    console.log("Loading scenes for gallery:", galleryId)
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
    const allScenesDeleted = localStorage.getItem(`gallery-${galleryId}-all-scenes-deleted`) === "true"

    if (storedScenes) {
      try {
        const parsedScenes = JSON.parse(storedScenes)
        console.log("Loaded scenes:", parsedScenes)
        setScenes(parsedScenes)
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
        if (!allScenesDeleted) {
          // Only create default scene if not intentionally deleted
          setScenes([{ id: "1", name: "New Scene" }])
        } else {
          setScenes([])
        }
      }
    } else {
      console.log("No stored scenes found")
      if (!allScenesDeleted) {
        // Only create default scene if not intentionally deleted
        const defaultScene = { id: "1", name: "New Scene" }
        setScenes([defaultScene])

        // Save default scene to localStorage
        localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify([defaultScene]))
      } else {
        setScenes([])
      }
    }
  }

  const handleViewChange = (view: string) => {
    onViewChange(view)
    setOpen(false)
  }

  const handleSceneSelect = (sceneId: string) => {
    onSceneSelect(sceneId)
    handleViewChange("gallery")
  }

  const copyLinkToClipboard = () => {
    const galleryLink =
      typeof window !== "undefined" ? `${window.location.origin}/galleries/${galleryId}` : `/galleries/${galleryId}`
    navigator.clipboard.writeText(galleryLink)
    toast({
      title: t("gallery.linkCopied"),
      description: t("gallery.linkCopiedDescription"),
    })
    setOpen(false)
  }

  const handleAddScene = () => {
    // Clear the "all scenes deleted" flag when a new scene is added
    localStorage.removeItem(`gallery-${galleryId}-all-scenes-deleted`)

    const newScene = {
      id: `scene-${Date.now()}`,
      name: "New Scene",
    }

    // Get current scenes from localStorage to ensure we have the latest
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
    let currentScenes = []

    if (storedScenes) {
      try {
        currentScenes = JSON.parse(storedScenes)
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
        currentScenes = [...scenes]
      }
    } else {
      currentScenes = [...scenes]
    }

    // Update local state
    const updatedScenes = [...currentScenes, newScene]
    setScenes(updatedScenes)

    // Store scenes in localStorage to persist across page navigation
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

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

    // Don't automatically navigate to the new scene
    toast({
      title: t("gallery.sceneAdded"),
      description: t("gallery.sceneAddedDescription"),
    })
  }

  const handleEditScene = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSceneId(sceneId)
  }

  const handleSceneNameChange = (sceneId: string, newName: string) => {
    if (!newName.trim()) return

    // Get current scenes from localStorage to ensure we have the latest
    const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
    let currentScenes = []

    if (storedScenes) {
      try {
        currentScenes = JSON.parse(storedScenes)
      } catch (e) {
        console.error("Failed to parse stored scenes", e)
        currentScenes = [...scenes]
      }
    } else {
      currentScenes = [...scenes]
    }

    const updatedScenes = currentScenes.map((scene) => (scene.id === sceneId ? { ...scene, name: newName } : scene))

    setScenes(updatedScenes)
    localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))

    // Trigger a custom event to notify other components about the scene name change
    if (typeof window !== "undefined") {
      const event = new CustomEvent("sceneNameChanged", {
        detail: { sceneId, newName },
      })
      window.dispatchEvent(event)
    }
  }

  const handleSceneNameBlur = (sceneId: string, newName: string) => {
    if (newName.trim()) {
      handleSceneNameChange(sceneId, newName)
    }
    setEditingSceneId(null)
  }

  const handleSceneNameKeyDown = (e: React.KeyboardEvent, sceneId: string, newName: string) => {
    if (e.key === "Enter") {
      if (newName.trim()) {
        handleSceneNameChange(sceneId, newName)
      }
      setEditingSceneId(null)
    } else if (e.key === "Escape") {
      setEditingSceneId(null)
    }
  }

  const handleDeleteClick = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("Delete clicked for scene:", sceneId)
    setSceneToDelete(sceneId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteScene = () => {
    console.log("Confirming delete for scene:", sceneToDelete)

    if (!sceneToDelete) {
      console.error("No scene to delete")
      return
    }

    try {
      // Get current scenes from localStorage to ensure we have the latest
      const storedScenes = localStorage.getItem(`gallery-${galleryId}-scenes`)
      let currentScenes = []

      if (storedScenes) {
        try {
          currentScenes = JSON.parse(storedScenes)
        } catch (e) {
          console.error("Failed to parse stored scenes", e)
          currentScenes = [...scenes]
        }
      } else {
        currentScenes = [...scenes]
      }

      // Get current scenes
      const updatedScenes = currentScenes.filter((scene) => scene.id !== sceneToDelete)
      console.log("Scenes after filtering:", updatedScenes)

      // Update localStorage
      localStorage.setItem(`gallery-${galleryId}-scenes`, JSON.stringify(updatedScenes))
      console.log("Updated localStorage with new scenes")

      // Update state
      setScenes(updatedScenes)

      // If the deleted scene was the active scene, select another one
      if (currentView === "gallery") {
        if (updatedScenes.length > 0) {
          // Select the first available scene
          onSceneSelect(updatedScenes[0].id)
        } else {
          // No scenes left, clear selection
          onSceneSelect("")
        }
      }

      // If this was the last scene, set the flag
      if (updatedScenes.length === 0) {
        localStorage.setItem(`gallery-${galleryId}-all-scenes-deleted`, "true")

        // Dispatch event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("allScenesDeleted", { detail: { galleryId } }))

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

      // Show success message
      toast({
        title: t("gallery.sceneDeleted"),
        description: t("gallery.sceneDeletedDescription"),
      })

      // Keep the sidebar open - don't close it
      // setOpen(false) - removed this line
    } catch (error) {
      console.error("Error deleting scene:", error)
      toast({
        title: "Error",
        description: "Failed to delete scene. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Close dialog and reset state
      setDeleteDialogOpen(false)
      setSceneToDelete(null)
    }
  }

  const handleSaveGalleryDetails = () => {
    onGalleryNameChange(editedGalleryName)
    onShootingDateChange(editedShootingDate)
    setIsEditingGallery(false)

    // Store in localStorage for persistence
    localStorage.setItem(`gallery-${galleryId}-name`, editedGalleryName)
    localStorage.setItem(`gallery-${galleryId}-date`, editedShootingDate)

    toast({
      title: t("gallery.saved"),
      description: t("gallery.galleryDetailsSaved"),
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  return (
    <>
      <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/galleries" className="mr-3">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-medium truncate">{galleryName}</h1>
              {shootingDate && <p className="text-xs text-gray-500">{formatDate(shootingDate)}</p>}
            </div>
          </div>

          <Sheet
            open={open}
            onOpenChange={(newOpen) => {
              setOpen(newOpen)
              if (newOpen) {
                // Reload scenes when opening the sheet
                loadScenes()
              }
            }}
          >
            <Button variant="ghost" size="icon" className="ml-2" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <SheetContent side="left" className="w-full sm:w-[80vw] p-0 z-50">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b relative">
                  {isEditingGallery ? (
                    <div className="space-y-3">
                      <Input
                        value={editedGalleryName}
                        onChange={(e) => setEditedGalleryName(e.target.value)}
                        className="font-bold"
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-bold text-lg">{galleryName}</h2>
                        {shootingDate && <p className="text-sm text-gray-500">{formatDate(shootingDate)}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 absolute right-12 top-4"
                        onClick={() => setIsEditingGallery(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-4 border-b">
                  <h3 className="font-medium mb-2 flex items-center justify-between">
                    <span className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {t("gallery.scenes")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[#B9FF66] hover:text-[#a8eb55]"
                      onClick={handleAddScene}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </h3>

                  <div className="space-y-1 pl-6">
                    {scenes.length > 0 ? (
                      scenes.map((scene) => (
                        <div key={scene.id} className="flex items-center">
                          {editingSceneId === scene.id ? (
                            <div className="flex-1 py-1 mt-1">
                              <Input
                                ref={editInputRef}
                                defaultValue={scene.name}
                                className="h-8 py-1"
                                onBlur={(e) => handleSceneNameBlur(scene.id, e.target.value)}
                                onKeyDown={(e) => handleSceneNameKeyDown(e, scene.id, e.currentTarget.value)}
                              />
                            </div>
                          ) : (
                            <>
                              <button
                                className={`flex-1 text-left py-2 px-2 rounded ${
                                  currentView === "gallery" ? "hover:bg-gray-100" : ""
                                }`}
                                onClick={() => handleSceneSelect(scene.id)}
                              >
                                {scene.name}
                              </button>
                              <div className="flex">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => handleEditScene(scene.id, e)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => handleDeleteClick(scene.id, e)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-1">{t("gallery.noScenes")}</p>
                    )}
                  </div>
                </div>

                <nav className="p-4 space-y-3">
                  <button
                    onClick={() => handleViewChange("favorites")}
                    className={`flex items-center w-full text-left py-2 px-3 rounded ${
                      currentView === "favorites" ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    {t("gallery.favorites")}
                  </button>
                  <button
                    onClick={() => handleViewChange("design")}
                    className={`flex items-center w-full text-left py-2 px-3 rounded ${
                      currentView === "design" ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <Paintbrush className="h-5 w-5 mr-3" />
                    {t("gallery.design")}
                  </button>
                  <button
                    onClick={() => handleViewChange("settings")}
                    className={`flex items-center w-full text-left py-2 px-3 rounded ${
                      currentView === "settings" ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    {t("gallery.settings")}
                  </button>
                </nav>

                <div className="mt-auto p-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={copyLinkToClipboard}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {t("gallery.copyLink")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Delete Scene Confirmation Dialog - using Dialog instead of SimpleModal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("gallery.deleteScene")}</DialogTitle>
          </DialogHeader>
          <p className="py-4">{t("gallery.deleteSceneConfirmation")}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t("gallery.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteScene}>
              {t("gallery.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
