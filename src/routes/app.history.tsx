import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { hunts } from "@/lib/freki-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wind, Thermometer, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

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
  return (
    <>
      <PageHeader
        title="Hunt History"
        description="Every hunt teaches Freki about the property."
        actions={<Button className="gap-2" onClick={() => toast.success("Hunt record created")}><Plus className="h-4 w-4" /> Log a hunt</Button>}
      />
      <PageBody>
        <div className="mb-4 rounded-md border border-dashed border-[var(--bronze)]/40 bg-[var(--bronze)]/5 p-3 text-xs text-[var(--bronze)]">
          Demo data — outcomes shown are sample records for Black Ridge Farm.
        </div>

        <Tabs defaultValue="hunts">
          <TabsList>
            <TabsTrigger value="hunts">Hunts</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          <TabsContent value="hunts" className="mt-6 space-y-3">
            {hunts.map((h) => (
              <article key={h.id} className="surface-panel p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-semibold">{h.date} · {h.location}</span>
                      <Badge className={
                        h.outcome === "Productive" ? "bg-[var(--forest)]/15 text-[var(--forest)] border-0" :
                        h.outcome === "Unproductive" ? "bg-destructive/15 text-destructive border-0" :
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
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Original score</div>
                    <div className="font-display text-2xl tabular-nums">{h.originalScore}</div>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                  <div><span className="text-muted-foreground">Sightings: </span>{h.sightings} · {h.encounters}</div>
                  <div><span className="text-muted-foreground">Shots: </span>{h.shots} · Harvest: {h.harvest}</div>
                </div>
                <p className="mt-2 text-sm">{h.notes}</p>
                <div className="mt-3 rounded-md border border-border p-3 text-xs">
                  <div className="font-medium text-foreground">Freki's post-hunt learning</div>
                  <p className="mt-1 text-muted-foreground">
                    {h.outcome === "Productive"
                      ? "Reinforced the pattern that daylight movement peaks 30–45 minutes before sunset with a NW wind."
                      : h.outcome === "Unproductive"
                      ? "Neighboring pressure impacted movement. Confidence in South Gate under S winds lowered."
                      : "Wind switch mid-morning matched forecast. No pattern change."}
                  </p>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="patterns" className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="surface-panel p-5">
              <h3 className="font-display text-base font-semibold">Score accuracy over time</h3>
              <div className="mt-3 h-48">
                <ResponsiveContainer>
                  <LineChart data={[
                    { hunt: "H1", predicted: 74, actual: 78 },
                    { hunt: "H2", predicted: 68, actual: 62 },
                    { hunt: "H3", predicted: 42, actual: 30 },
                    { hunt: "H4", predicted: 71, actual: 75 },
                  ]}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="hunt" fontSize={11} stroke="var(--muted-foreground)" />
                    <YAxis fontSize={11} stroke="var(--muted-foreground)" width={20} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
                    <Line dataKey="predicted" stroke="var(--bronze)" strokeWidth={2} dot />
                    <Line dataKey="actual" stroke="var(--forest)" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <PatternCard title="Most productive wind" value="NW" sub="3 productive sits" />
            <PatternCard title="Most productive stand" value="North Funnel" sub="6 sightings / hunt" />
            <PatternCard title="Best temperature range" value="32–42°F" sub="Peak daylight activity" />
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
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
