import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  Radio,
  Users,
  Eye,
  EyeOff,
  Compass,
  ChevronRight,
  Heart,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useSafety,
  store,
  type TrustedContact,
  type PublicLandMode,
  type EmergencyInfo,
} from "@/lib/freki-store";

export const Route = createFileRoute("/app/safety")({
  head: () => ({
    meta: [
      { title: "Safety — Freki" },
      {
        name: "description",
        content:
          "Live location sharing, trusted contacts, public land awareness, and emergency information.",
      },
    ],
  }),
  component: SafetyPage,
});

const RELATIONSHIPS = [
  "Spouse",
  "Hunting Partner",
  "Father",
  "Mother",
  "Friend",
  "Son",
  "Daughter",
  "Sibling",
  "Other",
];

// iOS-style large rounded card wrapper
function SafetyCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border/60 bg-card/70 shadow-[0_1px_0_0_hsl(0_0%_100%/0.03)_inset,0_8px_30px_-12px_hsl(0_0%_0%/0.6)] backdrop-blur",
        className,
      )}
    >
      {children}
    </section>
  );
}

function SafetyPage() {
  const safety = useSafety();
  const active = safety.sharingEnabled;
  const sharingCount = safety.contacts.filter((c) => c.sharing).length;

  return (
    <>
      <PageHeader
        title="Safety"
        description="Stay connected and prepared while you're in the field."
      />
      <PageBody>
        <div className="mx-auto grid max-w-2xl gap-6 pb-10">
          {/* HERO — Location Sharing status */}
          <SafetyCard className="overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 pt-7 sm:px-8">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Location Sharing
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={cn(
                      "relative flex h-2.5 w-2.5",
                      active ? "" : "opacity-60",
                    )}
                    aria-hidden
                  >
                    {active && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    )}
                    <span
                      className={cn(
                        "relative inline-flex h-2.5 w-2.5 rounded-full",
                        active ? "bg-emerald-400" : "bg-muted-foreground/60",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "font-display text-2xl font-semibold tracking-tight",
                      active ? "text-emerald-300" : "text-muted-foreground",
                    )}
                  >
                    {active ? "ACTIVE" : "OFF"}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {active
                    ? sharingCount === 0
                      ? "No trusted contacts selected yet"
                      : `Sharing with ${sharingCount} Trusted Contact${sharingCount === 1 ? "" : "s"}`
                    : "Sharing is off"}
                </div>
              </div>
              <IOSToggle
                checked={active}
                onChange={(v) => {
                  store.setSharingEnabled(v);
                  toast.success(
                    v
                      ? "Live location sharing is on"
                      : "Live location sharing is off",
                  );
                }}
                ariaLabel="Toggle live location sharing"
              />
            </div>

            <p className="mt-5 px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:px-8">
              Share your live location with trusted contacts while you're in
              the field. Location sharing is optional and can be turned on or
              off at any time.
            </p>

            <div
              className={cn(
                "flex items-center justify-between gap-3 border-t border-border/60 px-6 py-3 sm:px-8",
                active ? "bg-[var(--forest)]/10" : "bg-muted/20",
              )}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {active ? "Sharing Active" : "Sharing Off"}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                End-to-end secured
              </div>
            </div>
          </SafetyCard>

          {/* Trusted Contacts */}
          <SafetyCard>
            <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4 sm:px-8">
              <div>
                <h2 className="font-display text-lg font-semibold">
                  Trusted Contacts
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Only people you add here can see your location.
                </p>
              </div>
              <ContactDialog
                trigger={
                  <Button size="sm" className="gap-1.5 rounded-full">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                }
              />
            </div>

            {safety.contacts.length === 0 ? (
              <div className="px-6 pb-8 pt-2 text-center text-sm text-muted-foreground sm:px-8">
                <Radio className="mx-auto mb-2 h-6 w-6 opacity-60" />
                No trusted contacts yet. Add someone you'd want to reach you.
              </div>
            ) : (
              <ul className="divide-y divide-border/60 border-t border-border/60">
                {safety.contacts.map((c) => (
                  <ContactRow
                    key={c.id}
                    contact={c}
                    sharingActive={active}
                  />
                ))}
              </ul>
            )}
          </SafetyCard>

          {/* Public Land Awareness */}
          <PublicLandAwareness />

          {/* Emergency Information */}
          <EmergencyInformation />

          <p className="px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            Freki stores this information in your browser for the demo. In
            production, location updates would only be transmitted while
            sharing is active and only to the contacts listed above.
          </p>
        </div>
      </PageBody>
    </>
  );
}

