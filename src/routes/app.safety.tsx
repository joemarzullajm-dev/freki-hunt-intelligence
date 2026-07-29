import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useSafety,
  store,
  type TrustedContact,
  type PublicLandMode,
} from "@/lib/freki-store";

export const Route = createFileRoute("/app/safety")({
  head: () => ({
    meta: [
      { title: "Safety — Freki" },
      {
        name: "description",
        content:
          "Live Location Sharing and trusted contacts for hunters in the field.",
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

function SafetyPage() {
  const safety = useSafety();
  const active = safety.sharingEnabled;

  return (
    <>
      <PageHeader
        title="Safety"
        description="Manage how Freki keeps you connected while you're in the field."
      />
      <PageBody>
        <div className="mx-auto grid max-w-3xl gap-6">
          {/* Live Location Sharing card */}
          <section className="surface-panel overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--bronze)]" />
                  <h2 className="font-display text-lg font-semibold">
                    Live Location Sharing
                  </h2>
                </div>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Share your live location with trusted contacts while you're
                  in the field. Location sharing is optional and can be turned
                  on or off at any time.
                </p>
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

            <div
              className={cn(
                "flex items-center justify-between gap-3 border-t border-border/60 px-5 py-3 sm:px-6",
                active ? "bg-[var(--forest)]/10" : "bg-muted/30",
              )}
            >
              <div className="flex items-center gap-2 text-sm">
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
                    "font-medium",
                    active ? "text-emerald-300" : "text-muted-foreground",
                  )}
                >
                  {active ? "Sharing Active" : "Sharing Off"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                End-to-end secured
              </div>
            </div>
          </section>

          {/* Trusted contacts */}
          <section className="surface-panel">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 p-5 sm:p-6">
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
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" /> Add Contact
                  </Button>
                }
              />
            </div>

            {safety.contacts.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Radio className="mx-auto mb-2 h-6 w-6 opacity-60" />
                No trusted contacts yet. Add someone you'd want to reach you.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {safety.contacts.map((c) => (
                  <ContactRow
                    key={c.id}
                    contact={c}
                    sharingActive={active}
                  />
                ))}
              </ul>
            )}
          </section>

          <p className="px-1 text-xs text-muted-foreground">
            Freki stores this list in your browser for the demo. In production,
            location updates would only be transmitted while sharing is active
            and only to the contacts listed above.
          </p>
        </div>
      </PageBody>
    </>
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
    <li className="flex items-center gap-4 p-4 sm:px-6">
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
          {isSharing
            ? "Sharing"
            : contact.sharing
              ? "Paused"
              : "Not shared"}
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
          <label className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-sm">
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
