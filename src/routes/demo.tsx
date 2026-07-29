import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FrekiWordmark } from "@/components/freki-logo";
import { ArrowRight, Mail, Chrome, Compass, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Explore the demo — Freki" },
      { name: "description", content: "Open the Black Ridge Farm demo property in Freki." },
      { property: "og:title", content: "Explore the Freki demo" },
      { property: "og:description", content: "Walk through a fully populated demo property. No signup." },
    ],
  }),
  component: Demo,
});

const goals = [
  "Plan individual hunts",
  "Manage a hunting property",
  "Organize trail cameras",
  "Improve habitat",
  "Manage a hunting club",
];
const speciesList = ["Whitetail deer", "Turkey", "Elk", "Black bear", "Waterfowl", "Other"];

function Demo() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("Plan individual hunts");
  const [species, setSpecies] = useState("Whitetail deer");
  const navigate = useNavigate();

  if (step === 0) {
    return (
      <div className="topo-bg min-h-dvh">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/"><FrekiWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back</Link>
        </div>
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--bronze)]">Sign in</div>
            <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Enter Freki</h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              Continue with your account, or explore the fully populated demo property — no credentials required.
            </p>
          </div>

          <div className="surface-panel space-y-3 p-6">
            <div>
              <label htmlFor="email" className="text-sm">Email</label>
              <div className="mt-1 flex gap-2">
                <Input id="email" type="email" placeholder="you@example.com" />
                <Button variant="outline" disabled className="shrink-0">
                  <Mail className="mr-2 h-4 w-4" /> Continue
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Email login is a placeholder in the demo build.</p>
            </div>
            <Button variant="outline" className="w-full justify-center" disabled>
              <Chrome className="mr-2 h-4 w-4" /> Continue with Google
            </Button>
            <div className="relative py-3 text-center text-xs text-muted-foreground">
              <span className="relative z-10 bg-card px-2">or</span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            </div>
            <Button className="w-full justify-center gap-2" onClick={() => setStep(1)}>
              <Compass className="h-4 w-4" /> Explore demo property
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topo-bg min-h-dvh">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <FrekiWordmark />
        <div className="text-xs text-muted-foreground">Step {step} of 3</div>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-12">
        {step === 1 && (
          <StepCard title="What's your main goal?" subtitle="We'll tailor the demo to match.">
            <div className="grid gap-2">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition",
                    goal === g ? "border-foreground bg-card" : "border-border hover:border-foreground/40",
                  )}
                >
                  {g}
                  {goal === g && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(2)} className="gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </StepCard>
        )}
        {step === 2 && (
          <StepCard title="Primary species" subtitle="The demo property is set up for whitetail deer.">
            <div className="grid gap-2 sm:grid-cols-2">
              {speciesList.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecies(s)}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm",
                    species === s ? "border-foreground bg-card" : "border-border hover:border-foreground/40",
                  )}
                >
                  {s}
                  {species === s && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} className="gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </StepCard>
        )}
        {step === 3 && (
          <StepCard title="Open Black Ridge Farm" subtitle="A 286-acre sample property in upstate New York — fully populated with cameras, stands, observations, and hunt history.">
            <div className="surface-panel p-5">
              <div className="font-display text-lg font-semibold">Black Ridge Farm</div>
              <div className="mt-1 text-sm text-muted-foreground">286 ac · Upstate NY · Whitetail</div>
              <ul className="mt-3 grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
                <li>8 trail cameras</li>
                <li>6 hunting stands</li>
                <li>4 bedding zones</li>
                <li>18 observations</li>
                <li>3 food sources</li>
                <li>Recent hunt history</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => navigate({ to: "/app/dashboard" })} className="gap-2">
                Open property <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </StepCard>
        )}
      </div>
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}
