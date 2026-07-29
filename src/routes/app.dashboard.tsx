import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Wind, Thermometer, Gauge, Camera, Sunrise, Sunset, ArrowUpRight,
  ChevronRight, MapPin, Sparkles, CircleDot, ArrowRight,
} from "lucide-react";
import { useActiveProperty, useConditions, evaluateHunt } from "@/lib/freki-store";
import { LiveSharingBanner } from "@/components/property-safety";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — TRTH" },
      { name: "description", content: "Tonight's recommended stand, what changed today, and camera intelligence for your property." },
    ],
  }),
  component: Home,
});

/* ---------- helpers ---------- */

function opportunityLabel(score: number) {
  if (score >= 78) return "Excellent Opportunity";
  if (score >= 65) return "Strong Opportunity";
  if (score >= 50) return "Fair Opportunity";
  if (score >= 35) return "Marginal";
  return "Low Opportunity";
}
function trendWord(t: "rising" | "steady" | "falling") {
  return t === "falling" ? "Falling" : t === "rising" ? "Rising" : "Steady";
}

/* ---------- page ---------- */

function Home() {
  const property = useActiveProperty();
  const conditions = useConditions();

  const rec = useMemo(
    () => evaluateHunt({ property, conditions }),
    [property, conditions],
  );

  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="trth-scope">
      <LiveSharingBanner />
      <div className="topo-veil">
        <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-28 sm:px-6 sm:pt-12 lg:pt-16">
          <Header dateLabel={dateLabel} propertyName={property.name} />
          <PrimaryRecommendation rec={rec} conditions={conditions} />
          <StartHunt />
          <WhatChanged property={property} conditions={conditions} />
          <CameraIntelligence property={property} />
          <WeatherSummary conditions={conditions} />
          <Insight rec={rec} conditions={conditions} />
        </div>
      </div>
    </div>
  );
}

/* ---------- sections ---------- */

function Header({ dateLabel, propertyName }: { dateLabel: string; propertyName: string }) {
  return (
    <header className="mb-8 flex items-end justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--trth-ink-mute)" }}>
          TRTH · {dateLabel}
        </div>
        <h1 className="serif mt-3 text-[44px] leading-[0.95] sm:text-[56px]">
          Tonight's read.
        </h1>
        <div className="mt-2 text-sm" style={{ color: "var(--trth-ink-dim)" }}>
          {propertyName}
        </div>
      </div>
      <Link
        to="/app/properties"
        aria-label="Switch property"
        className="hidden sm:inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs hairline border"
        style={{ color: "var(--trth-ink-dim)" }}
      >
        Switch property <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </header>
  );
}

function PrimaryRecommendation({
  rec,
  conditions,
}: {
  rec: ReturnType<typeof evaluateHunt>;
  conditions: ReturnType<typeof useConditions>;
}) {
  const stand = rec.recommendedStand;
  const opportunity = opportunityLabel(rec.score);
  const [primary, ...rest] = rec.supporting;

  return (
    <section className="card relative overflow-hidden p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--trth-ink-mute)" }}>
          Recommended tonight
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
          style={{ background: "rgba(214,255,91,0.10)", color: "var(--trth-accent)" }}
        >
          <CircleDot className="h-3 w-3" /> {rec.confidence} confidence
        </span>
      </div>

      <h2 className="serif mt-5 text-[52px] leading-[0.95] sm:text-[68px]">
        {stand?.name ?? "No stand yet"}
      </h2>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="serif italic text-2xl accent">{opportunity}</span>
        <span className="text-sm" style={{ color: "var(--trth-ink-mute)" }}>
          · {rec.score}<span className="text-xs">/100</span>
        </span>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-y-5 gap-x-6 sm:grid-cols-3">
        <Fact label="Hunt window" value={rec.window} />
        <Fact label="Wind" value={`${conditions.windDir} · ${conditions.windMph} mph`} />
        <Fact label="Confidence" value={`${rec.confidencePct}%`} />
      </dl>

      {primary && (
        <p className="serif mt-8 text-xl leading-snug" style={{ color: "var(--trth-ink)" }}>
          {primary}
          {rest.length > 0 && (
            <span style={{ color: "var(--trth-ink-dim)" }}> {rest.slice(0, 2).map((r, i) => (
              <span key={i}> · {r.toLowerCase()}</span>
            ))}</span>
          )}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/app/evaluation"
          className="inline-flex items-center gap-1.5 text-sm accent hover:opacity-80"
        >
          See the full read <ArrowUpRight className="h-4 w-4" />
        </Link>
        {stand && (
          <Link
            to="/app/map"
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: "var(--trth-ink-dim)" }}
          >
            <MapPin className="h-3.5 w-3.5" /> On map
          </Link>
        )}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--trth-ink-mute)" }}>
        {label}
      </dt>
      <dd className="serif mt-1.5 text-xl kbd-num">{value}</dd>
    </div>
  );
}

