"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-white flex flex-col relative">
      <Navbar />
      <div className="flex-grow relative overflow-hidden">
        {/* More subtle gradient elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-gradient-to-bl from-[#B9FF66]/15 to-[#7ED957]/10 blur-3xl"></div>
        <div className="absolute top-[20%] right-[15%] w-[25%] h-[35%] rounded-full bg-gradient-to-tr from-[#66FFB9]/12 to-[#57D980]/8 blur-3xl"></div>
        <div className="absolute top-[5%] right-[30%] w-[20%] h-[20%] rounded-full bg-gradient-to-br from-[#A0FF66]/10 to-[#66FF8F]/5 blur-3xl"></div>

        <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B9FF66] to-[#66FFB9] bg-clip-text text-transparent">
              {t("home.welcome")}
            </h1>
            <p className="text-xl mb-8 text-gray-800">{t("home.subtitle")}</p>
            {/* Buttons removed as requested */}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#F3F3F3] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{t("home.store.title")}</h2>
              <p>{t("home.store.description")}</p>
            </div>
            <div className="bg-[#F3F3F3] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{t("home.organize.title")}</h2>
              <p>{t("home.organize.description")}</p>
            </div>
            <div className="bg-[#F3F3F3] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{t("home.share.title")}</h2>
              <p>{t("home.share.description")}</p>
            </div>
          </div>

          <div className="bg-[#1E1E1E] text-white p-8 rounded-lg mb-16">
            <div className="md:flex justify-between items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-4">{t("home.cta.title")}</h2>
                <p className="mb-4">{t("home.cta.description")}</p>
              </div>
              {/* CTA button removed as requested */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
