'use client';

import React, { useState } from 'react';
import { CartItem } from '@/types/pos';
import { ShoppingBag, Plus, Minus, Trash2, Edit3, ArrowRight, Tag, Check, X } from 'lucide-react';

interface CartSidebarProps {
  cartItems: CartItem[];
  onUpdateQuantity: (menuId: string, delta: number) => void;
  onRemoveItem: (menuId: string) => void;
  onUpdateNotes: (menuId: string, notes: string) => void;
  onClearCart: () => void;
  onOpenPaymentModal: (discount: number) => void;
}

export default function CartSidebar({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onClearCart,
  onOpenPaymentModal,
}: CartSidebarProps) {
  const [discountInput, setDiscountInput] = useState<string>('0');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const discountAmount = Math.min(subtotal, Math.max(0, parseInt(discountInput) || 0));
  const totalAkhir = Math.max(0, subtotal - discountAmount);
  const totalPorsi = cartItems.reduce((a, b) => a + b.jumlah, 0);

  const handleSaveNote = (menuId: string) => {
    onUpdateNotes(menuId, noteText.trim());
    setEditingNoteId(null);
    setNoteText('');
  };

  return (
    <div className="w-full lg:w-80 xl:w-88 bg-white border-l border-slate-200 flex flex-col h-full shadow-md transition-all">
      {/* Sidebar Header */}
      <div className="p-3 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-xs sm:text-sm">Pesanan Sekarang</h2>
            <p className="text-[11px] text-slate-500">
              {cartItems.length} menu ({totalPorsi} porsi)
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-md transition"
          >
            <Trash2 className="w-3 h-3" />
            <span>Kosongkan</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="p-3 bg-slate-100 rounded-full mb-2.5 text-slate-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-600 text-xs sm:text-sm">Keranjang Masih Kosong</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Klik tombol tambah (+) pada daftar menu untuk memasukkan pesanan.
            </p>
          </div>
        ) : (
          cartItems.map((item) => {
            const isEditingThisNote = editingNoteId === item.menuItem.id;

            return (
              <div
                key={item.menuItem.id}
                className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 space-y-2 transition-all"
              >
                {/* Title & Subtotal */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 text-xs truncate" title={item.menuItem.nama}>
                      {item.menuItem.nama}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Rp {item.menuItem.harga.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-blue-700 text-xs">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Note Editor or Display */}
                {isEditingThisNote ? (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveNote(item.menuItem.id);
                        if (e.key === 'Escape') setEditingNoteId(null);
                      }}
                      placeholder="Catatan (cth: tanpa es...)"
                      className="flex-1 px-2 py-0.5 text-[11px] border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveNote(item.menuItem.id)}
                      className="p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      title="Simpan Catatan"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="p-1 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300"
                      title="Batal"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingNoteId(item.menuItem.id);
                        setNoteText(item.catatan || '');
                      }}
                      className={`text-[10px] px-1.5 py-0.5 rounded transition flex items-center gap-1 max-w-[170px] truncate ${
                        item.catatan
                          ? 'bg-amber-100 text-amber-800 font-semibold'
                          : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <Edit3 className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{item.catatan ? item.catatan : '+ Catatan'}</span>
                    </button>
                  </div>
                )}

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                  <span className="text-[10px] text-slate-400">
                    Stok: <strong className="text-slate-600 font-semibold">{item.menuItem.stok}</strong>
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                        className="p-1 text-slate-600 hover:bg-slate-100 rounded transition"
                        title="Kurangi"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.jumlah}
                      </span>

                      <button
                        disabled={item.jumlah >= item.menuItem.stok}
                        onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                        className={`p-1 rounded transition ${
                          item.jumlah >= item.menuItem.stok
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Tambah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.menuItem.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Hapus menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Checkout Footer */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-3">
        {/* Discount Input */}
        <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>Diskon (Rp):</span>
          </div>
          <input
            type="number"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
            min="0"
            step="1000"
            className="w-24 px-2 py-0.5 text-right text-xs font-extrabold border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Price Breakdown */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Diskon</span>
              <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-sm pt-1.5 border-t border-slate-200 text-slate-900">
            <span>Total Bayar</span>
            <span className="text-blue-700 text-base">Rp {totalAkhir.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          disabled={cartItems.length === 0}
          onClick={() => onOpenPaymentModal(discountAmount)}
          className={`w-full py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            cartItems.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-100 active:scale-[0.99]'
          }`}
        >
          <span>Proses Pembayaran</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

