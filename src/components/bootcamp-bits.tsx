import { GraduationCap } from "@phosphor-icons/react/dist/ssr";
import type { Bootcamp } from "@/lib/types";
import { avatarGradient, bootcampName, cn, humanize } from "@/lib/utils";
import { Badge } from "@/components/ui";

/** A small gradient tile used as a bootcamp's avatar. */
export function BootcampAvatar({
  seed,
  size = 44,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-md)] text-white",
        className,
      )}
      style={{ width: size, height: size, background: avatarGradient(seed) }}
      aria-hidden
    >
      <GraduationCap weight="fill" style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
}

/** Colored badge for a bootcamp's delivery type (Online / Onsite / Hybrid). */
export function TypeBadge({ type }: { type: string }) {
  const palette: Record<string, { bg: string; text: string; dot: string }> = {
    online: { bg: "#e7f6ef", text: "#0d9f73", dot: "#10b981" },
    onsite: { bg: "#eef4ff", text: "#3056d3", dot: "#3056d3" },
    hybrid: { bg: "#fdf6e3", text: "#9a6b00", dot: "#b8860b" },
  };
  const style = palette[type?.toLowerCase()] ?? {
    bg: "var(--surface-muted)",
    text: "var(--muted-foreground)",
    dot: "var(--muted-foreground)",
  };
  return (
    <Badge bg={style.bg} text={style.text} dot={style.dot}>
      {humanize(type)}
    </Badge>
  );
}

export function bootcampLabel(b: Bootcamp): string {
  return bootcampName(b.name);
}
