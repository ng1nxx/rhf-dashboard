import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Page header used across the inner routes: eyebrow, H1, description, and an
 * optional breadcrumb. Keeps the top of every non-home page consistent so the
 * site reads as one piece.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="border-b border-rhf-border bg-white py-10 lg:py-14">
      <div className="container-rhf">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {breadcrumb.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronRight aria-hidden className="size-3.5 shrink-0" />
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-rhf-deep-orange"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-rhf-charcoal">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <span className="text-xs font-semibold tracking-[0.16em] text-rhf-deep-orange uppercase">
            {eyebrow}
          </span>
        ) : null}

        <h1 className="mt-2 font-heading text-[2rem] font-extrabold text-rhf-charcoal sm:text-[2.5rem] lg:text-[2.75rem]">
          {title}
        </h1>

        {description ? (
          <p className="mt-4 max-w-[45rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
