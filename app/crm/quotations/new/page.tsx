"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { createQuotation, getLeads } from "@/lib/crm-actions"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewQuotationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get("leadId")

  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [inclusions, setInclusions] = useState<string[]>([""])
  const [exclusions, setExclusions] = useState<string[]>([""])

  const [formData, setFormData] = useState({
    lead_id: leadId || "0", // Updated default value to '0'
    destination: "",
    travel_dates: "",
    no_of_pax: "",
    no_of_days: "",
    per_head_rate: "",
    gst_percentage: "5",
    validity_days: "7",
    terms_conditions:
      "Payment terms: 50% advance at booking, 50% before departure.\nCancellation policy applies as per company policy.",
  })

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    const result = await getLeads({ status: "contacted" })
    if (result.success) {
      setLeads(result.data)

      // If leadId provided, populate form
      if (leadId) {
        const lead = result.data.find((l: any) => l.id === leadId)
        if (lead) {
          setFormData((prev) => ({
            ...prev,
            destination: lead.destination || "",
            travel_dates: lead.travel_dates || "",
            no_of_pax: lead.no_of_pax?.toString() || "",
          }))
        }
      }
    }
  }

  const calculateTotals = () => {
    const pax = Number.parseInt(formData.no_of_pax) || 0
    const rate = Number.parseFloat(formData.per_head_rate) || 0
    const gst = Number.parseFloat(formData.gst_percentage) || 0

    const total = pax * rate
    const gstAmount = (total * gst) / 100
    const grandTotal = total + gstAmount

    return { total, gstAmount, grandTotal }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const userData = localStorage.getItem("crm_user")
    const user = userData ? JSON.parse(userData) : null

    const { total, gstAmount, grandTotal } = calculateTotals()

    // Calculate validity date
    const validityDate = new Date()
    validityDate.setDate(validityDate.getDate() + Number.parseInt(formData.validity_days))

    const quotationData = {
      lead_id: formData.lead_id || null,
      destination: formData.destination,
      travel_dates: formData.travel_dates,
      no_of_pax: Number.parseInt(formData.no_of_pax),
      no_of_days: Number.parseInt(formData.no_of_days),
      package_details: {
        inclusions: inclusions.filter((i) => i.trim()),
        exclusions: exclusions.filter((e) => e.trim()),
      },
      per_head_rate: Number.parseFloat(formData.per_head_rate),
      total_amount: total,
      gst_amount: gstAmount,
      grand_total: grandTotal,
      validity_date: validityDate.toISOString().split("T")[0],
      terms_conditions: formData.terms_conditions,
      status: "draft",
      created_by: user?.email || "admin@fernway.com",
    }

    const result = await createQuotation(quotationData)

    if (result.success) {
      router.push("/crm/quotations")
    } else {
      alert("Error creating quotation: " + result.error)
    }
    setLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addInclusion = () => setInclusions([...inclusions, ""])
  const removeInclusion = (index: number) => setInclusions(inclusions.filter((_, i) => i !== index))
  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...inclusions]
    newInclusions[index] = value
    setInclusions(newInclusions)
  }

  const addExclusion = () => setExclusions([...exclusions, ""])
  const removeExclusion = (index: number) => setExclusions(exclusions.filter((_, i) => i !== index))
  const updateExclusion = (index: number, value: string) => {
    const newExclusions = [...exclusions]
    newExclusions[index] = value
    setExclusions(newExclusions)
  }

  const { total, gstAmount, grandTotal } = calculateTotals()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/quotations">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Quotation</h1>
          <p className="text-muted-foreground">Generate a new trip quotation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead_id">Select Lead (Optional)</Label>
                <Select value={formData.lead_id} onValueChange={(value) => handleChange("lead_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Lead</SelectItem> {/* Updated value prop to '0' */}
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.customer_name} - {lead.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div className="space-y-2">
                <Label htmlFor="travel_dates">
                  Travel Dates <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="travel_dates"
                  value={formData.travel_dates}
                  onChange={(e) => handleChange("travel_dates", e.target.value)}
                  placeholder="e.g., 15-20 March 2025"
                  required
                />
              </div>

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
                <Label htmlFor="no_of_days">
                  Number of Days <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="no_of_days"
                  type="number"
                  value={formData.no_of_days}
                  onChange={(e) => handleChange("no_of_days", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="per_head_rate">
                  Rate Per Person (₹) <span className="text-red-500">*</span>
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
                <Label htmlFor="gst_percentage">GST %</Label>
                <Input
                  id="gst_percentage"
                  type="number"
                  value={formData.gst_percentage}
                  onChange={(e) => handleChange("gst_percentage", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity_days">Validity (Days)</Label>
                <Input
                  id="validity_days"
                  type="number"
                  value={formData.validity_days}
                  onChange={(e) => handleChange("validity_days", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Package Inclusions</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={addInclusion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {inclusions.map((inclusion, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={inclusion}
                  onChange={(e) => updateInclusion(index, e.target.value)}
                  placeholder="e.g., Accommodation in 3-star hotels"
                />
                {inclusions.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeInclusion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Package Exclusions</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={addExclusion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {exclusions.map((exclusion, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={exclusion}
                  onChange={(e) => updateExclusion(index, e.target.value)}
                  placeholder="e.g., Personal expenses"
                />
                {exclusions.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeExclusion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.terms_conditions}
              onChange={(e) => handleChange("terms_conditions", e.target.value)}
              rows={5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>
                Subtotal ({formData.no_of_pax || 0} travelers × ₹{formData.per_head_rate || 0})
              </span>
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST ({formData.gst_percentage}%)</span>
              <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Quotation"}
          </Button>
          <Link href="/crm/quotations">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
