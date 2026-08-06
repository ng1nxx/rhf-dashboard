import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The RHF logo lockup — DesignRHF §6.
 *
 * The source artwork is a square with a light backdrop around the orange disc,
 * so it is masked to a circle. That matches the logo's actual shape and keeps
 * it clean on the cream and charcoal backgrounds it sits on.
 */
export function LogoMark({
  size = 48,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-full bg-rhf-orange",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-rhf.png"
        alt=""
        width={size * 2}
        height={size * 2}
        priority={priority}
        aria-hidden
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function LogoLockup({
  size = 48,
  href = "/",
  tone = "light",
  priority = false,
  className,
}: {
  size?: number;
  href?: string | null;
  /** `light` for cream/white backgrounds, `dark` for the charcoal footer. */
  tone?: "light" | "dark";
  priority?: boolean;
  className?: string;
}) {
  const content = (
    <>
      <LogoMark size={size} priority={priority} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            "font-heading text-[0.9375rem] leading-tight font-bold sm:text-base",
            tone === "dark" ? "text-rhf-cream" : "text-rhf-charcoal",
          )}
        >
          RHF Catering
        </span>
        <span
          className={cn(
            "text-2xs tracking-[0.14em] uppercase",
            tone === "dark" ? "text-rhf-gold" : "text-rhf-brown",
          )}
        >
          &amp; Snack Box
        </span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span className={cn("flex items-center gap-2.5", className)}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="RHF Catering & Snack Box — ke beranda"
    >
      {content}
    </Link>
  );
}
