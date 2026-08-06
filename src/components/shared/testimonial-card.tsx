import { Star } from "lucide-react";

import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Testimonial card — PRD §11.8, styled per DesignRHF §12. */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-lg border border-rhf-border bg-rhf-cream p-6">
      {testimonial.rating ? (
        <div
          className="flex gap-0.5"
          role="img"
          aria-label={`Penilaian ${testimonial.rating} dari 5`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              aria-hidden
              className={cn(
                "size-4",
                index < testimonial.rating!
                  ? "fill-rhf-gold text-rhf-gold"
                  : "text-rhf-border",
              )}
            />
          ))}
        </div>
      ) : null}

      <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-rhf-charcoal">
        &ldquo;{testimonial.message}&rdquo;
      </blockquote>

      <figcaption className="border-t border-rhf-border pt-4">
        <p className="font-heading text-sm font-semibold text-rhf-charcoal">
          {testimonial.customerName}
        </p>
        {testimonial.customerType ? (
          <p className="text-xs text-muted-foreground">
            {testimonial.customerType}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
