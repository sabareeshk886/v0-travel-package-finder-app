"use client"

import { useState, useEffect } from "react"
import PackageFinder from "@/components/package-finder"
import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<"regular" | "b2b">("regular")

  useEffect(() => {
    const authToken = localStorage.getItem("fernway_auth")
    const storedUserType = localStorage.getItem("fernway_user_type") as "regular" | "b2b"
    setIsAuthenticated(authToken === "authenticated")
    setUserType(storedUserType || "regular")
    setIsLoading(false)
  }, [])

  const handleLogin = (type: "regular" | "b2b") => {
    setUserType(type)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("fernway_auth")
    localStorage.removeItem("fernway_user_type")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Fernway Holidays</h1>
          <p className="text-muted-foreground">Package Rate Finder {userType === "b2b" ? "- B2B" : ""}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="absolute top-0 right-0 md:right-4 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        <PackageFinder userType={userType} />
      </div>
    </main>
  )
}
