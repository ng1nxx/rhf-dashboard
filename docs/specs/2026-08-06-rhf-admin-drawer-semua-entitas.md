# Drawer untuk keenam entitas admin

**Tanggal:** 2026-08-06
**Induk:** [`2026-08-04-rhf-admin-panel-round-2-design.md`](2026-08-04-rhf-admin-panel-round-2-design.md)
**Mengacu:** PRD §15.3, revisi tahap 4b (§Revisi di spec 4b)

Menu sudah memakai drawer sejak revisi 4b. Lima entitas sisanya — kategori,
galeri, testimoni, client, FAQ — masih membuka halaman terpisah untuk tambah
dan ubah. Sekarang keenamnya memakai pola yang sama, dan sepuluh rute
`/baru` dan `/[id]` dihapus.

## Layar daftar cuma ada satu bentuk

Keenam layar itu sebetulnya layar yang sama: judul dengan satu tombol, tabel
yang bisa dicari dan berpaginasi, dan panel samping berisi formulir. Yang
berbeda hanya kolomnya dan formulirnya. Jadi bentuknya diselesaikan sekali di
`components/admin/record-list.tsx`, dan tiap entitas hanya menyediakan dua hal:
cara menggambar satu baris, dan formulir mana yang dibuka.

| Path | Isi |
|---|---|
| `components/admin/record-list.tsx` | `RecordList` — rangka + keadaan buka/tutup, klien |
| `components/admin/<entitas>-manager.tsx` | Baris & sambungan formulir per entitas |
| `components/admin/form.tsx` | `useRecordForm` — menyambung aksi server ke drawer |
| `components/admin/row-actions.tsx` | `RowActions` — sel aksi terakhir tiap baris |

Halaman rutenya kini tinggal tiga langkah: otorisasi, baca, serahkan.

## Keputusan yang perlu dicatat

**Aksi server tidak lagi `redirect()`.** Kelima entitas dulu mengarahkan ke
daftar setelah menyimpan. Di dalam drawer tidak ada tujuan untuk dituju —
mengarahkan justru memuat ulang halaman yang orangnya sedang lihat. Sekarang
aksinya mengembalikan hasil `runMutation`, dan `{ ok: true }` itulah yang
menutup panel. Efek sampingnya bagus: kesalahan validasi kini menyisakan panel
terbuka dengan isian yang sudah diketik, bukan halaman yang ter-reset.

**Formulir di-*remount* saat target berganti.** Isian tidak terkontrol dan
diisi lewat `defaultValue`, yang hanya dibaca React saat mount. Tanpa `key`,
mengklik baris kedua akan menampilkan nilai baris pertama di formulir yang
kelihatannya benar — kesalahan yang tidak menimbulkan error apa pun dan baru
ketahuan setelah tersimpan. Diuji langsung, bukan diasumsikan.

**Tidak ada lagi pembacaan satu record.** `getCategory`, `getFaq`,
`getGalleryItem`, `getTestimonial`, dan `getClient` dihapus. Drawer menyunting
baris yang sudah ada di layar, jadi datanya sudah ikut terbawa bersama
halamannya; query kedua hanya mengambil ulang apa yang sudah dipegang browser.

**Rute lama dihapus, bukan dialihkan.** `/admin/kategori/baru` dan
sebangsanya kini 404. Menyisakannya sebagai halaman kedua yang bisa menyunting
data yang sama berarti dua jalur yang harus dijaga tetap sama selamanya.

**Tombol "Tampilkan di website" jadi switch di semua entitas.** Pemilik sudah
meminta ini di revisi 4b poin 6 dan waktu itu baru terpasang di menu. Kotak
centang terbaca sebagai "centang untuk menyertakan ini dalam kiriman"; switch
terbaca sebagai keadaan barangnya sendiri — dan itulah yang sebenarnya. Radix
tetap mengirimkannya seperti checkbox, jadi tidak ada yang berubah di sisi
server. `CheckboxField` ikut dihapus karena tidak lagi terpakai.

**Peringatan izin client tetap di atas tabel, bukan di dalam formulir.**
DesignRHF §21 mengatur boleh-tidaknya sebuah baris ditampilkan sama sekali,
bukan cara satu field diisi. `RecordList` punya slot `notice` untuk itu.

## Yang diperiksa di browser

**33 pemeriksaan lulus**, ditambah **7 pemeriksaan unggah gambar**. Yang paling
penting:

- Membuka dan menyimpan lewat drawer **tidak menavigasi** — URL daftar tidak
  berubah sama sekali.
- Setelah menyimpan, ringkasan di bawah tabel naik 10 → 11 di tempat: daftar di
  belakang panel benar-benar dimuat ulang dari server.
- Membuka baris kedua menampilkan **nilainya sendiri**, bukan sisa baris
  pertama.
- Isian ditolak server → panel tetap terbuka, pesan muncul, ketikan tidak
  hilang.
- Switch dimatikan tersimpan sebagai `Disembunyikan`; dinyalakan jadi `Tampil`.
- Unggah Cloudinary jalan **dari dalam drawer** — input file berada di portal
  Radix dengan focus trap, dan panel tetap terbuka selama unggahan.
- Kelima rute `/baru` lama mengembalikan 404.
- Paginasi, pencarian di database, peringatan hapus kategori, dan urutan
  record baru (maks seluruh tabel + 1) semuanya masih utuh.

Seluruh record dan aset uji dihapus kembali; jumlah akhir sama dengan sebelum
pengujian.

## Yang sengaja tidak dikerjakan

- **Menyatukan `<CategoryForm>` dkk. jadi satu formulir generik** — fieldnya
  benar-benar berbeda, dan menyeragamkannya akan menyembunyikan aturan khusus
  seperti default "belum ada izin" milik client.
- **Slug kategori tetap bisa disunting.** Untuk menu, slug dikunci atas
  permintaan pemilik. Kategori belum pernah dibahas, dan mengubahnya diam-diam
  akan mematikan tautan `/menu?kategori=…` yang sudah tersebar — perlu keputusan
  pemilik lebih dulu.
