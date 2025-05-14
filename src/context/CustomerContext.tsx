
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';
import { utils, writeFile } from 'xlsx';

export type CustomerData = {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  serviceDate: string;
  serviceType: string;
  borewellDepth?: number;
  pumpType?: string;
  pumpModel?: string;
  accessories?: string[];
  totalAmount: number;
  taxes: number;
  grandTotal: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
};

type CustomerContextType = {
  customers: CustomerData[];
  addCustomer: (customer: Omit<CustomerData, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updatedData: Partial<CustomerData>) => void;
  getCustomerById: (id: string) => CustomerData | undefined;
  deleteCustomer: (id: string) => void;
  exportToExcel: () => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Mock initial data
const INITIAL_CUSTOMERS: CustomerData[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '9876543210',
    address: '123 Main St, City',
    email: 'john@example.com',
    serviceDate: '2023-05-15',
    serviceType: 'Borewell Installation',
    borewellDepth: 200,
    pumpType: 'Submersible',
    pumpModel: 'HP-2000',
    accessories: ['Pipe', 'Cable', 'Control Panel'],
    totalAmount: 25000,
    taxes: 4500,
    grandTotal: 29500,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    notes: 'Installation completed successfully',
    createdAt: '2023-05-15T10:30:00Z',
  },
];

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<CustomerData[]>(INITIAL_CUSTOMERS);

  const addCustomer = (customerData: Omit<CustomerData, 'id' | 'createdAt'>) => {
    const newCustomer: CustomerData = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    toast.success('Customer added successfully');
  };

  const updateCustomer = (id: string, updatedData: Partial<CustomerData>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...updatedData } : customer
      )
    );
    toast.success('Customer updated successfully');
  };

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    toast.success('Customer deleted successfully');
  };

  const exportToExcel = () => {
    try {
      // Create worksheet with customer data
      const worksheet = utils.json_to_sheet(customers);
      
      // Create workbook with the worksheet
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Customers');
      
      // Generate excel file
      writeFile(workbook, 'Borewell_Customers.xlsx');
      
      toast.success('Data exported to Excel successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        getCustomerById,
        deleteCustomer,
        exportToExcel,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
