# Prompt Development Website RHF Catering & Snack Box

Gunakan prompt ini untuk coding agent seperti Cursor, Claude Code, v0, Bolt, Lovable, Replit Agent, atau agent development lain.

---

## MASTER PROMPT

Kamu adalah Senior Fullstack Engineer, UI/UX Designer, dan Product Engineer. Bangun website resmi **RHF Catering & Snack Box** berdasarkan dokumen `prd_rhf_catering_website_v1_1.md` dan `design_rhf_catering.md`.

Sebelum mulai menulis kode, baca dan pahami kedua dokumen tersebut. Jangan membuat desain atau fitur yang bertentangan dengan PRD dan design system.

---

## 1. Tujuan Website

Buat website company profile, katalog menu, galeri, testimoni, client trust, FAQ, kontak, dan admin panel custom untuk **RHF Catering & Snack Box**.

Website harus membuat RHF terlihat profesional untuk client dinas/kantor, sekolah, acara keluarga, komunitas, pengajian, pernikahan, dan aqiqah, sekaligus memudahkan calon customer melihat katalog menu lengkap dan langsung menghubungi admin via WhatsApp.

Brand identity:

- Nama brand: **RHF Catering & Snack Box**
- Lokasi: **Kabupaten Tegal, Jawa Tengah**
- Area layanan: **Kabupaten Tegal**
- WhatsApp: `0895422734153`
- Format wa.me: `62895422734153`
- Tagline: **Mengutamakan Rasa**
- Bahasa: Indonesia semi-formal, ramah, tetap profesional
- Filosofi: RHF berasal dari nama anak pemilik, yaitu Rafi, Hafizh, dan Fatih. Usaha dimulai dari jualan menggunakan gerobak sederhana, lalu berkembang hingga dipercaya berbagai pelanggan termasuk dinas/instansi.

---

## 2. Tech Stack Wajib

Gunakan stack berikut:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Responsive mobile-first
- Vercel-ready
- Database: PostgreSQL, direkomendasikan via Supabase atau Neon
- ORM: Prisma atau Drizzle
- Auth admin: Auth.js/NextAuth credentials atau Supabase Auth
- Image storage: Supabase Storage, Cloudinary, atau Vercel Blob

Jangan buat ecommerce penuh. Tidak perlu cart, checkout, payment gateway, tracking pesanan, login customer, atau invoice otomatis. Semua pemesanan diarahkan ke WhatsApp.

---

## 3. Design Direction

Gunakan arah desain dari `design_rhf_catering.md`:

**Warm Minimalist Catering Website**

Kesan yang harus muncul:

- Hangat
- Bersih
- Profesional
- Homey
- Terpercaya
- Modern
- Tidak ramai
- Tidak terlihat seperti template murahan

Hindari:

- Banyak emoji
- Efek 3D/glossy berlebihan
- Layout terlalu padat
- Background terlalu ramai
- Font dekoratif berlebihan
- Warna terlalu banyak dalam satu section

---

## 4. Color System

Gunakan color token berikut di Tailwind config dan CSS variables:

```ts
rhf: {
  orange: '#F97316',
  deepOrange: '#D85A00',
  cream: '#FFF4E6',
  white: '#FFFFFF',
  charcoal: '#2B2118',
  brown: '#7A3E12',
  green: '#6A8F3A',
  gold: '#F5B041',
  softGray: '#F7F3EE',
  border: '#EAD7C0',
}
```

Komposisi warna:

- 60% warm cream/white untuk background dan whitespace
- 30% RHF orange untuk brand identity dan CTA
- 10% deep orange/brown/gold/green untuk aksen

Gunakan `#2B2118` untuk teks utama agar tetap hangat dan premium.

---

## 5. Typography

Gunakan font:

- Heading: Poppins atau Montserrat
- Body: Inter atau Nunito Sans

Aturan:

- Maksimal 2 font family utama
- Heading tegas, clean, mudah dibaca
- Body readable di mobile
- Ukuran font konsisten
- Jangan gunakan font dekoratif untuk body atau menu utama

---

## 6. Routes Public Website

Buat struktur halaman berikut:

1. `/` — Home / landing page utama
2. `/menu` — Katalog menu lengkap
3. `/menu/[slug]` — Detail paket/menu
4. `/layanan` — Layanan berdasarkan kebutuhan
5. `/galeri` — Galeri makanan dan acara
6. `/tentang` — Cerita RHF
7. `/kontak` — Kontak dan CTA WhatsApp
8. `/admin` — Admin panel custom

