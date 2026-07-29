// Local-storage backed Freki store. Persists demo edits in the browser.
import { useSyncExternalStore } from "react";
import {
  stands as seedStands,
  cameras as seedCameras,
  observations as seedObservations,
  hunts as seedHunts,
  property as seedProperty,
  conditions as seedConditions,
} from "./freki-data";

export type Stand = {
  id: string;
  name: string;
  type: string;
  bestWind: string[];
  notes: string;
  x: number;
  y: number;
};

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

export type Feature = {
  id: string;
  name: string;
  notes?: string;
  x: number;
  y: number;
};

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
  outcome: "Productive" | "Neutral" | "Unproductive" | "Pending";
};

export type Conditions = {
  windDir: string;
  windMph: number;
  tempF: number;
  pressureInHg: number;
  pressureTrend: "rising" | "steady" | "falling";
  precipitation: "None" | "Light rain" | "Rain" | "Snow";
  timeOfDay: "Morning" | "Midday" | "Evening" | "All-day";
  pressure: "Low" | "Moderate" | "High";
};

export type Property = {
  id: string;
  name: string;
  location: string;
  acres: number;
  species: string;
  cover: string;
  stands: Stand[];
  cameras: Camera[];
  food: Feature[];
  bedding: Feature[];
  access: Feature[];
  observations: Observation[];
  hunts: HuntRecord[];
};

export type TrustedContact = {
  id: string;
  name: string;
  relationship: string;
  sharing: boolean;
};

export type PublicLandMode = "invisible" | "nearby" | "trusted";

export type NearbyHunter = {
  id: string;
  username: string;
  distanceMiles: number;
  direction:
    | "North"
    | "Northeast"
    | "East"
    | "Southeast"
    | "South"
    | "Southwest"
    | "West"
    | "Northwest";
};

export type Safety = {
  sharingEnabled: boolean;
  contacts: TrustedContact[];
  publicLandMode: PublicLandMode;
  onPublicLand: boolean;
  nearbyHunters: NearbyHunter[];
  nearbySharingCount: number;
};

type State = {
  activeId: string;
  properties: Property[];
  conditions: Conditions;
  safety: Safety;
};

const STORAGE_KEY = "freki:v1";

const defaultConditions: Conditions = {
  windDir: seedConditions.wind.dir,
  windMph: seedConditions.wind.speedMph,
  tempF: seedConditions.tempF,
  pressureInHg: seedConditions.pressureInHg,
  pressureTrend: seedConditions.pressureTrend as Conditions["pressureTrend"],
  precipitation: "None",
  timeOfDay: "Evening",
  pressure: "Low",
};

const defaultSafety: Safety = {
  sharingEnabled: false,
  contacts: [
    { id: "tc-1", name: "Sarah Halden", relationship: "Spouse", sharing: true },
    { id: "tc-2", name: "Mike Reeves", relationship: "Hunting Partner", sharing: true },
    { id: "tc-3", name: "Dad", relationship: "Father", sharing: false },
  ],
  publicLandMode: "nearby",
  onPublicLand: false,
  nearbySharingCount: 8,
  nearbyHunters: [
    { id: "nh-1", username: "Mike R.", distanceMiles: 0.4, direction: "Northwest" },
    { id: "nh-2", username: "Sarah B.", distanceMiles: 0.8, direction: "East" },
    { id: "nh-3", username: "John D.", distanceMiles: 1.2, direction: "South" },
    { id: "nh-4", username: "Ellen K.", distanceMiles: 1.5, direction: "Northeast" },
    { id: "nh-5", username: "Trevor P.", distanceMiles: 1.8, direction: "Southwest" },
    { id: "nh-6", username: "Rae M.", distanceMiles: 2.1, direction: "West" },
    { id: "nh-7", username: "Chris W.", distanceMiles: 2.4, direction: "Southeast" },
    { id: "nh-8", username: "Dan H.", distanceMiles: 2.9, direction: "North" },
  ],
};

