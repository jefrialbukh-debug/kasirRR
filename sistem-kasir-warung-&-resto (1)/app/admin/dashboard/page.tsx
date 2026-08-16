'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  calculateReportSummary,
  fetchMenuItems,
  getStoredTransactions,
  subscribeToRealtimeChanges,
} from '@/lib/store';
import { MenuItem, Transaction, SalesReportSummary } from '@/types/pos';
import {
  LayoutDashboard,
  DollarSign,
  ShoppingBag,
  PackageCheck,
  AlertTriangle,
  Utensils,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const DEFAULT_SUMMARY: SalesReportSummary = {
  totalPendapatan: 0,
  totalTransaksi: 0,
  totalItemTerjual: 0,
  pendapatanHariIni: 0,
  transaksiHariIni: 0,
  pendapatanMingguIni: 0,
  pendapatanBulanIni: 0,
  stokKritisCount: 0,
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<SalesReportSummary>(DEFAULT_SUMMARY);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      const items = await fetchMenuItems();
      if (!isMounted) return;
      setSummary(calculateReportSummary());
      setMenuItems(items);
      setRecentTransactions(getStoredTransactions().slice(0, 5));
    };
    fetchAll();

    const unsubscribe = subscribeToRealtimeChanges(() => {
      fetchAll();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const lowStockItems = menuItems.filter((m) => m.stok <= m.ambang_batas);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-800 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Overview Sistem Kasir</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Dashboard Ringkasan Warung & Resto</h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Pantau omset harian, ketersediaan stok, dan transaksi langsung secara real-time
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/kasir"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ke Sisi Kasir</span>
          </Link>
        </div>
      </div>

      {/* Low Stock Critical Alert Box */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start justify-between gap-4 shadow-xs text-amber-900">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-sm text-amber-900">
                Peringatan Stok: {lowStockItems.length} Menu Menipis/Habis!
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                {lowStockItems.map((m) => `${m.nama} (Sisa ${m.stok})`).join(', ')}
              </p>
            </div>
          </div>

          <Link
            href="/admin/stok"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition shrink-0"
          >
            Update Stok Sekarang
          </Link>
        </div>
      )}

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-slate-500">Pendapatan Hari Ini</span>
            <div className="p-2 bg-blue-50 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            Rp {summary.pendapatanHariIni.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-400">
            <strong>{summary.transaksiHariIni}</strong> transaksi hari ini
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-500">Total Omset Akumulasi</span>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            Rp {summary.totalPendapatan.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-400">
            Dari <strong>{summary.totalTransaksi}</strong> transaksi tersimpan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold text-slate-500">Total Porsi Terjual</span>
            <div className="p-2 bg-purple-50 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalItemTerjual} porsi</p>
          <p className="text-[11px] text-slate-400">Terhitung dari struk berhasil</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-500">Total Katalog Menu</span>
            <div className="p-2 bg-amber-50 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{menuItems.length} Menu</p>
          <p className="text-[11px] text-slate-400">
            {summary.stokKritisCount} menu stok kritis
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/menu"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
              <Utensils className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Kelola Katalog Menu</h3>
            <p className="text-xs text-slate-400 mt-1">Tambah, edit harga, hapus, dan atur kategori menu</p>
          </div>
        </Link>

        <Link
          href="/admin/stok"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
              <PackageCheck className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Kelola Stok Real-Time</h3>
            <p className="text-xs text-slate-400 mt-1">Update stok persediaan & batas peringatan stok</p>
          </div>
        </Link>

        <Link
          href="/admin/laporan"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Laporan Penjualan</h3>
            <p className="text-xs text-slate-400 mt-1">Grafik omset harian, produk terlaris, & export CSV</p>
          </div>
        </Link>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-slate-800 text-sm">Transaksi Terakhir</h3>
          </div>
          <Link href="/kasir" className="text-xs text-blue-600 hover:underline font-bold">
            Lihat Semua di Sisi Kasir &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">No Struk</th>
                <th className="py-2.5 px-4">Waktu</th>
                <th className="py-2.5 px-4">Kasir</th>
                <th className="py-2.5 px-4">Metode Bayar</th>
                <th className="py-2.5 px-4 text-right">Total Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-800">{tx.id}</td>
                  <td className="py-2.5 px-4 text-slate-500">
                    {new Date(tx.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-700">{tx.kasir_nama}</td>
                  <td className="py-2.5 px-4 uppercase text-[10px] font-bold text-blue-700">{tx.metode_bayar}</td>
                  <td className="py-2.5 px-4 text-right font-black text-blue-900">
                    Rp {tx.total_akhir.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
