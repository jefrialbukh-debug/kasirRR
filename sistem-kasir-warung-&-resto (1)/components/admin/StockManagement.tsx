'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types/pos';
import { updateStock } from '@/lib/store';
import { PackageCheck, AlertTriangle, Plus, Minus, Search, CheckCircle2, RefreshCw } from 'lucide-react';

interface StockManagementProps {
  menuItems: MenuItem[];
  onRefresh: () => void;
}

export default function StockManagement({ menuItems, onRefresh }: StockManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStockChange = async (id: string, currentStock: number, delta: number) => {
    setUpdatingId(id);
    const newStock = Math.max(0, currentStock + delta);
    await updateStock(id, newStock);
    onRefresh();
    setUpdatingId(null);
  };

  const handleManualSetStock = async (id: string, value: string) => {
    const val = parseInt(value);
    if (!isNaN(val) && val >= 0) {
      setUpdatingId(id);
      await updateStock(id, val);
      onRefresh();
      setUpdatingId(null);
    }
  };

  const lowStockItems = menuItems.filter((m) => m.stok <= m.ambang_batas);
  const outOfStockItems = menuItems.filter((m) => m.stok <= 0);

  const filteredItems = menuItems.filter((m) => {
    const matchesSearch = m.nama.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'low') return matchesSearch && m.stok > 0 && m.stok <= m.ambang_batas;
    if (filterType === 'out') return matchesSearch && m.stok <= 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Alert Header Banner if stock is low or out */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 text-amber-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h3 className="font-extrabold text-amber-900 text-sm">
              Perhatian: {lowStockItems.length} Item Membutuhkan Restok Segera!
            </h3>
            <p className="mt-0.5 text-amber-700">
              Berikut menu yang stoknya menipis/habis:
              <strong className="ml-1">
                {lowStockItems.map((m) => `${m.nama} (sisa ${m.stok})`).join(', ')}
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-600" />
            <span>Manajemen Stok Real-Time</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Update jumlah persediaan stok barang secara manual, tambah stok otomatis, dan pantau status
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({menuItems.length})
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'low' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Stok Menipis ({lowStockItems.length - outOfStockItems.length})
          </button>
          <button
            onClick={() => setFilterType('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'out' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Habis ({outOfStockItems.length})
          </button>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOutOfStock = item.stok <= 0;
          const isLowStock = item.stok > 0 && item.stok <= item.ambang_batas;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                isOutOfStock
                  ? 'border-red-200 bg-red-50/30'
                  : isLowStock
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start space-x-3 mb-3">
                  <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {item.gambar && (
                      <Image
                        src={item.gambar}
                        alt={item.nama}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1">{item.nama}</h4>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">
                        {item.kategori}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOutOfStock
                            ? 'bg-red-600 text-white'
                            : isLowStock
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isOutOfStock ? 'HABIS' : isLowStock ? 'STOK MENIPIS' : 'AMANKAN STOK'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Batas: {item.ambang_batas} porsi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Jumlah Stok</p>
                    <input
                      type="number"
                      value={item.stok}
                      onChange={(e) => handleManualSetStock(item.id, e.target.value)}
                      min="0"
                      className="w-16 text-center font-black text-xl bg-white border border-slate-300 rounded-lg py-0.5 text-blue-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStockChange(item.id, item.stok, -1)}
                      className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition"
                      title="Kurangi 1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStockChange(item.id, item.stok, 1)}
                      className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition"
                      title="Tambah 1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Restock Buttons */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                <span className="text-[10px] text-slate-400 font-bold">Restok Cepat:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleStockChange(item.id, item.stok, 5)}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleStockChange(item.id, item.stok, 10)}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => handleStockChange(item.id, item.stok, 25)}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition"
                  >
                    +25
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
