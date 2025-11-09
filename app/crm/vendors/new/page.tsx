"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { createVendor } from "@/lib/crm-actions"
import Link from "next/link"

export default function NewVendorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    vendor_name: "",
    category: "Hotel",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
    payment_terms: "",
    rating: "",
    hotel_category: "",
    notes: "",
  })

  const [roomConfigs, setRoomConfigs] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const vendorData: any = {
        ...formData,
        rating: formData.category !== "Hotel" && formData.rating ? Number.parseInt(formData.rating) : null,
        hotel_category: formData.category === "Hotel" ? formData.hotel_category : null,
        is_active: true,
      }

      // Remove empty fields
      Object.keys(vendorData).forEach((key) => {
        if (vendorData[key] === "" || vendorData[key] === null) {
          delete vendorData[key]
        }
      })

      console.log("[v0] Creating vendor with data:", vendorData)

      const result = await createVendor(vendorData, formData.category === "Hotel" ? roomConfigs : undefined)

      console.log("[v0] Create vendor result:", result)

      if (result.success) {
        console.log("[v0] Vendor created successfully, redirecting...")
        router.push("/crm/vendors")
        router.refresh()
      } else {
        setError(result.error || "Unknown error occurred")
        console.error("[v0] Error creating vendor:", result.error)
        setLoading(false)
      }
    } catch (err) {
      console.error("[v0] Exception in handleSubmit:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addRoomConfig = () => {
    setRoomConfigs([
      ...roomConfigs,
      {
        room_category: "",
        room_sharing_type: "",
        meal_plan: "",
        room_capacity: "",
        price_per_night: "",
        extra_bed_price: "",
        child_policy: "",
        availability_status: "Available",
      },
    ])
  }

  const removeRoomConfig = (index: number) => {
    setRoomConfigs(roomConfigs.filter((_, i) => i !== index))
  }

  const updateRoomConfig = (index: number, field: string, value: string) => {
    const updated = [...roomConfigs]
    updated[index] = { ...updated[index], [field]: value }
    setRoomConfigs(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/vendors">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Vendor</h1>
          <p className="text-muted-foreground">Register a new service provider</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
                  <p className="font-semibold">Error creating vendor:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendor_name">
                    Vendor Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vendor_name"
                    value={formData.vendor_name}
                    onChange={(e) => handleChange("vendor_name", e.target.value)}
                    required
                    placeholder="Enter vendor/property name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Guide">Guide</SelectItem>
                      <SelectItem value="Activity Provider">Activity Provider</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleChange("contact_person", e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    placeholder="Mobile or landline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Official email"
                  />
                </div>

                {formData.category === "Hotel" ? (
                  <div className="space-y-2">
                    <Label htmlFor="hotel_category">Hotel Category</Label>
                    <Select
                      value={formData.hotel_category}
                      onValueChange={(value) => handleChange("hotel_category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hotel category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2 Star">2 Star</SelectItem>
                        <SelectItem value="3 Star">3 Star</SelectItem>
                        <SelectItem value="4 Star">4 Star</SelectItem>
                        <SelectItem value="5 Star">5 Star</SelectItem>
                        <SelectItem value="Resort">Resort</SelectItem>
                        <SelectItem value="Homestay">Homestay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleChange("rating", e.target.value)}
                      placeholder="Numeric rating"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={2}
                  placeholder="Full address with location"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    value={formData.gst_number}
                    onChange={(e) => handleChange("gst_number", e.target.value)}
                    placeholder="Optional alphanumeric"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Input
                    id="payment_terms"
                    value={formData.payment_terms}
                    onChange={(e) => handleChange("payment_terms", e.target.value)}
                    placeholder="e.g., 50% Advance / Balance on Arrival"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                  placeholder="Remarks, special conditions, or seasonal info..."
                />
              </div>
            </CardContent>
          </Card>

          {formData.category === "Hotel" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Room Configurations</CardTitle>
                  <Button type="button" onClick={addRoomConfig} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {roomConfigs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No room configurations added. Click "Add Room Type" to configure rooms.
                  </p>
                ) : (
                  roomConfigs.map((config, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Room Type {index + 1}</h4>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeRoomConfig(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>Room Category</Label>
                            <Input
                              value={config.room_category}
                              onChange={(e) => updateRoomConfig(index, "room_category", e.target.value)}
                              placeholder="e.g., Deluxe, Suite"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Sharing Type</Label>
                            <Select
                              value={config.room_sharing_type}
                              onValueChange={(value) => updateRoomConfig(index, "room_sharing_type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select sharing" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Double">Double</SelectItem>
                                <SelectItem value="Triple">Triple</SelectItem>
                                <SelectItem value="Quad">Quad</SelectItem>
                                <SelectItem value="Dormitory">Dormitory</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Meal Plan</Label>
                            <Select
                              value={config.meal_plan}
                              onValueChange={(value) => updateRoomConfig(index, "meal_plan", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select meal plan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EP">EP (Room Only)</SelectItem>
                                <SelectItem value="CP">CP (Breakfast)</SelectItem>
                                <SelectItem value="MAP">MAP (Breakfast + Dinner)</SelectItem>
                                <SelectItem value="AP">AP (All Meals)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Room Capacity</Label>
                            <Input
                              type="number"
                              value={config.room_capacity}
                              onChange={(e) => updateRoomConfig(index, "room_capacity", e.target.value)}
                              placeholder="Max persons"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Price Per Night (₹)</Label>
                            <Input
                              type="number"
                              value={config.price_per_night}
                              onChange={(e) => updateRoomConfig(index, "price_per_night", e.target.value)}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Extra Bed Price (₹)</Label>
                            <Input
                              type="number"
                              value={config.extra_bed_price}
                              onChange={(e) => updateRoomConfig(index, "extra_bed_price", e.target.value)}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Child Policy</Label>
                            <Input
                              value={config.child_policy}
                              onChange={(e) => updateRoomConfig(index, "child_policy", e.target.value)}
                              placeholder="e.g., Below 5 years free, 5-12 years 50%"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Availability</Label>
                            <Select
                              value={config.availability_status}
                              onValueChange={(value) => updateRoomConfig(index, "availability_status", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Limited">Limited</SelectItem>
                                <SelectItem value="Not Available">Not Available</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Vendor"}
            </Button>
            <Link href="/crm/vendors">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
