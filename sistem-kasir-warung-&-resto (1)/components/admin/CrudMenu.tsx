'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem, CategoryType } from '@/types/pos';
import { saveMenuItem, deleteMenuItem } from '@/lib/store';
import { Plus, Edit2, Trash2, Search, UtensilsCrossed, X, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';

interface CrudMenuProps {
  menuItems: MenuItem[];
  onRefresh: () => void;
}

const SAMPLE_IMAGES = [
  { name: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },
  { name: 'Mie Goreng', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500' },
  { name: 'Ayam Goreng', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500' },
  { name: 'Sate Ayam', url: 'https://images.unsplash.com/photo-1529563021893-cc83c921389e?w=500' },
  { name: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500' },
  { name: 'Es Jeruk', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500' },
  { name: 'Kopi Susu', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500' },
  { name: 'Tempe Mendoan', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
];

export default function CrudMenu({ menuItems, onRefresh }: CrudMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  // Form State
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<CategoryType>('Makanan');
  const [harga, setHarga] = useState<number>(15000);
  const [stok, setStok] = useState<number>(20);
  const [ambangBatas, setAmbangBatas] = useState<number>(5);
  const [gambar, setGambar] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState('');

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setNama(item.nama);
      setKategori(item.kategori);
      setHarga(item.harga);
      setStok(item.stok);
      setAmbangBatas(item.ambang_batas || 5);
      setGambar(item.gambar || '');
      setDeskripsi(item.deskripsi || '');
    } else {
      setEditingItem(null);
      setNama('');
      setKategori('Makanan');
      setHarga(15000);
      setStok(20);
      setAmbangBatas(5);
      setGambar(SAMPLE_IMAGES[0].url);
      setDeskripsi('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    await saveMenuItem({
      id: editingItem?.id,
      nama,
      kategori,
      harga,
      stok,
      ambang_batas: ambangBatas,
      gambar: gambar || SAMPLE_IMAGES[0].url,
      deskripsi,
      is_active: true,
    });

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string, namaMenu: string) => {
    if (confirm(`Hapus menu "${namaMenu}" dari daftar?`)) {
      await deleteMenuItem(id);
      onRefresh();
    }
  };

  const filteredItems = menuItems.filter((m) => {
    const matchesCategory = selectedCategory === 'semua' || m.kategori.toLowerCase() === selectedCategory;
    const matchesSearch = m.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-blue-600" />
            <span>Manajemen & CRUD Menu Kuliner</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tambah menu baru, ubah harga, kategori, dan atur ketersediaan stok
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-blue-100"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="semua">Semua Kategori</option>
          <option value="makanan">Makanan</option>
          <option value="minuman">Minuman</option>
          <option value="cemilan">Cemilan</option>
          <option value="paket">Paket</option>
        </select>
      </div>

      {/* Menu Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Foto & Menu</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga Jual</th>
                <th className="py-3 px-4">Stok Saat Ini</th>
                <th className="py-3 px-4">Ambang Batas Menipis</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isOutOfStock = item.stok <= 0;
                const isLowStock = item.stok > 0 && item.stok <= item.ambang_batas;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {item.gambar ? (
                            <Image
                              src={item.gambar}
                              alt={item.nama}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <UtensilsCrossed className="w-6 h-6 m-auto text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.nama}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.deskripsi || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        {item.kategori}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-blue-900 text-sm">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOutOfStock
                            ? 'bg-red-100 text-red-700'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3" />}
                        {item.stok} porsi
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      &le; {item.ambang_batas} porsi
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition"
                          title="Edit Menu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-900 text-white">
              <h3 className="font-extrabold text-sm">
                {editingItem ? 'Edit Item Menu' : 'Tambah Menu Kuliner Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-blue-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ayam Bakar Madu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                    <option value="Paket">Paket</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={harga}
                    onChange={(e) => setHarga(parseInt(e.target.value) || 0)}
                    min="0"
                    step="500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={stok}
                    onChange={(e) => setStok(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ambang Stok Menipis</label>
                  <input
                    type="number"
                    value={ambangBatas}
                    onChange={(e) => setAmbangBatas(parseInt(e.target.value) || 5)}
                    min="1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Foto / Gambar</label>
                <input
                  type="text"
                  value={gambar}
                  onChange={(e) => setGambar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 w-full">Preset gambar cepat:</span>
                  {SAMPLE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGambar(preset.url)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 text-slate-600 text-[10px] rounded-md transition"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Bumbu racikan khusus disajikan dengan sambal..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 h-16"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
