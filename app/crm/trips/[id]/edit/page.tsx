"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { getTrips, updateTrip, getUsers } from "@/lib/crm-actions"
import Link from "next/link"

export default function EditTripPage() {
    const router = useRouter()
    const params = useParams()
    const tripId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [coordinators, setCoordinators] = useState<any[]>([])
    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        email: "",
        destination: "",
        pickup_date: "",
        dropoff_date: "",
        pickup_point: "",
        no_of_days: "",
        no_of_pax: "",
        per_head_rate: "",
        total_amount: "",
        gst_amount: "",
        grand_total: "",
        bus_details: "",
        driver_name: "",
        trip_coordinator: "",
        package_details: "",
        status: "",
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [tripsResult, usersResult] = await Promise.all([getTrips({}), getUsers()])

        if (tripsResult.success) {
            const trip = tripsResult.data.find((t: any) => t.id === tripId)
            if (trip) {
                setFormData({
                    customer_name: trip.customer_name || "",
                    phone: trip.phone || "",
                    email: trip.email || "",
                    destination: trip.destination || "",
                    pickup_date: trip.pickup_date || "",
                    dropoff_date: trip.dropoff_date || "",
                    pickup_point: trip.pickup_point || "",
                    no_of_days: trip.no_of_days?.toString() || "",
                    no_of_pax: trip.no_of_pax?.toString() || "",
                    per_head_rate: trip.per_head_rate?.toString() || "",
                    total_amount: trip.total_amount?.toString() || "",
                    gst_amount: trip.gst_amount?.toString() || "",
                    grand_total: trip.grand_total?.toString() || "",
                    bus_details: trip.bus_details || "",
                    driver_name: trip.driver_name || "",
                    trip_coordinator: trip.trip_coordinator || "",
                    package_details: trip.package_details ? JSON.stringify(trip.package_details) : "",
                    status: trip.status || "confirmed",
                })
            }
        }

        if (usersResult.success) {
            setCoordinators(usersResult.data.filter((u: any) => u.role === "coordinator" || u.role === "admin"))
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const tripData: any = {
            ...formData,
            no_of_days: formData.no_of_days ? Number.parseInt(formData.no_of_days) : undefined,
            no_of_pax: formData.no_of_pax ? Number.parseInt(formData.no_of_pax) : undefined,
            per_head_rate: formData.per_head_rate ? Number.parseFloat(formData.per_head_rate) : undefined,
            total_amount: formData.total_amount ? Number.parseFloat(formData.total_amount) : undefined,
            gst_amount: formData.gst_amount ? Number.parseFloat(formData.gst_amount) : undefined,
            grand_total: formData.grand_total ? Number.parseFloat(formData.grand_total) : undefined,
            trip_coordinator: formData.trip_coordinator || null,
            package_details: formData.package_details ? JSON.parse(formData.package_details) : undefined,
        }

        // Remove empty fields
        Object.keys(tripData).forEach((key) => {
            if (tripData[key] === "" || tripData[key] === undefined) {
                delete tripData[key]
            }
        })

        const result = await updateTrip(tripId, tripData)

        if (result.success) {
            router.push(`/crm/trips/${tripId}`)
        } else {
            alert("Error updating trip: " + result.error)
        }
        setSaving(false)
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value }

            // Auto-calculate totals
            if (field === "per_head_rate" || field === "no_of_pax") {
                const rate = Number.parseFloat(field === "per_head_rate" ? value : updated.per_head_rate) || 0
                const pax = Number.parseInt(field === "no_of_pax" ? value : updated.no_of_pax) || 0
                const total = rate * pax
                const gst = total * 0.05 // 5% GST
                updated.total_amount = total.toString()
                updated.gst_amount = gst.toFixed(2)
                updated.grand_total = (total + gst).toFixed(2)
            }

            return updated
        })
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/crm/trips/${tripId}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Edit Trip</h1>
                    <p className="text-muted-foreground">Update trip details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Trip Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Customer Details */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="customer_name">
                                    Customer Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="customer_name"
                                    value={formData.customer_name}
                                    onChange={(e) => handleChange("customer_name", e.target.value)}
                                    required
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
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="destination">
                                    Destination <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="destination"
                                    value={formData.destination}
                                    onChange={(e) => handleChange("destination", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Trip Dates */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="pickup_date">
                                    Pickup Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="pickup_date"
                                    type="date"
                                    value={formData.pickup_date}
                                    onChange={(e) => handleChange("pickup_date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dropoff_date">
                                    Drop-off Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="dropoff_date"
                                    type="date"
                                    value={formData.dropoff_date}
                                    onChange={(e) => handleChange("dropoff_date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="no_of_days">Number of Days</Label>
                                <Input
                                    id="no_of_days"
                                    type="number"
                                    value={formData.no_of_days}
                                    onChange={(e) => handleChange("no_of_days", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickup_point">Pickup Point</Label>
                            <Input
                                id="pickup_point"
                                value={formData.pickup_point}
                                onChange={(e) => handleChange("pickup_point", e.target.value)}
                                placeholder="e.g., Bangalore City Centre"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="no_of_pax">
                                    Number of Travelers <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="no_of_pax"
                                    type="number"
                                    value={formData.no_of_pax}
                                    onChange={(e) => handleChange("no_of_pax", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="per_head_rate">
                                    Per Head Rate (₹) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="per_head_rate"
                                    type="number"
                                    value={formData.per_head_rate}
                                    onChange={(e) => handleChange("per_head_rate", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_amount">Total Amount (₹)</Label>
                                <Input id="total_amount" type="number" value={formData.total_amount} disabled />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gst_amount">GST Amount (₹)</Label>
                                <Input id="gst_amount" type="number" value={formData.gst_amount} disabled />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="grand_total">Grand Total (₹)</Label>
                                <Input id="grand_total" type="number" value={formData.grand_total} disabled className="font-bold" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Transport Details */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="bus_details">Bus Details</Label>
                                <Input
                                    id="bus_details"
                                    value={formData.bus_details}
                                    onChange={(e) => handleChange("bus_details", e.target.value)}
                                    placeholder="e.g., 45-seater Volvo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver_name">Driver Name</Label>
                                <Input
                                    id="driver_name"
                                    value={formData.driver_name}
                                    onChange={(e) => handleChange("driver_name", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="trip_coordinator">Trip Coordinator</Label>
                                <Select
                                    value={formData.trip_coordinator}
                                    onValueChange={(value) => handleChange("trip_coordinator", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select coordinator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {coordinators.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Package Details */}
                        <div className="space-y-2">
                            <Label htmlFor="package_details">Package Details (JSON format, optional)</Label>
                            <Textarea
                                id="package_details"
                                value={formData.package_details}
                                onChange={(e) => handleChange("package_details", e.target.value)}
                                rows={4}
                                placeholder='{"inclusions": ["Accommodation", "Meals"], "exclusions": ["Personal expenses"], "special_requirements": "...", "notes": "..."}'
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={saving}>
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                            <Link href={`/crm/trips/${tripId}`}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
