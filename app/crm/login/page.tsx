"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CRMLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Demo login - in production, this would authenticate with Supabase
    const demoUsers = {
      "admin@fernway.com": { name: "Admin User", role: "admin", password: "admin123" },
      "staff@fernway.com": { name: "Office Staff", role: "office_staff", password: "staff123" },
      "sales@fernway.com": { name: "Sales Person", role: "salesperson", password: "sales123" },
      "finance@fernway.com": { name: "Finance Team", role: "finance", password: "finance123" },
    }

    const user = demoUsers[email as keyof typeof demoUsers]
    if (user && user.password === password) {
      localStorage.setItem("crm_user", JSON.stringify({ name: user.name, role: user.role, email }))
      router.push("/crm/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Fernway CRM</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@fernway.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Admin: admin@fernway.com / admin123</p>
              <p>Staff: staff@fernway.com / staff123</p>
              <p>Sales: sales@fernway.com / sales123</p>
              <p>Finance: finance@fernway.com / finance123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
