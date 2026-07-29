import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Camera,
  Compass,
  MapPin,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
  Wind,
  CircleDot,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRTH — Tonight's read." },
      {
        name: "description",
        content:
          "TRTH turns property data, field observations, weather, wind, camera activity, and hunting history into a single confident read.",
      },
      { property: "og:title", content: "TRTH — Hunting property intelligence" },
      {
        property: "og:description",
        content: "The app does the hard thinking. You make the final decision.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const year = new Date().getFullYear();

  return (
    <div className="trth-scope">
      <div className="topo-veil min-h-dvh">
        {/* Nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="serif text-xl tracking-tight">TRTH</div>
          <nav
            className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] md:flex"
            style={{ color: "var(--trth-ink-mute)" }}
          >
            <a href="#how" className="hover:opacity-80">How</a>
            <a href="#platform" className="hover:opacity-80">Platform</a>
            <a href="#who" className="hover:opacity-80">Who</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/demo"
              className="hidden sm:inline-flex h-9 items-center rounded-full px-3 text-xs hairline border"
              style={{ color: "var(--trth-ink-dim)" }}
            >
              Sign in
            </Link>
            <Link
              to="/app/dashboard"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium accent-bg"
            >
              Open demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-20 lg:pt-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "var(--trth-ink-mute)" }}
              >
                Whitetail intelligence · Tonight's read
              </div>
              <h1 className="serif mt-6 text-[52px] leading-[0.95] sm:text-[76px] lg:text-[92px]">
                Tonight's read.
                <br />
                <span className="accent italic">In one glance.</span>
              </h1>
              <p
                className="mt-8 max-w-xl text-[17px] leading-relaxed"
                style={{ color: "var(--trth-ink-dim)" }}
              >
                TRTH weighs your property, cameras, wind, pressure, and history into a single
                confident recommendation. The app does the hard thinking. You make the final
                decision.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/demo"
                  className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium accent-bg"
                >
                  Explore the demo <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex h-12 items-center gap-1.5 text-sm"
                  style={{ color: "var(--trth-ink-dim)" }}
                >
                  See how it works <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <p
                className="mt-8 flex items-center gap-2 text-xs"
                style={{ color: "var(--trth-ink-mute)" }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                No account. No credentials. We give you the why — never certainty.
              </p>
            </div>

            <div className="lg:col-span-5">
              <RecommendationPreview />
            </div>
          </div>
        </section>

        {/* Statement */}
        <section className="border-y hairline">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
            <p className="serif text-[32px] leading-tight sm:text-[44px]">
              Most apps tell you what{" "}
              <em style={{ color: "var(--trth-ink-mute)" }}>might</em> happen.
              <br className="hidden sm:block" /> TRTH explains{" "}
              <span className="accent italic">why</span>.
            </p>
          </div>
        </section>

        {/* Platform */}
        <section id="platform" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <SectionHeader eyebrow="Platform" title="An intelligence layer for your property" />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl hairline border md:grid-cols-2 lg:grid-cols-3">
            <FeatureCell
              icon={Brain}
              title="Property Brain"
              body="A living model of your property — travel corridors, bedding, food, pressure, and the gaps in what you know."
            />
            <FeatureCell
              icon={ShieldCheck}
              title="Truth Score"
              body="Every recommendation carries a Truth Score: how well-supported the conclusion is, and where the evidence is weak."
            />
            <FeatureCell
              icon={Target}
              title="Hunt Evaluation"
              body="Score a planned hunt against wind, access, pressure, cameras, and history — with clear reasoning."
            />
            <FeatureCell
              icon={Camera}
              title="Camera Intelligence"
              body="Detections weighted by daylight, wind, and coverage — not just image counts."
            />
            <FeatureCell
              icon={ScrollText}
              title="Evidence-backed"
              body="See supporting evidence, conflicting evidence, and what could change the conclusion."
            />
            <FeatureCell
              icon={Sparkles}
              title="Ask TRTH"
              body="Ask about your property. Answers ground in your data — with confidence and caveats."
            />
          </div>
        </section>

        {/* How */}
        <section id="how" className="border-t hairline">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHeader eyebrow="How TRTH works" title="From fragmented data to a decision" />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <Step n="01" icon={MapPin} title="Map the property"
                body="Stands, cameras, bedding, food, water, access routes, and habitat — all in one place." />
              <Step n="02" icon={Wind} title="Layer the conditions"
                body="Wind, weather, pressure, moon, and camera activity — evaluated against your property." />
              <Step n="03" icon={Compass} title="Get the why"
                body="TRTH explains what it thinks, why, and what could change its mind." />
            </div>
          </div>
        </section>

        {/* Who */}
        <section id="who" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <SectionHeader eyebrow="Who it's for" title="Built for people who take the property seriously" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Experienced hunters",
              "Landowners",
              "Habitat managers",
              "Hunting clubs",
            ].map((r) => (
              <div key={r} className="card p-6">
                <div className="serif text-2xl">{r}</div>
                <div
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--trth-ink-dim)" }}
                >
                  Organize what you already know. Understand what you don't.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t hairline">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
            <h2 className="serif text-[44px] leading-tight sm:text-[64px]">
              We give you the <span className="accent italic">why</span>.
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed"
              style={{ color: "var(--trth-ink-dim)" }}
            >
              Walk through a fully populated demo property. No signup. No credentials.
            </p>
            <div className="mt-8">
              <Link
                to="/demo"
                className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium accent-bg"
              >
                Explore Black Ridge Farm <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t hairline">
          <div
            className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs sm:px-8"
            style={{ color: "var(--trth-ink-mute)" }}
          >
            <div className="serif text-base tracking-tight" style={{ color: "var(--trth-ink)" }}>
              TRTH
            </div>
            <span>© {year} TRTH · Decision support, not certainty.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <div
        className="text-[11px] uppercase tracking-[0.22em]"
        style={{ color: "var(--trth-ink-mute)" }}
      >
        {eyebrow}
      </div>
      <h2 className="serif mt-4 text-[36px] leading-[1.02] sm:text-[52px]">{title}</h2>
    </div>
  );
}

