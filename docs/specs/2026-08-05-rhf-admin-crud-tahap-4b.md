# Tahap 4b — CRUD Menu

**Tanggal:** 2026-08-05
**Induk:** [`2026-08-04-rhf-admin-panel-round-2-design.md`](2026-08-04-rhf-admin-panel-round-2-design.md) §7 tahap 4
**Mengacu:** PRD §12.3 (menu management), §8.2 (satu paket banyak kategori), §17.3 (data model), §21 (keamanan)

Tahap 4a membangun pola CRUD dan membuktikannya di lima entitas datar. Menu ditunda ke sini karena tiga hal yang tidak dipunyai entitas lain: relasi many-to-many lewat join table, tiga kolom `String[]`, dan harga yang boleh kosong.

> **Dokumen ini merekam dua lapis.** Bagian sampai "Temuan" menggambarkan hasil kerja pertama; **§Revisi setelah ditinjau pemilik** di bawahnya mengubah sebagian keputusan itu. Kalau keduanya berbeda, yang berlaku adalah §Revisi — beberapa baris di bawah diberi penanda.

## Yang ditambahkan

| Path | Isi |
|---|---|
| `lib/admin/schemas.ts` | `MenuItemSchema`, helper `linesToArray` — *revisi: dipecah jadi `MenuItemCreateSchema` / `MenuItemUpdateSchema`* |
| `lib/admin/actions/menu-items.ts` | Create, update, publish toggle, hapus |
| `lib/admin/list-queries.ts` | `listMenuItems`, `getMenuItem` — *revisi: `getMenuItem` dihapus, `listMenuItems` memuat record penuh* |
| `components/admin/form.tsx` | `MultiSelectField`, `FormSection` — *revisi: `MultiSelectField` diganti `CheckboxGroupField`, ditambah `SwitchField`, `PriceField`, `ImageField`* |
| `components/admin/menu-item-form.tsx` | Form 16 field dalam enam kelompok |
| `app/admin/(panel)/menu/` | `page.tsx`, `baru/`, `[id]/` — *revisi: dua yang terakhir dihapus, diganti drawer* |

Tidak ada migrasi di kerja pertama. Tabel `menu_items` dan `menu_item_categories` sudah berdiri sejak tahap 1; revisi T1 menambah satu migrasi.

## Keputusan yang perlu dicatat

**Mengganti kategori pakai transaksi eksplisit, bukan `deleteMany` bersarang.** Versi ringkasnya — `categories: { deleteMany: {}, create: [...] }` di dalam satu `update` — bergantung pada urutan Prisma menerapkan operasi bersarang, dan urutan itu tidak dijamin dokumentasi (dicek lewat context7: tidak ada contoh resminya, dan tipe hasil generate hanya membuktikan `deleteMany` *boleh* ada di sana, bukan kapan ia jalan). Kalau `create` sempat jalan lebih dulu, setiap penyuntingan akan mengosongkan kategori paket tanpa pesan error. Gantinya tiga pernyataan di dalam `db.$transaction`: update kolom skalar, hapus join row yang tidak lagi dipilih, buat yang baru dengan `skipDuplicates`. Deterministik, dan baris yang tidak berubah tidak ikut disentuh.

**Kategori wajib minimal satu.** Paket tanpa kategori tidak bisa dijangkau dari filter mana pun di `/menu`, jadi ia akan terbit dan tak terlihat sekaligus — kondisi yang paling membingungkan untuk ditelusuri pemilik.

**"Tambah paket" menolak berjalan kalau belum ada kategori.** Alih-alih menyajikan form yang pasti gagal disimpan, tampil arahan ke `/admin/kategori/baru`. (Revisi memindahkannya ke dalam drawer; perilakunya sama.)

**Kategori yang disembunyikan tetap bisa dipilih**, ditandai "(disembunyikan)" di daftar pilihan. Paket boleh disiapkan lebih dulu di bawah kategori yang belum terbit.

**`<select multiple>` native atas permintaan pemilik — ⚠️ dibatalkan di §Revisi, kini daftar checkbox.** Alternatif daftar checkbox diusulkan karena di desktop `<select multiple>` butuh Ctrl/Cmd-klik dan itu tidak bisa ditebak sendiri. Pemilik tetap memilih select. Mitigasinya: `size` diset sehingga beberapa pilihan terlihat sekaligus — multi-select setinggi satu baris tidak ada bedanya dengan dropdown biasa — dan instruksi Ctrl/Cmd ditulis di bawah field.

