/**
 * Primary navigation — PRD §11.1.
 *
 * PRD §11.1 lists FAQ in the navbar while the information architecture in
 * §10.1 defines no `/faq` route. Rather than add a route outside the agreed
 * IA, the full FAQ accordion lives on the contact page and this entry links to
 * that anchor.
 */
export type NavItem = {
  label: string;
  href: string;
  /** Path prefix that marks this item active; omit for exact-match only. */
  matchPrefix?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/layanan", matchPrefix: "/layanan" },
  { label: "Menu", href: "/menu", matchPrefix: "/menu" },
  { label: "Galeri", href: "/galeri", matchPrefix: "/galeri" },
  { label: "Tentang", href: "/tentang", matchPrefix: "/tentang" },
  { label: "FAQ", href: "/kontak#faq" },
  { label: "Kontak", href: "/kontak", matchPrefix: "/kontak" },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) {
    return pathname === item.matchPrefix || pathname.startsWith(`${item.matchPrefix}/`);
  }
  return pathname === item.href;
}
