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
import { ArrowLeft, Save } from "lucide-react"
import { createLead } from "@/lib/crm-actions"
import Link from "next/link"

export default function NewLeadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    lead_source: "Walk-in",
    customer_name: "",
    phone: "",
    email: "",
    destination: "",
    travel_dates: "",
    no_of_pax: "",
    budget: "",
    special_requirements: "",
    priority: "medium",
    assigned_to_name: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const leadData: any = {
      lead_source: formData.lead_source,
      customer_name: formData.customer_name,
      phone: formData.phone,
      email: formData.email || undefined,
      destination: formData.destination || undefined,
      travel_dates: formData.travel_dates || undefined,
      no_of_pax: formData.no_of_pax ? Number.parseInt(formData.no_of_pax) : undefined,
      budget: formData.budget ? Number.parseFloat(formData.budget) : undefined,
      special_requirements: formData.special_requirements || undefined,
      priority: formData.priority,
      assigned_to_name: formData.assigned_to_name || undefined,
      notes: formData.notes || undefined,
      status: "new",
    }

    // Remove empty fields
    Object.keys(leadData).forEach((key) => {
      if (leadData[key] === "" || leadData[key] === undefined) {
        delete leadData[key]
      }
    })

    const result = await createLead(leadData)

    if (result.success) {
      router.push("/crm/leads")
    } else {
      alert("Error creating lead: " + result.error)
    }
    setLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/leads">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Lead</h1>
          <p className="text-muted-foreground">Create a new customer lead</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
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
                <Label htmlFor="lead_source">
                  Lead Source <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.lead_source} onValueChange={(value) => handleChange("lead_source", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Phone Call">Phone Call</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  placeholder="e.g., Kashmir, Kerala, Rajasthan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travel_dates">Travel Dates</Label>
                <Input
                  id="travel_dates"
                  value={formData.travel_dates}
                  onChange={(e) => handleChange("travel_dates", e.target.value)}
                  placeholder="e.g., 15-20 March 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_of_pax">Number of Travelers</Label>
                <Input
                  id="no_of_pax"
                  type="number"
                  value={formData.no_of_pax}
                  onChange={(e) => handleChange("no_of_pax", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="e.g., 50000"
                />
              </div>
            </div>

            {/* Assigned To and Priority */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assigned_to_name">Assigned To</Label>
                <Select
                  value={formData.assigned_to_name}
                  onValueChange={(value) => handleChange("assigned_to_name", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANEES">ANEES</SelectItem>
                    <SelectItem value="OFFICE">OFFICE</SelectItem>
                    <SelectItem value="NIYAS">NIYAS</SelectItem>
                    <SelectItem value="ARJUN">ARJUN</SelectItem>
                    <SelectItem value="PRATHUSH">PRATHUSH</SelectItem>
                    <SelectItem value="ANURANJ">ANURANJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              <Label htmlFor="special_requirements">Special Requirements</Label>
              <Textarea
                id="special_requirements"
                value={formData.special_requirements}
                onChange={(e) => handleChange("special_requirements", e.target.value)}
                rows={3}
                placeholder="Any specific requirements or preferences..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
                placeholder="Additional notes about the lead..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Lead"}
              </Button>
              <Link href="/crm/leads">
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
