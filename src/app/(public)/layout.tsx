import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/repositories";
import { buildGlobalInquiry } from "@/lib/whatsapp";

/**
 * Chrome for the public website.
 *
 * This lives in a route group rather than in the root layout so that `/admin`
 * does not inherit it — an admin panel wrapped in the customer-facing header,
 * footer, and floating "Chat WhatsApp" button would be nonsense. The group name
 * is parenthesised, so it adds nothing to any URL.
 *
 * It also wraps the 404 for misses inside the public site, which is why
 * `app/not-found.tsx` renders no chrome of its own.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const globalMessage = buildGlobalInquiry(settings);

  return (
    <>
      <SiteHeader
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={globalMessage}
      />

      <main id="konten" className="flex-1">
        {children}
      </main>

      <SiteFooter settings={settings} />
      <FloatingWhatsApp
        phoneNumber={settings.whatsappNumber}
        message={globalMessage}
      />
    </>
  );
}