function FeatureCell({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div
      className="p-8"
      style={{ background: "var(--trth-surface)" }}
    >
      <Icon className="h-5 w-5 accent" />
      <div className="serif mt-6 text-2xl">{title}</div>
      <p
        className="mt-3 text-[14px] leading-relaxed"
        style={{ color: "var(--trth-ink-dim)" }}
      >
        {body}
      </p>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-7">
      <div className="flex items-center justify-between">
        <span
          className="serif text-sm kbd-num"
          style={{ color: "var(--trth-ink-mute)" }}
        >
          {n}
        </span>
        <Icon className="h-4 w-4 accent" />
      </div>
      <div className="serif mt-8 text-2xl">{title}</div>
      <p
        className="mt-3 text-[14px] leading-relaxed"
        style={{ color: "var(--trth-ink-dim)" }}
      >
        {body}
      </p>
    </div>
  );
}

function RecommendationPreview() {
  return (
    <div className="card relative overflow-hidden p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <div
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "var(--trth-ink-mute)" }}
        >
          Recommended tonight
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
          style={{ background: "rgba(214,255,91,0.10)", color: "var(--trth-accent)" }}
        >
          <CircleDot className="h-3 w-3" /> High confidence
        </span>
      </div>

      <h3 className="serif mt-5 text-[44px] leading-[0.95] sm:text-[52px]">Oak Ridge</h3>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
        <span className="serif italic text-xl accent">Excellent Opportunity</span>
        <span className="text-sm" style={{ color: "var(--trth-ink-mute)" }}>
          · 82<span className="text-xs">/100</span>
        </span>
      </div>

      <dl className="mt-7 grid grid-cols-3 gap-4">
        <div>
          <dt
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--trth-ink-mute)" }}
          >
            Window
          </dt>
          <dd className="serif mt-1.5 text-lg kbd-num">5:45–7:30</dd>
        </div>
        <div>
          <dt
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--trth-ink-mute)" }}
          >
            Wind
          </dt>
          <dd className="serif mt-1.5 text-lg kbd-num">N · 8</dd>
        </div>
        <div>
          <dt
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--trth-ink-mute)" }}
          >
            Confidence
          </dt>
          <dd className="serif mt-1.5 text-lg kbd-num">86%</dd>
        </div>
      </dl>

      <p
        className="serif mt-7 text-lg leading-snug"
        style={{ color: "var(--trth-ink)" }}
      >
        Daylight buck movement rising at Oak Ridge
        <span style={{ color: "var(--trth-ink-dim)" }}>
          {" "}· wind protects access · cold front on approach.
        </span>
      </p>
    </div>
  );
}
