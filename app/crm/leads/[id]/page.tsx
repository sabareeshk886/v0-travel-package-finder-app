"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Edit,
  Trash,
  Save,
  X,
  Plane,
} from "lucide-react"
import {
  getLeads,
  updateLead,
  getFollowUps,
  createFollowUp,
  updateFollowUpStatus,
  deleteLead,
  createTrip,
} from "@/lib/crm-actions"
import Link from "next/link"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [lead, setLead] = useState<any>(null)
  const [followUps, setFollowUps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedLead, setEditedLead] = useState<any>(null)
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)

  const [followUpData, setFollowUpData] = useState({
    follow_up_date: "",
    follow_up_time: "",
    notes: "",
  })

  useEffect(() => {
    if (leadId === "new") {
      router.replace("/crm/leads/new")
      return
    }
    if (leadId !== "new") {
      loadLeadData()
    }
  }, [leadId, router])

  const loadLeadData = async () => {
    setLoading(true)
    const result = await getLeads()
    if (result.success) {
      const foundLead = result.data.find((l: any) => l.id === leadId)
      setLead(foundLead)
      setEditedLead(foundLead)
    }

    const followUpsResult = await getFollowUps(leadId)
    if (followUpsResult.success) {
      setFollowUps(followUpsResult.data)
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (newStatus: string) => {
    const result = await updateLead(leadId, { status: newStatus })
    if (result.success) {
      setLead(result.data)
      setEditedLead(result.data)
    }
  }

  const handleSaveEdit = async () => {
    const result = await updateLead(leadId, editedLead)
    if (result.success) {
      setLead(result.data)
      setEditedLead(result.data)
      setEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedLead(lead)
    setEditing(false)
  }

  const handleDeleteLead = async () => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return
    }

    const result = await deleteLead(leadId)
    if (result.success) {
      router.push("/crm/leads")
    } else {
      alert("Error deleting lead: " + result.error)
    }
  }

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const userData = localStorage.getItem("crm_user")
    const user = userData ? JSON.parse(userData) : null

    const result = await createFollowUp({
      lead_id: leadId,
      ...followUpData,
      created_by: user?.email || "admin@fernway.com",
    })

    if (result.success) {
      setFollowUpData({ follow_up_date: "", follow_up_time: "", notes: "" })
      setShowFollowUpForm(false)
      loadLeadData()
    }
  }

  const handleCompleteFollowUp = async (followUpId: string) => {
    const result = await updateFollowUpStatus(followUpId, "completed")
    if (result.success) {
      loadLeadData()
    }
  }



  if (leadId === "new") {
    return null
  }

  if (loading || !lead) {
    return <div className="text-center py-12">Loading...</div>
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
      quoted: "bg-purple-100 text-purple-700 border-purple-200",
      follow_up: "bg-orange-100 text-orange-700 border-orange-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
      lost: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/leads">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{lead.customer_name}</h1>
            <p className="text-muted-foreground">Lead Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Link href={`/crm/trips/new?leadId=${lead.id}`}>
                <Button variant="default">
                  <Plane className="h-4 w-4 mr-2" />
                  Convert to Trip
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDeleteLead}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSaveEdit}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          <Select value={lead.status} onValueChange={handleUpdateStatus}>
            <SelectTrigger className={`w-48 ${getStatusColor(lead.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups ({followUps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Customer Name</Label>
                      <Input
                        id="customer_name"
                        value={editedLead?.customer_name || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, customer_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedLead?.phone || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedLead?.email || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to_name">Assigned To</Label>
                      <Select
                        value={editedLead?.assigned_to_name || ""}
                        onValueChange={(value) => setEditedLead({ ...editedLead, assigned_to_name: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select person" />
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
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{lead.phone}</p>
                    </div>
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{lead.email}</p>
                      </div>
                    </div>
                  )}
                  {lead.assigned_to_name && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{lead.assigned_to_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        value={editedLead?.destination || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, destination: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travel_dates">Travel Dates</Label>
                      <Input
                        id="travel_dates"
                        value={editedLead?.travel_dates || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, travel_dates: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="no_of_pax">Number of Travelers</Label>
                      <Input
                        id="no_of_pax"
                        type="number"
                        value={editedLead?.no_of_pax || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, no_of_pax: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={editedLead?.budget || ""}
                        onChange={(e) => setEditedLead({ ...editedLead, budget: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="special_requirements">Special Requirements</Label>
                    <Textarea
                      id="special_requirements"
                      value={editedLead?.special_requirements || ""}
                      onChange={(e) => setEditedLead({ ...editedLead, special_requirements: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editedLead?.notes || ""}
                      onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {lead.destination && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Destination</p>
                          <p className="font-medium">{lead.destination}</p>
                        </div>
                      </div>
                    )}
                    {lead.travel_dates && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Travel Dates</p>
                          <p className="font-medium">{lead.travel_dates}</p>
                        </div>
                      </div>
                    )}
                    {lead.no_of_pax && (
                      <div>
                        <p className="text-sm text-muted-foreground">Number of Travelers</p>
                        <p className="font-medium">{lead.no_of_pax} people</p>
                      </div>
                    )}
                    {lead.budget && (
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium">₹{lead.budget.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  {lead.special_requirements && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Special Requirements</p>
                      <p className="text-sm">{lead.special_requirements}</p>
                    </div>
                  )}
                  {lead.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{lead.notes}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followups" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Follow-up Schedule</CardTitle>
              <Button size="sm" onClick={() => setShowFollowUpForm(!showFollowUpForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Follow-up
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showFollowUpForm && (
                <form onSubmit={handleAddFollowUp} className="border rounded-lg p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="follow_up_date">Date</Label>
                      <Input
                        id="follow_up_date"
                        type="date"
                        value={followUpData.follow_up_date}
                        onChange={(e) => setFollowUpData({ ...followUpData, follow_up_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="follow_up_time">Time</Label>
                      <Input
                        id="follow_up_time"
                        type="time"
                        value={followUpData.follow_up_time}
                        onChange={(e) => setFollowUpData({ ...followUpData, follow_up_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={followUpData.notes}
                      onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowFollowUpForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {followUps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No follow-ups scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {followUps.map((followUp) => (
                    <div key={followUp.id} className="flex items-start justify-between border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 ${followUp.status === "completed" ? "text-green-600" : "text-orange-600"}`}
                        >
                          {followUp.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {new Date(followUp.follow_up_date).toLocaleDateString()}
                            {followUp.follow_up_time && ` at ${followUp.follow_up_time}`}
                          </p>
                          {followUp.notes && <p className="text-sm text-muted-foreground mt-1">{followUp.notes}</p>}
                          <p className="text-xs text-muted-foreground mt-2">
                            Status: <span className="capitalize">{followUp.status}</span>
                          </p>
                        </div>
                      </div>
                      {followUp.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleCompleteFollowUp(followUp.id)}>
                          Mark Complete
                        </Button>
                      )}
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
