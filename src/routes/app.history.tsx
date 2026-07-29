import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wind, Thermometer, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useActiveProperty, store, type HuntRecord } from "@/lib/freki-store";
import { useState } from "react";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "Hunt History — Freki" },
      { name: "description", content: "Your hunt journal and post-hunt reviews." },
    ],
  }),
  component: History,
});

function History() {
  const p = useActiveProperty();
  const hunts = p.hunts;

  return (
    <>
      <PageHeader
        title="Hunt History"
        description="Every hunt teaches Freki about the property."
        actions={
          <Link to="/app/evaluation">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Log a hunt</Button>
          </Link>
        }
      />
      <PageBody>
        <Tabs defaultValue="hunts">
          <TabsList>
            <TabsTrigger value="hunts">Hunts ({hunts.length})</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          <TabsContent value="hunts" className="mt-6 space-y-3">
            {hunts.length === 0 ? (
              <div className="surface-panel p-10 text-center">
                <div className="font-medium">No hunts logged yet</div>
                <p className="mt-1 text-sm text-muted-foreground">Evaluate a hunt to save your first entry.</p>
                <Link to="/app/evaluation"><Button className="mt-4">Plan a hunt</Button></Link>
              </div>
            ) : hunts.map((h) => <HuntCard key={h.id} h={h} />)}
          </TabsContent>

          <TabsContent value="patterns" className="mt-6 grid gap-4 md:grid-cols-2">
            <ScoreChart hunts={hunts} />
            <PatternsFromHunts hunts={hunts} />
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}

function HuntCard({ h }: { h: HuntRecord }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="surface-panel p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-semibold truncate">{h.date} · {h.location}</span>
            <Badge className={
              h.outcome === "Productive" ? "bg-[var(--forest)]/15 text-[var(--forest)] border-0" :
              h.outcome === "Unproductive" ? "bg-destructive/15 text-destructive border-0" :
              h.outcome === "Pending" ? "bg-[var(--bronze)]/15 text-[var(--bronze)] border-0" :
              "bg-secondary text-secondary-foreground border-0"
            }>{h.outcome}</Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-4">
            <span><MapPin className="mr-1 inline h-3 w-3" />{h.entry}–{h.exit}</span>
            <span><Wind className="mr-1 inline h-3 w-3" />{h.wind}</span>
            <span><Thermometer className="mr-1 inline h-3 w-3" />{h.weather}</span>
            <span>Pressure {h.pressure}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-muted-foreground">Predicted</div>
          <div className="font-display text-2xl tabular-nums">{h.originalScore}</div>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
        <div><span className="text-muted-foreground">Sightings: </span>{h.sightings} · {h.encounters}</div>
        <div><span className="text-muted-foreground">Shots: </span>{h.shots} · Harvest: {h.harvest}</div>
      </div>
      {h.notes && <p className="mt-2 text-sm">{h.notes}</p>}
      <div className="mt-3 rounded-md border border-border p-3 text-xs">
        <div className="font-medium text-foreground">Freki's post-hunt learning</div>
        <p className="mt-1 text-muted-foreground">
          {h.outcome === "Productive"
            ? "Result validates the prediction. Freki weights this stand + condition combo higher next time."
            : h.outcome === "Unproductive"
            ? "Result contradicts the prediction. Confidence in this stand + condition combo is lowered."
            : h.outcome === "Pending"
            ? "Log the outcome after the sit so Freki can learn from it."
            : "Neutral result — no pattern change."}
        </p>
      </div>
      <div className="mt-3 flex gap-2 justify-end">
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen(true)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
        <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => { if (confirm("Delete this hunt?")) { store.removeHunt(h.id); toast.success("Deleted"); } }}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </div>
      <EditHuntDialog open={open} onOpenChange={setOpen} hunt={h} />
    </article>
  );
}

function EditHuntDialog({ open, onOpenChange, hunt }: { open: boolean; onOpenChange: (o: boolean) => void; hunt: HuntRecord }) {
  const [outcome, setOutcome] = useState<HuntRecord["outcome"]>(hunt.outcome);
  const [sightings, setSightings] = useState(hunt.sightings);
  const [encounters, setEncounters] = useState(hunt.encounters);
  const [shots, setShots] = useState(hunt.shots);
  const [harvest, setHarvest] = useState(hunt.harvest);
  const [notes, setNotes] = useState(hunt.notes);
  const key = `${hunt.id}-${open}`;

  function save(e: React.FormEvent) {
    e.preventDefault();
    store.updateHunt(hunt.id, { outcome, sightings, encounters, shots, harvest, notes });
    toast.success("Hunt updated");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={key} className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit hunt · {hunt.location}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="grid gap-3">
          <F label="Outcome">
            <Select value={outcome} onValueChange={(v) => setOutcome(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
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
          <F label="Encounters"><Input value={encounters} onChange={(e) => setEncounters(e.target.value)} /></F>
          <F label="Notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></F>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}

function ScoreChart({ hunts }: { hunts: HuntRecord[] }) {
  const data = hunts.slice().reverse().map((h, i) => ({
    hunt: `H${i + 1}`,
    predicted: h.originalScore,
    actual: h.outcome === "Productive" ? Math.min(95, h.originalScore + 6)
      : h.outcome === "Unproductive" ? Math.max(5, h.originalScore - 20)
      : h.outcome === "Pending" ? null
      : h.originalScore - 4,
  }));
  return (
    <div className="surface-panel p-5">
      <h3 className="font-display text-base font-semibold">Predicted vs actual</h3>
      <div className="mt-3 h-48">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">No hunts yet</div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="hunt" fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--muted-foreground)" width={20} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
              <Line dataKey="predicted" stroke="var(--bronze)" strokeWidth={2} dot />
              <Line dataKey="actual" stroke="var(--forest)" strokeWidth={2} dot connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function PatternsFromHunts({ hunts }: { hunts: HuntRecord[] }) {
  const productive = hunts.filter((h) => h.outcome === "Productive");
  const topWind = mostCommon(productive.map((h) => h.wind.split(" ")[0])) ?? "—";
  const topStand = mostCommon(productive.map((h) => h.location)) ?? "—";
  return (
    <>
      <PatternCard title="Most productive wind" value={topWind} sub={`${productive.length} productive sits`} />
      <PatternCard title="Most productive stand" value={topStand} sub="Highest hit rate" />
    </>
  );
}

function mostCommon<T extends string>(arr: T[]): T | undefined {
  if (!arr.length) return;
  const counts = new Map<T, number>();
  for (const v of arr) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function PatternCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="surface-panel p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
