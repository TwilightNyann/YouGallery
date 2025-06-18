"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"

type GallerySettingsProps = {
  galleryId: string
  galleryName?: string
  shootingDate?: string
  onGalleryNameChange?: (name: string) => void
  onShootingDateChange?: (date: string) => void
}

export function GallerySettings({
  galleryId,
  galleryName = "New Gallery",
  shootingDate = "2024-03-05",
  onGalleryNameChange,
  onShootingDateChange,
}: GallerySettingsProps) {
  const router = useRouter()
  const [name, setName] = useState(galleryName)
  const [date, setDate] = useState(shootingDate)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Password protection state
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Load gallery details from API
  useEffect(() => {
    loadGalleryData()
  }, [galleryId])

  const loadGalleryData = async () => {
    try {
      const gallery = await apiClient.getGallery(Number.parseInt(galleryId))
      setName(gallery.name)
      setDate(gallery.shooting_date.split("T")[0]) // Extract date part
      setIsPasswordProtected(gallery.is_password_protected || false)
    } catch (error) {
      console.error("Failed to load gallery data:", error)
      toast.error("Failed to load gallery settings")
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      await apiClient.updateGallery(Number.parseInt(galleryId), {
        name: name,
        shooting_date: date,
      })

      // Call the parent component's callbacks if provided
      if (onGalleryNameChange) onGalleryNameChange(name)
      if (onShootingDateChange) onShootingDateChange(date)

      toast.success("Settings Saved", {
        description: "Gallery settings have been saved successfully",
      })
    } catch (error) {
      console.error("Failed to save gallery settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePassword = async () => {
    try {
      setPasswordError("")
      setIsLoading(true)

      // Validate password
      if (isPasswordProtected) {
        if (!password) {
          setPasswordError("Password is required")
          return
        }

        if (password !== confirmPassword) {
          setPasswordError("Passwords do not match")
          return
        }
      }

      // Update gallery with password settings
      await apiClient.updateGallery(Number.parseInt(galleryId), {
        is_password_protected: isPasswordProtected,
        password: isPasswordProtected ? password : undefined,
      })

      toast.success("Password Settings Saved", {
        description: "Password protection settings have been updated",
      })

      // Clear password fields after saving
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Failed to save password settings:", error)
      toast.error("Failed to save password settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGallery = async () => {
    try {
      setIsLoading(true)

      await apiClient.deleteGallery(Number.parseInt(galleryId))

      toast.success("Gallery Deleted", {
        description: "Gallery has been permanently deleted",
      })

      // Close dialog and redirect
      setShowDeleteDialog(false)

      // Redirect to galleries list after a short delay
      setTimeout(() => {
        router.push("/galleries")
      }, 1000)
    } catch (error) {
      console.error("Failed to delete gallery:", error)
      toast.error("Failed to delete gallery")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gallery Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic information about your gallery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-name">Gallery Name</Label>
              <Input id="gallery-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shooting-date">Shooting Date</Label>
              <Input
                id="shooting-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Access</CardTitle>
            <CardDescription>Your gallery is publicly accessible to anyone with the link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Gallery is public</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              All galleries are publicly accessible. You can add password protection below for additional security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Protection</CardTitle>
            <CardDescription>Add an extra layer of security to your gallery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-password-protected"
                checked={isPasswordProtected}
                onChange={(e) => setIsPasswordProtected(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#B9FF66] focus:ring-[#B9FF66]"
                disabled={isLoading}
              />
              <Label htmlFor="is-password-protected" className="text-sm font-medium leading-none cursor-pointer">
                Enable Password Protection
              </Label>
            </div>

            {isPasswordProtected && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="gallery-password">Password</Label>
                  <Input
                    id="gallery-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isLoading}
                  />
                </div>

                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSavePassword}
              className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Password Settings"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions that affect your gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone. All photos and settings will be permanently deleted.
            </p>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isLoading}>
              Delete Gallery
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gallery</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be undone and will permanently delete all
              photos, scenes, and settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGallery} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Gallery"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
