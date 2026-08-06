import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Pill badge for quick trust statements — DesignRHF §12 "Trust Badge".
 *
 * `tone="onOrange"` inverts it for use inside the orange CTA block, where a
 * white-on-white pill would disappear.
 */
export function TrustBadge({
  icon: Icon,
  children,
  tone = "light",
  className,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  tone?: "light" | "onOrange";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium",
        tone === "onOrange"
          ? "border-white/35 bg-white/12 text-white"
          : "border-rhf-border bg-white text-rhf-brown",
        className,
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden
          className={cn(
            "size-4 shrink-0",
            tone === "onOrange" ? "text-white" : "text-rhf-orange",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

/** Small category/status chip used on cards — DesignRHF §12 "Badge Style". */
export function MenuBadge({
  children,
  tone = "cream",
  className,
}: {
  children: React.ReactNode;
  tone?: "cream" | "gold" | "green";
  className?: string;
}) {
  const tones = {
    cream: "bg-rhf-cream text-rhf-deep-orange",
    gold: "bg-rhf-gold/20 text-rhf-brown",
    green: "bg-rhf-green/15 text-rhf-green",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
