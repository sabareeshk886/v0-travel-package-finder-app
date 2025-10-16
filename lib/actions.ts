"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

type Region = "south" | "north" | "kashmir" | "northeast" | "international"

interface PackageResult {
  sl_code: string
  trip_code: string
  details: string
  rate: number
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

export async function searchPackages(region: Region, paxSize: string, duration?: string) {
  const supabase = getSupabaseServerClient()

  console.log("[v0] Search Parameters:", { region, paxSize, duration })

  try {
    let query = supabase.from(region).select(`sl_code, trip_code, "${paxSize}", details`)

    if (region === "south" && duration) {
      const durationCode = duration.replace("D", "").replace("N", "")
      const prefix = `FWS${durationCode.charAt(0)}`
      console.log("[v0] Filtering by trip_code prefix:", prefix)
      query = query.like("trip_code", `${prefix}%`)
    }

    const { data, error } = await query

    console.log("[v0] Raw database response:", { data, error })

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
        })
        if (typeof rate === "number" && rate > 0) {
          return {
            sl_code: pkg.sl_code,
            trip_code: pkg.trip_code,
            details: pkg.details,
            rate,
          }
        }
        return null
      })
      .filter((pkg): pkg is PackageResult => pkg !== null)

    console.log("[v0] Final filtered results:", results)
    return results
  } catch (error) {
    console.error("[v0] Error searching packages:", error)
    return []
  }
}

export async function getPackageDetails(region: Region, tripCode: string) {
  const supabase = getSupabaseServerClient()

  console.log("[v0] Fetching package details:", { region, tripCode })

  try {
    const { data, error } = await supabase.from(region).select("*").eq("trip_code", tripCode).single()

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
