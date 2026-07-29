import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Target, Wind, Route as RouteIcon, Bed, Activity, CheckCircle2, HelpCircle, AlertTriangle, Save } from "lucide-react";
import { useActiveProperty, useConditions, store, evaluateHunt, type HuntRecommendation } from "@/lib/freki-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/evaluation")({
  head: () => ({
    meta: [
      { title: "Hunt Evaluation — Freki" },
      { name: "description", content: "Evaluate a planned hunt against wind, access, pressure and history." },
    ],
  }),
  component: Evaluation,
});

const WINDS = ["N","NE","E","SE","S","SW","W","NW"];

function Evaluation() {
  const p = useActiveProperty();
  const c = useConditions();
  const [standId, setStandId] = useState<string>(p.stands[0]?.id ?? "");
  const [result, setResult] = useState<HuntRecommendation | null>(null);

  function run() {
    const r = evaluateHunt({ property: p, conditions: c, standId: standId || undefined });
    setResult(r);
    if (r.recommendedStand) setStandId(r.recommendedStand.id);
  }

  return (
    <>
      <PageHeader
        title="Hunt Evaluation"
        description="Enter current conditions. Freki explains why — and what it doesn't know."
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={(e) => { e.preventDefault(); run(); }}
            className="surface-panel p-5 space-y-3 h-fit"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Conditions</div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Wind direction">
                <Select value={c.windDir} onValueChange={(v) => store.setConditions({ windDir: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{WINDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label={`Wind ${c.windMph} mph`}>
                <Input type="range" min={0} max={30} value={c.windMph} onChange={(e) => store.setConditions({ windMph: Number(e.target.value) })} />
              </F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label={`Temperature ${c.tempF}°F`}>
                <Input type="range" min={-10} max={90} value={c.tempF} onChange={(e) => store.setConditions({ tempF: Number(e.target.value) })} />
              </F>
              <F label="Pressure trend">
                <Select value={c.pressureTrend} onValueChange={(v) => store.setConditions({ pressureTrend: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rising">Rising</SelectItem>
                    <SelectItem value="steady">Steady</SelectItem>
                    <SelectItem value="falling">Falling</SelectItem>
                  </SelectContent>
                </Select>
              </F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label={`Pressure ${c.pressureInHg}"`}>
                <Input type="number" step={0.01} value={c.pressureInHg} onChange={(e) => store.setConditions({ pressureInHg: Number(e.target.value) })} />
              </F>
              <F label="Precipitation">
                <Select value={c.precipitation} onValueChange={(v) => store.setConditions({ precipitation: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["None","Light rain","Rain","Snow"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Time of day">
                <Select value={c.timeOfDay} onValueChange={(v) => store.setConditions({ timeOfDay: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Morning","Midday","Evening","All-day"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </F>
              <F label="Recent human pressure">
                <Select value={c.pressure} onValueChange={(v) => store.setConditions({ pressure: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Low","Moderate","High"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </F>
            </div>

            <div className="pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Plan</div>
            <F label="Stand (optional — Freki picks the best if empty)">
              {p.stands.length === 0 ? (
                <Link to="/app/setup"><Button type="button" variant="outline" size="sm" className="w-full">Add a stand in Setup</Button></Link>
              ) : (
                <Select value={standId || "auto"} onValueChange={(v) => setStandId(v === "auto" ? "" : v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Freki chooses</SelectItem>
                    {p.stands.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </F>
            <Button type="submit" className="w-full gap-2" disabled={p.stands.length === 0}>
              <Target className="h-4 w-4" /> Evaluate hunt
            </Button>
          </form>

          <div className="space-y-4">
            {!result ? (
              <div className="surface-panel p-10 text-center">
                <Target className="mx-auto h-8 w-8 text-muted-foreground" />
                <div className="mt-3 font-medium">Enter conditions to evaluate</div>
                <div className="text-sm text-muted-foreground">Freki will explain the reasoning — including its limitations.</div>
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

function Result({ r }: { r: HuntRecommendation }) {
  const c = useConditions();
  return (
    <>
      <div className="surface-panel overflow-hidden">
        <div className="border-b border-border bg-sidebar p-5 text-sidebar-foreground">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-sidebar-foreground/60">
            Hunt Score
            <Badge className="border-0 bg-[var(--bronze)]/20 text-[var(--bronze)]">
              {r.score >= 70 ? "Recommended" : r.score >= 50 ? "Marginal" : "Not recommended"}
            </Badge>
          </div>
          <div className="mt-2 grid gap-4 sm:grid-cols-[auto_1fr] items-end">
            <div>
              <div className="font-display text-5xl font-semibold text-[var(--bronze)] tabular-nums">{r.score}</div>
              <div className="text-xs text-sidebar-foreground/60">out of 100 · {r.confidence.toLowerCase()} confidence ({r.confidencePct}%)</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">{r.headline}</div>
              <div className="text-sidebar-foreground/70 mt-1">Window: {r.window}</div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed">{r.reasoning}</p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <RiskCard icon={Wind} label="Wind fit" tone={r.score >= 60 ? "good" : "bad"} value={r.score >= 60 ? "Workable" : "Poor"} />
        <RiskCard icon={RouteIcon} label="Access" tone={r.confidencePct > 60 ? "good" : "warn"} value={r.confidencePct > 60 ? "Clean" : "Risky"} />
        <RiskCard icon={Bed} label="Bedding" tone={r.conflicting.some((s) => /bedding/i.test(s)) ? "bad" : "good"} value={r.conflicting.some((s) => /bedding/i.test(s)) ? "Risk" : "Protected"} />
        <RiskCard icon={Activity} label="Signal" tone={r.supporting.some((s) => /detections/i.test(s)) ? "good" : "warn"} value={r.supporting.some((s) => /detections/i.test(s)) ? "Above baseline" : "Thin"} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReasoningBlock title="Supporting evidence" items={r.supporting.length ? r.supporting : ["No strong supporting signals."]} tone="pos" icon={CheckCircle2} />
        <ReasoningBlock title="Conflicting evidence" items={r.conflicting.length ? r.conflicting : ["No known conflicts."]} tone="neg" icon={AlertTriangle} />
      </div>

      <ReasoningBlock title="What could change the conclusion" items={r.changers} tone="mut" icon={HelpCircle} />

      {r.alternatives.length > 0 && (
        <div className="surface-panel p-5">
          <h3 className="font-display text-base font-semibold">Alternatives</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {r.alternatives.map((s) => (
              <div key={s.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.name}</div>
                  <Badge variant="secondary">{s.bestWind.includes(c.windDir) ? "Wind fit" : "Alternate"}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{s.notes || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {r.recommendedStand && (
        <div className="flex flex-wrap gap-2">
          <LogHuntDialog r={r} />
          <Link to="/app/history"><Button variant="outline" className="gap-2"><Save className="h-4 w-4" /> View history</Button></Link>
        </div>
      )}
    </>
  );
}

function RiskCard({ icon: Icon, label, value, tone }: any) {
  const t = tone === "good" ? "text-[var(--forest)]" : tone === "bad" ? "text-destructive" : "text-[var(--bronze)]";
  return (
    <div className="surface-panel p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</div>
      <div className={`mt-1 font-display text-base font-semibold ${t}`}>{value}</div>
    </div>
  );
}

function ReasoningBlock({ title, items, tone, icon: Icon }: { title: string; items: string[]; tone: "pos" | "neg" | "mut"; icon: any }) {
  const c = tone === "pos" ? "text-[var(--forest)]" : tone === "neg" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="surface-panel p-4">
      <div className={`text-xs font-medium uppercase tracking-wider ${c} flex items-center gap-1.5`}><Icon className="h-3.5 w-3.5" />{title}</div>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((s, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />{s}</li>)}
      </ul>
    </div>
  );
}

function LogHuntDialog({ r }: { r: HuntRecommendation }) {
  const c = useConditions();
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState("15:30");
  const [exit, setExit] = useState("17:45");
  const [outcome, setOutcome] = useState<"Productive" | "Neutral" | "Unproductive" | "Pending">("Pending");
  const [sightings, setSightings] = useState(0);
  const [encounters, setEncounters] = useState("");
  const [shots, setShots] = useState(0);
  const [harvest, setHarvest] = useState("None");
  const [notes, setNotes] = useState("");

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!r.recommendedStand) return;
    store.addHunt({
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      location: r.recommendedStand.name,
      entry, exit,
      wind: `${c.windDir} ${c.windMph}`,
      weather: `${c.precipitation === "None" ? "Clear" : c.precipitation}, ${c.tempF}°F`,
      sightings, encounters: encounters || "—", shots,
      harvest, pressure: c.pressure,
      notes, originalScore: r.score, outcome,
    });
    toast.success(outcome === "Pending" ? "Hunt planned — record the result after the sit" : "Hunt recorded");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Save className="h-4 w-4" /> Save & record hunt</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>Record hunt at {r.recommendedStand?.name}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <F label="Entry"><Input type="time" value={entry} onChange={(e) => setEntry(e.target.value)} /></F>
            <F label="Exit"><Input type="time" value={exit} onChange={(e) => setExit(e.target.value)} /></F>
          </div>
          <F label="Outcome">
            <Select value={outcome} onValueChange={(v) => setOutcome(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending (log now, update later)</SelectItem>
                <SelectItem value="Productive">Productive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Unproductive">Unproductive</SelectItem>
              </SelectContent>
            </Select>
          </F>
          <div className="grid grid-cols-3 gap-3">
            <F label="Sightings"><Input type="number" min={0} value={sightings} onChange={(e) => setSightings(Number(e.target.value))} /></F>
            <F label="Shots"><Input type="number" min={0} value={shots} onChange={(e) => setShots(Number(e.target.value))} /></F>
            <F label="Harvest"><Input value={harvest} onChange={(e) => setHarvest(e.target.value)} /></F>
          </div>
          <F label="Encounters"><Input value={encounters} onChange={(e) => setEncounters(e.target.value)} placeholder="e.g. 2 does, 1 young buck" /></F>
          <F label="Notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></F>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save hunt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
