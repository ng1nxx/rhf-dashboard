import { Building2 } from "lucide-react";
import Image from "next/image";

import { Section, SectionHeading } from "@/components/shared/section";
import { CLIENT_TYPES } from "@/lib/seed/clients";
import type { Client } from "@/lib/types";

/**
 * Client trust — PRD §11.9.
 *
 * DesignRHF §21 forbids showing a client's name or logo without permission, so
 * when nothing is published this falls back to naming the *types* of customer
 * RHF serves. That is the required behaviour, not a degraded state: the
 * section is never empty and never claims a relationship RHF cannot evidence.
 */
export function ClientTrust({ clients }: { clients: Client[] }) {
  const hasNamedClients = clients.length > 0;

  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Dipercaya Oleh"
        title="Dipercaya untuk Berbagai Kebutuhan Acara"
        description={
          hasNamedClients
            ? "Beberapa instansi dan organisasi yang pernah mempercayakan kebutuhan konsumsinya kepada RHF."
            : "RHF Catering & Snack Box menerima pesanan untuk acara keluarga, sekolah, kantor, hingga kegiatan dinas dan instansi di Kabupaten Tegal."
        }
      />

      {hasNamedClients ? (
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-rhf-border bg-white p-6 text-center"
            >
              {client.logoUrl ? (
                <span className="relative h-12 w-full">
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    fill
                    sizes="200px"
                    className="object-contain"
                  />
                </span>
              ) : (
                <Building2
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-8 text-rhf-brown/60"
                />
              )}
              <div>
                <p className="font-heading text-sm font-semibold text-rhf-charcoal">
                  {client.name}
                </p>
                {client.category ? (
                  <p className="text-xs text-muted-foreground">
                    {client.category}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {CLIENT_TYPES.map((type) => (
            <li key={type}>
              <span className="inline-flex items-center gap-2 rounded-full border border-rhf-border bg-white px-5 py-3 text-sm font-medium text-rhf-brown">
                <Building2
                  aria-hidden
                  strokeWidth={1.75}
                  className="size-4 text-rhf-orange"
                />
                {type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
