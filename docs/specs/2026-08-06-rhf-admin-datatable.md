# Datatable admin — paginasi & pencarian di server

**Tanggal:** 2026-08-06
**Induk:** [`2026-08-04-rhf-admin-panel-round-2-design.md`](2026-08-04-rhf-admin-panel-round-2-design.md)
**Mengacu:** PRD §15.3 (komponen admin)

Keenam daftar admin sebelumnya mengambil seluruh koleksi lalu merendernya utuh. Sekarang setiap daftar mengambil **satu halaman** dari database, dengan pencarian dan ukuran halaman ikut dikerjakan di sana.

## Keadaan tabel hidup di URL

`?q=<kata>&page=<n>&per=<10|25|50>`.

Bukan di state komponen. Itulah yang membuat tabelnya server-rendered: database mengembalikan satu halaman, bukan seluruh koleksi yang disaring belakangan. Efek sampingnya semua bagus — tombol kembali bekerja, tautan ke halaman 3 sebuah pencarian adalah tautan sungguhan, dan memuat ulang setelah menyunting mendarat di tempat orangnya tadi berada, bukan di puncak daftar.

| Path | Isi |
|---|---|
| `lib/admin/pagination.ts` | Baca & bersihkan parameter, tipe `Paged<Row>`, `tableHref()` |
| `lib/admin/list-queries.ts` | Semua daftar berpaginasi + `where` pencarian per entitas |
| `components/admin/data-table.tsx` | `DataTableSection`, `TablePagination` — server |
| `components/admin/table-toolbar.tsx` | Kotak cari — klien |

## Keputusan yang perlu dicatat

**Parameter URL tidak dipercaya sama sekali.** Nilainya datang langsung dari bilah alamat. `page` dipaksa jadi bilangan bulat positif, dan `per` **harus** salah satu dari 10/25/50 — bukan sekadar "angka". Tanpa itu `?per=100000` jadi cara meminta seluruh tabel sekaligus ke Supabase lewat URL. Diuji: `?per=100000`, `?per=abc`, `?page=-5` semuanya jatuh ke bawaan tanpa merusak apa pun.

**`page` dijepit terhadap jumlah halaman sebenarnya**, bukan dipakai apa adanya. Berada di halaman 3 lalu menghapus beberapa record terakhir akan menyisakan tabel kosong dengan paginasi yang tampak normal dan tanpa petunjuk apa pun tentang apa yang terjadi. Diuji dengan `?page=99` → mendarat di halaman terakhir.

**Pencarian memakai `contains` case-insensitive**, artinya cocok di tengah kata. Mencari "nasi" ikut memunculkan *Snack Box Paket A* karena deskripsinya memuat "kombi**nasi**nya". Ini disengaja: untuk panel dengan puluhan record, pencarian yang pemaaf lebih berguna daripada yang presisi, dan pencocokan sebagian ("snack bo") justru yang paling sering dipakai. Kalau nanti terasa berisik, batasi kolom yang dicari sebelum beralih ke full-text search.

**Kolom yang dicari berbeda per entitas** — menu mencari nama, deskripsi, slug, dan tag; FAQ mencari pertanyaan dan jawaban; galeri mencari judul, keterangan, dan kategori; dan seterusnya. Tidak ada gunanya mencari "urutan tampil".

**"Belum ada isinya" dan "pencarian tidak cocok" adalah dua keadaan berbeda** dan diberi pesan berbeda. Menyuruh orang menambahkan FAQ pertamanya padahal ia punya sepuluh dan cuma salah ketik adalah hal yang membuat panel terasa rusak.

**`listCategoryOptions()` sengaja tidak berpaginasi.** Sebuah paket boleh masuk kategori mana pun, jadi menawarkan hanya halaman pertama akan diam-diam membuat sisanya mustahil dipilih.

**Kotak cari tetap `<form method="get">` sungguhan.** Handler submit-nya hanya meningkatkan itu jadi navigasi sisi klien supaya sidebar dan posisi gulir bertahan. Kontrol paginasi seluruhnya `<Link>` — nol JavaScript.

## Bug yang ikut ketahuan dan diperbaiki

**Urutan tampil record baru dihitung dari satu halaman.** Keenam halaman "baru" memakai `Math.max(...items.map(...))` atas daftar yang sekarang cuma berisi satu halaman. Menambah paket dari halaman 1 akan memberi urutan yang bentrok dengan record yang sudah ada di halaman berikutnya. Diganti agregat `max(sortOrder)` atas seluruh tabel. Terverifikasi: halaman 1 maksimumnya 10, seluruh tabel 13, dan form paket baru terisi **14**.

## Verifikasi yang dijalankan

`typecheck`, `lint`, `build` bersih. Di browser sungguhan, **20 pemeriksaan lulus**, termasuk:

- **Bukti server-side:** HTML yang dikirim server hanya berisi 10 `<tr>`, dan slug paket halaman 2 sama sekali tidak ada di dalamnya.
- Halaman 2 berisi sisa 3 baris; halaman aktif ditandai `aria-current`.
- Ganti ke 25 per halaman → semua 13 muat, URL membawa `per=25`.
- Pencarian menyaring di database (server mengirim 6 baris untuk "nasi", bukan 13), dan keenamnya memang memuat kata itu — diverifikasi langsung ke database.
- Pencarian ikut terpaginasi; hasil kosong memberi pesan "tidak cocok".
- Kelima tabel lain punya kotak cari dan tetap 200.

## Yang sengaja tidak dikerjakan

- **Urut kolom** — keputusan pemilik. Kolom `sortOrder` sudah jadi cara pemilik menyusun tampilan; mengurutkan tabel dengan cara lain berisiko membuat angka urutan yang terlihat jadi membingungkan.
- **Full-text search Postgres** — belum sepadan pada puluhan record.
- **Pilih-banyak dan aksi massal** — tidak diminta PRD.
