# Checklist Sebelum Launch

Website sudah berfungsi penuh, tetapi **sebagian konten masih berupa placeholder**. Selesaikan daftar ini sebelum alamat website disebarkan ke pelanggan atau dicantumkan di proposal, kartu nama, dan media sosial.

Item bertanda 🔴 berisiko menyesatkan pelanggan bila dibiarkan tayang.

---

## 🔴 1. Testimoni — WAJIB diganti

**Berkas:** `src/lib/seed/testimonials.ts`

Website saat ini menampilkan **tiga testimoni contoh yang bukan ucapan pelanggan sungguhan**. Nama sengaja diawali kata "Contoh" agar mudah dikenali, tetapi tetap tidak boleh tayang di website publik.

Pilih salah satu:

- **Ganti** dengan testimoni asli yang sudah diizinkan pelanggan untuk ditampilkan, atau
- **Kosongkan** — ubah semua `isPublished` menjadi `false`, atau kosongkan array `TESTIMONIALS`. Section testimoni akan otomatis hilang dari beranda, tanpa meninggalkan ruang kosong.

Menampilkan testimoni karangan adalah risiko kepercayaan sekaligus risiko hukum. Bila belum ada testimoni asli, mengosongkan jauh lebih aman daripada membiarkan contoh tayang.

---

## 🔴 2. Menu, harga, isi paket, dan minimal order

**Berkas:** `src/lib/seed/menu-items.ts` — PRD §13.3 dan §27

Dua belas paket yang ada sekarang adalah **contoh**, disusun agar katalog bisa dibangun dan ditinjau. Angka harga mengikuti kisaran indikatif di `PromtCatering.md` §23, bukan harga resmi RHF.

Periksa untuk setiap paket:

- [ ] Nama paket sesuai penyebutan RHF sehari-hari
- [ ] `priceLabel` sesuai harga sebenarnya (tulis `Hubungi Admin` bila belum pasti)
- [ ] `price` (angka) sesuai `priceLabel` — dipakai untuk pengurutan harga
- [ ] `packageItems` sesuai isi paket yang sebenarnya
- [ ] `minOrder` sesuai ketentuan RHF
- [ ] Hapus paket yang tidak ditawarkan, tambahkan yang belum ada

---

## 🟠 3. Foto asli

**Berkas:** `src/lib/seed/gallery.ts` dan `src/lib/seed/menu-items.ts` — PRD §14

Seluruh gambar saat ini adalah placeholder bergrafis, bukan foto. Ini disengaja: foto stok akan melanggar arahan `DesignRHF.md` §11 dan berisiko tayang permanen tanpa disadari.

Isi `imageUrl` pada tiap paket dan item galeri. Templat tidak perlu diubah — begitu `imageUrl` terisi, foto langsung menggantikan placeholder.

Foto yang perlu disiapkan (PRD §14.1):

- [ ] Snack box tertutup dan terbuka
- [ ] Nasi box tertutup dan terbuka
- [ ] Prasmanan tampak depan dan detail makanan
- [ ] Coffee break
- [ ] Proses dapur yang bersih
- [ ] Packaging siap kirim
- [ ] Pesanan untuk acara kantor/dinas/sekolah — **hanya bila sudah ada izin**
- [ ] Foto pemilik/tim (opsional)

Arahan pengambilan foto ada di `PRDRhf.md` §14.2 dan `DesignRHF.md` §11.

---

## 🟠 4. Client / instansi

**Berkas:** `src/lib/seed/clients.ts`

Daftar ini **sengaja dikosongkan**. `DesignRHF.md` §21 melarang menampilkan nama atau logo client tanpa izin, sehingga website saat ini hanya menampilkan *jenis* client yang dilayani (Acara Keluarga, Sekolah, Kantor, Dinas, dan seterusnya) — sesuai fallback yang diminta PRD §11.9.

Tambahkan client **hanya setelah izin tertulis diperoleh**. Begitu ada satu client yang di-publish, section otomatis beralih menampilkan daftar client.

---

## 🟡 5. Informasi operasional

**Berkas:** `src/lib/seed/site-settings.ts` — PRD §27

Field berikut sengaja dikosongkan agar tidak menampilkan informasi yang belum pasti. Bagian terkait di website otomatis tersembunyi selama kosong.

- [ ] `businessHours` — jam operasional
- [ ] `instagramUrl`, `tiktokUrl`, `facebookUrl` — media sosial resmi
- [ ] `email` — bila ada

Verifikasi juga:

- [ ] `whatsappNumber` masih `0895422734153` dan aktif
- [ ] `serviceArea` dan `location` sudah benar

---

## 🟡 6. Jawaban FAQ

**Berkas:** `src/lib/seed/faqs.ts`

Jawaban untuk pembayaran, pengiriman, dan batas waktu pemesanan sengaja ditulis fleksibel ("dikonfirmasi admin saat pemesanan") karena PRD §27 mencatat ketentuannya belum ditetapkan. Perbarui setelah RHF menetapkan aturan yang pasti:

- [ ] Ketentuan pembayaran dan DP (FAQ #8)
- [ ] Ketersediaan dan biaya pengiriman (FAQ #9)
- [ ] Batas H-berapa pemesanan (FAQ #7)
- [ ] Minimal order per kategori (FAQ #3)

---

## ⚙️ 7. Teknis sebelum go-live

- [ ] Set `NEXT_PUBLIC_SITE_URL` ke domain final di Vercel, agar sitemap, canonical URL, dan JSON-LD memakai alamat yang benar
- [ ] Cek `/sitemap.xml` dan `/robots.txt` di domain produksi
- [ ] Daftarkan domain di Google Search Console dan kirim sitemap
- [ ] Uji tombol WhatsApp dari perangkat mobile sungguhan (Android dan iOS)
- [ ] Jalankan Lighthouse di halaman beranda dan katalog — target Performance ≥ 90 (PRD §20.1)
- [ ] Cek tampilan di layar kecil (360px) dan tablet
- [ ] Pastikan logo dan favicon tampil benar di tab browser dan preview share

---

## Ringkas

Yang **paling mendesak** sebelum website disebarkan:

1. Testimoni contoh diganti atau dikosongkan.
2. Harga dan isi paket disesuaikan dengan yang sebenarnya.
3. Foto asli dipasang, minimal untuk paket-paket unggulan.

Sisanya dapat menyusul, karena website sudah menanganinya secara aman — bagian yang datanya belum ada tidak akan tampil kosong atau menampilkan klaim yang tidak bisa dibuktikan.
