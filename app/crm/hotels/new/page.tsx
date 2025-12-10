"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createHotel, createRoomConfig } from "@/lib/crm-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Building2, Bed } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RoomConfig {
  id: string
  room_category: string
  room_sharing_type: string
  meal_plan: string
  room_capacity: number
  price_per_night: number
  extra_bed_price: number
  child_policy: string
  availability_status: string
}

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Hotel basic details
  const [hotelName, setHotelName] = useState("")
  const [location, setLocation] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [email, setEmail] = useState("")
  const [hotelCategory, setHotelCategory] = useState("")
  const [notes, setNotes] = useState("")

  // Room configurations
  const [roomConfigs, setRoomConfigs] = useState<RoomConfig[]>([
    {
      id: "1",
      room_category: "",
      room_sharing_type: "Double",
      meal_plan: "EP",
      room_capacity: 2,
      price_per_night: 0,
      extra_bed_price: 0,
      child_policy: "",
      availability_status: "Available",
    },
  ])

  const hotelCategories = ["3 Star", "4 Star", "5 Star", "Resort", "Homestay", "Budget", "Luxury", "Boutique", "Other"]
  const sharingTypes = ["Single", "Double", "Triple", "Quad"]
  const mealPlans = [
    { value: "EP", label: "EP (Room Only)" },
    { value: "CP", label: "CP (Breakfast)" },
    { value: "MAP", label: "MAP (Breakfast + Dinner)" },
    { value: "AP", label: "AP (All Meals)" },
  ]

  const addRoomConfig = () => {
    setRoomConfigs([
      ...roomConfigs,
      {
        id: Date.now().toString(),
        room_category: "",
        room_sharing_type: "Double",
        meal_plan: "EP",
        room_capacity: 2,
        price_per_night: 0,
        extra_bed_price: 0,
        child_policy: "",
        availability_status: "Available",
      },
    ])
  }

  const removeRoomConfig = (id: string) => {
    setRoomConfigs(roomConfigs.filter((config) => config.id !== id))
  }

  const updateRoomConfig = (id: string, field: string, value: any) => {
    setRoomConfigs(
      roomConfigs.map((config) =>
        config.id === id
          ? {
              ...config,
              [field]: value,
            }
          : config,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate basic details
      if (!hotelName || !location || !contactNumber || !hotelCategory) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      // Create hotel
      const hotelResult = await createHotel({
        hotel_name: hotelName,
        location,
        contact_person: contactPerson || undefined,
        contact_number: contactNumber,
        email: email || undefined,
        hotel_category: hotelCategory,
        notes: notes || undefined,
      })

      if (!hotelResult.success) {
        setError(hotelResult.error || "Failed to create hotel")
        setLoading(false)
        return
      }

      const hotelId = hotelResult.data.id

      // Create room configurations
      for (const config of roomConfigs) {
        if (config.room_category && config.price_per_night > 0) {
          await createRoomConfig({
            hotel_id: hotelId,
            room_category: config.room_category,
            room_sharing_type: config.room_sharing_type,
            meal_plan: config.meal_plan,
            room_capacity: config.room_capacity,
            price_per_night: config.price_per_night,
            extra_bed_price: config.extra_bed_price || 0,
            child_policy: config.child_policy || undefined,
            availability_status: config.availability_status,
          })
        }
      }

      router.push(`/crm/hotels/${hotelId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-bold text-3xl">Add New Hotel</h1>
          <p className="text-muted-foreground">Create a new hotel with room configurations</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hotel Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Hotel Basic Details
            </CardTitle>
            <CardDescription>Enter the basic information about the hotel</CardDescription>
          </CardHeader>
          <CardContent className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hotelName">
                Hotel Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hotelName"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Enter hotel name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location (City / Destination) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Munnar, Kerala"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Manager name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hotel@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Hotel Category <span className="text-destructive">*</span>
              </Label>
              <Select value={hotelCategory} onValueChange={setHotelCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {hotelCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes / Remarks</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about the hotel..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Room Configurations */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  Room Configurations
                </CardTitle>
                <CardDescription>Add different room types and their pricing</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addRoomConfig}>
                <Plus className="mr-2 w-4 h-4" />
                Add Room Type
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomConfigs.map((config, index) => (
              <Card key={config.id} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Room Type {index + 1}</CardTitle>
                    {roomConfigs.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeRoomConfig(config.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="gap-4 grid grid-cols-1 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Room Category *</Label>
                    <Input
                      value={config.room_category}
                      onChange={(e) => updateRoomConfig(config.id, "room_category", e.target.value)}
                      placeholder="e.g., Deluxe, Suite"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Room Sharing Type *</Label>
                    <Select
                      value={config.room_sharing_type}
                      onValueChange={(value) => updateRoomConfig(config.id, "room_sharing_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sharingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Meal Plan *</Label>
                    <Select
                      value={config.meal_plan}
                      onValueChange={(value) => updateRoomConfig(config.id, "meal_plan", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mealPlans.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Room Capacity *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={config.room_capacity}
                      onChange={(e) =>
                        updateRoomConfig(config.id, "room_capacity", Number.parseInt(e.target.value) || 1)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price per Night (₹) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={config.price_per_night}
                      onChange={(e) =>
                        updateRoomConfig(config.id, "price_per_night", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Extra Bed Price (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={config.extra_bed_price}
                      onChange={(e) =>
                        updateRoomConfig(config.id, "extra_bed_price", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Availability Status</Label>
                    <Select
                      value={config.availability_status}
                      onValueChange={(value) => updateRoomConfig(config.id, "availability_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label>Child Policy</Label>
                    <Textarea
                      value={config.child_policy}
                      onChange={(e) => updateRoomConfig(config.id, "child_policy", e.target.value)}
                      placeholder="e.g., Children below 5 years free, 5-12 years 50% of room rate"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Hotel"}
          </Button>
        </div>
      </form>
    </div>
  )
}
