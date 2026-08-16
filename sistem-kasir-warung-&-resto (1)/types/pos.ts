export type CategoryType = 'Makanan' | 'Minuman' | 'Cemilan' | 'Paket';

export interface MenuItem {
  id: string;
  nama: string;
  kategori: CategoryType;
  harga: number;
  stok: number;
  ambang_batas: number; // threshold for "stok menipis", e.g., 5
  gambar?: string; // image URL or icon identifier
  deskripsi?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  jumlah: number;
  catatan?: string;
  subtotal: number;
}

export type PaymentMethod = 'cash' | 'qris';

export interface TransactionDetail {
  id: string;
  transaksi_id: string;
  menu_id: string;
  nama_menu: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  catatan?: string;
}

export interface Transaction {
  id: string; // e.g. TRX-20260810-0001
  waktu: string;
  kasir_nama: string;
  kasir_id: string;
  metode_bayar: PaymentMethod;
  total_harga: number;
  diskon: number;
  total_akhir: number;
  jumlah_bayar: number;
  kembalian: number;
  catatan?: string;
  status: 'sukses' | 'dibatalkan';
  items: TransactionDetail[];
}

export type UserRole = 'admin' | 'kasir';

export interface UserProfile {
  id: string;
  username: string;
  nama: string;
  role: UserRole;
  pin: string;
  is_active: boolean;
  created_at: string;
}

export interface SalesReportSummary {
  totalPendapatan: number;
  totalTransaksi: number;
  totalItemTerjual: number;
  pendapatanHariIni: number;
  transaksiHariIni: number;
  pendapatanMingguIni: number;
  pendapatanBulanIni: number;
  stokKritisCount: number;
}

export interface DailySalesData {
  tanggal: string;
  total: number;
  transaksi: number;
}

export interface CategorySalesData {
  kategori: string;
  total: number;
  jumlahItem: number;
}

export interface TopSellingItemData {
  nama: string;
  terjual: number;
  totalPendapatan: number;
}
