"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"

interface CreateGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, date: string) => void
}

// Format date as YYYY-MM-DD for the date input
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Convert date from YYYY-MM-DD to ISO datetime
function formatDateForAPI(dateString: string): string {
  return `${dateString}T00:00:00`
}

export default function CreateGalleryModal({ isOpen, onClose, onSubmit }: CreateGalleryModalProps) {
  const [galleryName, setGalleryName] = useState("")
  const [shootingDate, setShootingDate] = useState(formatDate(new Date()))
  const [nameError, setNameError] = useState("")
  const [dateError, setDateError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setGalleryName("")
      setShootingDate(formatDate(new Date()))
      setNameError("")
      setDateError("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setNameError("")
    setDateError("")

    // Validate inputs
    let isValid = true

    if (!galleryName.trim()) {
      setNameError("Gallery name is required")
      isValid = false
    }

    if (!shootingDate) {
      setDateError("Shooting date is required")
      isValid = false
    }

    if (!isValid) return

    setIsLoading(true)

    try {
      const galleryData = {
        name: galleryName.trim(),
        shooting_date: formatDateForAPI(shootingDate),
      }

      console.log("Creating gallery with data:", galleryData)

      const newGallery = await apiClient.createGallery(galleryData)

      console.log("Gallery created successfully:", newGallery)

      toast({
        title: "Success",
        description: "Gallery created successfully!",
      })

      onSubmit(galleryName, shootingDate)
      onClose()
    } catch (error) {
      console.error("Failed to create gallery:", error)
      toast({
        title: "Error",
        description: "Failed to create gallery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Gallery</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gallery-name">Gallery Name</Label>
            <Input
              id="gallery-name"
              value={galleryName}
              onChange={(e) => setGalleryName(e.target.value)}
              placeholder="Enter gallery name"
              disabled={isLoading}
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shooting-date">Shooting Date</Label>
            <Input
              id="shooting-date"
              type="date"
              value={shootingDate}
              onChange={(e) => setShootingDate(e.target.value)}
              disabled={isLoading}
            />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
