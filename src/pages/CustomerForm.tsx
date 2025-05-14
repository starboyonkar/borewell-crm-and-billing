
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '../context/CustomerContext';
import { Checkbox } from '@/components/ui/checkbox';

type FormData = {
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
};

const ACCESSORIES = ['Pipe', 'Cable', 'Control Panel', 'Starter', 'Filter', 'Motor Guard', 'Clamps'];

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer } = useCustomers();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    email: '',
    serviceDate: new Date().toISOString().split('T')[0],
    serviceType: 'Borewell Installation',
    borewellDepth: 100,
    pumpType: 'Submersible',
    pumpModel: '',
    accessories: [],
    totalAmount: 0,
    taxes: 0,
    grandTotal: 0,
    paymentStatus: 'Pending',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Recalculate totals if amount changes
    if (name === 'totalAmount') {
      const totalAmount = parseFloat(value) || 0;
      const taxes = totalAmount * 0.18; // 18% GST
      const grandTotal = totalAmount + taxes;
      
      setFormData(prev => ({
        ...prev,
        totalAmount,
        taxes,
        grandTotal
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccessoryToggle = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      accessories: checked 
        ? [...(prev.accessories || []), value]
        : (prev.accessories || []).filter(item => item !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(formData);
    navigate(`/customers`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">Add New Customer</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name*</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number" 
                  required 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address*</Label>
                <Textarea 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDate">Service Date*</Label>
                <Input 
                  id="serviceDate" 
                  name="serviceDate"
                  type="date"
                  value={formData.serviceDate}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-borewell-700 mb-4">Service Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type*</Label>
                  <Select 
                    value={formData.serviceType}
                    onValueChange={(value) => handleSelectChange('serviceType', value)}
                  >
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Borewell Installation">Borewell Installation</SelectItem>
                      <SelectItem value="Pump Installation">Pump Installation</SelectItem>
                      <SelectItem value="Borewell Repair">Borewell Repair</SelectItem>
                      <SelectItem value="Pump Repair">Pump Repair</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.serviceType === 'Borewell Installation' && (
                  <div className="space-y-2">
                    <Label htmlFor="borewellDepth">Borewell Depth (ft)</Label>
                    <Input 
                      id="borewellDepth" 
                      name="borewellDepth"
                      type="number"
                      value={formData.borewellDepth || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pumpType">Pump Type</Label>
                  <Select 
                    value={formData.pumpType || ''}
                    onValueChange={(value) => handleSelectChange('pumpType', value)}
                  >
                    <SelectTrigger id="pumpType">
                      <SelectValue placeholder="Select pump type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submersible">Submersible</SelectItem>
                      <SelectItem value="Jet">Jet</SelectItem>
                      <SelectItem value="Centrifugal">Centrifugal</SelectItem>
                      <SelectItem value="Solar">Solar</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.pumpType && formData.pumpType !== 'None' && (
                  <div className="space-y-2">
                    <Label htmlFor="pumpModel">Pump Model</Label>
                    <Input 
                      id="pumpModel" 
                      name="pumpModel"
                      value={formData.pumpModel || ''}
                      onChange={handleInputChange}
                      placeholder="Enter pump model" 
                    />
                  </div>
                )}

                <div className="space-y-3 md:col-span-2">
                  <Label>Accessories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ACCESSORIES.map((accessory) => (
                      <div key={accessory} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`accessory-${accessory}`}
                          checked={(formData.accessories || []).includes(accessory)}
                          onCheckedChange={(checked) => 
                            handleAccessoryToggle(accessory, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`accessory-${accessory}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {accessory}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-borewell-700 mb-4">Billing Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Amount (₹)*</Label>
                  <Input 
                    id="totalAmount" 
                    name="totalAmount"
                    type="number"
                    value={formData.totalAmount || ''}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxes">Taxes (18% GST)</Label>
                  <Input 
                    id="taxes" 
                    name="taxes"
                    type="number"
                    value={formData.taxes || ''}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grandTotal">Grand Total (₹)</Label>
                  <Input 
                    id="grandTotal" 
                    name="grandTotal"
                    type="number"
                    value={formData.grandTotal || ''}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status*</Label>
                  <Select 
                    value={formData.paymentStatus}
                    onValueChange={(value) => handleSelectChange('paymentStatus', value as any)}
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={formData.paymentMethod || ''}
                    onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    placeholder="Enter additional notes" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-borewell-600 hover:bg-borewell-700"
              >
                Save Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
