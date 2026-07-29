import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { property } from "@/lib/freki-data";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Trees, Droplets, Wheat, Users, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Freki" },
      { name: "description", content: "Your hunting properties." },
    ],
  }),
  component: Properties,
});

function Properties() {
  const props = [
    { ...property, active: true },
    { id: "cedar", name: "Cedar Hollow", location: "Southern Ohio", acres: 148, active: false, demo: true, species: "Whitetail deer", cover: "Ridge oak, creek bottom, brushy transition." },
    { id: "ridge", name: "Ridgeview Club", location: "Western PA", acres: 512, active: false, demo: true, species: "Whitetail deer", cover: "Club-managed hardwoods and food plots." },
  ];

  return (
    <>
      <PageHeader
        title="Properties"
        description="One property is fully populated. Additional demo properties are placeholders."
        actions={<Button>+ Add property</Button>}
      />
      <PageBody>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {props.map((p) => (
            <div key={p.id} className="surface-panel overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--forest)]/70 to-sidebar">
                <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full opacity-40">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <path key={i} d={`M0 ${30 + i * 25} Q 100 ${20 + i * 25}, 200 ${40 + i * 25} T 400 ${30 + i * 25}`} fill="none" stroke="white" strokeWidth="0.5" />
                  ))}
                </svg>
                <div className="absolute left-4 top-4">
                  {p.active ? (
                    <span className="rounded-full bg-[var(--bronze)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">Active</span>
                  ) : (
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">Demo</span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="font-display text-xl font-semibold">{p.name}</div>
                  <div className="text-xs opacity-80"><MapPin className="mr-1 inline h-3 w-3" />{p.location}</div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <div><Trees className="h-3 w-3" /><div className="mt-0.5 font-medium text-foreground tabular-nums">{p.acres}</div>ac</div>
                  <div><Camera className="h-3 w-3" /><div className="mt-0.5 font-medium text-foreground">{p.active ? 8 : "—"}</div>cams</div>
                  <div><Wheat className="h-3 w-3" /><div className="mt-0.5 font-medium text-foreground">{p.active ? 3 : "—"}</div>food</div>
                  <div><Droplets className="h-3 w-3" /><div className="mt-0.5 font-medium text-foreground">{p.active ? 2 : "—"}</div>water</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.cover}</p>
              </div>
              <div className="border-t border-border p-3">
                {p.active ? (
                  <Link to="/app/dashboard" className="flex items-center justify-between text-sm">
                    Open property <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Demo placeholder</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
