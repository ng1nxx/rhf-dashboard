# PRD Website RHF Catering & Snack Box

**Nama Produk:** Website Company Profile, Katalog Menu, dan Inquiry WhatsApp RHF Catering & Snack Box  
**Brand:** RHF Catering & Snack Box  
**Tagline Utama:** Mengutamakan Rasa  
**Versi Dokumen:** v1.1 — Revised  
**Tanggal:** 04 Agustus 2026  
**Status:** Siap masuk tahap development MVP dengan beberapa data konten diisi melalui Admin Panel  
**Related Document:** `design_rhf_catering.md`  
**Tech Stack Dipilih:** Next.js + Tailwind CSS + Shadcn UI + Vercel  

---

## 1. Ringkasan Produk

Website **RHF Catering & Snack Box** adalah website resmi untuk memperkenalkan layanan catering RHF kepada calon pelanggan di **Kabupaten Tegal, Jawa Tengah**. Website ini berfungsi sebagai katalog menu lengkap, media pembangun kepercayaan, galeri portofolio, dan pintu utama pemesanan melalui WhatsApp.

RHF memiliki cerita brand yang kuat: nama **RHF** berasal dari nama anak pemilik, yaitu **Rafi, Hafizh, dan Fatih**. Usaha ini berangkat dari awal melalui jualan sederhana menggunakan gerobak, lalu berkembang hingga menerima berbagai pesanan seperti snack box, nasi box, prasmanan, makan siang, dan pesanan dari client/instansi.

Fokus utama website adalah membuat RHF terlihat **profesional untuk client dinas/kantor**, sekaligus memudahkan calon pelanggan melihat **katalog menu lengkap** dan langsung melakukan inquiry melalui WhatsApp.

---

## 2. Informasi Brand yang Sudah Dikonfirmasi

| Item | Data |
|---|---|
| Nama brand website | RHF Catering & Snack Box |
| Lokasi usaha | Kabupaten Tegal, Jawa Tengah |
| Area layanan | Satu kabupaten/kota, fokus Kabupaten Tegal |
| WhatsApp pemesanan | 0895422734153 |
| Bahasa website | Bahasa Indonesia semi-formal, ramah, tetap profesional |
| Warna brand | Mengikuti design system RHF sebelumnya |
| Tech stack | Next.js + Tailwind CSS + Shadcn UI + Vercel |
| Admin panel | Perlu admin panel custom |
| Harga | Tampilkan katalog paket lengkap |
| Sistem order | Customer langsung chat WhatsApp |
| Sistem pembayaran | Belum ada aturan tetap, dikonfirmasi manual oleh admin |

---

## 3. Referensi Website

Referensi digunakan sebagai inspirasi struktur informasi, trust section, katalog, galeri, dan CTA. Website RHF tidak perlu meniru visual referensi secara langsung.

1. **Umara Catering** — inspirasi struktur layanan, produk, brand story, certification/trust section, client trust, dan contact/CTA.
2. **Sarasa** — inspirasi kategori produk seperti nasi kotak, snack box, promo, filter produk, testimoni, dan CTA chat admin.
3. **Medina Catering** — inspirasi positioning profesional, layanan berdasarkan jenis acara, testimonial, corporate client, gallery, dan penekanan kualitas dapur/higienitas.

---

## 4. Tujuan Produk

### 4.1 Tujuan Bisnis

1. Membuat RHF Catering & Snack Box terlihat lebih profesional untuk calon client dinas, kantor, sekolah, komunitas, dan acara keluarga.
2. Menampilkan katalog paket lengkap agar calon pelanggan bisa memahami pilihan menu sebelum menghubungi admin.
3. Meningkatkan kepercayaan melalui cerita brand, galeri makanan, testimoni, dan daftar client/instansi yang pernah dilayani.
4. Mengarahkan calon pelanggan untuk melakukan pemesanan atau konsultasi langsung melalui WhatsApp.
5. Memudahkan pemilik/admin memperbarui menu, harga, galeri, testimoni, client, dan FAQ melalui admin panel custom.
6. Menjadi media digital resmi yang bisa dicantumkan di WhatsApp Business, Instagram, banner, kartu nama, proposal, dan katalog offline.

### 4.2 Tujuan Pengguna

Calon pelanggan harus dapat:

1. Memahami layanan RHF dalam waktu kurang dari 10 detik.
2. Melihat kategori layanan yang tersedia.
3. Melihat katalog menu/paket lengkap beserta harga, isi paket, dan minimal order.
4. Melihat bukti kepercayaan seperti client/instansi, testimoni, dan galeri.
5. Mengetahui bahwa RHF melayani area Kabupaten Tegal.
6. Menghubungi WhatsApp RHF dengan mudah dari semua halaman.
7. Mengajukan pertanyaan atau pesanan tanpa harus membuat akun.

---

## 5. Non-Goals / Bukan Scope MVP

Untuk MVP v1, website **tidak perlu** memiliki:

