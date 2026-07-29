import { confidenceFromScore } from "@/lib/freki-data";
import { cn } from "@/lib/utils";
import { Info, TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

interface TruthScoreProps {
  score: number;
  label?: string;
  supporting?: string[];
  conflicting?: string[];
  uncertainty?: string;
  compact?: boolean;
}

export function TruthScore({ score, label = "Truth Score", supporting = [], conflicting = [], uncertainty, compact }: TruthScoreProps) {
  const conf = confidenceFromScore(score);
  const color =
    score >= 70 ? "text-[var(--forest)]" :
    score >= 50 ? "text-[var(--bronze)]" :
    "text-destructive";

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium hover:bg-muted transition">
            <span className={cn("font-semibold tabular-nums", color)}>{score}</span>
            <span className="text-muted-foreground">· {conf}</span>
            <Info className="h-3 w-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <TruthContent score={score} label={label} supporting={supporting} conflicting={conflicting} uncertainty={uncertainty} />
      </Popover>
    );
  }

  return (
    <div className="surface-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            {label}
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="About Truth Score">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs">
                Truth Score measures how well-supported a conclusion is — evidence quality,
                quantity, recency, coverage, and conflict. It is not a certainty score.
              </PopoverContent>
            </Popover>
          </div>
          <div className={cn("mt-1 font-display text-4xl font-semibold tabular-nums", color)}>
            {score}
            <span className="ml-1 text-base text-muted-foreground">/100</span>
          </div>
          <div className="mt-0.5 text-sm text-muted-foreground">{conf} confidence</div>
        </div>
      </div>
      <Progress value={score} className="mt-3 h-1.5" />

      {(supporting.length > 0 || conflicting.length > 0 || uncertainty) && (
        <div className="mt-4 grid gap-3 text-sm">
          {supporting.length > 0 && (
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[var(--forest)]">
                <TrendingUp className="h-3.5 w-3.5" /> Supporting evidence
              </div>
              <ul className="space-y-1 text-foreground/90">
                {supporting.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--forest)]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {conflicting.length > 0 && (
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-destructive">
                <TrendingDown className="h-3.5 w-3.5" /> Conflicting evidence
              </div>
              <ul className="space-y-1 text-foreground/90">
                {conflicting.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {uncertainty && (
            <div className="rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Main uncertainty: </span>
              {uncertainty}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TruthContent({ score, label, supporting, conflicting, uncertainty }: TruthScoreProps) {
  const conf = confidenceFromScore(score);
  return (
    <PopoverContent className="w-80">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-semibold tabular-nums">{score}</div>
      <div className="text-xs text-muted-foreground">{conf} confidence</div>
      <Progress value={score} className="mt-2 h-1.5" />
      {supporting && supporting.length > 0 && (
        <div className="mt-3 text-xs">
          <div className="font-medium text-[var(--forest)]">Supporting</div>
          <ul className="mt-1 space-y-0.5 text-foreground/90">
            {supporting.slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>
      )}
      {conflicting && conflicting.length > 0 && (
        <div className="mt-2 text-xs">
          <div className="font-medium text-destructive">Conflicting</div>
          <ul className="mt-1 space-y-0.5 text-foreground/90">
            {conflicting.slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>
      )}
      {uncertainty && <div className="mt-2 text-xs text-muted-foreground">{uncertainty}</div>}
    </PopoverContent>
  );
}
