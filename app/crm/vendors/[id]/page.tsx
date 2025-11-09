"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Mail, MapPin, Star, Plus, Trash2 } from "lucide-react"
import { getVendors, getVendorPriceLists, createVendorPriceList, deleteVendorPriceList } from "@/lib/crm-actions"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vendorId = params.id as string

  const [vendor, setVendor] = useState<any>(null)
  const [priceLists, setPriceLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPriceForm, setShowPriceForm] = useState(false)

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
    }

    const priceResult = await getVendorPriceLists(vendorId)
    if (priceResult.success) {
      setPriceLists(priceResult.data)
    }
    setLoading(false)
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

  if (loading || !vendor) {
    return <div className="text-center py-12">Loading...</div>
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
            <p className="text-muted-foreground">Vendor Details</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getCategoryColor(vendor.category)}`}
        >
          {vendor.category}
        </span>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Price Lists ({priceLists.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              </div>
              {vendor.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{vendor.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              </div>
              {vendor.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{vendor.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
