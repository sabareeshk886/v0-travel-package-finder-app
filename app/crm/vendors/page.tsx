"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Building2, Phone, Mail, MapPin, Star } from "lucide-react"
import { getVendors } from "@/lib/crm-actions"
import Link from "next/link"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    loadVendors()
  }, [categoryFilter])

  const loadVendors = async () => {
    setLoading(true)
    const filters: any = { isActive: true }
    if (categoryFilter !== "all") filters.category = categoryFilter
    if (searchTerm) filters.search = searchTerm

    const result = await getVendors(filters)
    if (result.success) {
      setVendors(result.data)
    }
    setLoading(false)
  }

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Hotel: "bg-blue-100 text-blue-700",
      Transportation: "bg-green-100 text-green-700",
      Restaurant: "bg-orange-100 text-orange-700",
      Guide: "bg-purple-100 text-purple-700",
      "Activity Provider": "bg-pink-100 text-pink-700",
      Other: "bg-gray-100 text-gray-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage your travel service providers</p>
        </div>
        <Link href="/crm/vendors/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
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
                  placeholder="Search by name, contact person, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadVendors()}
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Guide">Guide</SelectItem>
                <SelectItem value="Activity Provider">Activity Provider</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadVendors}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Vendors List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading vendors...</p>
        </div>
      ) : vendors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No vendors found. Add your first vendor!</p>
            <Link href="/crm/vendors/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/crm/vendors/${vendor.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{vendor.vendor_name}</h3>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mt-2 ${getCategoryColor(vendor.category)}`}
                        >
                          {vendor.category}
                        </span>
                      </div>
                      {vendor.category === "Hotel" && vendor.hotel_category && (
                        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {vendor.hotel_category}
                        </div>
                      )}
                      {vendor.category !== "Hotel" && vendor.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {vendor.contact_person && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{vendor.contact_person}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{vendor.phone}</span>
                      </div>
                      {vendor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{vendor.email}</span>
                        </div>
                      )}
                      {vendor.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{vendor.address}</span>
                        </div>
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
