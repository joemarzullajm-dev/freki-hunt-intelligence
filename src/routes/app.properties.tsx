import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Camera, Trees, Droplets, Wheat, Plus, Check, Trash2 } from "lucide-react";
import { useProperties, useFreki, store } from "@/lib/freki-store";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Freki" },
      { name: "description", content: "Manage and switch hunting properties." },
    ],
  }),
  component: Properties,
});

function Properties() {
  const properties = useProperties();
  const activeId = useFreki((s) => s.activeId);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Properties"
        description="Create a new property or open an existing one. Everything is saved to your browser."
        actions={<NewPropertyDialog />}
      />
      <PageBody>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => {
            const active = p.id === activeId;
            return (
              <div key={p.id} className="surface-panel overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--forest)]/70 to-sidebar">
                  <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full opacity-40">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <path key={i} d={`M0 ${30 + i * 25} Q 100 ${20 + i * 25}, 200 ${40 + i * 25} T 400 ${30 + i * 25}`} fill="none" stroke="white" strokeWidth="0.5" />
                    ))}
                  </svg>
                  <div className="absolute left-4 top-4">
                    {active ? (
                      <span className="rounded-full bg-[var(--bronze)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">Active</span>
                    ) : (
                      <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">Available</span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-display text-xl font-semibold">{p.name}</div>
                    <div className="text-xs opacity-80"><MapPin className="mr-1 inline h-3 w-3" />{p.location}</div>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <StatMini icon={Trees} label="ac" value={p.acres} />
                    <StatMini icon={Camera} label="cams" value={p.cameras.length} />
                    <StatMini icon={Wheat} label="food" value={p.food.length} />
                    <StatMini icon={Droplets} label="bed" value={p.bedding.length} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.cover}</p>
                </div>
                <div className="flex items-center gap-2 border-t border-border p-3">
                  {active ? (
                    <Link to="/app/dashboard" className="flex-1">
                      <Button size="sm" className="w-full gap-1"><Check className="h-3.5 w-3.5" /> Open</Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { store.setActive(p.id); toast.success(`Switched to ${p.name}`); navigate({ to: "/app/dashboard" }); }}>
                      Switch to this
                    </Button>
                  )}
                  {properties.length > 1 && (
                    <Button size="icon" variant="ghost" aria-label="Delete property" onClick={() => { if (confirm(`Delete ${p.name}? This cannot be undone.`)) { store.removeProperty(p.id); toast.success("Property deleted"); } }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}

function StatMini({ icon: Icon, label, value }: any) {
  return (
    <div>
      <Icon className="h-3 w-3" />
      <div className="mt-0.5 font-medium text-foreground tabular-nums">{value}</div>
      {label}
    </div>
  );
}

function NewPropertyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [acres, setAcres] = useState(100);
  const [species, setSpecies] = useState("Whitetail deer");
  const [cover, setCover] = useState("");
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    store.addProperty({ name: name.trim(), location: location.trim(), acres, species, cover: cover.trim() });
    toast.success(`${name} created — start with Setup`);
    setOpen(false);
    setName(""); setLocation(""); setAcres(100); setCover("");
    navigate({ to: "/app/setup" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add property</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>New property</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cedar Hollow" required /></Field>
          <Field label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="County, State" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Acres"><Input type="number" min={1} value={acres} onChange={(e) => setAcres(Number(e.target.value))} /></Field>
            <Field label="Primary species"><Input value={species} onChange={(e) => setSpecies(e.target.value)} /></Field>
          </div>
          <Field label="Cover description"><Textarea rows={3} value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Habitat and terrain notes." /></Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create property</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
