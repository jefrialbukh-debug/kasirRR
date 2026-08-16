'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MenuGrid from '@/components/kasir/MenuGrid';
import CartSidebar from '@/components/kasir/CartSidebar';
import PaymentModal from '@/components/kasir/PaymentModal';
import DigitalReceiptModal from '@/components/kasir/DigitalReceiptModal';
import TransactionHistory from '@/components/kasir/TransactionHistory';
import AuthModal from '@/components/AuthModal';
import { MenuItem, CartItem, Transaction, UserProfile, PaymentMethod } from '@/types/pos';
import {
  fetchMenuItems,
  processTransaction,
  getStoredTransactions,
  getStoredUsers,
  subscribeToRealtimeChanges,
} from '@/lib/store';
import { ShoppingCart, Receipt, RefreshCw } from 'lucide-react';

export default function KasirPage() {
  const [activeTab, setActiveTab] = useState<'pos' | 'history'>('pos');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState<number>(0);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadAllData = async () => {
    const items = await fetchMenuItems();
    setMenuItems(items);
    setTransactions(getStoredTransactions());
    const userList = getStoredUsers();
    setUsers(userList);
    if (!currentUser) {
      setCurrentUser(userList.find((u) => u.role === 'kasir') || userList[0]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const items = await fetchMenuItems();
      if (!isMounted) return;
      setMenuItems(items);
      setTransactions(getStoredTransactions());
      const userList = getStoredUsers();
      setUsers(userList);
      setCurrentUser((prev) => prev || userList.find((u) => u.role === 'kasir') || userList[0]);
    };

    init();

    const unsubscribe = subscribeToRealtimeChanges(() => {
      init();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        if (existing.jumlah >= item.stok) return prev; // Cannot exceed stock
        return prev.map((c) =>
          c.menuItem.id === item.id
            ? {
                ...c,
                jumlah: c.jumlah + 1,
                subtotal: (c.jumlah + 1) * item.harga,
              }
            : c
        );
      } else {
        return [
          ...prev,
          {
            menuItem: item,
            jumlah: 1,
            subtotal: item.harga,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (menuId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.menuItem.id === menuId) {
            const newQty = c.jumlah + delta;
            if (newQty <= 0) return null;
            return {
              ...c,
              jumlah: newQty,
              subtotal: newQty * c.menuItem.harga,
            };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (menuId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== menuId));
  };

  const handleUpdateNotes = (menuId: string, notes: string) => {
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === menuId ? { ...c, catatan: notes } : c))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenPayment = (discountAmount: number) => {
    setActiveDiscount(discountAmount);
    setIsPaymentModalOpen(true);
  };

  const handleProcessTransaction = async (
    metodeBayar: PaymentMethod,
    jumlahBayar: number,
    catatan?: string
  ) => {
    if (!currentUser) return;

    const res = await processTransaction(
      cart,
      currentUser,
      metodeBayar,
      jumlahBayar,
      activeDiscount,
      catatan
    );

    if (res.success && res.transaction) {
      setIsPaymentModalOpen(false);
      setCart([]);
      setCompletedTransaction(res.transaction);
      loadAllData(); // reload updated stock and transactions
    } else {
      throw new Error(res.message || 'Gagal memproses transaksi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col h-screen overflow-hidden font-sans">
      <Navbar
        currentUser={currentUser}
        onSwitchUser={(u) => setCurrentUser(u)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Mode Sub-Header Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'pos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Sistem Kasir (POS)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Catatan / Riwayat Transaksi ({transactions.length})</span>
          </button>
        </div>

        <button
          onClick={loadAllData}
          className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-1"
          title="Sinkronkan data stok"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      {/* Main Work Area */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {activeTab === 'pos' ? (
          <>
            {/* Left: Menu Catalog Grid */}
            <MenuGrid menuItems={menuItems} onAddToCart={handleAddToCart} />

            {/* Right: Cart & Checkout Sidebar */}
            <CartSidebar
              cartItems={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateNotes={handleUpdateNotes}
              onClearCart={handleClearCart}
              onOpenPaymentModal={handleOpenPayment}
            />
          </>
        ) : (
          /* Transaction History Full View */
          <div className="flex-1 p-4 sm:p-6 overflow-hidden">
            <TransactionHistory
              transactions={transactions}
              onRefresh={loadAllData}
              onViewReceipt={(tx) => setCompletedTransaction(tx)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {isPaymentModalOpen && currentUser && (
        <PaymentModal
          cartItems={cart}
          discount={activeDiscount}
          currentUser={currentUser}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccessTransaction={handleProcessTransaction}
        />
      )}

      {completedTransaction && (
        <DigitalReceiptModal
          transaction={completedTransaction}
          onClose={() => setCompletedTransaction(null)}
          onNewTransaction={() => {
            setCompletedTransaction(null);
            setActiveTab('pos');
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          users={users}
          onSuccessAuth={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
