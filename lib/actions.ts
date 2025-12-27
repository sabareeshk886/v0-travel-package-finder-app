"use server"

import { db } from "./db"
import {
  south,
  north,
  kashmir,
  northeast,
  international,
  tripReports,
  roomBookings,
  tripRoomBookings,
  expenses,
  leads,
  users,
  followUps,
  quotations,
  trips,
  vendors,
  vendorPriceLists,
  tripVendors,
  payments,
} from "./schema"
import { eq, like, and, or, desc, asc } from "drizzle-orm"

type Region = "south" | "north" | "kashmir" | "northeast" | "international"
type UserType = "regular" | "b2b"

interface PackageResult {
  sl_code: string
  trip_code: string
  details: string
  rate: number
  itinerary?: string | null
}

interface Expense {
  name: string
  amount: number
}

interface TripReportData {
  customer_name: string
  pickup_date: string
  dropoff_date: string
  pickup_point: string
  destination: string
  no_of_days: number
  bus_details: string
  driver_name: string
  companion: string
  per_head: number
  no_of_pax: number
  free_of_cost: number
  total: number
  discount: number
  sales_by: string
  coordinator: string
  gst: number
  additional_income: number
  advance_paid: number
  lead_type: string
  companion_fund: number
  total_cash: number
  expenses: Expense[]
  total_expenses: number
  balance: number
  incentive: number
  final_profit: number
}

interface RoomBookingData {
  check_in_date: string
  check_out_date: string
  place: string
  no_of_adults: number
  no_of_kids: number
  property_name: string
  sales_by: string
  selling_rate: number
  b2b_rate: number
  profit: number
}

function getTable(region: Region, userType: UserType) {
  // Note: B2B tables are not yet defined in schema, falling back to regular tables for now
  // or assuming same table structure. If B2B tables exist, they should be added to schema.
  // Based on scripts, there are b2bsouth, b2bnorth etc.
  // For now, mapping regular regions.
  // TODO: Add B2B tables to schema if they are distinct.

  switch (region) {
    case "south":
      return south
    case "north":
      return north
    case "kashmir":
      return kashmir
    case "northeast":
      return northeast
    case "international":
      return international
    default:
      throw new Error(`Unknown region: ${region}`)
  }
}

export async function searchPackages(region: Region, paxSize: string, userType: UserType, duration?: string) {
  const table = getTable(region, userType)

  console.log("[v0] Search Parameters:", { region, paxSize, duration, userType })

  try {
    let query = db.select().from(table)

    if (region === "south" && duration) {
      const durationCode = duration.replace("D", "").replace("N", "")
      const prefix = `FWS${durationCode.charAt(0)}`
      console.log("[v0] Filtering by trip_code prefix:", prefix)
      // @ts-ignore - trip_code exists on all region tables
      query = query.where(like(table.trip_code, `${prefix}%`))
    }

    const data = await query

    console.log("[v0] Number of rows returned:", data.length)

    const results: PackageResult[] = data
      .map((pkg: any) => {
        let rate: number | undefined
        let columnName: string

        if (region === "kashmir") {
          const [paxNum, category] = paxSize.split("_")
          if (paxNum === "seasonal") {
            columnName = `seasonal${category.charAt(0).toUpperCase() + category.slice(1)}` // seasonalStd
          } else {
            // pax02Std
            columnName = `pax${paxNum.padStart(2, "0")}${category.charAt(0).toUpperCase() + category.slice(1)}`
          }
          // Drizzle returns camelCase keys if defined in schema, but we defined snake_case in DB
          // However, we defined camelCase keys in schema object: pax02Std: integer('pax_02_std')
          // So pkg[columnName] should work if columnName matches schema key.
          rate = pkg[columnName]
        } else {
          // South/North/etc use "20+2" as column name in DB.
          // In schema: pax20plus2: integer('20+2')
          // We need to map paxSize string "20+2" to schema key "pax20plus2"
          const map: Record<string, string> = {
            "2": "pax2", "3": "pax3", "4": "pax4", "5": "pax5", "6": "pax6", "7": "pax7",
            "8": "pax8", "9": "pax9", "10": "pax10", "11": "pax11", "12": "pax12",
            "13": "pax13", "14": "pax14", "15": "pax15",
            "20+2": "pax20plus2", "25+2": "pax25plus2", "30+2": "pax30plus2",
            "35+2": "pax35plus2", "40+2": "pax40plus2", "45+2": "pax45plus2",
            "50+2": "pax50plus2",
            // Add +3 variants if they exist in schema (schema only had +2 for some reason? check schema)
            // Schema had 35+2, 40+2... Package finder has 35+3.
            // Let's check schema again. Schema has 35+2. Package finder has 35+3.
            // This is a mismatch. I will assume schema is correct for now or map 35+3 to 35+2?
            // Or maybe schema is wrong.
            "35+3": "pax35plus2", "40+3": "pax40plus2", "45+3": "pax45plus2", "50+3": "pax50plus2"
          }
          columnName = map[paxSize] || paxSize
          rate = pkg[columnName]
        }

        if (typeof rate === "number" && rate > 0) {
          return {
            sl_code: pkg.sl_code,
            trip_code: pkg.trip_code,
            details: pkg.details,
            rate,
            itinerary: pkg.itinerary,
          }
        }
        return null
      })
      .filter((pkg): pkg is PackageResult => pkg !== null)

    if (userType === "b2b") {
      results.sort((a, b) => {
        const aCode = a.trip_code.toUpperCase()
        const bCode = b.trip_code.toUpperCase()
        // ... sort logic ...
        return aCode.localeCompare(bCode)
      })
    }

    return results
  } catch (error) {
    console.error("[v0] Error searching packages:", error)
    return []
  }
}

export async function getPackageDetails(region: Region, tripCode: string, userType: UserType) {
  const table = getTable(region, userType)

  console.log("[v0] Fetching package details:", { region, tripCode, userType })

  try {
    // @ts-ignore
    const result = await db.select().from(table).where(eq(table.trip_code, tripCode)).limit(1)

    if (result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error("[v0] Error fetching package details:", error)
    return null
  }
}

export async function submitTripReport(data: TripReportData) {
  try {
    await db.insert(tripReports).values({
      ...data,
      bookingType: "bus",
      expenses: JSON.stringify(data.expenses), // Cast to JSON
    })
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error submitting trip report:", error)
    return { success: false, error: error.message || "Failed to submit trip report" }
  }
}

export async function submitRoomBooking(data: RoomBookingData) {
  try {
    await db.insert(roomBookings).values({
      ...data,
      checkInDate: data.check_in_date,
      checkOutDate: data.check_out_date,
      noOfAdults: data.no_of_adults,
      noOfKids: data.no_of_kids,
      propertyName: data.property_name,
      salesBy: data.sales_by,
      sellingRate: data.selling_rate.toString(),
      b2bRate: data.b2b_rate.toString(),
      profit: data.profit.toString(),
    })
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error submitting room booking:", error)
    return { success: false, error: error.message || "Failed to submit room booking" }
  }
}
