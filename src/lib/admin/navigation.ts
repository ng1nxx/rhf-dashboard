import {
  Building2,
  HelpCircle,
  Images,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Tags,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * Admin navigation — the eight destinations of PRD §12.
 *
 * The whole list ships from stage 3, before most of the pages exist. Showing
 * the finished shape gives the owner a map of what the panel will do, and it
 * means stages 4–5 only add pages rather than also rearranging navigation.
 *
 * `ready: false` items must never render as links. A destination that 404s is
 * worse than one that is visibly not built yet.
 */
export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** False until the page behind it exists. */
  ready: boolean;
  /** Hidden from EDITOR — see `requireAdmin()` in lib/auth/dal.ts. */
  adminOnly?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    ready: true,
  },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, ready: true },
  { href: "/admin/kategori", label: "Kategori", icon: Tags, ready: true },
  { href: "/admin/galeri", label: "Galeri", icon: Images, ready: true },
  {
    href: "/admin/testimoni",
    label: "Testimoni",
    icon: MessageSquareQuote,
    ready: true,
  },
  { href: "/admin/client", label: "Client", icon: Building2, ready: true },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, ready: true },
  {
    href: "/admin/pengaturan",
    label: "Pengaturan",
    icon: Settings,
    ready: false,
    // The WhatsApp number lives here, and it is the entire order pipeline
    // (PRD §18.4), so changing it stays with ADMIN.
    adminOnly: true,
  },
];
