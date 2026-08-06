import { MapPin, MessageCircle, Sparkles, UtensilsCrossed } from "lucide-react";

/**
 * Quick trust strip — PRD §11.3.
 *
 * Capped at four items: PRD §11.3 asks for 3–5 and explicitly warns against
 * making the layout busy.
 */
const HIGHLIGHTS = [
  {
    icon: MapPin,
    title: "Melayani Kabupaten Tegal",
    description: "Pengiriman ke lokasi acara di area Kabupaten Tegal.",
  },
  {
    icon: UtensilsCrossed,
    title: "Katalog Menu Lengkap",
    description: "Snack box, nasi box, prasmanan, hingga coffee break.",
  },
  {
    icon: Sparkles,
    title: "Rasa dan Kerapian",
    description: "Menu dimasak dan dikemas rapi agar siap dibagikan.",
  },
  {
    icon: MessageCircle,
    title: "Pesan Mudah via WhatsApp",
    description: "Tanpa akun, tanpa formulir panjang. Cukup chat admin.",
  },
];

export function QuickTrust() {
  return (
    <section className="border-y border-rhf-border bg-white py-10 lg:py-12">
      <div className="container-rhf">
        <h2 className="sr-only">Keunggulan RHF Catering</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className="flex items-start gap-3.5">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-rhf-cream text-rhf-deep-orange">
                <item.icon aria-hidden strokeWidth={1.75} className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-[0.9375rem] font-semibold text-rhf-charcoal">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
