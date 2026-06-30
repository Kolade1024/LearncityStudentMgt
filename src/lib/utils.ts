/** Tiny classnames joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** A display-friendly bootcamp name, falling back when the API returns null. */
export function bootcampName(name: string | null | undefined): string {
  return name?.trim() || "Untitled bootcamp";
}

/** "VirtualAssistant" -> "Virtual Assistant", "Online" -> "Online". */
export function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Initials for an avatar tile, from a bootcamp name or email. */
export function initialsFrom(seed: string): string {
  const cleaned = seed.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Deterministic brand-family gradient from a seed string. */
export function avatarGradient(seed: string): string {
  const palettes = [
    "linear-gradient(135deg, #10b981, #50b347)",
    "linear-gradient(135deg, #0d9f73, #16a34a)",
    "linear-gradient(135deg, #14b8a6, #10b981)",
    "linear-gradient(135deg, #22c55e, #50b347)",
    "linear-gradient(135deg, #0ea5a0, #34d399)",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return palettes[Math.abs(h) % palettes.length];
}
