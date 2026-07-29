import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { brainStatements, property } from "@/lib/freki-data";
import { TruthScore } from "@/components/truth-score";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Trees, MapPin, Wheat, Droplets, Bed, Route as RouteIcon, Users, Camera, Eye, Crown, HelpCircle, Calendar,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/brain")({
  head: () => ({
    meta: [
      { title: "Property Brain — Freki" },
      { name: "description", content: "Freki's living model of Black Ridge Farm." },
    ],
  }),
  component: Brain,
});

const categories = [
  { key: "profile", label: "Property profile", icon: Trees },
  { key: "terrain", label: "Terrain", icon: MapPin },
  { key: "habitat", label: "Habitat", icon: Trees },
  { key: "food", label: "Food", icon: Wheat },
  { key: "water", label: "Water", icon: Droplets },
  { key: "bedding", label: "Bedding", icon: Bed },
  { key: "corridors", label: "Travel corridors", icon: RouteIcon },
  { key: "pressure", label: "Hunting pressure", icon: Users },
  { key: "access", label: "Human access", icon: Users },
  { key: "seasonal", label: "Seasonal patterns", icon: Calendar },
  { key: "coverage", label: "Camera coverage", icon: Camera },
  { key: "obs", label: "Observations", icon: Eye },
  { key: "mature", label: "Known mature animals", icon: Crown },
  { key: "unknown", label: "Uncertainty & gaps", icon: HelpCircle },
];

const evidenceColor: Record<string, string> = {
  Confirmed: "bg-[var(--forest)]/15 text-[var(--forest)] border-[var(--forest)]/30",
  Observed: "bg-[var(--forest)]/10 text-[var(--forest)] border-[var(--forest)]/20",
  "User-reported": "bg-secondary text-secondary-foreground",
  Inferred: "bg-[var(--bronze)]/15 text-[var(--bronze)] border-[var(--bronze)]/30",
  Predicted: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Unknown: "bg-muted text-muted-foreground",
};

const filters: { key: string; label: string; match: (cat: string) => boolean }[] = [
  { key: "all", label: "All statements", match: () => true },
  { key: "corridors", label: "Travel corridors", match: (c) => /travel|corridor/i.test(c) },
  { key: "access", label: "Human access", match: (c) => /access|pressure/i.test(c) },
  { key: "coverage", label: "Camera coverage", match: (c) => /coverage|camera/i.test(c) },
  { key: "bedding", label: "Bedding", match: (c) => /bedding/i.test(c) },
  { key: "seasonal", label: "Seasonal", match: (c) => /seasonal/i.test(c) },
  { key: "uncertainty", label: "Uncertainty", match: (c) => /uncertainty|unknown/i.test(c) },
];

function Brain() {
  const [active, setActive] = useState("all");

  const activeFilter = filters.find((f) => f.key === active) ?? filters[0];
  const filtered = brainStatements.filter((s) => activeFilter.match(s.category));

  return (
    <>
      <PageHeader
        title="Property Brain"
        description={`What Freki knows — and doesn't know — about ${property.name}.`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Observation captured")}>+ Add observation</Button>
            <Button onClick={() => toast.success("Note saved")}>+ Property note</Button>
          </>
        }
      />
      <PageBody>
        <Tabs defaultValue="statements">
          <TabsList>
            <TabsTrigger value="statements">Knowledge</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="statements" className="mt-6">
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    active === f.key ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                  }`}
                >{f.label}</button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
                No statements in this category yet.
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((s) => (
                <article key={s.id} className="surface-panel p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge className={`${evidenceColor[s.evidence]} border`}>{s.evidence}</Badge>
                    <span className="text-muted-foreground">{s.category}</span>
                    <span className="ml-auto text-muted-foreground">{s.updated}</span>
                  </div>
                  <p className="mt-3 font-display text-lg leading-snug">{s.statement}</p>
                  <div className="mt-3">
                    <TruthScore
                      score={s.confidence}
                      supporting={s.supporting}
                      conflicting={s.conflicting}
                      compact
                    />
                    <span className="ml-2 text-xs text-muted-foreground">{s.sources} sources</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Marked correct")}>Confirm</Button>
                    <Button size="sm" variant="outline" onClick={() => toast("Correction saved")}>Correct Freki</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast("Flagged as outdated")}>Mark outdated</Button>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <div key={c.key} className="surface-panel p-4">
                  <c.icon className="h-5 w-5 text-[var(--bronze)]" />
                  <div className="mt-3 font-display text-base font-semibold">{c.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {c.key === "unknown" ? "1 open gap · east ridge coverage" : "Tracked · view detail"}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}
