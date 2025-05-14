
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '../context/CustomerContext';

const Customers: React.FC = () => {
  const { customers, exportToExcel } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">Customers</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-borewell-600 text-borewell-600 hover:bg-borewell-50"
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
            <Link to="/add-customer">
              <Button className="bg-borewell-600 hover:bg-borewell-700">Add Customer</Button>
            </Link>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-gray-600">Name</th>
                  <th className="p-3 text-left text-gray-600">Phone</th>
                  <th className="p-3 text-left text-gray-600">Service</th>
                  <th className="p-3 text-left text-gray-600">Date</th>
                  <th className="p-3 text-left text-gray-600">Amount</th>
                  <th className="p-3 text-left text-gray-600">Status</th>
                  <th className="p-3 text-center text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{customer.name}</td>
                      <td className="p-3">{customer.phone}</td>
                      <td className="p-3">{customer.serviceType}</td>
                      <td className="p-3">{new Date(customer.serviceDate).toLocaleDateString()}</td>
                      <td className="p-3">₹{customer.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          customer.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          customer.paymentStatus === 'Pending' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {customer.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Link to={`/customers/${customer.id}`}>
                            <Button variant="outline" size="sm" className="text-borewell-600 border-borewell-600 hover:bg-borewell-50">
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-gray-500">
                      {searchTerm ? 'No matching customers found' : 'No customers found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
