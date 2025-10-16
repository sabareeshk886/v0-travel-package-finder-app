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

export async function checkDatabaseData(region: Region, userType: UserType) {
  const supabase = getSupabaseServerClient()
  const tableName = getTableName(region, userType)

  console.log("[v0] Checking database data for table:", tableName)

  try {
    const { count, error: countError } = await supabase.from(tableName).select("*", { count: "exact", head: true })

    console.log("[v0] Total rows in table:", count)

    const { data, error } = await supabase.from(tableName).select("*").limit(5)

    console.log("[v0] First 5 rows:", data)
    console.log("[v0] Error:", error)

    return { count, data, error }
  } catch (error) {
    console.error("[v0] Error checking database:", error)
    return { count: 0, data: null, error }
  }
}

export async function searchPackages(region: Region, paxSize: string, userType: UserType, duration?: string) {
  const supabase = getSupabaseServerClient()
  const tableName = getTableName(region, userType)

  console.log("[v0] Search Parameters:", { region, paxSize, duration, userType, tableName })

  await checkDatabaseData(region, userType)

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
    console.log("[v0] First row sample:", data?.[0])

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    if (!data) {
      console.log("[v0] No data returned from database")
      return []
    }

    console.log("[v0] Number of rows returned:", data.length)

    const results: PackageResult[] = data
      .map((pkg: any) => {
        const rate = pkg[paxSize]
        console.log("[v0] Processing package:", {
          sl_code: pkg.sl_code,
          trip_code: pkg.trip_code,
          paxSize,
          rate,
          rateType: typeof rate,
          allColumns: Object.keys(pkg),
        })
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

        // FRJ goes to the end
        if (aIsFRJ && !bIsFRJ) return 1
        if (!aIsFRJ && bIsFRJ) return -1

        // FWN goes to the beginning
        if (aIsFWN && !bIsFWN) return -1
        if (!aIsFWN && bIsFWN) return 1

        // Both FWN: sort by number
        if (aIsFWN && bIsFWN) {
          const aNum = Number.parseInt(aCode.match(/\d+/)?.[0] || "0")
          const bNum = Number.parseInt(bCode.match(/\d+/)?.[0] || "0")
          return aNum - bNum
        }

        // Default: alphabetical
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
      console.error("[v0] Error fetching details:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Error fetching package details:", error)
    return null
  }
}
