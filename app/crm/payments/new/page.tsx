"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { createPayment, getTrips } from "@/lib/crm-actions"
import Link from "next/link"

export default function NewPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripId = searchParams.get("tripId")

  const [loading, setLoading] = useState(false)
  const [trips, setTrips] = useState<any[]>([])

  const [formData, setFormData] = useState({
    trip_id: tripId || "defaultTripId", // Updated default value to be a non-empty string
    customer_name: "",
    payment_type: "received",
    payment_mode: "Cash",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    transaction_reference: "",
  })

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    const result = await getTrips({ status: "confirmed" })
    if (result.success) {
      setTrips(result.data)
      if (tripId && result.data.length > 0) {
        const selectedTrip = result.data.find((t) => t.id === tripId)
        if (selectedTrip) {
          setFormData((prev) => ({ ...prev, customer_name: selectedTrip.customer_name }))
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const paymentData = {
      trip_id: formData.trip_id || null,
      customer_name: formData.customer_name,
      payment_type: formData.payment_type,
      payment_mode: formData.payment_mode,
      amount: Number.parseFloat(formData.amount),
      payment_date: formData.payment_date,
      transaction_reference: formData.transaction_reference || null,
    }

    const result = await createPayment(paymentData)

    if (result.success) {
      router.push("/crm/payments")
    } else {
      alert("Error recording payment: " + result.error)
    }
    setLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "trip_id" && value) {
      const selectedTrip = trips.find((t) => t.id === value)
      if (selectedTrip) {
        setFormData((prev) => ({ ...prev, customer_name: selectedTrip.customer_name }))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/payments">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Record Payment</h1>
          <p className="text-muted-foreground">Add a new payment transaction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trip_id">Trip (Optional)</Label>
                <Select value={formData.trip_id} onValueChange={(value) => handleChange("trip_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defaultTripId">No Trip</SelectItem>{" "}
                    {/* Updated value to be a non-empty string */}
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.trip_number} - {trip.customer_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleChange("customer_name", e.target.value)}
                  required
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_type">
                  Payment Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.payment_type} onValueChange={(value) => handleChange("payment_type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_mode">
                  Payment Mode <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.payment_mode} onValueChange={(value) => handleChange("payment_mode", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">
                  Payment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => handleChange("payment_date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="transaction_reference">Transaction Reference / Notes</Label>
                <Textarea
                  id="transaction_reference"
                  value={formData.transaction_reference}
                  onChange={(e) => handleChange("transaction_reference", e.target.value)}
                  placeholder="e.g., TXN123456 or add payment notes here..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Recording..." : "Record Payment"}
              </Button>
              <Link href="/crm/payments">
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
