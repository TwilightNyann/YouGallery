"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SimpleHeader from "@/components/simple-header"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log("Password reset requested for:", email)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div className="flex-grow flex items-center justify-center bg-[#F3F3F3] py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              {!submitted
                ? "Enter your email to receive a password reset link"
                : "Check your email for reset instructions"}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#B9FF66] text-[#191A23] hover:bg-[#a8eb55]">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center p-6 bg-[#F3F3F3] rounded-md">
              <p className="mb-4">
                If an account exists for {email}, you will receive an email with instructions for resetting your
                password.
              </p>
              <p>
                Didn&apos;t receive an email? Check your spam folder or{" "}
                <button onClick={() => setSubmitted(false)} className="text-[#191A23] hover:text-[#B9FF66] underline">
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-[#191A23] hover:text-[#B9FF66] font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
