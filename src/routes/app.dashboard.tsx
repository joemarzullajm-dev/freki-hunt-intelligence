import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { TruthScore } from "@/components/truth-score";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wind, Thermometer, Gauge, Moon, Camera, Sun, Users, Activity,
  AlertTriangle, ChevronRight, MapPin, Eye, Sparkles,
} from "lucide-react";
import {
  conditions, huntOutlook, property, detections, observations, cameras,
  weeklyActivity, cameraTotals,
} from "@/lib/freki-data";
import { Link } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { LiveSharingBanner, PropertySafetyCard } from "@/components/property-safety";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview — Freki" },
      { name: "description", content: "Today's hunt outlook and property intelligence for Black Ridge Farm." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <LiveSharingBanner />
      <PageHeader
        title={`Overview — ${property.name}`}
        description="What you should know right now."
        actions={
          <>
            <Link to="/app/evaluation"><Button variant="outline">Plan a hunt</Button></Link>
            <Link to="/app/ai"><Button className="gap-2"><Sparkles className="h-4 w-4" /> Ask Freki</Button></Link>
          </>
        }
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <HuntOutlookCard />
            <MetricsGrid />
            <StandsAndAlerts />
            <RecentDetections />
          </div>
          <div className="space-y-6">
            <TruthScore
              score={huntOutlook.truthScore}
              supporting={huntOutlook.supporting}
              conflicting={huntOutlook.conflicting}
              uncertainty="East Ridge camera has been offline for 3 days — that quadrant is under-observed."
            />
            <PropertySafetyCard />
            <ActivityChart />
            <Hypothesis />
            <Observations />
          </div>
        </div>
      </PageBody>
    </>
  );
}

function HuntOutlookCard() {
  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-b border-border bg-sidebar p-6 text-sidebar-foreground">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-sidebar-foreground/60">
          Current Hunt Outlook
          <Badge variant="secondary" className="bg-[var(--bronze)]/20 text-[var(--bronze)] border-0">
            {huntOutlook.recommendation}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-2">
          <div>
            <div className="font-display text-6xl font-semibold text-[var(--bronze)] tabular-nums">{huntOutlook.score}</div>
            <div className="text-xs text-sidebar-foreground/60">out of 100 · {huntOutlook.confidence.toLowerCase()} confidence</div>
          </div>
          <div className="space-y-1 text-sm">
            <div><span className="text-sidebar-foreground/60">Window: </span>{huntOutlook.window}</div>
            <div><span className="text-sidebar-foreground/60">Best stand: </span><strong>{huntOutlook.stand}</strong></div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm leading-relaxed text-foreground/90">{huntOutlook.summary}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--forest)]">Why this could work</div>
            <ul className="mt-2 space-y-1 text-sm">
              {huntOutlook.supporting.map((s) => (
                <li key={s} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--forest)]" />{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-destructive">What could go wrong</div>
            <ul className="mt-2 space-y-1 text-sm">
              {huntOutlook.conflicting.map((s) => (
                <li key={s} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsGrid() {
  const metrics = [
    { icon: Wind, label: "Wind", value: `${conditions.wind.dir} ${conditions.wind.speedMph}`, sub: `${conditions.wind.trend}` },
    { icon: Thermometer, label: "Temperature", value: `${conditions.tempF}°F`, sub: "cool" },
    { icon: Gauge, label: "Pressure", value: `${conditions.pressureInHg}"`, sub: conditions.pressureTrend },
    { icon: Moon, label: "Moon", value: `${Math.round(conditions.moonIllum * 100)}%`, sub: conditions.moonPhase },
    { icon: Camera, label: "Camera 24h", value: `${cameraTotals.detections24h}`, sub: `${cameraTotals.online}/${cameras.length} online` },
    { icon: Sun, label: "Daylight", value: `${cameraTotals.daylight24h}`, sub: "detections" },
    { icon: Users, label: "Disturbance", value: conditions.disturbance, sub: "past 48h" },
    { icon: Activity, label: "Truth Score", value: `${huntOutlook.truthScore}`, sub: "moderate" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="surface-panel p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <m.icon className="h-3.5 w-3.5" /> {m.label}
          </div>
          <div className="mt-1 font-display text-xl font-semibold tabular-nums">{m.value}</div>
          <div className="text-xs text-muted-foreground">{m.sub}</div>
        </div>
      ))}
    </div>
  );
}

function StandsAndAlerts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="surface-panel p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Best stand today</h3>
          <MapPin className="h-4 w-4 text-[var(--bronze)]" />
        </div>
        <div className="mt-2 text-lg">{huntOutlook.stand}</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Ladder set in the pinch between hardwoods and standing corn. NW wind carries scent away
          from the marsh bedding edge.
        </p>
        <Link to="/app/map" className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--bronze)] hover:underline">
          View on map <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="surface-panel p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Areas to avoid</h3>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
        <ul className="mt-2 space-y-2 text-sm">
          <li><strong>South Gate</strong> — SW wind risk into central bedding.</li>
          <li><strong>East Ridge</strong> — camera offline, movement unknown.</li>
          <li><strong>Marsh Edge morning</strong> — likely bedded deer at first light.</li>
        </ul>
      </div>
    </div>
  );
}

