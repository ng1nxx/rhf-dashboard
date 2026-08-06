import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { FoodImage } from "@/components/shared/food-placeholder";
import { MenuBadge } from "@/components/shared/trust-badge";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { buildMenuInquiry } from "@/lib/whatsapp";

/**
 * Catalogue card — PRD §11.5, styled per DesignRHF §12 "Card Menu".
 *
 * The card title carries a stretched link so the whole card is one click
 * target, while the WhatsApp button is lifted above it. That keeps a single
 * link in the accessibility tree instead of nesting interactive elements.
 */
export function MenuCard({
  item,
  categories,
  whatsappNumber,
  priority = false,
}: {
  item: MenuItem;
  categories: MenuCategory[];
  whatsappNumber: string;
  priority?: boolean;
}) {
  const primaryCategory = categories.find((c) => c.id === item.categoryIds[0]);
  const highlights = item.packageItems?.slice(0, 3) ?? [];

  return (
    <article className="card-lift group relative flex w-full flex-col overflow-hidden rounded-lg border border-rhf-border bg-white shadow-rhf-sm">
      <div className="relative aspect-4/3 overflow-hidden bg-rhf-cream">
        <FoodImage
          src={item.imageUrl}
          alt={`${item.name} dari RHF Catering & Snack Box`}
          category={primaryCategory?.name}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {item.tags && item.tags.length > 0 ? (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map((tag) => (
              <MenuBadge
                key={tag}
                tone={tag === "Best Seller" ? "gold" : "cream"}
                className="shadow-rhf-sm"
              >
                {tag}
              </MenuBadge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {primaryCategory ? (
          <span className="text-xs font-semibold tracking-[0.12em] text-rhf-brown/80 uppercase">
            {primaryCategory.name}
          </span>
        ) : null}

        <h3 className="font-heading text-lg font-bold text-rhf-charcoal">
          <Link
            href={`/menu/${item.slug}`}
            className="after:absolute after:inset-0 after:content-[''] group-hover:text-rhf-deep-orange"
          >
            {item.name}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.shortDescription}
        </p>

        {highlights.length > 0 ? (
          <ul className="flex flex-col gap-1.5 text-sm text-rhf-charcoal/85">
            {highlights.map((entry) => (
              <li key={entry} className="flex items-start gap-2">
                <Check
                  aria-hidden
                  className="mt-1 size-3.5 shrink-0 text-rhf-green"
                />
                <span>{entry}</span>
              </li>
            ))}
            {item.packageItems && item.packageItems.length > 3 ? (
              <li className="pl-5.5 text-xs text-muted-foreground">
                +{item.packageItems.length - 3} item lainnya
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-col gap-4 pt-2">
          <div className="border-t border-rhf-border pt-4">
            <p className="font-heading text-lg font-bold text-rhf-deep-orange">
              {item.priceLabel}
            </p>
            {item.minOrder ? (
              <p className="text-xs text-muted-foreground">
                Minimal order: {item.minOrder}
              </p>
            ) : null}
          </div>

          {/* Raised above the stretched link so the button stays clickable. */}
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message={buildMenuInquiry(item)}
            size="rhf"
            showIcon={false}
            className="relative z-10 w-full"
          >
            <ShoppingBag aria-hidden />
            Pesan Paket Ini
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
