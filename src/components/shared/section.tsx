import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Section wrapper carrying the vertical rhythm from DesignRHF §7 and the
 * background rotation that keeps the 60/30/10 colour ratio (§4) structural
 * rather than a matter of remembering to alternate by hand.
 *
 * `tone="orange"` is the full-bleed CTA block from §23 — at most one per page.
 */
export function Section({
  children,
  tone = "cream",
  className,
  id,
  ...props
}: {
  children: ReactNode;
  tone?: "cream" | "white" | "soft" | "orange" | "charcoal";
  className?: string;
  id?: string;
} & React.ComponentProps<"section">) {
  const tones = {
    cream: "bg-rhf-cream text-rhf-charcoal",
    white: "bg-white text-rhf-charcoal",
    soft: "bg-rhf-soft-gray text-rhf-charcoal",
    orange: "bg-rhf-orange text-white",
    charcoal: "bg-rhf-charcoal text-rhf-cream",
  };

  return (
    <section
      id={id}
      className={cn("section-y", tones[tone], className)}
      {...props}
    >
      <div className="container-rhf">{children}</div>
    </section>
  );
}

/**
 * Section heading block. `align="center"` is the default because most sections
 * on the site are centred; the eyebrow gives the small uppercase label from
 * DesignRHF §5.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  tone?: "light" | "onOrange";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-xs font-semibold tracking-[0.16em] uppercase",
            tone === "onOrange" ? "text-white/85" : "text-rhf-deep-orange",
          )}
        >
          {eyebrow}
        </span>
      ) : null}

      <Heading
        className={cn(
          "text-[1.75rem] font-bold sm:text-[2rem] lg:text-[2.5rem]",
          tone === "onOrange" && "text-white",
        )}
      >
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            "max-w-[45rem] text-[1.0625rem]",
            align === "center" && "mx-auto",
            tone === "onOrange" ? "text-white/90" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