1. Login customer.
2. Cart/checkout online seperti marketplace.
3. Payment gateway.
4. Tracking pesanan real-time.
5. Manajemen stok bahan makanan.
6. Sistem promo otomatis kompleks.
7. Multi-cabang.
8. Aplikasi mobile native.
9. Integrasi akuntansi.
10. Sistem invoice otomatis.

Catatan: karena sistem order yang dipilih adalah **langsung chat WhatsApp**, maka website hanya perlu mengirimkan pesan inquiry yang rapi ke WhatsApp admin, bukan memproses pembayaran atau checkout.

---

## 6. Target User / Persona

### 6.1 Client Dinas / Instansi

**Kebutuhan:** konsumsi rapat, snack box kegiatan, nasi box acara, prasmanan untuk kegiatan resmi.  
**Pain Point:** butuh vendor yang rapi, terpercaya, responsif, dan terlihat profesional.  
**Yang Harus Dijawab Website:** layanan, katalog, harga, pengalaman client, testimoni, area layanan, dan kontak WhatsApp.

### 6.2 Kantor / Perusahaan

**Kebutuhan:** makan siang, snack meeting, coffee break, paket event kantor.  
**Pain Point:** butuh menu jelas, pengiriman aman, packaging rapi, dan admin mudah dihubungi.  
**Yang Harus Dijawab Website:** paket rapat/dinas, menu favorit, minimal order, dan CTA WhatsApp.

### 6.3 Sekolah / Panitia Acara

**Kebutuhan:** snack box, nasi box, konsumsi kegiatan sekolah, rapat guru, lomba, atau acara murid.  
**Pain Point:** budget menyesuaikan, jumlah pesanan banyak, butuh menu praktis dan rapi.  
**Yang Harus Dijawab Website:** paket sekolah, harga, pilihan menu, minimal order, dan fleksibilitas pesanan.

### 6.4 Pelanggan Keluarga

**Kebutuhan:** prasmanan, nasi box, snack box untuk pengajian, syukuran, aqiqah, ulang tahun, pernikahan, atau acara keluarga.  
**Pain Point:** ingin makanan enak, porsi pas, harga jelas, dan proses pesan mudah.  
**Yang Harus Dijawab Website:** kategori acara keluarga, galeri, testimoni, FAQ, dan tombol WhatsApp.

---

## 7. Positioning dan Pesan Utama

### 7.1 Positioning

> RHF Catering & Snack Box adalah layanan catering keluarga di Kabupaten Tegal yang mengutamakan rasa, kerapian, dan pelayanan amanah untuk kebutuhan snack box, nasi box, prasmanan, coffee break, acara dinas, sekolah, pengajian, pernikahan, hingga aqiqah.

### 7.2 Key Message

1. **Mengutamakan Rasa** sebagai janji utama brand.
2. Dirintis dari usaha keluarga dan tumbuh karena kepercayaan pelanggan.
3. Cocok untuk acara keluarga, kantor, sekolah, komunitas, instansi, dan dinas.
4. Makanan enak, rapi, bersih, dan mudah dipesan.
5. Area layanan fokus di Kabupaten Tegal.

### 7.3 Tone of Voice

Bahasa website harus:

- Semi-formal.
- Ramah.
- Profesional.
- Tidak terlalu kaku.
- Mudah dipahami oleh pelanggan umum.
- Tetap pantas untuk client dinas/kantor.

Contoh gaya copy:

> RHF Catering & Snack Box siap membantu kebutuhan konsumsi acara Anda, mulai dari snack box, nasi box, coffee break, hingga prasmanan. Kami mengutamakan rasa, kerapian penyajian, dan pelayanan yang amanah.

---

## 8. Layanan Utama

Layanan yang wajib tersedia di website:

1. Snack Box.
2. Nasi Box.
3. Prasmanan.
4. Coffee Break.
5. Paket Rapat/Dinas.
6. Paket Sekolah.
7. Pengajian/Syukuran.
8. Pernikahan.
9. Aqiqah.

### 8.1 Struktur Kategori Layanan

Agar katalog tidak membingungkan, layanan dibagi menjadi dua kelompok:

#### A. Berdasarkan Produk

- Snack Box
- Nasi Box
- Prasmanan
- Coffee Break

#### B. Berdasarkan Kebutuhan Acara

- Paket Rapat/Dinas
- Paket Sekolah
- Pengajian/Syukuran
- Pernikahan
- Aqiqah

### 8.2 Catatan UX

- Kategori acara boleh menampilkan paket/menu yang sama dengan kategori produk, tetapi secara konteks dikemas ulang.
- Contoh: satu menu nasi box dapat masuk kategori **Nasi Box**, **Paket Rapat/Dinas**, dan **Paket Sekolah**.
- Admin panel harus mendukung satu menu masuk ke beberapa kategori/tag.

---

## 9. Platform & Device Support

Website harus responsive untuk:

1. Mobile phone.
2. Tablet.
3. Desktop/laptop.

Prioritas desain: **mobile-first**, karena calon pelanggan kemungkinan membuka link dari WhatsApp, Instagram, atau Google melalui HP.

---

## 10. Information Architecture

