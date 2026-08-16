import { MenuItem, Transaction, UserProfile, CartItem, SalesReportSummary, DailySalesData, TopSellingItemData } from '@/types/pos';
import { supabase, isSupabaseConfigured } from './supabase';

const MENU_STORAGE_KEY = 'pos_menu_items_v2';
const TRANSACTIONS_STORAGE_KEY = 'pos_transactions_v2';
const USERS_STORAGE_KEY = 'pos_users_v2';
const BROADCAST_CHANNEL_NAME = 'pos_realtime_channel';

// Default Sample Data for Instant Preview
const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm-1',
    nama: 'Nasi Goreng Spesial',
    kategori: 'Makanan',
    harga: 22000,
    stok: 25,
    ambang_batas: 5,
    gambar: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Nasi goreng bumbu spesial dengan telur ceplok, suwiran ayam, dan bakso.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-2',
    nama: 'Mie Goreng Jawa',
    kategori: 'Makanan',
    harga: 20000,
    stok: 18,
    ambang_batas: 5,
    gambar: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Mie goreng telur dengan sayuran segar dan bumbu rempah khas Jawa.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-3',
    nama: 'Ayam Goreng Lengkuas + Nasi',
    kategori: 'Makanan',
    harga: 25000,
    stok: 4, // Menipis for demo
    ambang_batas: 5,
    gambar: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Ayam goreng rempah lengkuas renyah disajikan dengan nasi hangat dan sambal.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-4',
    nama: 'Sate Ayam Madura (10 tusuk)',
    kategori: 'Makanan',
    harga: 28000,
    stok: 0, // Habis for demo
    ambang_batas: 3,
    gambar: 'https://images.unsplash.com/photo-1529563021893-cc83c921389e?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Sate daging ayam pilihan dibakar dengan bumbu kacang gurih khas Madura.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-5',
    nama: 'Tempe Mendoan (4 pcs)',
    kategori: 'Cemilan',
    harga: 12000,
    stok: 30,
    ambang_batas: 8,
    gambar: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Tempe goreng tepung setengah matang hangat disajikan dengan kecap cabe.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-6',
    nama: 'Es Teh Manis Jumbo',
    kategori: 'Minuman',
    harga: 6000,
    stok: 50,
    ambang_batas: 10,
    gambar: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Es teh manis segar pelepas dahaga porsi jumbo.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-7',
    nama: 'Es Jeruk Peras Murni',
    kategori: 'Minuman',
    harga: 8000,
    stok: 40,
    ambang_batas: 8,
    gambar: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Minuman es jeruk dari perasan jeruk peras asli kaya vitamin C.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-8',
    nama: 'Kopi Susu Gula Aren',
    kategori: 'Minuman',
    harga: 15000,
    stok: 20,
    ambang_batas: 5,
    gambar: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Kopi susu kekinian racikan espresso dan gula aren asli.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-9',
    nama: 'Paket Hemat Ayam + Es Teh',
    kategori: 'Paket',
    harga: 28000,
    stok: 12,
    ambang_batas: 3,
    gambar: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Paket kenyang: Nasi + Ayam Lengkuas + Es Teh Manis Jumbo.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u-admin',
    username: 'admin',
    nama: 'Admin Utama (Pemilik)',
    role: 'admin',
    pin: '1234',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'u-kasir1',
    username: 'kasir',
    nama: 'Kasir Budi',
    role: 'kasir',
    pin: '0000',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Helper to calculate initial mock sales history for richer charts
