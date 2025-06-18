"use client"

import Navbar from "@/components/navbar"
import PricingCard from "@/components/pricing-card"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PricePage() {
  const { t } = useLanguage()

  const basicFeatures = [
    t("pricing.basic.features.galleries"),
    t("pricing.basic.features.organization"),
    t("pricing.basic.features.quality"),
    t("pricing.basic.features.support"),
    t("pricing.basic.features.mobile"),
    t("pricing.basic.features.scenes"),
  ]

  const proFeatures = [
    t("pricing.pro.features.galleries"),
    t("pricing.pro.features.organization"),
    t("pricing.pro.features.quality"),
    t("pricing.pro.features.support"),
    t("pricing.pro.features.mobile"),
    t("pricing.pro.features.themes"),
    t("pricing.pro.features.password"),
    t("pricing.pro.features.scenes"),
  ]

  const eliteFeatures = [
    t("pricing.elite.features.galleries"),
    t("pricing.elite.features.organization"),
    t("pricing.elite.features.quality"),
    t("pricing.elite.features.support"),
    t("pricing.elite.features.mobile"),
    t("pricing.elite.features.themes"),
    t("pricing.elite.features.password"),
    t("pricing.elite.features.domain"),
    t("pricing.elite.features.analytics"),
    t("pricing.elite.features.collaboration"),
  ]

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-grow">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{t("price.title")}</h1>
        <p className="text-lg md:text-xl mb-8 md:mb-12">{t("price.subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <PricingCard
            title={t("price.basic")}
            price="$10"
            storage="100GB storage"
            features={basicFeatures}
            popular={false}
          />
          <PricingCard
            title={t("price.pro")}
            price="$20"
            storage="500GB storage"
            features={proFeatures}
            popular={true}
          />
          <PricingCard
            title={t("price.elite")}
            price="$50"
            storage="1TB storage"
            features={eliteFeatures}
            popular={false}
          />
        </div>
      </div>
      <Footer />
    </main>
  )
}
