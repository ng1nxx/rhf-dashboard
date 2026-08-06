# Design Spec — RHF Catering & Snack Box, Public Website (Round 1)

**Date:** 2026-08-04
**Source documents:** `PRDRhf.md` (v1.1), `PromtCatering.md`, `DesignRHF.md`
**Scope this round:** public website only. Admin panel (`/admin`), auth, and Cloudinary upload UI are deferred to round 2.

---

## 1. Purpose

Ship the public-facing website for RHF Catering & Snack Box: a company profile, full menu catalogue, gallery, trust sections, FAQ, and WhatsApp inquiry funnel for customers in Kabupaten Tegal. No cart, no checkout, no payment gateway — every order path terminates in a pre-filled WhatsApp message.

This spec records only the decisions that the three source documents left open or answered inconsistently. Everything else follows the PRD verbatim.

## 2. Confirmed decisions

| Decision | Choice | Rationale |
|---|---|---|
| Database | PostgreSQL on Neon/Supabase | Matches PRD §16.2 and the Vercel deploy target. Schema and seed written this round; migration deferred until `DATABASE_URL` exists. |
| Image storage | Cloudinary | Chosen for round 2. A `StorageAdapter` interface is defined now so no UI depends on the provider. |
| Placeholder imagery | Generated inline SVG | RHF has no real photos yet. Stock photos would violate DesignRHF §11 (natural, real, unfiltered) and risk shipping to production unreplaced. |
| Hero copy | PRD §13.1 | Contains brand + location + primary keyword, serving the local SEO targets in PRD §19.1. Supersedes the DesignRHF §15 draft. |
| Round-1 data source | Typed seed modules behind repositories | Lets the whole public site be built, reviewed, and deployed before the database exists. |

## 3. Architecture

### 3.1 The repository seam

Pages never touch a data source directly. They call functions in `src/lib/repositories/`:

```
app/**/page.tsx  →  lib/repositories/*.ts  →  lib/seed/*.ts     [round 1]
                                          →  lib/prisma client  [round 2]
```

Every repository function is `async` and returns the domain types in `src/lib/types.ts`, which mirror PRD §17 field-for-field. Round 2 replaces the body of each function; signatures, return types, and every call site stay unchanged.

Two invariants live **inside** the repositories, never at call sites, so no page can forget them:

1. `isPublished === false` records are filtered out.
2. Results are ordered by `sortOrder` ascending.

### 3.2 Single source for contact details

`getSiteSettings()` returns the WhatsApp number, service area, hours, and social links. No component hardcodes a phone number. When round 2 makes site settings editable, every CTA on the site follows automatically — satisfying PRD §12.9 and §18.4.

### 3.3 Category model

PRD §8.2 requires one menu item to appear under several categories (a nasi box is simultaneously "Nasi Box", "Paket Rapat/Dinas", and "Paket Sekolah"). Modelled as a real many-to-many relation, not a denormalised array, so category filtering stays a join in round 2.

## 4. Routes

The seven public routes from PRD §10.1, unchanged:

| Route | Contents |
|---|---|
| `/` | 14 sections in the order fixed by PRD §10.2 |
| `/menu` | Catalogue with category filter, name search, and sort |
| `/menu/[slug]` | Package detail with dynamic WhatsApp CTA |
| `/layanan` | All nine services, split into product-based and event-based groups |
| `/galeri` | Category-filtered grid with lightbox |
| `/tentang` | Brand story, values, timeline |
| `/kontak` | Contact details, ordering flow, and the full FAQ accordion |

**Resolved conflict:** PRD §11.1 lists "FAQ" as a navbar item, but PRD §10.1 defines no `/faq` route. Rather than invent a route outside the agreed IA, the complete FAQ accordion lives on `/kontak` under `#faq`, the navbar links to `/kontak#faq`, and the homepage shows a preview linking to the same anchor.

## 5. Design system

Tokens are transcribed from DesignRHF §29–30 without reinterpretation, then bound to shadcn's semantic variables so every shadcn component inherits the brand without per-component overrides:

| shadcn token | RHF value |
|---|---|
| `--background` | `#FFF4E6` warm cream |
| `--foreground` | `#2B2118` charcoal brown |
| `--primary` | `#F97316` RHF orange |
| `--card` | `#FFFFFF` |
| `--muted` | `#F7F3EE` soft gray |
| `--border` / `--input` | `#EAD7C0` warm border |
| `--ring` | `#F97316` |

Raw brand colours are additionally exposed as `rhf-*` utilities (`bg-rhf-orange`, `text-rhf-brown`) for cases where the semantic name would obscure intent.

**Enforcing the 60/30/10 ratio (DesignRHF §4)** is structural rather than a matter of discipline: a `<Section>` component accepts `tone="cream" | "white" | "soft"`, sections alternate through those tones, and orange is admitted only on CTAs, badges, icon highlights, and exactly one full-bleed CTA block per page.

Typography: Poppins for headings, Inter for body, both self-hosted through `next/font`. Type scale, radii, shadows, and section padding come from DesignRHF §5, §7, §8, §9.

No dark mode. The brand is defined as a single warm light theme, so the `.dark` block shadcn generates is removed rather than left to rot.

## 6. WhatsApp integration

One helper module, `src/lib/whatsapp.ts`:

- `createWhatsAppUrl(phoneNumber, message)` — normalises a local `08…` number to `62…` and URL-encodes the body.
- `buildGlobalInquiry()` — the PRD §18.2 template.
- `buildMenuInquiry(item)` — the PRD §18.3 template with name and price label interpolated.

Normalisation lives in the helper so an admin can later type the number in any format without breaking links.

## 7. Placeholder imagery

`<FoodPlaceholder category>` renders inline SVG: a warm cream-to-orange gradient, an outline icon chosen per category (box, plate, cup, tray), and the category name. Zero network requests, correct aspect ratio, and unmistakably a placeholder — it cannot be confused for a real photograph in review.

`MenuImage` and `GalleryImage` render `next/image` when a record has an `imageUrl` and fall back to `FoodPlaceholder` otherwise, so replacing placeholders in round 2 requires no template edits.

## 8. Server/client boundary

Server Components by default. Client Components are limited to genuinely interactive surfaces: the mobile navigation sheet, the catalogue's filter/search/sort controls, the gallery lightbox, and the FAQ accordion. Catalogue state is held in the URL query string so a filtered view is linkable and the service cards on `/layanan` can deep-link into a pre-filtered catalogue, as PRD §11.4 requires.

## 9. SEO

Per-page metadata via the Next.js metadata API, with the PRD §19.2/§19.3 strings on the homepage. Open Graph image, `sitemap.ts`, `robots.ts`, semantic headings, alt text on every image, and `FoodEstablishment` JSON-LD carrying the service area and WhatsApp contact.

## 10. Out of scope this round

`/admin` and all CRUD, NextAuth credentials, Cloudinary uploads, analytics. The Prisma schema, seed script, storage adapter interface, and env var contract are written now so round 2 is additive.

## 11. Acceptance

Round 1 is complete when PRD §24 items 1–5, 15–18 hold: all seven routes render responsively, the homepage communicates positioning, the catalogue and detail pages work with a dynamic WhatsApp CTA pointing at `62895422734153`, unpublished records are absent from the public site, the design system is applied, the production build succeeds, and basic SEO is in place. Items 6–14 depend on the admin panel and are round 2.
