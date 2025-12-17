"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, CheckCircle2, Hotel } from "lucide-react"
import { getTrips, getPayments, createPayment, getTripRoomBookings } from "@/lib/crm-actions"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string

  const [trip, setTrip] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [roomBookings, setRoomBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentData, setPaymentData] = useState({
    payment_type: "advance",
    amount: 0,
    payment_mode: "cash",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  useEffect(() => {
    loadTripData()
  }, [tripId])

  const loadTripData = async () => {
    setLoading(true)
    const result = await getTrips({})
    if (result.success) {
      const foundTrip = result.data.find((t: any) => t.id === tripId)
      setTrip(foundTrip)

      if (foundTrip) {
        // Load payments if confirmed
        if (foundTrip.status === "confirmed") {
          const paymentsResult = await getPayments({ tripId })
          if (paymentsResult.success) {
            setPayments(paymentsResult.data)
          }
        }

        // Load room bookings
        const roomsResult = await getTripRoomBookings(tripId)
        if (roomsResult.success) {
          setRoomBookings(roomsResult.data)
        }
      }
    }

    setLoading(false)
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await createPayment({
      trip_id: tripId,
      customer_name: trip.customer_name,
      payment_type: paymentData.payment_type,
      payment_mode: paymentData.payment_mode,
      amount: paymentData.amount,
      payment_date: paymentData.payment_date,
      transaction_reference: paymentData.notes, // Store notes in transaction_reference field
    })

    if (result.success) {
      setPaymentData({
        payment_type: "advance",
        amount: 0,
        payment_mode: "cash",
        payment_date: new Date().toISOString().split("T")[0],
        notes: "",
      })
      setShowPaymentForm(false)
      loadTripData()
    } else {
      alert("Error adding payment: " + result.error)
    }
  }

  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  }

  const getBalanceDue = () => {
    return (trip?.grand_total || 0) - getTotalPaid()
  }

  if (loading || !trip) {
    return <div className="text-center py-12">Loading...</div>
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      in_progress: "bg-purple-100 text-purple-700 border-purple-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/trips">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{trip.trip_number}</h1>
            <p className="text-muted-foreground">{trip.customer_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border ${getStatusColor(trip.status)}`}
          >
            {trip.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Trip Details</TabsTrigger>
          {roomBookings.length > 0 && <TabsTrigger value="rooms">Room Details ({roomBookings.length})</TabsTrigger>}
          {trip.status === "confirmed" && <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>}
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{trip.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Travel Dates</p>
                  <p className="font-medium">
                    {new Date(trip.pickup_date).toLocaleDateString()} -{" "}
                    {new Date(trip.dropoff_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Travelers</p>
                  <p className="font-medium">{trip.no_of_pax} people</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{trip.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">₹{trip.grand_total?.toLocaleString()}</span>
              </div>
              {trip.status === "confirmed" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span className="font-medium text-green-600">₹{getTotalPaid().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold">Balance Due:</span>
                    <span className="font-bold text-lg">₹{getBalanceDue().toLocaleString()}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          {roomBookings.map((room) => (
            <Card key={room.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  {room.property_name}
                  {room.place && <span className="text-muted-foreground ml-2 text-sm font-normal">({room.place})</span>}
                </CardTitle>
                {room.booking_confirmed && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Confirmed
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Hotel className="mr-2 h-4 w-4" />
                      Check-in / Check-out
                    </div>
                    <p className="font-medium">
                      {room.check_in_date ? new Date(room.check_in_date).toLocaleDateString() : "N/A"} -{" "}
                      {room.check_out_date ? new Date(room.check_out_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rooms</p>
                    <p className="font-medium">{room.no_of_rooms || 0} Rooms</p>
                  </div>
                  {room.description && (
                    <div className="col-span-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{room.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {trip.status === "confirmed" && (
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment History</CardTitle>
                <Button size="sm" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showPaymentForm && (
                  <form onSubmit={handleAddPayment} className="border rounded-lg p-4 space-y-4 bg-blue-50">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="payment_type">Payment Type</Label>
                        <Select
                          value={paymentData.payment_type}
                          onValueChange={(value) => setPaymentData({ ...paymentData, payment_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advance">Advance Payment</SelectItem>
                            <SelectItem value="balance">Balance Payment</SelectItem>
                            <SelectItem value="full">Full Payment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={paymentData.amount}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, amount: Number.parseFloat(e.target.value) })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment_mode">Payment Mode</Label>
                        <Select
                          value={paymentData.payment_mode}
                          onValueChange={(value) => setPaymentData({ ...paymentData, payment_mode: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment_date">Payment Date</Label>
                        <Input
                          id="payment_date"
                          type="date"
                          value={paymentData.payment_date}
                          onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={paymentData.notes}
                        onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        Save Payment
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowPaymentForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No payments recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">₹{Number(payment.amount).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.payment_type.replace("_", " ").toUpperCase()} -{" "}
                              {payment.payment_mode.toUpperCase()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </p>
                            {payment.transaction_reference && (
                              <p className="text-xs text-muted-foreground mt-1">{payment.transaction_reference}</p>
                            )}
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
      </Tabs>
    </div>
  )
}
