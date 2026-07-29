import { Link } from "@tanstack/react-router";
import { MapPin, ShieldCheck, ChevronRight, Users } from "lucide-react";
import { useSafety, store } from "@/lib/freki-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function LiveSharingBanner() {
  const { sharingEnabled } = useSafety();
  if (!sharingEnabled) return null;
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300"
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Live Location Sharing Active
    </div>
  );
}

export function PropertySafetyCard({ className }: { className?: string }) {
  const safety = useSafety();
  const active = safety.sharingEnabled;
  const sharingCount = safety.contacts.filter((c) => c.sharing).length;

  return (
    <section className={cn("surface-panel overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-[var(--bronze)]" />
            Safety
          </div>
          <div className="mt-2 font-display text-base font-semibold">
            Live Location Sharing
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                active ? "bg-emerald-400" : "bg-muted-foreground/50",
              )}
            />
            <span
              className={cn(
                active ? "text-emerald-300" : "text-muted-foreground",
              )}
            >
              {active ? "Sharing Active" : "Sharing Off"}
            </span>
          </div>
        </div>
        <IOSToggle
          checked={active}
          onChange={(v) => {
            store.setSharingEnabled(v);
            toast.success(
              v ? "Live location sharing is on" : "Live location sharing is off",
            );
          }}
          ariaLabel="Toggle live location sharing"
        />
      </div>

      <Link
        to="/app/safety"
        className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-2.5 text-xs transition hover:bg-muted/30"
      >
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {safety.contacts.length === 0
            ? "No trusted contacts"
            : active
              ? `Sharing with ${sharingCount} of ${safety.contacts.length}`
              : `${safety.contacts.length} trusted contact${safety.contacts.length === 1 ? "" : "s"}`}
        </span>
        <span className="flex items-center gap-1 font-medium text-foreground/80">
          Manage
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      {active && (
        <div className="flex items-center gap-1.5 border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          End-to-end secured · location shared only while on
        </div>
      )}
    </section>
  );
}

function IOSToggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--bronze)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-emerald-500" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-out",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
