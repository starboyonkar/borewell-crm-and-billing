
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '../context/CustomerContext';
import { useInventory } from '../context/InventoryContext';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductGallery, { useProducts } from '@/components/ProductGallery';
import { convertToWords } from '@/utils/numberToWords';
import { generateQRCodeURL, generateBillId } from '@/utils/qrCodeGenerator';

const ACCESSORIES = ['Pipe', 'Cable', 'Control Panel', 'Starter', 'Filter', 'Motor Guard', 'Clamps'];

type FormData = {
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
  billId: string;
  amountInWords: string;
  qrCodeUrl: string;
};

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer } = useCustomers();
  const { inventory, getItemsByCategory } = useInventory();
  const { user } = useAuth();
  const { products } = useProducts();

  const [showProductGallery, setShowProductGallery] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const billId = generateBillId();
  
  const [formData, setFormData] = useState<FormData>({
    id: Date.now().toString(),
    name: user?.role === 'customer' ? (user?.fullName || '') : '',
    phone: '',
    address: '',
    email: user?.role === 'customer' ? (user?.email || '') : '',
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
    billId,
    amountInWords: 'Zero Rupees Only',
    qrCodeUrl: generateQRCodeURL(billId, Date.now().toString(), 0),
  });

  // Stock information state
  const [availablePumps, setAvailablePumps] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);
  const [availablePumpModels, setAvailablePumpModels] = useState<string[]>([]);
  const [accessoriesStock, setAccessoriesStock] = useState<Record<string, {quantity: number, price: number}>>({});
  const [selectedAccessories, setSelectedAccessories] = useState<Record<string, boolean>>({});

  // Load inventory data when form loads or serviceType/pumpType changes
  useEffect(() => {
    // Get pumps from inventory and add pricing
    const pumps = getItemsByCategory('Pump')
      .map(p => ({
        id: p.id, 
        name: p.name, 
        quantity: p.quantity,
        price: products.find(prod => prod.name.includes(p.name.split(' ')[0]))?.price || 15000
      }));

    setAvailablePumps(pumps);
    
    // Get available accessories
    const accessories = getItemsByCategory('Accessory');
    const accessoryStock: Record<string, {quantity: number, price: number}> = {};
    
    ACCESSORIES.forEach(acc => {
      const item = accessories.find(a => a.name.includes(acc));
      const product = products.find(p => p.name.includes(acc));
      accessoryStock[acc] = { 
        quantity: item?.quantity || 0,
        price: product?.price || 1000
      };
    });
    
    setAccessoriesStock(accessoryStock);
  }, [getItemsByCategory, formData.serviceType, products]);

  // Recalculate totals whenever relevant fields change
  useEffect(() => {
    calculateTotals();
  }, [formData.pumpType, formData.pumpModel, formData.accessories]);

  const calculateTotals = () => {
    let baseAmount = 0;
    
    // Add pump cost if selected
    if (formData.pumpType && formData.pumpModel && formData.pumpType !== 'None') {
      const pumpName = `${formData.pumpType} ${formData.pumpModel}`.trim();
      const pump = availablePumps.find(p => p.name === pumpName);
      if (pump) {
        baseAmount += pump.price;
      }
    }
    
    // Add accessories cost
    if (formData.accessories && formData.accessories.length > 0) {
      for (const accessory of formData.accessories) {
        baseAmount += accessoriesStock[accessory]?.price || 0;
      }
    }
    
    // Add borewell depth cost if applicable
    if (formData.serviceType === 'Borewell Installation' && formData.borewellDepth) {
      baseAmount += formData.borewellDepth * 500; // ₹500 per foot
    }
    
    // Calculate taxes and grand total
    const taxes = baseAmount * 0.18; // 18% GST
    const grandTotal = baseAmount + taxes;
    
    // Generate amount in words
    const amountInWords = convertToWords(grandTotal);
    
    // Generate QR code URL
    const qrCodeUrl = generateQRCodeURL(formData.billId, formData.id, grandTotal);
    
    setFormData(prev => ({
      ...prev,
      totalAmount: baseAmount,
      taxes,
      grandTotal,
      amountInWords,
      qrCodeUrl
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Special case for borewell depth - recalculate totals
    if (name === 'borewellDepth') {
      setTimeout(calculateTotals, 0);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If pump type changes, update available models
    if (name === 'pumpType') {
      const pumps = getItemsByCategory('Pump')
        .filter(p => p.name.includes(value))
        .map(p => p.name.replace(value, '').trim());
      
      setAvailablePumpModels(pumps);
    }
  };

  const handleAccessoryToggle = (value: string, checked: boolean) => {
    const updatedAccessories = checked 
      ? [...(formData.accessories || []), value]
      : (formData.accessories || []).filter(item => item !== value);
    
    setFormData(prev => ({
      ...prev,
      accessories: updatedAccessories
    }));
    
    setSelectedAccessories(prev => ({
      ...prev,
      [value]: checked
    }));
  };

  const handleProductSelect = (product: any) => {
    // Handle selection based on product category
    if (product.category === 'Pump') {
      const pumpType = product.name.split(' ')[0]; // e.g. "Submersible"
      handleSelectChange('pumpType', pumpType);
      
      // Find a matching pump model if available
      const models = getItemsByCategory('Pump')
        .filter(p => p.name.includes(pumpType))
        .map(p => p.name.replace(pumpType, '').trim());
      
      if (models.length > 0) {
        handleSelectChange('pumpModel', models[0]);
      }
    } else if (product.category === 'Accessory') {
      // Find matching accessory
      for (const acc of ACCESSORIES) {
        if (product.name.includes(acc)) {
          handleAccessoryToggle(acc, true);
          break;
        }
      }
    }
    
    setShowProductGallery(false);
    calculateTotals();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if required pump is in stock
    if (formData.pumpType && formData.pumpModel) {
      const pumpName = `${formData.pumpType} ${formData.pumpModel}`.trim();
      const pump = availablePumps.find(p => p.name === pumpName);
      
      if (!pump || pump.quantity === 0) {
        toast.error(`${pumpName} is out of stock!`);
        return;
      }
    }
    
    // Check if selected accessories are in stock
    if (formData.accessories && formData.accessories.length > 0) {
      for (const accessory of formData.accessories) {
        if (accessoriesStock[accessory].quantity === 0) {
          toast.error(`${accessory} is out of stock!`);
          return;
        }
      }
    }
    
    addCustomer(formData);
    navigate(`/customers`);
  };

  const isFieldDisabled = user?.role === 'customer' && ['name', 'email'].includes(name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">Add New Customer</h1>
        
        <Button 
          type="button"
          onClick={() => setShowProductGallery(true)}
        >
          Browse Products
        </Button>
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
                  readOnly={user?.role === 'customer'}
                  className={user?.role === 'customer' ? "bg-gray-100" : ""}
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
                  readOnly={user?.role === 'customer'}
                  className={user?.role === 'customer' ? "bg-gray-100" : ""}
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

              <div className="space-y-2">
                <Label>Bill ID</Label>
                <Input 
                  value={formData.billId} 
                  readOnly 
                  className="bg-gray-100" 
                />
                <p className="text-xs text-gray-500">Automatically generated for this service request</p>
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
                    <div className="flex items-center">
                      <Input 
                        id="borewellDepth" 
                        name="borewellDepth"
                        type="number"
                        value={formData.borewellDepth || ''}
                        onChange={handleInputChange}
                      />
                      <Badge className="ml-2" variant="outline">
                        ₹500/ft
                      </Badge>
                    </div>
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
                      <SelectItem value="Submersible">
                        Submersible
                        <Badge className="ml-2" variant="outline">
                          {getItemsByCategory('Pump').filter(p => p.name.includes('Submersible')).length} models
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Jet">
                        Jet
                        <Badge className="ml-2" variant="outline">
                          {getItemsByCategory('Pump').filter(p => p.name.includes('Jet')).length} models
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Centrifugal">
                        Centrifugal
                        <Badge className="ml-2" variant="outline">
                          {getItemsByCategory('Pump').filter(p => p.name.includes('Centrifugal')).length} models
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Solar">
                        Solar
                        <Badge className="ml-2" variant="outline">
                          {getItemsByCategory('Pump').filter(p => p.name.includes('Solar')).length} models
                        </Badge>
                      </SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.pumpType && formData.pumpType !== 'None' && (
                  <div className="space-y-2">
                    <Label htmlFor="pumpModel">Pump Model</Label>
                    <Select
                      value={formData.pumpModel || ''}
                      onValueChange={(value) => handleSelectChange('pumpModel', value)}
                    >
                      <SelectTrigger id="pumpModel">
                        <SelectValue placeholder="Select pump model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePumps
                          .filter(pump => pump.name.includes(formData.pumpType || ''))
                          .map(pump => (
                            <SelectItem key={pump.id} value={pump.name.replace(formData.pumpType || '', '').trim()}>
                              {pump.name.replace(formData.pumpType || '', '').trim()} - ₹{pump.price.toLocaleString('en-IN')}
                              <Badge 
                                className="ml-2" 
                                variant={pump.quantity > 0 ? "outline" : "destructive"}
                              >
                                {pump.quantity > 0 ? `${pump.quantity} in stock` : 'Out of stock'}
                              </Badge>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                          disabled={accessoriesStock[accessory]?.quantity === 0}
                        />
                        <label
                          htmlFor={`accessory-${accessory}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 ${
                            accessoriesStock[accessory]?.quantity === 0 ? 'text-gray-400' : ''
                          }`}
                        >
                          {accessory} - ₹{accessoriesStock[accessory]?.price.toLocaleString('en-IN')}
                          <Badge 
                            variant={accessoriesStock[accessory]?.quantity > 0 ? "outline" : "destructive"} 
                            className="text-xs"
                          >
                            {accessoriesStock[accessory]?.quantity > 0 
                              ? `${accessoriesStock[accessory]?.quantity} in stock` 
                              : 'Out of stock'}
                          </Badge>
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
                  <Label htmlFor="totalAmount">Amount (₹)</Label>
                  <Input 
                    id="totalAmount" 
                    name="totalAmount"
                    type="number"
                    value={formData.totalAmount || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Calculated based on selected items</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxes">Taxes (18% GST)</Label>
                  <Input 
                    id="taxes" 
                    name="taxes"
                    type="number"
                    value={formData.taxes || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grandTotal">Grand Total (₹)</Label>
                  <Input 
                    id="grandTotal" 
                    name="grandTotal"
                    type="number"
                    value={formData.grandTotal || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label>Amount In Words</Label>
                  <Input value={formData.amountInWords} readOnly className="bg-gray-100" />
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

                {formData.grandTotal > 0 && (
                  <div className="md:col-span-3 flex justify-center">
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Bill Verification QR Code</p>
                      <img src={formData.qrCodeUrl} alt="Bill QR Code" className="mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">Scan to verify bill details</p>
                    </div>
                  </div>
                )}
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
      
      <Dialog open={showProductGallery} onOpenChange={setShowProductGallery}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Product Gallery</DialogTitle>
          </DialogHeader>
          <ProductGallery onSelectProduct={handleProductSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerForm;
