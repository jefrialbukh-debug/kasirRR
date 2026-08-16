'use client';

import React, { useState, useEffect } from 'react';
import StockManagement from '@/components/admin/StockManagement';
import { MenuItem } from '@/types/pos';
import { fetchMenuItems, subscribeToRealtimeChanges } from '@/lib/store';

export default function AdminStockPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const loadMenu = async () => {
    const items = await fetchMenuItems();
    setMenuItems(items);
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const items = await fetchMenuItems();
      if (isMounted) setMenuItems(items);
    };
    load();
    const unsubscribe = subscribeToRealtimeChanges(() => {
      load();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return <StockManagement menuItems={menuItems} onRefresh={loadMenu} />;
}