### 10.1 Struktur Halaman MVP

MVP menggunakan pendekatan multi-page sederhana agar profesional dan mudah dikembangkan:

1. `/` — Home / landing page utama.
2. `/menu` — Katalog menu lengkap.
3. `/menu/[slug]` — Detail paket/menu.
4. `/layanan` — Layanan berdasarkan kebutuhan.
5. `/galeri` — Galeri makanan dan acara.
6. `/tentang` — Cerita RHF.
7. `/kontak` — Kontak dan CTA WhatsApp.
8. `/admin` — Admin panel custom.

### 10.2 Struktur Section Home

Urutan section home:

1. Header / Navbar.
2. Hero Section.
3. Quick Trust Highlights.
4. Kategori Layanan.
5. Menu/Paket Unggulan.
6. Kenapa Memilih RHF.
7. Cerita RHF.
8. Galeri Preview.
9. Client / Dipercaya Oleh.
10. Testimoni.
11. Alur Pemesanan WhatsApp.
12. FAQ Preview.
13. Final CTA.
14. Footer.

---

## 11. Functional Requirements — Public Website

### 11.1 Header / Navbar

**Deskripsi:** Navigasi utama website.

**Elemen:**

- Logo RHF Catering & Snack Box.
- Menu navigasi:
  - Beranda
  - Layanan
  - Menu
  - Galeri
  - Tentang
  - FAQ
  - Kontak
- Tombol CTA utama: `Pesan via WhatsApp`.
- Mobile hamburger menu.

**Requirement:**

- Header sticky di desktop dan mobile.
- CTA WhatsApp selalu terlihat jelas.
- Mobile menu mudah dibuka/tutup.
- Active section/page state terlihat.

**Acceptance Criteria:**

- User dapat berpindah halaman/section dengan jelas.
- User dapat klik CTA dan langsung membuka WhatsApp.
- Navbar tidak pecah di layar mobile.

---

### 11.2 Hero Section

**Tujuan:** Dalam 10 detik, user memahami RHF melayani catering dan snack box di Kabupaten Tegal.

**Konten:**

- Headline:
  > RHF Catering & Snack Box Kabupaten Tegal

- Subheadline:
  > Pilihan snack box, nasi box, coffee break, dan prasmanan untuk acara keluarga, sekolah, kantor, hingga dinas. Mengutamakan rasa, kerapian, dan pelayanan yang amanah.

- CTA utama:
  > Pesan via WhatsApp

- CTA sekunder:
  > Lihat Katalog Menu

- Visual:
  - Foto makanan asli RHF jika sudah tersedia.
  - Jika belum tersedia, gunakan placeholder profesional sementara.

**Acceptance Criteria:**

- Hero tampil rapi di mobile.
- CTA WhatsApp berfungsi.
- CTA katalog mengarah ke `/menu`.
- Pesan utama jelas tanpa teks berlebihan.

---

### 11.3 Quick Trust Highlights

**Tujuan:** Membangun kepercayaan secara cepat.

**Konten rekomendasi:**

- Melayani Kabupaten Tegal.
- Cocok untuk dinas, kantor, sekolah, dan acara keluarga.
- Katalog menu lengkap.
- Pesan mudah via WhatsApp.
- Mengutamakan rasa dan kerapian.

**Acceptance Criteria:**

- Ditampilkan sebagai 3–5 badge/card ringkas.
- Tidak membuat layout ramai.

---

### 11.4 Layanan Utama

**Tujuan:** Menampilkan semua layanan yang diterima RHF.

**Kategori wajib:**

1. Snack Box.
2. Nasi Box.
3. Prasmanan.
4. Coffee Break.
5. Paket Rapat/Dinas.
6. Paket Sekolah.
7. Pengajian/Syukuran.
8. Pernikahan.
9. Aqiqah.

**Elemen tiap card:**

- Icon sederhana.
- Nama layanan.
- Deskripsi 1–2 kalimat.
- Tombol `Lihat Paket` atau `Konsultasi`.

**Acceptance Criteria:**

- Semua layanan tampil di home dan halaman layanan.
- Klik layanan dapat memfilter katalog menu berdasarkan kategori/tag.

---

### 11.5 Katalog Menu Lengkap

**Tujuan:** Menampilkan paket lengkap beserta harga.

**Fitur katalog:**

- List produk/menu dalam card.
- Filter kategori.
- Search nama menu.
- Sort opsional:
  - Terbaru.
  - Harga termurah.
  - Harga tertinggi.
  - Rekomendasi.
- Badge:
  - Best Seller.
  - Rekomendasi.
  - Cocok untuk Rapat.
  - Cocok untuk Sekolah.

**Data tiap menu:**

- Nama menu/paket.
- Kategori.
- Foto.
- Harga.
- Label harga, contoh: `Rp15.000/box`, `Mulai Rp35.000/pax`, atau `Hubungi Admin`.
- Isi paket/menu.
- Minimal order.
- Deskripsi singkat.
- Status publish/unpublish.
- CTA `Pesan Paket Ini`.

