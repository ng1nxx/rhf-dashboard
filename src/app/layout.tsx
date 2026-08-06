import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";

import { getSiteSettings } from "@/lib/repositories";
import { siteUrl } from "@/lib/site-url";

import "./globals.css";

// Poppins for headings, Inter for body — DesignRHF §5 pairing 1.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.seoTitle,
      // Inner pages set their own short title; the brand is appended here.
      template: `%s | ${settings.brandName}`,
    },
    description: settings.seoDescription,
    applicationName: settings.brandName,
    keywords: [
      "catering Kabupaten Tegal",
      "catering Tegal",
      "snack box Kabupaten Tegal",
      "nasi box Tegal",
      "prasmanan Tegal",
      "catering untuk dinas Tegal",
      "catering acara sekolah Tegal",
      "catering pengajian Tegal",
      "catering aqiqah Tegal",
      "catering pernikahan Tegal",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: settings.brandName,
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#F97316",
};

/**
 * Root layout — document shell only.
 *
 * The public header, footer, and floating WhatsApp button used to live here.
 * They moved to `(public)/layout.tsx` when `/admin` arrived, because a root
 * layout wraps every route and the admin panel must not inherit the customer
 * chrome. What is left is what genuinely belongs to every page: the language,
 * the fonts, and the stylesheet.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${inter.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
