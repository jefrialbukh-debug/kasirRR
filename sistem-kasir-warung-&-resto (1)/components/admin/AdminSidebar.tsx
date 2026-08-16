'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PackageCheck,
  BarChart3,
  Users,
  Database,
  ArrowLeft,
  Store
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Ringkasan Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Kelola Menu (CRUD)',
      href: '/admin/menu',
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      label: 'Kelola Stok Real-time',
      href: '/admin/stok',
      icon: <PackageCheck className="w-4 h-4" />,
    },
    {
      label: 'Laporan Penjualan',
      href: '/admin/laporan',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: 'Kelola User / Kasir',
      href: '/admin/users',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Setup Database Supabase',
      href: '/admin/supabase-info',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-blue-700 text-white flex flex-col shrink-0 border-r border-blue-800 shadow-md">
      <div className="p-5 border-b border-blue-800/80 flex items-center justify-between bg-blue-800/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-700 font-black text-lg shadow-xs">
            R
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-white">Admin Backoffice</h2>
            <p className="text-[10px] text-blue-100 font-medium">Sistem Kasir Resto</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-extrabold text-blue-200 uppercase tracking-wider px-3 py-1.5 opacity-80">
          Menu Utama Admin
        </p>

        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Return to Kasir */}
      <div className="p-4 border-t border-blue-800/80 bg-blue-800/20">
        <Link
          href="/kasir"
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-xl border border-blue-600 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Sisi Kasir (POS)</span>
        </Link>
      </div>
    </aside>
  );
}
