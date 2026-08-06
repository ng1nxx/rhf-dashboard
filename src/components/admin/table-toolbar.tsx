"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tableHref } from "@/lib/admin/pagination";

/**
 * The search box above an admin table.
 *
 * A real `<form method="get">`, so submitting works with JavaScript off and
 * the result is a plain URL. The submit handler only upgrades that to a
 * client-side navigation, which keeps the sidebar and the scroll position
 * instead of reloading the whole panel.
 *
 * Searching always returns to page 1: staying on page 3 while the result set
 * shrinks to four rows shows an empty table for no visible reason.
 */
export function TableToolbar({
  pathname,
  q,
  perPage,
  placeholder,
}: {
  pathname: string;
  q: string;
  perPage: number;
  placeholder: string;
}) {
  const router = useRouter();
  const [term, setTerm] = useState(q);

  const submit = (value: string) =>
    router.push(
      tableHref(pathname, { q, page: 1, perPage }, { q: value.trim(), page: 1 }),
    );

  return (
    <form
      action={pathname}
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        submit(term);
      }}
      className="flex items-center gap-2"
      role="search"
    >
      <div className="relative flex-1 sm:max-w-xs">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          name="q"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 pl-9"
        />
      </div>

      {/* Carried through the GET fallback so submitting the form without
          JavaScript does not silently reset the page size. */}
      <input type="hidden" name="per" value={perPage} />

      <Button type="submit" variant="rhfOutline" size="sm" className="h-10">
        Cari
      </Button>

      {q ? (
        <Button asChild variant="ghost" size="sm" className="h-10">
          <Link
            href={tableHref(pathname, { q, page: 1, perPage }, { q: "", page: 1 })}
            onClick={() => setTerm("")}
          >
            <X aria-hidden />
            <span className="sr-only sm:not-sr-only">Hapus filter</span>
          </Link>
        </Button>
      ) : null}
    </form>
  );
}
