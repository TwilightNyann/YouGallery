"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Settings } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { SimpleDropdown, SimpleDropdownItem, SimpleDropdownSeparator } from "@/components/simple-dropdown"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="border-b border-gray-100 relative">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/help"
              className={`hover:text-black ${pathname === "/help" ? "text-black bg-[#B9FF66] px-4 py-2 rounded-full" : "text-gray-700"}`}
            >
              {t("nav.help")}
            </Link>
            <Link
              href="/price"
              className={`hover:text-black ${pathname === "/price" ? "text-black bg-[#B9FF66] px-4 py-2 rounded-full" : "text-gray-700"}`}
            >
              {t("nav.price")}
            </Link>

            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-black bg-[#B9FF66] px-4 py-2 rounded-full">
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-black">
                  {t("nav.register")}
                </Link>
              </>
            ) : (
              <Link
                href="/galleries"
                className={`hover:text-black ${pathname === "/galleries" || pathname.startsWith("/galleries/") ? "text-black bg-[#B9FF66] px-4 py-2 rounded-full" : "text-gray-700"}`}
              >
                {t("nav.myGallery")}
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <LanguageSwitcher />

            {isAuthenticated && user && (
              <SimpleDropdown
                trigger={
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
                align="right"
                className="w-56"
              >
                <div className="px-4 py-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    {user.email && <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>}
                  </div>
                </div>
                <SimpleDropdownSeparator />
                <Link href="/settings">
                  <SimpleDropdownItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("nav.settings")}</span>
                  </SimpleDropdownItem>
                </Link>
                <SimpleDropdownSeparator />
                <SimpleDropdownItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </SimpleDropdownItem>
              </SimpleDropdown>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />

            {isAuthenticated && user && (
              <SimpleDropdown
                trigger={
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
                align="right"
                className="w-56"
              >
                <div className="px-4 py-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    {user.email && <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>}
                  </div>
                </div>
                <SimpleDropdownSeparator />
                <Link href="/settings">
                  <SimpleDropdownItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("nav.settings")}</span>
                  </SimpleDropdownItem>
                </Link>
                <SimpleDropdownSeparator />
                <SimpleDropdownItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </SimpleDropdownItem>
              </SimpleDropdown>
            )}

            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <nav className="flex flex-col p-4">
            <Link
              href="/help"
              className={`py-3 border-b border-gray-100 hover:text-black ${pathname === "/help" ? "text-black font-medium" : "text-gray-700"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.help")}
            </Link>
            <Link
              href="/price"
              className={`py-3 border-b border-gray-100 hover:text-black ${pathname === "/price" ? "text-black font-medium" : "text-gray-700"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.price")}
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="py-3 border-b border-gray-100 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="py-3 border-b border-gray-100 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.register")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/galleries"
                  className={`py-3 border-b border-gray-100 hover:text-black ${pathname === "/galleries" || pathname.startsWith("/galleries/") ? "text-black font-medium" : "text-gray-700"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.myGallery")}
                </Link>
                <Link
                  href="/settings"
                  className="py-3 border-b border-gray-100 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.settings")}
                </Link>
                <button
                  className="py-3 border-b border-gray-100 text-red-600 hover:text-red-700 text-left"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  {t("nav.logout")}
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
