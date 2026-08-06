import {
  Baby,
  Briefcase,
  Coffee,
  GraduationCap,
  Heart,
  HeartHandshake,
  Package,
  Soup,
  UtensilsCrossed,
  type LucideProps,
} from "lucide-react";
import type { ReactNode } from "react";

/**
 * Category iconography — DesignRHF §10 (outline, rounded stroke).
 *
 * Categories store an icon *key* rather than a component so the value survives
 * a database round trip and can be picked from a dropdown in the round-2 admin
 * panel.
 *
 * The map holds render functions rather than component references on purpose:
 * looking a component up into a local variable and rendering it would create a
 * component during render, which React's lint rules correctly reject.
 */
type IconRenderer = (props: LucideProps) => ReactNode;

const ICON_RENDERERS: Record<string, IconRenderer> = {
  box: (props) => <Package {...props} />,
  utensils: (props) => <UtensilsCrossed {...props} />,
  soup: (props) => <Soup {...props} />,
  coffee: (props) => <Coffee {...props} />,
  briefcase: (props) => <Briefcase {...props} />,
  school: (props) => <GraduationCap {...props} />,
  hands: (props) => <HeartHandshake {...props} />,
  heart: (props) => <Heart {...props} />,
  baby: (props) => <Baby {...props} />,
};

const FALLBACK: IconRenderer = (props) => <UtensilsCrossed {...props} />;

/** Renders the icon for a stored category icon key. */
export function CategoryIcon({
  iconKey,
  ...props
}: { iconKey?: string } & LucideProps) {
  const render = (iconKey && ICON_RENDERERS[iconKey]) || FALLBACK;
  return render(props);
}

/**
 * Picks an icon from a free-text category name, used by the gallery and
 * placeholders where the category is a plain string rather than a record.
 */
export function CategoryNameIcon({
  name,
  ...props
}: { name?: string } & LucideProps) {
  return <CategoryIcon iconKey={iconKeyForName(name)} {...props} />;
}

function iconKeyForName(name?: string): string {
  if (!name) return "utensils";

  const normalized = name.toLowerCase();
  if (normalized.includes("snack")) return "box";
  if (normalized.includes("nasi")) return "utensils";
  if (normalized.includes("prasmanan")) return "soup";
  if (normalized.includes("coffee")) return "coffee";
  if (normalized.includes("dinas") || normalized.includes("event")) {
    return "briefcase";
  }
  if (normalized.includes("dapur") || normalized.includes("proses")) {
    return "soup";
  }

  return "utensils";
}
