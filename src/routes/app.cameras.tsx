import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { cameras, detections, cameraHourly } from "@/lib/freki-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Camera, BatteryLow, BatteryMedium, BatteryFull, WifiOff, Upload, Sun, Moon as MoonIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/app/cameras")({
  head: () => ({
    meta: [
      { title: "Trail Cameras — Freki" },
      { name: "description", content: "Trail camera activity and images." },
    ],
  }),
  component: Cameras,
});

function Cameras() {
  return (
    <>
      <PageHeader
        title="Trail Cameras"
        description="Detections weighted by daylight, wind, and coverage — not just image counts."
        actions={<UploadDialog />}
      />
      <PageBody>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="detail">Detail</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <CamerasOverview />
          </TabsContent>
          <TabsContent value="gallery" className="mt-6">
            <Gallery />
          </TabsContent>
          <TabsContent value="detail" className="mt-6">
            <CameraDetail />
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}

function CamerasOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cameras.map((c) => (
        <div key={c.id} className="surface-panel p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-base font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">Last check {c.lastCheck}</div>
            </div>
            <StatusPill status={c.status} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <BatteryIcon battery={c.battery} />
            <Progress value={c.battery} className="h-1.5" />
            <span className="text-xs tabular-nums text-muted-foreground w-8">{c.battery}%</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <Stat label="24h" value={c.detections24h} />
            <Stat label="Daylight" value={`${c.daylightPct}%`} />
            <Stat label="Target" value={c.targetActivity} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border p-2">
      <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</div>
      <div className="mt-0.5 font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function BatteryIcon({ battery }: { battery: number }) {
  const I = battery < 25 ? BatteryLow : battery < 60 ? BatteryMedium : BatteryFull;
  return <I className={`h-3.5 w-3.5 ${battery < 25 ? "text-destructive" : "text-muted-foreground"}`} />;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Online: "bg-[var(--forest)]/15 text-[var(--forest)]",
    Offline: "bg-destructive/15 text-destructive",
    "Low battery": "bg-[var(--bronze)]/15 text-[var(--bronze)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${map[status]}`}>
      {status === "Offline" && <WifiOff className="h-3 w-3" />}
      {status}
    </span>
  );
}

function Gallery() {
  const [species, setSpecies] = useState("all");
  const filtered = species === "all" ? detections : detections.filter((d) => d.species.toLowerCase().includes(species));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Species" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All species</SelectItem>
            <SelectItem value="buck">Whitetail buck</SelectItem>
            <SelectItem value="doe">Whitetail doe</SelectItem>
            <SelectItem value="coyote">Coyote</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32"><SelectValue placeholder="Time" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            <SelectItem value="day">Daylight</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Search tags…" className="w-52" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((d) => {
          const cam = cameras.find((c) => c.id === d.cameraId);
          return (
            <div key={d.id} className="surface-panel overflow-hidden">
              <div className={`relative aspect-video ${d.daylight ? "bg-gradient-to-br from-amber-100 to-stone-300" : "bg-gradient-to-br from-slate-800 to-slate-950"}`}>
                <svg viewBox="0 0 200 112" className="absolute inset-0 h-full w-full opacity-70">
                  <path d="M0 90 Q 40 70, 80 78 T 200 74 L 200 112 L 0 112 Z" fill={d.daylight ? "oklch(0.4 0.06 130)" : "oklch(0.15 0.02 90)"} />
                  <ellipse cx="130" cy="68" rx="12" ry="14" fill={d.daylight ? "oklch(0.35 0.04 80)" : "oklch(0.25 0.02 90)"} />
                  <rect x="120" y="76" width="4" height="10" fill={d.daylight ? "oklch(0.3 0.04 80)" : "oklch(0.2 0.02 90)"} />
                  <rect x="136" y="76" width="4" height="10" fill={d.daylight ? "oklch(0.3 0.04 80)" : "oklch(0.2 0.02 90)"} />
                </svg>
                <div className="absolute top-2 right-2 flex gap-1">
                  {d.daylight ? <Sun className="h-3.5 w-3.5 text-amber-100" /> : <MoonIcon className="h-3.5 w-3.5 text-white/80" />}
                </div>
                <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{d.time}</div>
                <div className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{d.confidence}%</div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{d.species}</div>
                  <div className="text-xs text-muted-foreground">{cam?.name}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{d.tempF}°F · {d.wind} · {d.moon}</div>
                {d.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CameraDetail() {
  const cam = cameras[0];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="surface-panel p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-xl font-semibold">{cam.name}</div>
              <div className="text-xs text-muted-foreground">Placed in the pinch north of the standing corn</div>
            </div>
            <StatusPill status={cam.status} />
          </div>
        </div>
        <div className="surface-panel p-5">
          <h3 className="font-display text-base font-semibold">Hourly detections — last 24h</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer>
              <BarChart data={cameraHourly}>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={10} interval={2} stroke="var(--muted-foreground)" />
                <YAxis fontSize={10} stroke="var(--muted-foreground)" width={20} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Bar dataKey="detections" fill="var(--bronze)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="surface-panel p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Species breakdown (7d)</div>
          <ul className="mt-2 space-y-2 text-sm">
            <SpeciesRow label="Whitetail buck" pct={38} />
            <SpeciesRow label="Whitetail doe" pct={44} />
            <SpeciesRow label="Turkey" pct={10} />
            <SpeciesRow label="Coyote" pct={8} />
          </ul>
        </div>
        <div className="surface-panel p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Camera notes</div>
          <p className="mt-2 text-sm">Batteries swapped Nov 3. SD card cleared. Angle covers 30 yards of the trail intersection.</p>
        </div>
      </div>
    </div>
  );
}

function SpeciesRow({ label, pct }: { label: string; pct: number }) {
  return (
    <li>
      <div className="flex justify-between"><span>{label}</span><span className="tabular-nums text-muted-foreground">{pct}%</span></div>
      <Progress value={pct} className="mt-1 h-1" />
    </li>
  );
}

function UploadDialog() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const stages = ["Uploading", "Reading metadata", "Detecting species", "Checking known animals", "Adding environmental context", "Complete"];

  const start = () => {
    setStep(0);
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= stages.length - 1) { clearInterval(t); toast.success("3 images processed"); return s; }
        return s + 1;
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) start(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Upload className="h-4 w-4" /> Upload images</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Processing images</DialogTitle>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          {stages.map((s, i) => (
            <li key={s} className={`flex items-center gap-2 ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
              <span className={`h-2 w-2 rounded-full ${i < step ? "bg-[var(--forest)]" : i === step ? "bg-[var(--bronze)] animate-pulse" : "bg-border"}`} />
              {s}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
