import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { stands } from "@/lib/freki-data";
import { TruthScore } from "@/components/truth-score";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Target, Wind, Route as RouteIcon, Bed, Activity, Clock, ThermometerSun, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/evaluation")({
  head: () => ({
    meta: [
      { title: "Hunt Evaluation — Freki" },
      { name: "description", content: "Evaluate a planned hunt against wind, access, pressure, and history." },
    ],
  }),
  component: Evaluation,
});

function Evaluation() {
  const [standId, setStandId] = useState("north-funnel");
  const [wind, setWind] = useState("NW");
  const [pressure, setPressure] = useState("Low");
  const [result, setResult] = useState<null | ReturnType<typeof evaluate>>(null);

  const stand = stands.find((s) => s.id === standId)!;

  function evaluate() {
    const windFit = stand.bestWind.includes(wind);
    const base = windFit ? 78 : 46;
    const pressurePenalty = pressure === "High" ? -18 : pressure === "Moderate" ? -6 : 0;
    const score = Math.max(10, Math.min(96, base + pressurePenalty));
    return {
      score,
      truth: windFit ? 74 : 58,
      windFit,
      pressure,
      stand,
      window: "Final 90 minutes of daylight",
      access: windFit ? "Downwind of primary bedding — clean entry" : "Wind carries scent toward bedding — risky",
    };
  }

  return (
    <>
      <PageHeader
        title="Hunt Evaluation"
        description="Score a planned hunt with the reasoning that goes into it."
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={(e) => { e.preventDefault(); setResult(evaluate()); }}
            className="surface-panel p-5 space-y-3 h-fit"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Planned hunt</div>
            <F label="Property"><Input defaultValue="Black Ridge Farm" disabled /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Date"><Input type="date" defaultValue="2026-11-13" /></F>
              <F label="Species">
                <Select defaultValue="whitetail"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="whitetail">Whitetail deer</SelectItem><SelectItem value="turkey">Turkey</SelectItem></SelectContent>
                </Select>
              </F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Start"><Input type="time" defaultValue="15:30" /></F>
              <F label="End"><Input type="time" defaultValue="17:45" /></F>
            </div>
            <F label="Stand / location">
              <Select value={standId} onValueChange={setStandId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stands.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Planned access route"><Input defaultValue="North two-track" /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Expected wind">
                <Select value={wind} onValueChange={setWind}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["N","NE","E","SE","S","SW","W","NW"].map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Recent pressure">
                <Select value={pressure} onValueChange={setPressure}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Low","Moderate","High"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <F label="Notes"><Textarea rows={2} placeholder="Anything Freki should know?" /></F>
            <Button type="submit" className="w-full gap-2"><Target className="h-4 w-4" /> Evaluate hunt</Button>
          </form>

          <div className="space-y-4">
            {!result ? (
              <div className="surface-panel p-10 text-center">
                <Target className="mx-auto h-8 w-8 text-muted-foreground" />
                <div className="mt-3 font-medium">Fill in the plan to evaluate</div>
                <div className="text-sm text-muted-foreground">Freki will explain the why — including what it doesn't know.</div>
              </div>
            ) : (
              <Result r={result} />
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}

function Result({ r }: { r: any }) {
  const positive = r.windFit
    ? ["Wind carries scent away from the marsh bedding zone", "Daylight buck activity above baseline at this stand", "Cold front passed 30 hours ago"]
    : ["Some historical evening movement at this location"];
  const negative = r.windFit
    ? ["Access route passes within 110 yards of the marsh bedding edge", "East ridge camera offline — coverage gap"]
    : ["Wind fit is poor for this stand", "Scent likely reaches primary bedding", r.pressure === "High" ? "Recent property pressure is high" : ""].filter(Boolean);
  const unknowns = ["Whether deer have shifted bedding toward the east ridge", "Overnight temperature drop's local effect"];

  return (
    <>
      <div className="surface-panel overflow-hidden">
        <div className="border-b border-border bg-sidebar p-5 text-sidebar-foreground">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-sidebar-foreground/60">
            Hunt Score
            <Badge className="border-0 bg-[var(--bronze)]/20 text-[var(--bronze)]">
              {r.score >= 65 ? "Recommended" : r.score >= 40 ? "Marginal" : "Not recommended"}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <div className="font-display text-5xl font-semibold text-[var(--bronze)] tabular-nums">{r.score}</div>
              <div className="text-xs text-sidebar-foreground/60">out of 100</div>
            </div>
            <div className="text-sm">
              <div><span className="text-sidebar-foreground/60">Best window: </span>{r.window}</div>
              <div><span className="text-sidebar-foreground/60">Stand: </span>{r.stand.name}</div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed">
            {r.windFit
              ? `${r.stand.name} is a strong option for the final 90 minutes of daylight. The ${r.stand.bestWind[0]} wind carries scent away from the primary bedding zone, and daylight buck activity has increased over the last four days. The main concern is that the access route passes within 110 yards of the marsh bedding edge. Entering earlier may reduce the chance of disturbing deer already staged nearby.`
              : `${r.stand.name} is not a strong fit for the current wind. Scent from the stand and access route likely reaches the primary bedding zone, and pressure conditions are ${r.pressure.toLowerCase()}. Consider an alternate stand with a better wind fit.`}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RiskCard icon={Wind} label="Wind fit" value={r.windFit ? "Good" : "Poor"} tone={r.windFit ? "good" : "bad"} />
        <RiskCard icon={RouteIcon} label="Access risk" value={r.windFit ? "Low" : "High"} tone={r.windFit ? "good" : "bad"} />
        <RiskCard icon={Bed} label="Bedding disturbance" value={r.windFit ? "Low–Moderate" : "High"} tone={r.windFit ? "warn" : "bad"} />
        <RiskCard icon={Activity} label="Recent activity" value="Above baseline" tone="good" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TruthScore
          score={r.truth}
          supporting={positive}
          conflicting={negative}
          uncertainty="Recent East Ridge camera downtime limits confidence."
        />
        <ReasoningBlock title="Why this could work" items={positive} tone="pos" />
        <ReasoningBlock title="What could go wrong" items={negative} tone="neg" />
      </div>

      <ReasoningBlock title="What Freki does not know" items={unknowns} tone="mut" />

      <div className="surface-panel p-5">
        <h3 className="font-display text-base font-semibold">Better alternatives</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {stands.filter((s) => s.id !== r.stand.id).slice(0, 2).map((s) => (
            <div key={s.id} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.name}</div>
                <Badge variant="secondary">{s.bestWind.includes("NW") ? "Wind fit" : "Alternate"}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{s.notes}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-panel p-5">
        <h3 className="font-display text-base font-semibold">How to improve confidence</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" /> Get the East Ridge camera back online.</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" /> Enter 30 minutes earlier to reduce bedding disturbance risk.</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" /> Add an observation from the lower creek crossing after this sit.</li>
        </ul>
      </div>
    </>
  );
}

function RiskCard({ icon: Icon, label, value, tone }: any) {
  const t = tone === "good" ? "text-[var(--forest)]" : tone === "bad" ? "text-destructive" : "text-[var(--bronze)]";
  return (
    <div className="surface-panel p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</div>
      <div className={`mt-1 font-display text-lg font-semibold ${t}`}>{value}</div>
    </div>
  );
}

function ReasoningBlock({ title, items, tone }: { title: string; items: string[]; tone: "pos" | "neg" | "mut" }) {
  const c = tone === "pos" ? "text-[var(--forest)]" : tone === "neg" ? "text-destructive" : "text-muted-foreground";
  const dot = tone === "pos" ? "bg-[var(--forest)]" : tone === "neg" ? "bg-destructive" : "bg-muted-foreground";
  return (
    <div className="surface-panel p-4">
      <div className={`text-xs font-medium uppercase tracking-wider ${c}`}>{title}</div>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((s) => <li key={s} className="flex gap-2"><span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${dot}`} />{s}</li>)}
      </ul>
    </div>
  );
}
