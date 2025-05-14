"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { SimpleDropdown, SimpleDropdownItem } from "@/components/simple-dropdown"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <SimpleDropdown
      trigger={
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      }
      align="right"
    >
      <SimpleDropdownItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-gray-100" : ""}>
        English
      </SimpleDropdownItem>
      <SimpleDropdownItem onClick={() => setLanguage("uk")} className={language === "uk" ? "bg-gray-100" : ""}>
        Українська
      </SimpleDropdownItem>
    </SimpleDropdown>
  )
}
