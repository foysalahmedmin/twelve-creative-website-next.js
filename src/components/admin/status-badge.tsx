import { cn } from "@/lib/utils";

type Tone = "neutral" | "positive" | "warning" | "danger" | "info";

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
  className?: string;
}

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border/60",
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ label, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
