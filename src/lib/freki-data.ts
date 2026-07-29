// Freki demo sample data — coherent fictional data for Black Ridge Farm.
export type Confidence = "Speculative" | "Low" | "Moderate" | "Strong" | "High";

export function confidenceFromScore(score: number): Confidence {
  if (score >= 85) return "High";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Moderate";
  if (score >= 25) return "Low";
  return "Speculative";
}

export const property = {
  id: "black-ridge",
  name: "Black Ridge Farm",
  location: "Upstate New York",
  acres: 286,
  cover:
    "Mixed hardwoods, agricultural fields, marsh edge, and early successional cover",
  species: "Whitetail deer",
  counts: {
    cameras: 8,
    stands: 6,
    accessRoutes: 3,
    bedding: 4,
    food: 3,
    water: 2,
    observations: 18,
  },
};

export const conditions = {
  wind: { dir: "NW", speedMph: 9, trend: "steady" },
  tempF: 38,
  pressureInHg: 29.72,
  pressureTrend: "falling",
  moonIllum: 0.42,
  moonPhase: "Waning Gibbous",
  disturbance: "Low",
  sunset: "5:41 PM",
  sunrise: "6:52 AM",
};

export const huntOutlook = {
  score: 78,
  recommendation: "Recommended",
  window: "Today, 4:00 – 5:45 PM",
  stand: "North Funnel",
  confidence: "Moderate",
  truthScore: 74,
  summary:
    "Good evening opportunity near North Funnel Stand. A northwest wind protects the primary access route, recent daylight camera activity is above baseline, and falling pressure may increase movement. Confidence is moderate because camera coverage is limited on the eastern ridge.",
  supporting: [
    "11 recent camera detections along the north travel corridor",
    "4 field observations matching the current wind pattern",
    "Cold-front passage in the last 36 hours",
    "Access route stays downwind of the marsh bedding edge",
  ],
  conflicting: [
    "Eastern ridge cameras are offline — coverage gap",
    "No fresh sign at the lower creek crossing this week",
  ],
};

export type Stand = {
  id: string;
  name: string;
  type: string;
  bestWind: string[];
  notes: string;
  x: number;
  y: number;
};

export const stands: Stand[] = [
  { id: "north-funnel", name: "North Funnel", type: "Ladder", bestWind: ["NW", "N", "W"], notes: "Pinch between hardwoods and standing corn.", x: 32, y: 22 },
  { id: "oak-bench", name: "Oak Bench", type: "Hang-on", bestWind: ["W", "SW"], notes: "White oak flat above the creek.", x: 58, y: 44 },
  { id: "creek-crossing", name: "Creek Crossing", type: "Ground blind", bestWind: ["N", "NE"], notes: "Heavy rub line on both banks.", x: 48, y: 62 },
  { id: "marsh-edge", name: "Marsh Edge", type: "Ladder", bestWind: ["E", "NE"], notes: "Doe family group staging area.", x: 74, y: 70 },
  { id: "south-gate", name: "South Gate", type: "Ladder", bestWind: ["S", "SW"], notes: "Field-edge sit, easy access.", x: 42, y: 82 },
  { id: "hidden-plot", name: "Hidden Plot", type: "Elevated blind", bestWind: ["N", "NW"], notes: "Half-acre brassica plot in the interior.", x: 63, y: 30 },
];

export type Camera = {
  id: string;
  name: string;
  status: "Online" | "Offline" | "Low battery";
  battery: number;
  lastCheck: string;
  detections24h: number;
  daylightPct: number;
  targetActivity: "Above" | "Baseline" | "Below";
  x: number;
  y: number;
};

export const cameras: Camera[] = [
  { id: "cam-1", name: "North Funnel", status: "Online", battery: 82, lastCheck: "2h ago", detections24h: 14, daylightPct: 42, targetActivity: "Above", x: 33, y: 24 },
  { id: "cam-2", name: "Creek Crossing", status: "Online", battery: 64, lastCheck: "5h ago", detections24h: 9, daylightPct: 22, targetActivity: "Baseline", x: 49, y: 62 },
  { id: "cam-3", name: "West Field", status: "Online", battery: 71, lastCheck: "1h ago", detections24h: 7, daylightPct: 55, targetActivity: "Above", x: 18, y: 48 },
  { id: "cam-4", name: "East Ridge", status: "Offline", battery: 12, lastCheck: "3d ago", detections24h: 0, daylightPct: 0, targetActivity: "Below", x: 82, y: 34 },
  { id: "cam-5", name: "Marsh Edge", status: "Online", battery: 58, lastCheck: "6h ago", detections24h: 11, daylightPct: 30, targetActivity: "Baseline", x: 76, y: 72 },
  { id: "cam-6", name: "Oak Bench", status: "Online", battery: 90, lastCheck: "30m ago", detections24h: 6, daylightPct: 48, targetActivity: "Above", x: 60, y: 46 },
  { id: "cam-7", name: "South Gate", status: "Low battery", battery: 22, lastCheck: "1d ago", detections24h: 3, daylightPct: 18, targetActivity: "Below", x: 42, y: 84 },
  { id: "cam-8", name: "Hidden Plot", status: "Online", battery: 76, lastCheck: "4h ago", detections24h: 8, daylightPct: 38, targetActivity: "Above", x: 64, y: 32 },
];

