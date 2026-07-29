import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Eye, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useActiveProperty, store } from "@/lib/freki-store";

export const Route = createFileRoute("/app/observations")({
  head: () => ({
    meta: [
      { title: "Observations — Freki" },
      { name: "description", content: "Field observation log — shared with Property Brain." },
    ],
  }),
  component: Observations,
});

const types = ["Sighting","Track","Rub","Scrape","Vocalization","Bedding evidence","Feeding evidence","Harvest","Human pressure","Predator","Weather event","Property work","Other"];

function Observations() {
  const p = useActiveProperty();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const filtered = p.observations.filter((o) =>
    (type === "all" || o.type === type) &&
    (q === "" || (o.notes + o.location + o.species).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageHeader
        title="Observations"
        description="Every observation feeds Property Brain."
        actions={<NewObservationDialog />}
      />
      <PageBody>
        <div className="mb-4 rounded-md border border-dashed border-border bg-card/40 p-3 text-xs text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> of <strong className="text-foreground">{p.observations.length}</strong> observations.
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search observations" className="pl-8 w-64" aria-label="Search observations" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44" aria-label="Filter by type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          {(q || type !== "all") && (
            <Button variant="ghost" size="sm" onClick={() => { setQ(""); setType("all"); }}>Clear filters</Button>
          )}
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((o) => (
                  <article key={o.id} className="surface-panel p-4">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="secondary">{o.type}</Badge>
                      <span className="text-muted-foreground">{o.date}</span>
                    </div>
                    <div className="mt-2 font-medium">{o.species !== "—" && o.species ? o.species : "Sign"} · {o.location}</div>
                    <div className="text-xs text-muted-foreground">Wind {o.wind || "—"} · {o.behavior && o.behavior !== "—" ? o.behavior : "—"}</div>
                    <p className="mt-2 text-sm">{o.notes}</p>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="ghost" className="gap-1 text-destructive"
                        onClick={() => { if (confirm("Delete observation?")) { store.removeObservation(o.id); toast.success("Deleted"); } }}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="timeline" className="mt-4">
            {filtered.length === 0 ? <EmptyState /> : (
              <ol className="relative border-l border-border pl-6">
                {filtered.map((o) => (
                  <li key={o.id} className="mb-6">
                    <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-[var(--bronze)] ring-4 ring-background" />
                    <div className="text-xs text-muted-foreground">{o.date}</div>
                    <div className="font-medium">{o.type} · {o.location}</div>
                    <p className="text-sm text-muted-foreground">{o.notes}</p>
                  </li>
                ))}
              </ol>
            )}
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}

function EmptyState() {
  return (
    <div className="surface-panel p-10 text-center">
      <Eye className="mx-auto h-8 w-8 text-muted-foreground" />
      <div className="mt-3 font-medium">No observations match those filters</div>
      <div className="text-sm text-muted-foreground">Try clearing filters or add a new observation.</div>
    </div>
  );
}

function NewObservationDialog() {
  const p = useActiveProperty();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Sighting");
  const [location, setLocation] = useState(p.stands[0]?.name ?? "");
  const [species, setSpecies] = useState("Whitetail buck");
  const [count, setCount] = useState(1);
  const [direction, setDirection] = useState("");
  const [wind, setWind] = useState("NW 8");
  const [behavior, setBehavior] = useState("");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim() && !species) { toast.error("Add notes or species"); return; }
    store.addObservation({
      date: "Just now",
      location: location || "Unmarked",
      type, species: species || "—",
      count, direction: direction || "—",
      behavior: behavior || "—",
      wind, notes: notes.trim(),
      confidence: 85,
    });
    toast.success("Observation saved & shared with Property Brain");
    setOpen(false);
    setNotes(""); setDirection(""); setBehavior("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add observation</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>New observation</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Location">
              {p.stands.length > 0 ? (
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {p.stands.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              )}
            </Field>
          </div>
          <Field label="Species"><Input value={species} onChange={(e) => setSpecies(e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Number"><Input type="number" min={0} value={count} onChange={(e) => setCount(Number(e.target.value))} /></Field>
            <Field label="Direction"><Input value={direction} onChange={(e) => setDirection(e.target.value)} placeholder="e.g. S → N" /></Field>
            <Field label="Wind"><Input value={wind} onChange={(e) => setWind(e.target.value)} placeholder="NW 8" /></Field>
          </div>
          <Field label="Behavior"><Input value={behavior} onChange={(e) => setBehavior(e.target.value)} placeholder="Cruising, feeding, bedded…" /></Field>
          <Field label="Notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you see?" /></Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save observation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
