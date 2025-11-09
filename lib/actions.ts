"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

type Region = "south" | "north" | "kashmir" | "northeast" | "international"
type UserType = "regular" | "b2b"

interface PackageResult {
  sl_code: string
  trip_code: string
  details: string
  rate: number
  itinerary?: string
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

function getSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

function getTableName(region: Region, userType: UserType): string {
  return userType === "b2b" ? `b2b${region}` : region
}

export async function searchPackages(region: Region, paxSize: string, userType: UserType, duration?: string) {
  const supabase = getSupabaseServerClient()
  const tableName = getTableName(region, userType)

  console.log("[v0] Search Parameters:", { region, paxSize, duration, userType, tableName })

  try {
    let query = supabase.from(tableName).select("*")

    if (region === "south" && duration) {
      const durationCode = duration.replace("D", "").replace("N", "")
      const prefix = `FWS${durationCode.charAt(0)}`
      console.log("[v0] Filtering by trip_code prefix:", prefix)
      query = query.like("trip_code", `${prefix}%`)
    }

    const { data, error } = await query

    console.log("[v0] Raw database response:", { data, error })

    if (error) {
      // Check if error is "table not found" (PGRST205)
      if (error.code === "PGRST205") {
        console.log("[v0] Table does not exist:", tableName)
        return []
      }
      console.error("[v0] Database error:", error)
      return []
    }

    if (!data) {
      console.log("[v0] No data returned from database")
      return []
    }

    console.log("[v0] Number of rows returned:", data.length)

    const results: PackageResult[] = data
      .map((pkg: any) => {
        let rate: number | undefined
        let columnName: string

        if (region === "kashmir") {
          const [paxNum, category] = paxSize.split("_")
          if (paxNum === "seasonal") {
            columnName = `seasonal_${category}`
          } else {
            columnName = `pax_${paxNum.padStart(2, "0")}_${category}`
          }
          rate = pkg[columnName]
        } else {
          columnName = paxSize
          rate = pkg[paxSize]
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

        const aIsFWN = aCode.startsWith("FWN")
        const bIsFWN = bCode.startsWith("FWN")
        const aIsFRJ = aCode.startsWith("FRJ")
        const bIsFRJ = bCode.startsWith("FRJ")

        if (aIsFRJ && !bIsFRJ) return 1
        if (!aIsFRJ && bIsFRJ) return -1

        if (aIsFWN && !bIsFWN) return -1
        if (!aIsFWN && bIsFWN) return 1

        if (aIsFWN && bIsFWN) {
          const aNum = Number.parseInt(aCode.match(/\d+/)?.[0] || "0")
          const bNum = Number.parseInt(bCode.match(/\d+/)?.[0] || "0")
          return aNum - bNum
        }

        return aCode.localeCompare(bCode)
      })
    }

    console.log("[v0] Final filtered results:", results)
    return results
  } catch (error) {
    console.error("[v0] Error searching packages:", error)
    return []
  }
}

export async function getPackageDetails(region: Region, tripCode: string, userType: UserType) {
  const supabase = getSupabaseServerClient()
  const tableName = getTableName(region, userType)

  console.log("[v0] Fetching package details:", { region, tripCode, userType, tableName })

  try {
    const { data, error } = await supabase.from(tableName).select("*").eq("trip_code", tripCode).single()

    console.log("[v0] Package details response:", { data, error })

    if (error) {
      if (error.code === "PGRST205") {
        console.log("[v0] Table does not exist:", tableName)
        return null
      }
      console.error("[v0] Error fetching details:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Error fetching package details:", error)
    return null
  }
}

export async function submitTripReport(data: TripReportData) {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.from("trip_reports").insert([
      {
        ...data,
        booking_type: "bus",
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("[v0] Error submitting trip report:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error submitting trip report:", error)
    return { success: false, error: "Failed to submit trip report" }
  }
}

export async function submitRoomBooking(data: RoomBookingData) {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.from("room_bookings").insert([
      {
        ...data,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      if (error.code === "PGRST205") {
        console.error("[v0] room_bookings table does not exist")
        return {
          success: false,
          error:
            "The room_bookings table has not been created yet. Please run the SQL script: scripts/07-create-room-bookings-table.sql in your Supabase SQL Editor.",
        }
      }
      console.error("[v0] Error submitting room booking:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error submitting room booking:", error)
    return { success: false, error: "Failed to submit room booking" }
  }
}
