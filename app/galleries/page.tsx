"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import GalleryGrid from "@/components/gallery-grid"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import CreateGalleryModal from "@/components/create-gallery-modal"
import GalleryStatistics from "@/components/gallery-statistics"
import { StorageUsage } from "@/components/storage-usage"
import { useRouter } from "next/navigation"

export default function GalleriesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("galleries")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  const handleCreateGallery = (name: string, date: string) => {
    // Refresh the gallery list
    setRefreshKey((prev) => prev + 1)
    setIsCreateModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
              <TabsTrigger value="galleries" className="flex-1 sm:flex-none">
                Galleries
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex-1 sm:flex-none">
                Statistics
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full sm:w-auto gap-3 items-center">
            <div className="flex-grow sm:flex-grow-0 sm:w-48">
              <StorageUsage compact={true} />
            </div>
            <Button className="bg-[#191A23] text-white hover:bg-black/90" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Gallery
            </Button>
          </div>
        </div>

        {activeTab === "galleries" ? <GalleryGrid key={refreshKey} /> : <GalleryStatistics />}

        <CreateGalleryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateGallery}
        />
      </div>
      <Footer />
    </main>
  )
}
