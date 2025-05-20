"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface PricingCardProps {
  title: string
  price: string
  storage: string
  features: string[]
  popular: boolean
}

export default function PricingCard({ title, price, storage, features, popular }: PricingCardProps) {
  const { t } = useLanguage()

  return (
    <div className={`rounded-lg p-6 border relative ${popular ? "bg-[#1E1E1E] text-white" : "bg-white"}`}>
      {popular && (
        <div className="absolute -top-3 right-6">
          <span className="bg-[#B9FF66] text-black px-3 py-1 rounded-full text-sm font-medium">Popular</span>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex items-end mb-2">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-sm ml-1 mb-1">{t("price.month")}</span>
      </div>
      <div className="text-sm mb-6">{storage}</div>

      <Button
        className={`w-full mb-6 ${popular ? "bg-[#B9FF66] text-black hover:bg-[#a8eb55]" : "bg-[#1E1E1E] text-white hover:bg-black"}`}
      >
        {t("price.getStarted")}
      </Button>

      <div className="border-t border-gray-300 my-4"></div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-[#B9FF66] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
