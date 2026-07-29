import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FrekiMark, FrekiWordmark } from "@/components/freki-logo";
import {
  Brain,
  Target,
  Camera,
  ScrollText,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Wind,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Freki — We give you the why." },
      {
        name: "description",
        content:
          "Freki turns property data, field observations, weather, wind, camera activity, and hunting history into clear, evidence-backed intelligence.",
      },
      { property: "og:title", content: "Freki — Hunting property intelligence" },
      {
        property: "og:description",
        content: "Know the property. Understand the conditions. Make the decision.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="topo-bg min-h-dvh">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <FrekiWordmark />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#who" className="hover:text-foreground">Who it's for</a>
          <a href="#features" className="hover:text-foreground">Platform</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/demo"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/demo"><Button size="sm">Explore demo</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-16 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--bronze)]" />
              Hunting property intelligence
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Know the property.<br />
              Understand the conditions.<br />
              <span className="text-[var(--forest)]">Make the decision.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Freki turns property data, field observations, weather, wind, camera activity, habitat
              features, and hunting history into clear, evidence-backed intelligence.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/demo">
                <Button size="lg" className="gap-2">
                  Explore the demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="outline">See how it works</Button>
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              No account or credentials required. We give you the why — never certainty.
            </p>
          </div>

          <div className="lg:col-span-6">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="font-display text-2xl leading-snug text-foreground sm:text-3xl">
            Most hunting apps tell you what <em className="text-muted-foreground not-italic">might</em> happen.
            <br className="hidden sm:block" /> Freki explains <span className="text-[var(--bronze)]">why</span>.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Platform" title="An intelligence layer for your property" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Brain} title="Property Brain"
            body="A living model of your property — travel corridors, bedding, food, pressure, and gaps in what you know." />
          <FeatureCard icon={ShieldCheck} title="Truth Score"
            body="Every recommendation carries a Truth Score: how well-supported the conclusion is, and where the evidence is weak." />
          <FeatureCard icon={Target} title="Hunt Evaluation"
            body="Score a planned hunt against wind, access, pressure, camera activity, and history — with clear reasoning." />
          <FeatureCard icon={Camera} title="Trail Camera Intelligence"
            body="Detections weighted by daylight, wind, and coverage — not just image counts." />
          <FeatureCard icon={ScrollText} title="Evidence-backed recommendations"
            body="See supporting evidence, conflicting evidence, and what could change the conclusion." />
          <FeatureCard icon={Sparkles} title="Property-specific AI"
            body="Ask Freki about your property. Answers ground in your data — with confidence and caveats." />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="How Freki works" title="From fragmented data to a decision" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step n={1} icon={MapPin} title="Map the property"
              body="Stands, cameras, bedding, food, water, access routes, and habitat — all in one place." />
            <Step n={2} icon={Wind} title="Layer the conditions"
              body="Wind, weather, pressure, moon, and camera activity — evaluated against your property." />
            <Step n={3} icon={Compass} title="Get the why"
              body="Freki explains what it thinks, why, and what could change its mind." />
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="who" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Who Freki is for" title="Built for people who take the property seriously" />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            "Experienced hunters",
            "Landowners",
            "Habitat managers",
            "Hunting clubs",
          ].map((r) => (
            <div key={r} className="surface-panel p-5">
              <div className="font-display text-lg font-semibold">{r}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Organize what you already know. Understand what you don't.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <FrekiMark className="mx-auto h-8 w-8 text-[var(--bronze)]" />
          <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
            We give you the why.
          </h2>
          <p className="mt-3 text-sidebar-foreground/70">
            Walk through a fully populated demo property. No signup. No credentials.
          </p>
          <div className="mt-6">
            <Link to="/demo">
              <Button size="lg" variant="default" className="bg-[var(--bronze)] text-primary-foreground hover:bg-[var(--bronze)]/90 gap-2">
                Explore Black Ridge Farm <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <FrekiWordmark className="[&_span]:text-base" />
          <span>© {new Date().getFullYear()} Freki. Decision support, not certainty.</span>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--bronze)]">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="surface-panel p-6 hover:border-foreground/20 transition">
      <Icon className="h-5 w-5 text-[var(--bronze)]" />
      <div className="mt-4 font-display text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Step({ n, icon: Icon, title, body }: { n: number; icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="surface-panel p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full border border-border font-display text-sm">{n}</div>
        <Icon className="h-5 w-5 text-[var(--forest)]" />
      </div>
      <div className="mt-4 font-display text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="surface-panel relative overflow-hidden bg-sidebar p-5 text-sidebar-foreground shadow-2xl">
      <div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
        <div className="flex items-center gap-2"><FrekiMark className="h-4 w-4 text-[var(--bronze)]" /> Black Ridge Farm</div>
        <div>Today · NW 9 mph</div>
      </div>
      <div className="mt-4 rounded-md border border-sidebar-border bg-sidebar-accent/50 p-4">
        <div className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Current Hunt Outlook</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="font-display text-4xl font-semibold text-[var(--bronze)]">78</div>
          <div className="text-sm text-sidebar-foreground/70">Recommended · Moderate confidence</div>
        </div>
        <div className="mt-2 text-sm">
          Best window <strong>4:00 – 5:45 PM</strong> · <strong>North Funnel</strong>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-sidebar-foreground/80">
          NW wind protects the primary access. Daylight camera activity is above baseline
          and pressure is falling. Confidence is moderate — East Ridge camera is offline.
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {[
          { label: "Wind", value: "NW 9" },
          { label: "Pressure", value: "29.72↓" },
          { label: "Truth", value: "74" },
        ].map((m) => (
          <div key={m.label} className="rounded-md border border-sidebar-border p-2">
            <div className="text-sidebar-foreground/50">{m.label}</div>
            <div className="mt-0.5 font-display text-base">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
