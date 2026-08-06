"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * A side panel for adding or editing one record.
 *
 * Built on the existing Sheet rather than pulling in a drawer library — Sheet
 * is already a Radix Dialog that slides in from an edge, which is what a
 * drawer is. It brings the focus trap, the escape key, and the scroll lock
 * with it.
 *
 * The panel goes full width below `sm`. A 16-field form squeezed into a
 * phone-width sliver is worse than one that simply takes the screen.
 */
export function RecordDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/*
        The width overrides have to carry the same `data-[side=right]:` prefix
        as the defaults they replace. Plain `w-full sm:max-w-xl` loses: an
        attribute selector outranks a bare class, so the built-in `w-3/4` would
        keep winning and the panel would silently stay narrow.
      */}
      <SheetContent
        side="right"
        className="flex flex-col gap-0 bg-rhf-cream p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        <SheetHeader className="border-b border-rhf-border px-4 py-4 sm:px-6">
          <SheetTitle className="font-heading text-base font-bold text-rhf-charcoal">
            {title}
          </SheetTitle>
          {description ? (
            <SheetDescription className="text-xs">{description}</SheetDescription>
          ) : null}
        </SheetHeader>

        {/* The form scrolls, the header does not — on a long form the person
            should never lose sight of which record they are editing. */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
