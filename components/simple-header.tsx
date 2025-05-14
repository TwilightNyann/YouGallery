"use client"

import Link from "next/link"
import LanguageSwitcher from "@/components/language-switcher"

export default function SimpleHeader() {
  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="font-bold text-xl flex items-center">
              <div className="mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="black" />
                  <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white" />
                </svg>
              </div>
              YouGallery
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
