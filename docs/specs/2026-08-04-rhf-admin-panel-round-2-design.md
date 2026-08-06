# Ronde 2 — Admin Panel RHF Catering

**Tanggal:** 2026-08-04
**Status:** Disetujui, implementasi bertahap
**Mengacu:** `PRDRhf.md` §12 (admin panel), §16 (teknis), §17 (data model), §21 (keamanan), §24 poin 6–14

Ronde 1 membangun seluruh website publik di atas seed module bertipe. Ronde 2 memindahkan sumber datanya ke PostgreSQL dan menambahkan admin panel supaya pemilik bisa mengubah menu, harga, dan konten tanpa developer.

---

## 1. Keputusan yang sudah dikunci

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Database | Supabase PostgreSQL (pooler `:6543`) | Sudah disediakan pemilik |
| Autentikasi | Session cookie sendiri — `jose` + `bcryptjs` | ~150 baris, nol risiko kompatibilitas Next 16; hanya butuh 1–2 akun |
| Role | ADMIN + EDITOR aktif | Permintaan pemilik |
| Rich text | Textarea teks biasa | Nol permukaan XSS, cukup untuk isi konten sekarang |
| Upload gambar | Cloudinary | Kredensial sudah tersedia |
| Eksekusi | Bertahap, berhenti tiap tahap | Permintaan pemilik |

## 2. Batasan Next.js 16 yang membentuk desain

Diverifikasi langsung di `node_modules/next/dist/docs/`:

1. **`middleware.ts` sekarang `proxy.ts`** — berjalan di Node.js runtime, diletakkan di `src/proxy.ts`.
2. **`unauthorized()` / `forbidden()` masih eksperimental** (butuh flag `authInterrupts`) — tidak dipakai, cukup `redirect()`.
3. **Prisma 7 mewajibkan driver adapter** — `@prisma/adapter-pg`; `DATABASE_URL` di client tidak lagi cukup.
4. **`cookies()` asinkron** — semua pembacaan cookie di-`await`.

## 3. Arsitektur

Lapisan repository dari ronde 1 tetap menjadi satu-satunya jalur baca halaman publik. Hanya isinya yang diganti; tanda tangan fungsi dan tipe kembalian tidak berubah, sehingga tidak ada halaman publik yang perlu disentuh.

```
Publik:  app/**/page.tsx → lib/repositories/ → lib/db.ts → Postgres
Admin:   form (client) → server action → verifySession + Zod → lib/db.ts → Postgres
                                                             → revalidatePath()
```

### File baru

| Path | Tanggung jawab |
|---|---|
| `src/lib/db.ts` | Singleton PrismaClient + `PrismaPg` adapter |
| `src/lib/repositories/mappers.ts` | Baris Prisma (`null`, `Date`) → tipe domain (`undefined`, ISO string) |
| `src/lib/auth/jwt.ts` | Tanda tangan & verifikasi token; bebas Prisma/`next/headers` agar aman dipakai `proxy.ts` |
| `src/lib/auth/session.ts` | Cookie httpOnly: buat, baca, hapus |
| `src/lib/auth/dal.ts` | `verifySession()`, `requireAdmin()`, di-`cache()` per render |
| `src/lib/auth/password.ts` | bcryptjs hash & verify |
| `src/lib/auth/rate-limit.ts` | Catat dan cek percobaan login gagal |
| `src/proxy.ts` | Cek optimistik cookie → redirect `/admin/*` ke login |
| `src/lib/admin/schemas.ts` | Skema Zod seluruh entitas |
| `src/lib/admin/actions/*.ts` | Server action CRUD per entitas |
| `src/lib/storage/cloudinary.ts` | Implementasi `StorageAdapter` yang sudah dideklarasikan ronde 1 |
| `src/app/admin/**` | Login, dashboard, CRUD, site settings |
| `src/app/(public)/layout.tsx` | Chrome publik, dipindah keluar dari root layout |

## 4. Keamanan — dua lapis

`proxy.ts` **bukan** garis pertahanan. Ia hanya membaca cookie lalu me-redirect, tanpa query database, karena ia berjalan di setiap rute termasuk yang di-prefetch.

Otorisasi sebenarnya berada di `verifySession()` yang dipanggil **di dalam setiap server action**. Server action adalah endpoint publik; menyembunyikan tombol di UI tidak mengamankan apa pun.

Pembagian role:

- **ADMIN** — seluruh akses, termasuk Site Settings.
- **EDITOR** — CRUD konten saja. `requireAdmin()` menolak EDITOR pada action Site Settings, dan menu Site Settings disembunyikan dari sidebar.

### Rate limit login

Satu-satunya perubahan schema. `Map` di memori tidak berguna di Vercel karena tiap instance punya memori sendiri, jadi hitungannya disimpan di database:

```prisma
model LoginAttempt {
  id        String   @id @default(cuid())
  email     String
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([email, createdAt])
  @@map("login_attempts")
}
```

Aturan: 5 kegagalan per email dalam 15 menit → ditolak selama 15 menit. Pesan error dibuat **identik** untuk email tidak terdaftar maupun password salah, supaya tidak membocorkan email mana yang terdaftar.

## 5. Konsekuensi yang diterima secara sadar

