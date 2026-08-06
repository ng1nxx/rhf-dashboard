import { ImageResponse } from "next/og";

import { getSiteSettings } from "@/lib/repositories";

export const alt =
  "RHF Catering & Snack Box — Snack Box, Nasi Box, dan Prasmanan di Kabupaten Tegal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share image — PRD §19.4.
 *
 * Drawn rather than photographed, using the brand palette from DesignRHF §3,
 * so it stays accurate while real photography is still outstanding.
 */
export default async function OpengraphImage() {
  const settings = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #FFF4E6 0%, #FDE3C4 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 999,
              background: "#F97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            RHF
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#2B2118" }}>
              {settings.brandName}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#7A3E12",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {settings.tagline}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span
            style={{
              fontSize: 62,
              fontWeight: 800,
              color: "#2B2118",
              lineHeight: 1.1,
              maxWidth: 940,
            }}
          >
            Catering &amp; Snack Box{" "}
            <span style={{ color: "#D85A00" }}>Kabupaten Tegal</span>
          </span>

          <span style={{ fontSize: 28, color: "#5A4A3C", maxWidth: 900 }}>
            Snack box, nasi box, coffee break, dan prasmanan untuk acara
            keluarga, sekolah, kantor, hingga dinas.
          </span>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Snack Box", "Nasi Box", "Prasmanan", "Coffee Break"].map((tag) => (
            <span
              key={tag}
              style={{
                display: "flex",
                border: "1px solid #EAD7C0",
                background: "#FFFFFF",
                color: "#7A3E12",
                borderRadius: 999,
                padding: "12px 26px",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