export type Detection = {
  id: string;
  cameraId: string;
  time: string;
  species: string;
  confidence: number;
  daylight: boolean;
  tempF: number;
  wind: string;
  moon: string;
  tags: string[];
};

export const detections: Detection[] = [
  { id: "d1", cameraId: "cam-1", time: "Today 4:12 PM", species: "Whitetail buck", confidence: 96, daylight: true, tempF: 41, wind: "NW 8", moon: "Waning Gib.", tags: ["mature", "10-pt"] },
  { id: "d2", cameraId: "cam-1", time: "Today 6:38 AM", species: "Whitetail doe", confidence: 98, daylight: true, tempF: 34, wind: "NW 6", moon: "Waning Gib.", tags: ["family group"] },
  { id: "d3", cameraId: "cam-6", time: "Yesterday 5:22 PM", species: "Whitetail buck", confidence: 91, daylight: true, tempF: 43, wind: "W 10", moon: "Waning Gib.", tags: ["8-pt"] },
  { id: "d4", cameraId: "cam-3", time: "Yesterday 7:04 AM", species: "Whitetail doe", confidence: 97, daylight: true, tempF: 36, wind: "SW 5", moon: "Waning Gib.", tags: [] },
  { id: "d5", cameraId: "cam-5", time: "Yesterday 2:14 AM", species: "Whitetail buck", confidence: 88, daylight: false, tempF: 32, wind: "N 4", moon: "Waning Gib.", tags: ["scrape check"] },
  { id: "d6", cameraId: "cam-8", time: "Yesterday 5:51 PM", species: "Whitetail doe", confidence: 95, daylight: true, tempF: 40, wind: "NW 7", moon: "Waning Gib.", tags: ["fawn"] },
  { id: "d7", cameraId: "cam-2", time: "2 days ago 6:41 AM", species: "Coyote", confidence: 82, daylight: false, tempF: 30, wind: "N 3", moon: "Waning Gib.", tags: ["predator"] },
  { id: "d8", cameraId: "cam-1", time: "2 days ago 5:02 PM", species: "Whitetail buck", confidence: 93, daylight: true, tempF: 44, wind: "NW 9", moon: "Full", tags: ["10-pt"] },
];

export type Observation = {
  id: string;
  date: string;
  location: string;
  type: string;
  species: string;
  count: number;
  direction: string;
  behavior: string;
  wind: string;
  notes: string;
  confidence: number;
};

export const observations: Observation[] = [
  { id: "o1", date: "Today 3:12 PM", location: "North Funnel", type: "Sighting", species: "Whitetail buck", count: 1, direction: "SW → NE", behavior: "Cruising", wind: "NW 8", notes: "Solo buck, checked scrape at the field edge.", confidence: 92 },
  { id: "o2", date: "Yesterday", location: "Creek Crossing", type: "Rub", species: "Whitetail buck", count: 0, direction: "—", behavior: "—", wind: "W 6", notes: "Fresh rub, 4in cedar, west side of creek.", confidence: 85 },
  { id: "o3", date: "Yesterday", location: "Oak Bench", type: "Scrape", species: "Whitetail buck", count: 0, direction: "—", behavior: "—", wind: "W 6", notes: "Scrape line reopened, primary licking branch active.", confidence: 88 },
  { id: "o4", date: "2 days ago", location: "Marsh Edge", type: "Sighting", species: "Whitetail doe", count: 4, direction: "N → S", behavior: "Feeding", wind: "N 4", notes: "Doe group with two fawns, staging before dark.", confidence: 95 },
  { id: "o5", date: "3 days ago", location: "West Field", type: "Track", species: "Whitetail buck", count: 0, direction: "E → W", behavior: "—", wind: "SW 5", notes: "Large track set crossing plowed edge.", confidence: 70 },
  { id: "o6", date: "4 days ago", location: "South Gate", type: "Human pressure", species: "—", count: 0, direction: "—", behavior: "—", wind: "S 12", notes: "Neighboring hunter walked property line at dusk.", confidence: 100 },
];

export type BrainStatement = {
  id: string;
  category: string;
  statement: string;
  evidence: "Confirmed" | "Observed" | "User-reported" | "Inferred" | "Predicted" | "Unknown";
  confidence: number;
  supporting: string[];
  conflicting: string[];
  updated: string;
  sources: number;
};

