
import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '../context/CustomerContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsPanel: React.FC = () => {
  const { customers } = useCustomers();

  // Group customers by service type with memoization
  const serviceTypeData = useMemo(() => {
    const serviceTypes: Record<string, number> = {};
    customers.forEach(customer => {
      serviceTypes[customer.serviceType] = (serviceTypes[customer.serviceType] || 0) + 1;
    });

    return Object.entries(serviceTypes).map(([name, value]) => ({
      name,
      value
    }));
  }, [customers]);

  // Group by payment status with memoization
  const paymentStatusData = useMemo(() => {
    const statusCount: Record<string, number> = {};
    customers.forEach(customer => {
      statusCount[customer.paymentStatus] = (statusCount[customer.paymentStatus] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
  }, [customers]);

  // Monthly revenue data for the bar chart with memoization
  const monthlyRevenueData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    customers.forEach(customer => {
      const date = new Date(customer.serviceDate);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + customer.grandTotal;
    });

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));
  }, [customers]);

  // Create custom tooltip formatters to prevent re-renders
  const barTooltipFormatter = (value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue'];
  
  const renderCustomizedLabel = ({ name, percent }: { name: string; percent: number }) => 
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue breakdown by month</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRevenueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={barTooltipFormatter} />
              <Bar dataKey="amount" fill="#0369a1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Service Distribution</CardTitle>
          <CardDescription>Breakdown by service type and payment status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-around h-80">
          <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Paid' ? '#16a34a' : 
                        entry.name === 'Pending' ? '#dc2626' : 
                        '#f59e0b'
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary renders
export default memo(StatisticsPanel);
