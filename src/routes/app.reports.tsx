import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Share2, Printer, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Freki" },
      { name: "description", content: "Property intelligence briefs and hunt performance reports." },
    ],
  }),
  component: Reports,
});

const reports = [
  { key: "weekly", title: "Weekly Property Intelligence Brief", desc: "The state of Black Ridge Farm this week.", active: true },
  { key: "cameras", title: "Trail Camera Activity Report", desc: "Detections, daylight share, and coverage gaps." },
  { key: "hunt", title: "Hunt Performance Report", desc: "Score accuracy and outcomes." },
  { key: "gaps", title: "Property Knowledge Gaps", desc: "What Freki doesn't know yet." },
  { key: "movement", title: "Seasonal Movement Summary", desc: "How movement is trending across the season." },
  { key: "stand", title: "Stand Performance Report", desc: "Sightings per hour by stand." },
  { key: "risk", title: "Habitat and Access Risk Report", desc: "Where pressure or scent may hurt you." },
];

function Reports() {
  const [selected, setSelected] = useState("weekly");

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate briefs you can share with your club, land manager, or hunting partner."
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("PDF export queued")}><Download className="h-4 w-4" /> Export PDF</Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Share link copied")}><Share2 className="h-4 w-4" /> Share</Button>
            <Button variant="outline" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
          </>
        }
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            {reports.map((r) => (
              <button
                key={r.key}
                onClick={() => setSelected(r.key)}
                className={`w-full rounded-md border p-3 text-left text-sm transition ${
                  selected === r.key ? "border-foreground bg-card" : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileText className="h-4 w-4 text-[var(--bronze)]" />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
                {r.active && <Badge className="mt-2 bg-[var(--forest)]/15 text-[var(--forest)] border-0">Sample ready</Badge>}
              </button>
            ))}
          </aside>

          <article className="surface-panel p-6 lg:p-8">
            <header>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--bronze)]">Weekly brief · Nov 8 – Nov 13</div>
              <h1 className="mt-2 font-display text-3xl font-semibold">Black Ridge Farm — Weekly Intelligence Brief</h1>
              <p className="mt-2 text-sm text-muted-foreground">Prepared for the property owner. Sample report.</p>
            </header>

            <Section title="Executive summary">
              <p>The property is in a favorable window. Daylight buck activity has increased by roughly 40% over the previous week, concentrated on the north corridor. A cold-front passage on Nov 12 aligned with the season's best sighting rate. Camera coverage on the eastern ridge remains a limiting factor for confident recommendations east of the creek.</p>
            </Section>

            <Section title="Current property patterns">
              <ul className="list-disc pl-5 space-y-1">
                <li>Northern field edge is the primary daylight travel corridor.</li>
                <li>Marsh-edge thicket is likely the primary daytime bedding for at least one mature buck.</li>
                <li>Pressure remains low; neighboring hunter activity noted Nov 6.</li>
              </ul>
            </Section>

            <Section title="Top opportunities">
              <ul className="list-disc pl-5 space-y-1">
                <li>North Funnel — evening hunts on NW / N winds.</li>
                <li>Oak Bench — morning hunts on W wind, after cold fronts.</li>
                <li>Hidden Plot — mid-day sit for undisturbed feeding.</li>
              </ul>
            </Section>

            <Section title="Major risks">
              <ul className="list-disc pl-5 space-y-1">
                <li>South Gate access on SW winds risks contaminating central bedding.</li>
                <li>East Ridge camera offline for 3 days — coverage gap.</li>
              </ul>
            </Section>

            <Section title="Camera activity">
              <p>22 detections in the last 24 hours across 7 cameras. Daylight share held at 27%. East Ridge contributed zero detections.</p>
            </Section>

            <Section title="Recent observations">
              <p>18 field observations logged this week: 1 mature buck cruising at North Funnel, active scrape line at Oak Bench, doe family group staging at Marsh Edge.</p>
            </Section>

            <Section title="Confidence changes">
              <p>Confidence in the "northern-corridor daylight movement" statement rose from 71 to 82. Confidence in the "SW wind contamination" model dropped modestly after two clean SW-wind tests.</p>
            </Section>

            <Section title="Information gaps">
              <ul className="list-disc pl-5 space-y-1">
                <li>East Ridge camera coverage.</li>
                <li>Lower creek crossing observations (none in 8 days).</li>
                <li>Interior pine bedding confirmation.</li>
              </ul>
            </Section>

            <Section title="Recommended field actions">
              <ul className="list-disc pl-5 space-y-1">
                <li>Redeploy East Ridge camera by Nov 15.</li>
                <li>Scout the ridge saddle in the next low-wind morning.</li>
                <li>Hunt North Funnel on the next NW evening; enter by 3:30 PM.</li>
              </ul>
            </Section>
          </article>
        </div>
      </PageBody>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
