"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Plane, DollarSign, TrendingUp, TrendingDown, Calendar, AlertCircle } from "lucide-react"
import { getLeads, getQuotations, getTrips, getPayments, getExpenses, checkCRMTablesExist, debugConnection } from "@/lib/crm-actions"
import Link from "next/link"

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    totalQuotations: 0,
    pendingQuotations: 0,
    totalTrips: 0,
    activeTrips: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  })
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dbSetupNeeded, setDbSetupNeeded] = useState(false)
  const [setupError, setSetupError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setDbSetupNeeded(false)
    setSetupError("")

    const tablesCheck = await checkCRMTablesExist()

    if (!tablesCheck.exists) {
      setDbSetupNeeded(true)
      setSetupError(
        "Database tables need to be created. Please run the SQL script: scripts/08-create-crm-tables.sql in your Supabase SQL Editor.",
      )
      setLoading(false)
      return
    }

    const [leadsRes, quotationsRes, tripsRes, paymentsRes, expensesRes] = await Promise.all([
      getLeads(),
      getQuotations(),
      getTrips(),
      getPayments(),
      getExpenses(),
    ])


    const allResults = [leadsRes, quotationsRes, tripsRes, paymentsRes, expensesRes]
    const errorResult = allResults.find((res) => !res.success)


    if (errorResult) {
      setDbSetupNeeded(true)

      checkCRMTablesExist().then(() => {
        debugConnection().then((debugRes) => {
          let extraInfo = "";
          if (debugRes.success && debugRes.info) {
            extraInfo = `\n\nDiagnostic Info:\nURL Prefix: ${debugRes.info.maskedUrl}\nDB Name: ${debugRes.info.dbName}\nTable Count (public): ${debugRes.info.tableCount}\nEnv Var Present: ${debugRes.info.envVarPresent}`;
          } else {
            // Display the FULL JSON error if available, otherwise just the message
            const details = debugRes.detailedError || debugRes.error || "Unknown";
            extraInfo = `\n\nDiagnostic Failed: ${details}`;
          }
          setSetupError(`Database Error: ${errorResult.error || "Unknown error occurred"}${extraInfo}`)
        })
      });

      setLoading(false)
      return
    }

    if (leadsRes.success) {
      setStats((prev) => ({
        ...prev,
        totalLeads: leadsRes.data.length,
        activeLeads: leadsRes.data.filter((l: any) => ["new", "contacted", "follow_up"].includes(l.status)).length,
      }))
      setRecentLeads(leadsRes.data.slice(0, 5))
    }

    if (quotationsRes.success) {
      setStats((prev) => ({
        ...prev,
        totalQuotations: quotationsRes.data.length,
        pendingQuotations: quotationsRes.data.filter((q: any) => q.status === "sent").length,
      }))
    }

    if (tripsRes.success) {
      setStats((prev) => ({
        ...prev,
        totalTrips: tripsRes.data.length,
        activeTrips: tripsRes.data.filter((t: any) => ["confirmed", "in_progress"].includes(t.status)).length,
      }))

      const today = new Date()
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      const upcoming = tripsRes.data
        .filter((t: any) => {
          const tripDate = new Date(t.pickup_date)
          return tripDate >= today && tripDate <= thirtyDaysLater
        })
        .slice(0, 5)
      setUpcomingTrips(upcoming)
    }

    if (paymentsRes.success) {
      const revenue = paymentsRes.data
        .filter((p: any) => p.payment_type === "received" && p.status === "completed")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
      setStats((prev) => ({ ...prev, totalRevenue: revenue }))
    }

    if (expensesRes.success) {
      const expenses = expensesRes.data.reduce((sum: number, e: any) => sum + (e.amount || 0), 0)
      setStats((prev) => ({ ...prev, totalExpenses: expenses }))
    }

    setLoading(false)
  }

  const netProfit = stats.totalRevenue - stats.totalExpenses

  if (dbSetupNeeded) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">Overview of your travel business</p>
        </div>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-900">Database Setup Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-800">{setupError}</p>
            <div className="bg-white p-4 rounded-md border border-yellow-200">
              <p className="font-semibold text-sm mb-2">Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Open your Supabase project dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Copy and paste the contents of scripts/08-create-crm-tables.sql</li>
                <li>Run the SQL script</li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <Button onClick={() => loadDashboardData()} className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        <p className="text-muted-foreground">Overview of your travel business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold">{stats.activeLeads}</p>
                <p className="text-xs text-muted-foreground mt-1">of {stats.totalLeads} total</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Quotations</p>
                <p className="text-2xl font-bold">{stats.pendingQuotations}</p>
                <p className="text-xs text-muted-foreground mt-1">of {stats.totalQuotations} total</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Trips</p>
                <p className="text-2xl font-bold">{stats.activeTrips}</p>
                <p className="text-xs text-muted-foreground mt-1">of {stats.totalTrips} total</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Plane className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">₹{netProfit.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {netProfit >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {netProfit >= 0 ? "Profit" : "Loss"}
                  </p>
                </div>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <span className="text-lg font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-sm text-muted-foreground">Total Expenses</span>
              <span className="text-lg font-bold text-red-600">₹{stats.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold">Net Profit/Loss</span>
              <span className={`text-xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{netProfit.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/crm/leads/new">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            </Link>
            <Link href="/crm/quotations/new">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </Link>
            <Link href="/crm/trips/new">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Plane className="h-4 w-4 mr-2" />
                Add Trip
              </Button>
            </Link>
            <Link href="/crm/payments/new">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link href="/crm/leads">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent leads</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <Link key={lead.id} href={`/crm/leads/${lead.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium">{lead.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{lead.status}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Trips</CardTitle>
            <Link href="/crm/trips">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingTrips.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No upcoming trips</p>
            ) : (
              <div className="space-y-3">
                {upcomingTrips.map((trip) => (
                  <Link key={trip.id} href={`/crm/trips/${trip.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium">{trip.trip_number}</p>
                        <p className="text-sm text-muted-foreground">{trip.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(trip.pickup_date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{trip.destination}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
