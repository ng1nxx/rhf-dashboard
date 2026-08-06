# Tahap 3 — Dashboard Admin

**Tanggal:** 2026-08-05
**Induk:** [`2026-08-04-rhf-admin-panel-round-2-design.md`](2026-08-04-rhf-admin-panel-round-2-design.md) §7 tahap 3
**Mengacu:** PRD §12.2 (dashboard), §15.3 (komponen admin), §9 (device support)

**Tujuan:** Shell admin dengan sidebar yang bisa dilipat, plus dashboard berisi angka konten yang mengikuti isi database.

**Arsitektur:** Sidebar resmi shadcn dipasang lalu ditambal, dengan delapan token temanya dipetakan ke palet hangat RHF. Halaman terautentikasi dipindah ke route group `(panel)` supaya halaman login tidak ikut memakai sidebar. Hitungan dashboard dibaca lewat modul `lib/admin/` yang terpisah dari `lib/repositories/`, karena repository membuang data belum-terbit sehingga tidak bisa menghitung total.

**Tech stack:** Next.js 16 App Router, shadcn/ui (style `radix-nova`), Tailwind v4, Prisma 7.

## Batasan global

- Tidak ada test runner di repo ini. Gerbang verifikasi tiap task: `npm run typecheck`, `npm run lint`, `npm run build`, ditambah pemeriksaan perilaku di browser sungguhan lewat CDP dan query `psql` langsung ke database.
- Tidak ada dark mode. DesignRHF §3 menetapkan satu tema terang hangat.
- Halaman publik tidak boleh berubah sama sekali — 8 route harus tetap 200 dan tampilannya identik.
- `verifySession()` dipanggil di halaman, tidak pernah dijadikan satu-satunya penjaga di layout.
- Jangan menampilkan nilai env atau kredensial di output perintah apa pun.

---

## Struktur berkas

| Path | Tanggung jawab |
|---|---|
| `src/components/ui/sidebar.tsx` | Komponen shadcn, **ditambal** di baris impor ikon |
| `src/components/ui/tooltip.tsx` | Dibutuhkan sidebar saat terlipat jadi rail |
| `src/components/ui/skeleton.tsx` | Dependency registry sidebar |
| `src/hooks/use-mobile.ts` | Deteksi lebar layar untuk mode Sheet |
| `src/app/globals.css` | +8 token `--sidebar-*` |
| `src/lib/admin/navigation.ts` | Daftar 8 tujuan + penanda `ready` |
| `src/lib/admin/queries.ts` | Hitungan dashboard, lewat `db` langsung |
| `src/components/admin/admin-sidebar.tsx` | Client — butuh `usePathname()` untuk item aktif |
| `src/components/admin/stat-card.tsx` | Kartu angka "X aktif dari Y" |
| `src/app/admin/(panel)/layout.tsx` | Shell: SidebarProvider + Sidebar + SidebarInset |
| `src/app/admin/(panel)/page.tsx` | Dashboard, pindahan dari `admin/page.tsx` |
| `src/app/admin/error.tsx` | Pesan jujur saat database gagal dibaca |

---

## Task 1 — Pasang sidebar shadcn dan tambal impornya

**Files:** create `src/components/ui/{sidebar,tooltip,skeleton}.tsx`, `src/hooks/use-mobile.ts`

**Menghasilkan:** `Sidebar`, `SidebarProvider`, `SidebarInset`, `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarRail`, `useSidebar`.

- [ ] **Langkah 1: Amankan komponen yang sudah dikustom**

`button.tsx` memuat varian `rhf`, `rhfOutline`, `rhfOnOrange`, `rhfLg` yang tidak ada di registry. Kalau CLI menimpanya, seluruh CTA situs publik berubah bentuk.

```bash
cp -r src/components/ui /tmp/ui-backup
```

- [ ] **Langkah 2: Pasang**

```bash
npx shadcn add sidebar --yes
```

- [ ] **Langkah 3: Periksa apakah ada yang tertimpa**

```bash
diff -rq /tmp/ui-backup src/components/ui
```

Kalau `button.tsx`, `input.tsx`, `separator.tsx`, atau `sheet.tsx` berbeda, kembalikan dari backup — sidebar tidak membutuhkan versi registry-nya.

- [ ] **Langkah 4: Tambal impor yang pasti gagal**

`sidebar.tsx` mengimpor `IconPlaceholder` dari `@/app/(create)/components/icon-placeholder`, komponen internal situs shadcn yang tidak ada di project mana pun. Hapus impor itu, ganti pemakaiannya di `SidebarTrigger`:

```tsx
import { PanelLeft } from "lucide-react";
// ...
<PanelLeft />
```

- [ ] **Langkah 5: Gerbang verifikasi**

`npm run typecheck` dan `npm run lint` bersih.

---

## Task 2 — Petakan token sidebar ke palet RHF

**Files:** modify `src/app/globals.css`

Tanpa task ini sidebar memakai default netral shadcn dan admin akan tampak abu-abu di samping situs publik yang hangat.

- [ ] **Langkah 1: Tambahkan delapan token**

```css
--sidebar: #ffffff;
--sidebar-foreground: #2b2118;
--sidebar-primary: #d85a00;
--sidebar-primary-foreground: #ffffff;
--sidebar-accent: #fff4e6;
--sidebar-accent-foreground: #d85a00;
--sidebar-border: #ead7c0;
--sidebar-ring: #f97316;
```

