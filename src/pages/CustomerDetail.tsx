import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '../context/CustomerContext';
import { generatePDF } from '../utils/pdfGenerator';
import DigitalInvoiceSender from "@/components/DigitalInvoiceSender";

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, deleteCustomer } = useCustomers();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  const customer = getCustomerById(id || '');
  
  if (!customer) {
    return <div className="text-center py-10">Customer not found</div>;
  }

  const handleGeneratePDF = () => {
    setIsPdfGenerating(true);
    try {
      const doc = generatePDF(customer);
      doc.save(`Invoice-${customer.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handlePrintPDF = () => {
    setIsPdfGenerating(true);
    try {
      const doc = generatePDF(customer);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      
      printWindow?.addEventListener('load', () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error printing PDF:', error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      deleteCustomer(customer.id);
      navigate('/customers');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">{customer.name}</h1>
          <p className="text-gray-600">{customer.phone}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="border-borewell-600 text-borewell-600 hover:bg-borewell-50"
            onClick={() => navigate('/customers')}
          >
            Back to List
          </Button>
          <Button 
            variant="outline" 
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleGeneratePDF}
            disabled={isPdfGenerating}
          >
            Save as PDF
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={handlePrintPDF}
            disabled={isPdfGenerating}
          >
            Print Bill
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Full Name</p>
                <p>{customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Phone Number</p>
                <p>{customer.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-500">Address</p>
                <p>{customer.address}</p>
              </div>
              {customer.email && (
                <div>
                  <p className="text-sm font-semibold text-gray-500">Email</p>
                  <p>{customer.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Service Type</p>
                <p>{customer.serviceType}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Service Date</p>
                <p>{new Date(customer.serviceDate).toLocaleDateString()}</p>
              </div>
              
              {customer.borewellDepth && (
                <div>
                  <p className="text-sm font-semibold text-gray-500">Borewell Depth</p>
                  <p>{customer.borewellDepth} ft</p>
                </div>
              )}
              
              {customer.pumpType && customer.pumpType !== 'None' && (
                <div>
                  <p className="text-sm font-semibold text-gray-500">Pump Type</p>
                  <p>{customer.pumpType}</p>
                </div>
              )}
              
              {customer.pumpModel && (
                <div>
                  <p className="text-sm font-semibold text-gray-500">Pump Model</p>
                  <p>{customer.pumpModel}</p>
                </div>
              )}
              
              {customer.accessories && customer.accessories.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-gray-500">Accessories</p>
                  <p>{customer.accessories.join(', ')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Service Amount:</span>
                <span>₹{customer.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (18% GST):</span>
                <span>₹{customer.taxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Grand Total:</span>
                <span>₹{customer.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  customer.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  customer.paymentStatus === 'Pending' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {customer.paymentStatus}
                </span>
              </div>
              {customer.paymentMethod && (
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{customer.paymentMethod}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {customer.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{customer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Digital Invoice Sender component */}
      <div className="mt-6">
        <DigitalInvoiceSender customer={customer} />
      </div>
    </div>
  );
};

export default CustomerDetail;
