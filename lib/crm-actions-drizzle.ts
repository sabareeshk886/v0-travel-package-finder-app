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
    hotelRoomConfigs,
    hotelRoomRates,
    payments,
    expenses
} from "./schema"
import { eq, like, or, and, desc, asc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Lead Management Actions

export async function getLeads(filters?: {
    status?: string
    assignedTo?: string
    search?: string
}) {
    try {
        let query = db.select().from(leads)

        if (filters?.status) {
            // @ts-ignore
            query = query.where(eq(leads.status, filters.status))
        }

        const result = await query.orderBy(desc(leads.createdAt))
        return { success: true, data: result }
    } catch (error: any) {
        console.error("Error fetching leads:", error)
        return { success: false, error: error.message, data: [] }
    }
}

export async function createCreateTrip(tripData: any) {
    try {
        // 1. Sanitize Data: Extract only fields that belong to 'trips' table
        const {
            room_bookings,
            budget, // Remove non-table fields
            lead_guest_name,
            ...tripDetails
        } = tripData

        // Generate trip number
        const timestamp = Date.now()
        const tripNumber = `TR${timestamp.toString().slice(-8)}`

        const dataWithNumber = {
            ...tripDetails,
            tripNumber: tripNumber,
            // Ensure numeric strings are converted if needed, Drizzle handles basic types
        }

        // Check for duplicate
        if (tripData.lead_id) {
            // ... existing check logic
        }

        // Insert Trip
        const [insertedTrip] = await db.insert(trips).values(dataWithNumber).returning();

        // Handle Rooms
        if (room_bookings?.length) {
            const bookings = room_bookings.map((b: any) => ({
                ...b,
                tripId: insertedTrip.id
            }))
            await db.insert(tripRoomBookings).values(bookings)
        }

        return { success: true, data: insertedTrip }

    } catch (error: any) {
        console.error("Error creating trip:", error)
        return { success: false, error: error.message }
    }
}
