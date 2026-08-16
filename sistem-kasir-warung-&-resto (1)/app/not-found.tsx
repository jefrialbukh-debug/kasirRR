'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan (404)</h2>
      <p className="text-slate-500 mb-6 text-sm">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs transition shadow-sm"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