Lalu daftarkan padanan `--color-sidebar-*` di blok `@theme inline` mengikuti pola token lain di berkas itu, supaya kelas seperti `bg-sidebar` terbentuk.

- [ ] **Langkah 2: Gerbang verifikasi**

`npm run build` sukses.

---

## Task 3 — Data navigasi dan hitungan dashboard

**Files:** create `src/lib/admin/navigation.ts`, `src/lib/admin/queries.ts`

**Menghasilkan:**
- `ADMIN_NAV: AdminNavItem[]` dengan `AdminNavItem = { href: string; label: string; icon: LucideIcon; ready: boolean; adminOnly?: boolean }`
- `getDashboardStats(): Promise<DashboardStats>`

- [ ] **Langkah 1: Daftar navigasi**

Delapan tujuan sesuai PRD §12: Dashboard (`ready: true`), Menu, Kategori, Galeri, Testimoni, Client, FAQ, Pengaturan (`ready: false`, `adminOnly: true` untuk Pengaturan).

- [ ] **Langkah 2: Query hitungan**

Sepuluh `count()` dalam satu `db.$transaction([...])` sehingga hanya satu perjalanan ke database. Untuk tiap entitas: jumlah terbit dan jumlah total.

```ts
export type EntityCount = { published: number; total: number };
export type DashboardStats = {
  menuItems: EntityCount;
  categories: EntityCount;
  gallery: EntityCount;
  testimonials: EntityCount;
  clients: EntityCount;
};
```

- [ ] **Langkah 3: Gerbang verifikasi**

`npm run typecheck` bersih.

---

## Task 4 — Komponen sidebar dan kartu angka

**Files:** create `src/components/admin/admin-sidebar.tsx`, `src/components/admin/stat-card.tsx`

**Mengonsumsi:** `ADMIN_NAV` dari Task 3, komponen sidebar dari Task 1.

- [ ] **Langkah 1: `admin-sidebar.tsx`**

`"use client"` karena butuh `usePathname()` untuk menandai item aktif. Menerima `userName`, `userEmail`, `role` sebagai props dari layout server — sesi tidak pernah dibaca di klien.

Item dengan `ready: false` dirender sebagai `<span>` ber-`aria-disabled`, **bukan** `<Link>`, dan diberi lencana "segera". Item dengan `adminOnly` disembunyikan dari EDITOR.

- [ ] **Langkah 2: `stat-card.tsx`**

Menampilkan angka terbit sebagai angka utama dan "dari N total" sebagai teks kecil. Kalau `published < total`, selisihnya disebut eksplisit supaya data yang dinonaktifkan tidak terlihat seperti terhapus.

- [ ] **Langkah 3: Gerbang verifikasi**

`npm run typecheck` dan `npm run lint` bersih.

---

## Task 5 — Route group `(panel)`, layout, dashboard, error

**Files:** create `src/app/admin/(panel)/layout.tsx`, `src/app/admin/(panel)/page.tsx`, `src/app/admin/error.tsx`; delete `src/app/admin/page.tsx`

- [ ] **Langkah 1: Pindahkan dashboard ke route group**

`/admin/login` berada di dalam `app/admin/`. Tanpa route group, sidebar di `app/admin/layout.tsx` akan ikut membungkus halaman login. URL tidak berubah: `(panel)` tidak muncul di path.

- [ ] **Langkah 2: Layout shell**

Membaca cookie `sidebar_state` untuk `defaultOpen` supaya sidebar tidak berkedip saat halaman dimuat. Memanggil `getSession()` hanya untuk menampilkan identitas; penjagaan tetap di halaman.

- [ ] **Langkah 3: Dashboard**

`verifySession()` di awal. Lima kartu angka, kartu nomor WhatsApp aktif dari site settings, dua shortcut PRD §12.2 bertanda "segera".

- [ ] **Langkah 4: `error.tsx`**

`"use client"`, menampilkan pesan bahwa data gagal dimuat dan tombol coba lagi. Tidak menampilkan pesan error mentah ke layar.

- [ ] **Langkah 5: Gerbang verifikasi**

`npm run build` sukses, `/admin` dan `/admin/login` muncul di tabel route.

---

## Task 6 — Verifikasi perilaku

- [ ] Angka tiap kartu dicocokkan dengan `SELECT count(*)` langsung ke database.
- [ ] Lipat sidebar → reload → tetap terlipat (cookie `sidebar_state`).
- [ ] Lebar mobile → sidebar jadi Sheet, tombol pemicu terlihat.
- [ ] Item "segera" tidak bisa diklik dan bukan `<a>`.
- [ ] `/admin/login` tidak punya sidebar.
- [ ] Tamu membuka `/admin` tetap dialihkan ke login.
- [ ] Delapan route publik tetap 200, beranda identik dengan sebelum tahap 3.
- [ ] Bersihkan sisa uji di database dan matikan server uji.

---

## Yang sengaja tidak dikerjakan

- Ganti password dari UI — belum ada di tahap mana pun, sudah diangkat ke pemilik.
- Halaman CRUD asli — tahap 4.
- Halaman Pengaturan asli — tahap 5.
- Grafik atau tren pada dashboard — PRD §12.2 hanya meminta angka dan shortcut.
