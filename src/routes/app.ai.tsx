import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TruthScore } from "@/components/truth-score";
import { FrekiMark } from "@/components/freki-logo";

export const Route = createFileRoute("/app/ai")({
  head: () => ({
    meta: [
      { title: "Ask Freki — AI Assistant" },
      { name: "description", content: "A property-aware AI analyst for your hunting property." },
    ],
  }),
  component: Ask,
});

const suggestions = [
  "Where should I hunt tomorrow evening?",
  "Which cameras are showing the most daylight activity?",
  "What is the safest access route with a southwest wind?",
  "What does Freki know about the eastern ridge?",
  "Which conclusions have weak evidence?",
  "Compare North Funnel and Oak Bench.",
  "How has hunting pressure affected movement?",
];

type Msg = {
  role: "user" | "assistant";
  content: string;
  reasoning?: string[];
  supporting?: string[];
  conflicting?: string[];
  confidence?: number;
  next?: string;
};

function mockAnswer(q: string): Msg {
  const l = q.toLowerCase();
  if (l.includes("tomorrow") || l.includes("evening") || l.includes("where should")) {
    return {
      role: "assistant",
      content: "North Funnel is the strongest evening option tomorrow, roughly the final 90 minutes of daylight. Forecast wind is NW 7–10, which carries scent away from the marsh bedding, and the last four days show daylight buck activity above baseline at that camera.",
      reasoning: ["Wind fit is strong for North Funnel", "Daylight camera activity above baseline for 4 days", "Post-front pressure trend favors movement"],
      supporting: ["11 recent daylight detections at North Funnel", "Consistent pattern across last 3 cold fronts"],
      conflicting: ["East Ridge camera offline — alternate movement possible", "Access route passes within 110 yards of marsh bedding"],
      confidence: 74,
      next: "Enter by 3:30 PM to reduce bedding disturbance risk.",
    };
  }
  if (l.includes("daylight activity") || l.includes("cameras")) {
    return {
      role: "assistant",
      content: "West Field, North Funnel, and Oak Bench show the strongest daylight activity this week. West Field is highest at 55% daylight share, though most detections are does. North Funnel has the most daylight buck detections.",
      supporting: ["West Field: 55% daylight, 7 detections", "North Funnel: 42% daylight, 14 detections (incl. 4 buck)", "Oak Bench: 48% daylight, 6 detections"],
      conflicting: ["East Ridge camera offline — no data"],
      confidence: 82,
      next: "Review the North Funnel gallery for the mature 10-point.",
    };
  }
  if (l.includes("southwest") || l.includes("access")) {
    return {
      role: "assistant",
      content: "With a southwest wind, the North two-track and West field-edge access remain clean. South Gate becomes risky — scent will drift toward the central bedding and likely the marsh-edge staging area.",
      supporting: ["Bedding zones sit NE of South Gate", "Prevailing SW wind carries scent along the corridor"],
      conflicting: ["Two prior tests with SW wind did not record disturbance — small sample"],
      confidence: 68,
      next: "Use the North two-track and hunt Hidden Plot or Oak Bench.",
    };
  }
  if (l.includes("eastern ridge") || l.includes("east ridge")) {
    return {
      role: "assistant",
      content: "Freki knows less about the East Ridge than any other area. The camera has been offline for 3 days, and there are no recent field observations from that quadrant. There is a plausible alternate bedding pocket there, but no confirming evidence.",
      supporting: ["Historical rub line documented in October", "Terrain and cover match typical bedding profile"],
      conflicting: ["No camera coverage", "No sightings in the last 30 days"],
      confidence: 32,
      next: "Redeploy the East Ridge camera; scout the ridge saddle.",
    };
  }
  if (l.includes("weak evidence") || l.includes("uncertain")) {
    return {
      role: "assistant",
      content: "Three conclusions currently have weak or partial evidence: the East Ridge bedding hypothesis, the SW-wind contamination model for South Gate, and the buck-shift claim from Marsh Edge to interior pines.",
      confidence: 45,
      next: "Prioritize observations on the east ridge and lower creek crossing.",
    };
  }
  if (l.includes("compare") && l.includes("oak")) {
    return {
      role: "assistant",
      content: "North Funnel wins tonight on wind fit and recent daylight buck activity. Oak Bench has stronger long-term white-oak feeding sign but a marginal wind — a west wind would flip the comparison.",
      supporting: ["North Funnel: NW fit, 4 daylight buck detections this week", "Oak Bench: active scrape line, historically strong Nov mornings"],
      conflicting: ["Oak Bench camera coverage is narrower than North Funnel's"],
      confidence: 71,
    };
  }
  if (l.includes("pressure")) {
    return {
      role: "assistant",
      content: "The Nov 6 South Gate sit correlated with a drop in daylight detections at the closest two cameras for 48 hours after. Movement recovered by Nov 9. The best-attended sits so far this season have followed 3+ days of low property pressure.",
      confidence: 66,
    };
  }
  return {
    role: "assistant",
    content: "I don't have a strong answer for that yet. Try one of the suggested questions, or add an observation so I can learn more about the property.",
    confidence: 30,
  };
}

function Ask() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "I'm Freki. I can reason about Black Ridge Farm's cameras, observations, hunt history, and current conditions. Ask me something — I'll show my evidence." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, mockAnswer(text)]);
    }, 400);
  }

  return (
    <>
      <PageHeader
        title="Ask Freki"
        description="A property analyst — not a chatbot. Every answer shows its evidence."
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="surface-panel flex flex-col min-h-[60dvh]">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
                  {m.role === "assistant" && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar text-[var(--bronze)]">
                      <FrekiMark className="h-4 w-4 text-[var(--bronze)]" />
                    </div>
                  )}
                  <div className={`max-w-2xl ${m.role === "user" ? "rounded-2xl bg-foreground text-background px-4 py-2 text-sm" : "space-y-2"}`}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                    {m.role === "assistant" && (m.supporting || m.conflicting) && (
                      <TruthScore
                        score={m.confidence ?? 60}
                        supporting={m.supporting}
                        conflicting={m.conflicting}
                        compact
                      />
                    )}
                    {m.next && (
                      <div className="rounded-md border border-border p-2 text-xs">
                        <span className="font-medium text-[var(--bronze)]">Next action: </span>{m.next}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-border p-3 flex gap-2"
            >
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about the property, cameras, or conditions…" />
              <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
            </form>
            <div className="border-t border-border p-3 text-[11px] text-muted-foreground flex items-start gap-1.5">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              Freki provides decision support, not certainty. Wildlife behavior is inherently variable.
            </div>
          </div>

          <aside className="space-y-3">
            <div className="surface-panel p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Try asking</div>
              <div className="mt-2 space-y-1.5">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="w-full rounded-md border border-border px-3 py-2 text-left text-xs hover:bg-muted transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
