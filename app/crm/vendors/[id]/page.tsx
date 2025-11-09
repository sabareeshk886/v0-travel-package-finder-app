"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Mail, MapPin, Star, Plus, Trash2, Edit, Save, X } from "lucide-react"
import {
  getVendors,
  getVendorPriceLists,
  createVendorPriceList,
  deleteVendorPriceList,
  updateVendor,
  deleteVendor,
  getVendorRoomConfigs,
  createVendorRoomConfig,
  updateVendorRoomConfig,
  deleteVendorRoomConfig,
} from "@/lib/crm-actions"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vendorId = params.id as string

  const [vendor, setVendor] = useState<any>(null)
  const [priceLists, setPriceLists] = useState<any[]>([])
  const [roomConfigs, setRoomConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPriceForm, setShowPriceForm] = useState(false)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})

  const [roomData, setRoomData] = useState({
    room_category: "",
    room_sharing_type: "",
    meal_plan: "",
    room_capacity: "",
    price_per_night: "",
    extra_bed_price: "",
    child_6_12_without_bed_rate: "",
    child_6_12_with_bed_rate: "",
    adult_above_12_rate: "",
    availability_status: "Available",
  })

  const [priceData, setPriceData] = useState({
    item_name: "",
    location: "",
    season: "All-Year",
    rate_type: "Per Room",
    rate: "",
    valid_from: "",
    valid_to: "",
    notes: "",
  })

  useEffect(() => {
    if (vendorId === "new") {
      router.replace("/crm/vendors/new")
      return
    }
    loadVendorData()
  }, [vendorId])

  const loadVendorData = async () => {
    if (vendorId === "new") {
      return
    }
    setLoading(true)
    const result = await getVendors()
    if (result.success) {
      const foundVendor = result.data.find((v: any) => v.id === vendorId)
      setVendor(foundVendor)
      setEditData(foundVendor)
    }

    const priceResult = await getVendorPriceLists(vendorId)
    if (priceResult.success) {
      setPriceLists(priceResult.data)
    }

    const roomResult = await getVendorRoomConfigs(vendorId)
    if (roomResult.success) {
      setRoomConfigs(roomResult.data)
    }

    setLoading(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData(vendor)
  }

  const handleSaveEdit = async () => {
    const result = await updateVendor(vendorId, editData)
    if (result.success) {
      setVendor(result.data)
      setIsEditing(false)
      alert("Vendor updated successfully!")
    } else {
      alert(`Error updating vendor: ${result.error}`)
    }
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${vendor.vendor_name}? This action cannot be undone.`)) {
      const result = await deleteVendor(vendorId)
      if (result.success) {
        alert("Vendor deleted successfully!")
        router.push("/crm/vendors")
      } else {
        alert(`Error deleting vendor: ${result.error}`)
      }
    }
  }

  const handleAddPriceList = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await createVendorPriceList({
      vendor_id: vendorId,
      ...priceData,
      rate: Number.parseFloat(priceData.rate),
    })

    if (result.success) {
      setPriceData({
        item_name: "",
        location: "",
        season: "All-Year",
        rate_type: "Per Room",
        rate: "",
        valid_from: "",
        valid_to: "",
        notes: "",
      })
      setShowPriceForm(false)
      loadVendorData()
    }
  }

  const handleDeletePriceList = async (priceId: string) => {
    if (confirm("Are you sure you want to delete this price list item?")) {
      await deleteVendorPriceList(priceId)
      loadVendorData()
    }
  }

  const handleAddRoomConfig = async (e: React.FormEvent) => {
    e.preventDefault()

    const roomConfigData = {
      vendor_id: vendorId,
      room_category: roomData.room_category,
      room_sharing_type: roomData.room_sharing_type,
      meal_plan: roomData.meal_plan,
      room_capacity: roomData.room_capacity ? Number.parseInt(roomData.room_capacity) : null,
      price_per_night: roomData.price_per_night ? Number.parseFloat(roomData.price_per_night) : null,
      extra_bed_price: roomData.extra_bed_price ? Number.parseFloat(roomData.extra_bed_price) : null,
      child_6_12_without_bed_rate: roomData.child_6_12_without_bed_rate
        ? Number.parseFloat(roomData.child_6_12_without_bed_rate)
        : null,
      child_6_12_with_bed_rate: roomData.child_6_12_with_bed_rate
        ? Number.parseFloat(roomData.child_6_12_with_bed_rate)
        : null,
      adult_above_12_rate: roomData.adult_above_12_rate ? Number.parseFloat(roomData.adult_above_12_rate) : null,
      availability_status: roomData.availability_status,
    }

    let result
    if (editingRoomId) {
      result = await updateVendorRoomConfig(editingRoomId, roomConfigData)
    } else {
      result = await createVendorRoomConfig(roomConfigData)
    }

    if (result.success) {
      setRoomData({
        room_category: "",
        room_sharing_type: "",
        meal_plan: "",
        room_capacity: "",
        price_per_night: "",
        extra_bed_price: "",
        child_6_12_without_bed_rate: "",
        child_6_12_with_bed_rate: "",
        adult_above_12_rate: "",
        availability_status: "Available",
      })
      setShowRoomForm(false)
      setEditingRoomId(null)
      loadVendorData()
      alert(editingRoomId ? "Room configuration updated successfully!" : "Room configuration added successfully!")
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleEditRoomConfig = (room: any) => {
    setEditingRoomId(room.id)
    setRoomData({
      room_category: room.room_category || "",
      room_sharing_type: room.room_sharing_type || "",
      meal_plan: room.meal_plan || "",
      room_capacity: room.room_capacity?.toString() || "",
      price_per_night: room.price_per_night?.toString() || "",
      extra_bed_price: room.extra_bed_price?.toString() || "",
      child_6_12_without_bed_rate: room.child_6_12_without_bed_rate?.toString() || "",
      child_6_12_with_bed_rate: room.child_6_12_with_bed_rate?.toString() || "",
      adult_above_12_rate: room.adult_above_12_rate?.toString() || "",
      availability_status: room.availability_status || "Available",
    })
    setShowRoomForm(true)
  }

  const handleDeleteRoomConfig = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room configuration?")) {
      const result = await deleteVendorRoomConfig(roomId)
      if (result.success) {
        loadVendorData()
        alert("Room configuration deleted successfully!")
      } else {
        alert(`Error: ${result.error}`)
      }
    }
  }

  const handleCancelRoomForm = () => {
    setShowRoomForm(false)
    setEditingRoomId(null)
    setRoomData({
      room_category: "",
      room_sharing_type: "",
      meal_plan: "",
      room_capacity: "",
      price_per_night: "",
      extra_bed_price: "",
      child_6_12_without_bed_rate: "",
      child_6_12_with_bed_rate: "",
      adult_above_12_rate: "",
      availability_status: "Available",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Hotel: "bg-blue-100 text-blue-700 border-blue-200",
      Transport: "bg-green-100 text-green-700 border-green-200",
      Restaurant: "bg-orange-100 text-orange-700 border-orange-200",
      Guide: "bg-purple-100 text-purple-700 border-purple-200",
      "Activity Provider": "bg-pink-100 text-pink-700 border-pink-200",
      Other: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/crm/vendors">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Vendor Not Found</h1>
            <p className="text-muted-foreground">The vendor you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/vendors">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{vendor.vendor_name}</h1>
            {vendor.place && <p className="text-muted-foreground">📍 {vendor.place}</p>}
            {!vendor.place && <p className="text-muted-foreground">Vendor Details</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getCategoryColor(vendor.category)}`}
          >
            {vendor.category}
          </span>
          {!isEditing && (
            <>
              <Button variant="outline" size="icon" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveEdit}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {vendor.category === "Hotel" && <TabsTrigger value="rooms">Room Configs ({roomConfigs.length})</TabsTrigger>}
          <TabsTrigger value="pricing">Price Lists ({priceLists.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Vendor Name</Label>
                    <Input
                      value={editData.vendor_name || ""}
                      onChange={(e) => setEditData({ ...editData, vendor_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Place</Label>
                    <Input
                      value={editData.place || ""}
                      onChange={(e) => setEditData({ ...editData, place: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      value={editData.contact_person || ""}
                      onChange={(e) => setEditData({ ...editData, contact_person: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {vendor.contact_person && (
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{vendor.contact_person}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{vendor.phone}</p>
                    </div>
                  </div>
                  {vendor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{vendor.email}</p>
                      </div>
                    </div>
                  )}
                  {vendor.rating && (
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-medium">{vendor.rating} / 5</p>
                      </div>
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{vendor.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>GST Number</Label>
                    <Input
                      value={editData.gst_number || ""}
                      onChange={(e) => setEditData({ ...editData, gst_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Input
                      value={editData.payment_terms || ""}
                      onChange={(e) => setEditData({ ...editData, payment_terms: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={editData.notes || ""}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {vendor.gst_number && (
                    <div>
                      <p className="text-sm text-muted-foreground">GST Number</p>
                      <p className="font-medium">{vendor.gst_number}</p>
                    </div>
                  )}
                  {vendor.payment_terms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Terms</p>
                      <p className="font-medium">{vendor.payment_terms}</p>
                    </div>
                  )}
                  {vendor.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{vendor.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {vendor.category === "Hotel" && (
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Room Configurations</CardTitle>
                <Button size="sm" onClick={() => setShowRoomForm(!showRoomForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room Type
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showRoomForm && (
                  <form onSubmit={handleAddRoomConfig} className="border rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold">
                      {editingRoomId ? "Edit Room Configuration" : "Add Room Configuration"}
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="room_category">Room Category *</Label>
                        <Input
                          id="room_category"
                          value={roomData.room_category}
                          onChange={(e) => setRoomData({ ...roomData, room_category: e.target.value })}
                          placeholder="e.g., Deluxe, Suite, Standard"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="room_sharing_type">Sharing Type *</Label>
                        <Select
                          value={roomData.room_sharing_type}
                          onValueChange={(value) => setRoomData({ ...roomData, room_sharing_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sharing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Double">Double</SelectItem>
                            <SelectItem value="Triple">Triple</SelectItem>
                            <SelectItem value="Quad">Quad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meal_plan">Meal Plan *</Label>
                        <Select
                          value={roomData.meal_plan}
                          onValueChange={(value) => setRoomData({ ...roomData, meal_plan: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EP">EP (Room Only)</SelectItem>
                            <SelectItem value="CP">CP (Breakfast)</SelectItem>
                            <SelectItem value="MAP">MAP (Breakfast + Lunch/Dinner)</SelectItem>
                            <SelectItem value="AP">AP (All Meals)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="room_capacity">Room Capacity</Label>
                        <Input
                          id="room_capacity"
                          type="number"
                          value={roomData.room_capacity}
                          onChange={(e) => setRoomData({ ...roomData, room_capacity: e.target.value })}
                          placeholder="Max persons"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price_per_night">Price per Night (₹) *</Label>
                        <Input
                          id="price_per_night"
                          type="number"
                          step="0.01"
                          value={roomData.price_per_night}
                          onChange={(e) => setRoomData({ ...roomData, price_per_night: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="extra_bed_price">Extra Bed Price (₹)</Label>
                        <Input
                          id="extra_bed_price"
                          type="number"
                          step="0.01"
                          value={roomData.extra_bed_price}
                          onChange={(e) => setRoomData({ ...roomData, extra_bed_price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="child_6_12_without_bed_rate">Child 6-12 yrs Without Bed (₹)</Label>
                        <Input
                          id="child_6_12_without_bed_rate"
                          type="number"
                          step="0.01"
                          value={roomData.child_6_12_without_bed_rate}
                          onChange={(e) => setRoomData({ ...roomData, child_6_12_without_bed_rate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="child_6_12_with_bed_rate">Child 6-12 yrs With Bed (₹)</Label>
                        <Input
                          id="child_6_12_with_bed_rate"
                          type="number"
                          step="0.01"
                          value={roomData.child_6_12_with_bed_rate}
                          onChange={(e) => setRoomData({ ...roomData, child_6_12_with_bed_rate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adult_above_12_rate">Adult Above 12 yrs (₹)</Label>
                        <Input
                          id="adult_above_12_rate"
                          type="number"
                          step="0.01"
                          value={roomData.adult_above_12_rate}
                          onChange={(e) => setRoomData({ ...roomData, adult_above_12_rate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="availability_status">Availability</Label>
                        <Select
                          value={roomData.availability_status}
                          onValueChange={(value) => setRoomData({ ...roomData, availability_status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Sold Out">Sold Out</SelectItem>
                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        {editingRoomId ? "Update" : "Save"}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelRoomForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {roomConfigs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No room configurations added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {roomConfigs.map((room) => (
                      <div key={room.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{room.room_category}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-muted-foreground">
                              <p>Sharing: {room.room_sharing_type}</p>
                              <p>Meal: {room.meal_plan}</p>
                              <p>Capacity: {room.room_capacity}</p>
                              <p className="font-semibold text-foreground">₹{room.price_per_night}/night</p>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground space-y-1">
                              {room.extra_bed_price && <p>Extra Bed: ₹{room.extra_bed_price}</p>}
                              {room.child_6_12_without_bed_rate && (
                                <p>Child 6-12 yrs Without Bed: ₹{room.child_6_12_without_bed_rate}</p>
                              )}
                              {room.child_6_12_with_bed_rate && (
                                <p>Child 6-12 yrs With Bed: ₹{room.child_6_12_with_bed_rate}</p>
                              )}
                              {room.adult_above_12_rate && <p>Adult Above 12 yrs: ₹{room.adult_above_12_rate}</p>}
                              {room.availability_status && (
                                <p
                                  className={
                                    room.availability_status === "Available" ? "text-green-600" : "text-red-600"
                                  }
                                >
                                  Status: {room.availability_status}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRoomConfig(room)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRoomConfig(room.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Price Lists</CardTitle>
              <Button size="sm" onClick={() => setShowPriceForm(!showPriceForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Price
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showPriceForm && (
                <form onSubmit={handleAddPriceList} className="border rounded-lg p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="item_name">Item Name</Label>
                      <Input
                        id="item_name"
                        value={priceData.item_name}
                        onChange={(e) => setPriceData({ ...priceData, item_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={priceData.location}
                        onChange={(e) => setPriceData({ ...priceData, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Select
                        value={priceData.season}
                        onValueChange={(value) => setPriceData({ ...priceData, season: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Peak">Peak</SelectItem>
                          <SelectItem value="Off-Peak">Off-Peak</SelectItem>
                          <SelectItem value="All-Year">All-Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate_type">Rate Type</Label>
                      <Select
                        value={priceData.rate_type}
                        onValueChange={(value) => setPriceData({ ...priceData, rate_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Per Room">Per Room</SelectItem>
                          <SelectItem value="Per Person">Per Person</SelectItem>
                          <SelectItem value="Per Vehicle">Per Vehicle</SelectItem>
                          <SelectItem value="Fixed">Fixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate (₹)</Label>
                      <Input
                        id="rate"
                        type="number"
                        value={priceData.rate}
                        onChange={(e) => setPriceData({ ...priceData, rate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valid_from">Valid From</Label>
                      <Input
                        id="valid_from"
                        type="date"
                        value={priceData.valid_from}
                        onChange={(e) => setPriceData({ ...priceData, valid_from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valid_to">Valid To</Label>
                      <Input
                        id="valid_to"
                        type="date"
                        value={priceData.valid_to}
                        onChange={(e) => setPriceData({ ...priceData, valid_to: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowPriceForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {priceLists.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No price lists added yet.</p>
              ) : (
                <div className="space-y-3">
                  {priceLists.map((price) => (
                    <div key={price.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{price.item_name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-muted-foreground">
                            {price.location && <p>Location: {price.location}</p>}
                            <p>Season: {price.season}</p>
                            <p>Type: {price.rate_type}</p>
                            <p className="font-semibold text-foreground">₹{price.rate.toLocaleString()}</p>
                          </div>
                          {(price.valid_from || price.valid_to) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Valid: {price.valid_from ? new Date(price.valid_from).toLocaleDateString() : "Anytime"} -{" "}
                              {price.valid_to ? new Date(price.valid_to).toLocaleDateString() : "Ongoing"}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePriceList(price.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
