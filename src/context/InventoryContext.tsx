
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';

export type InventoryItem = {
  id: string;
  name: string;
  category: 'Pump' | 'Motor' | 'Pipe' | 'Valve' | 'Electrical' | 'Accessory';
  quantity: number;
  price: number;
  reorderLevel: number;
  unit: string;
  description?: string;
  lastRestockedDate: string;
};

type InventoryContextType = {
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItemsByCategory: (category: InventoryItem['category']) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
  decreaseStock: (itemId: string, quantity: number) => boolean;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Initial mock inventory data
const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Submersible Pump HP-2000',
    category: 'Pump',
    quantity: 5,
    price: 15000,
    reorderLevel: 2,
    unit: 'piece',
    description: '2HP submersible pump for deep borewells',
    lastRestockedDate: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Control Panel 3-Phase',
    category: 'Electrical',
    quantity: 8,
    price: 3500,
    reorderLevel: 3,
    unit: 'piece',
    description: 'Control panel for 3-phase borewell motors',
    lastRestockedDate: '2023-03-20T10:30:00Z',
  },
  {
    id: '3',
    name: 'PVC Pipe 2-inch',
    category: 'Pipe',
    quantity: 30,
    price: 350,
    reorderLevel: 10,
    unit: 'meter',
    description: '2-inch diameter PVC pipe for borewell',
    lastRestockedDate: '2023-04-05T10:30:00Z',
  },
  {
    id: '4',
    name: 'Check Valve 2-inch',
    category: 'Valve',
    quantity: 12,
    price: 850,
    reorderLevel: 5,
    unit: 'piece',
    description: '2-inch non-return valve for borewell',
    lastRestockedDate: '2023-02-18T10:30:00Z',
  },
  {
    id: '5',
    name: '3HP Motor',
    category: 'Motor',
    quantity: 4,
    price: 7500,
    reorderLevel: 2,
    unit: 'piece',
    description: '3HP motor for submersible pumps',
    lastRestockedDate: '2023-01-10T10:30:00Z',
  },
  {
    id: '6',
    name: 'Electrical Cable 2.5mm',
    category: 'Electrical',
    quantity: 200,
    price: 45,
    reorderLevel: 50,
    unit: 'meter',
    description: '2.5mm electrical cable for borewell connections',
    lastRestockedDate: '2023-03-25T10:30:00Z',
  },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  const addItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(),
    };
    setInventory((prev) => [...prev, newItem]);
    toast.success('Inventory item added successfully');
  };

  const updateItem = (id: string, itemData: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...itemData } : item
      )
    );
    toast.success('Inventory item updated successfully');
  };

  const deleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    toast.success('Inventory item deleted successfully');
  };

  const getItemsByCategory = (category: InventoryItem['category']) => {
    return inventory.filter((item) => item.category === category);
  };

  const getLowStockItems = () => {
    return inventory.filter((item) => item.quantity <= item.reorderLevel);
  };

  const decreaseStock = (itemId: string, quantity: number) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item || item.quantity < quantity) {
      toast.error('Insufficient stock for this item');
      return false;
    }

    updateItem(itemId, { quantity: item.quantity - quantity });
    
    // Check if item is now at or below reorder level
    if (item.quantity - quantity <= item.reorderLevel) {
      toast.warning(`Low stock alert: ${item.name} is below reorder level`);
    }
    return true;
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addItem,
        updateItem,
        deleteItem,
        getItemsByCategory,
        getLowStockItems,
        decreaseStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
