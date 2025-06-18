"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("mb-6 rounded-[32px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between rounded-[32px] px-6 py-5 text-left text-xl font-medium",
        "transition-all duration-300 ease-in-out",
        "data-[state=open]:bg-[#B9FF66] data-[state=open]:rounded-b-none data-[state=closed]:bg-[#F3F3F3]",
        className,
      )}
      {...props}
    >
      {children}
      <div className="rounded-full bg-white p-2 shrink-0 ml-4 shadow-sm">
        {props["data-state"] === "open" ? (
          <Minus className="h-5 w-5 shrink-0 text-[#191A23]" />
        ) : (
          <Plus className="h-5 w-5 shrink-0 text-[#191A23]" />
        )}
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-base bg-[#B9FF66] rounded-b-[32px]",
      "transition-all duration-300 ease-in-out",
      className,
    )}
    {...props}
  >
    <div className={cn("px-6 py-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

export function FAQSection() {
  const [openItem, setOpenItem] = React.useState<string>("item-1")
  const { t } = useLanguage()

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" value={openItem} onValueChange={setOpenItem} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger data-state={openItem === "item-1" ? "open" : "closed"}>
              {t("help.faq.question1")}
            </AccordionTrigger>
            <AccordionContent>{t("help.faq.answer1")}</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger data-state={openItem === "item-2" ? "open" : "closed"}>
              {t("help.faq.question2")}
            </AccordionTrigger>
            <AccordionContent>{t("help.faq.answer2")}</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger data-state={openItem === "item-3" ? "open" : "closed"}>
              {t("help.faq.question3")}
            </AccordionTrigger>
            <AccordionContent>{t("help.faq.answer3")}</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger data-state={openItem === "item-4" ? "open" : "closed"}>
              {t("help.faq.question4")}
            </AccordionTrigger>
            <AccordionContent>{t("help.faq.answer4")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
