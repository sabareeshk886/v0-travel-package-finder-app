"use client"

import { useState, useEffect } from "react"
import PackageFinder from "@/components/package-finder"
import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const authToken = localStorage.getItem("fernway_auth")
    setIsAuthenticated(authToken === "authenticated")
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("fernway_auth")
    setIsAuthenticated(false)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return null
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Show main app if authenticated
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Fernway Holidays</h1>
          <p className="text-muted-foreground">Package Rate Finder</p>
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
        <PackageFinder />
      </div>
    </main>
  )
}
