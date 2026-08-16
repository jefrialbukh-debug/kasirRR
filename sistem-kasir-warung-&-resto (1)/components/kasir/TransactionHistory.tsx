'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/pos';
import { voidTransaction } from '@/lib/store';
import { Search, Receipt, Calendar, CreditCard, Banknote, RefreshCw, Eye, XCircle } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onRefresh: () => void;
  onViewReceipt: (tx: Transaction) => void;
}

export default function TransactionHistory({
  transactions,
  onRefresh,
  onViewReceipt,
}: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState<'all' | 'cash' | 'qris'>('all');
  const [voidingId, setVoidingId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.kasir_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.catatan && tx.catatan.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPayment = filterPayment === 'all' || tx.metode_bayar === filterPayment;

    return matchesSearch && matchesPayment;
  });

  const handleVoid = async (txId: string) => {
    if (confirm(`Yakin ingin membatalkan transaksi ${txId}? Stok menu akan dikembalikan secara otomatis.`)) {
      setVoidingId(txId);
      await voidTransaction(txId);
      onRefresh();
      setVoidingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header & Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Riwayat & Catatan Penjualan</h3>
              <p className="text-xs text-slate-400">Semua transaksi tercatat otomatis secara real-time</p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Segarkan Data</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID Struk, nama kasir, atau catatan..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterPayment('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterPayment === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterPayment('cash')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterPayment === 'cash' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tunai
            </button>
            <button
              onClick={() => setFilterPayment('qris')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterPayment === 'qris' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              QRIS
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">Belum Ada Riwayat Transaksi</p>
            <p className="text-xs text-slate-400 mt-1">
              Transaksi yang berhasil diproses akan langsung muncul di sini.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">No. Struk & Waktu</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Item Dibelii</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Total Akhir</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isCanceled = tx.status === 'dibatalkan';
                const formattedTime = new Date(tx.waktu).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{tx.id}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedTime}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">{tx.kasir_nama}</td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-medium text-slate-800 truncate">
                        {tx.items.map((i) => `${i.nama_menu} (${i.jumlah})`).join(', ')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Total {tx.items.reduce((a, b) => a + b.jumlah, 0)} item
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.metode_bayar === 'cash'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tx.metode_bayar === 'cash' ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        {tx.metode_bayar.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-blue-900">
                      Rp {tx.total_akhir.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCanceled ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {isCanceled ? 'Dibatalkan' : 'Sukses'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onViewReceipt(tx)}
                          className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                          title="Lihat Struk"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isCanceled && (
                          <button
                            disabled={voidingId === tx.id}
                            onClick={() => handleVoid(tx.id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                            title="Batalkan Transaksi & Kembalikan Stok"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