**Acceptance Criteria:**

- User dapat melihat semua paket aktif.
- User dapat filter berdasarkan kategori.
- User dapat klik card untuk membuka detail.
- Harga tampil sesuai data admin.
- Menu yang nonaktif tidak tampil di public website.

---

### 11.6 Detail Paket/Menu

**Tujuan:** Memberi informasi lengkap sebelum user chat WhatsApp.

**Konten detail:**

- Nama paket/menu.
- Foto utama.
- Galeri foto tambahan opsional.
- Harga.
- Isi paket.
- Cocok untuk acara apa.
- Minimal order.
- Area layanan: Kabupaten Tegal.
- Catatan pesanan.
- CTA `Pesan via WhatsApp`.
- Rekomendasi paket lain.

**Template WhatsApp dinamis:**

```text
Halo RHF Catering & Snack Box, saya mau tanya/pesan paket berikut:

Nama Paket: {{menu_name}}
Harga: {{price_label}}
Jumlah Pesanan: 
Tanggal Acara: 
Lokasi Acara: 
Catatan: 
```

**Acceptance Criteria:**

- Klik CTA membuka WhatsApp ke nomor `62895422734153`.
- Pesan WhatsApp otomatis berisi nama paket dan harga.
- Detail tetap rapi di mobile.

---

### 11.7 Galeri Makanan & Acara

**Tujuan:** Menampilkan bukti visual kualitas makanan, packaging, dan acara.

**Kategori galeri:**

- Snack Box.
- Nasi Box.
- Prasmanan.
- Coffee Break.
- Event/Dinas.
- Dapur/Proses.

**Requirement:**

- Galeri dapat dikelola dari admin panel.
- Foto dapat diberi kategori dan caption.
- Foto dapat diset publish/unpublish.

**Acceptance Criteria:**

- Galeri tampil sebagai grid responsive.
- Klik foto dapat membuka lightbox/modal.
- Admin dapat menambah, mengubah, menghapus, dan mengurutkan galeri.

---

### 11.8 Testimoni

**Tujuan:** Membangun social proof dari pelanggan.

**Data testimoni:**

- Nama pelanggan.
- Tipe pelanggan, contoh: kantor, sekolah, keluarga, dinas.
- Isi testimoni.
- Rating opsional.
- Foto opsional.
- Status publish/unpublish.

**Acceptance Criteria:**

- Testimoni tampil di home dan halaman khusus jika diperlukan.
- Admin dapat CRUD testimoni.
- Testimoni bisa diurutkan.

---

### 11.9 Client / Instansi yang Pernah Pesan

**Tujuan:** Menampilkan bukti kepercayaan, terutama untuk target dinas/kantor.

**Data client:**

- Nama client/instansi.
- Logo opsional.
- Kategori client, contoh: dinas, sekolah, kantor, komunitas.
- Status publish/unpublish.

**Catatan penting:**

- Jika belum punya izin menampilkan logo/nama client, tampilkan versi umum seperti:
  > Dipercaya untuk berbagai kegiatan kantor, sekolah, komunitas, dan instansi di Kabupaten Tegal.

**Acceptance Criteria:**

- Client yang publish tampil di home.
- Jika belum ada data client, section tidak kosong; tampilkan copy general.
- Admin dapat CRUD client.

---

### 11.10 FAQ

**Tujuan:** Mengurangi pertanyaan berulang.

**FAQ awal yang disarankan:**

1. Apakah RHF melayani area luar Kabupaten Tegal?
2. Berapa minimal order snack box/nasi box/prasmanan?
3. Apakah bisa request menu?
4. Apakah harga bisa menyesuaikan budget?
5. Bagaimana cara pesan?
6. Apakah bisa pesan untuk dinas/kantor/sekolah?
7. Kapan batas maksimal pemesanan?
8. Bagaimana sistem pembayaran?
9. Apakah tersedia pengiriman?
10. Apakah bisa konsultasi dulu sebelum pesan?

**Acceptance Criteria:**

- FAQ tampil dalam accordion.
- Admin dapat CRUD FAQ.
- FAQ dapat diurutkan.

---

### 11.11 Alur Pemesanan

**Alur yang dipakai:** Customer langsung chat WhatsApp.

**Alur display di website:**

1. Pilih menu/paket di katalog.
2. Klik tombol `Pesan via WhatsApp`.
3. Isi jumlah pesanan, tanggal acara, dan lokasi.
4. Admin RHF mengonfirmasi detail, harga, dan ketersediaan.
5. Sistem pembayaran/DP dikonfirmasi langsung oleh admin.
6. Pesanan diproses dan dikirim sesuai kesepakatan.

**Acceptance Criteria:**

- Alur tampil di home dan halaman kontak.
- Tidak ada form panjang yang membuat user ragu.
- Semua CTA utama mengarah ke WhatsApp.

---

### 11.12 Footer

**Elemen:**

- Logo RHF Catering & Snack Box.
- Deskripsi singkat.
- Area layanan: Kabupaten Tegal, Jawa Tengah.
- WhatsApp: 0895422734153.
- Link navigasi.
- Link social media jika tersedia.
- Jam operasional jika tersedia.
- Copyright.

