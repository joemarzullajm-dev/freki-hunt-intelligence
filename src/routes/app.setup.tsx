import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useActiveProperty, store, type Stand, type Camera, type Feature } from "@/lib/freki-store";
import { Plus, Pencil, Trash2, MapPin, Camera as CameraIcon, Wheat, Bed, Route as RouteIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/setup")({
  head: () => ({
    meta: [
      { title: "Property Setup — Freki" },
      { name: "description", content: "Manage stands, cameras, food, bedding and access routes." },
    ],
  }),
  component: Setup,
});

const WINDS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function Setup() {
  const p = useActiveProperty();
  return (
    <>
      <PageHeader
        title="Property Setup"
        description={`Manage the map features that power every recommendation for ${p.name}.`}
      />
      <PageBody>
        <Tabs defaultValue="stands">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="stands">Stands ({p.stands.length})</TabsTrigger>
            <TabsTrigger value="cameras">Cameras ({p.cameras.length})</TabsTrigger>
            <TabsTrigger value="food">Food ({p.food.length})</TabsTrigger>
            <TabsTrigger value="bedding">Bedding ({p.bedding.length})</TabsTrigger>
            <TabsTrigger value="access">Access ({p.access.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="stands" className="mt-4"><StandsTab /></TabsContent>
          <TabsContent value="cameras" className="mt-4"><CamerasTab /></TabsContent>
          <TabsContent value="food" className="mt-4"><FeaturesTab kind="food" icon={Wheat} title="Food sources" /></TabsContent>
          <TabsContent value="bedding" className="mt-4"><FeaturesTab kind="bedding" icon={Bed} title="Bedding areas" /></TabsContent>
          <TabsContent value="access" className="mt-4"><FeaturesTab kind="access" icon={RouteIcon} title="Access routes" /></TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}

function EmptyRow({ icon: Icon, label, onAdd }: any) {
  return (
    <div className="surface-panel p-8 text-center">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
      <div className="mt-2 font-medium">No {label} yet</div>
      <div className="mt-1 text-sm text-muted-foreground">Add one to sharpen recommendations.</div>
      <Button className="mt-4" onClick={onAdd}>Add {label}</Button>
    </div>
  );
}

function StandsTab() {
  const { stands } = useActiveProperty();
  const [editing, setEditing] = useState<Stand | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add stand</Button>
      </div>
      {stands.length === 0 ? (
        <EmptyRow icon={MapPin} label="stands" onAdd={() => { setEditing(null); setOpen(true); }} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stands.map((s) => (
            <article key={s.id} className="surface-panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-base font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.type} · Best wind: {s.bestWind.join("/")}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => { if (confirm(`Delete ${s.name}?`)) { store.removeStand(s.id); toast.success("Stand deleted"); } }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              {s.notes && <p className="mt-2 text-sm text-muted-foreground">{s.notes}</p>}
              <div className="mt-2 text-xs text-muted-foreground">Location: {s.x}% × {s.y}%</div>
            </article>
          ))}
        </div>
      )}
      <StandDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}

function StandDialog({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (o: boolean) => void; initial: Stand | null }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState(initial?.type ?? "Ladder");
  const [bestWind, setBestWind] = useState<string[]>(initial?.bestWind ?? ["NW"]);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [x, setX] = useState(initial?.x ?? 50);
  const [y, setY] = useState(initial?.y ?? 50);

  // Reset when initial changes (dialog re-opens with different target)
  const key = `${initial?.id ?? "new"}-${open}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => { /* noop for key coupling */ });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    const data = { name: name.trim(), type, bestWind, notes: notes.trim(), x, y };
    if (initial) { store.updateStand(initial.id, data); toast.success("Stand updated"); }
    else { store.addStand(data); toast.success("Stand added"); }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={key} className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{initial ? "Edit stand" : "New stand"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Ladder","Hang-on","Ground blind","Elevated blind","Saddle","Climber"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Best winds">
              <div className="flex flex-wrap gap-1">
                {WINDS.map((w) => (
                  <button type="button" key={w}
                    onClick={() => setBestWind((prev) => prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w])}
                    className={`rounded-md border px-2 py-1 text-xs ${bestWind.includes(w) ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                    {w}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Map X (${x}%)`}><Input type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} /></Field>
            <Field label={`Map Y (${y}%)`}><Input type="range" min={0} max={100} value={y} onChange={(e) => setY(Number(e.target.value))} /></Field>
          </div>
          <Field label="Notes"><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save changes" : "Add stand"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CamerasTab() {
  const { cameras } = useActiveProperty();
  const [editing, setEditing] = useState<Camera | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add camera</Button>
      </div>
      {cameras.length === 0 ? (
        <EmptyRow icon={CameraIcon} label="cameras" onAdd={() => { setEditing(null); setOpen(true); }} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {cameras.map((c) => (
            <article key={c.id} className="surface-panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-base font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">Battery {c.battery}% · Last {c.lastCheck}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Badge variant="secondary" className="shrink-0">{c.status}</Badge>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">24h detections: <span className="text-foreground">{c.detections24h}</span> · Daylight {c.daylightPct}%</div>
              <div className="mt-3 flex gap-1">
                <Button size="sm" variant="outline" className="gap-1" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => { if (confirm(`Delete ${c.name}?`)) { store.removeCamera(c.id); toast.success("Camera deleted"); } }}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <CameraDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}

function CameraDialog({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (o: boolean) => void; initial: Camera | null }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [status, setStatus] = useState<Camera["status"]>(initial?.status ?? "Online");
  const [battery, setBattery] = useState(initial?.battery ?? 90);
  const [detections, setDetections] = useState(initial?.detections24h ?? 0);
  const [daylight, setDaylight] = useState(initial?.daylightPct ?? 30);
  const [x, setX] = useState(initial?.x ?? 50);
  const [y, setY] = useState(initial?.y ?? 50);
  const key = `${initial?.id ?? "new"}-${open}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    const data: Omit<Camera, "id"> = {
      name: name.trim(), status, battery, lastCheck: "just now",
      detections24h: detections, daylightPct: daylight,
      targetActivity: detections > 8 ? "Above" : detections > 3 ? "Baseline" : "Below",
      x, y,
    };
    if (initial) { store.updateCamera(initial.id, data); toast.success("Camera updated"); }
    else { store.addCamera(data); toast.success("Camera added"); }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={key} className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{initial ? "Edit camera" : "New camera"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Online","Offline","Low battery"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label={`Battery (${battery}%)`}><Input type="range" min={0} max={100} value={battery} onChange={(e) => setBattery(Number(e.target.value))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="24h detections"><Input type="number" min={0} value={detections} onChange={(e) => setDetections(Number(e.target.value))} /></Field>
            <Field label={`Daylight % (${daylight})`}><Input type="range" min={0} max={100} value={daylight} onChange={(e) => setDaylight(Number(e.target.value))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Map X (${x}%)`}><Input type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} /></Field>
            <Field label={`Map Y (${y}%)`}><Input type="range" min={0} max={100} value={y} onChange={(e) => setY(Number(e.target.value))} /></Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save changes" : "Add camera"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FeaturesTab({ kind, icon: Icon, title }: { kind: "food" | "bedding" | "access"; icon: any; title: string }) {
  const p = useActiveProperty();
  const items = p[kind];
  const [editing, setEditing] = useState<Feature | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add {title.replace(/s$/, "").toLowerCase()}</Button>
      </div>
      {items.length === 0 ? (
        <EmptyRow icon={Icon} label={title.toLowerCase()} onAdd={() => { setEditing(null); setOpen(true); }} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((f) => (
            <article key={f.id} className="surface-panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-base font-semibold truncate flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" /> {f.name}
                  </div>
                  <div className="text-xs text-muted-foreground">Location: {f.x}% × {f.y}%</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => { setEditing(f); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => { if (confirm(`Delete ${f.name}?`)) { store.removeFeature(kind, f.id); toast.success("Deleted"); } }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              {f.notes && <p className="mt-2 text-sm text-muted-foreground">{f.notes}</p>}
            </article>
          ))}
        </div>
      )}
      <FeatureDialog open={open} onOpenChange={setOpen} initial={editing} kind={kind} title={title} />
    </div>
  );
}

function FeatureDialog({ open, onOpenChange, initial, kind, title }: { open: boolean; onOpenChange: (o: boolean) => void; initial: Feature | null; kind: "food" | "bedding" | "access"; title: string }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [x, setX] = useState(initial?.x ?? 50);
  const [y, setY] = useState(initial?.y ?? 50);
  const key = `${initial?.id ?? "new"}-${open}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    const data = { name: name.trim(), notes: notes.trim() || undefined, x, y };
    if (initial) { store.updateFeature(kind, initial.id, data); toast.success("Updated"); }
    else { store.addFeature(kind, data); toast.success("Added"); }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={key} className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{initial ? `Edit ${title.toLowerCase()}` : `New ${title.replace(/s$/, "").toLowerCase()}`}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="Notes"><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Map X (${x}%)`}><Input type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} /></Field>
            <Field label={`Map Y (${y}%)`}><Input type="range" min={0} max={100} value={y} onChange={(e) => setY(Number(e.target.value))} /></Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save changes" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