export const brainStatements: BrainStatement[] = [
  {
    id: "b1",
    category: "Travel corridors",
    statement: "Deer frequently use the northern field edge during the final hour of daylight.",
    evidence: "Observed",
    confidence: 82,
    supporting: ["11 daylight detections at North Funnel this week", "4 recent sightings within 60 min of sunset", "Consistent trail pattern across 3 cold fronts"],
    conflicting: ["No matching detections on West Field this week"],
    updated: "Updated 2h ago",
    sources: 15,
  },
  {
    id: "b2",
    category: "Human access",
    statement: "South access may contaminate the central bedding area under a southwest wind.",
    evidence: "Inferred",
    confidence: 68,
    supporting: ["Bedding zone sits NE of South Gate", "Prevailing SW wind carries scent across corridor"],
    conflicting: ["No post-entry disturbance recorded when tested twice this fall"],
    updated: "Updated yesterday",
    sources: 5,
  },
  {
    id: "b3",
    category: "Camera coverage",
    statement: "The eastern ridge is under-observed because no cameras currently cover that area.",
    evidence: "Confirmed",
    confidence: 96,
    supporting: ["East Ridge camera offline for 3 days", "Zero detections logged from that quadrant this month"],
    conflicting: [],
    updated: "Updated 3d ago",
    sources: 2,
  },
  {
    id: "b4",
    category: "Bedding",
    statement: "The marsh-edge thicket is the primary daytime bedding for at least one mature buck.",
    evidence: "Observed",
    confidence: 74,
    supporting: ["Nighttime scrape-check pattern at Marsh Edge camera", "Bedding sign confirmed on scout in October"],
    conflicting: ["Recent SW winds may have shifted bedding east"],
    updated: "Updated 5d ago",
    sources: 8,
  },
  {
    id: "b5",
    category: "Seasonal patterns",
    statement: "Daylight buck movement increases 24–48 hours after a cold front with falling pressure.",
    evidence: "Inferred",
    confidence: 71,
    supporting: ["3 of last 4 cold fronts produced daylight sightings", "Consistent with regional data"],
    conflicting: ["Small sample size this season"],
    updated: "Updated 1d ago",
    sources: 6,
  },
  {
    id: "b6",
    category: "Uncertainty",
    statement: "Movement patterns between the eastern ridge and the hidden plot are unknown.",
    evidence: "Unknown",
    confidence: 20,
    supporting: [],
    conflicting: ["No camera coverage", "No recent observations from the ridge saddle"],
    updated: "Flagged today",
    sources: 0,
  },
];

export type HuntRecord = {
  id: string;
  date: string;
  location: string;
  entry: string;
  exit: string;
  wind: string;
  weather: string;
  sightings: number;
  encounters: string;
  shots: number;
  harvest: string;
  pressure: "Low" | "Moderate" | "High";
  notes: string;
  originalScore: number;
  outcome: "Productive" | "Neutral" | "Unproductive";
};

export const hunts: HuntRecord[] = [
  { id: "h1", date: "Nov 12", location: "North Funnel", entry: "3:20 PM", exit: "5:50 PM", wind: "NW 8", weather: "Overcast, 38°F", sightings: 6, encounters: "2 does, 1 young buck", shots: 0, harvest: "None", pressure: "Low", notes: "Clean access. Deer moved 45 min before dark.", originalScore: 74, outcome: "Productive" },
  { id: "h2", date: "Nov 10", location: "Oak Bench", entry: "6:00 AM", exit: "10:15 AM", wind: "W 6", weather: "Clear, 32°F", sightings: 3, encounters: "1 doe group", shots: 0, harvest: "None", pressure: "Low", notes: "Wind switched mid-morning as forecast.", originalScore: 68, outcome: "Neutral" },
  { id: "h3", date: "Nov 6", location: "South Gate", entry: "3:40 PM", exit: "5:35 PM", wind: "S 10", weather: "Windy, 46°F", sightings: 0, encounters: "None", shots: 0, harvest: "None", pressure: "High", notes: "Neighbor pressure from adjacent parcel.", originalScore: 42, outcome: "Unproductive" },
  { id: "h4", date: "Nov 2", location: "Marsh Edge", entry: "6:20 AM", exit: "9:40 AM", wind: "NE 5", weather: "Fog then clear, 30°F", sightings: 4, encounters: "3 does, 1 spike", shots: 0, harvest: "None", pressure: "Low", notes: "Doe family staged past shooting light.", originalScore: 71, outcome: "Productive" },
];

export const cameraHourly = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h.toString().padStart(2, "0")}:00`,
  detections:
    h === 6 || h === 7 ? 8 + Math.round(Math.sin(h) * 2) :
    h === 17 || h === 18 ? 9 + Math.round(Math.cos(h) * 2) :
    h >= 20 || h <= 4 ? 3 + (h % 3) :
    1 + (h % 2),
}));

export const speciesBreakdown = [
  { name: "Whitetail buck", value: 34 },
  { name: "Whitetail doe", value: 48 },
  { name: "Turkey", value: 9 },
  { name: "Coyote", value: 5 },
  { name: "Other", value: 4 },
];

export const weeklyActivity = [
  { day: "Mon", daylight: 4, night: 8 },
  { day: "Tue", daylight: 5, night: 6 },
  { day: "Wed", daylight: 3, night: 7 },
  { day: "Thu", daylight: 7, night: 9 },
  { day: "Fri", daylight: 8, night: 10 },
  { day: "Sat", daylight: 6, night: 7 },
  { day: "Sun", daylight: 9, night: 11 },
];
