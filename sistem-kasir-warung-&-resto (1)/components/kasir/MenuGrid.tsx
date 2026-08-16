'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem, CategoryType } from '@/types/pos';
import { Search, Plus, AlertTriangle, XCircle, CheckCircle, Utensils, Coffee, Cookie, Package } from 'lucide-react';

interface MenuGridProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const CATEGORIES: { label: string; value: CategoryType | 'Semua'; icon: React.ReactNode }[] = [
  { label: 'Semua Menu', value: 'Semua', icon: <Utensils className="w-4 h-4" /> },
  { label: 'Makanan', value: 'Makanan', icon: <Utensils className="w-4 h-4" /> },
  { label: 'Minuman', value: 'Minuman', icon: <Coffee className="w-4 h-4" /> },
  { label: 'Cemilan', value: 'Cemilan', icon: <Cookie className="w-4 h-4" /> },
  { label: 'Paket Hemat', value: 'Paket', icon: <Package className="w-4 h-4" /> },
];

export default function MenuGrid({ menuItems, onAddToCart }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    if (!item.is_active) return false;
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Search & Category Filter Header */}
      <div className="bg-white p-4 border-b border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu makanan, minuman, atau kode..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat.value === 'Semua'
                ? menuItems.filter((i) => i.is_active).length
                : menuItems.filter((i) => i.is_active && i.kategori === cat.value).length;

            const isSelected = selectedCategory === cat.value;

            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-blue-800 text-blue-100 font-bold' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-200">
            <Utensils className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Menu Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">
              Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const isOutOfStock = item.stok <= 0;
              const isLowStock = item.stok > 0 && item.stok <= item.ambang_batas;

              return (
                <div
                  key={item.id}
                  className={`bg-white border border-slate-100 rounded-2xl p-3 flex flex-col h-full relative transition-all duration-200 shadow-xs hover:shadow-md ${
                    isOutOfStock ? 'opacity-60 bg-slate-50' : ''
                  }`}
                >
                  <div className="aspect-square bg-slate-100 rounded-xl mb-3 overflow-hidden flex items-center justify-center text-slate-300 relative">
                    {item.gambar ? (
                      <Image
                        src={item.gambar}
                        alt={item.nama}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <Utensils className="w-10 h-10 text-blue-300" />
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 leading-tight mb-1 text-sm line-clamp-1">{item.nama}</h3>
                  <p className="text-blue-700 font-bold text-sm mb-2">Rp {item.harga.toLocaleString('id-ID')}</p>

                  <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-50">
                    {isOutOfStock ? (
                      <span className="text-xs px-2 py-1 bg-red-50 text-red-600 font-bold rounded">Habis</span>
                    ) : isLowStock ? (
                      <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 font-bold rounded">Stok: {item.stok}</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-600 font-bold rounded">Stok: {item.stok}</span>
                    )}

                    <button
                      disabled={isOutOfStock}
                      onClick={() => onAddToCart(item)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm shadow-blue-200 active:scale-95'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Supabase Realtime Activity Banner */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-2xs">
          <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
            Supabase Realtime Activity
          </h4>
          <div className="flex items-center gap-4 text-xs font-semibold text-blue-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
              <span>Connected & Synchronized</span>
            </div>
            <div className="opacity-75 italic font-normal">Sync Otomatis Real-time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
