"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

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

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" value={openItem} onValueChange={setOpenItem} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger data-state={openItem === "item-1" ? "open" : "closed"}>
              Are there any additional fees or charges that may apply?
            </AccordionTrigger>
            <AccordionContent>
              Our pricing plans include a wide range of digital marketing services, including website design and
              development, SEO, PPC advertising, social media marketing, content marketing, and more. We also offer
              custom packages that can be tailored to meet the specific needs of your business.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger data-state={openItem === "item-2" ? "open" : "closed"}>
              Can I change or cancel my plan at any time?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can change or cancel your plan at any time. We believe in flexibility and want to ensure our
              services align with your business needs. Contact our support team to discuss your requirements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger data-state={openItem === "item-3" ? "open" : "closed"}>
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept all major credit cards, bank transfers, and PayPal. For enterprise clients, we also offer custom
              payment terms to suit your organization's requirements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger data-state={openItem === "item-4" ? "open" : "closed"}>
              Do you offer any discounts for long-term commitments?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we offer special pricing for clients who commit to longer-term contracts. Please contact our sales
              team to discuss available discounts and terms for extended partnerships.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
