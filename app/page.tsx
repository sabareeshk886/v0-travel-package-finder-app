"use client"

import { useState, useEffect } from "react"
import PackageFinder from "@/components/package-finder"
import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, Search, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<"regular" | "b2b">("regular")
  const [currentView, setCurrentView] = useState<"menu" | "package-finder">("menu")

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
    setCurrentView("menu")
  }

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  if (currentView === "menu") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-8 text-center relative">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Fernway Holidays</h1>
            <p className="text-muted-foreground">Welcome {userType === "b2b" ? "B2B Team" : "Team"}</p>
            <div className="absolute top-0 right-0 md:right-4">
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card
              className="cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-blue-400"
              onClick={() => setCurrentView("package-finder")}
            >
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Finder</h2>
                <p className="text-muted-foreground">Search and share package rates</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-green-400"
              onClick={() => router.push("/trip-report")}
            >
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Report</h2>
                <p className="text-muted-foreground">Submit trip details and expenses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Fernway Holidays</h1>
          <p className="text-muted-foreground">Package Rate Finder {userType === "b2b" ? "- B2B" : ""}</p>
          <div className="absolute top-0 right-0 md:right-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentView("menu")} className="bg-transparent">
              Back to Menu
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        <PackageFinder userType={userType} />
      </div>
    </main>
  )
}