function generateInitialTransactions(): Transaction[] {
  const now = new Date();
  const list: Transaction[] = [];

  for (let i = 0; i < 15; i++) {
    const txDate = new Date(now.valueOf() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    const txId = `TRX-${txDate.getFullYear()}${(txDate.getMonth()+1).toString().padStart(2, '0')}${txDate.getDate().toString().padStart(2, '0')}-${(1000 + i)}`;
    const isCash = i % 2 === 0;
    
    list.push({
      id: txId,
      waktu: txDate.toISOString(),
      kasir_nama: 'Kasir Budi',
      kasir_id: 'u-kasir1',
      metode_bayar: isCash ? 'cash' : 'qris',
      total_harga: isCash ? 38000 : 50000,
      diskon: 0,
      total_akhir: isCash ? 38000 : 50000,
      jumlah_bayar: isCash ? 50000 : 50000,
      kembalian: isCash ? 12000 : 0,
      status: 'sukses',
      items: [
        {
          id: `txd-${i}-1`,
          transaksi_id: txId,
          menu_id: 'm-1',
          nama_menu: 'Nasi Goreng Spesial',
          harga_satuan: 22000,
          jumlah: 1,
          subtotal: 22000
        },
        {
          id: `txd-${i}-2`,
          transaksi_id: txId,
          menu_id: 'm-6',
          nama_menu: 'Es Teh Manis Jumbo',
          harga_satuan: 6000,
          jumlah: 2,
          subtotal: 12000
        }
      ]
    });
  }

  return list.sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());
}

// Broadcast channel setup
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
}

function notifyRealtimeChange(type: 'MENU_UPDATE' | 'TRANSACTION_NEW' | 'STOCK_UPDATE') {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type, timestamp: Date.now() });
  }
}

// LOCAL STORAGE HELPERS
export function getStoredMenuItems(): MenuItem[] {
  if (typeof window === 'undefined') return INITIAL_MENU;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading menu items:', e);
    return INITIAL_MENU;
  }
}

export function saveMenuItemsToStorage(items: MenuItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
  notifyRealtimeChange('MENU_UPDATE');
}

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialTransactions();
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading transactions:', e);
    return [];
  }
}

export function saveTransactionsToStorage(transactions: Transaction[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  notifyRealtimeChange('TRANSACTION_NEW');
}

export function getStoredUsers(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveUsersToStorage(users: UserProfile[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// CORE POS ACTIONS

export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('menu').select('*').order('nama');
      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }
    } catch (err) {
      console.warn('Supabase fetch menu failed, falling back to local storage:', err);
    }
  }
  return getStoredMenuItems();
}

export async function saveMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const allItems = getStoredMenuItems();
  const now = new Date().toISOString();
  let updatedItem: MenuItem;

  if (item.id) {
    // Update existing
    updatedItem = {
      ...allItems.find((m) => m.id === item.id)!,
      ...item,
      updated_at: now,
    } as MenuItem;
    const index = allItems.findIndex((m) => m.id === item.id);
    if (index !== -1) {
      allItems[index] = updatedItem;
    }
  } else {
    // Create new
    updatedItem = {
      id: 'm-' + Date.now(),
      nama: item.nama || 'Menu Baru',
      kategori: item.kategori || 'Makanan',
      harga: item.harga || 0,
      stok: item.stok || 0,
      ambang_batas: item.ambang_batas || 5,
      gambar: item.gambar || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      deskripsi: item.deskripsi || '',
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    allItems.unshift(updatedItem);
  }

  saveMenuItemsToStorage(allItems);

  // Sync to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu').upsert([updatedItem]);
    } catch (e) {
      console.error('Supabase sync menu error:', e);
    }
  }

  return updatedItem;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const allItems = getStoredMenuItems().filter((item) => item.id !== id);
  saveMenuItemsToStorage(allItems);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete error:', e);
    }
  }

  return true;
}

export async function updateStock(id: string, newStock: number): Promise<boolean> {
  const allItems = getStoredMenuItems();
  const item = allItems.find((m) => m.id === id);
  if (item) {
    item.stok = Math.max(0, newStock);
    item.updated_at = new Date().toISOString();
    saveMenuItemsToStorage(allItems);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('menu').update({ stok: item.stok, updated_at: item.updated_at }).eq('id', id);
      } catch (e) {
        console.error('Supabase stock update error:', e);
      }
    }
    return true;
  }
  return false;
}

