"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getHotels } from "@/lib/crm-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Phone, Mail, Star, Plus, Search } from "lucide-react"

export default function HotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")

  useEffect(() => {
    loadHotels()
  }, [categoryFilter, locationFilter])

  const loadHotels = async () => {
    setLoading(true)
    const result = await getHotels({
      category: categoryFilter === "all" ? undefined : categoryFilter,
      location: locationFilter === "all" ? undefined : locationFilter,
      search: searchTerm || undefined,
    })
    if (result.success) {
      setHotels(result.data)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    loadHotels()
  }

  const filteredHotels = hotels.filter((hotel) => {
    if (searchTerm) {
      return (
        hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return true
  })

  const hotelCategories = ["3 Star", "4 Star", "5 Star", "Resort", "Homestay", "Budget", "Luxury", "Boutique", "Other"]

  // Get unique locations from hotels
  const locations = Array.from(new Set(hotels.map((h) => h.location))).sort()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Hotels Management</h1>
          <p className="text-muted-foreground">Manage hotel partners and room configurations</p>
        </div>
        <Button onClick={() => router.push("/crm/hotels/new")}>
          <Plus className="mr-2 w-4 h-4" />
          Add Hotel
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="top-3 left-3 absolute w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search hotels by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {hotelCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="bg-muted rounded w-1/3 h-6" />
                <div className="bg-muted rounded w-1/2 h-4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No hotels found</h3>
            <p className="mb-4 text-muted-foreground text-sm">
              {searchTerm || categoryFilter !== "all" || locationFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first hotel"}
            </p>
            {searchTerm === "" && categoryFilter === "all" && locationFilter === "all" && (
              <Button onClick={() => router.push("/crm/hotels/new")}>
                <Plus className="mr-2 w-4 h-4" />
                Add Hotel
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/crm/hotels/${hotel.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {hotel.hotel_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </CardDescription>
                  </div>
                  <Badge variant={hotel.is_active ? "default" : "secondary"}>
                    {hotel.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{hotel.hotel_category}</span>
                </div>
                {hotel.contact_person && <div className="text-muted-foreground text-sm">{hotel.contact_person}</div>}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4" />
                  {hotel.contact_number}
                </div>
                {hotel.email && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="w-4 h-4" />
                    {hotel.email}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
