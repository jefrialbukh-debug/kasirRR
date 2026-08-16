'use client';

import React, { useState } from 'react';
import { UserProfile, UserRole } from '@/types/pos';
import { getStoredUsers, saveUsersToStorage } from '@/lib/store';
import { Users, UserPlus, KeyRound, Shield, CheckCircle, Trash2, X } from 'lucide-react';

interface UserManagementProps {
  onRefresh: () => void;
}

export default function UserManagement({ onRefresh }: UserManagementProps) {
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('kasir');
  const [pin, setPin] = useState('0000');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !username.trim()) return;

    const newUser: UserProfile = {
      id: 'u-' + Date.now(),
      nama,
      username,
      role,
      pin: pin || '0000',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveUsersToStorage(updated);
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (users.length <= 1) {
      alert('Tidak bisa menghapus user terakhir!');
      return;
    }
    if (confirm(`Hapus akun ${name}?`)) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      saveUsersToStorage(updated);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Manajemen Pengguna & Kasir</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tambah akun kasir baru, atur role akses, dan kelola kode PIN login
          </p>
        </div>

        <button
          onClick={() => {
            setNama('');
            setUsername('');
            setRole('kasir');
            setPin('0000');
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-blue-100"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Kasir Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Nama Lengkap</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Role Hak Akses</th>
              <th className="py-3 px-4">Kode PIN Login</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4 font-bold text-slate-800 flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs text-white ${
                      u.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  >
                    {u.nama.charAt(0).toUpperCase()}
                  </div>
                  <span>{u.nama}</span>
                </td>

                <td className="py-3 px-4 font-mono text-slate-600">{u.username}</td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {u.role.toUpperCase()}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-slate-700">{u.pin}</td>

                <td className="py-3 px-4 text-center">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDeleteUser(u.id, u.nama)}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Hapus User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-900 text-white">
              <h3 className="font-extrabold text-sm">Tambah Pengguna / Kasir Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-blue-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Kasir Siti"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username Login</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kasir2"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Akses</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode PIN (4 digit)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="0000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-center font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
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
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
