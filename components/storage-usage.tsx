"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardDrive } from "lucide-react"
import apiClient from "@/lib/api"

interface StorageUsageProps {
  compact?: boolean
}

export function StorageUsage({ compact = false }: StorageUsageProps) {
  const { t } = useLanguage()
  const [usedStorage, setUsedStorage] = useState(0)
  const [totalStorage, setTotalStorage] = useState(5) // 5GB for free plan
  const [percentage, setPercentage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStorageUsage()
  }, [])

  const calculateStorageUsage = async () => {
    try {
      setLoading(true)

      // Get all galleries from API
      const galleries = await apiClient.getGalleries()

      let totalSizeBytes = 0

      // Calculate total size from all galleries
      for (const gallery of galleries) {
        try {
          // Get gallery details with scenes and photos
          const galleryDetails = await apiClient.getGallery(gallery.id)

          // Sum up all photo sizes
          if (galleryDetails.scenes) {
            for (const scene of galleryDetails.scenes) {
              if (scene.photos) {
                for (const photo of scene.photos) {
                  totalSizeBytes += photo.file_size || 0
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error getting gallery ${gallery.id} details:`, error)
        }
      }

      // Convert bytes to GB
      const usedGB = totalSizeBytes / (1024 * 1024 * 1024)
      const roundedUsedGB = Math.min(totalStorage, Number.parseFloat(usedGB.toFixed(3)))

      setUsedStorage(roundedUsedGB)
      setPercentage(Math.round((roundedUsedGB / totalStorage) * 100))
    } catch (error) {
      console.error("Failed to calculate storage usage:", error)
      // Fallback to 0 if API fails
      setUsedStorage(0)
      setPercentage(0)
    } finally {
      setLoading(false)
    }
  }

  const formatStorage = (gb: number) => {
    if (gb < 0.001) {
      const mb = gb * 1024
      if (mb < 0.1) {
        const kb = mb * 1024
        return `${Math.round(kb)} KB`
      }
      return `${mb.toFixed(1)} MB`
    }
    return `${gb.toFixed(2)} GB`
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-white rounded-md border p-2 h-10">
        <HardDrive className="h-4 w-4 text-gray-500" />
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <>
            <Progress value={percentage} className="h-2 flex-grow" />
            <span className="text-xs whitespace-nowrap">
              {formatStorage(usedStorage)}/{formatStorage(totalStorage)}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{t("storage.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-500">Calculating storage...</span>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
