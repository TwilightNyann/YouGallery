"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{t("privacy.title")}</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            {t("privacy.lastUpdated")} {t("privacy.lastUpdatedDate")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section1.title")}</h2>
            <p>{t("privacy.section1.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section2.title")}</h2>
            <p className="mb-4">{t("privacy.section2.intro")}</p>
            <p>{t("privacy.section2.description")}</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>
                <strong>{t("privacy.dataCollection")}</strong> {t("privacy.section2.identity")}
              </li>
              <li>
                <strong>{t("privacy.contact")}</strong> {t("privacy.section2.contact")}
              </li>
              <li>
                <strong>Technical Data</strong> {t("privacy.section2.technical")}
              </li>
              <li>
                <strong>Profile Data</strong> {t("privacy.section2.profile")}
              </li>
              <li>
                <strong>Usage Data</strong> {t("privacy.section2.usage")}
              </li>
              <li>
                <strong>Content Data</strong> {t("privacy.section2.content")}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section3.title")}</h2>
            <p className="mb-4">{t("privacy.section3.intro")}</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>{t("privacy.section3.contract")}</li>
              <li>{t("privacy.section3.interests")}</li>
              <li>{t("privacy.section3.legal")}</li>
            </ul>
            <p>{t("privacy.section3.consent")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section4.title")}</h2>
            <p>{t("privacy.section4.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section5.title")}</h2>
            <p>{t("privacy.section5.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section6.title")}</h2>
            <p className="mb-4">{t("privacy.section6.intro")}</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>
                <strong>{t("common.view")}</strong> {t("privacy.section6.access")}
              </li>
              <li>
                <strong>{t("common.edit")}</strong> {t("privacy.section6.correction")}
              </li>
              <li>
                <strong>{t("common.delete")}</strong> {t("privacy.section6.erasure")}
              </li>
              <li>
                <strong>Object to processing</strong> {t("privacy.section6.object")}
              </li>
              <li>
                <strong>Request restriction</strong> {t("privacy.section6.restriction")}
              </li>
              <li>
                <strong>Request transfer</strong> {t("privacy.section6.transfer")}
              </li>
              <li>
                <strong>Withdraw consent</strong> {t("privacy.section6.withdraw")}
              </li>
            </ul>
            <p>{t("privacy.section6.contact")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section7.title")}</h2>
            <p>{t("privacy.section7.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section8.title")}</h2>
            <p>{t("privacy.section8.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section9.title")}</h2>
            <p>{t("privacy.section9.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.section10.title")}</h2>
            <p>{t("privacy.section10.intro")}</p>
            <div className="mt-4">
              <p>
                <strong>{t("help.contact.email")}</strong> {t("privacy.section10.email")}
              </p>
              <p>
                <strong>{t("help.contact.phone")}</strong> {t("privacy.section10.phone")}
              </p>
              <p>
                <strong>{t("help.contact.address")}</strong>
                <br />
                {t("privacy.section10.address")}
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
