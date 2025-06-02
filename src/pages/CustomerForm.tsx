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
import ProductGallery, { useProducts } from '@/components/ProductGallery';
import { convertToWords } from '@/utils/numberToWords';
import { generateQRCodeURL, generateBillId } from '@/utils/qrCodeGenerator';
import SelectedProductsTable, { SelectedProduct } from '@/components/SelectedProductsTable';
import { ShoppingCart, Save, ShoppingBag } from 'lucide-react';

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
};

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer } = useCustomers();
  const { inventory, getItemsByCategory } = useInventory();
  const { user } = useAuth();
  const { products } = useProducts();

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [formIsValid, setFormIsValid] = useState(false);
  
  // Create a Set of selected product IDs for easy lookup
  const selectedProductIds = new Set(selectedProducts.map(p => p.id));
  
  // Fix the issue with generateQRCodeURL by using string values for both parameters
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
  });

  // Stock information state
  const [availablePumps, setAvailablePumps] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);
  const [availablePumpModels, setAvailablePumpModels] = useState<string[]>([]);
  const [accessoriesStock, setAccessoriesStock] = useState<Record<string, {quantity: number, price: number}>>({});
  const [selectedAccessories, setSelectedAccessories] = useState<Record<string, boolean>>({});
  
  // Check form validity
  useEffect(() => {
    const requiredFields = ['name', 'phone', 'address'];
    const isValid = requiredFields.every(field => 
      formData[field as keyof FormData] && 
      formData[field as keyof FormData].toString().trim() !== ''
    );
    setFormIsValid(isValid && selectedProducts.length > 0);
  }, [formData, selectedProducts]);

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

  // Recalculate totals whenever products change
  useEffect(() => {
    calculateTotals();
  }, [selectedProducts, formData.borewellDepth]);

  const calculateTotals = () => {
    // Calculate base amount from selected products
    const productTotal = selectedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0);
    
    // Add borewell depth cost if applicable
    let baseAmount = productTotal;
    if (formData.serviceType === 'Borewell Installation' && formData.borewellDepth) {
      baseAmount += formData.borewellDepth * 500; // ₹500 per foot
    }
    
    // Calculate taxes and grand total
    const taxes = baseAmount * 0.18; // 18% GST
    const grandTotal = baseAmount + taxes;
    
    // Generate amount in words
    const amountInWords = convertToWords(grandTotal);
    
    setFormData(prev => ({
      ...prev,
      totalAmount: baseAmount,
      taxes,
      grandTotal,
      amountInWords
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Update selected products for the table
    if (checked) {
      // Find matching product in product gallery
      const product = products.find(p => p.name.includes(value));
      if (product) {
        addProductToSelection(product);
        toast.success(`Added ${value} to your bill`);
      }
    } else {
      // Find and remove the accessory product
      const accessoryProduct = selectedProducts.find(p => p.name.includes(value));
      if (accessoryProduct) {
        removeProductFromSelection(accessoryProduct.id);
        toast.info(`Removed ${value} from your bill`);
      }
    }
  };

  const addProductToSelection = (product: any) => {
    // Check if product is already in the selected list
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    
    if (existingProduct) {
      // Product already exists, don't add duplicate
      toast.info(`${product.name} is already in your bill`);
      return;
    }
    
    // Add new product with quantity 1
    setSelectedProducts(prev => [
      ...prev, 
      { ...product, quantity: 1 }
    ]);
    
    // Handle pump selection
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
          // Update form data accessories without triggering handleAccessoryToggle
          setFormData(prev => ({
            ...prev,
            accessories: [...(prev.accessories || []), acc]
          }));
          setSelectedAccessories(prev => ({
            ...prev,
            [acc]: true
          }));
          break;
        }
      }
    }
  };
  
  const removeProductFromSelection = (productId: string) => {
    // Find the product
    const product = selectedProducts.find(p => p.id === productId);
    
    // Remove from selected products
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    
    // If it's a pump, clear pump selection
    if (product?.category === 'Pump') {
      setFormData(prev => ({
        ...prev,
        pumpType: '',
        pumpModel: ''
      }));
    }
    
    // If it's an accessory, update accessories list
    if (product?.category === 'Accessory') {
      for (const acc of ACCESSORIES) {
        if (product.name.includes(acc)) {
          handleAccessoryToggle(acc, false);
          break;
        }
      }
    }
    
    toast.info(`Removed ${product?.name || 'product'} from your bill`);
  };

  const handleProductSelect = (product: any) => {
    addProductToSelection(product);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formIsValid) {
      toast.error("Please fill all required fields and select at least one product/service");
      return;
    }
    
    // Check if required products are in stock
    for (const product of selectedProducts) {
      if (product.category === 'Pump') {
        const pump = availablePumps.find(p => p.name === product.name);
        
        if (!pump || pump.quantity === 0) {
          toast.error(`${product.name} is out of stock!`);
          return;
        }
      } else if (product.category === 'Accessory') {
        for (const accessory of ACCESSORIES) {
          if (product.name.includes(accessory) && accessoriesStock[accessory].quantity === 0) {
            toast.error(`${accessory} is out of stock!`);
            return;
          }
        }
      }
    }
    
    // Prepare to save customer data with product details
    const customerData = {
      ...formData,
      products: selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        category: p.category
      }))
    };
    
    addCustomer(customerData);
    toast.success("Order placed successfully! Your bill has been generated.");
    navigate(`/customers`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">
          <ShoppingBag className="inline-block mr-2 h-8 w-8" />
          Buy/Shop
        </h1>
      </div>

      {/* Product Gallery - Displayed at the top for prominence */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-borewell-50 to-gray-50">
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Available Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          <ProductGallery 
            onSelectProduct={handleProductSelect} 
            selectedProductIds={selectedProductIds}
          />
        </CardContent>
      </Card>

      {/* Selected Products Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Selected Products
        </h2>
        <SelectedProductsTable 
          products={selectedProducts} 
          onRemoveProduct={removeProductFromSelection}
          className="animate-fade-in"
        />
      </div>

      {/* Customer Information Form */}
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

                <div className="space-y-3 md:col-span-2">
                  <Label>Accessories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ACCESSORIES.map((accessory) => (
                      <div key={accessory} className="flex items-center space-x-2 bg-white p-2 rounded-md border hover:bg-gray-50 transition-colors">
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
                          {accessory}
                          <span className="text-borewell-600 font-medium block">
                            ₹{accessoriesStock[accessory]?.price.toLocaleString('en-IN')}
                          </span>
                          <Badge 
                            variant={accessoriesStock[accessory]?.quantity > 0 ? "outline" : "destructive"} 
                            className="text-xs ml-auto"
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
                    className="bg-gray-100 font-medium"
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
                    className="bg-gray-100 text-borewell-800 font-bold"
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
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
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
                disabled={!formIsValid}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Place Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
