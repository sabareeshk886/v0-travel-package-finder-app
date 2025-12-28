"use server"

import { db } from "./db"
import {
  leads,
  followUps,
  users,
  quotations,
  trips,
  tripRoomBookings,
  vendors,
  vendorPriceLists,
  tripVendors,
  payments,
  expenses
} from "./schema"
import { eq, like, or, and, desc, ne, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// --- Helper Actions ---



export async function checkCRMTablesExist() {
  return { exists: true };
}

// --- Lead Management Actions ---

export async function getLeads(filters?: {
  status?: string
  assignedTo?: string
  search?: string
}) {
  try {
    let query = db.select().from(leads)

    if (filters?.status && filters.status !== 'all') {
      // @ts-ignore
      query = query.where(eq(leads.status, filters.status))
    } else if (!filters?.status || filters.status === 'all') {
      // Default: Exclude converted leads unless specifically asked for
      // @ts-ignore
      query = query.where(ne(leads.status, 'converted'))
    }

    if (filters?.search) {
      // @ts-ignore
      query = query.where(
        or(
          like(leads.customerName, `%${filters.search}%`),
          like(leads.phone, `%${filters.search}%`),
          like(leads.email, `%${filters.search}%`)
        )
      )
    }

    const result = await query.orderBy(desc(leads.createdAt))
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Error fetching leads:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function createLead(leadData: any) {
  try {
    const [newLead] = await db.insert(leads).values(leadData).returning()
    revalidatePath("/crm/leads")
    return { success: true, data: newLead }
  } catch (error: any) {
    console.error("Error creating lead:", error)
    return { success: false, error: error.message }
  }
}

export async function updateLead(id: string, updates: any) {
  try {
    const [updatedLead] = await db.update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning()
    revalidatePath("/crm/leads")
    revalidatePath(`/crm/leads/${id}`)
    return { success: true, data: updatedLead }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteLead(id: string) {
  try {
    await db.delete(leads).where(eq(leads.id, id))
    revalidatePath("/crm/leads")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Follow-up Actions ---

export async function getFollowUps(leadId: string) {
  try {
    const result = await db.select()
      .from(followUps)
      .where(eq(followUps.leadId, leadId))
      .orderBy(desc(followUps.createdAt))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createFollowUp(data: any) {
  try {
    const [newFollowUp] = await db.insert(followUps).values(data).returning()
    revalidatePath(`/crm/leads/${data.leadId}`)
    return { success: true, data: newFollowUp }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateFollowUpStatus(id: string, status: string) {
  try {
    const [updated] = await db.update(followUps)
      .set({ status })
      .where(eq(followUps.id, id))
      .returning()
    return { success: true, data: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- User Actions ---

export async function getUsers() {
  try {
    const result = await db.select().from(users).where(eq(users.isActive, true))
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// --- Trip Actions ---

export async function getTrips(filters?: { status?: string, search?: string }) {
  try {
    let query = db.select().from(trips).orderBy(desc(trips.createdAt))
    // Add filters if needed in future
    const result = await query
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createTripAction(tripData: any) {
  try {
    console.log("[v0] createTripAction called with:", JSON.stringify(tripData, null, 2))

    // 1. Sanitize & Map
    const {
      room_bookings,
      budget, lead_guest_name, no_of_staff, lead_source, // removed
      customer_name, phone, email, destination, pickup_point, pickup_date, dropoff_date,
      no_of_days, no_of_pax, per_head_rate, total_amount, gst_amount, grand_total,
      trip_coordinator, driver_name, bus_details, package_details, status, created_by,
      lead_id, leadId, quotation_id, quotationId,
      ...others
    } = tripData

    const timestamp = Date.now()
    const tripNumber = `TR${timestamp.toString().slice(-8)}`

    const tripInsertData = {
      tripNumber: tripNumber,
      leadId: leadId || lead_id || null,
      quotationId: quotationId || quotation_id || null,
      customerName: customer_name,
      phone: phone,
      email: email,
      destination: destination,
      pickupPoint: pickup_point,
      pickupDate: pickup_date,
      dropoffDate: dropoff_date,
      noOfDays: no_of_days ? Number(no_of_days) : 0,
      noOfPax: no_of_pax ? Number(no_of_pax) : 0,
      perHeadRate: per_head_rate ? per_head_rate.toString() : "0",
      totalAmount: total_amount ? total_amount.toString() : "0",
      gstAmount: gst_amount ? gst_amount.toString() : "0",
      grandTotal: grand_total ? grand_total.toString() : "0",
      tripCoordinator: trip_coordinator || null,
      driverName: driver_name,
      busDetails: bus_details,
      packageDetails: package_details,
      status: status || 'confirmed',
      createdBy: created_by || null,
    }

    if (tripInsertData.leadId) {
      const existingTrip = await db.select({ id: trips.id }).from(trips).where(eq(trips.leadId, tripInsertData.leadId)).limit(1)
      if (existingTrip.length > 0) {
        return { success: false, error: "A trip already exists for this lead." }
      }
    }

    const [insertedTrip] = await db.insert(trips).values(tripInsertData).returning();

    if (room_bookings && Array.isArray(room_bookings) && room_bookings.length > 0) {
      const bookings = room_bookings.map((b: any) => ({
        tripId: insertedTrip.id,
        category: b.category,
        sharingType: b.sharing_type,
        capacity: b.capacity ? Number(b.capacity) : null,
        rate: b.rate?.toString(),
        adults: b.adults ? Number(b.adults) : 0,
        children: b.children ? Number(b.children) : 0,
        checkInDate: b.check_in_date,
        checkOutDate: b.check_out_date,
        place: b.place,
        propertyName: b.property_name,
        description: b.description,
        status: b.booking_confirmed ? 'confirmed' : 'pending'
      }))

      if (bookings.length > 0) {
        await db.insert(tripRoomBookings).values(bookings)
      }
    }

    if (tripInsertData.leadId) {
      await db.update(leads).set({ status: "converted" }).where(eq(leads.id, tripInsertData.leadId))
    }

    revalidatePath("/crm/trips")
    return { success: true, data: insertedTrip }

  } catch (error: any) {
    console.error("[v0] Error creating trip:", error)
    return { success: false, error: error.message }
  }
}

export async function createTrip(tripData: any) {
  return createTripAction(tripData)
}

export async function updateTrip(id: string, updates: any) {
  try {
    const [updatedTrip] = await db.update(trips)
      .set(updates)
      .where(eq(trips.id, id))
      .returning()
    revalidatePath("/crm/trips")
    revalidatePath(`/crm/trips/${id}`)
    return { success: true, data: updatedTrip }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTrip(id: string) {
  try {
    await db.delete(trips).where(eq(trips.id, id))
    revalidatePath("/crm/trips")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getTripRoomBookings(tripId: string) {
  try {
    const result = await db.select().from(tripRoomBookings).where(eq(tripRoomBookings.tripId, tripId))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function deleteTripRoomBooking(id: string) {
  try {
    await db.delete(tripRoomBookings).where(eq(tripRoomBookings.id, id))
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Quotation Actions ---

export async function getQuotations(filters?: any) {
  try {
    const result = await db.select().from(quotations).orderBy(desc(quotations.createdAt))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createQuotation(data: any) {
  try {
    const [newQuotation] = await db.insert(quotations).values(data).returning()
    revalidatePath("/crm/quotations")
    return { success: true, data: newQuotation }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Payment Actions ---

export async function getPayments(tripId?: string) {
  try {
    let query = db.select().from(payments)
    if (tripId) {
      query = query.where(eq(payments.tripId, tripId))
    }
    const result = await query.orderBy(desc(payments.paymentDate))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createPayment(data: any) {
  try {
    const [newPayment] = await db.insert(payments).values(data).returning()
    revalidatePath("/crm/payments")
    if (data.tripId) revalidatePath(`/crm/trips/${data.tripId}`)
    return { success: true, data: newPayment }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Expense Actions ---

export async function getExpenses(tripId?: string) {
  try {
    let query = db.select().from(expenses)
    if (tripId) {
      query = query.where(eq(expenses.tripId, tripId))
    }
    const result = await query.orderBy(desc(expenses.expenseDate))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createExpense(data: any) {
  try {
    const [newExpense] = await db.insert(expenses).values(data).returning()
    revalidatePath("/crm/expenses")
    if (data.tripId) revalidatePath(`/crm/trips/${data.tripId}`)
    return { success: true, data: newExpense }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Vendor Actions ---

export async function getVendors() {
  try {
    const result = await db.select().from(vendors).orderBy(vendors.vendorName)
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createVendor(data: any) {
  try {
    const [newVendor] = await db.insert(vendors).values(data).returning()
    revalidatePath("/crm/vendors")
    return { success: true, data: newVendor }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateVendor(id: string, data: any) {
  try {
    const [updated] = await db.update(vendors).set(data).where(eq(vendors.id, id)).returning()
    revalidatePath("/crm/vendors")
    revalidatePath(`/crm/vendors/${id}`)
    return { success: true, data: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteVendor(id: string) {
  try {
    await db.delete(vendors).where(eq(vendors.id, id))
    revalidatePath("/crm/vendors")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Vendor Room Config Actions (Price Lists) ---

export async function getVendorRoomConfigs(vendorId: string) {
  try {
    const result = await db.select()
      .from(vendorPriceLists)
      .where(eq(vendorPriceLists.vendorId, vendorId))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function createVendorRoomConfig(data: any) {
  try {
    const [newConfig] = await db.insert(vendorPriceLists).values(data).returning()
    revalidatePath(`/crm/vendors/${data.vendorId}`)
    return { success: true, data: newConfig }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateVendorRoomConfig(id: string, data: any) {
  try {
    const [updated] = await db.update(vendorPriceLists).set(data).where(eq(vendorPriceLists.id, id)).returning()
    // We might need vendorId to revalidate correct path, but generic revalidation or relying on client router refresh might be okay.
    // Ideally we should return vendorId to help caller.
    return { success: true, data: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}


export async function deleteVendorRoomConfig(id: string) {
  try {
    await db.delete(vendorPriceLists).where(eq(vendorPriceLists.id, id))
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Hotel Action Wrappers (Mapping to Vendors) ---

export async function createHotel(data: any) {
  // partial map to vendor
  const vendorData = {
    vendorName: data.hotel_name,
    category: data.hotel_category || 'Hotel',
    contactPerson: data.contact_person,
    phone: data.contact_number,
    email: data.email,
    address: data.location, // mapping location to address
    notes: data.notes
  }
  return createVendor(vendorData)
}

export async function getHotels(filters?: any) {
  const result = await getVendors()
  if (!result.success) return result

  // Map back to expected format if needed, or component adapts?
  // Component expects: hotel_name, location, contact_number, hotel_category, is_active
  // Vendors has: vendorName, address, phone, category, isActive

  const mapped = result.data.map((v: any) => ({
    id: v.id,
    hotel_name: v.vendorName,
    location: v.address,
    contact_number: v.phone,
    email: v.email,
    hotel_category: v.category,
    contact_person: v.contactPerson,
    is_active: v.isActive
  }))

  return { success: true, data: mapped }
}

export async function createRoomConfig(data: any) {
  // Map to vendorPriceLists
  // data: hotel_id, room_category, room_sharing_type, meal_plan, room_capacity, price_per_night, extra_bed_price, child_policy, availability_status

  const priceListData = {
    vendorId: data.hotel_id,
    itemName: data.room_category,
    rateType: data.room_sharing_type, // "Double", "Single" etc
    season: data.meal_plan, // Using season field for meal plan as potential fit
    rate: data.price_per_night.toString(),
    // Store extra fields in notes for now as schema doesn't match perfectly
    notes: JSON.stringify({
      room_capacity: data.room_capacity,
      extra_bed_price: data.extra_bed_price,
      child_policy: data.child_policy,
      availability_status: data.availability_status
    })
  }

  return createVendorRoomConfig(priceListData)
}
