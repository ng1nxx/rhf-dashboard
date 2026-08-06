import Image from "next/image";

import { CategoryNameIcon } from "@/components/shared/category-icon";
import { cn } from "@/lib/utils";

/**
 * Stand-in artwork for packages and gallery slots that have no photograph yet.
 *
 * PRD §14 requires real photography before production and DesignRHF §11 asks
 * for natural, unfiltered food shots — so stock imagery is the wrong filler
 * here. This draws a warm gradient panel with the category's outline icon and
 * a steam motif (DesignRHF §8) instead: on-brand, no network request, and
 * unmistakably not a photo, so it cannot quietly ship to production.
 */
export function FoodPlaceholder({
  category,
  label,
  className,
}: {
  category?: string;
  /** Overrides the caption; defaults to the category name. */
  label?: string;
  className?: string;
}) {
  const caption = label ?? category;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-linear-to-br from-rhf-cream via-[#FDE7CE] to-[#F9D2A8]",
        className,
      )}
      role="presentation"
    >
      {/* Steam motif — DesignRHF §8 asks for minimal vapour/flame patterning. */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full text-rhf-orange/12"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M40 190c0-30 18-38 18-62s-18-24-18-48 18-30 18-52"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M160 190c0-34 16-40 16-62s-16-26-16-48 16-28 16-52"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="100" cy="30" r="52" stroke="currentColor" strokeWidth="8" />
      </svg>

      <CategoryNameIcon
        name={category}
        aria-hidden
        strokeWidth={1.25}
        className="relative size-[22%] max-h-20 min-h-9 min-w-9 max-w-20 text-rhf-deep-orange/55"
      />

      {caption ? (
        <span className="relative max-w-[85%] truncate px-2 text-center text-xs font-semibold tracking-[0.12em] text-rhf-brown/70 uppercase">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Renders a real photo when the record has one and falls back to the
 * placeholder when it does not.
 *
 * Every image slot on the site goes through this, so filling in photography in
 * round 2 means setting `imageUrl` in the database — no template edits.
 */
export function FoodImage({
  src,
  alt,
  category,
  className,
  sizes,
  priority = false,
}: {
  src?: string;
  /** Required whenever `src` is set — DesignRHF §27 wants alt text on all food photos. */
  alt: string;
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return <FoodPlaceholder category={category} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
