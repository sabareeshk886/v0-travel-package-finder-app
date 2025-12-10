"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Plane, Calendar, Phone, MapPin } from "lucide-react"
import { getTrips } from "@/lib/crm-actions"
import Link from "next/link"

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadTrips()
  }, [statusFilter])

  const loadTrips = async () => {
    setLoading(true)
    const filters: any = {}
    if (statusFilter !== "all") filters.status = statusFilter
    if (searchTerm) filters.search = searchTerm

    const result = await getTrips(filters)
    if (result.success) {
      setTrips(result.data)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      confirmed: "bg-blue-100 text-blue-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trips</h1>
          <p className="text-muted-foreground">Manage confirmed trips and bookings</p>
        </div>
        <Link href="/crm/trips/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trip
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
                  placeholder="Search by trip number, customer, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadTrips()}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadTrips}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Trips List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No trips found. Add your first trip!</p>
            <Link href="/crm/trips/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Trip
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/crm/trips/${trip.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{trip.trip_number}</h3>
                          <p className="text-muted-foreground">{trip.customer_name}</p>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mt-2 ${getStatusColor(trip.status)}`}
                          >
                            {trip.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(trip.pickup_date).toLocaleDateString()} -{" "}
                            {new Date(trip.dropoff_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{trip.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-lg font-bold">₹{trip.grand_total?.toLocaleString()}</p>
                      <p className="text-muted-foreground mt-1">{trip.no_of_pax} travelers</p>
                      {trip.coordinator && (
                        <p className="text-muted-foreground mt-1">Coordinator: {trip.coordinator.full_name}</p>
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
