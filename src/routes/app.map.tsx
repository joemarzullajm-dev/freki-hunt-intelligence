import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { stands, cameras, property } from "@/lib/freki-data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wind, X, MapPin, Camera as CameraIcon, Bed, Wheat, Droplets, Route as RouteIcon } from "lucide-react";

export const Route = createFileRoute("/app/map")({
  head: () => ({
    meta: [
      { title: "Property Map — Freki" },
      { name: "description", content: "Interactive map of Black Ridge Farm." },
    ],
  }),
  component: MapPage,
});

interface Feature { id: string; type: string; name: string; x: number; y: number; note?: string; }

const bedding: Feature[] = [
  { id: "bed1", type: "Bedding", name: "Marsh-edge thicket", x: 78, y: 68, note: "Primary daytime bedding." },
  { id: "bed2", type: "Bedding", name: "North hardwoods knob", x: 28, y: 30 },
  { id: "bed3", type: "Bedding", name: "Center pines", x: 55, y: 50 },
  { id: "bed4", type: "Bedding", name: "East ridge (unknown)", x: 86, y: 40, note: "Coverage gap." },
];
const food: Feature[] = [
  { id: "f1", type: "Food", name: "Standing corn", x: 40, y: 20 },
  { id: "f2", type: "Food", name: "Brassica plot", x: 63, y: 32 },
  { id: "f3", type: "Food", name: "White oak flat", x: 58, y: 44 },
];
const water: Feature[] = [
  { id: "w1", type: "Water", name: "Creek", x: 50, y: 60 },
  { id: "w2", type: "Water", name: "Marsh", x: 78, y: 78 },
];
const access: Feature[] = [
  { id: "a1", type: "Access", name: "South gate parking", x: 42, y: 92 },
  { id: "a2", type: "Access", name: "North two-track", x: 22, y: 12 },
  { id: "a3", type: "Access", name: "West field edge", x: 12, y: 55 },
];

const layerLabels: Record<string, string> = {
  stands: "Stands",
  cameras: "Cameras",
  bedding: "Bedding",
  food: "Food",
  water: "Water",
  access: "Access routes",
  wind: "Wind indicator",
  boundary: "Property boundary",
  corridors: "Travel corridors",
};

