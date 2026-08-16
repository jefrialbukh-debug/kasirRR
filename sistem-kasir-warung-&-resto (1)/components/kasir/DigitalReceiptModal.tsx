'use client';

import React, { useRef } from 'react';
import { Transaction } from '@/types/pos';
import { Printer, Share2, CheckCircle2, X, Store, Download } from 'lucide-react';

interface DigitalReceiptModalProps {
  transaction: Transaction;
  onClose: () => void;
  onNewTransaction: () => void;
}

export default function DigitalReceiptModal({
  transaction,
  onClose,
  onNewTransaction,
}: DigitalReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const formattedDate = new Date(transaction.waktu).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-sm">Pembayaran Berhasil!</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-emerald-700 text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
          <div
            ref={receiptRef}
            id="printable-receipt"
            className="w-full max-w-[320px] bg-white p-6 shadow-md rounded-xl font-mono text-xs text-slate-800 space-y-4 border border-slate-200"
          >
            {/* Header / Store Name */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-center mb-1">
                <div className="p-2 bg-blue-900 text-white rounded-xl inline-block">
                  <Store className="w-6 h-6" />
                </div>
              </div>
              <h2 className="font-black text-sm tracking-wider uppercase text-slate-900">
                WARUNG & RESTO NUSANTARA
              </h2>
              <p className="text-[10px] text-slate-500">Jl. Malioboro No. 45, Yogyakarta</p>
              <p className="text-[10px] text-slate-500">Telp/WA: 0812-3456-7890</p>
            </div>

            {/* Transaction Meta */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Struk:</span>
                <span className="font-bold">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir:</span>
                <span>{transaction.kasir_nama}</span>
              </div>
              {transaction.catatan && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span className="text-slate-500">Catatan:</span>
                  <span>{transaction.catatan}</span>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="truncate pr-2">{item.nama_menu}</span>
                    <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pl-2">
                    <span>
                      {item.jumlah} x Rp {item.harga_satuan.toLocaleString('id-ID')}
                    </span>
                    {item.catatan && <span className="italic text-amber-600">({item.catatan})</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>Rp {transaction.total_harga.toLocaleString('id-ID')}</span>
              </div>
              {transaction.diskon > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon</span>
                  <span>- Rp {transaction.diskon.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 pt-1">
                <span>TOTAL AKHIR</span>
                <span>Rp {transaction.total_akhir.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Payment info & Change */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold uppercase">{transaction.metode_bayar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bayar:</span>
                <span>Rp {transaction.jumlah_bayar.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Kembalian:</span>
                <span>Rp {transaction.kembalian.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center text-[10px] text-slate-400 pt-1 space-y-0.5">
              <p className="font-bold text-slate-600">*** TERIMA KASIH ***</p>
              <p>Selamat menikmati santapan Anda!</p>
              <p>Simpan struk ini sebagai bukti pembayaran sah.</p>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk</span>
            </button>

            <button
              onClick={onNewTransaction}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Pesanan Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
