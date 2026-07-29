import { cn } from "@/lib/utils";

// Abstract Freki mark: a stylized track / directional glyph blending
// a wolf muzzle silhouette with a topographic compass point.
export function FrekiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-6 w-6", className)} fill="none" aria-hidden="true">
      <path
        d="M16 3 L27 27 L16 21 L5 27 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M16 12 L16 21"
        stroke="var(--bronze)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9" r="1.6" fill="var(--bronze)" />
    </svg>
  );
}

export function FrekiWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FrekiMark />
      <span className="font-display text-xl font-semibold tracking-tight">Freki</span>
    </div>
  );
}