function MapPage() {
  const [layers, setLayers] = useState({
    stands: true, cameras: true, bedding: true, food: true, water: true, access: true, wind: true, boundary: true, corridors: true,
  });
  const [selected, setSelected] = useState<null | { name: string; type: string; note?: string }>(null);

  return (
    <>
      <PageHeader
        title="Property Map"
        description={`${property.name} · ${property.acres} acres`}
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-[240px_1fr_280px]">
          {/* Layers */}
          <aside className="surface-panel p-4 order-2 lg:order-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Layers</div>
            <div className="mt-3 space-y-2 text-sm">
              {Object.entries(layers).map(([k, v]) => (
                <label key={k} className="flex items-center justify-between gap-3">
                  <span>{layerLabels[k] ?? k}</span>
                  <Switch checked={v} onCheckedChange={(c) => setLayers((prev) => ({ ...prev, [k]: c }))} aria-label={`Toggle ${layerLabels[k] ?? k}`} />
                </label>
              ))}
            </div>
          </aside>

          {/* Map */}
          <div className="order-1 lg:order-2 surface-panel relative aspect-[4/3] overflow-hidden">
            <MapCanvas layers={layers} onSelect={setSelected} />
          </div>

          {/* Intelligence */}
          <aside className="surface-panel p-4 order-3">
            <div className="text-xs uppercase tracking-wider text-[var(--bronze)]">Map intelligence</div>
            {selected ? (
              <>
                <div className="mt-2 font-display text-lg font-semibold">{selected.name}</div>
                <div className="text-xs text-muted-foreground">{selected.type}</div>
                {selected.note && <p className="mt-2 text-sm">{selected.note}</p>}
                <div className="mt-3 rounded-md border border-border p-3 text-xs">
                  <div className="flex items-center gap-1"><Wind className="h-3 w-3" /> With current NW wind, this location is <strong>downwind</strong> of the marsh bedding — good access.</div>
                </div>
                <Button className="mt-3 w-full" size="sm" onClick={() => setSelected(null)}>Close</Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tap a marker for details. Wind arrow shows the current NW flow. Green corridor lines
                  indicate observed travel patterns between the marsh bedding and the northern food edge.
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  <Legend swatch="bg-[var(--bronze)]" label="Trail cameras" />
                  <Legend swatch="bg-foreground" label="Stands" />
                  <Legend swatch="bg-[var(--forest)]" label="Bedding zones" />
                  <Legend swatch="bg-yellow-600" label="Food sources" />
                  <Legend swatch="bg-blue-500" label="Water" />
                </div>
              </>
            )}
          </aside>
        </div>
      </PageBody>
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${swatch}`} />{label}</div>;
}

function MapCanvas({ layers, onSelect }: { layers: Record<string, boolean>; onSelect: (f: any) => void }) {
  return (
    <div className="absolute inset-0" style={{
      background: "linear-gradient(135deg, oklch(0.9 0.03 130) 0%, oklch(0.85 0.04 100) 100%)",
    }}>
      {/* Contour-style topo */}
      <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
        {/* Boundary */}
        {layers.boundary && (
          <polygon points="5,5 95,8 96,70 8,72" fill="none" stroke="var(--forest)" strokeDasharray="1,1" strokeWidth="0.4" />
        )}
        {/* Contours */}
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M ${10 + i * 2} ${30 + i * 3} Q 40 ${20 + i * 3}, 60 ${35 + i * 3} T 90 ${28 + i * 3}`}
            fill="none" stroke="oklch(0.55 0.04 100)" strokeWidth="0.2" opacity="0.5" />
        ))}
        {/* Water */}
        <path d="M 40 55 Q 55 60, 68 62 T 90 76" fill="none" stroke="oklch(0.55 0.1 220)" strokeWidth="1.5" opacity="0.7" />
        <ellipse cx="78" cy="78" rx="10" ry="4" fill="oklch(0.55 0.1 220)" opacity="0.35" />
        {/* Food (fields) */}
        <rect x="30" y="12" width="22" height="14" fill="oklch(0.85 0.09 90)" opacity="0.55" />
        <rect x="55" y="26" width="14" height="10" fill="oklch(0.8 0.11 130)" opacity="0.55" />
        {/* Bedding areas */}
        {layers.bedding && (
          <>
            <ellipse cx="78" cy="68" rx="9" ry="5" fill="var(--forest)" opacity="0.28" />
            <ellipse cx="28" cy="30" rx="7" ry="5" fill="var(--forest)" opacity="0.28" />
            <ellipse cx="55" cy="50" rx="6" ry="4" fill="var(--forest)" opacity="0.28" />
          </>
        )}
        {/* Corridors */}
        {layers.corridors && (
          <>
            <path d="M 78 68 Q 55 45, 33 24" stroke="var(--forest)" strokeWidth="0.5" strokeDasharray="1.5,1" fill="none" opacity="0.7" />
            <path d="M 55 50 Q 45 35, 40 20" stroke="var(--forest)" strokeWidth="0.4" strokeDasharray="1.5,1" fill="none" opacity="0.6" />
          </>
        )}
        {/* Wind arrow */}
        {layers.wind && (
          <g transform="translate(85 12)">
            <circle r="4.5" fill="var(--card)" stroke="var(--border)" strokeWidth="0.2" />
            <path d="M -2 2 L 2 -2 M 2 -2 L 0.5 -2 M 2 -2 L 2 -0.5" stroke="var(--bronze)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
            <text x="0" y="7.5" fontSize="2" textAnchor="middle" fill="var(--muted-foreground)">NW 9</text>
          </g>
        )}
      </svg>

      {/* Markers */}
      {layers.bedding && bedding.map((f) => (
        <MarkerDot key={f.id} feature={f} color="bg-[var(--forest)] text-white" icon={Bed} onSelect={onSelect} />
      ))}
      {layers.food && food.map((f) => (
        <MarkerDot key={f.id} feature={f} color="bg-yellow-600 text-white" icon={Wheat} onSelect={onSelect} />
      ))}
      {layers.water && water.map((f) => (
        <MarkerDot key={f.id} feature={f} color="bg-blue-500 text-white" icon={Droplets} onSelect={onSelect} />
      ))}
      {layers.access && access.map((f) => (
        <MarkerDot key={f.id} feature={f} color="bg-stone-500 text-white" icon={RouteIcon} onSelect={onSelect} />
      ))}
      {layers.stands && stands.map((s) => (
        <MarkerDot key={s.id} feature={{ ...s, type: "Stand", note: s.notes }} color="bg-foreground text-background" icon={MapPin} onSelect={onSelect} />
      ))}
      {layers.cameras && cameras.map((c) => (
        <MarkerDot key={c.id} feature={{ ...c, type: "Camera", note: `${c.detections24h} detections in 24h · ${c.status}` }} color="bg-[var(--bronze)] text-white" icon={CameraIcon} onSelect={onSelect} />
      ))}
    </div>
  );
}

function MarkerDot({ feature, color, icon: Icon, onSelect }: any) {
  return (
    <button
      onClick={() => onSelect(feature)}
      style={{ left: `${feature.x}%`, top: `${feature.y}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full ring-2 ring-background shadow hover:scale-110 transition ${color}`}
      aria-label={`${feature.type}: ${feature.name}`}
    >
      <Icon className="h-3 w-3" />
    </button>
  );
}
