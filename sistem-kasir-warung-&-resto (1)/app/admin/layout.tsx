'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { UserProfile } from '@/types/pos';
import { getStoredUsers } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      const allUsers = getStoredUsers();
      setUsers(allUsers);
      const adminUser = allUsers.find((u) => u.role === 'admin') || allUsers[0];
      setCurrentUser(adminUser);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar
        currentUser={currentUser}
        onSwitchUser={(u) => setCurrentUser(u)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          users={users}
          onSuccessAuth={(u) => {
            setCurrentUser(u);
            setIsAuthModalOpen(false);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
