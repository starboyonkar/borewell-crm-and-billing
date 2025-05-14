
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomers } from '../context/CustomerContext';
import { useAuth } from '../context/AuthContext';
import StatisticsPanel from '../components/StatisticsPanel';

const Dashboard: React.FC = () => {
  const { customers } = useCustomers();
  const { user } = useAuth();

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.grandTotal, 0);
  const pendingPayments = customers.filter(c => c.paymentStatus === 'Pending').length;
  const completedServices = customers.length;
  
  // Get recent customers (last 3)
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">Dashboard</h1>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/add-customer">
            <Button className="bg-borewell-600 hover:bg-borewell-700">Add New Customer</Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-borewell-600 text-borewell-600 hover:bg-borewell-50"
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-borewell-700">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">{pendingPayments}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Completed Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{completedServices}</p>
          </CardContent>
        </Card>
      </div>

      <StatisticsPanel />

      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>Latest customer service entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-gray-600">Name</th>
                  <th className="p-3 text-left text-gray-600">Service</th>
                  <th className="p-3 text-left text-gray-600">Date</th>
                  <th className="p-3 text-left text-gray-600">Amount</th>
                  <th className="p-3 text-left text-gray-600">Status</th>
                  <th className="p-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{customer.name}</td>
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
                      <Link to={`/customers/${customer.id}`}>
                        <Button variant="outline" size="sm" className="text-borewell-600 border-borewell-600 hover:bg-borewell-50">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Management tools for administrators</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link to="/settings">
              <Button variant="outline" className="border-borewell-600 text-borewell-600 hover:bg-borewell-50">
                Manage Bill Template
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-borewell-600 text-borewell-600 hover:bg-borewell-50"
              onClick={() => window.open('/customers', '_blank')}
            >
              View All Customers
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