**Kolom array diketik sebagai baris teks**, satu baris satu item, sejalan dengan keputusan "rich text = textarea biasa" di spec induk §1. Baris kosong dibuang saat validasi, bukan disimpan: baris kosong datang dari enter berlebih dan akan jadi butir kosong di halaman detail.

**`priceLabel` tetap wajib meski `price` kosong** — ⚠️ *dibatalkan di §Revisi T1*: `priceLabel` bukan lagi kolom, melainkan dihitung dari `price` + `priceUnit`.

**`runMutation` kini juga mengenali P2003.** Kategori yang dihapus di tab lain selagi form terbuka meninggalkan id yang sudah tidak ada. Pesannya menyuruh memuat ulang halaman — "coba lagi" akan jadi saran yang salah. Fungsi `isUniqueViolation` diganti `isPrismaError(cause, code)` agar tidak beranak per kode.

## Verifikasi yang dijalankan (kerja pertama)

`npm run typecheck`, `npm run lint`, dan `npm run build` bersih; ketiga rute `/admin/menu` terbentuk.

Di browser sungguhan lewat CDP, 24 pemeriksaan, seluruhnya lulus:

- Buat paket dengan dua kategori → muncul di daftar admin dengan dua badge → muncul di `/menu` → halaman detail `/menu/<slug>` HTTP 200 memuat isi paketnya.
- Baris kosong di isi paket tidak menjadi butir kosong di halaman publik.
- Form ubah memilih ulang persis dua kategori yang tersimpan; kolom array kembali sebagai baris; harga angka utuh.
- **Uji inti:** ganti himpunan kategori (buang satu, tambah satu, satu bertahan) → muat ulang form ubah → himpunannya persis seperti yang diminta, tidak kosong. Field lain tidak ikut berubah.
- Kategori kosong ditolak dua lapis: browser menahan submit (`validity.valueMissing`), dan setelah atribut `required` dilucuti dari DOM, server tetap menolak dengan "Pilih minimal satu kategori."
- Sembunyikan → hilang dari `/menu`, halaman detail jadi 404. Hapus → hilang dari daftar admin.
- Setelah hapus: nol baris yatim di `menu_item_categories`, baik dari sisi paket maupun kategori.
- Nol error runtime di console.

## Temuan (kerja pertama)

**Validasi kategori kosong berhenti di browser lebih dulu.** `<select multiple required>` membuat `validity.valueMissing` bernilai true saat tidak ada yang dipilih, sehingga `requestSubmit()` tidak mengirim apa pun dan pesan Zod tidak pernah tampil. Ini perilaku yang benar, tapi berarti lapisan servernya tidak teruji kalau hanya diuji lewat UI. Karena itu pengujiannya melucuti `required` dari DOM lebih dulu — server action adalah endpoint publik, dan atribut HTML bukan kontrol keamanan.

## Revisi setelah ditinjau pemilik

Peninjauan menghasilkan tujuh permintaan perubahan, dipecah jadi enam task. **T1–T6 selesai**, ditambah unggah gambar ke Cloudinary yang semula dijadwalkan tahap 6 tapi ditarik maju atas permintaan pemilik.

### T1 — Gabungkan dua pasang kolom (selesai)

Migrasi `20260805120000_merge_description_and_price`.

| Sebelum | Sesudah |
|---|---|
| `shortDescription` + `description` | `description` wajib; cuplikan 160 karakter dihitung di mapper |
| `price` + `priceLabel` | `price` + `priceUnit`; label dibentuk di mapper |

Keduanya jadi **field turunan di `lib/menu-text.ts`**, bukan kolom. Alasannya sama untuk dua-duanya: dua kolom yang menyatakan hal yang sama akan berbeda isi begitu salah satunya disunting — harga diubah, labelnya tertinggal, dan tidak ada yang tahu mana yang benar. Karena `MenuItem` di `lib/types.ts` tidak berubah bentuk, **tidak ada halaman publik yang perlu disentuh** untuk penggabungan ini.

Yang ikut berubah dan sengaja:

- **Pencarian katalog membaca `description` penuh**, bukan lagi ringkasannya. Kata yang berada di luar kalimat pembuka dulu tidak pernah ketemu; diuji dengan "rundown" dan "kepedasan" — sebelumnya nol hasil, sekarang tepat satu.
- **Halaman detail menampilkan sisa deskripsi**, lewat `descriptionBody()`. Tanpa itu kalimat pembuka tercetak dua kali dalam satu halaman: sekali di header, sekali di blok "Tentang paket ini".
- **Deskripsi 12 paket disunting ulang** supaya kalimat pertamanya berdiri sendiri sebagai teks kartu. Seluruh cuplikan kini berakhir di batas kalimat, panjangnya 74–116 karakter, dan seluruh label harga identik dengan sebelum migrasi.

