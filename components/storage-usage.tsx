"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardDrive } from "lucide-react"

interface StorageUsageProps {
  compact?: boolean
}

export function StorageUsage({ compact = false }: StorageUsageProps) {
  const { t } = useLanguage()
  const [usedStorage, setUsedStorage] = useState(0)
  const [totalStorage, setTotalStorage] = useState(5) // 5GB for free plan
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll simulate some storage usage
    const calculateUsage = () => {
      // Get all galleries from localStorage
      const galleries = []

      // Find all gallery keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("gallery-") && key.endsWith("-photos")) {
          const galleryId = key.replace("gallery-", "").replace("-photos", "")
          galleries.push(galleryId)
        }
      }

      // Calculate a simulated storage size based on number of photos
      let totalSize = 0
      galleries.forEach((galleryId) => {
        const photosData = localStorage.getItem(`gallery-${galleryId}-photos`)
        if (photosData) {
          try {
            const photosByScene = JSON.parse(photosData)
            let photoCount = 0

            // Count photos in all scenes
            Object.values(photosByScene).forEach((photos: any) => {
              photoCount += photos.length
            })

            // Assume each photo is approximately 3-5MB
            totalSize += photoCount * (3 + Math.random() * 2)
          } catch (e) {
            console.error("Failed to parse photos data", e)
          }
        }
      })

      // Convert to GB and round to 2 decimal places
      const usedGB = Math.min(totalStorage, Number.parseFloat((totalSize / 1024).toFixed(2)))
      setUsedStorage(usedGB)
      setPercentage(Math.round((usedGB / totalStorage) * 100))
    }

    calculateUsage()
  }, [totalStorage])

  const formatStorage = (gb: number) => {
    if (gb < 0.1) {
      return `${Math.round(gb * 1024)} MB`
    }
    return `${gb.toFixed(2)} GB`
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-white rounded-md border p-2 h-10">
        <HardDrive className="h-4 w-4 text-gray-500" />
        <Progress value={percentage} className="h-2 flex-grow" />
        <span className="text-xs whitespace-nowrap">
          {formatStorage(usedStorage)}/{formatStorage(totalStorage)}
        </span>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{t("storage.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>
              {formatStorage(usedStorage)} / {formatStorage(totalStorage)}
            </span>
            <span className={percentage > 90 ? "text-red-500" : "text-gray-500"}>{percentage}%</span>
          </div>
          {percentage > 90 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-sm text-red-500">{t("storage.almostFull")}</p>
              <Link href="/price">
                <Button size="sm" className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">
                  {t("storage.upgrade")}
                </Button>
              </Link>
            </div>
          )}
          <div className="text-sm text-gray-500">{t("storage.freePlan")}</div>
        </div>
      </CardContent>
    </Card>
  )
}
