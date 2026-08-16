'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Store, 
  LayoutDashboard, 
  ShoppingCart, 
  PackageCheck, 
  BarChart3, 
  Users, 
  LogOut, 
  Lock, 
  Clock, 
  Wifi, 
  Database,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '@/types/pos';
import { getStoredUsers, subscribeToRealtimeChanges } from '@/lib/store';
import { SUPABASE_STATUS } from '@/lib/supabase';

interface NavbarProps {
  currentUser: UserProfile | null;
  onSwitchUser: (user: UserProfile) => void;
  onOpenAuthModal: () => void;
}

export default function Navbar({ currentUser, onSwitchUser, onOpenAuthModal }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState<string>('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Clock updater
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);

    Promise.resolve().then(() => {
      setUsers(getStoredUsers());
    });

    const unsubscribe = subscribeToRealtimeChanges(() => {
      setUsers(getStoredUsers());
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <header className="bg-blue-700 text-white shadow-sm sticky top-0 z-40 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-700 font-extrabold text-xl shadow-sm">
              R
            </div>
            <div>
              <Link href="/" className="font-extrabold text-lg tracking-tight hover:text-blue-100 transition">
                Sistem Kasir Resto
              </Link>
              <div className="flex items-center space-x-2 text-xs text-blue-100">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Database className="w-3 h-3" />
                  {SUPABASE_STATUS.configured ? 'Supabase Realtime' : 'Local Storage Mode'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/kasir"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                pathname === '/kasir'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Kasir (POS)</span>
            </Link>

            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isAdminPath
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Admin</span>
            </Link>
          </nav>

          {/* Right Section: Time & User Control */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1 bg-blue-950/60 text-blue-200 px-3 py-1.5 rounded-lg text-xs font-mono border border-blue-800">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{time || '00:00:00'}</span>
            </div>

            {/* User Profile / Switch Role */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-sm font-medium transition border border-blue-700 focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentUser?.role === 'admin' ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {currentUser?.nama ? currentUser.nama.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-tight">{currentUser?.nama || 'Pilih Kasir'}</div>
                  <div className="text-[10px] text-blue-300 uppercase tracking-wider">
                    {currentUser?.role === 'admin' ? '🔑 Admin' : '💳 Kasir'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-blue-300" />
              </button>

              {/* User Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Pengguna Aktif:</p>
                    <p className="text-sm font-bold text-slate-800">{currentUser?.nama}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        currentUser?.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {currentUser?.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="px-2 py-1">
                    <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Ganti Pengguna:
                    </p>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setIsDropdownOpen(false);
                          if (u.role === 'admin' && !pathname.startsWith('/admin')) {
                            router.push('/admin/dashboard');
                          } else if (u.role === 'kasir' && pathname.startsWith('/admin')) {
                            router.push('/kasir');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                          currentUser?.id === u.id
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{u.nama}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1 px-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center space-x-2 transition"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Masuk Kode PIN Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
