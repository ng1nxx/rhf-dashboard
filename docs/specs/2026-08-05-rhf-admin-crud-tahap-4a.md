# Tahap 4a — CRUD lima entitas datar

**Tanggal:** 2026-08-05
**Induk:** [`2026-08-04-rhf-admin-panel-round-2-design.md`](2026-08-04-rhf-admin-panel-round-2-design.md) §7 tahap 4
**Mengacu:** PRD §12.4 (kategori), §12.5 (galeri), §12.6 (testimoni), §12.7 (client), §12.8 (FAQ), §15.3 (komponen admin), §21 (keamanan)

Tahap 4 dipecah dua. **4a** membangun pola CRUD bersama lalu membuktikannya di lima entitas datar. **4b** menangani Menu, yang punya relasi many-to-many ke kategori, tiga kolom array, harga opsional, dan field SEO.

## Pola yang dibangun

Semua mutasi lewat `runMutation` di `lib/admin/crud.ts`, sehingga tiga hal yang tidak boleh terlupa terjadi di satu tempat:

1. `verifySession()` — server action adalah endpoint publik.
2. Validasi Zod — PRD §21.
3. `revalidatePath("/", "layout")` — supaya perubahan sampai ke halaman statis.

Revalidasi sengaja memakai versi tumpul. Menghitung persis halaman mana yang terdampak berarti menyalin pengetahuan yang sudah ada di komponen halaman ke tempat kedua, dan salah sedikit berarti pelanggan melihat harga minggu lalu. Situs ini 25 halaman dan perubahan jarang, jadi kebenaran menang atas presisi.

## Struktur

| Path | Isi |
|---|---|
| `lib/admin/schemas.ts` | Zod lima entitas + `slugify` |
| `lib/admin/crud.ts` | `runMutation`, `runSimpleMutation`, `revalidatePublicSite` |
| `lib/admin/list-queries.ts` | Baca daftar dan satu record, termasuk yang belum terbit |
| `lib/admin/actions/*.ts` | Lima berkas action, satu per entitas |
| `components/admin/admin-page.tsx` | Header, tabel, baris, badge status, empty state |
| `components/admin/row-actions.tsx` | Publish toggle, edit, hapus + dialog konfirmasi |
| `components/admin/form.tsx` | Field text/textarea/select/checkbox, `FormShell` |
| `components/admin/*-form.tsx` | Lima form, dipakai bersama oleh halaman tambah dan ubah |
| `app/admin/(panel)/<entitas>/` | `page.tsx` (daftar), `baru/`, `[id]/` |

## Keputusan yang perlu dicatat

- **Admin tidak membaca lewat `lib/repositories/`.** Lapisan itu membuang `isPublished: false`, yang membuat data tersembunyi mustahil diedit atau dihitung.
- **Halaman terpisah, bukan dialog.** Bisa di-deep-link, tidak ada state yang harus dijaga, dan lebih nyaman di layar HP.
- **`<select>` native, bukan Select shadcn.** Milik shadcn merender listbox yang tidak ikut terkirim bersama form; native juga memunculkan picker bawaan di HP.
- **Client tidak pernah default terbit.** DesignRHF §21 melarang menampilkan nama atau logo client tanpa izin, jadi centangnya harus tindakan sadar.
- **Dialog hapus menyebut nama record**, dan untuk kategori menyebut berapa paket yang akan kehilangan label itu — hapus adalah satu-satunya aksi yang tidak bisa dibatalkan.
- **Ikon kategori dibaca dari kolom `icon`**, bukan ditebak dari nama, supaya mengubah ikon di form terlihat efeknya di daftar.

## Keterbatasan yang ditemukan saat verifikasi

**Kategori baru tidak akan muncul di `/layanan`.** Halaman itu memakai `getProductCategories()` dan `getEventCategories()`, yang menyaring berdasarkan `PRODUCT_CATEGORY_SLUGS` dan `EVENT_CATEGORY_SLUGS` — dua daftar slug hardcoded dari PRD §8.1. Kategori bikinan admin tidak ada di daftar itu.

Sudah diuji: kategori baru muncul di filter `/menu`, tapi nol kemunculan di `/layanan`.

Perbaikannya perlu keputusan pemilik, jadi tidak dikerjakan diam-diam. Usulan: tambah kolom `group` (`PRODUCT` | `EVENT` | `NONE`) di `MenuCategory`, jadikan dropdown di form kategori, dan ubah kedua fungsi repository agar membaca kolom itu alih-alih daftar slug. Satu migrasi, satu field, dua fungsi.

## Verifikasi yang dijalankan

Untuk kelima entitas, di browser sungguhan: buat → muncul di daftar admin → muncul di situs publik → sembunyikan → hilang dari situs publik → hapus → hilang dari daftar. Ditambah validasi form kosong ditolak, dan tidak ada error runtime.

Catatan hasil: testimoni baru tidak muncul di beranda karena beranda memang hanya menampilkan `testimonials.slice(0, 3)` dan sudah ada tiga yang terbit — perilaku benar, bukan cacat.

## Yang sengaja tidak dikerjakan

- CRUD Menu — tahap 4b.
- Upload gambar — tahap 6. Sementara ini field URL diisi manual.
- Pengurutan seret-lepas — kolom `sortOrder` diisi angka; PRD §12 hanya meminta "set urutan tampil".
