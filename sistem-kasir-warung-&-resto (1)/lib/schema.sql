-- ============================================================
-- SKEMA TABEL SUPABASE UNTUK SISTEM KASIR (POS) WARUNG/RESTORAN
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL MENU
CREATE TABLE IF NOT EXISTS public.menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Makanan', 'Minuman', 'Cemilan', 'Paket')),
  harga NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
  stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
  ambang_batas INTEGER NOT NULL DEFAULT 5 CHECK (ambang_batas >= 0),
  gambar TEXT,
  deskripsi TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL TRANSAKSI
CREATE TABLE IF NOT EXISTS public.transaksi (
  id VARCHAR(50) PRIMARY KEY, -- TRX-YYYYMMDD-XXXX
  waktu TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kasir_nama VARCHAR(100) NOT NULL,
  kasir_id VARCHAR(50) NOT NULL,
  metode_bayar VARCHAR(20) NOT NULL CHECK (metode_bayar IN ('cash', 'qris')),
  total_harga NUMERIC(12, 2) NOT NULL CHECK (total_harga >= 0),
  diskon NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (diskon >= 0),
  total_akhir NUMERIC(12, 2) NOT NULL CHECK (total_akhir >= 0),
  jumlah_bayar NUMERIC(12, 2) NOT NULL CHECK (jumlah_bayar >= 0),
  kembalian NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (kembalian >= 0),
  catatan TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'sukses' CHECK (status IN ('sukses', 'dibatalkan'))
);

-- 4. TABEL TRANSAKSI DETAIL
CREATE TABLE IF NOT EXISTS public.transaksi_detail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaksi_id VARCHAR(50) NOT NULL REFERENCES public.transaksi(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES public.menu(id) ON DELETE SET NULL,
  nama_menu VARCHAR(255) NOT NULL,
  harga_satuan NUMERIC(12, 2) NOT NULL CHECK (harga_satuan >= 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  catatan TEXT
);

-- 5. TABEL PROFILES / USERS (KASIR & ADMIN)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'kasir')),
  pin VARCHAR(10) NOT NULL DEFAULT '1234',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DATA INITIAL (SEED DATA)
INSERT INTO public.profiles (username, nama, role, pin) VALUES
('admin', 'Admin Resto', 'admin', '1234'),
('kasir1', 'Kasir Budi', 'kasir', '0000')
ON CONFLICT (username) DO NOTHING;

INSERT INTO public.menu (nama, kategori, harga, stok, ambang_batas, gambar, deskripsi) VALUES
('Nasi Goreng Spesial', 'Makanan', 22000, 25, 5, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500', 'Nasi goreng dengan telor, ayam suwir, dan bakso'),
('Mie Goreng Jawa', 'Makanan', 20000, 18, 5, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500', 'Mie goreng khas jawa dengan bumbu rempah melimpah'),
('Ayam Goreng Lengkuas', 'Makanan', 25000, 15, 4, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500', 'Ayam goreng empuk bertabur serundeng lengkuas gurih'),
('Sate Ayam Madura (10 tusuk)', 'Makanan', 28000, 12, 3, 'https://images.unsplash.com/photo-1529563021893-cc83c921389e?w=500', 'Sate ayam empuk dengan bumbu kacang khas Madura'),
('Tempe Mendoan (4 pcs)', 'Cemilan', 12000, 30, 8, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', 'Tempe mendoan hangat disajikan dengan kecap pedas'),
('Es Teh Manis Jumbo', 'Minuman', 6000, 50, 10, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', 'Es teh manis segar ukuran jumbo'),
('Es Jeruk Peras', 'Minuman', 8000, 40, 8, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500', 'Perasan jeruk murni dingin dan menyegarkan'),
('Kopi Susu Gula Aren', 'Minuman', 15000, 25, 5, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500', 'Espresso dengan susu segar dan gula aren murni'),
('Paket Hemat Ayam + Es Teh', 'Paket', 28000, 10, 3, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', 'Nasi + Ayam Lengkuas + Es Teh Manis')
ON CONFLICT DO NOTHING;

-- 7. ENABLE REALTIME UNTUK STOK DAN TRANSAKSI
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transaksi;
