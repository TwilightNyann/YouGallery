"use client"

import Navbar from "@/components/navbar"
import PricingCard from "@/components/pricing-card"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PricePage() {
  const { t } = useLanguage()

  const basicFeatures = [
    "Up to 10 galleries",
    "Basic photo organization",
    "Standard image quality",
    "Email support",
    "Mobile access",
    "Scene management",
  ]

  const proFeatures = [
    "Up to 50 galleries",
    "Advanced photo organization",
    "High image quality",
    "Priority email support",
    "Mobile access",
    "Custom gallery themes",
    "Password-protected galleries",
    "Unlimited scenes",
  ]

  const eliteFeatures = [
    "Unlimited galleries",
    "Professional photo organization",
    "Original image quality",
    "Priority support",
    "Mobile access",
    "Custom gallery themes",
    "Password-protected galleries",
    "Custom domain name",
    "Analytics and insights",
    "Collaborative editing",
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
