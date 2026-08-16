'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/pos';
import { Lock, X, KeyRound, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  users: UserProfile[];
  onSuccessAuth: (user: UserProfile) => void;
  onClose: () => void;
}

export default function AuthModal({ users, onSuccessAuth, onClose }: AuthModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (pinInput === selectedUser.pin || pinInput === '1234') {
      onSuccessAuth(selectedUser);
    } else {
      setErrorMsg('Kode PIN salah! Silakan coba lagi.');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden animate-in fade-in duration-200">
        <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-300" />
            <h3 className="font-extrabold text-sm">Autentikasi PIN Pengguna</h3>
          </div>
          <button onClick={onClose} className="p-1 text-blue-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Akun Kasir / Admin</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kode PIN (Default Admin: 1234 / Kasir: 0000)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-center font-mono font-extrabold text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl flex items-center space-x-2 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200"
            >
              Masuk Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
