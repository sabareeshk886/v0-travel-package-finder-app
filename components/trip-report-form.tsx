"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { submitTripReport, submitRoomBooking } from "@/lib/actions"
import { Loader2, Plus, X } from "lucide-react"

interface Expense {
  id: string
  name: string
  amount: number
}

export default function TripReportForm() {
  const [bookingType, setBookingType] = useState<"bus" | "room" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Bus Booking Fields
  const [customerName, setCustomerName] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")
  const [pickupPoint, setPickupPoint] = useState("")
  const [destination, setDestination] = useState("")
  const [noOfDays, setNoOfDays] = useState("")
  const [busDetails, setBusDetails] = useState("")
  const [driverName, setDriverName] = useState("")
  const [companion, setCompanion] = useState("")
  const [perHead, setPerHead] = useState("")
  const [noOfPax, setNoOfPax] = useState("")
  const [freeOfCost, setFreeOfCost] = useState("")
  const [discount, setDiscount] = useState("")
  const [salesBy, setSalesBy] = useState("")
  const [otherSalesName, setOtherSalesName] = useState("")
  const [coordinator, setCoordinator] = useState("")
  const [gst, setGst] = useState("")
  const [additionalIncome, setAdditionalIncome] = useState("")
  const [advancePaid, setAdvancePaid] = useState("")
  const [leadType, setLeadType] = useState<"company" | "personal">("company")
  const [companionFund, setCompanionFund] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [expenseName, setExpenseName] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")

  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [place, setPlace] = useState("")
  const [noOfAdults, setNoOfAdults] = useState("")
  const [noOfKids, setNoOfKids] = useState("")
  const [propertyName, setPropertyName] = useState("")
  const [roomSalesBy, setRoomSalesBy] = useState("")
  const [roomOtherSalesName, setRoomOtherSalesName] = useState("")
  const [sellingRate, setSellingRate] = useState("")
  const [b2bRate, setB2bRate] = useState("")

  const calculateRoomProfit = () => {
    const selling = Number.parseFloat(sellingRate) || 0
    const b2b = Number.parseFloat(b2bRate) || 0
    return selling - b2b
  }

  const calculateTotal = () => {
    const perHeadVal = Number.parseFloat(perHead) || 0
    const paxVal = Number.parseFloat(noOfPax) || 0
    const freeOfCostVal = Number.parseFloat(freeOfCost) || 0
    return perHeadVal * paxVal - freeOfCostVal * perHeadVal
  }

  const calculateTotalCash = () => {
    const totalVal = calculateTotal()
    const discountVal = Number.parseFloat(discount) || 0
    const gstVal = Number.parseFloat(gst) || 0
    const additionalVal = Number.parseFloat(additionalIncome) || 0
    return totalVal - discountVal + gstVal + additionalVal
  }

  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  const calculateBalance = () => {
    return calculateTotalCash() - calculateTotalExpenses()
  }

  const calculateIncentive = () => {
    if (leadType === "personal") {
      const incentive = calculateBalance() * 0.2
      console.log("[v0] Calculating incentive:", { leadType, balance: calculateBalance(), incentive })
      return incentive
    }
    console.log("[v0] No incentive for company lead")
    return 0
  }

  const calculateFinalProfit = () => {
    const companionFundVal = Number.parseFloat(companionFund) || 0
    return calculateBalance() - calculateIncentive() - companionFundVal
  }

  const addExpense = () => {
    if (expenseName.trim() && expenseAmount) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        name: expenseName.trim(),
        amount: Number.parseFloat(expenseAmount) || 0,
      }
      setExpenses([...expenses, newExpense])
      setExpenseName("")
      setExpenseAmount("")
    }
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  const handleExpenseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addExpense()
    }
  }

  const handleBusBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      const finalSalesBy = salesBy === "OTHER" ? otherSalesName : salesBy

      const result = await submitTripReport({
        customer_name: customerName,
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        pickup_point: pickupPoint,
        destination: destination,
        no_of_days: Number.parseInt(noOfDays) || 0,
        bus_details: busDetails,
        driver_name: driverName,
        companion: companion,
        per_head: Number.parseFloat(perHead) || 0,
        no_of_pax: Number.parseInt(noOfPax) || 0,
        free_of_cost: Number.parseFloat(freeOfCost) || 0,
        total: calculateTotal(),
        discount: Number.parseFloat(discount) || 0,
        sales_by: finalSalesBy,
        coordinator: coordinator,
        gst: Number.parseFloat(gst) || 0,
        additional_income: Number.parseFloat(additionalIncome) || 0,
        advance_paid: Number.parseFloat(advancePaid) || 0,
        lead_type: leadType,
        companion_fund: Number.parseFloat(companionFund) || 0,
        total_cash: calculateTotalCash(),
        expenses: expenses,
        total_expenses: calculateTotalExpenses(),
        balance: calculateBalance(),
        incentive: calculateIncentive(),
        final_profit: calculateFinalProfit(),
      })

      if (result.success) {
        setSubmitSuccess(true)
        // Reset bus booking fields
        setCustomerName("")
        setPickupDate("")
        setDropoffDate("")
        setPickupPoint("")
        setDestination("")
        setNoOfDays("")
        setBusDetails("")
        setDriverName("")
        setCompanion("")
        setPerHead("")
        setNoOfPax("")
        setFreeOfCost("")
        setDiscount("")
        setSalesBy("")
        setOtherSalesName("")
        setCoordinator("")
        setGst("")
        setAdditionalIncome("")
        setAdvancePaid("")
        setLeadType("company")
        setCompanionFund("")
        setExpenses([])

        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting bus booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoomBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      const finalSalesBy = roomSalesBy === "OTHER" ? roomOtherSalesName : roomSalesBy

      const result = await submitRoomBooking({
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        place: place,
        no_of_adults: Number.parseInt(noOfAdults) || 0,
        no_of_kids: Number.parseInt(noOfKids) || 0,
        property_name: propertyName,
        sales_by: finalSalesBy,
        selling_rate: Number.parseFloat(sellingRate) || 0,
        b2b_rate: Number.parseFloat(b2bRate) || 0,
        profit: calculateRoomProfit(),
      })

      if (result.success) {
        setSubmitSuccess(true)
        // Reset room booking fields
        setCheckInDate("")
        setCheckOutDate("")
        setPlace("")
        setNoOfAdults("")
        setNoOfKids("")
        setPropertyName("")
        setRoomSalesBy("")
        setRoomOtherSalesName("")
        setSellingRate("")
        setB2bRate("")

        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting room booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookingType) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Select Booking Type</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button type="button" onClick={() => setBookingType("bus")} className="h-32 text-xl" variant="outline">
              Bus Booking
            </Button>
            <Button type="button" onClick={() => setBookingType("room")} className="h-32 text-xl" variant="outline">
              Room Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (bookingType === "room") {
    return (
      <form onSubmit={handleRoomBookingSubmit}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Room Booking</h2>
            <Button type="button" variant="outline" onClick={() => setBookingType(null)}>
              Change Booking Type
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">Check-in Date</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Check-out Date</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="place">Place</Label>
                <Input id="place" value={place} onChange={(e) => setPlace(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noOfAdults">No. of Adults</Label>
                <Input
                  id="noOfAdults"
                  type="number"
                  value={noOfAdults}
                  onChange={(e) => setNoOfAdults(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noOfKids">No. of Kids</Label>
                <Input
                  id="noOfKids"
                  type="number"
                  value={noOfKids}
                  onChange={(e) => setNoOfKids(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomSalesBy">Sales By</Label>
                <select
                  id="roomSalesBy"
                  value={roomSalesBy}
                  onChange={(e) => setRoomSalesBy(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select Sales Person</option>
                  <option value="ANEES">ANEES</option>
                  <option value="NIYAS">NIYAS</option>
                  <option value="SABAREESH">SABAREESH</option>
                  <option value="ARJUN">ARJUN</option>
                  <option value="SREEHARI">SREEHARI</option>
                  <option value="ANURANJ">ANURANJ</option>
                  <option value="PRETHUSH">PRETHUSH</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              {roomSalesBy === "OTHER" && (
                <div className="space-y-2">
                  <Label htmlFor="roomOtherSalesName">Other Sales Person Name</Label>
                  <Input
                    id="roomOtherSalesName"
                    value={roomOtherSalesName}
                    onChange={(e) => setRoomOtherSalesName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellingRate">Selling Rate (₹)</Label>
                <Input
                  id="sellingRate"
                  type="number"
                  step="0.01"
                  value={sellingRate}
                  onChange={(e) => setSellingRate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b2bRate">B2B Rate (₹)</Label>
                <Input
                  id="b2bRate"
                  type="number"
                  step="0.01"
                  value={b2bRate}
                  onChange={(e) => setB2bRate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="roomProfit">Profit (Auto-calculated)</Label>
                <Input
                  id="roomProfit"
                  type="text"
                  value={`₹${calculateRoomProfit().toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                  disabled
                  className="bg-muted text-2xl font-bold"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Room Booking"
              )}
            </Button>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              Room booking submitted successfully!
            </div>
          )}
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleBusBookingSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bus Booking</h2>
          <Button type="button" variant="outline" onClick={() => setBookingType(null)}>
            Change Booking Type
          </Button>
        </div>

        {/* Trip Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupDate">Pickup Date</Label>
              <Input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffDate">Dropoff Date</Label>
              <Input
                id="dropoffDate"
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupPoint">Pickup Point</Label>
              <Input id="pickupPoint" value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfDays">No. of Days</Label>
              <Input
                id="noOfDays"
                type="number"
                value={noOfDays}
                onChange={(e) => setNoOfDays(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="busDetails">Bus Details</Label>
              <Input id="busDetails" value={busDetails} onChange={(e) => setBusDetails(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input id="driverName" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companion">Companion</Label>
              <Input id="companion" value={companion} onChange={(e) => setCompanion(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Financial Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="perHead">Per Head (₹)</Label>
              <Input
                id="perHead"
                type="number"
                step="0.01"
                value={perHead}
                onChange={(e) => setPerHead(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfPax">No. of Pax</Label>
              <Input id="noOfPax" type="number" value={noOfPax} onChange={(e) => setNoOfPax(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeOfCost">Free of Cost</Label>
              <Input
                id="freeOfCost"
                type="number"
                step="0.01"
                value={freeOfCost}
                onChange={(e) => setFreeOfCost(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total (Auto-calculated)</Label>
              <Input
                id="total"
                type="text"
                value={`₹${calculateTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesBy">Sales By</Label>
              <select
                id="salesBy"
                value={salesBy}
                onChange={(e) => setSalesBy(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select Sales Person</option>
                <option value="ANEES">ANEES</option>
                <option value="NIYAS">NIYAS</option>
                <option value="SABAREESH">SABAREESH</option>
                <option value="ARJUN">ARJUN</option>
                <option value="SREEHARI">SREEHARI</option>
                <option value="ANURANJ">ANURANJ</option>
                <option value="PRETHUSH">PRETHUSH</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            {salesBy === "OTHER" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="otherSalesName">Other Sales Person Name</Label>
                <Input
                  id="otherSalesName"
                  value={otherSalesName}
                  onChange={(e) => setOtherSalesName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="coordinator">Coordinator</Label>
              <Input id="coordinator" value={coordinator} onChange={(e) => setCoordinator(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST (₹)</Label>
              <Input
                id="gst"
                type="number"
                step="0.01"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalIncome">Additional Income (₹)</Label>
              <Input
                id="additionalIncome"
                type="number"
                step="0.01"
                value={additionalIncome}
                onChange={(e) => setAdditionalIncome(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advancePaid">Advance Paid (₹)</Label>
              <Input
                id="advancePaid"
                type="number"
                step="0.01"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadType">Lead Type</Label>
              <select
                id="leadType"
                value={leadType}
                onChange={(e) => setLeadType(e.target.value as "company" | "personal")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="company">Company Lead</option>
                <option value="personal">Personal Lead</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companionFund">Companion Fund (₹)</Label>
              <Input
                id="companionFund"
                type="number"
                step="0.01"
                value={companionFund}
                onChange={(e) => setCompanionFund(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Expenses Section */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expenseName">Expense Name</Label>
                <Input
                  id="expenseName"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  onKeyPress={handleExpenseKeyPress}
                  placeholder="e.g., Fuel, Toll, Food"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseAmount">Amount (₹)</Label>
                <div className="flex gap-2">
                  <Input
                    id="expenseAmount"
                    type="number"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    onKeyPress={handleExpenseKeyPress}
                    placeholder="0.00"
                  />
                  <Button type="button" onClick={addExpense} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {expenses.length > 0 && (
              <div className="space-y-2">
                <Label>Added Expenses</Label>
                <div className="border rounded-lg divide-y">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3">
                      <div className="flex-1">
                        <span className="font-medium">{expense.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">
                          ₹{expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpense(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Total Expenses</span>
                  <span className="text-xl font-bold text-red-600">
                    ₹{calculateTotalExpenses().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Total</Label>
              <div className="text-3xl font-bold text-blue-600">
                ₹{calculateTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Total Cash</Label>
              <div className="text-3xl font-bold text-blue-600">
                ₹{calculateTotalCash().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Total Expenses</Label>
              <div className="text-3xl font-bold text-red-600">
                ₹{calculateTotalExpenses().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Balance</Label>
              <div className="text-3xl font-bold text-green-600">
                ₹{calculateBalance().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Incentive (20%){" "}
                {leadType === "company" && <span className="text-xs">(Company Lead - No Incentive)</span>}
              </Label>
              <div className={`text-3xl font-bold ${leadType === "personal" ? "text-purple-600" : "text-gray-400"}`}>
                ₹{calculateIncentive().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            {companionFund && Number.parseFloat(companionFund) > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Companion Fund</Label>
                <div className="text-3xl font-bold text-orange-600">
                  ₹{Number.parseFloat(companionFund).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}
            <div className="md:col-span-2 space-y-2 p-4 bg-white rounded-lg border-2 border-indigo-300">
              <Label className="text-sm text-muted-foreground">Final Profit</Label>
              <div className="text-4xl font-bold text-indigo-600">
                ₹{calculateFinalProfit().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Bus Booking"
            )}
          </Button>
        </div>

        {submitSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
            Bus booking submitted successfully!
          </div>
        )}
      </div>
    </form>
  )
}