- **Build Vercel kini membutuhkan `DATABASE_URL`.** `generateStaticParams` pada `/menu/[slug]` dan halaman statis lain membaca database saat build. Tanpa env var, build gagal.
- **Halaman publik tetap statis.** Setiap server action memanggil `revalidatePath()` pada rute terdampak, sehingga perubahan admin langsung ter-regenerate. Ini menjaga target performa PRD §20.1 sekaligus memenuhi "ubah harga tanpa deploy ulang" (PRD §12.3).
- **Supabase pooler memakai pgBouncer mode transaksi.** `DATABASE_URL` wajib membawa `?pgbouncer=true`, dan `DIRECT_URL` (non-pooled) dipakai `prisma migrate`.

## 6. Dependency baru

`jose`, `bcryptjs`, `zod`, `@prisma/adapter-pg`. **Empat** paket, seluruhnya dipakai langsung.

Dua yang direncanakan tapi tidak jadi dipasang: `@types/bcryptjs` (bcryptjs 3 membawa typings sendiri) dan **`cloudinary`** — unggahan bertanda tangan hanya perlu satu SHA-1 dari `node:crypto` dan satu POST yang terjadi di browser, jadi SDK-nya akan jadi dependency yang dibawa untuk sesuatu yang sudah ada.

## 7. Tahapan

Tiap tahap berhenti untuk ditinjau pemilik sebelum lanjut.

| # | Tahap | Bukti selesai |
|---|---|---|
| 1 | ✅ Infrastruktur DB: deps, `db.ts`, mappers, repository → Prisma, migrate + seed | Selesai 2026-08-04. Migrasi `20260804170024_init`. |
| 2 | ✅ Auth: session, DAL, login, logout, proxy, rate limit, bootstrap admin di seed | Selesai 2026-08-05. Migrasi `20260804190710_add_login_attempt`. |
| 3 | ✅ Shell admin + dashboard (PRD §12.2) | Selesai 2026-08-05. Detail: [tahap 3](2026-08-05-rhf-admin-dashboard-tahap-3.md) |
| 4a | ✅ Fondasi CRUD + 5 entitas datar (FAQ, kategori, galeri, testimoni, client) | Selesai 2026-08-05. Detail: [tahap 4a](2026-08-05-rhf-admin-crud-tahap-4a.md) |
| 4b | ✅ CRUD Menu — relasi many-to-many, kolom array, field SEO | Selesai 2026-08-05. Detail: [tahap 4b](2026-08-05-rhf-admin-crud-tahap-4b.md) |
| 5 | Site Settings + penegakan role EDITOR | Ganti nomor WA di admin → seluruh CTA publik ikut berubah |
| 6 | ✅ Upload Cloudinary | Selesai 2026-08-06, ditarik maju ke revisi 4b. Signed direct upload — lihat [tahap 4b](2026-08-05-rhf-admin-crud-tahap-4b.md) §Unggah gambar |

## 8. Catatan yang muncul saat implementasi

Ditemukan saat mengerjakan, tidak terduga di desain awal:

1. **Root layout harus dipecah.** Header, footer, dan CTA melayang semula ada di root layout, sehingga `/admin` ikut mewarisinya. Halaman publik dipindah ke route group `(public)/` dengan layout-nya sendiri; root layout kini hanya `html`/`body`/font. URL publik tidak berubah.
2. **`app/not-found.tsx` tidak boleh punya chrome sendiri.** Next.js tetap membungkus 404 dengan layout segment tempat `notFound()` dilempar, jadi menambah chrome di sana membuat navbar dan footer dobel. `not-found.tsx` di dalam route group tidak pernah terpakai.
3. **Hash decoy untuk penyeimbang waktu harus valid.** Diukur di mesin ini: `bcrypt.compare` terhadap hash yang malformed balik dalam 0 ms, sedangkan hash valid 278 ms. Decoy yang asal-asalan tidak membakar waktu sama sekali dan kebocoran timing-nya tetap ada.
4. **`@types/bcryptjs` tidak diperlukan** — bcryptjs 3 sudah membawa typings sendiri.
5. **Flag Prisma berubah:** `--to-schema-datamodel` dihapus, sekarang `--to-schema`.
6. **Unggah lewat server action tidak bisa dipakai.** Next membatasi body server action di 1 MB, Vercel membatasi body function di 4,5 MB tanpa opsi menaikkannya, sedangkan foto HP 3–8 MB. Unggahan memakai signed direct upload ke Cloudinary — lihat [tahap 4b](2026-08-05-rhf-admin-crud-tahap-4b.md).
7. **Urutan operasi bersarang Prisma tidak dijamin.** Mengganti seluruh himpunan relasi many-to-many dengan `{ deleteMany: {}, create: [...] }` di dalam satu `update` bertumpu pada asumsi yang tidak ada di dokumentasi. Penulisan join table dilakukan lewat `$transaction` eksplisit — lihat [tahap 4b](2026-08-05-rhf-admin-crud-tahap-4b.md).

## 9. Prasyarat env per tahap

| Variabel | Dibutuhkan mulai | Status |
|---|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Tahap 1 | Terisi |
| `AUTH_SECRET` | Tahap 2 | Terisi |
| `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` | Bootstrap akun | **Masih kosong** — akun admin belum dibuat |
| `CLOUDINARY_*` | Tahap 6 | Terisi |
| `NEXT_PUBLIC_SITE_URL` | Saat domain kustom aktif | Opsional |