### Bug 4a yang ikut ketahuan dan diperbaiki

`optionalText` mengubah field kosong menjadi `undefined`, sedangkan Prisma membaca `undefined` sebagai "jangan sentuh kolom ini". Akibatnya **mengosongkan field opsional mana pun di panel tidak pernah tersimpan** — nilai lama bertahan diam-diam, di kelima entitas 4a maupun di menu. Sekarang menghasilkan `null`. `rating` di testimoni dan `icon` di kategori punya penyakit yang sama dan ikut diperbaiki.

### T2–T5 — bentuk form baru (selesai)

**Slug dikunci dengan menghilangkannya dari skema, bukan dari layar.** `MenuItemCreateSchema` menerima slug; `MenuItemUpdateSchema` tidak punya field itu sama sekali. Menyembunyikan input hanya mencegah kesalahan tak sengaja — server action adalah endpoint publik, dan slug yang dikirim ke action update tetap akan ditulis. Kalau tidak ada di skema, tidak ada yang bisa ditulis, sehingga alamat yang sudah disebar lewat WhatsApp tidak bisa dipindahkan dari bawah kaki orang yang memegang tautannya.

**Slug dibuat di server, bukan di klien**, lewat `availableSlug()` yang menambahkan `-2`, `-3` bila bentrok. Kalau slug diturunkan di browser dan bentrok, pesan "slug sudah dipakai" akan muncul di layar yang tidak punya field slug — jalan buntu. Dua paket bernama sama kini sama-sama tersimpan.

**Sukses dinyatakan, bukan disiratkan.** `runMutation` mengembalikan `{ ok: true }`; `FormState` dulu memakai `undefined` untuk sukses, dan itu tidak bisa dibedakan dari keadaan sebelum submit pertama. Drawer tidak ke mana-mana setelah simpan, jadi satu-satunya cara ia tahu harus menutup diri adalah diberi tahu. Kelima action 4a ikut menyesuaikan (`if (!result.ok) return result`) dan tetap me-`redirect` seperti sebelumnya.

**Kategori jadi checkbox** (`CheckboxGroupField`). Tanpa atribut `required` — pada checkbox itu berarti *setiap* kotak wajib dicentang — sehingga aturan "minimal satu" sepenuhnya ditegakkan server. Efek sampingnya bagus: lapisan server itu kini benar-benar teruji lewat UI biasa, tidak seperti di versi `<select multiple required>` yang selalu dicegat browser lebih dulu.

**Harga satu baris** (`PriceField`): angka + satuan, dengan pratinjau langsung label yang akan dibaca pelanggan. Pratinjaunya bukan hiasan — tanpa itu, mengosongkan harga untuk berarti "Hubungi Admin" terlihat seperti form yang belum selesai diisi.

**Tampil & unggulan jadi switch** (`SwitchField` di atas Radix). Radix merender checkbox tersembunyi di sebelahnya, jadi terkirim sebagai `"on"` dan `checkboxToBoolean` tidak berubah.

**Drawer** dibangun di atas `sheet.tsx` yang sudah ada — nol dependency baru; `vaul` tidak diperlukan karena Sheet sudah Radix Dialog yang menggeser dari tepi. `menu/baru/` dan `menu/[id]/` dihapus sesuai keputusan pemilik; keduanya kini 404, dan itu sudah disampaikan sebelum dipilih.

Satu jebakan CSS yang memakan waktu: penimpaan lebar di `SheetContent` **harus** membawa prefiks `data-[side=right]:` yang sama dengan bawaannya. `w-full sm:max-w-xl` polos kalah karena selektor atribut lebih tinggi kekhususannya, dan panel diam-diam tetap sempit.

### T6 — verifikasi

`typecheck`, `lint`, `build` bersih. Di browser sungguhan, **31 pemeriksaan, seluruhnya lulus**, termasuk:

- Slug: nama diubah → alamat tetap sama persis. Field slug tidak ada di DOM.
- Drawer menutup sendiri 2 detik setelah simpan, tanpa navigasi, dan baris baru muncul di daftar.
- Switch dimatikan → tersimpan sebagai disembunyikan; dinyalakan lagi → tampil.
- Kategori: 9 checkbox, dua tercentang tanpa Ctrl/Cmd; disunting → himpunan tepat, tidak terhapus.
- Tanpa kategori → ditolak server, drawer tetap terbuka dengan pesannya.
- `/admin/menu/baru` dan `/admin/menu/xyz` → 404. Kelima halaman 4a → 200.
- Nol error runtime.

Ditemukan saat verifikasi: teks bantuan field deskripsi tertulis "kalimat pertama tampil di kartu", padahal `excerpt()` mengambil **kalimat utuh sebanyak yang muat dalam 160 karakter** — deskripsi berkalimat pendek membawa kalimat kedua ikut serta. Teksnya diperbaiki, dan pratinjau di bawah field menampilkan hasil sebenarnya.

### Unggah gambar ke Cloudinary — ditarik maju dari tahap 6

**Berkasnya tidak pernah melewati server kita.** Memilih berkas meminta tanda tangan ke server action, lalu browser mengirim berkasnya langsung ke Cloudinary; hanya URL hasilnya yang kembali masuk ke form lewat input tersembunyi.

Rute "jelas" — kirim berkas ke server action, server yang meneruskan — **tidak bisa dipakai di produksi**. Next membatasi body server action di 1 MB secara bawaan, dan Vercel membatasi body request function di 4,5 MB tanpa cara menaikkannya. Foto dari HP berukuran 3–8 MB, jadi justru berkas yang akan pemilik unggah-lah yang ditolak rute itu. Unggah langsung juga memangkas separuh bandwidth dan tidak menahan function selama proses berlangsung.

**Tanpa SDK `cloudinary`** meski spec induk §6 sempat merencanakannya: unggahan bertanda tangan hanya perlu satu SHA-1 dan satu POST, dan POST-nya terjadi di browser. SDK-nya akan jadi dependency yang dibawa hanya untuk hash yang sudah dipunyai Node.

**Batas keamanannya ada di `requestUploadSignature`.** Tanda tangan adalah surat kuasa menulis ke akun Cloudinary, jadi `verifySession()` di sana bukan formalitas melainkan seluruh kontrolnya. Folder dipilih dari daftar tetap `UPLOAD_FOLDERS`, tidak pernah dari pemanggil — folder yang boleh ditentukan pemanggil berarti apa pun yang bisa menjangkau action itu bisa menulis ke mana saja di akun.

**Foto lama tidak dihapus saat diganti**, atas keputusan pemilik. Menghapus otomatis berarti URL yang pernah disalin ke tempat lain ikut mati dan tidak bisa dikembalikan; berkas menganggur bisa dibersihkan manual dari dasbor Cloudinary kapan saja.

**`next.config.ts` menambah `images.remotePatterns`** untuk `res.cloudinary.com`. Tanpa itu `next/image` menolak merender setiap foto yang diunggah. (`images.domains` sudah dihapus di Next 16.)

Dipasang di kelima field gambar: foto utama dan foto tambahan paket, foto galeri, foto testimoni, logo client. `MultiImageField` mengunggah berurutan, bukan paralel — HP di jaringan seluler yang mengunggah enam foto 5 MB sekaligus cenderung macet semua alih-alih menyelesaikan satu pun.

Diuji end-to-end di browser sungguhan dengan berkas nyata lewat `DOM.setFileInputFiles`, **14 pemeriksaan lulus**: tanda tangan diterima Cloudinary, berkas mendarat di `rhf/menu`, pratinjau termuat, unggah banyak berkas sekaligus, URL kembali utuh dari database setelah disimpan, dan katalog publik merender fotonya lewat optimizer `next/image`. Seluruh berkas uji dihapus lagi dari akun setelahnya.

## Yang sengaja tidak dikerjakan

- Pengurutan seret-lepas — `sortOrder` tetap diisi angka, sama seperti 4a.
- Pencarian dan filter di daftar menu — 12 paket masih muat dalam satu layar; PRD §12.3 tidak memintanya.
- Toggle "unggulan" langsung dari baris daftar. Statusnya terlihat sebagai bintang, tapi mengubahnya lewat form, konsisten dengan pola 4a.
- **Utang `PRODUCT_CATEGORY_SLUGS` dari 4a masih terbuka.** Kategori bikinan admin tetap tidak muncul di `/layanan`. Tidak disentuh di tahap ini karena perbaikannya butuh migrasi dan keputusan pemilik.