Public website harus SEO-friendly dan responsive.

---

## 7. Struktur Home Page

Buat homepage dengan urutan section berikut:

1. Header / Navbar sticky
2. Hero Section
3. Quick Trust Highlights
4. Kategori Layanan
5. Menu/Paket Unggulan
6. Kenapa Memilih RHF
7. Cerita RHF
8. Galeri Preview
9. Client / Dipercaya Oleh
10. Testimoni
11. Alur Pemesanan WhatsApp
12. FAQ Preview
13. Final CTA
14. Footer

---

## 8. Header / Navbar

Elemen:

- Logo RHF Catering & Snack Box
- Navigasi:
  - Beranda
  - Layanan
  - Menu
  - Galeri
  - Tentang
  - FAQ
  - Kontak
- Tombol CTA utama: **Pesan via WhatsApp**
- Mobile hamburger menu
- Sticky header
- Active state pada menu yang sedang dibuka

CTA WhatsApp harus selalu mudah terlihat, terutama di mobile.

---

## 9. Hero Section

Copy utama:

Headline:

> RHF Catering & Snack Box Kabupaten Tegal

Subheadline:

> Pilihan snack box, nasi box, coffee break, dan prasmanan untuk acara keluarga, sekolah, kantor, hingga dinas. Mengutamakan rasa, kerapian, dan pelayanan yang amanah.

CTA:

- Primary: **Pesan via WhatsApp**
- Secondary: **Lihat Katalog Menu**

Visual:

- Jika belum ada foto asli, gunakan placeholder profesional sementara.
- Hindari gambar AI yang terlalu fake.
- Gunakan card visual makanan yang clean, hangat, dan appetizing.

---

## 10. Layanan Utama

Tampilkan semua layanan berikut:

1. Snack Box
2. Nasi Box
3. Prasmanan
4. Coffee Break
5. Paket Rapat/Dinas
6. Paket Sekolah
7. Pengajian/Syukuran
8. Pernikahan
9. Aqiqah

Setiap service card berisi:

- Icon sederhana
- Nama layanan
- Deskripsi 1–2 kalimat
- CTA kecil: **Lihat Paket** atau **Konsultasi**

Klik layanan harus mengarah ke `/menu` dengan filter kategori/tag jika memungkinkan.

---

## 11. Katalog Menu

Halaman `/menu` harus memiliki:

- Grid/list menu cards
- Filter kategori
- Search nama menu
- Sort opsional:
  - Terbaru
  - Harga termurah
  - Harga tertinggi
  - Rekomendasi
- Badge menu:
  - Best Seller
  - Rekomendasi
  - Cocok untuk Rapat
  - Cocok untuk Sekolah

Data card menu:

- Nama paket/menu
- Kategori
- Foto
- Harga atau price label
- Isi singkat paket/menu
- Minimal order
- Deskripsi singkat
- CTA: **Pesan Paket Ini**
- Link detail ke `/menu/[slug]`

Menu yang `isPublished = false` tidak boleh tampil di public website.

---

## 12. Detail Paket/Menu

Halaman `/menu/[slug]` berisi:

- Nama paket/menu
- Foto utama
- Galeri tambahan opsional
- Harga / price label
- Isi paket
- Cocok untuk acara apa
- Minimal order
- Area layanan: Kabupaten Tegal
- Catatan pesanan
- CTA: **Pesan via WhatsApp**
- Rekomendasi paket lain

CTA detail menu harus membuka WhatsApp dengan template dinamis:

```text
Halo RHF Catering & Snack Box, saya mau tanya/pesan paket berikut:

Nama Paket: {{menu_name}}
Harga: {{price_label}}
Jumlah Pesanan:
Tanggal Acara:
Lokasi Acara:
Catatan:
```

Pastikan template WhatsApp sudah URL-encoded dengan benar.

---

## 13. Galeri

Halaman `/galeri` berisi:

- Grid foto makanan dan acara
- Filter kategori galeri jika memungkinkan
- Caption singkat
- Tampilan responsive
- Modal/lightbox opsional

Karena RHF belum punya foto final, buat placeholder data dan komponen yang siap diganti melalui admin panel.

---

## 14. Testimoni dan Client Trust

Buat section testimoni:

- Nama pelanggan
- Tipe pelanggan, contoh: Dinas/Kantor/Sekolah/Keluarga
- Pesan testimoni
- Rating opsional

Buat section client/instansi:

- Nama client/instansi
- Logo opsional
- Kategori client

Jika belum ada client/testimoni publish, tampilkan copy umum seperti:

> Dipercaya untuk berbagai kebutuhan konsumsi acara, mulai dari kegiatan keluarga, sekolah, kantor, hingga instansi.

---

## 15. FAQ

FAQ wajib bisa dikelola dari admin panel.

FAQ awal yang bisa digunakan:

1. Apakah RHF melayani pesanan di seluruh Kabupaten Tegal?
2. Apakah bisa pesan snack box dan nasi box untuk acara dinas/kantor?
3. Berapa minimal order?
4. Apakah harga bisa menyesuaikan budget?
5. Bagaimana cara memesan?
6. Apakah tersedia prasmanan?
7. Apakah menu bisa custom?

Tampilkan sebagai accordion menggunakan Shadcn UI.

---

## 16. Alur Pemesanan

Tampilkan alur sederhana:

1. Hubungi RHF Catering via WhatsApp
2. Pilih menu atau konsultasi kebutuhan acara
3. Konfirmasi jumlah, tanggal, lokasi, dan catatan pesanan
4. Pesanan disiapkan oleh RHF
5. Pesanan dikirim atau diambil sesuai kesepakatan

Karena sistem pembayaran belum tetap, tulis copy yang aman:

> Detail pembayaran dan konfirmasi pesanan akan dibantu langsung oleh admin RHF melalui WhatsApp.

---

## 17. WhatsApp Integration

Nomor WhatsApp:

- Input: `0895422734153`
- wa.me format: `62895422734153`

Global CTA template:

```text
Halo RHF Catering & Snack Box, saya mau konsultasi pesanan untuk acara.

Nama:
Tanggal Acara:
Lokasi Acara:
Jenis Pesanan: Snack Box / Nasi Box / Prasmanan / Coffee Break / Lainnya
Jumlah Pesanan:
Catatan:
```

Semua tombol WhatsApp harus memakai nomor dari site settings, bukan hardcode di banyak tempat.

Buat helper function misalnya:

```ts
createWhatsAppUrl(phoneNumber: string, message: string): string
```

---

## 18. Admin Panel Custom

Buat admin panel di `/admin` dengan protected route.

Fitur admin wajib:

### Auth

- Login admin
- Logout
- Protected route
- Password tidak boleh plain text

### Dashboard

Tampilkan summary:

- Total menu aktif
- Total kategori
- Total galeri aktif
- Total testimoni aktif
- Total client aktif
- Shortcut tambah menu
- Shortcut update nomor WhatsApp

### Menu Management

CRUD menu/paket dengan field:

- name
- slug auto-generate, editable
- categoryIds multi kategori
- shortDescription
- description rich text/markdown sederhana
- price optional
- priceLabel wajib
- minOrder optional
- packageItems list
- imageUrl
- galleryImages
- isFeatured
- isPublished
- sortOrder
- seoTitle
- seoDescription

### Category Management

CRUD kategori:

- name
- slug
- description
- icon
- sortOrder
- isPublished

Kategori awal:

- Snack Box
- Nasi Box
- Prasmanan
- Coffee Break
- Paket Rapat/Dinas
- Paket Sekolah
- Pengajian/Syukuran
- Pernikahan
- Aqiqah

### Gallery Management

CRUD galeri:

- title
- caption
- imageUrl
- category
- sortOrder
- isPublished

### Testimonial Management

CRUD testimoni:

- customerName
- customerType
- message
- rating optional
- imageUrl optional
- sortOrder
- isPublished

### Client Management

CRUD client:

- name
- category
- logoUrl optional
- sortOrder
- isPublished

### FAQ Management

CRUD FAQ:

- question
- answer
- sortOrder
- isPublished

### Site Settings

Editable settings:

- brandName
- tagline
- whatsappNumber
- whatsappTemplate
- location
- serviceArea
- businessHours
- instagramUrl
- tiktokUrl
- facebookUrl
- email
- logoUrl
- faviconUrl
- seoTitle
- seoDescription

---

## 19. Data Models

Implementasikan data model minimal sesuai PRD:

- AdminUser
- MenuCategory
- MenuItem
- GalleryItem
- Testimonial
- Client
- FAQ
- SiteSettings

Gunakan Prisma atau Drizzle. Pastikan schema mendukung relasi menu ke banyak kategori/tag.

Sediakan seed data untuk development agar website bisa langsung dilihat tanpa input manual.