function PublicLandAwareness() {
  const safety = useSafety();
  const [open, setOpen] = useState(false);
  const auto = safety.onPublicLand;
  const mode = safety.publicLandMode;

  const modeOptions: {
    value: PublicLandMode;
    label: string;
    description: string;
    Icon: typeof Eye;
  }[] = [
    {
      value: "invisible",
      label: "Invisible",
      description: "You appear to no one.",
      Icon: EyeOff,
    },
    {
      value: "nearby",
      label: "Visible to Nearby Hunters",
      description: "Opted-in hunters see approximate distance and direction.",
      Icon: Eye,
    },
    {
      value: "trusted",
      label: "Visible to Trusted Contacts Only",
      description: "Only your trusted contacts see you.",
      Icon: ShieldCheck,
    },
  ];

  return (
    <SafetyCard className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-6 sm:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[var(--bronze)]" />
            <h2 className="font-display text-lg font-semibold">
              Public Land Awareness
            </h2>
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Activates automatically on public hunting property. Reduces hunter
            conflicts while protecting exact locations. Participation is
            optional.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
            auto
              ? "border-[var(--bronze)]/40 bg-[var(--bronze)]/10 text-[var(--bronze)]"
              : "border-border/70 bg-muted/30 text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              auto ? "bg-[var(--bronze)]" : "bg-muted-foreground/60",
            )}
          />
          {auto ? "On public land" : "Private property"}
        </span>
      </div>

      <div className="grid gap-2 px-6 pt-5 pb-5 sm:px-8">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Visibility
        </div>
        <div className="grid gap-2">
          {modeOptions.map((o) => {
            const selected = mode === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  store.setPublicLandMode(o.value);
                  toast.success(`Visibility set to ${o.label}`);
                }}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition",
                  selected
                    ? "border-[var(--bronze)]/60 bg-[var(--bronze)]/5"
                    : "border-border/60 hover:border-border hover:bg-muted/20",
                )}
                aria-pressed={selected}
              >
                <o.Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    selected
                      ? "text-[var(--bronze)]"
                      : "text-muted-foreground",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{o.label}</span>
                    {selected && (
                      <span className="rounded-full bg-[var(--bronze)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {o.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs text-muted-foreground">
          <span>Demo: simulate entering public land.</span>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => store.setOnPublicLand(!auto)}
          >
            {auto ? "Leave" : "Enter"}
          </Button>
        </div>
      </div>

      {auto && mode !== "invisible" && (
        <div className="border-t border-border/60 bg-card/50">
          <div className="flex items-center justify-between gap-3 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)]/40">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="font-display text-base font-semibold">
                  Hunters Nearby
                </div>
                <div className="text-xs text-muted-foreground">
                  {safety.nearbySharingCount} Hunters Currently Sharing
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpen(true)}
              className="gap-1.5 rounded-full"
            >
              View
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <ul className="divide-y divide-border/60 border-t border-border/60">
            {safety.nearbyHunters.slice(0, 3).map((h) => (
              <NearbyHunterRow key={h.id} hunter={h} />
            ))}
          </ul>

          <div className="border-t border-border/60 px-6 py-3 text-[11px] text-muted-foreground sm:px-8">
            Approximate distance and direction only. Exact coordinates are
            never shared.
          </div>
        </div>
      )}

      {auto && mode === "invisible" && (
        <div className="border-t border-border/60 bg-muted/20 px-6 py-4 text-sm text-muted-foreground sm:px-8">
          You're invisible on public land.
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hunters Nearby</DialogTitle>
          </DialogHeader>
          <div className="text-xs text-muted-foreground">
            {safety.nearbySharingCount} Hunters Currently Sharing · approximate
            positions only
          </div>
          <ul className="max-h-[60vh] divide-y divide-border/60 overflow-y-auto rounded-2xl border border-border/60">
            {safety.nearbyHunters.map((h) => (
              <NearbyHunterRow key={h.id} hunter={h} />
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SafetyCard>
  );
}

function EmergencyInformation() {
  const safety = useSafety();
  const info = safety.emergency;
  const [open, setOpen] = useState(false);

  const filled = [
    info.fullName,
    info.bloodType,
    info.emergencyContactName,
    info.emergencyContactPhone,
    info.medicalNotes || info.medications || info.allergies,
  ].filter(Boolean).length;
  const complete = filled >= 3;

  return (
    <SafetyCard>
      <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-6 sm:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[var(--bronze)]" />
            <h2 className="font-display text-lg font-semibold">
              Emergency Information
            </h2>
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Critical details shared with first responders and trusted contacts
            if you don't check in.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
            complete
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/40 bg-amber-400/10 text-amber-300",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              complete ? "bg-emerald-400" : "bg-amber-400",
            )}
          />
          {complete ? "Complete" : "Incomplete"}
        </span>
      </div>

      <dl className="mt-5 grid gap-px overflow-hidden border-y border-border/60 bg-border/40 text-sm">
        <InfoRow label="Full name" value={info.fullName} />
        <InfoRow label="Blood type" value={info.bloodType} />
        <InfoRow label="Allergies" value={info.allergies} />
        <InfoRow label="Medications" value={info.medications} />
        <InfoRow label="Medical notes" value={info.medicalNotes} />
        <InfoRow
          label="Emergency contact"
          value={
            info.emergencyContactName || info.emergencyContactPhone
              ? `${info.emergencyContactName}${info.emergencyContactPhone ? ` · ${info.emergencyContactPhone}` : ""}`
              : ""
          }
        />
        <InfoRow label="Vehicle" value={info.vehicleDescription} />
      </dl>

      <div className="flex items-center justify-between gap-3 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Stored on this device
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 rounded-full"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      <EmergencyDialog open={open} onOpenChange={setOpen} info={info} />
    </SafetyCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-4 bg-card/70 px-6 py-3 sm:px-8">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 truncate",
          value ? "text-foreground" : "text-muted-foreground/60",
        )}
      >
        {value || "Not set"}
      </dd>
    </div>
  );
}

