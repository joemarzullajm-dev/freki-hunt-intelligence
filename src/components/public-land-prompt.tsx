import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Compass, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSafety, store, type PublicLandMode } from "@/lib/freki-store";

export function PublicLandPrompt() {
  const safety = useSafety();
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "visibility">("intro");

  const open = safety.onPublicLand && safety.publicLandParticipation === "unset";

  function handleOpenChange(next: boolean) {
    // Dismissing by tapping outside counts as "Not Now".
    if (!next && open) {
      store.setPublicLandParticipation("declined");
      setStep("intro");
    }
  }

  function decline() {
    store.setPublicLandParticipation("declined");
    setStep("intro");
    toast("Public Land Awareness left off. You can enable it later in Safety.");
  }

  function pickVisibility(mode: PublicLandMode, label: string) {
    store.setPublicLandMode(mode);
    store.setPublicLandParticipation("enabled");
    setStep("intro");
    toast.success(`Public Land Awareness on · ${label}`);
  }

  const modeOptions: {
    value: PublicLandMode;
    label: string;
    description: string;
    Icon: typeof Eye;
  }[] = [
    { value: "invisible", label: "Invisible", description: "You appear to no one.", Icon: EyeOff },
    { value: "nearby", label: "Nearby Hunters", description: "Opted-in hunters see approximate distance and direction.", Icon: Eye },
    { value: "trusted", label: "Trusted Contacts Only", description: "Only your trusted contacts see you.", Icon: ShieldCheck },
  ];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-t border-border/60 bg-card/95 px-6 pt-6 pb-8 backdrop-blur sm:mx-auto sm:max-w-md"
      >
        {step === "intro" ? (
          <>
            <SheetHeader className="items-start text-left">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bronze)]/15">
                <Compass className="h-5 w-5 text-[var(--bronze)]" />
              </div>
              <SheetTitle className="font-display text-xl">Public Land Awareness</SheetTitle>
              <SheetDescription className="text-sm leading-relaxed text-muted-foreground">
                You are currently hunting public land. Would you like to participate in Public Land Awareness?
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid gap-2">
              <Button className="h-11 rounded-full" onClick={() => setStep("visibility")}>
                Enable
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full"
                onClick={decline}
              >
                Not Now
              </Button>
              <Button
                variant="ghost"
                className="h-11 rounded-full"
                onClick={() => {
                  // Leave state as "unset" so we can prompt again after they read the docs.
                  navigate({ to: "/app/safety" });
                }}
              >
                Learn More
              </Button>
            </div>
            <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              Participation is always opt-in. Exact coordinates are never shared.
            </p>
          </>
        ) : (
          <>
            <SheetHeader className="items-start text-left">
              <SheetTitle className="font-display text-lg">Choose your visibility</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                You can change this any time in Safety.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 grid gap-2">
              {modeOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => pickVisibility(o.value, o.label)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border border-border/60 p-3.5 text-left transition hover:border-border hover:bg-muted/20",
                  )}
                >
                  <o.Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bronze)]" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{o.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{o.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="ghost" className="rounded-full" onClick={() => setStep("intro")}>
                Back
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
