import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { observations } from "@/lib/freki-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Eye, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/observations")({
  head: () => ({
    meta: [
      { title: "Observations — Freki" },
      { name: "description", content: "Field observation log." },
    ],
  }),
  component: Observations,
});

const types = ["Sighting","Track","Rub","Scrape","Vocalization","Bedding evidence","Feeding evidence","Harvest","Human pressure","Predator","Weather event","Property work","Other"];

function Observations() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const filtered = observations.filter((o) =>
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
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search observations" className="pl-8 w-64" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
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
                    <div className="mt-2 font-medium">{o.species !== "—" ? o.species : "Sign"} · {o.location}</div>
                    <div className="text-xs text-muted-foreground">Wind {o.wind} · {o.behavior !== "—" ? o.behavior : "—"}</div>
                    <p className="mt-2 text-sm">{o.notes}</p>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="timeline" className="mt-4">
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
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add observation</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>New observation</DialogTitle></DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Observation saved & shared with Property Brain"); }}
          className="grid gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input type="date" defaultValue="2026-11-13" /></Field>
            <Field label="Time"><Input type="time" defaultValue="16:30" /></Field>
          </div>
          <Field label="Location"><Input defaultValue="North Funnel" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select defaultValue="Sighting">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Species"><Input defaultValue="Whitetail buck" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Number"><Input type="number" defaultValue={1} /></Field>
            <Field label="Direction"><Input placeholder="e.g. S → N" /></Field>
            <Field label="Wind"><Input placeholder="NW 8" /></Field>
          </div>
          <Field label="Behavior"><Input placeholder="Cruising, feeding, bedded…" /></Field>
          <Field label="Notes"><Textarea rows={3} placeholder="What did you see?" /></Field>
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