function EmergencyDialog({
  open,
  onOpenChange,
  info,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  info: EmergencyInfo;
}) {
  const [draft, setDraft] = useState<EmergencyInfo>(info);
  // reset when reopened
  const set = <K extends keyof EmergencyInfo>(k: K, v: EmergencyInfo[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (v) setDraft(info);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Emergency Information</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[65vh] gap-4 overflow-y-auto pr-1">
          <div className="grid gap-1.5">
            <Label htmlFor="ei-name">Full name</Label>
            <Input
              id="ei-name"
              value={draft.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Legal name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Blood type</Label>
              <Select
                value={draft.bloodType || "unknown"}
                onValueChange={(v) => set("bloodType", v === "unknown" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  {["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ei-vehicle">Vehicle</Label>
              <Input
                id="ei-vehicle"
                value={draft.vehicleDescription}
                onChange={(e) => set("vehicleDescription", e.target.value)}
                placeholder="e.g. Green F-150"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ei-allergies">Allergies</Label>
            <Input
              id="ei-allergies"
              value={draft.allergies}
              onChange={(e) => set("allergies", e.target.value)}
              placeholder="e.g. Penicillin, bees"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ei-meds">Medications</Label>
            <Input
              id="ei-meds"
              value={draft.medications}
              onChange={(e) => set("medications", e.target.value)}
              placeholder="Current medications"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ei-notes">Medical notes</Label>
            <Textarea
              id="ei-notes"
              value={draft.medicalNotes}
              onChange={(e) => set("medicalNotes", e.target.value)}
              placeholder="Conditions responders should know about"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ei-ec-name">Emergency contact</Label>
              <Input
                id="ei-ec-name"
                value={draft.emergencyContactName}
                onChange={(e) => set("emergencyContactName", e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ei-ec-phone">Phone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="ei-ec-phone"
                  value={draft.emergencyContactPhone}
                  onChange={(e) =>
                    set("emergencyContactPhone", e.target.value)
                  }
                  placeholder="(555) 555-5555"
                  className="pl-8"
                  inputMode="tel"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              store.setEmergencyInfo(draft);
              toast.success("Emergency information saved");
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NearbyHunterRow({
  hunter,
}: {
  hunter: { username: string; distanceMiles: number; direction: string };
}) {
  return (
    <li className="flex items-center gap-4 px-6 py-3 sm:px-8">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/40">
        <Compass className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{hunter.username}</div>
        <div className="text-xs text-muted-foreground">
          Approximate location
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium tabular-nums">
          {hunter.distanceMiles.toFixed(1)} miles
        </div>
        <div className="text-xs text-muted-foreground">{hunter.direction}</div>
      </div>
    </li>
  );
}

function ContactRow({
  contact,
  sharingActive,
}: {
  contact: TrustedContact;
  sharingActive: boolean;
}) {
  const initials = contact.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isSharing = sharingActive && contact.sharing;

  return (
    <li className="flex items-center gap-4 px-6 py-4 sm:px-8">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--forest)]/40 text-sm font-medium text-foreground">
        {initials || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{contact.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {contact.relationship}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isSharing
              ? "bg-emerald-400"
              : contact.sharing
                ? "bg-amber-400/70"
                : "bg-muted-foreground/50",
          )}
        />
        <span
          className={cn(
            isSharing
              ? "text-emerald-300"
              : contact.sharing
                ? "text-amber-300/90"
                : "text-muted-foreground",
          )}
        >
          {isSharing ? "Sharing" : contact.sharing ? "Paused" : "Not shared"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <IOSToggle
          checked={contact.sharing}
          onChange={(v) => store.updateContact(contact.id, { sharing: v })}
          ariaLabel={`Toggle sharing with ${contact.name}`}
          size="sm"
        />
        <ContactDialog
          contact={contact}
          trigger={
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Edit ${contact.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Remove ${contact.name}`}
          onClick={() => {
            store.removeContact(contact.id);
            toast.success(`${contact.name} removed`);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

function ContactDialog({
  contact,
  trigger,
}: {
  contact?: TrustedContact;
  trigger: React.ReactNode;
}) {
  const editing = !!contact;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(contact?.name ?? "");
  const [relationship, setRelationship] = useState(
    contact?.relationship ?? "Hunting Partner",
  );
  const [sharing, setSharing] = useState(contact?.sharing ?? true);

  const reset = () => {
    setName(contact?.name ?? "");
    setRelationship(contact?.relationship ?? "Hunting Partner");
    setSharing(contact?.sharing ?? true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Contact" : "Add Trusted Contact"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="tc-name">Name</Label>
            <Input
              id="tc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoFocus
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Relationship</Label>
            <Select value={relationship} onValueChange={setRelationship}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIPS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-sm">
            <span>
              <span className="font-medium">Share location</span>
              <span className="ml-2 text-xs text-muted-foreground">
                Included when sharing is active
              </span>
            </span>
            <IOSToggle
              checked={sharing}
              onChange={setSharing}
              ariaLabel="Share location with this contact"
              size="sm"
            />
          </label>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const trimmed = name.trim();
              if (!trimmed) {
                toast.error("Name is required");
                return;
              }
              if (editing && contact) {
                store.updateContact(contact.id, {
                  name: trimmed,
                  relationship,
                  sharing,
                });
                toast.success(`${trimmed} updated`);
              } else {
                store.addContact({ name: trimmed, relationship, sharing });
                toast.success(`${trimmed} added`);
              }
              setOpen(false);
            }}
          >
            {editing ? "Save changes" : "Add contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IOSToggle({
  checked,
  onChange,
  ariaLabel,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  const dims =
    size === "sm"
      ? { track: "h-6 w-10", knob: "h-5 w-5", translate: "translate-x-4" }
      : { track: "h-7 w-12", knob: "h-6 w-6", translate: "translate-x-5" };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--bronze)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        dims.track,
        checked ? "bg-emerald-500" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block transform rounded-full bg-white shadow-md transition-transform duration-200 ease-out",
          dims.knob,
          checked ? dims.translate : "translate-x-0.5",
        )}
      />
    </button>
  );
}