---

## 20. UI Components

Buat komponen reusable:

- Button primary
- Button secondary
- Section heading
- Service card
- Menu card
- Menu filter/search
- Testimonial card
- Client logo card
- Gallery grid
- FAQ accordion
- Floating WhatsApp button
- Admin sidebar
- Admin table
- Admin form
- Image uploader
- Publish toggle
- Empty state
- Loading state

Gunakan Shadcn UI untuk komponen dasar seperti Button, Card, Input, Textarea, Select, Dialog, Dropdown, Badge, Table, Tabs, Accordion, dan Sheet.

---

## 21. SEO Requirements

Target keyword awal:

- catering Kabupaten Tegal
- catering Tegal
- snack box Kabupaten Tegal
- nasi box Tegal
- prasmanan Tegal
- catering untuk dinas Tegal
- catering acara keluarga Tegal

Meta title home:

> RHF Catering & Snack Box Kabupaten Tegal | Snack Box, Nasi Box & Prasmanan

Meta description home:

> RHF Catering & Snack Box melayani snack box, nasi box, coffee break, dan prasmanan untuk acara keluarga, sekolah, kantor, hingga dinas di Kabupaten Tegal. Mengutamakan rasa, kerapian, dan pelayanan amanah.

Implementasikan:

- Next.js metadata API
- Open Graph metadata
- Sitemap jika memungkinkan
- Robots.txt
- Semantic HTML
- Alt text untuk image

---

## 22. Performance & Accessibility

Target:

- Mobile-first responsive
- Lighthouse performance minimal 85 untuk MVP
- Gunakan Next Image untuk optimasi gambar
- Lazy loading galeri
- Button mudah diklik di mobile
- Contrast text harus aman
- Form label jelas
- Keyboard accessible untuk menu, dialog, accordion, dan admin panel

---

## 23. Content Seed Awal

Buat seed kategori wajib.

Buat dummy menu awal dengan status jelas sebagai placeholder, misalnya:

- Snack Box Paket A — priceLabel: `Mulai Rp15.000/box`
- Nasi Box Paket A — priceLabel: `Mulai Rp25.000/box`
- Coffee Break Paket A — priceLabel: `Hubungi Admin`
- Prasmanan Paket Keluarga — priceLabel: `Mulai Rp35.000/pax`
- Paket Rapat/Dinas — priceLabel: `Hubungi Admin`

Berikan catatan di admin/public bahwa data harga dan isi paket dapat diperbarui oleh admin.

---

## 24. Acceptance Criteria

Website dianggap selesai untuk MVP jika:

- Semua public routes dapat diakses dan responsive.
- Homepage menampilkan brand, layanan, katalog unggulan, trust, galeri, testimoni, FAQ, CTA WhatsApp, dan footer.
- Halaman menu memiliki filter, search, dan detail page.
- CTA WhatsApp global dan detail menu bekerja dengan template pesan yang benar.
- Admin dapat login dan mengelola menu, kategori, galeri, testimoni, client, FAQ, dan site settings.
- Data yang `isPublished = false` tidak tampil di public website.
- Nomor WhatsApp public website mengambil dari site settings.
- Website menggunakan design system RHF: orange, cream, charcoal, white, warm minimal, clean.
- Tidak ada fitur ecommerce/cart/payment gateway.
- Kode rapi, typed, reusable, dan mudah dikembangkan.

---

## 25. Output yang Harus Diberikan

Setelah development, berikan:

1. Struktur folder project.
2. Penjelasan cara menjalankan project lokal.
3. Daftar environment variables.
4. Cara migrate dan seed database.
5. Cara login admin pertama kali.
6. Penjelasan route public dan admin.
7. Catatan fitur yang sudah selesai dan yang masih TODO.
8. Rekomendasi langkah deploy ke Vercel.

---

## 26. Catatan Implementasi

Kerjakan secara bertahap:

1. Setup project, Tailwind, Shadcn UI, font, theme token.
2. Buat public layout dan homepage.
3. Buat katalog menu, detail menu, WhatsApp helper.
4. Buat halaman layanan, galeri, tentang, kontak.
5. Buat database schema dan seed data.
6. Buat admin authentication.
7. Buat admin CRUD.
8. Integrasi data public website ke database.
9. Polish responsive, SEO, accessibility, dan loading state.

Jangan mengorbankan kerapian UI. RHF harus terlihat profesional, hangat, dan terpercaya untuk calon client dinas/kantor.