function StartHunt() {
  return (
    <div className="mt-6">
      <Link
        to="/app/evaluation"
        className="group flex h-16 w-full items-center justify-between rounded-2xl px-6 accent-bg font-medium transition-transform active:scale-[0.99]"
      >
        <span className="text-base">Start Hunt</span>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function WhatChanged({
  property,
  conditions,
}: {
  property: ReturnType<typeof useActiveProperty>;
  conditions: ReturnType<typeof useConditions>;
}) {
  // Derive plain-language change lines from live data.
  const topCam = [...property.cameras].sort((a, b) => b.detections24h - a.detections24h)[0];
  const above = property.cameras.find((c) => c.targetActivity === "Above");
  const lines: string[] = [];
  if (above) lines.push(`Daylight buck activity increased at ${above.name}.`);
  if (topCam) lines.push(`${topCam.name} leads the property with ${topCam.detections24h} detections in 24 hours.`);
  lines.push(`${conditions.windDir} wind at ${conditions.windMph} mph — pressure ${trendWord(conditions.pressureTrend).toLowerCase()} at ${conditions.pressureInHg}".`);
  if (conditions.pressureTrend === "falling") lines.push("Front moving through — expect a movement bump before it settles.");
  const latestObs = property.observations[0];
  if (latestObs) lines.push(`New sign near ${latestObs.location}: ${latestObs.notes.split(".")[0]}.`);

  return (
    <Section title="What changed today">
      <ul className="card divide-line px-6">
        {lines.slice(0, 4).map((l, i) => (
          <li key={i} className="flex items-start gap-3 py-4 text-[15px] leading-snug">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--trth-accent)" }} />
            <span>{l}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function CameraIntelligence({ property }: { property: ReturnType<typeof useActiveProperty> }) {
  const cams = [...property.cameras]
    .sort((a, b) => b.detections24h - a.detections24h)
    .slice(0, 3);

  return (
    <Section title="Camera intelligence" action={{ label: "All cameras", to: "/app/cameras" }}>
      <div className="grid gap-3">
        {cams.map((c) => {
          const insights: string[] = [];
          if (c.targetActivity === "Above") insights.push("Daylight activity increasing");
          else if (c.targetActivity === "Below") insights.push("Movement suppressed vs baseline");
          else insights.push("Movement holding at baseline");
          insights.push(`${Math.round(c.daylightPct * 100)}% of activity in daylight`);
          if (c.status === "Offline") insights.push("Camera offline — coverage gap");
          else if (c.status === "Low battery") insights.push("Battery low — swap soon");

          return (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="serif text-2xl">{c.name}</div>
                  <div className="mt-1 text-xs" style={{ color: "var(--trth-ink-mute)" }}>
                    <Camera className="mr-1 inline h-3 w-3" />
                    {c.detections24h} detections · last checked {c.lastCheck}
                  </div>
                </div>
                {c.status === "Online" ? (
                  <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--trth-accent)" }}>Live</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--trth-ink-mute)" }}>{c.status}</span>
                )}
              </div>
              <ul className="mt-4 space-y-1.5 text-[14px]" style={{ color: "var(--trth-ink-dim)" }}>
                {insights.map((i, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--trth-ink-mute)" }} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function WeatherSummary({ conditions }: { conditions: ReturnType<typeof useConditions> }) {
  return (
    <Section title="Weather">
      <div className="card grid grid-cols-2 sm:grid-cols-4">
        <WeatherCell icon={Wind} label="Wind" value={`${conditions.windDir} ${conditions.windMph}`} sub="mph" />
        <WeatherCell icon={Thermometer} label="Temp" value={`${conditions.tempF}°`} sub={conditions.tempF < 45 ? "cool" : conditions.tempF > 70 ? "warm" : "mild"} />
        <WeatherCell icon={Gauge} label="Pressure" value={`${conditions.pressureInHg}"`} sub={trendWord(conditions.pressureTrend)} />
        <WeatherCell
          icon={conditions.timeOfDay === "Morning" ? Sunrise : Sunset}
          label={conditions.timeOfDay === "Morning" ? "Sunrise" : "Sunset"}
          value={conditions.timeOfDay === "Morning" ? "6:38" : "7:12"}
          sub={conditions.timeOfDay}
        />
      </div>
    </Section>
  );
}

function WeatherCell({
  icon: Icon, label, value, sub,
}: {
  icon: typeof Wind; label: string; value: string; sub: string;
}) {
  return (
    <div className="p-5 border-t border-l first:border-l-0 first:border-t-0 sm:border-t-0 sm:[&:nth-child(3)]:border-t-0 [&:nth-child(2)]:border-t-0 hairline">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--trth-ink-mute)" }}>
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="serif mt-2 text-3xl kbd-num">{value}</div>
      <div className="mt-0.5 text-xs" style={{ color: "var(--trth-ink-dim)" }}>{sub}</div>
    </div>
  );
}

function Insight({
  rec,
  conditions,
}: {
  rec: ReturnType<typeof evaluateHunt>;
  conditions: ReturnType<typeof useConditions>;
}) {
  // Only show when it could materially change the decision.
  let text: string | null = null;
  if (rec.conflicting.length && rec.confidencePct < 65) {
    text = rec.conflicting[0];
  } else if (conditions.pressureTrend === "falling" && conditions.tempF < 45 && rec.score >= 60) {
    text = "The front + cool temps line up with your best historical windows. Get in early.";
  } else if (rec.changers[0] && rec.confidencePct < 75) {
    text = rec.changers[0];
  }
  if (!text) return null;

  return (
    <Section title="Insight">
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-4 w-4 shrink-0 accent" />
          <p className="serif text-[19px] leading-snug">{text}</p>
        </div>
      </div>
    </Section>
  );
}

function Section({
  title, action, children,
}: {
  title: string;
  action?: { label: string; to: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <h3 className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--trth-ink-mute)" }}>
          {title}
        </h3>
        {action && (
          <Link to={action.to} className="inline-flex items-center gap-1 text-xs accent hover:opacity-80">
            {action.label} <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
