"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user, isAuthenticated, updateProfile, updatePassword, deleteAccount, isLoading: authIsLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const [passwordError, setPasswordError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authIsLoading, isAuthenticated, router])

  // Set initial form data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setProfileSuccess(false)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    setPasswordError("")
    setPasswordSuccess(false)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingProfile(true)
    setProfileSuccess(false)

    try {
      await updateProfile(formData)
      setProfileSuccess(true)
      toast.success(t("profile.profileUpdateSuccess"))
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error(t("profile.profileUpdateError"))
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("profile.passwordsDontMatch"))
      return
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError(t("profile.fillAllFields"))
      return
    }

    setIsSubmittingPassword(true)

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordSuccess(true)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast.success(t("profile.passwordUpdateSuccess"))
    } catch (error: any) {
      console.error("Failed to update password:", error)
      setPasswordError(error.message || t("profile.passwordUpdateError"))
      toast.error(error.message || t("profile.passwordUpdateError"))
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      await deleteAccount()
      toast.success(t("profile.accountDeleteSuccess"))
      // Redirect happens in the auth context
    } catch (error) {
      console.error("Failed to delete account:", error)
      toast.error(t("profile.accountDeleteError"))
    } finally {
      setIsDeletingAccount(false)
      setDeleteDialogOpen(false)
    }
  }

  if (authIsLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div> {/* Replace with a proper spinner/loader component */}
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{t("profile.title")}</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.personalInfo")}</CardTitle>
              <CardDescription>{t("profile.personalInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.name")}</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleProfileChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly // Email is usually not editable or requires verification
                    className="bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">{t("profile.emailChangeNote")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("profile.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleProfileChange}
                  />
                </div>

                {profileSuccess && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>{t("profile.profileUpdateSuccess")}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                onClick={handleProfileSubmit}
                disabled={isSubmittingProfile}
                className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
              >
                {isSubmittingProfile ? t("profile.saving") : t("profile.save")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("profile.password")}</CardTitle>
              <CardDescription>{t("profile.passwordDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t("profile.currentPassword")}</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("profile.confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {passwordSuccess && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>{t("profile.passwordUpdateSuccess")}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                onClick={handlePasswordSubmit}
                disabled={isSubmittingPassword}
                className="bg-[#B9FF66] text-black hover:bg-[#a8eb55]"
              >
                {isSubmittingPassword ? t("profile.updating") : t("profile.updatePassword")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">{t("profile.deleteAccount")}</CardTitle>
              <CardDescription>{t("profile.deleteWarning")}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">{t("profile.deleteButton")}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("profile.confirmDeleteTitle")}</DialogTitle>
                    <DialogDescription>{t("profile.confirmDeleteDescription")}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeletingAccount}>
                      {t("profile.cancel")}
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                      {isDeletingAccount ? t("profile.deleting") : t("profile.deleteButtonConfirm")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
