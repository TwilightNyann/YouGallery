"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Linkedin, Twitter } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#1E1E1E] text-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div className="mb-8 md:mb-0 w-full md:w-auto">
            <div className="flex items-center mb-8">
              <div className="mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="white" />
                  <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="black" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">YouGallery</span>
            </div>

            {/* Mobile Navigation */}
            <nav className="md:hidden grid grid-cols-2 gap-4 mb-8">
              <Link href="/help" className="text-white hover:text-gray-300">
                {t("nav.help")}
              </Link>
              <Link href="/price" className="text-white hover:text-gray-300">
                {t("nav.price")}
              </Link>
            </nav>

            <div className="flex space-x-6 md:hidden">
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link href="/help" className="text-white hover:text-gray-300">
              {t("nav.help")}
            </Link>
            <Link href="/price" className="text-white hover:text-gray-300">
              {t("nav.price")}
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-[#B9FF66] text-black font-medium rounded-full mb-4">
              {t("footer.contactUs")}
            </div>
            <div className="space-y-2 text-sm">
              <p>Email: support@yougallery.com</p>
              <p>Phone: 555-567-8901</p>
              <p>
                Address: 1234 Gallery St,
                <br />
                Photo City, Image State 12345
              </p>
            </div>
          </div>

          <div className="bg-[#292929] p-6 rounded-lg">
            <div className="flex flex-col gap-4">
              <Input type="email" placeholder="Email" className="bg-transparent border-white text-white" />
              <Button className="bg-[#B9FF66] text-black hover:bg-[#a8eb55] whitespace-nowrap w-full md:w-auto">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">{t("footer.rights")}</p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">
              {t("footer.privacy")}
            </Link>
            <Link href="/404-test" className="text-sm text-gray-400 hover:text-white">
              404 Example
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
