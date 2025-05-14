"use client"

import Navbar from "@/components/navbar"
import PricingCard from "@/components/pricing-card"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PricePage() {
  const { t } = useLanguage()

  const basicFeatures = [
    "Website optimization",
    "Social media setup and management (1 platform)",
    "Monthly progress report",
    "Email support",
    "Basic competitor analysis",
    "Initial SEO audit",
  ]

  const proFeatures = [
    "Includes all from the Basic Plan",
    "Social media setup and management (up to 5 platforms)",
    "PPC ad campaign management",
    "Email and phone support",
    "On-page SEO improvements",
    "Monthly content recommendations",
  ]

  const eliteFeatures = [
    "Includes all from the Pro Plan",
    "Website design and development",
    "Comprehensive SEO strategy",
    "Social media setup and management (up to 5 platforms)",
    "Content marketing strategy and implementation",
    "In-depth analytics and reporting",
  ]

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-grow">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{t("price.title")}</h1>
        <p className="text-lg md:text-xl mb-8 md:mb-12">{t("price.subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <PricingCard title={t("price.basic")} price="$500" features={basicFeatures} popular={false} />
          <PricingCard title={t("price.pro")} price="$1000" features={proFeatures} popular={true} />
          <PricingCard title={t("price.elite")} price="$2000" features={eliteFeatures} popular={false} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
