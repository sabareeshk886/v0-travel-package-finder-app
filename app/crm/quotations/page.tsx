"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Calendar, DollarSign } from "lucide-react"
import { getQuotations } from "@/lib/crm-actions"
import Link from "next/link"

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadQuotations()
  }, [statusFilter])

  const loadQuotations = async () => {
    setLoading(true)
    const filters: any = {}
    if (statusFilter !== "all") filters.status = statusFilter
    if (searchTerm) filters.search = searchTerm

    const result = await getQuotations(filters)
    if (result.success) {
      setQuotations(result.data)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      revised: "bg-yellow-100 text-yellow-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">Manage trip quotations and proposals</p>
        </div>
        <Link href="/crm/quotations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Quotation
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
                  placeholder="Search by quotation number..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadQuotations()}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="revised">Revised</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadQuotations}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotations List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading quotations...</p>
        </div>
      ) : quotations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No quotations found. Create your first quotation!</p>
            <Link href="/crm/quotations/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotations.map((quotation) => (
            <Link key={quotation.id} href={`/crm/quotations/${quotation.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{quotation.quotation_number}</h3>
                          {quotation.lead && <p className="text-muted-foreground">{quotation.lead.customer_name}</p>}
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mt-2 ${getStatusColor(quotation.status)}`}
                          >
                            {quotation.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{quotation.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{quotation.travel_dates}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">₹{quotation.grand_total?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Created {new Date(quotation.created_at).toLocaleDateString()}</p>
                      <p className="mt-1">{quotation.no_of_pax} travelers</p>
                      {quotation.validity_date && (
                        <p className="mt-1">Valid till {new Date(quotation.validity_date).toLocaleDateString()}</p>
                      )}
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
