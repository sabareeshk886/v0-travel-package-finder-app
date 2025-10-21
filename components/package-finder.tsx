"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar, Package, Share2, ArrowLeft, Loader2, Hotel } from "lucide-react"
import { searchPackages, getPackageDetails } from "@/lib/actions"

type Region = "south" | "north" | "kashmir" | "northeast" | "international"
type Duration = "2D3N" | "3D4N" | "4D5N" | "5D6N" | "6D7N"
type PaxSize = "20+2" | "25+2" | "30+2" | "35+3" | "40+3" | "45+3" | "50+3"
type KashmirPaxSize = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "12" | "15" | "seasonal"
type HotelCategory = "std" | "dlx" | "prm"
type UserType = "regular" | "b2b"

interface PackageResult {
  sl_code: string
  trip_code: string
  details: string
  rate: number
  itinerary?: string
}

interface PackageFinderProps {
  userType: UserType
}

export default function PackageFinder({ userType }: PackageFinderProps) {
  const [step, setStep] = useState(1)
  const [region, setRegion] = useState<Region | "">("")
  const [duration, setDuration] = useState<Duration | "">("")
  const [paxSize, setPaxSize] = useState<PaxSize | "">("")
  const [kashmirPaxSize, setKashmirPaxSize] = useState<KashmirPaxSize | "">("")
  const [hotelCategory, setHotelCategory] = useState<HotelCategory | "">("")
  const [results, setResults] = useState<PackageResult[]>([])
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  const regions = [
    { value: "south", label: "South" },
    { value: "north", label: "North" },
    { value: "kashmir", label: "Kashmir" },
    { value: "northeast", label: "North East" },
    { value: "international", label: "International" },
  ]

  const durations = [
    { value: "2D3N", label: "2 Days 3 Nights" },
    { value: "3D4N", label: "3 Days 4 Nights" },
    { value: "4D5N", label: "4 Days 5 Nights" },
    { value: "5D6N", label: "5 Days 6 Nights" },
    { value: "6D7N", label: "6 Days 7 Nights" },
  ]

  const paxSizes = [
    { value: "20+2", label: "20+2 Pax" },
    { value: "25+2", label: "25+2 Pax" },
    { value: "30+2", label: "30+2 Pax" },
    { value: "35+3", label: "35+3 Pax" },
    { value: "40+3", label: "40+3 Pax" },
    { value: "45+3", label: "45+3 Pax" },
    { value: "50+3", label: "50+3 Pax" },
  ]

  const kashmirPaxSizes = [
    { value: "2", label: "2 Pax" },
    { value: "3", label: "3 Pax" },
    { value: "4", label: "4 Pax" },
    { value: "5", label: "5 Pax" },
    { value: "6", label: "6 Pax" },
    { value: "7", label: "7 Pax" },
    { value: "8", label: "8 Pax" },
    { value: "9", label: "9 Pax" },
    { value: "10", label: "10 Pax" },
    { value: "12", label: "12 Pax" },
    { value: "15", label: "15 Pax" },
    { value: "seasonal", label: "Seasonal" },
  ]

  const hotelCategories = [
    { value: "std", label: "Standard" },
    { value: "dlx", label: "Deluxe" },
    { value: "prm", label: "Premium" },
  ]

  const handleRegionSelect = (value: string) => {
    setRegion(value as Region)
    setDuration("")
    setPaxSize("")
    setKashmirPaxSize("")
    setHotelCategory("")
    setResults([])
    setSelectedPackage(null)

    if (value === "south") {
      setStep(2)
    } else {
      setStep(3)
    }
  }

  const handleDurationSelect = (value: string) => {
    setDuration(value as Duration)
    setStep(3)
  }

  const handlePaxSelect = (value: string) => {
    if (region === "kashmir") {
      setKashmirPaxSize(value as KashmirPaxSize)
      setStep(3.5) // Go to hotel category selection
    } else {
      setPaxSize(value as PaxSize)
    }
  }

  const handleHotelCategorySelect = (value: string) => {
    setHotelCategory(value as HotelCategory)
  }

  const handleSearch = async () => {
    if (!region) return
    if (region === "kashmir" && (!kashmirPaxSize || !hotelCategory)) return
    if (region !== "kashmir" && !paxSize) return

    setIsLoading(true)
    try {
      const searchPaxSize = region === "kashmir" ? `${kashmirPaxSize}_${hotelCategory}` : paxSize
      const packages = await searchPackages(region, searchPaxSize, userType, region === "south" ? duration : undefined)
      setResults(packages)
      setStep(4)
    } catch (error) {
      console.error("[v0] Error searching packages:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (pkg: PackageResult) => {
    if (!region) return

    setIsLoadingDetails(true)
    try {
      const details = await getPackageDetails(region, pkg.trip_code, userType)
      setSelectedPackage(details)
      setStep(5)
    } catch (error) {
      console.error("[v0] Error fetching package details:", error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleShareWhatsApp = (pkg: PackageResult) => {
    const tripCode = pkg.trip_code.replace(/^(FWS)(\d+)/, "$1 $2")
    const paxDisplay =
      region === "kashmir"
        ? `${kashmirPaxSize} Pax - ${hotelCategories.find((h) => h.value === hotelCategory)?.label}`
        : paxSize
    const lines = [`*${tripCode}*`, `*${paxDisplay}*`, ""]

    const detailsText = pkg.details
    const exclusionMatch = detailsText.match(/Exclusion[:\s]*(.*?)$/i)

    let inclusionsText = detailsText
    let exclusionsText = ""

    if (exclusionMatch) {
      inclusionsText = detailsText.substring(0, exclusionMatch.index).trim()
      exclusionsText = exclusionMatch[1].trim()
    }

    const inclusions = inclusionsText
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s)
    inclusions.forEach((item) => {
      lines.push(item)
    })

    if (exclusionsText) {
      lines.push("")
      lines.push("*Exclusion*")
      const exclusions = exclusionsText
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s)
      exclusions.forEach((item) => {
        lines.push(item)
      })
    }

    lines.push("")
    lines.push(`*Rate:* ₹${pkg.rate.toLocaleString("en-IN")} per person`)

    if (pkg.itinerary) {
      lines.push("")
      lines.push(`*Itinerary:* ${pkg.itinerary}`)
    }

    const message = lines.join("\n")
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShareFullDetails = () => {
    if (!selectedPackage) return

    const tripCode = selectedPackage.trip_code.replace(/^(FWS)(\d+)/, "$1 $2")
    const paxDisplay =
      region === "kashmir"
        ? `${kashmirPaxSize} Pax - ${hotelCategories.find((h) => h.value === hotelCategory)?.label}`
        : paxSize
    const lines = [`*${tripCode}*`, `*${paxDisplay}*`, ""]

    const detailsText = selectedPackage.details
    const exclusionMatch = detailsText.match(/Exclusion[:\s]*(.*?)$/i)

    let inclusionsText = detailsText
    let exclusionsText = ""

    if (exclusionMatch) {
      inclusionsText = detailsText.substring(0, exclusionMatch.index).trim()
      exclusionsText = exclusionMatch[1].trim()
    }

    const inclusions = inclusionsText
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s)
    inclusions.forEach((item) => {
      lines.push(item)
    })

    if (exclusionsText) {
      lines.push("")
      lines.push("*Exclusion*")
      const exclusions = exclusionsText
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s)
      exclusions.forEach((item) => {
        lines.push(item)
      })
    }

    lines.push("")
    const rateKey = region === "kashmir" ? `pax_${kashmirPaxSize.padStart(2, "0")}_${hotelCategory}` : paxSize
    lines.push(`*Rate:* ₹${selectedPackage[rateKey]?.toLocaleString("en-IN") || "N/A"} per person`)

    if (selectedPackage.itinerary) {
      lines.push("")
      lines.push(`*Itinerary:* ${selectedPackage.itinerary}`)
    }

    const message = lines.join("\n")
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleReset = () => {
    setStep(1)
    setRegion("")
    setDuration("")
    setPaxSize("")
    setKashmirPaxSize("")
    setHotelCategory("")
    setResults([])
    setSelectedPackage(null)
  }

  const handleBackToResults = () => {
    setSelectedPackage(null)
    setStep(4)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[1, region === "south" ? 2 : null, 3, region === "kashmir" ? 3.5 : null, 4]
          .filter(Boolean)
          .map((s, idx, arr) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= (s as number) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {Math.floor(s as number)}
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`w-12 h-1 mx-1 transition-colors ${step > (s as number) ? "bg-blue-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Select Region"}
            {step === 2 && "Select Duration"}
            {step === 3 && region === "kashmir" ? "Select Number of Pax" : "Select Number of Pax"}
            {step === 3.5 && "Select Hotel Category"}
            {step === 4 && "Package Results"}
            {step === 5 && "Package Details"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choose your travel destination"}
            {step === 2 && "Choose the duration of your trip"}
            {step === 3 && "Choose the number of travelers"}
            {step === 3.5 && "Choose your preferred hotel category"}
            {step === 4 && `Found ${results.length} package${results.length !== 1 ? "s" : ""}`}
            {step === 5 && "Complete package information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Region Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Region
                </Label>
                <Select value={region} onValueChange={handleRegionSelect}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Duration Selection (only for South) */}
          {step === 2 && region === "south" && (
            <div className="space-y-4">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {regions.find((r) => r.value === region)?.label}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Duration
                </Label>
                <Select value={duration} onValueChange={handleDurationSelect}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                Back
              </Button>
            </div>
          )}

          {/* Step 3: Pax Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {regions.find((r) => r.value === region)?.label}
                </Badge>
                {region === "south" && duration && (
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {durations.find((d) => d.value === duration)?.label}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pax" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Pax
                </Label>
                {region === "kashmir" ? (
                  <Select value={kashmirPaxSize} onValueChange={handlePaxSelect}>
                    <SelectTrigger id="pax">
                      <SelectValue placeholder="Select number of travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      {kashmirPaxSizes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={paxSize} onValueChange={handlePaxSelect}>
                    <SelectTrigger id="pax">
                      <SelectValue placeholder="Select number of travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      {paxSizes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(region === "south" ? 2 : 1)} className="flex-1">
                  Back
                </Button>
                {region === "kashmir" ? (
                  <Button onClick={() => setStep(3.5)} disabled={!kashmirPaxSize} className="flex-1">
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSearch} disabled={!paxSize || isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search Packages"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {step === 3.5 && region === "kashmir" && (
            <div className="space-y-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {regions.find((r) => r.value === region)?.label}
                </Badge>
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {kashmirPaxSizes.find((p) => p.value === kashmirPaxSize)?.label}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel" className="flex items-center gap-2">
                  <Hotel className="w-4 h-4" />
                  Hotel Category
                </Label>
                <Select value={hotelCategory} onValueChange={handleHotelCategorySelect}>
                  <SelectTrigger id="hotel">
                    <SelectValue placeholder="Select hotel category" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotelCategories.map((h) => (
                      <SelectItem key={h.value} value={h.value}>
                        {h.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSearch} disabled={!hotelCategory || isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search Packages"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {regions.find((r) => r.value === region)?.label}
                </Badge>
                {region === "south" && duration && (
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {durations.find((d) => d.value === duration)?.label}
                  </Badge>
                )}
                {region === "kashmir" ? (
                  <>
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {kashmirPaxSizes.find((p) => p.value === kashmirPaxSize)?.label}
                    </Badge>
                    <Badge variant="secondary">
                      <Hotel className="w-3 h-3 mr-1" />
                      {hotelCategories.find((h) => h.value === hotelCategory)?.label}
                    </Badge>
                  </>
                ) : (
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {paxSizes.find((p) => p.value === paxSize)?.label}
                  </Badge>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No packages found for the selected criteria.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <Card
                      key={result.trip_code}
                      className="border-l-4 border-l-blue-600 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-mono text-sm text-muted-foreground">{result.sl_code}</p>
                            <h3 className="font-semibold text-lg">{result.trip_code}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">₹{result.rate.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-muted-foreground">per person</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{result.details}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(result)}
                            disabled={isLoadingDetails}
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleShareWhatsApp(result)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => setStep(region === "kashmir" ? 3.5 : 3)} variant="outline" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                  New Search
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Package Details */}
          {step === 5 && selectedPackage && (
            <div className="space-y-4">
              <Button variant="ghost" onClick={handleBackToResults} className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Package Code</p>
                  <p className="font-semibold text-lg">{selectedPackage.trip_code}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">SL Code</p>
                  <p className="font-mono">{selectedPackage.sl_code}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Details</p>
                  <p className="text-sm">{selectedPackage.details}</p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-semibold mb-2">Available Rates</p>
                  {region === "kashmir" ? (
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {kashmirPaxSizes.map((pax) =>
                        hotelCategories.map((cat) => {
                          const key =
                            pax.value === "seasonal"
                              ? `seasonal_${cat.value}`
                              : `pax_${pax.value.padStart(2, "0")}_${cat.value}`
                          return (
                            selectedPackage[key] && (
                              <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="text-muted-foreground">
                                  {pax.label} - {cat.label}:
                                </span>
                                <span className="font-semibold">₹{selectedPackage[key].toLocaleString("en-IN")}</span>
                              </div>
                            )
                          )
                        }),
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {["20+2", "25+2", "30+2", "35+3", "40+3", "45+3", "50+3"].map(
                        (pax) =>
                          selectedPackage[pax] && (
                            <div key={pax} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="text-muted-foreground">{pax} Pax:</span>
                              <span className="font-semibold">₹{selectedPackage[pax].toLocaleString("en-IN")}</span>
                            </div>
                          ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleShareFullDetails} className="w-full bg-green-600 hover:bg-green-700">
                <Share2 className="w-4 h-4 mr-1" />
                Share Full Details on WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
