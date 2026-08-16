'use client';

import React, { useState } from 'react';
import { SUPABASE_STATUS } from '@/lib/supabase';
import { Database, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

const SQL_SCHEMA = `-- ============================================================
-- SKEMA TABEL SUPABASE UNTUK SISTEM KASIR (POS) WARUNG/RESTORAN
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL MENU
CREATE TABLE IF NOT EXISTS public.menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Makanan', 'Minuman', 'Cemilan', 'Paket')),
  harga NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
  stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
  ambang_batas INTEGER NOT NULL DEFAULT 5 CHECK (ambang_batas >= 0),
  gambar TEXT,
  deskripsi TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL TRANSAKSI
CREATE TABLE IF NOT EXISTS public.transaksi (
  id VARCHAR(50) PRIMARY KEY,
  waktu TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kasir_nama VARCHAR(100) NOT NULL,
  kasir_id VARCHAR(50) NOT NULL,
  metode_bayar VARCHAR(20) NOT NULL CHECK (metode_bayar IN ('cash', 'qris')),
  total_harga NUMERIC(12, 2) NOT NULL CHECK (total_harga >= 0),
  diskon NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (diskon >= 0),
  total_akhir NUMERIC(12, 2) NOT NULL CHECK (total_akhir >= 0),
  jumlah_bayar NUMERIC(12, 2) NOT NULL CHECK (jumlah_bayar >= 0),
  kembalian NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (kembalian >= 0),
  catatan TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'sukses' CHECK (status IN ('sukses', 'dibatalkan'))
);

-- 3. TABEL TRANSAKSI DETAIL
CREATE TABLE IF NOT EXISTS public.transaksi_detail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaksi_id VARCHAR(50) NOT NULL REFERENCES public.transaksi(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES public.menu(id) ON DELETE SET NULL,
  nama_menu VARCHAR(255) NOT NULL,
  harga_satuan NUMERIC(12, 2) NOT NULL CHECK (harga_satuan >= 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  catatan TEXT
);

-- 4. REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transaksi;
`;

export default function SupabaseSetup() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-extrabold text-slate-800">Status Koneksi Supabase Database</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi database remote Supabase untuk sync data real-time antar perangkat.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              SUPABASE_STATUS.configured
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                SUPABASE_STATUS.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {SUPABASE_STATUS.configured
              ? 'Terhubung ke Supabase'
              : 'Mode Local Storage Fallback Aktif (100% Siap Pakai)'}
          </span>
        </div>
      </div>

      {/* Steps Guide */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span>Panduan Setup Database Supabase</span>
        </h3>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
          <li>
            Buka dashboard{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-bold underline inline-flex items-center gap-1"
            >
              Supabase.com <ExternalLink className="w-3 h-3" />
            </a>{' '}
            dan buat project baru.
          </li>
          <li>
            Pilih menu <strong>SQL Editor</strong> di sidebar dashboard Supabase Anda.
          </li>
          <li>
            Salin script SQL di bawah ini dan jalankan (Run) pada SQL Editor Supabase untuk membuat tabel menu, stok, transaksi, dan transaksi_detail secara instan.
          </li>
          <li>
            Buka menu <strong>Project Settings &gt; API</strong>, lalu dapatkan <code>Project URL</code> dan <code>anon / public key</code>.
          </li>
          <li>
            Masukkan variabel environment <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di file <code>.env.example</code> atau Secrets Panel.
          </li>
        </ol>
      </div>

      {/* Code Block */}
      <div className="bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-800 text-slate-200 font-mono text-xs relative space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-blue-400">supabase_schema.sql</span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Script SQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="overflow-x-auto p-2 text-slate-300 leading-relaxed text-[11px]">
          {SQL_SCHEMA}
        </pre>
      </div>
    </div>
  );
}