export async function processTransaction(
  cart: CartItem[],
  kasir: UserProfile,
  metodeBayar: 'cash' | 'qris',
  jumlahBayar: number,
  diskon: number = 0,
  catatan?: string
): Promise<{ success: boolean; transaction?: Transaction; message?: string }> {
  const allMenu = getStoredMenuItems();

  // Validate stock availability
  for (const item of cart) {
    const menuItem = allMenu.find((m) => m.id === item.menuItem.id);
    if (!menuItem) {
      return { success: false, message: `Menu "${item.menuItem.nama}" tidak ditemukan!` };
    }
    if (menuItem.stok < item.jumlah) {
      return {
        success: false,
        message: `Stok "${menuItem.nama}" tidak mencukupi (sisa: ${menuItem.stok}, diminta: ${item.jumlah})!`,
      };
    }
  }

  const now = new Date();
  const dateCode = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
    .getDate()
    .toString()
    .padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const txId = `TRX-${dateCode}-${randomSuffix}`;

  const subtotalTotal = cart.reduce((acc, curr) => acc + curr.subtotal, 0);
  const totalAkhir = Math.max(0, subtotalTotal - diskon);
  const kembalian = metodeBayar === 'cash' ? Math.max(0, jumlahBayar - totalAkhir) : 0;

  // Deduct stock
  cart.forEach((item) => {
    const m = allMenu.find((x) => x.id === item.menuItem.id);
    if (m) {
      m.stok -= item.jumlah;
      m.updated_at = now.toISOString();
    }
  });
  saveMenuItemsToStorage(allMenu);

  const txDetails = cart.map((c) => ({
    id: `txd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    transaksi_id: txId,
    menu_id: c.menuItem.id,
    nama_menu: c.menuItem.nama,
    harga_satuan: c.menuItem.harga,
    jumlah: c.jumlah,
    subtotal: c.subtotal,
    catatan: c.catatan,
  }));

  const transaction: Transaction = {
    id: txId,
    waktu: now.toISOString(),
    kasir_nama: kasir.nama,
    kasir_id: kasir.id,
    metode_bayar: metodeBayar,
    total_harga: subtotalTotal,
    diskon,
    total_akhir: totalAkhir,
    jumlah_bayar: metodeBayar === 'cash' ? jumlahBayar : totalAkhir,
    kembalian,
    catatan,
    status: 'sukses',
    items: txDetails,
  };

  const allTx = getStoredTransactions();
  allTx.unshift(transaction);
  saveTransactionsToStorage(allTx);

  // Sync with Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('transaksi').insert([
        {
          id: transaction.id,
          waktu: transaction.waktu,
          kasir_nama: transaction.kasir_nama,
          kasir_id: transaction.kasir_id,
          metode_bayar: transaction.metode_bayar,
          total_harga: transaction.total_harga,
          diskon: transaction.diskon,
          total_akhir: transaction.total_akhir,
          jumlah_bayar: transaction.jumlah_bayar,
          kembalian: transaction.kembalian,
          catatan: transaction.catatan,
          status: transaction.status,
        },
      ]);

      await supabase.from('transaksi_detail').insert(
        txDetails.map((td) => ({
          transaksi_id: td.transaksi_id,
          menu_id: td.menu_id,
          nama_menu: td.nama_menu,
          harga_satuan: td.harga_satuan,
          jumlah: td.jumlah,
          subtotal: td.subtotal,
          catatan: td.catatan,
        }))
      );
    } catch (e) {
      console.error('Supabase transaction sync error:', e);
    }
  }

  return { success: true, transaction };
}

export async function voidTransaction(txId: string): Promise<boolean> {
  const allTx = getStoredTransactions();
  const tx = allTx.find((t) => t.id === txId);
  if (!tx || tx.status === 'dibatalkan') return false;

  tx.status = 'dibatalkan';

  // Restore stock
  const allMenu = getStoredMenuItems();
  tx.items.forEach((item) => {
    const m = allMenu.find((x) => x.id === item.menu_id);
    if (m) {
      m.stok += item.jumlah;
    }
  });
  saveMenuItemsToStorage(allMenu);
  saveTransactionsToStorage(allTx);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('transaksi').update({ status: 'dibatalkan' }).eq('id', txId);
    } catch (e) {
      console.error('Supabase void error:', e);
    }
  }

  return true;
}

// REALTIME LISTENER FOR COMPONENT HOOKS
export function subscribeToRealtimeChanges(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = () => {
    callback();
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }

  // Also listen to window storage event for multi-window
  window.addEventListener('storage', handleMessage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleMessage);
  };
}

// REPORT & ANALYTICS CALCULATORS
export function calculateReportSummary(): SalesReportSummary {
  const transactions = getStoredTransactions().filter((t) => t.status === 'sukses');
  const menuItems = getStoredMenuItems();

  const current = new Date();
  const startOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();

  // Start of week (Monday)
  const day = current.getDay();
  const diffToMon = current.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(current.getFullYear(), current.getMonth(), diffToMon, 0, 0, 0, 0).getTime();

  // Start of month
  const startOfMonth = new Date(current.getFullYear(), current.getMonth(), 1).getTime();

  let totalPendapatan = 0;
  let totalItemTerjual = 0;
  let pendapatanHariIni = 0;
  let transaksiHariIni = 0;
  let pendapatanMingguIni = 0;
  let pendapatanBulanIni = 0;

  transactions.forEach((tx) => {
    const txTime = new Date(tx.waktu).getTime();
    totalPendapatan += tx.total_akhir;

    tx.items.forEach((i) => {
      totalItemTerjual += i.jumlah;
    });

    if (txTime >= startOfDay) {
      pendapatanHariIni += tx.total_akhir;
      transaksiHariIni += 1;
    }

    if (txTime >= startOfWeek) {
      pendapatanMingguIni += tx.total_akhir;
    }

    if (txTime >= startOfMonth) {
      pendapatanBulanIni += tx.total_akhir;
    }
  });

  const stokKritisCount = menuItems.filter((m) => m.stok <= m.ambang_batas).length;

  return {
    totalPendapatan,
    totalTransaksi: transactions.length,
    totalItemTerjual,
    pendapatanHariIni,
    transaksiHariIni,
    pendapatanMingguIni,
    pendapatanBulanIni,
    stokKritisCount,
  };
}

export function getTopSellingItems(limit: number = 5): TopSellingItemData[] {
  const transactions = getStoredTransactions().filter((t) => t.status === 'sukses');
  const itemMap: Record<string, { nama: string; terjual: number; totalPendapatan: number }> = {};

  transactions.forEach((tx) => {
    tx.items.forEach((item) => {
      if (!itemMap[item.nama_menu]) {
        itemMap[item.nama_menu] = { nama: item.nama_menu, terjual: 0, totalPendapatan: 0 };
      }
      itemMap[item.nama_menu].terjual += item.jumlah;
      itemMap[item.nama_menu].totalPendapatan += item.subtotal;
    });
  });

  return Object.values(itemMap)
    .sort((a, b) => b.terjual - a.terjual)
    .slice(0, limit);
}

export function getDailySalesHistory(days: number = 7): DailySalesData[] {
  const transactions = getStoredTransactions().filter((t) => t.status === 'sukses');
  const result: DailySalesData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 86400000;

    const dayTxs = transactions.filter((t) => {
      const time = new Date(t.waktu).getTime();
      return time >= dayStart && time < dayEnd;
    });

    const total = dayTxs.reduce((sum, t) => sum + t.total_akhir, 0);

    result.push({
      tanggal: dateStr,
      total,
      transaksi: dayTxs.length,
    });
  }

  return result;
}
