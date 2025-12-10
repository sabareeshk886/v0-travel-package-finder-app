"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Plane, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  // Mock data - will be replaced with real data from Supabase
  const stats = [
    { name: "Total Leads", value: "124", icon: Users, trend: "+12%", color: "text-blue-600" },
    { name: "Active Quotations", value: "18", icon: FileText, trend: "+5%", color: "text-purple-600" },
    { name: "Confirmed Trips", value: "32", icon: Plane, trend: "+8%", color: "text-green-600" },
    { name: "Monthly Revenue", value: "₹12.5L", icon: TrendingUp, trend: "+15%", color: "text-orange-600" },
  ]

  const recentLeads = [
    { id: 1, name: "Rajesh Kumar", destination: "Kashmir", status: "new", date: "2 hours ago" },
    { id: 2, name: "Priya Sharma", destination: "Kerala", status: "contacted", date: "5 hours ago" },
    { id: 3, name: "Amit Patel", destination: "Rajasthan", status: "quoted", date: "1 day ago" },
  ]

  const upcomingFollowUps = [
    { id: 1, customer: "Sarah Joseph", date: "Today, 3:00 PM", priority: "high" },
    { id: 2, customer: "Mohammed Ali", date: "Tomorrow, 10:00 AM", priority: "medium" },
    { id: 3, customer: "Anjali Nair", date: "Tomorrow, 2:00 PM", priority: "low" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.destination}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        lead.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : lead.status === "contacted"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFollowUps.map((followUp) => (
                <div key={followUp.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{followUp.customer}</p>
                      <p className="text-sm text-muted-foreground">{followUp.date}</p>
                    </div>
                  </div>
                  <div>
                    {followUp.priority === "high" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : followUp.priority === "medium" ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
