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
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="galleries">{t("gallery.galleries")}</TabsTrigger>
              <TabsTrigger value="statistics">{t("gallery.statistics")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="bg-[#191A23] text-white hover:bg-black/90" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("gallery.create")}
          </Button>
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