function seedProperties(): Property[] {
  return [
    {
      id: seedProperty.id,
      name: seedProperty.name,
      location: seedProperty.location,
      acres: seedProperty.acres,
      species: seedProperty.species,
      cover: seedProperty.cover,
      stands: seedStands.map((s) => ({ ...s })),
      cameras: seedCameras.map((c) => ({ ...c })),
      food: [
        { id: "f1", name: "Standing corn", x: 40, y: 20, notes: "Neighbor's corn — still standing." },
        { id: "f2", name: "Brassica plot", x: 63, y: 32, notes: "Half-acre interior plot." },
        { id: "f3", name: "White oak flat", x: 58, y: 44, notes: "Heavy mast this year." },
      ],
      bedding: [
        { id: "bed1", name: "Marsh-edge thicket", x: 78, y: 68, notes: "Primary daytime bedding." },
        { id: "bed2", name: "North hardwoods knob", x: 28, y: 30 },
        { id: "bed3", name: "Center pines", x: 55, y: 50 },
        { id: "bed4", name: "East ridge (unknown)", x: 86, y: 40, notes: "Coverage gap — unconfirmed." },
      ],
      access: [
        { id: "a1", name: "South gate parking", x: 42, y: 92, notes: "Vehicle access." },
        { id: "a2", name: "North two-track", x: 22, y: 12, notes: "Downwind of marsh under NW." },
        { id: "a3", name: "West field edge", x: 12, y: 55 },
      ],
      observations: seedObservations.map((o) => ({ ...o })),
      hunts: seedHunts.map((h) => ({ ...h })),
    },
  ];
}

function initialState(): State {
  return { activeId: seedProperty.id, properties: seedProperties(), conditions: defaultConditions, safety: { ...defaultSafety, contacts: defaultSafety.contacts.map((c) => ({ ...c })) } };
}

function load(): State {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!parsed.properties?.length) return initialState();
    const base = initialState();
    return {
      ...base,
      ...parsed,
      conditions: { ...defaultConditions, ...(parsed.conditions ?? {}) },
      safety: { ...base.safety, ...(parsed.safety ?? {}) },
    } as State;
  } catch {
    return initialState();
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
}
function emit() { listeners.forEach((l) => l()); }
function set(updater: (s: State) => State) {
  state = updater(state);
  persist();
  emit();
}

function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }
function getSnapshot() { return state; }
function getServerSnapshot() { return initialState(); }

export function useFreki<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(initialState()));
}

export function useActiveProperty(): Property {
  return useFreki((s) => s.properties.find((p) => p.id === s.activeId) ?? s.properties[0]);
}

export function useProperties(): Property[] {
  return useFreki((s) => s.properties);
}

export function useConditions(): Conditions {
  return useFreki((s) => s.conditions);
}

export function useSafety(): Safety {
  return useFreki((s) => s.safety);
}

