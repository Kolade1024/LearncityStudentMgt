import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="focus-ring -ml-1 mb-5 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft weight="bold" className="h-4 w-4" />
      {label}
    </Link>
  );
}
