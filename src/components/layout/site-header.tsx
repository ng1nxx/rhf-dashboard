"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoLockup } from "@/components/brand/logo";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isNavItemActive, NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Sticky site header — PRD §11.1.
 *
 * A Client Component because it needs the current pathname for active state
 * and holds the mobile sheet's open state. Contact details arrive as props
 * from the server layout so this never reaches for the data layer itself.
 */
export function SiteHeader({
  whatsappNumber,
  whatsappMessage,
}: {
  whatsappNumber: string;
  whatsappMessage: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Closing the sheet on navigation is handled by wrapping each mobile link in
  // <SheetClose>, rather than by an effect watching the pathname.
  return (
    <header className="sticky top-0 z-50 border-b border-rhf-border bg-rhf-cream/88 backdrop-blur-lg">
      <div className="container-rhf flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* 48px sits inside both the mobile (40–48px) and desktop (48–56px)
            ranges in DesignRHF §6, so one size serves both breakpoints. */}
        <LogoLockup size={48} priority />

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                      active
                        ? "text-rhf-deep-orange"
                        : "text-rhf-charcoal hover:text-rhf-deep-orange",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-rhf-orange"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message={whatsappMessage}
            size="rhf"
            className="hidden sm:inline-flex"
          >
            <span className="hidden md:inline">Pesan via WhatsApp</span>
            <span className="md:hidden">Pesan</span>
          </WhatsAppButton>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="rounded-full border-rhf-border lg:hidden"
                aria-label="Buka menu navigasi"
              >
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-76 bg-rhf-cream p-0">
              <SheetHeader className="border-b border-rhf-border p-5">
                <SheetTitle asChild>
                  <LogoLockup size={44} href={null} />
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Navigasi utama" className="p-3">
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isNavItemActive(item, pathname);
                    return (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex items-center rounded-md px-4 py-3 text-base font-medium transition-colors",
                              active
                                ? "bg-white text-rhf-deep-orange shadow-rhf-sm"
                                : "text-rhf-charcoal hover:bg-white/70",
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="p-5 pt-2">
                <WhatsAppButton
                  phoneNumber={whatsappNumber}
                  message={whatsappMessage}
                  size="rhf"
                  className="w-full"
                >
                  Pesan via WhatsApp
                </WhatsAppButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
