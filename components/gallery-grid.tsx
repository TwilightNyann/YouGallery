"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GalleryCard from "@/components/gallery-card"
import { useLanguage } from "@/contexts/language-context"

// Mock data for galleries
const mockGalleries = [
  {
    id: 1,
    title: "Nature Collection",
    date: "2024-03-05",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Urban Landscapes",
    date: "2024-03-04",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Portrait Series",
    date: "2024-03-03",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Abstract Art",
    date: "2024-03-02",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function GalleryGrid() {
  const [sortBy, setSortBy] = useState("newest")
  const { t } = useLanguage()

  const sortedGalleries = [...mockGalleries].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("gallery.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("gallery.newest")}</SelectItem>
            <SelectItem value="oldest">{t("gallery.oldest")}</SelectItem>
            <SelectItem value="name">{t("gallery.name")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedGalleries.map((gallery) => (
          <GalleryCard
            key={gallery.id}
            id={gallery.id}
            title={gallery.title}
            date={gallery.date}
            thumbnail={gallery.thumbnail}
          />
        ))}
      </div>
    </div>
  )
}
