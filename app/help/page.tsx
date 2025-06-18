"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"

export default function HelpPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-grow">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{t("help.title")}</h1>
        <p className="text-lg md:text-xl mb-8">{t("help.subtitle")}</p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#F3F3F3] p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{t("help.contact.title")}</h2>
            <div className="space-y-4 mb-6">
              <p>
                <strong>{t("help.contact.email")}</strong> {t("help.contact.emailValue")}
              </p>
              <p>
                <strong>{t("help.contact.phone")}</strong> {t("help.contact.phoneValue")}
              </p>
              <p>
                <strong>{t("help.contact.hours")}</strong> {t("help.contact.hoursValue")}
              </p>
              <p>
                <strong>{t("help.contact.address")}</strong>
                <br />
                {t("help.contact.addressValue")}
              </p>
              <p>
                <strong>{t("help.contact.author")}</strong> {t("help.contact.name")}
              </p>
            </div>
          </div>

          <div className="bg-[#F3F3F3] p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{t("help.message.title")}</h2>
            <form className="space-y-4">
              <div>
                <Input type="text" placeholder={t("help.message.name")} />
              </div>
              <div>
                <Input type="email" placeholder={t("help.message.email")} />
              </div>
              <div>
                <Textarea placeholder={t("help.message.message")} className="min-h-[120px]" />
              </div>
              <Button className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]">{t("help.message.send")}</Button>
            </form>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{t("help.faq.title")}</h2>
        <FAQSection />
      </div>
      <Footer />
    </main>
  )
}
