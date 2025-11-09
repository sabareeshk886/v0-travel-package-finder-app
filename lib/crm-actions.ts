"use server"

import { createClient } from "@/lib/supabase"

// Lead Management Actions

export async function getLeads(filters?: {
  status?: string
  assignedTo?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.assignedTo) {
    query = query.eq("assigned_to_name", filters.assignedTo)
  }

  if (filters?.search) {
    query = query.or(
      `customer_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching leads:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createLead(leadData: {
  lead_source: string
  customer_name: string
  phone: string
  email?: string
  destination?: string
  travel_dates?: string
  no_of_pax?: number
  budget?: number
  special_requirements?: string
  priority?: string
  assigned_to_name?: string
  notes?: string
  created_by?: string
  status?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("leads").insert([leadData]).select().single()

  if (error) {
    console.error("[v0] Error creating lead:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateLead(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("leads").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating lead:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting lead:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Follow-up Actions

export async function getFollowUps(leadId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("follow_ups")
    .select(`
      *,
      lead:lead_id(customer_name, phone),
      created_user:created_by(full_name)
    `)
    .order("follow_up_date", { ascending: true })
    .order("follow_up_time", { ascending: true })

  if (leadId) {
    query = query.eq("lead_id", leadId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching follow-ups:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createFollowUp(followUpData: {
  lead_id: string
  follow_up_date: string
  follow_up_time?: string
  notes?: string
  created_by: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("follow_ups").insert([followUpData]).select().single()

  if (error) {
    console.error("[v0] Error creating follow-up:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateFollowUpStatus(id: string, status: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("follow_ups").update({ status }).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating follow-up:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// User Actions

export async function getUsers(role?: string) {
  const supabase = await createClient()

  let query = supabase.from("users").select("*").eq("is_active", true).order("full_name")

  if (role) {
    query = query.eq("role", role)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching users:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

// Quotation Actions

export async function getQuotations(filters?: {
  status?: string
  leadId?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("quotations")
    .select(`
      *,
      lead:lead_id(customer_name, phone, destination),
      created_user:created_by(full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.leadId) {
    query = query.eq("lead_id", filters.leadId)
  }

  if (filters?.search) {
    query = query.or(`quotation_number.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching quotations:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createQuotation(quotationData: any) {
  const supabase = await createClient()

  // Generate quotation number
  const timestamp = Date.now()
  const quotationNumber = `QT${timestamp.toString().slice(-8)}`

  const dataWithNumber = {
    ...quotationData,
    quotation_number: quotationNumber,
  }

  const { data, error } = await supabase.from("quotations").insert([dataWithNumber]).select().single()

  if (error) {
    console.error("[v0] Error creating quotation:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateQuotation(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("quotations").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating quotation:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Trip Actions

export async function getTrips(filters?: {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("trips")
    .select(`
      *,
      coordinator:trip_coordinator(full_name),
      created_user:created_by(full_name)
    `)
    .order("pickup_date", { ascending: true })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(
      `trip_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`,
    )
  }

  if (filters?.dateFrom) {
    query = query.gte("pickup_date", filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte("pickup_date", filters.dateTo)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching trips:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createTrip(tripData: any) {
  const supabase = await createClient()

  // Generate trip number
  const timestamp = Date.now()
  const tripNumber = `TR${timestamp.toString().slice(-8)}`

  const dataWithNumber = {
    ...tripData,
    trip_number: tripNumber,
  }

  const { data, error } = await supabase.from("trips").insert([dataWithNumber]).select().single()

  if (error) {
    console.error("[v0] Error creating trip:", error)
    return { success: false, error: error.message }
  }

  // Update lead status to confirmed if lead_id exists
  if (tripData.lead_id) {
    await supabase.from("leads").update({ status: "confirmed" }).eq("id", tripData.lead_id)
  }

  return { success: true, data }
}

export async function updateTrip(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("trips").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating trip:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Vendor Actions

export async function getVendors(filters?: {
  category?: string
  isActive?: boolean
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase.from("vendors").select("*").order("vendor_name")

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive)
  }

  if (filters?.search) {
    query = query.or(
      `vendor_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching vendors:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createVendor(vendorData: any, roomConfigs?: any[], hotelCategory?: string) {
  try {
    console.log(
      "[v0] createVendor called with:",
      vendorData,
      "roomConfigs:",
      roomConfigs,
      "hotelCategory:",
      hotelCategory,
    )
    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    // If hotel category is provided, add it to notes field since vendors table doesn't have hotel_category column
    if (hotelCategory && vendorData.category === "Hotel") {
      const categoryNote = `Hotel Category: ${hotelCategory}`
      vendorData.notes = vendorData.notes ? `${categoryNote}\n${vendorData.notes}` : categoryNote
    }

    const { data: vendor, error: vendorError } = await supabase.from("vendors").insert([vendorData]).select().single()

    console.log("[v0] Vendor insert result - data:", vendor, "error:", vendorError)

    if (vendorError) {
      console.error("[v0] Error creating vendor:", vendorError)
      return { success: false, error: vendorError.message }
    }

    if (vendorData.category === "Hotel" && roomConfigs && roomConfigs.length > 0 && vendor) {
      const roomConfigsWithVendorId = roomConfigs.map((config) => ({
        vendor_id: vendor.id,
        room_category: config.room_category,
        room_sharing_type: config.room_sharing_type,
        meal_plan: config.meal_plan,
        room_capacity: config.room_capacity ? Number.parseInt(config.room_capacity) : null,
        price_per_night: config.price_per_night ? Number.parseFloat(config.price_per_night) : null,
        extra_bed_price: config.extra_bed_price ? Number.parseFloat(config.extra_bed_price) : null,
        child_policy: config.child_policy || null,
        availability_status: config.availability_status || "Available",
      }))

      const { error: configError } = await supabase.from("hotel_room_configs").insert(roomConfigsWithVendorId)

      if (configError) {
        console.error("[v0] Error creating room configs:", configError)
        // Vendor is created but room configs failed - return partial success
        return {
          success: true,
          data: vendor,
          warning: `Vendor created but room configurations failed: ${configError.message}`,
        }
      }
    }

    console.log("[v0] Vendor created successfully:", vendor)
    return { success: true, data: vendor }
  } catch (err) {
    console.error("[v0] Exception in createVendor:", err)
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function updateVendor(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("vendors").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating vendor:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteVendor(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("vendors").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting vendor:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Vendor Room Configuration Actions

export async function getVendorRoomConfigs(vendorId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("hotel_room_configs")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at")

  if (error) {
    console.error("[v0] Error fetching vendor room configs:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createVendorRoomConfig(roomConfigData: {
  vendor_id: string
  room_category: string
  room_sharing_type: string
  meal_plan: string
  room_capacity: number
  price_per_night: number
  extra_bed_price?: number
  child_policy?: string
  availability_status?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotel_room_configs").insert([roomConfigData]).select().single()

  if (error) {
    console.error("[v0] Error creating vendor room config:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateVendorRoomConfig(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotel_room_configs").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating vendor room config:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteVendorRoomConfig(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("hotel_room_configs").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting vendor room config:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Vendor Price List Actions

export async function getVendorPriceLists(vendorId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("vendor_price_lists")
    .select(`
      *,
      vendor:vendor_id(vendor_name, category)
    `)
    .order("created_at", { ascending: false })

  if (vendorId) {
    query = query.eq("vendor_id", vendorId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching price lists:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createVendorPriceList(priceListData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("vendor_price_lists").insert([priceListData]).select().single()

  if (error) {
    console.error("[v0] Error creating price list:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateVendorPriceList(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("vendor_price_lists").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating price list:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteVendorPriceList(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("vendor_price_lists").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting price list:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Payment Actions

export async function getPayments(filters?: {
  type?: string
  tripId?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase.from("payments").select("*").order("payment_date", { ascending: false })

  if (filters?.type) {
    query = query.eq("payment_type", filters.type)
  }

  if (filters?.tripId) {
    query = query.eq("trip_id", filters.tripId)
  }

  if (filters?.search) {
    query = query.or(`customer_name.ilike.%${filters.search}%,transaction_reference.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching payments:", error)
    if (error.code === "PGRST205") {
      return {
        success: false,
        error:
          "The payments table doesn't exist yet. Please run the SQL script: scripts/08-create-crm-tables.sql in your Supabase SQL Editor to create all CRM tables.",
        data: [],
      }
    }
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createPayment(paymentData: {
  trip_id: string
  customer_name: string
  payment_type: string
  payment_mode: string
  amount: number
  payment_date: string
  transaction_reference?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("payments").insert([paymentData]).select().single()

  if (error) {
    console.error("[v0] Error creating payment:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updatePayment(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("payments").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating payment:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Expense Actions

export async function getExpenses(filters?: {
  tripId?: string
  vendorId?: string
  category?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false })

  if (filters?.tripId) {
    query = query.eq("trip_id", filters.tripId)
  }

  if (filters?.vendorId) {
    query = query.eq("vendor_id", filters.vendorId)
  }

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.search) {
    query = query.or(`expense_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching expenses:", error)
    if (error.code === "PGRST205") {
      return {
        success: false,
        error:
          "The expenses table doesn't exist yet. Please run the SQL script: scripts/08-create-crm-tables.sql in your Supabase SQL Editor to create all CRM tables.",
        data: [],
      }
    }
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createExpense(expenseData: any) {
  const supabase = await createClient()

  // Generate expense number
  const timestamp = Date.now()
  const expenseNumber = `EXP${timestamp.toString().slice(-8)}`

  const dataWithNumber = {
    ...expenseData,
    expense_number: expenseNumber,
  }

  const { data, error } = await supabase.from("expenses").insert([dataWithNumber]).select().single()

  if (error) {
    console.error("[v0] Error creating expense:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateExpense(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("expenses").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating expense:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting expense:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Hotel Management Actions

export async function getHotels(filters?: {
  location?: string
  category?: string
  isActive?: boolean
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase.from("hotels").select("*").order("hotel_name")

  if (filters?.location) {
    query = query.eq("location", filters.location)
  }

  if (filters?.category) {
    query = query.eq("hotel_category", filters.category)
  }

  if (filters?.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive)
  }

  if (filters?.search) {
    query = query.or(
      `hotel_name.ilike.%${filters.search}%,location.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching hotels:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function getHotel(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotels").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching hotel:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createHotel(hotelData: {
  hotel_name: string
  location: string
  contact_person?: string
  contact_number: string
  email?: string
  hotel_category: string
  notes?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotels").insert([hotelData]).select().single()

  if (error) {
    console.error("[v0] Error creating hotel:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateHotel(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotels").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating hotel:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteHotel(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("hotels").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting hotel:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getRoomConfigs(hotelId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("hotel_room_configs")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("created_at")

  if (error) {
    console.error("[v0] Error fetching room configs:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data || [] }
}

export async function createRoomConfig(roomConfigData: {
  hotel_id: string
  room_category: string
  room_sharing_type: string
  meal_plan: string
  room_capacity: number
  price_per_night: number
  extra_bed_price?: number
  child_policy?: string
  availability_status?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotel_room_configs").insert([roomConfigData]).select().single()

  if (error) {
    console.error("[v0] Error creating room config:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateRoomConfig(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hotel_room_configs").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating room config:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteRoomConfig(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("hotel_room_configs").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting room config:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// General CRM Table Check

export async function checkCRMTablesExist() {
  const supabase = await createClient()

  // Try to query a simple table to see if CRM is set up
  const { error } = await supabase.from("leads").select("id").limit(1)

  if (error && error.code === "PGRST205") {
    return { success: false, exists: false, error: "CRM tables not found. Please run the setup SQL script." }
  }

  return { success: true, exists: true }
}