function RecentDetections() {
  const recent = detections.slice(0, 4);
  return (
    <section className="surface-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Recent camera detections</h3>
        <Link to="/app/cameras" className="text-xs text-[var(--bronze)] hover:underline">See all</Link>
      </div>
      <div className="mt-3 divide-y divide-border">
        {recent.map((d) => {
          const cam = cameras.find((c) => c.id === d.cameraId);
          return (
            <div key={d.id} className="flex items-center gap-3 py-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
                <Camera className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{d.species} · {cam?.name}</div>
                <div className="text-xs text-muted-foreground">{d.time} · {d.tempF}°F · {d.wind}</div>
              </div>
              <Badge variant={d.daylight ? "default" : "secondary"} className="shrink-0">
                {d.daylight ? "Daylight" : "Night"}
              </Badge>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ActivityChart() {
  return (
    <div className="surface-panel p-4">
      <h3 className="font-display text-sm font-semibold">Camera activity — this week</h3>
      <div className="mt-2 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={11} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <YAxis fontSize={11} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={20} />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
            <Bar dataKey="daylight" stackId="a" fill="var(--bronze)" radius={[0,0,2,2]} />
            <Bar dataKey="night" stackId="a" fill="var(--forest)" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[var(--bronze)]" /> Daylight</div>
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[var(--forest)]" /> Night</div>
      </div>
    </div>
  );
}

function Hypothesis() {
  return (
    <div className="surface-panel p-5">
      <div className="text-xs uppercase tracking-wider text-[var(--bronze)]">Freki's property hypothesis</div>
      <p className="mt-2 text-sm leading-relaxed">
        A mature buck is using the marsh-edge thicket as primary daytime bedding and moving north
        along the field edge in the final hour of daylight. This pattern has held across the last
        three cold fronts, but coverage on the eastern ridge is thin — an alternative bedding area
        there cannot be ruled out.
      </p>
      <div className="mt-3 text-xs text-muted-foreground">Updated 2 hours ago · 15 sources</div>
    </div>
  );
}

function Observations() {
  return (
    <div className="surface-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Latest observations</h3>
        <Link to="/app/observations" className="text-xs text-[var(--bronze)] hover:underline">All</Link>
      </div>
      <div className="mt-2 space-y-3">
        {observations.slice(0, 3).map((o) => (
          <div key={o.id} className="flex gap-2 text-sm">
            <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="truncate"><strong>{o.type}</strong> · {o.location}</div>
              <div className="text-xs text-muted-foreground">{o.date} · {o.notes}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
