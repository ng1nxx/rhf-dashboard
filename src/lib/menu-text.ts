/**
 * The two customer-facing strings that used to be columns.
 *
 * `shortDescription` and `priceLabel` were each stored alongside the field they
 * duplicated, which meant an editor could change the price and leave the label
 * reading the old one. They are computed from the single source now, so that
 * cannot happen — see the migration `20260805120000_merge_description_and_price`.
 *
 * No "server-only" here: the catalogue sorts and filters on the client, so
 * these run on both sides.
 */

/** How much of the description the catalogue card shows. */
export const EXCERPT_MAX_CHARS = 160;

/**
 * Opening of a description, cut where a reader would stop rather than at a
 * fixed offset.
 *
 * Whole sentences are preferred: a card ending mid-clause reads like the text
 * is broken rather than abbreviated. Only when the very first sentence is
 * already too long does it fall back to a word boundary and an ellipsis.
 */
export function excerpt(text: string, max = EXCERPT_MAX_CHARS): string {
  const clean = text.trim().replace(/\s+/g, " ");

  if (clean.length <= max) return clean;

  const sentences = clean.split(/(?<=[.!?])\s+/);
  let taken = "";

  for (const sentence of sentences) {
    const next = taken ? `${taken} ${sentence}` : sentence;
    if (next.length > max) break;
    taken = next;
  }

  if (taken) return taken;

  // First sentence alone overruns: cut at the last space that fits so no word
  // is sliced in half.
  const clipped = clean.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.]$/, "")}…`;
}

/**
 * The part of a description the excerpt has not already shown.
 *
 * The detail page prints the excerpt in its header and the rest under "Tentang
 * paket ini". Without this the opening sentence appeared twice on one page —
 * which is exactly the padding merging the two columns was meant to remove.
 *
 * Returns "" when the whole description already fits in the excerpt, and the
 * caller hides the block rather than rendering an empty card.
 */
export function descriptionBody(description: string): string {
  const clean = description.trim().replace(/\s+/g, " ");
  const lead = excerpt(clean);

  // A clipped excerpt ends in an ellipsis and is not a literal prefix, so
  // nothing can be safely removed — show the description whole.
  if (!clean.startsWith(lead)) return clean;

  return clean.slice(lead.length).trim();
}

/**
 * What the customer reads where a price is shown — the card, the detail page,
 * and the WhatsApp order message.
 *
 * "Mulai" is deliberate: every figure in this catalogue is a starting price
 * that varies with the menu chosen, and PRD §13.3 records that the final
 * numbers are still being settled with the owner.
 */
export function priceLabel(
  price: number | null | undefined,
  unit: string | null | undefined,
): string {
  if (price === null || price === undefined) return "Hubungi Admin";

  const formatted = new Intl.NumberFormat("id-ID").format(price);

  return unit ? `Mulai Rp${formatted}/${unit}` : `Mulai Rp${formatted}`;
}

/** Units a price can be quoted in; the admin form offers exactly these. */
export const PRICE_UNITS = ["box", "pax"] as const;
