'use client';

import React, { useState } from 'react';
import {
  calculateReportSummary,
  getDailySalesHistory,
  getTopSellingItems,
  getStoredTransactions,
} from '@/lib/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Download,
  Calendar,
  CreditCard,
  Banknote,
  Award,
} from 'lucide-react';

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');

  const summary = calculateReportSummary();
  const dailySalesData = getDailySalesHistory(timeRange === '7days' ? 7 : 30);
  const topSellingData = getTopSellingItems(5);
  const transactions = getStoredTransactions().filter((t) => t.status === 'sukses');

  // Payment method breakdown
  const cashCount = transactions.filter((t) => t.metode_bayar === 'cash').length;
  const qrisCount = transactions.filter((t) => t.metode_bayar === 'qris').length;

  const paymentData = [
    { name: 'Tunai (Cash)', value: cashCount, color: '#10b981' },
    { name: 'QRIS Digital', value: qrisCount, color: '#2563eb' },
  ];

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No Struk,Waktu,Kasir,Metode Bayar,Total Akhir,Status\n';

    transactions.forEach((tx) => {
      csvContent += `"${tx.id}","${tx.waktu}","${tx.kasir_nama}","${tx.metode_bayar}","${tx.total_akhir}","${tx.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Laporan & Analitik Penjualan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi grafik omset harian, produk terlaris, dan metode pembayaran
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-100"
        >
          <Download className="w-4 h-4" />
          <span>Export Data (CSV)</span>
        </button>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-slate-500">Pendapatan Hari Ini</span>
            <div className="p-2 bg-blue-50 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            Rp {summary.pendapatanHariIni.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-400">
            Dari <strong>{summary.transaksiHariIni}</strong> transaksi hari ini
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-500">Total Pendapatan Akumulasi</span>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            Rp {summary.totalPendapatan.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-400">
            Total <strong>{summary.totalTransaksi}</strong> transaksi tersimpan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-500">Total Porsi / Item Terjual</span>
            <div className="p-2 bg-amber-50 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {summary.totalItemTerjual} <span className="text-xs font-semibold text-slate-400">porsi</span>
          </p>
          <p className="text-[11px] text-slate-400">Terhitung dari semua struk sukses</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold text-slate-500">Item Terlaris No. 1</span>
            <div className="p-2 bg-purple-50 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 truncate">
            {topSellingData[0]?.nama || 'Belum ada data'}
          </p>
          <p className="text-[11px] text-slate-400">
            {topSellingData[0] ? `${topSellingData[0].terjual} porsi terjual` : '-'}
          </p>
        </div>
      </div>

      {/* Daily Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Grafik Trend Pendapatan Harian</h3>
            <p className="text-xs text-slate-400">Perkembangan total omset per hari dalam rupiah</p>
          </div>

          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                timeRange === '7days' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                timeRange === '30days' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              30 Hari Terakhir
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `Rp ${(val / 1000).toLocaleString('id-ID')}k`}
              />
              <Tooltip
                formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Omset']}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Top Selling & Payment Method Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>5 Menu Kuliner Terlaris (Top Selling)</span>
          </h3>

          <div className="space-y-3">
            {topSellingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{item.nama}</p>
                    <p className="text-[10px] text-slate-400">
                      Omset: Rp {item.totalPendapatan.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <span className="font-extrabold text-blue-700 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {item.terjual} porsi
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Distribus Metode Pembayaran</span>
          </h3>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Transaksi`, 'Jumlah']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
