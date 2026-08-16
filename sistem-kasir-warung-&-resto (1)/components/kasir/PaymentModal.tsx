'use client';

import React, { useState } from 'react';
import { CartItem, PaymentMethod, UserProfile } from '@/types/pos';
import { X, CreditCard, Banknote, QrCode, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  cartItems: CartItem[];
  discount: number;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccessTransaction: (
    metodeBayar: PaymentMethod,
    jumlahBayar: number,
    catatan?: string
  ) => Promise<void>;
}

export default function PaymentModal({
  cartItems,
  discount,
  currentUser,
  onClose,
  onSuccessTransaction,
}: PaymentModalProps) {
  const [metodeBayar, setMetodeBayar] = useState<PaymentMethod>('cash');
  const [jumlahBayarInput, setJumlahBayarInput] = useState<string>('');
  const [catatanTransaksi, setCatatanTransaksi] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const totalAkhir = Math.max(0, subtotal - discount);

  const jumlahBayarNum = metodeBayar === 'qris' ? totalAkhir : parseInt(jumlahBayarInput) || 0;
  const kembalian = Math.max(0, jumlahBayarNum - totalAkhir);
  const isBayarCukup = jumlahBayarNum >= totalAkhir;

  // Quick Cash nominal suggestions
  const quickNominals = [
    { label: 'Uang Pas', value: totalAkhir },
    { label: 'Rp 10.000', value: 10000 },
    { label: 'Rp 20.000', value: 20000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
  ].filter((n) => n.value >= totalAkhir || n.label === 'Uang Pas');

  const handleSubmit = async () => {
    if (!isBayarCukup) {
      setErrorMsg('Jumlah uang pembayaran masih kurang!');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      await onSuccessTransaction(metodeBayar, jumlahBayarNum, catatanTransaksi);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Terjadi kesalahan saat memproses transaksi.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div>
            <h3 className="font-extrabold text-base">Pembayaran Kasir</h3>
            <p className="text-xs text-blue-200 mt-0.5">Pilih metode pembayaran dan masukkan jumlah nominal</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-blue-800/80 text-blue-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Total Summary Banner */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700">Total Tagihan Pembayaran</p>
              <p className="text-2xl font-black text-blue-900 mt-0.5">
                Rp {totalAkhir.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{cartItems.reduce((a, b) => a + b.jumlah, 0)} Porsi / Items</p>
              {discount > 0 && <p className="text-emerald-600 font-medium">Diskon Rp {discount.toLocaleString('id-ID')}</p>}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMetodeBayar('cash');
                  setJumlahBayarInput(totalAkhir.toString());
                }}
                className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                  metodeBayar === 'cash'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl ${metodeBayar === 'cash' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Tunai (Cash)</p>
                  <p className="text-[10px] text-slate-400">Pembayaran fisik</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetodeBayar('qris');
                  setJumlahBayarInput(totalAkhir.toString());
                }}
                className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                  metodeBayar === 'qris'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl ${metodeBayar === 'qris' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">QRIS Standar</p>
                  <p className="text-[10px] text-slate-400">Scan GoPay, OVO, Shopee, BCA</p>
                </div>
              </button>
            </div>
          </div>

          {/* Cash Payment Details */}
          {metodeBayar === 'cash' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uang Diterima dari Pembeli (Rp)
                </label>
                <input
                  type="number"
                  value={jumlahBayarInput}
                  onChange={(e) => setJumlahBayarInput(e.target.value)}
                  placeholder="Masukkan nominal uang..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  autoFocus
                />
              </div>

              {/* Quick Nominal Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {quickNominals.map((nom, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJumlahBayarInput(nom.value.toString())}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition shadow-xs"
                  >
                    {nom.label}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600">Kembalian:</span>
                <span
                  className={`text-lg font-black ${
                    isBayarCukup ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {isBayarCukup
                    ? `Rp ${kembalian.toLocaleString('id-ID')}`
                    : `Kurang Rp ${(totalAkhir - jumlahBayarNum).toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          )}

          {/* QRIS Payment View */}
          {metodeBayar === 'qris' && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="inline-block p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
                {/* Simulated QR Code SVG */}
                <div className="w-44 h-44 bg-white flex flex-col items-center justify-center relative p-2">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />

                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />

                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />

                    <rect x="35" y="35" width="10" height="10" />
                    <rect x="50" y="35" width="15" height="15" />
                    <rect x="35" y="50" width="15" height="15" />
                    <rect x="55" y="55" width="20" height="20" />
                    <rect x="80" y="75" width="15" height="15" />
                    <rect x="40" y="75" width="10" height="20" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                      QRIS
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">Scan Kode QRIS Warung & Resto</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung semua e-wallet (GoPay, OVO, Dana, ShopeePay) & M-Banking.
                </p>
              </div>
            </div>
          )}

          {/* Optional Order Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Khusus Transaksi (Opsional)
            </label>
            <input
              type="text"
              value={catatanTransaksi}
              onChange={(e) => setCatatanTransaksi(e.target.value)}
              placeholder="Contoh: Meja No. 04 / Bungkus / Takeaway"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!isBayarCukup || isProcessing}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center space-x-2 shadow-md transition ${
              !isBayarCukup || isProcessing
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-200'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Proses Transaksi Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
