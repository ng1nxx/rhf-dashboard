"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Fallback when an admin page throws — in practice, when the database cannot
 * be reached.
 *
 * The raw error is deliberately not put on screen. It would carry connection
 * strings and table names, and none of that helps the owner; it is logged
 * server-side instead, where a developer can read it.
 */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-rhf-cream px-5 text-center">
      <h1 className="font-heading text-xl font-bold text-rhf-charcoal">
        Data gagal dimuat
      </h1>

      <p className="max-w-sm text-sm text-muted-foreground">
        Koneksi ke database sedang bermasalah. Coba muat ulang; kalau tetap
        gagal, hubungi developer.
      </p>

      <Button onClick={reset} variant="rhf" size="rhf">
        <RefreshCw aria-hidden />
        Coba lagi
      </Button>
    </main>
  );
}