**Acceptance Criteria:**

- Footer tampil lengkap di semua halaman.
- Kontak mudah diklik di mobile.

---

## 12. Functional Requirements — Admin Panel Custom

Admin panel wajib ada karena pemilik ingin bisa mengupdate menu/harga/konten tanpa developer.

### 12.1 Admin Authentication

**Requirement:**

- Halaman login admin.
- Admin email/username dan password.
- Session aman.
- Logout.
- Protected route untuk semua halaman `/admin`.

**Acceptance Criteria:**

- User tanpa login tidak bisa masuk admin.
- Password tidak disimpan sebagai plain text.
- Admin dapat logout.

---

### 12.2 Dashboard Admin

**Konten dashboard:**

- Total menu aktif.
- Total kategori.
- Total galeri aktif.
- Total testimoni aktif.
- Total client aktif.
- Shortcut tambah menu.
- Shortcut update nomor WhatsApp.

**Acceptance Criteria:**

- Dashboard dapat dibuka setelah login.
- Angka mengikuti data terbaru.

---

### 12.3 Menu Management

**Fitur:**

- Tambah menu/paket.
- Edit menu/paket.
- Hapus menu/paket.
- Publish/unpublish.
- Upload foto.
- Set harga.
- Set minimal order.
- Set kategori/tag.
- Set badge best seller/rekomendasi.
- Set urutan tampil.
- Set SEO title/description.

**Field menu:**

| Field | Type | Wajib | Catatan |
|---|---|---|---|
| name | string | Ya | Nama menu/paket |
| slug | string | Ya | Auto-generate, editable |
| categoryIds | relation | Ya | Bisa multi kategori |
| shortDescription | text | Ya | Deskripsi card |
| description | rich text/markdown | Tidak | Detail menu |
| price | number | Tidak | Boleh kosong jika hubungi admin |
| priceLabel | string | Ya | Contoh: Rp15.000/box |
| minOrder | string | Tidak | Karena data detail belum lengkap |
| packageItems | list/string | Tidak | Isi paket/menu |
| imageUrl | image | Tidak | Foto utama |
| galleryImages | images | Tidak | Foto tambahan |
| isFeatured | boolean | Ya | Default false |
| isPublished | boolean | Ya | Default true |
| sortOrder | number | Ya | Untuk urutan |
| seoTitle | string | Tidak | SEO detail page |
| seoDescription | string | Tidak | SEO detail page |

**Acceptance Criteria:**

- Admin bisa membuat menu baru dan langsung muncul di public website jika publish.
- Admin bisa mengubah harga tanpa deploy ulang.
- Admin bisa menonaktifkan menu tanpa menghapus data.

---

### 12.4 Category Management

**Kategori awal:**

1. Snack Box.
2. Nasi Box.
3. Prasmanan.
4. Coffee Break.
5. Paket Rapat/Dinas.
6. Paket Sekolah.
7. Pengajian/Syukuran.
8. Pernikahan.
9. Aqiqah.

**Fitur:**

- CRUD kategori.
- Set icon.
- Set deskripsi.
- Set urutan tampil.
- Publish/unpublish.

**Acceptance Criteria:**

- Admin dapat mengubah kategori tanpa developer.
- Kategori nonaktif tidak tampil di public website.

---

### 12.5 Gallery Management

**Fitur:**

- Upload foto.
- Edit caption.
- Pilih kategori galeri.
- Publish/unpublish.
- Sort order.
- Delete.

**Acceptance Criteria:**

- Foto baru muncul di halaman galeri jika publish.
- Foto yang dihapus tidak tampil lagi di public website.

---

### 12.6 Testimonial Management

**Fitur:**

- CRUD testimoni.
- Rating opsional.
- Nama pelanggan.
- Tipe pelanggan.
- Foto opsional.
- Publish/unpublish.
- Sort order.

**Acceptance Criteria:**

- Testimoni publish tampil di home.
- Admin dapat menyembunyikan testimoni.

---

### 12.7 Client Management

**Fitur:**

- CRUD client/instansi.
- Upload logo opsional.
- Kategori client.
- Publish/unpublish.
- Sort order.

**Acceptance Criteria:**

- Client publish tampil di section client.
- Jika tidak ada client publish, public website menampilkan copy umum.

---

### 12.8 FAQ Management

**Fitur:**

- CRUD FAQ.
- Question.
- Answer.
- Publish/unpublish.
- Sort order.

**Acceptance Criteria:**

- FAQ publish tampil di public website.
- FAQ dapat diurutkan oleh admin.

---

### 12.9 Site Settings

**Field site settings:**

- Brand name.
- Tagline.
- WhatsApp number.
- WhatsApp template global.
- Alamat/lokasi.
- Area layanan.
- Jam operasional.
- Instagram.
- TikTok.
- Facebook.
- Email opsional.
- SEO title home.
- SEO description home.
- Logo utama.
- Favicon.

