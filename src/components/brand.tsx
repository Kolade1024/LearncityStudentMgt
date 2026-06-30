import Image from "next/image";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Square gradient icon — used for compact spots like loading states. */
export function LearncityMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[12px] text-white",
        className,
      )}
      style={{ background: "linear-gradient(135deg, #10b981, #50b347)" }}
    >
      <GraduationCap weight="fill" className="h-[58%] w-[58%]" />
    </span>
  );
}

/**
 * Full LearnCity wordmark lockup. Size it via `className` height
 * (e.g. "h-7"); width scales automatically.
 */
export function LearncityLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/learncityLogo.webp"
      alt="LearnCity"
      width={4688}
      height={1000}
      priority
      className={cn("w-auto", className || "h-8")}
    />
  );
}
