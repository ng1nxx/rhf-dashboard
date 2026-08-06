# RHF Catering & Snack Box — Website

Website resmi RHF Catering & Snack Box, Kabupaten Tegal. Company profile, katalog menu, galeri, dan jalur pemesanan via WhatsApp.

Dibangun mengikuti `PRDRhf.md`, `PromtCatering.md`, dan `DesignRHF.md`. Keputusan desain yang tidak tercakup ketiga dokumen itu dicatat di `docs/specs/`. Semuanya dokumen kerja internal dan sengaja tidak ikut di-commit — lihat `.gitignore`.

> **Status:** Ronde 1 selesai. Ronde 2 hampir selesai — database, autentikasi, dashboard, CRUD keenam entitas, tabel berpaginasi, form dalam drawer, dan unggah gambar ke Cloudinary sudah jalan. Tersisa pengaturan situs dan role EDITOR.
>
> **Sebelum launch:** baca `PRELAUNCH.md`. Ada data placeholder yang wajib diganti.

---

## Tech stack

| Bagian | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Komponen | shadcn/ui (Radix primitives) |
| Font | Poppins (heading) + Inter (body), self-hosted via `next/font` |
| Ikon | Lucide |
| Database | Turso (libSQL/SQLite) via Prisma 7 + `@prisma/adapter-libsql` — *aktif* |
| Image storage | Cloudinary — *disiapkan, belum aktif* |
| Deployment | Vercel |

---

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka <http://localhost:3000>.

**Database wajib.** Seluruh konten publik dibaca dari database — bukan lagi dari `src/lib/seed/`. Salin `.env.example` ke `.env.local`, isi `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` dari dashboard Turso, lalu:

```bash
npm run db:push-turso   # buat tabel di Turso
npm run db:seed         # isi konten awal
```

Tanpa kredensial Turso, `npm run dev` dan `npm run build` akan gagal dengan pesan yang menyebutkan variabel mana yang kurang.

Perintah lain:

```bash
npm run build       # production build
npm run start       # menjalankan hasil build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

---

## Struktur folder

```
src/
├─ proxy.ts                   Cek optimistik cookie → redirect /admin (Next 16: eks-middleware)
│
├─ app/
│  ├─ layout.tsx              Root layout: HANYA html/body, font, metadata dasar
│  ├─ not-found.tsx           404 global (tanpa chrome — lihat catatan di bawah)
│  ├─ sitemap.ts / robots.ts  SEO teknis
│  ├─ opengraph-image.tsx     Gambar share sosial (di-generate)
│  ├─ globals.css             Design system RHF
│  │
│  ├─ (public)/               Website pelanggan — route group, tidak muncul di URL
│  │  ├─ layout.tsx           Header, footer, CTA WhatsApp melayang
│  │  ├─ page.tsx             Beranda — 14 section sesuai PRD §10.2
│  │  ├─ menu/page.tsx        Katalog: filter kategori, pencarian, sorting
│  │  ├─ menu/[slug]/page.tsx Detail paket + CTA WhatsApp dinamis
│  │  ├─ layanan/page.tsx     9 layanan, dikelompokkan produk vs acara
│  │  ├─ galeri/page.tsx      Grid galeri + lightbox
│  │  ├─ tentang/page.tsx     Cerita brand RHF
│  │  └─ kontak/page.tsx      Kontak, alur pemesanan, dan FAQ lengkap (#faq)
│  │
│  └─ admin/                  Panel admin — chrome sendiri, noindex
│     ├─ layout.tsx           noindex untuk seluruh /admin
│     ├─ error.tsx            Pesan jujur saat database gagal dibaca
│     ├─ login/page.tsx       Login — SENGAJA di luar (panel), tanpa sidebar
│     └─ (panel)/             Halaman setelah login
│        ├─ layout.tsx        SidebarProvider + sidebar + TooltipProvider
│        └─ page.tsx          Dashboard PRD §12.2
│
├─ components/
│  ├─ ui/                     Komponen dasar shadcn
│  ├─ brand/                  Logo mark & lockup
│  ├─ layout/                 Header, footer, tombol WhatsApp melayang
│  ├─ home/                   Section khusus beranda
│  ├─ menu/                   Kartu menu, kartu layanan, katalog interaktif
│  ├─ gallery/                Grid galeri + lightbox
│  ├─ admin/                  Form login, sidebar admin, kartu angka
│  ├─ shared/                 Section, heading, badge, placeholder, CTA, FAQ, 404
│  └─ seo/                    JSON-LD FoodEstablishment
│
├─ lib/
│  ├─ types.ts                Tipe domain, cerminan PRD §17
│  ├─ db.ts                   PrismaClient + driver adapter (wajib di Prisma 7)
│  ├─ repositories/           SATU-SATUNYA jalur baca data halaman publik
│  │  └─ mappers.ts           Baris Prisma → tipe domain
│  ├─ auth/
│  │  ├─ jwt.ts               Tanda tangan & verifikasi token (dipakai proxy juga)
│  │  ├─ session.ts           Cookie httpOnly: buat, baca, hapus
│  │  ├─ password.ts          Hash bcrypt + penyeimbang waktu respons
│  │  ├─ rate-limit.ts        Batas percobaan login, dihitung di database
│  │  ├─ dal.ts               verifySession/requireAdmin — CEK OTORITATIF
│  │  └─ actions.ts           Server action login & logout
│  ├─ admin/
│  │  ├─ navigation.ts        8 tujuan sidebar + penanda `ready`
│  │  ├─ queries.ts           Hitungan dashboard — TIDAK lewat repositories
│  │  ├─ list-queries.ts      Baca daftar & satu record, termasuk yang belum terbit
│  │  ├─ schemas.ts           Validasi Zod seluruh form admin
│  │  ├─ crud.ts              runMutation: auth + validasi + revalidate di satu tempat
│  │  └─ actions/             Server action CRUD per entitas
│  ├─ seed/                   Sumber seed awal (bukan data runtime)
│  ├─ catalog.ts              Logika filter & sort katalog (pure function)
│  ├─ whatsapp.ts             Pembuat link & template pesan WhatsApp
│  ├─ navigation.ts           Item navigasi
│  ├─ site-url.ts             Origin kanonik untuk metadata
│  └─ storage/adapter.ts      Antarmuka upload gambar (tahap 6)
│
├─ hooks/use-mobile.ts        Deteksi lebar layar untuk mode Sheet sidebar
└─ generated/prisma/          Prisma client hasil generate (tidak di-commit)

prisma/
├─ schema.prisma              Skema database, cerminan PRD §17
├─ migrations/                Riwayat migrasi
└─ seed.ts                    Mengisi database + bootstrap akun admin pertama
```

### Kenapa ada route group `(public)`

Root layout membungkus **setiap** route. Selama header, footer, dan tombol WhatsApp melayang ada di sana, `/admin` ikut mewarisinya — panel admin dengan tombol "Chat WhatsApp" pelanggan jelas salah. Jadi chrome publik dipindah ke `(public)/layout.tsx`, dan root layout tinggal `html`/`body`/font. Tanda kurung membuat nama group tidak muncul di URL, sehingga seluruh URL publik tidak berubah.

Satu jebakan yang sudah diuji: `app/not-found.tsx` **tidak boleh** merender chrome sendiri. Next.js tetap membungkus 404 dengan layout dari segment tempat `notFound()` dilempar, jadi 404 di dalam `(public)` sudah dapat chrome dari layout group — menambahkannya lagi di `not-found.tsx` membuat navbar dan footer tampil dua kali. Sebaliknya, `not-found.tsx` yang diletakkan di dalam `(public)/` tidak pernah terpakai.

### Sidebar admin — tiga hal yang mudah dirusak

Sidebar dipasang dari registry shadcn, lalu disesuaikan. Kalau suatu saat menjalankan `npx shadcn add sidebar` lagi, **jawab tidak** saat ditawari menimpa berkas berikut:

1. **`src/hooks/use-mobile.ts` ditulis ulang.** Versi bawaan memanggil `setState` di dalam `useEffect`, yang ditolak aturan `react-hooks/set-state-in-effect` di repo ini — dan aturannya benar: versi bawaan merender sekali dengan jawaban salah lalu sekali lagi dengan yang benar. Penggantinya memakai `useSyncExternalStore`, API React untuk membaca sumber eksternal seperti `matchMedia`.
2. **`TooltipProvider` wajib ada.** `Tooltip` di `components/ui/tooltip.tsx` hanya membungkus `TooltipPrimitive.Root`, tanpa provider. Sidebar merender tooltip untuk setiap tombol menu saat terlipat jadi rail, jadi tanpa provider panel admin **crash saat runtime sementara `npm run build` tetap hijau**. Providernya dipasang di `admin/(panel)/layout.tsx`, bukan root layout — situs publik tidak punya tooltip.
3. **Delapan token `--sidebar-*` di `globals.css`.** shadcn mengirimnya sebagai abu-abu netral. Tanpa dipetakan ke palet RHF, panel admin tampak seperti produk lain di sebelah situs publik yang hangat.

Satu lagi: `npx shadcn add` juga menawarkan menimpa `button.tsx`, yang memuat varian `rhf`, `rhfOutline`, `rhfOnOrange`, `rhfLg`. Menimpanya akan mengubah bentuk seluruh CTA di situs publik.

### Prinsip penting: lapisan repository

Halaman **tidak pernah** membaca sumber data secara langsung. Semua lewat `src/lib/repositories/`:

```
app/**/page.tsx  →  lib/repositories/*.ts  →  lib/db.ts  →  Turso
```

Karena tanda tangan fungsi dan tipe kembalian repository tidak berubah saat pindah ke database, tidak ada satu pun halaman atau komponen yang perlu diedit. Perbedaan bentuk data (`null` vs optional, `Date` vs ISO string, kategori dari join table) diterjemahkan di `repositories/mappers.ts`.

Admin panel sengaja **tidak** membaca lewat lapisan ini — ia harus bisa melihat data `isPublished: false` untuk diedit.

Dua aturan dipaksakan di dalam repository, bukan di pemanggilnya, supaya tidak mungkin terlewat:

1. Data dengan `isPublished: false` tidak pernah keluar dari lapisan ini.
2. Koleksi selalu terurut berdasarkan `sortOrder`.

### Nomor WhatsApp

Tidak ada satu pun komponen yang menuliskan nomor telepon secara hardcode. Semuanya membaca `getSiteSettings()`. Saat admin panel aktif, mengubah nomor di satu tempat langsung memperbarui seluruh CTA di website — sesuai PRD §18.4.

---

## Environment variables

Salin `.env.example` menjadi `.env.local`.

| Variabel | Kapan dibutuhkan | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Opsional | Origin kanonik untuk metadata, sitemap, dan JSON-LD. Di Vercel terdeteksi otomatis; isi setelah domain kustom aktif. |
| `TURSO_DATABASE_URL` | **Wajib** | URL database Turso, bentuk `libsql://nama-org.wilayah.turso.io`. Dipakai aplikasi dan skrip migrasi. |
| `TURSO_AUTH_TOKEN` | **Wajib** | Token dari `turso db tokens create <nama-db>` atau dashboard. |
| `AUTH_SECRET` | **Wajib** | Kunci penanda tangan session. `openssl rand -base64 32`. Mengubahnya membuat seluruh session yang sedang berjalan tidak valid — efektif memaksa semua admin login ulang. |
| `AUTH_URL` | Opsional | URL aplikasi. Belum dibaca kode; disiapkan untuk kebutuhan absolute URL nanti. |
| `ADMIN_EMAIL` | Sekali, saat bootstrap | Akun admin pertama, dibuat oleh `npm run db:seed`. |
| `ADMIN_INITIAL_PASSWORD` | Sekali, saat bootstrap | Password awal. Seed **tidak** menimpa password akun yang sudah ada, jadi aman dijalankan ulang. |
| `CLOUDINARY_*` | Tahap 6 | Kredensial upload gambar. Belum dibaca kode mana pun. |

---

## Database

Seluruh konten publik dibaca dari Turso (libSQL, yaitu SQLite).

```bash
npm run db:migrate      # tulis migrasi baru — terhadap prisma/dev.db
npm run db:push-turso   # terapkan migrasi yang belum jalan ke Turso
npm run db:seed         # isi konten awal dari src/lib/seed/
npm run db:studio       # lihat isi prisma/dev.db (bukan Turso)
npm run db:generate     # regenerate Prisma client setelah schema berubah
```

### Kenapa migrasi butuh dua perintah

Prisma CLI tidak bisa menghubungi Turso: `datasource` di `prisma.config.ts`
hanya menerima URL, dan schema engine-nya tidak mengerti `libsql://` maupun
bearer token. Driver adapter menyelesaikan ini untuk aplikasi saat runtime,
tapi tidak ada tempat untuk menyerahkannya ke CLI.

Jadi migrasi ditulis terhadap `prisma/dev.db` — berkas SQLite lokal yang satu-
satunya tugasnya memberi `prisma migrate dev` sesuatu untuk dibandingkan — lalu
SQL-nya diterapkan ke Turso oleh `scripts/turso-migrate.mts`. Berkas itu tidak
pernah dibaca aplikasi; `src/lib/db.ts` selalu bicara ke Turso.

**Setelah mengubah `schema.prisma`, jalankan keduanya.** `db:migrate` saja tidak
mengubah database sungguhan. Migrasi yang sudah diterapkan dicatat di tabel
`_turso_migrations`, jadi `db:push-turso` aman dijalankan berulang.

### Batasan SQLite yang membentuk skema

Tiga hal tidak ada di SQLite dan sudah diakali:

| | Cara sekarang |
|---|---|
| Tipe array | `packageItems`, `galleryImages`, `tags` disimpan sebagai JSON dalam satu kolom — lihat `src/lib/json-list.ts` |
| Enum | Kolom `role` jadi `String`; nilai sahnya di `src/lib/admin-role.ts`, dijaga Zod |
| `mode: "insensitive"` | Tidak dipakai — `LIKE` di SQLite sudah abai huruf besar-kecil untuk ASCII |

`createMany({ skipDuplicates })` juga tidak didukung; tempat yang memakainya
menghitung selisihnya lebih dulu.

Seed bersifat idempotent — aman dijalankan berulang, tidak menduplikasi baris.

`src/lib/seed/` kini hanya dipakai sebagai **sumber seed awal**, bukan lagi sumber data runtime. Dua konstanta di dalamnya masih diimpor kode karena sifatnya taksonomi dari PRD, bukan konten yang diedit admin: `PRODUCT_CATEGORY_SLUGS`/`EVENT_CATEGORY_SLUGS` (PRD §8.1) dan `CLIENT_TYPES` (copy umum saat belum ada client yang berizin — DesignRHF §21).

### Catatan Prisma 7

Prisma 7 menghapus engine Rust, sehingga client **wajib** diberi driver adapter — sebuah connection string saja tidak cukup. Lihat `src/lib/db.ts`. Datasource untuk CLI tidak lagi boleh berada di `schema.prisma`; tempatnya di `prisma.config.ts`.

### Login admin pertama kali

```bash
# 1. Isi di .env.local
AUTH_SECRET="$(openssl rand -base64 32)"
ADMIN_EMAIL=nama@domain.com
ADMIN_INITIAL_PASSWORD=<password kuat>

# 2. Buat akunnya
npm run db:seed
```

Lalu buka <http://localhost:3000/admin/login>.

Seed hanya membuat akun jika email tersebut belum ada — menjalankannya ulang setelah Anda mengganti password **tidak** akan mengembalikannya ke nilai awal.

---

## Keamanan admin

Dirancang berlapis, sesuai PRD §21:

| Lapis | Berkas | Peran |
|---|---|---|
| Cek optimistik | `src/proxy.ts` | Baca cookie, redirect. Cepat, tanpa query database. **Bukan** pengaman. |
| Cek otoritatif | `src/lib/auth/dal.ts` | `verifySession()` memuat akun dari database di tiap request. |

Server action adalah endpoint yang bisa dipanggil siapa saja, jadi menyembunyikan tombol di UI tidak mengamankan apa pun — setiap action wajib memanggil `verifySession()` sendiri.

Karena cek otoritatif membaca database (bukan sekadar mempercayai klaim di cookie), menghapus atau menurunkan peran seorang admin langsung mencabut aksesnya, tanpa menunggu token 7 hari kedaluwarsa. Ini sudah diuji.

**Detail lain:**

- Password di-hash bcrypt cost 12; tidak pernah disimpan apa adanya.
- Login gagal 5× per email dalam 15 menit → ditolak. Hitungannya di tabel `login_attempts`, bukan di memori, karena tiap instance serverless punya memori sendiri.
- Pesan error login sengaja dibuat identik untuk email tak dikenal maupun password salah, dan waktu responsnya disamakan, supaya tidak bocor email mana yang terdaftar.
- Cookie session: `httpOnly`, `sameSite=lax`, `secure` di produksi.
- `/admin` di-*disallow* di `robots.ts` **dan** diberi `noindex` — yang pertama meminta crawler tidak mengambil halaman, yang kedua memberi tahu crawler yang telanjur mengambil agar tidak mendaftarkannya.

---

## Route

### Publik — seluruhnya sudah jalan

| Route | Isi |
|---|---|
| `/` | Beranda, 14 section sesuai urutan PRD §10.2 |
| `/menu` | Katalog lengkap: filter kategori, pencarian, 4 opsi sorting |
| `/menu/[slug]` | Detail paket, CTA WhatsApp dinamis, rekomendasi paket lain |
| `/layanan` | 9 layanan, dikelompokkan berdasarkan produk dan berdasarkan acara |
| `/galeri` | Grid galeri dengan filter kategori dan lightbox |
| `/tentang` | Cerita RHF, nilai brand, perjalanan usaha |
| `/kontak` | Kontak, alur pemesanan, FAQ lengkap di anchor `#faq` |
| `/sitemap.xml`, `/robots.txt` | SEO teknis |

**Catatan IA:** PRD §11.1 mencantumkan FAQ di navbar, tetapi PRD §10.1 tidak mendefinisikan route `/faq`. Solusinya, accordion FAQ lengkap ditempatkan di `/kontak#faq` dan navbar mengarah ke sana — tanpa menambah route di luar IA yang sudah disepakati.

**Deep link kategori:** kartu layanan mengarah ke `/menu?kategori=<slug>`, dan katalog merender hasil terfilter langsung dari server sehingga URL-nya bisa dibagikan.

### Admin

| Route | Isi |
|---|---|
| `/admin/login` | Login admin |
| `/admin` | Dashboard: 5 angka konten, nomor WhatsApp aktif, pintasan |
| `/admin/kategori`, `/admin/galeri`, `/admin/testimoni`, `/admin/client`, `/admin/faq` | Daftar, masing-masing dengan `/baru` dan `/[id]` untuk tambah dan ubah |

Keduanya `noindex` dan di-*disallow* di `robots.txt`. Tamu yang membuka `/admin` dialihkan ke `/admin/login?next=…`, dan dikembalikan ke tujuan semula setelah berhasil masuk.

---

## Yang sudah selesai & TODO

### Selesai (PRD §24 poin 1–5, 15–18)

- [x] Seluruh 7 route publik, responsif mobile-first
- [x] Beranda menampilkan positioning RHF sesuai urutan section PRD §10.2
- [x] Katalog menu dengan filter kategori, pencarian, dan sorting
- [x] Halaman detail paket dengan CTA WhatsApp dinamis (nama paket + harga terisi otomatis)
- [x] Seluruh CTA WhatsApp mengarah ke `62895422734153`, dibaca dari site settings
- [x] Data `isPublished: false` tidak pernah tampil di website publik
- [x] Design system RHF diterapkan (warna, tipografi, radius, shadow, rasio 60/30/10)
- [x] SEO dasar: metadata per halaman, Open Graph, sitemap, robots, JSON-LD, alt text
- [x] Aksesibilitas: navigasi keyboard, focus ring, label form, kontras teks
- [x] Build production sukses, lint dan typecheck bersih
- [x] Skema database dan seed script (tervalidasi, belum diaktifkan)

### TODO — ronde 2 (PRD §24 poin 6–14)

- [x] Autentikasi admin (`/admin` + protected route)
- [x] Dashboard admin
- [x] CRUD: kategori, galeri, testimoni, client, FAQ
- [ ] CRUD: menu (tahap 4b — relasi kategori, kolom array, field SEO)
- [ ] Halaman site settings
- [ ] Upload gambar via Cloudinary (implementasi `StorageAdapter`)
- [x] Sambungkan repository ke Prisma
- [x] Rate limit login admin (PRD §21)

### TODO — konten (lihat `PRELAUNCH.md`)

- [ ] Foto asli produk dan acara
- [ ] Menu, harga, isi paket, dan minimal order final
- [ ] Testimoni asli — **saat ini masih placeholder**
- [ ] Nama/logo client yang sudah berizin
- [ ] Jam operasional dan akun media sosial

---

## Deploy ke Vercel

1. Push repository ke GitHub.
2. Di Vercel pilih **Add New → Project**, lalu pilih repository ini. Framework terdeteksi sebagai Next.js; build command tidak perlu diubah.
3. Isi environment variable **sebelum** deploy pertama — lihat di bawah.
4. Deploy.

Migrasi **tidak** dijalankan oleh Vercel. `prisma migrate deploy` hanya bisa
menyentuh berkas SQLite lokal, bukan Turso. Jalankan `npm run db:push-turso`
dari mesin sendiri sebelum deploy yang membawa perubahan skema.

### Wilayah database menentukan kecepatan panel admin

Tiap query ke Turso adalah satu round trip HTTP, dan satu penyimpanan di panel
admin memakai belasan query. Jarak ke database langsung terasa: dari Indonesia
ke database di `aws-us-east-1`, satu query ~340 ms dan satu simpan ~4,5 detik.

Halaman publik hampir semuanya statis, jadi pengunjung tidak merasakannya —
yang terasa adalah panel admin dan `/menu`. Kalau panel terasa lambat, samakan
wilayah database Turso dengan wilayah fungsi Vercel (bawaan Vercel `iad1`,
tetangga `aws-us-east-1`), atau pindahkan keduanya ke Singapura.

### Environment variable wajib saat build

`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, dan `AUTH_SECRET` harus sudah terisi sebelum
build, bukan hanya saat runtime: `generateStaticParams` membaca database untuk
menghasilkan halaman `/menu/[slug]`. Tanpa ketiganya build gagal, bukan
menghasilkan situs kosong. Tambahkan `AUTH_URL` dan kredensial Cloudinary juga
kalau panel admin ikut dipakai.

### Kenapa `build` menjalankan `prisma generate`

Client Prisma di-generate ke `src/generated/`, yang **tidak ikut di-commit** —
isinya turunan dari `prisma/schema.prisma` dan spesifik per platform. Karena
itu `npm run build` menghasilkannya lebih dulu; tanpa itu Vercel gagal dengan
`Module not found: ./src/generated/prisma/client` di `src/lib/db.ts`.

`postinstall` melakukan hal yang sama supaya clone baru langsung bisa dipakai
setelah `npm install`, tanpa harus ingat menjalankan `npm run db:generate`.

`prisma generate` tidak memerlukan kredensial database — ia hanya membaca schema
dan tidak pernah membuka koneksi. Datasource di `prisma.config.ts` menunjuk
berkas SQLite lokal, jadi `npm install` di Vercel tidak butuh env apa pun.

### Catatan rendering

Seluruh halaman publik di-prerender statis kecuali `/menu`, yang dirender per-request karena membaca query string untuk filter awal. Ini disengaja: hasil filter jadi bisa dibagikan lewat URL dan ter-render di server untuk SEO.

---

## Lisensi & kepemilikan

Konten, merek, dan logo adalah milik RHF Catering & Snack Box.