export const store = {
  // properties
  addProperty(input: Omit<Property, "id" | "stands" | "cameras" | "food" | "bedding" | "access" | "observations" | "hunts">) {
    const id = `p-${Date.now()}`;
    const p: Property = {
      id, ...input,
      stands: [], cameras: [], food: [], bedding: [], access: [], observations: [], hunts: [],
    };
    set((s) => ({ ...s, properties: [...s.properties, p], activeId: id }));
    return id;
  },
  updateProperty(id: string, patch: Partial<Property>) {
    set((s) => ({ ...s, properties: s.properties.map((p) => p.id === id ? { ...p, ...patch } : p) }));
  },
  removeProperty(id: string) {
    set((s) => {
      const properties = s.properties.filter((p) => p.id !== id);
      const activeId = s.activeId === id ? properties[0]?.id ?? "" : s.activeId;
      return { ...s, properties, activeId };
    });
  },
  setActive(id: string) { set((s) => ({ ...s, activeId: id })); },

  // conditions
  setConditions(patch: Partial<Conditions>) {
    set((s) => ({ ...s, conditions: { ...s.conditions, ...patch } }));
  },

  // safety
  setSharingEnabled(enabled: boolean) {
    set((s) => ({ ...s, safety: { ...s.safety, sharingEnabled: enabled } }));
  },
  addContact(v: Omit<TrustedContact, "id">) {
    const id = `tc-${Date.now()}`;
    set((s) => ({ ...s, safety: { ...s.safety, contacts: [...s.safety.contacts, { ...v, id }] } }));
    return id;
  },
  updateContact(id: string, patch: Partial<TrustedContact>) {
    set((s) => ({ ...s, safety: { ...s.safety, contacts: s.safety.contacts.map((c) => c.id === id ? { ...c, ...patch } : c) } }));
  },
  removeContact(id: string) {
    set((s) => ({ ...s, safety: { ...s.safety, contacts: s.safety.contacts.filter((c) => c.id !== id) } }));
  },
  setPublicLandMode(mode: PublicLandMode) {
    set((s) => ({ ...s, safety: { ...s.safety, publicLandMode: mode } }));
  },
  setOnPublicLand(v: boolean) {
    set((s) => ({ ...s, safety: { ...s.safety, onPublicLand: v } }));
  },

  // generic collection helpers on active property
  _mutateActive(fn: (p: Property) => Property) {
    set((s) => ({ ...s, properties: s.properties.map((p) => p.id === s.activeId ? fn(p) : p) }));
  },

  addStand(v: Omit<Stand, "id">) {
    const id = `stand-${Date.now()}`;
    store._mutateActive((p) => ({ ...p, stands: [...p.stands, { ...v, id }] }));
    return id;
  },
  updateStand(id: string, patch: Partial<Stand>) {
    store._mutateActive((p) => ({ ...p, stands: p.stands.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  },
  removeStand(id: string) {
    store._mutateActive((p) => ({ ...p, stands: p.stands.filter((x) => x.id !== id) }));
  },

  addCamera(v: Omit<Camera, "id">) {
    const id = `cam-${Date.now()}`;
    store._mutateActive((p) => ({ ...p, cameras: [...p.cameras, { ...v, id }] }));
    return id;
  },
  updateCamera(id: string, patch: Partial<Camera>) {
    store._mutateActive((p) => ({ ...p, cameras: p.cameras.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  },
  removeCamera(id: string) {
    store._mutateActive((p) => ({ ...p, cameras: p.cameras.filter((x) => x.id !== id) }));
  },

  addFeature(kind: "food" | "bedding" | "access", v: Omit<Feature, "id">) {
    const id = `${kind}-${Date.now()}`;
    store._mutateActive((p) => ({ ...p, [kind]: [...p[kind], { ...v, id }] }) as Property);
    return id;
  },
  updateFeature(kind: "food" | "bedding" | "access", id: string, patch: Partial<Feature>) {
    store._mutateActive((p) => ({ ...p, [kind]: p[kind].map((x) => x.id === id ? { ...x, ...patch } : x) }) as Property);
  },
  removeFeature(kind: "food" | "bedding" | "access", id: string) {
    store._mutateActive((p) => ({ ...p, [kind]: p[kind].filter((x) => x.id !== id) }) as Property);
  },

  addObservation(v: Omit<Observation, "id">) {
    const id = `o-${Date.now()}`;
    store._mutateActive((p) => ({ ...p, observations: [{ ...v, id }, ...p.observations] }));
    return id;
  },
  removeObservation(id: string) {
    store._mutateActive((p) => ({ ...p, observations: p.observations.filter((x) => x.id !== id) }));
  },

  addHunt(v: Omit<HuntRecord, "id">) {
    const id = `h-${Date.now()}`;
    store._mutateActive((p) => ({ ...p, hunts: [{ ...v, id }, ...p.hunts] }));
    return id;
  },
  updateHunt(id: string, patch: Partial<HuntRecord>) {
    store._mutateActive((p) => ({ ...p, hunts: p.hunts.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  },
  removeHunt(id: string) {
    store._mutateActive((p) => ({ ...p, hunts: p.hunts.filter((x) => x.id !== id) }));
  },

  resetDemo() {
    set(() => initialState());
  },
};

// -------- Hunt evaluation --------
export type HuntRecommendation = {
  score: number;
  confidence: "Low" | "Moderate" | "Strong" | "High";
  confidencePct: number;
  headline: string;
  recommendedStand: Stand | null;
  alternatives: Stand[];
  reasoning: string;
  supporting: string[];
  conflicting: string[];
  changers: string[];
  window: string;
};

const WIND_ORDER = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function windDelta(a: string, b: string) {
  const ia = WIND_ORDER.indexOf(a); const ib = WIND_ORDER.indexOf(b);
  if (ia < 0 || ib < 0) return 4;
  const d = Math.abs(ia - ib);
  return Math.min(d, 8 - d);
}
function windFit(stand: Stand, windDir: string) {
  if (stand.bestWind.includes(windDir)) return 1;
  const min = Math.min(...stand.bestWind.map((w) => windDelta(w, windDir)));
  return min === 1 ? 0.7 : min === 2 ? 0.4 : 0.1;
}

export function evaluateHunt(input: {
  property: Property;
  conditions: Conditions;
  standId?: string;
}): HuntRecommendation {
  const { property, conditions } = input;
  const stands = property.stands;
  const cams = property.cameras;

  const scored = stands.map((s) => {
    const fit = windFit(s, conditions.windDir);
    let score = 40 + fit * 40; // 40-80 base from wind
    // Pressure
    if (conditions.pressure === "High") score -= 15;
    else if (conditions.pressure === "Moderate") score -= 6;
    // Barometric trend + temp
    if (conditions.pressureTrend === "falling" && conditions.tempF < 45) score += 8;
    if (conditions.pressureTrend === "rising") score -= 3;
    if (conditions.tempF < 25 || conditions.tempF > 70) score -= 5;
    // Precip
    if (conditions.precipitation === "Rain") score -= 10;
    if (conditions.precipitation === "Light rain") score -= 3;
    if (conditions.precipitation === "Snow") score += 4;
    // Time of day match
    if (conditions.timeOfDay === "Morning" && /marsh|creek|oak/i.test(s.name)) score += 4;
    if (conditions.timeOfDay === "Evening" && /funnel|field|plot|gate/i.test(s.name)) score += 6;
    // Nearby camera signal
    const nearby = cams.filter((c) => Math.hypot(c.x - s.x, c.y - s.y) < 15);
    const detects = nearby.reduce((n, c) => n + c.detections24h, 0);
    const offline = nearby.some((c) => c.status === "Offline");
    if (detects > 10) score += 6;
    else if (detects > 5) score += 3;
    if (offline) score -= 4;

    score = Math.max(6, Math.min(97, Math.round(score)));
    return { stand: s, score, fit, nearby, detects, offline };
  });

  scored.sort((a, b) => b.score - a.score);
  const chosen = input.standId ? scored.find((r) => r.stand.id === input.standId) ?? scored[0] : scored[0];
  if (!chosen) {
    return {
      score: 0, confidence: "Low", confidencePct: 20,
      headline: "Add a stand to get a recommendation",
      recommendedStand: null, alternatives: [],
      reasoning: "No stands are defined for this property yet. Add at least one stand to evaluate a hunt.",
      supporting: [], conflicting: ["No stands available"],
      changers: ["Add stands, cameras and bedding to build a real recommendation."],
      window: "—",
    };
  }

  const supporting: string[] = [];
  const conflicting: string[] = [];
  const changers: string[] = [];

  if (chosen.stand.bestWind.includes(conditions.windDir))
    supporting.push(`Wind (${conditions.windDir}) matches this stand's setup for ${chosen.stand.bestWind.join("/")}`);
  else if (chosen.fit >= 0.6)
    supporting.push(`Wind (${conditions.windDir}) is close to ideal (${chosen.stand.bestWind.join("/")}) — usable with clean access`);
  else
    conflicting.push(`Wind (${conditions.windDir}) does not match ideal winds for this stand (${chosen.stand.bestWind.join("/")})`);

  if (chosen.detects > 5) supporting.push(`${chosen.detects} recent camera detections within 15% of this stand`);
  if (chosen.detects === 0 && chosen.nearby.length > 0) conflicting.push("No recent camera detections near this stand");
  if (chosen.nearby.length === 0) {
    conflicting.push("No trail cameras near this stand — limited local signal");
    changers.push("Place a camera within 100 yards to sharpen this recommendation");
  }
  if (chosen.offline) {
    conflicting.push("A nearby camera is offline — coverage gap");
    changers.push("Bring the offline camera back online");
  }

  if (conditions.pressureTrend === "falling" && conditions.tempF < 45)
    supporting.push("Falling pressure + cool temps tend to boost daylight movement");
  if (conditions.pressureTrend === "rising")
    conflicting.push("Rising pressure can suppress daylight movement");
  if (conditions.pressure === "High") {
    conflicting.push("Recent human pressure is high on this property");
    changers.push("Give the area 24–48 hours to recover from pressure");
  } else if (conditions.pressure === "Low") {
    supporting.push("Recent human pressure is low");
  }
  if (conditions.precipitation === "Rain")
    conflicting.push("Steady rain reduces movement and washes out sign");
  if (conditions.precipitation === "Snow")
    supporting.push("Fresh snow often triggers a movement surge");

  // Bedding proximity check
  const bedding = property.bedding;
  const nearBed = bedding.find((b) => Math.hypot(b.x - chosen.stand.x, b.y - chosen.stand.y) < 12);
  if (nearBed) {
    if (chosen.fit >= 0.8) supporting.push(`Wind carries scent away from ${nearBed.name}`);
    else conflicting.push(`Scent likely reaches ${nearBed.name} on this wind`);
  }

  const uncertaintyPoints = (chosen.nearby.length === 0 ? 20 : 0)
    + (chosen.offline ? 10 : 0)
    + (chosen.fit < 0.5 ? 15 : chosen.fit < 0.8 ? 5 : 0)
    + (property.observations.length < 5 ? 10 : 0);
  const confidencePct = Math.max(20, Math.min(92, 90 - uncertaintyPoints));
  const confidence: HuntRecommendation["confidence"] =
    confidencePct >= 80 ? "High" : confidencePct >= 65 ? "Strong" : confidencePct >= 45 ? "Moderate" : "Low";

  const window = conditions.timeOfDay === "Morning"
    ? "First 2 hours after legal light"
    : conditions.timeOfDay === "Evening"
    ? "Final 90 minutes of daylight"
    : conditions.timeOfDay === "Midday"
    ? "10:30 AM – 1:30 PM (rut-window sit)"
    : "All-day sit — plan for wind-shift midday";

  const verdict = chosen.score >= 70 ? "Recommended"
    : chosen.score >= 50 ? "Marginal — hunt with care"
    : "Not recommended today";

  const headline = `${verdict}: ${chosen.stand.name}`;
  const reasoning = `${chosen.stand.name} scores ${chosen.score}/100 for a ${conditions.timeOfDay.toLowerCase()} sit with a ${conditions.windDir} wind at ${conditions.windMph} mph, ${conditions.tempF}°F, pressure ${conditions.pressureInHg}" (${conditions.pressureTrend}). ${nearBed ? `The stand sits near ${nearBed.name}; ` : ""}${chosen.fit >= 0.8 ? "wind protects your access and scent cone." : chosen.fit >= 0.5 ? "wind is close but not perfect — enter early and stay still." : "wind is wrong for this location — consider an alternate."}`;

  if (!changers.length) changers.push("A wind shift, fresh sign, or new observation could raise or lower confidence.");

  return {
    score: chosen.score,
    confidence,
    confidencePct,
    headline,
    recommendedStand: chosen.stand,
    alternatives: scored.filter((r) => r.stand.id !== chosen.stand.id).slice(0, 3).map((r) => r.stand),
    reasoning,
    supporting,
    conflicting,
    changers,
    window,
  };
}
