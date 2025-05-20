"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import GalleryGrid from "@/components/gallery-grid"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import CreateGalleryModal from "@/components/create-gallery-modal"
import GalleryStatistics from "@/components/gallery-statistics"
import { StorageUsage } from "@/components/storage-usage"

export default function GalleriesPage() {
  const { t } = useLanguage()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("galleries")

  const handleCreateGallery = (name: string, date: string) => {
    // In a real app, this would make an API call to create the gallery
    console.log("Creating gallery:", { name, date })

    // Close the modal after creation
    setIsCreateModalOpen(false)

    // In a real app, you would refresh the gallery list or add the new gallery to the state
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
              <TabsTrigger value="galleries" className="flex-1 sm:flex-none">
                {t("gallery.galleries")}
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex-1 sm:flex-none">
                {t("gallery.statistics")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full sm:w-auto gap-3 items-center">
            <div className="flex-grow sm:flex-grow-0 sm:w-48">
              <StorageUsage compact={true} />
            </div>
            <Button className="bg-[#191A23] text-white hover:bg-black/90" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("gallery.create")}
            </Button>
          </div>
        </div>

        {activeTab === "galleries" ? <GalleryGrid /> : <GalleryStatistics />}

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
