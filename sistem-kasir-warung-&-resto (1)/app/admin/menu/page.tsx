'use client';

import React, { useState, useEffect } from 'react';
import CrudMenu from '@/components/admin/CrudMenu';
import { MenuItem } from '@/types/pos';
import { fetchMenuItems, subscribeToRealtimeChanges } from '@/lib/store';

export default function AdminMenuPage() {
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

  return <CrudMenu menuItems={menuItems} onRefresh={loadMenu} />;
}
