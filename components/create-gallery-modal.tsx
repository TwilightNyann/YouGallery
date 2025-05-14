"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SimpleModal } from "@/components/simple-modal"
import { useLanguage } from "@/contexts/language-context"

interface CreateGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, date: string) => void
}

export default function CreateGalleryModal({ isOpen, onClose, onSubmit }: CreateGalleryModalProps) {
  const { t } = useLanguage()
  const [galleryName, setGalleryName] = useState("")
  const [shootingDate, setShootingDate] = useState(formatDate(new Date()))
  const [nameError, setNameError] = useState("")
  const [dateError, setDateError] = useState("")

  // Format date as YYYY-MM-DD for the date input
  function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setNameError("")
    setDateError("")

    // Validate inputs
    let isValid = true

    if (!galleryName.trim()) {
      setNameError(t("gallery.nameRequired"))
      isValid = false
    }

    if (!shootingDate) {
      setDateError(t("gallery.dateRequired"))
      isValid = false
    }

    if (isValid) {
      onSubmit(galleryName, shootingDate)

      // Reset form
      setGalleryName("")
      setShootingDate(formatDate(new Date()))
    }
  }

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title={t("gallery.createNew")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gallery-name">{t("gallery.galleryName")}</Label>
          <Input
            id="gallery-name"
            value={galleryName}
            onChange={(e) => setGalleryName(e.target.value)}
            placeholder={t("gallery.galleryNamePlaceholder")}
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shooting-date">{t("gallery.shootingDate")}</Label>
          <Input
            id="shooting-date"
            type="date"
            value={shootingDate}
            onChange={(e) => setShootingDate(e.target.value)}
          />
          {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("gallery.cancel")}
          </Button>
          <Button type="submit" className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
            {t("gallery.create")}
          </Button>
        </div>
      </form>
    </SimpleModal>
  )
}
