"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Phone, Mail, MapPin, Calendar, User, Filter } from "lucide-react"
import { getLeads } from "@/lib/crm-actions"
import Link from "next/link"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [assignedToFilter, setAssignedToFilter] = useState<string>("all")

  useEffect(() => {
    loadLeads()
  }, [statusFilter, assignedToFilter])

  const loadLeads = async () => {
    setLoading(true)
    const filters: any = {}
    if (statusFilter !== "all") filters.status = statusFilter
    if (assignedToFilter !== "all") filters.assignedTo = assignedToFilter
    if (searchTerm) filters.search = searchTerm

    const result = await getLeads(filters)
    if (result.success) {
      setLeads(result.data)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    loadLeads()
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      quoted: "bg-purple-100 text-purple-700",
      follow_up: "bg-orange-100 text-orange-700",
      confirmed: "bg-green-100 text-green-700",
      converted: "bg-teal-100 text-teal-700", // Added style
      lost: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      urgent: "text-red-600",
      high: "text-orange-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    }
    return colors[priority] || "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Manage and track all customer leads</p>
        </div>
        <Link href="/crm/leads/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
              <SelectTrigger className="w-full md:w-48">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All People</SelectItem>
                <SelectItem value="ANEES">ANEES</SelectItem>
                <SelectItem value="OFFICE">OFFICE</SelectItem>
                <SelectItem value="NIYAS">NIYAS</SelectItem>
                <SelectItem value="ARJUN">ARJUN</SelectItem>
                <SelectItem value="PRATHUSH">PRATHUSH</SelectItem>
                <SelectItem value="ANURANJ">ANURANJ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No leads found. Add your first lead to get started!</p>
            <Link href="/crm/leads/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <Link key={lead.id} href={`/crm/leads/${lead.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{lead.customerName}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(lead.status)}`}
                            >
                              {lead.status.replace("_", " ").toUpperCase()}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getPriorityColor(lead.priority)}`}
                            >
                              {lead.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {lead.destination && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{lead.destination}</span>
                          </div>
                        )}
                        {lead.travelDates && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{lead.travelDates}</span>
                          </div>
                        )}
                        {lead.assignedToName && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                              Assigned to:{" "}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setAssignedToFilter(lead.assignedToName)
                                }}
                                className="text-primary hover:underline font-medium"
                              >
                                {lead.assignedToName}
                              </button>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Created {new Date(lead.createdAt).toLocaleDateString()}</p>
                      {lead.noOfPax && <p className="mt-1">{lead.noOfPax} travelers</p>}
                      {lead.budget && <p className="mt-1">Budget: ₹{lead.budget.toLocaleString()}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
