// Mock database structure matching the requirements
// Each region has its own table with columns for different pax sizes

interface PackageData {
  sl_code: string
  trip_code: string
  details: string
  "2"?: number
  "3"?: number
  "4"?: number
  "5"?: number
  "6"?: number
  "7"?: number
  "8"?: number
  "9"?: number
  "10"?: number
  "11"?: number
  "12"?: number
  "13"?: number
  "14"?: number
  "15"?: number
  "20+2"?: number
  "25+2"?: number
  "30+2"?: number
  "35+2"?: number
  "40+2"?: number
  "45+2"?: number
  "50+2"?: number
}

export const mockDatabase: Record<string, PackageData[]> = {
  south: [
    {
      sl_code: "S001",
      trip_code: "Kerala 3D4N",
      details: "Munnar & Thekkady - Tea Gardens, Wildlife, Spice Plantations",
      "2": 18500,
      "4": 15200,
      "6": 13800,
      "20+2": 9500,
      "25+2": 8900,
      "30+2": 8200,
    },
    {
      sl_code: "S002",
      trip_code: "Kerala 4D5N",
      details: "Munnar, Thekkady & Alleppey - Backwaters, Houseboat, Hill Stations",
      "2": 24500,
      "4": 19800,
      "6": 17500,
      "20+2": 12500,
      "25+2": 11800,
      "30+2": 10900,
    },
    {
      sl_code: "S003",
      trip_code: "Coorg 2D3N",
      details: "Coffee Plantations, Abbey Falls, Raja Seat",
      "2": 12500,
      "4": 10200,
      "6": 9100,
      "20+2": 6500,
      "25+2": 6100,
      "30+2": 5600,
    },
    {
      sl_code: "S004",
      trip_code: "Ooty 3D4N",
      details: "Botanical Gardens, Ooty Lake, Tea Estates, Toy Train",
      "2": 15800,
      "4": 12900,
      "6": 11500,
      "20+2": 8200,
      "25+2": 7700,
      "30+2": 7100,
    },
  ],
  north: [
    {
      sl_code: "N001",
      trip_code: "Shimla Manali",
      details: "Mall Road, Solang Valley, Rohtang Pass, Adventure Activities",
      "2": 22500,
      "4": 18200,
      "6": 16100,
      "20+2": 11500,
      "25+2": 10800,
      "30+2": 9900,
    },
    {
      sl_code: "N002",
      trip_code: "Rajasthan Heritage",
      details: "Jaipur, Udaipur, Jodhpur - Palaces, Forts, Desert Safari",
      "2": 28500,
      "4": 23200,
      "6": 20500,
      "20+2": 14800,
      "25+2": 13900,
      "30+2": 12800,
    },
    {
      sl_code: "N003",
      trip_code: "Uttarakhand Spiritual",
      details: "Haridwar, Rishikesh - Ganga Aarti, Yoga, River Rafting",
      "2": 16500,
      "4": 13500,
      "6": 12000,
      "20+2": 8600,
      "25+2": 8100,
      "30+2": 7400,
    },
  ],
  kashmir: [
    {
      sl_code: "K001",
      trip_code: "Kashmir Paradise",
      details: "Srinagar, Gulmarg, Pahalgam - Dal Lake, Shikara, Snow Activities",
      "2": 32500,
      "4": 26500,
      "6": 23500,
      "20+2": 16800,
      "25+2": 15800,
      "30+2": 14500,
    },
    {
      sl_code: "K002",
      trip_code: "Kashmir Honeymoon",
      details: "Srinagar & Gulmarg - Romantic Shikara, Gondola, Houseboat Stay",
      "2": 35500,
      "4": 28900,
      "6": 25600,
      "20+2": 18200,
      "25+2": 17100,
      "30+2": 15700,
    },
    {
      sl_code: "K003",
      trip_code: "Kashmir Adventure",
      details: "Sonmarg, Gulmarg - Trekking, Skiing, Mountain Activities",
      "2": 29500,
      "4": 24100,
      "6": 21300,
      "20+2": 15200,
      "25+2": 14300,
      "30+2": 13100,
    },
  ],
  northeast: [
    {
      sl_code: "NE001",
      trip_code: "Sikkim Darjeeling",
      details: "Gangtok, Tsomgo Lake, Tiger Hill, Tea Gardens",
      "2": 26500,
      "4": 21500,
      "6": 19000,
      "20+2": 13600,
      "25+2": 12800,
      "30+2": 11700,
    },
    {
      sl_code: "NE002",
      trip_code: "Meghalaya Wonders",
      details: "Shillong, Cherrapunji - Living Root Bridges, Waterfalls",
      "2": 24500,
      "4": 19900,
      "6": 17600,
      "20+2": 12600,
      "25+2": 11800,
      "30+2": 10900,
    },
    {
      sl_code: "NE003",
      trip_code: "Assam Wildlife",
      details: "Kaziranga, Majuli - Rhino Safari, River Island, Tea Estates",
      "2": 27500,
      "4": 22300,
      "6": 19700,
      "20+2": 14100,
      "25+2": 13200,
      "30+2": 12200,
    },
  ],
  international: [
    {
      sl_code: "I001",
      trip_code: "Dubai Extravaganza",
      details: "Burj Khalifa, Desert Safari, Dubai Mall, Marina Cruise",
      "2": 65500,
      "4": 53200,
      "6": 47000,
      "20+2": 33600,
      "25+2": 31600,
      "30+2": 29000,
    },
    {
      sl_code: "I002",
      trip_code: "Thailand Beach",
      details: "Bangkok, Pattaya, Phuket - Temples, Islands, Nightlife",
      "2": 48500,
      "4": 39400,
      "6": 34800,
      "20+2": 24900,
      "25+2": 23400,
      "30+2": 21500,
    },
    {
      sl_code: "I003",
      trip_code: "Singapore Malaysia",
      details: "Gardens by the Bay, Universal Studios, Genting Highlands",
      "2": 72500,
      "4": 58900,
      "6": 52000,
      "20+2": 37200,
      "25+2": 34900,
      "30+2": 32100,
    },
    {
      sl_code: "I004",
      trip_code: "Bali Paradise",
      details: "Ubud, Seminyak, Nusa Dua - Temples, Beaches, Rice Terraces",
      "2": 55500,
      "4": 45100,
      "6": 39800,
      "20+2": 28500,
      "25+2": 26700,
      "30+2": 24600,
    },
  ],
}
