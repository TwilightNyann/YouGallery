"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Facebook, Linkedin, Twitter } from "lucide-react"

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <Link href="/help" className="block px-2 py-1 text-lg">
            Help
          </Link>
          <Link href="/price" className="block px-2 py-1 text-lg">
            Price
          </Link>
          <Link href="/pricing" className="block px-2 py-1 text-lg">
            Pricing
          </Link>
          <Link href="/blog" className="block px-2 py-1 text-lg">
            Blog
          </Link>
          <div className="flex space-x-6 mt-4">
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
        </nav>
      </SheetContent>
    </Sheet>
  )
}
