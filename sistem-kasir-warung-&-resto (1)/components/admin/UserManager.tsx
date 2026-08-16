'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/pos';
import { getStoredUsers, saveUsersToStorage } from '@/lib/store';
import { Users, Plus, Shield, Key, Trash2, Edit2, Check, UserCheck, Lock } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [role, setRole] = useState<'admin' | 'kasir'>('kasir');
  const [pin, setPin] = useState('0000');

  useEffect(() => {
    Promise.resolve().then(() => {
      setUsers(getStoredUsers());
    });
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      username: nama.toLowerCase().replace(/\s+/g, '_'),
      nama,
      role,
      pin: pin || '0000',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveUsersToStorage(updated);
    setNama('');
    setPin('0000');
    setIsAddOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('Minimal harus ada 1 pengguna tersimpan!');
      return;
    }
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    saveUsersToStorage(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-extrabold text-slate-800">Kelola Pengguna & Hak Akses Kasir</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tambah akun kasir baru, atur PIN keamanan 4 angka, dan kelola peran admin/kasir.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-200 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {isAddOpen && (
        <form onSubmit={handleAddUser} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Form Pengguna Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Ahmad Kasir"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Peran (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'kasir')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 font-medium"
              >
                <option value="kasir">Kasir (Akses POS Only)</option>
                <option value="admin">Admin (Akses Full Backoffice)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode PIN 4 Angka</label>
              <input
                type="text"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="0000"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 font-mono text-center font-bold tracking-widest"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-200"
            >
              Simpan Pengguna
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Nama User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">PIN Keamanan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-blue-700" />
                    <span>{u.nama}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      {u.pin || '1234'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Hapus user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