**Acceptance Criteria:**

- Admin bisa update nomor WhatsApp tanpa mengubah kode.
- CTA public website selalu mengambil nomor terbaru dari site settings.

---

## 13. Content Requirements

### 13.1 Copy Hero Final Draft

**Headline:**  
RHF Catering & Snack Box Kabupaten Tegal

**Subheadline:**  
Snack box, nasi box, coffee break, dan prasmanan untuk kebutuhan acara keluarga, sekolah, kantor, komunitas, hingga dinas. Mengutamakan rasa, kerapian, dan pelayanan yang amanah.

**CTA:**  
Pesan via WhatsApp

**CTA Sekunder:**  
Lihat Katalog Menu

---

### 13.2 Deskripsi Layanan Awal

#### Snack Box
Pilihan snack box rapi dan praktis untuk rapat, acara sekolah, pengajian, arisan, hingga kegiatan kantor.

#### Nasi Box
Nasi box lengkap untuk makan siang, acara dinas, sekolah, kantor, dan kebutuhan konsumsi acara keluarga.

#### Prasmanan
Menu prasmanan untuk acara keluarga, syukuran, pengajian, pernikahan, dan event dengan jumlah tamu lebih banyak.

#### Coffee Break
Paket coffee break untuk rapat, seminar, pelatihan, dan kegiatan formal maupun semi-formal.

#### Paket Rapat/Dinas
Paket konsumsi yang cocok untuk kebutuhan rapat, kegiatan instansi, dan acara kantor.

#### Paket Sekolah
Paket praktis untuk kegiatan sekolah, rapat guru, acara murid, lomba, dan agenda pendidikan.

#### Pengajian/Syukuran
Pilihan menu untuk acara pengajian, syukuran, tasyakuran, dan acara keluarga lainnya.

#### Pernikahan
Layanan konsumsi dan prasmanan untuk acara pernikahan dengan menu yang bisa dikonsultasikan sesuai kebutuhan.

#### Aqiqah
Paket konsumsi untuk acara aqiqah dan syukuran keluarga dengan rasa yang tetap menjadi prioritas utama.

---

### 13.3 Konten yang Masih Perlu Diisi

Data berikut belum lengkap, tetapi tidak menghambat development karena bisa dimasukkan melalui admin panel:

1. Daftar menu lengkap.
2. Harga setiap paket.
3. Isi paket.
4. Minimal order per kategori.
5. Foto makanan asli.
6. Testimoni asli.
7. Nama/logo client yang boleh ditampilkan.
8. Jam operasional.
9. Social media.
10. Ketentuan pembayaran/DP.

---

## 14. Visual & Photo Direction

Karena RHF belum memiliki foto siap pakai dan membutuhkan arahan foto, website MVP boleh menggunakan placeholder sementara. Namun untuk production, wajib disiapkan foto asli agar brand lebih dipercaya.

### 14.1 Foto yang Wajib Disiapkan

1. Foto snack box tertutup dan terbuka.
2. Foto nasi box tertutup dan terbuka.
3. Foto prasmanan dari angle depan dan detail makanan.
4. Foto coffee break.
5. Foto proses dapur yang bersih.
6. Foto packaging siap kirim.
7. Foto pesanan untuk acara kantor/dinas/sekolah jika ada izin.
8. Foto pemilik/tim opsional.

### 14.2 Arahan Foto

- Gunakan cahaya natural atau lighting soft.
- Background bersih: putih, cream, kayu muda, atau meja rapi.
- Hindari background dapur yang berantakan.
- Ambil foto dari beberapa angle: top view, 45 derajat, close-up, dan packaging shot.
- Gunakan warna makanan yang terlihat natural, jangan filter terlalu kuning.
- Pastikan box terlihat rapi, bersih, dan tidak penyok.

---

## 15. Design Requirements

Mengikuti `design_rhf_catering.md`.

### 15.1 Color Token

```css
:root {
  --rhf-orange: #F97316;
  --rhf-deep-orange: #D85A00;
  --rhf-cream: #FFF4E6;
  --rhf-white: #FFFFFF;
  --rhf-brown: #7A3E12;
  --rhf-green: #6A8F3A;
  --rhf-gold: #F5B041;
  --rhf-charcoal: #2B2118;
}
```

### 15.2 UI Direction

- Warm minimalist.
- Clean layout.
- Mobile-first.
- Banyak whitespace.
- Tidak terlalu banyak ornamen.
- Komponen menggunakan Shadcn UI.
- Font modern dan konsisten.
- No emoji untuk tampilan profesional.

### 15.3 Komponen UI Utama

- Button primary.
- Button secondary.
- Category card.
- Menu card.
- Testimonial card.
- Client logo card.
- Gallery grid.
- FAQ accordion.
- Floating WhatsApp button.
- Admin table.
- Admin form.
- Image uploader.
- Publish toggle.

---

## 16. Technical Requirements

### 16.1 Frontend

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Shadcn UI.
- Responsive mobile-first.
- Server Components jika memungkinkan.
- Client Components hanya untuk interaksi seperti filter, search, mobile nav, admin forms, dan modal.

