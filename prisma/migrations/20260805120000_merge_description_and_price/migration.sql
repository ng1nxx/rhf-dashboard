-- Menggabungkan dua pasang kolom menjadi satu sumber kebenaran.
--
--   shortDescription + description  ->  description  (wajib)
--   price + priceLabel              ->  price + priceUnit
--
-- Label pelanggan ("Mulai Rp15.000/box") dan cuplikan kartu kini dihitung di
-- `toMenuItem`, bukan disimpan. Alasannya: dua kolom yang menyatakan hal sama
-- akan berbeda isi begitu salah satunya disunting, dan tidak ada yang tahu
-- mana yang benar.
--
-- Urutannya penting. Data dipindahkan lebih dulu, kolom lama dibuang paling
-- akhir, supaya migrasi yang gagal di tengah tidak menghilangkan apa pun.

-- 1. Satuan harga, diurai dari label yang akan dipensiunkan.
--    "Mulai Rp35.000/pax" -> "pax". Paket "Hubungi Admin" tidak punya garis
--    miring, jadi priceUnit-nya tetap NULL — persis seperti price-nya.
ALTER TABLE "menu_items" ADD COLUMN "priceUnit" TEXT;

UPDATE "menu_items"
SET "priceUnit" = substring("priceLabel" FROM '/([A-Za-z]+)[[:space:]]*$')
WHERE "priceLabel" LIKE '%/%';

-- 2. Lipat deskripsi singkat ke depan deskripsi panjang. Tidak ada teks yang
--    dibuang di sini; penyuntingan redaksionalnya menyusul sebagai langkah
--    terpisah supaya migrasi ini murni soal bentuk data.
UPDATE "menu_items"
SET "description" = CASE
  WHEN "description" IS NULL OR btrim("description") = ''
    THEN "shortDescription"
  ELSE "shortDescription" || ' ' || "description"
END;

-- 3. Baru sekarang boleh diwajibkan — setelah dipastikan tidak ada yang NULL.
ALTER TABLE "menu_items" ALTER COLUMN "description" SET NOT NULL;

-- 4. Pensiunkan kolom yang isinya sudah pindah.
ALTER TABLE "menu_items" DROP COLUMN "shortDescription";
ALTER TABLE "menu_items" DROP COLUMN "priceLabel";
