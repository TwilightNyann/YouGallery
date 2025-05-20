"use client"

import { useLanguage } from "@/contexts/language-context"
import { Paintbrush } from "lucide-react"

export default function GalleryDesign() {
  const { t } = useLanguage()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t("gallery.design")}</h1>
      </div>

      <div className="bg-[#F3F3F3] rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <Paintbrush className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{t("gallery.designInDevelopment")}</h2>
        <p className="text-gray-600 max-w-md mx-auto">{t("gallery.designInDevelopmentMessage")}</p>
      </div>
    </div>
  )
}
