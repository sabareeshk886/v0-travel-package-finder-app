"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TripReportForm from "@/components/trip-report-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TripReportPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authToken = localStorage.getItem("fernway_auth")
    setIsAuthenticated(authToken === "authenticated")
    setIsLoading(false)

    if (!authToken) {
      router.push("/")
    }
  }, [router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Package Finder
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Trip Report</h1>
          <p className="text-muted-foreground">Submit trip details, income, and expenses</p>
        </div>
        <TripReportForm />
      </div>
    </main>
  )
}