### 16.2 Backend / Data

Karena ada admin panel custom, website membutuhkan database dan storage.

Rekomendasi:

- Database: PostgreSQL via Supabase atau Neon.
- ORM: Prisma atau Drizzle.
- Auth admin: Auth.js/NextAuth credentials atau Supabase Auth.
- Image storage: Supabase Storage, Cloudinary, atau Vercel Blob.
- Deployment: Vercel.

### 16.3 Environment Variables

Contoh env:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_INITIAL_PASSWORD=
STORAGE_PROVIDER=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

---

## 17. Data Model Draft

### 17.1 User / Admin

```ts
type AdminUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.2 MenuCategory

```ts
type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.3 MenuItem

```ts
type MenuItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  price?: number;
  priceLabel: string;
  minOrder?: string;
  packageItems?: string[];
  imageUrl?: string;
  galleryImages?: string[];
  categoryIds: string[];
  tags?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.4 GalleryItem

```ts
type GalleryItem = {
  id: string;
  title?: string;
  caption?: string;
  imageUrl: string;
  category?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.5 Testimonial

```ts
type Testimonial = {
  id: string;
  customerName: string;
  customerType?: string;
  message: string;
  rating?: number;
  imageUrl?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.6 Client

```ts
type Client = {
  id: string;
  name: string;
  category?: string;
  logoUrl?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.7 FAQ

```ts
type FAQ = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 17.8 SiteSettings

```ts
type SiteSettings = {
  id: string;
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappTemplate: string;
  location: string;
  serviceArea: string;
  businessHours?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  email?: string;
  logoUrl?: string;
  faviconUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: Date;
};
```

---

## 18. WhatsApp Integration

### 18.1 Nomor WhatsApp

Nomor input: `0895422734153`  
Format wa.me: `62895422734153`

### 18.2 CTA Global Template

```text
Halo RHF Catering & Snack Box, saya mau konsultasi pesanan untuk acara.

Nama:
Tanggal Acara:
Lokasi Acara:
Jenis Pesanan: Snack Box / Nasi Box / Prasmanan / Coffee Break / Lainnya
Jumlah Pesanan:
Catatan:
```

### 18.3 CTA Detail Menu Template

```text
Halo RHF Catering & Snack Box, saya mau tanya/pesan paket berikut:

Nama Paket: {{menu_name}}
Harga: {{price_label}}
Jumlah Pesanan:
Tanggal Acara:
Lokasi Acara:
Catatan:
```

### 18.4 Acceptance Criteria

- Semua CTA WhatsApp memakai nomor dari site settings.
- Pesan otomatis sudah ter-encode dengan benar.
- Link WhatsApp bekerja di mobile dan desktop.
- CTA global dan CTA detail menu memiliki template berbeda.

---

## 19. SEO Requirements

### 19.1 Target Keyword Awal

- Catering Kabupaten Tegal.
- Snack box Kabupaten Tegal.
- Nasi box Kabupaten Tegal.
- Prasmanan Kabupaten Tegal.
- Catering untuk dinas Kabupaten Tegal.
- Catering acara sekolah Tegal.
- Catering pengajian Tegal.
- Catering aqiqah Tegal.
- Catering pernikahan Tegal.

### 19.2 Meta Title Home

```text
RHF Catering & Snack Box Kabupaten Tegal | Snack Box, Nasi Box & Prasmanan
```

### 19.3 Meta Description Home

```text
RHF Catering & Snack Box melayani snack box, nasi box, coffee break, dan prasmanan untuk acara keluarga, sekolah, kantor, komunitas, hingga dinas di Kabupaten Tegal.
```

### 19.4 Technical SEO

- Sitemap XML.
- Robots.txt.
- Open Graph image.
- Schema LocalBusiness/FoodEstablishment.
- Meta title dan description per halaman.
- Slug SEO-friendly.
- Alt text untuk semua gambar.

---

## 20. Performance & Accessibility

### 20.1 Performance Target

- Lighthouse Performance minimal 90 untuk public pages.
- LCP target < 2.5 detik pada koneksi normal.
- Image optimization menggunakan Next/Image.
- Lazy loading gallery.
- Bundle size dijaga ringan.

### 20.2 Accessibility

- Kontras warna memenuhi standar keterbacaan.
- Semua button punya label jelas.
- Navigasi bisa menggunakan keyboard.
- Alt text untuk gambar penting.
- Form admin punya label field.
- Accordion FAQ dapat dibuka dengan keyboard.

---

## 21. Security Requirements

- Admin route harus protected.
- Password admin harus di-hash.
- Validasi input menggunakan Zod atau schema validation serupa.
- Upload file dibatasi tipe dan ukuran.
- Hindari expose secret key di client.
- Rate limit untuk login admin.
- Sanitasi rich text/markdown untuk mencegah XSS.
- Role-based access minimal admin/editor jika diperlukan.

---

## 22. Analytics & Tracking

Untuk MVP, analytics bersifat opsional tapi direkomendasikan.

Event yang berguna:

1. Klik CTA WhatsApp global.
2. Klik CTA WhatsApp per menu.
3. Klik filter kategori menu.
4. View halaman detail menu.
5. Klik social media.

Tools opsional:

- Vercel Analytics.
- Google Analytics.
- Plausible.

---

## 23. Seed Data untuk Development

Developer boleh membuat dummy data awal agar UI bisa dibangun sebelum data asli lengkap.

### 23.1 Kategori Awal

- Snack Box
- Nasi Box
- Prasmanan
- Coffee Break
- Paket Rapat/Dinas
- Paket Sekolah
- Pengajian/Syukuran
- Pernikahan
- Aqiqah

### 23.2 Dummy Menu Awal

Contoh dummy, wajib bisa diedit dari admin:

1. Snack Box Paket A — `Harga diisi admin`.
2. Snack Box Paket B — `Harga diisi admin`.
3. Nasi Box Paket A — `Harga diisi admin`.
4. Nasi Box Paket B — `Harga diisi admin`.
5. Paket Coffee Break — `Harga diisi admin`.
6. Prasmanan Keluarga — `Harga diisi admin`.
7. Paket Rapat/Dinas — `Harga diisi admin`.
8. Paket Pengajian/Syukuran — `Harga diisi admin`.
9. Paket Aqiqah — `Harga diisi admin`.

---

## 24. Acceptance Criteria Global

Website MVP dianggap selesai jika:

1. Public website dapat diakses responsive di mobile dan desktop.
2. Home menampilkan positioning RHF dengan jelas.
3. Katalog menu lengkap dapat ditampilkan dari database/admin panel.
4. Detail menu dapat dibuka dan memiliki CTA WhatsApp dinamis.
5. Semua CTA WhatsApp mengarah ke `62895422734153` atau nomor terbaru dari site settings.
6. Admin dapat login.
7. Admin dapat CRUD kategori.
8. Admin dapat CRUD menu/paket.
9. Admin dapat CRUD galeri.
10. Admin dapat CRUD testimoni.
11. Admin dapat CRUD client.
12. Admin dapat CRUD FAQ.
13. Admin dapat update site settings.
14. Menu, galeri, testimoni, client, dan FAQ memiliki status publish/unpublish.
15. Website mengikuti design system RHF.
16. Tidak ada error console kritikal.
17. Build production sukses di Vercel.
18. Basic SEO sudah terpasang.

---

## 25. Roadmap Setelah MVP

### V1.1

- Blog/artikel tips acara dan catering.
- Halaman khusus tiap kategori layanan.
- Download katalog PDF.
- Form inquiry selain WhatsApp.

### V1.2

- Kalkulator estimasi pesanan.
- Request quotation form.
- Lead management sederhana.
- Export inquiry ke CSV.

### V2

- Customer login.
- Cart/checkout.
- Payment gateway.
- Status pesanan.
- Invoice otomatis.
- Promo/voucher.

---

## 26. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Foto asli belum tersedia | Website kurang dipercaya | Gunakan placeholder sementara dan prioritaskan sesi foto sebelum launch |
| Harga/menu belum lengkap | Katalog kurang siap | Admin panel wajib bisa update harga dan isi paket kapan saja |
| Minimal order belum detail | Customer masih bertanya | Tampilkan field minimal order per menu; jika belum ada isi `Hubungi Admin` |
| Aturan pembayaran belum tetap | FAQ kurang pasti | Copy pembayaran dibuat fleksibel: dikonfirmasi admin saat pemesanan |
| Client belum punya izin ditampilkan | Risiko etika/kepercayaan | Tampilkan social proof umum sampai izin tersedia |
| Admin panel menambah scope | Development lebih lama | Prioritaskan CRUD inti: menu, kategori, site settings, galeri, testimoni, client, FAQ |

---

## 27. Open Questions yang Masih Perlu Diisi Nanti

Pertanyaan ini tidak menghambat development, tetapi perlu dilengkapi sebelum launch production:

1. Daftar menu dan harga final setiap paket.
2. Minimal order per kategori.
3. Ketentuan pembayaran/DP final.
4. Jam operasional.
5. Social media resmi.
6. Testimoni asli yang boleh ditampilkan.
7. Nama/logo client yang boleh ditampilkan.
8. Foto asli produk dan acara.
9. Apakah ada pengiriman dan biaya kirim.
10. Apakah ada batas H-berapa untuk pemesanan.

---

## 28. Development Handoff Summary

Prioritas development:

1. Setup Next.js + Tailwind + Shadcn UI.
2. Implement design system RHF.
3. Buat public pages: Home, Menu, Detail Menu, Layanan, Galeri, Tentang, Kontak.
4. Buat WhatsApp CTA global dan dynamic per menu.
5. Setup database dan storage.
6. Buat admin authentication.
7. Buat admin CRUD: kategori, menu, galeri, testimoni, client, FAQ, site settings.
8. Setup SEO dasar.
9. Deploy ke Vercel.
10. Isi data asli melalui admin panel.

