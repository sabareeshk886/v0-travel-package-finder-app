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
  const [roomConfigs, setRoomConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})

  const [roomData, setRoomData] = useState({
    room_category: "",
    room_description: "",
    room_sharing_type: "",
    room_capacity: "",
    notes: "",
    availability_status: "Available",
    // Meal Plan Rates
    ep_room_rate: "",
    room_in_cp: "",
    room_in_map: "",
    room_in_ap: "",
    // CP Plan Extra Charges
    child_6_12_withoutbed_cp: "",
    child_6_12_withbed_cp: "",
    adult_above_12_cp: "",
    // MAP Plan Extra Charges
    child_6_12_withoutbed_map: "",
    child_6_12_withbed_map: "",
    adult_above_12_map: "",
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

  const handleAddRoomConfig = async (e: React.FormEvent) => {
    e.preventDefault()

    const roomConfigData = {
      vendor_id: vendorId,
      room_category: roomData.room_category,
      room_description: roomData.room_description || null,
      room_sharing_type: roomData.room_sharing_type,
      room_capacity: roomData.room_capacity ? Number.parseInt(roomData.room_capacity) : null,
      notes: roomData.notes || null,
      availability_status: roomData.availability_status,
      // Meal Plan Rates
      ep_room_rate: roomData.ep_room_rate ? Number.parseFloat(roomData.ep_room_rate) : null,
      room_in_cp: roomData.room_in_cp ? Number.parseFloat(roomData.room_in_cp) : null,
      room_in_map: roomData.room_in_map ? Number.parseFloat(roomData.room_in_map) : null,
      room_in_ap: roomData.room_in_ap ? Number.parseFloat(roomData.room_in_ap) : null,
      // CP Plan Extra Charges
      child_6_12_withoutbed_cp: roomData.child_6_12_withoutbed_cp
        ? Number.parseFloat(roomData.child_6_12_withoutbed_cp)
        : null,
      child_6_12_withbed_cp: roomData.child_6_12_withbed_cp ? Number.parseFloat(roomData.child_6_12_withbed_cp) : null,
      adult_above_12_cp: roomData.adult_above_12_cp ? Number.parseFloat(roomData.adult_above_12_cp) : null,
      // MAP Plan Extra Charges
      child_6_12_withoutbed_map: roomData.child_6_12_withoutbed_map
        ? Number.parseFloat(roomData.child_6_12_withoutbed_map)
        : null,
      child_6_12_withbed_map: roomData.child_6_12_withbed_map
        ? Number.parseFloat(roomData.child_6_12_withbed_map)
        : null,
      adult_above_12_map: roomData.adult_above_12_map ? Number.parseFloat(roomData.adult_above_12_map) : null,
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
        room_description: "",
        room_sharing_type: "",
        room_capacity: "",
        notes: "",
        availability_status: "Available",
        ep_room_rate: "",
        room_in_cp: "",
        room_in_map: "",
        room_in_ap: "",
        child_6_12_withoutbed_cp: "",
        child_6_12_withbed_cp: "",
        adult_above_12_cp: "",
        child_6_12_withoutbed_map: "",
        child_6_12_withbed_map: "",
        adult_above_12_map: "",
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
      room_description: room.room_description || "",
      room_sharing_type: room.room_sharing_type || "",
      room_capacity: room.room_capacity?.toString() || "",
      notes: room.notes || "",
      availability_status: room.availability_status || "Available",
      ep_room_rate: room.ep_room_rate?.toString() || "",
      room_in_cp: room.room_in_cp?.toString() || "",
      room_in_map: room.room_in_map?.toString() || "",
      room_in_ap: room.room_in_ap?.toString() || "",
      child_6_12_withoutbed_cp: room.child_6_12_withoutbed_cp?.toString() || "",
      child_6_12_withbed_cp: room.child_6_12_withbed_cp?.toString() || "",
      adult_above_12_cp: room.adult_above_12_cp?.toString() || "",
      child_6_12_withoutbed_map: room.child_6_12_withoutbed_map?.toString() || "",
      child_6_12_withbed_map: room.child_6_12_withbed_map?.toString() || "",
      adult_above_12_map: room.adult_above_12_map?.toString() || "",
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
      room_description: "",
      room_sharing_type: "",
      room_capacity: "",
      notes: "",
      availability_status: "Available",
      ep_room_rate: "",
      room_in_cp: "",
      room_in_map: "",
      room_in_ap: "",
      child_6_12_withoutbed_cp: "",
      child_6_12_withbed_cp: "",
      adult_above_12_cp: "",
      child_6_12_withoutbed_map: "",
      child_6_12_withbed_map: "",
      adult_above_12_map: "",
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

  const isHotel = vendor.category === "Hotel"

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

      {isHotel ? (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rooms">Room Config ({roomConfigs.length})</TabsTrigger>
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

                    {/* Basic Room Information */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold text-muted-foreground">Basic Information</h5>
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
                          <Label htmlFor="room_description">Room Description</Label>
                          <Input
                            id="room_description"
                            value={roomData.room_description}
                            onChange={(e) => setRoomData({ ...roomData, room_description: e.target.value })}
                            placeholder="e.g., Sea view, Garden facing"
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
                    </div>

                    {/* Meal Plan Rates */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold text-muted-foreground">Meal Plan Rates (Room Rates)</h5>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label htmlFor="ep_room_rate">EP Room Rate (₹)</Label>
                          <Input
                            id="ep_room_rate"
                            type="number"
                            step="0.01"
                            value={roomData.ep_room_rate}
                            onChange={(e) => setRoomData({ ...roomData, ep_room_rate: e.target.value })}
                            placeholder="Room Only"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room_in_cp">Room in CP (₹)</Label>
                          <Input
                            id="room_in_cp"
                            type="number"
                            step="0.01"
                            value={roomData.room_in_cp}
                            onChange={(e) => setRoomData({ ...roomData, room_in_cp: e.target.value })}
                            placeholder="With Breakfast"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room_in_map">Room in MAP (₹)</Label>
                          <Input
                            id="room_in_map"
                            type="number"
                            step="0.01"
                            value={roomData.room_in_map}
                            onChange={(e) => setRoomData({ ...roomData, room_in_map: e.target.value })}
                            placeholder="Breakfast + Dinner"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room_in_ap">Room in AP (₹)</Label>
                          <Input
                            id="room_in_ap"
                            type="number"
                            step="0.01"
                            value={roomData.room_in_ap}
                            onChange={(e) => setRoomData({ ...roomData, room_in_ap: e.target.value })}
                            placeholder="All Meals"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CP Plan Extra Charges */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold text-muted-foreground">CP Plan Extra Charges</h5>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="child_6_12_withoutbed_cp">Child 6-12 Without Bed CP (₹)</Label>
                          <Input
                            id="child_6_12_withoutbed_cp"
                            type="number"
                            step="0.01"
                            value={roomData.child_6_12_withoutbed_cp}
                            onChange={(e) => setRoomData({ ...roomData, child_6_12_withoutbed_cp: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="child_6_12_withbed_cp">Child 6-12 With Bed CP (₹)</Label>
                          <Input
                            id="child_6_12_withbed_cp"
                            type="number"
                            step="0.01"
                            value={roomData.child_6_12_withbed_cp}
                            onChange={(e) => setRoomData({ ...roomData, child_6_12_withbed_cp: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adult_above_12_cp">Adult Above 12 CP (₹)</Label>
                          <Input
                            id="adult_above_12_cp"
                            type="number"
                            step="0.01"
                            value={roomData.adult_above_12_cp}
                            onChange={(e) => setRoomData({ ...roomData, adult_above_12_cp: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* MAP Plan Extra Charges */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold text-muted-foreground">MAP Plan Extra Charges</h5>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="child_6_12_withoutbed_map">Child 6-12 Without Bed MAP (₹)</Label>
                          <Input
                            id="child_6_12_withoutbed_map"
                            type="number"
                            step="0.01"
                            value={roomData.child_6_12_withoutbed_map}
                            onChange={(e) => setRoomData({ ...roomData, child_6_12_withoutbed_map: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="child_6_12_withbed_map">Child 6-12 With Bed MAP (₹)</Label>
                          <Input
                            id="child_6_12_withbed_map"
                            type="number"
                            step="0.01"
                            value={roomData.child_6_12_withbed_map}
                            onChange={(e) => setRoomData({ ...roomData, child_6_12_withbed_map: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adult_above_12_map">Adult Above 12 MAP (₹)</Label>
                          <Input
                            id="adult_above_12_map"
                            type="number"
                            step="0.01"
                            value={roomData.adult_above_12_map}
                            onChange={(e) => setRoomData({ ...roomData, adult_above_12_map: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={roomData.notes}
                        onChange={(e) => setRoomData({ ...roomData, notes: e.target.value })}
                        placeholder="Additional information about this room type"
                        rows={2}
                      />
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
                            {room.room_description && (
                              <p className="text-sm text-muted-foreground">{room.room_description}</p>
                            )}
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <p className="text-muted-foreground">Sharing: {room.room_sharing_type}</p>
                              {room.room_capacity && (
                                <p className="text-muted-foreground">Capacity: {room.room_capacity}</p>
                              )}
                              <p
                                className={`text-sm ${
                                  room.availability_status === "Available" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {room.availability_status}
                              </p>
                            </div>

                            {/* Display Meal Plan Rates */}
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Meal Plan Rates</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                {room.ep_room_rate && <p>EP: ₹{room.ep_room_rate}</p>}
                                {room.room_in_cp && <p>CP: ₹{room.room_in_cp}</p>}
                                {room.room_in_map && <p>MAP: ₹{room.room_in_map}</p>}
                                {room.room_in_ap && <p>AP: ₹{room.room_in_ap}</p>}
                              </div>
                            </div>

                            {/* Display CP Extra Charges */}
                            {(room.child_6_12_withoutbed_cp ||
                              room.child_6_12_withbed_cp ||
                              room.adult_above_12_cp) && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">CP Plan Extras</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                  {room.child_6_12_withoutbed_cp && (
                                    <p>Child w/o Bed: ₹{room.child_6_12_withoutbed_cp}</p>
                                  )}
                                  {room.child_6_12_withbed_cp && <p>Child w/ Bed: ₹{room.child_6_12_withbed_cp}</p>}
                                  {room.adult_above_12_cp && <p>Adult: ₹{room.adult_above_12_cp}</p>}
                                </div>
                              </div>
                            )}

                            {/* Display MAP Extra Charges */}
                            {(room.child_6_12_withoutbed_map ||
                              room.child_6_12_withbed_map ||
                              room.adult_above_12_map) && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">MAP Plan Extras</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                  {room.child_6_12_withoutbed_map && (
                                    <p>Child w/o Bed: ₹{room.child_6_12_withoutbed_map}</p>
                                  )}
                                  {room.child_6_12_withbed_map && <p>Child w/ Bed: ₹{room.child_6_12_withbed_map}</p>}
                                  {room.adult_above_12_map && <p>Adult: ₹{room.adult_above_12_map}</p>}
                                </div>
                              </div>
                            )}

                            {room.notes && (
                              <p className="mt-2 text-xs text-muted-foreground border-t pt-2">{room.notes}</p>
                            )}
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
        </Tabs>
      ) : (
        <div className="space-y-6">
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
        </div>
      )}
    </div>
  )
}
