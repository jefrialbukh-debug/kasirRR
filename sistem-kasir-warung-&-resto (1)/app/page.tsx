'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, ShoppingCart, LayoutDashboard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { UserProfile } from '@/types/pos';
import { getStoredUsers } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      const allUsers = getStoredUsers();
      setUsers(allUsers);
      setCurrentUser(allUsers[0]);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        currentUser={currentUser}
        onSwitchUser={(u) => setCurrentUser(u)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Portal View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center items-center">
        {/* Welcome Hero Card */}
        <div className="w-full bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden mb-8 border border-blue-800">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-800/90 border border-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Sistem Kasir Resto Sleek Interface</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Kelola Transaksi & Stok Resto Lebih Cepat dan Akurat
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Sistem Kasir (POS) serba bisa lengkap dengan cetak struk digital, pembayaran QRIS, update stok otomatis real-time, dan laporan penjualan berbasis grafik.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/kasir"
                className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-2xl flex items-center space-x-2 shadow-lg shadow-blue-900/30 transition active:scale-95"
              >
                <ShoppingCart className="w-5 h-5 text-blue-700" />
                <span>Buka Aplikasi Kasir (POS)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/admin/dashboard"
                className="px-6 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm rounded-2xl flex items-center space-x-2 border border-blue-600 backdrop-blur-md transition"
              >
                <LayoutDashboard className="w-5 h-5 text-amber-300" />
                <span>Dashboard Admin Backoffice</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Access Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Kasir POS */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">Sisi Kasir (Point of Sale)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digunakan oleh kasir untuk melayani pesanan pembeli di meja atau kasir utama.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Katalog menu grid filterable per kategori</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Hitung total otomatis, diskon, dan kembalian</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Pembayaran Tunai (Cash) & QRIS Standar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cetak / Tampilkan Struk Digital Thermal</span>
                </li>
              </ul>
            </div>

            <Link
              href="/kasir"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-blue-100"
            >
              <span>Masuk Halaman Kasir</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Admin Backoffice */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">Dashboard Admin (Backoffice)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digunakan pemilik usaha atau manajer untuk mengelola menu, stok, dan laporan.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>CRUD Menu (Tambah, Edit, Hapus, Harga)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Kelola Stok & Ambang batas stok menipis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Laporan Grafik Omset & Item Terlaris (Recharts)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Kelola Akun Kasir & Integrasi Supabase</span>
                </li>
              </ul>
            </div>

            <Link
              href="/admin/dashboard"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-md"
            >
              <span>Masuk Dashboard Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {isAuthModalOpen && (
        <AuthModal
          users={users}
          onSuccessAuth={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            if (user.role === 'admin') router.push('/admin/dashboard');
            else router.push('/kasir');
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
