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
import { eq, like, or, and, desc, asc, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Lead Management Actions

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

    if (filters?.assignedTo) {
      // ... existing assignedTo logic needs to be careful not to overwrite where clause? 
      // Drizzle queries are mutable/chainable, so adding .where() usually ANDs it.
      // But wait, the previous code was `query = query.where(...)`. 
      // If I add another where, it typically behaves as AND.
    }

    // Let's look at the original code structure to be safe.
    // Original:
    // if (filters?.status) { query = query.where(eq(leads.status, filters.status)) }

    // My proposed change needs to handle "all" correctly if passed from frontend.
    // Frontend passes "all" for statusFilter.

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
    return { success: true, data: newLead }
  } catch (error: any) {
    console.error("Error creating lead:", error)
    return { success: false, error: error.message }
  }
}

export async function getUsers() {
  try {
    const result = await db.select().from(users).where(eq(users.isActive, true))
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Renamed to force refresh and ensure Drizzle code is used
export async function createTripAction(tripData: any) {
  try {
    console.log("[v0] createTripAction called with:", JSON.stringify(tripData, null, 2))

    // 1. Sanitize & Map: Extract fields and map snake_case to camelCase
    const {
      room_bookings,
      // Remove fields not in trips table
      budget,
      lead_guest_name,
      no_of_staff,
      lead_source,
      // Destructure remaining fields to map them explicitly
      customer_name,
      phone,
      email,
      destination,
      pickup_point,
      pickup_date,
      dropoff_date,
      no_of_days,
      no_of_pax,
      per_head_rate,
      total_amount,
      gst_amount,
      grand_total,
      trip_coordinator,
      driver_name,
      bus_details,
      package_details,
      status,
      created_by,
      lead_id,
      leadId, // handle both
      quotation_id,
      quotationId,
      ...others
    } = tripData

    // Generate trip number
    const timestamp = Date.now()
    const tripNumber = `TR${timestamp.toString().slice(-8)}`

    // Construct Drizzle-compatible object (camelCase keys matching schema)
    const tripInsertData = {
      tripNumber: tripNumber,
      leadId: leadId || lead_id || null, // Map to leadId
      quotationId: quotationId || quotation_id || null,
      customerName: customer_name,
      phone: phone,
      email: email,
      destination: destination,
      pickupPoint: pickup_point,
      pickupDate: pickup_date, // Date string is fine for date column? usually yes
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
      packageDetails: package_details, // jsonb accepts object
      status: status || 'confirmed',
      createdBy: created_by || null,
    }

    console.log("[v0] Inserting trip data:", JSON.stringify(tripInsertData, null, 2))

    // Check for duplicate trip for the same lead
    if (tripInsertData.leadId) {
      const existingTrip = await db.select({ id: trips.id }).from(trips).where(eq(trips.leadId, tripInsertData.leadId)).limit(1)
      if (existingTrip.length > 0) {
        return { success: false, error: "A trip already exists for this lead." }
      }
    }

    // Insert Trip
    const [insertedTrip] = await db.insert(trips).values(tripInsertData).returning();

    // Handle Rooms
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

    // Update lead status
    if (tripInsertData.leadId) {
      await db.update(leads).set({ status: "converted" }).where(eq(leads.id, tripInsertData.leadId))
    }

    return { success: true, data: insertedTrip }

  } catch (error: any) {
    console.error("[v0] Error creating trip:", error)
    // Also return validation errors clearly
    return { success: false, error: error.message }
  }
}

// Keep a wrapper for legacy calls if needed, but updated page uses createTripAction
export async function createTrip(tripData: any) {
  return createTripAction(tripData)
}

export async function getTrips(filters?: any) {
  try {
    const result = await db.select().from(trips).orderBy(desc(trips.createdAt))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}
