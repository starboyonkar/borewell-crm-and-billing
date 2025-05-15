
import React, { useState } from 'react';
import { useInventory, type InventoryItem } from '@/context/InventoryContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

const Inventory: React.FC = () => {
  const { inventory, addItem, updateItem, deleteItem, getLowStockItems } = useInventory();
  const [showLowStock, setShowLowStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: 'Pump',
    quantity: 0,
    price: 0,
    reorderLevel: 0,
    unit: 'piece',
    lastRestockedDate: new Date().toISOString(),
  });

  const lowStockItems = getLowStockItems();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'reorderLevel'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name || newItem.quantity < 0 || newItem.price < 0) {
      toast.error('Please provide valid item details');
      return;
    }
    
    addItem({
      ...newItem,
      lastRestockedDate: new Date().toISOString(),
    });
    
    // Reset form
    setNewItem({
      name: '',
      category: 'Pump',
      quantity: 0,
      price: 0,
      reorderLevel: 0,
      unit: 'piece',
      lastRestockedDate: new Date().toISOString(),
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? item.category === filterCategory : true;
    const matchesLowStock = showLowStock ? item.quantity <= item.reorderLevel : true;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-borewell-800">Inventory Management</h1>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <AlertCircle size={20} />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-3">The following items are running low on stock and need to be reordered:</p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item.id} variant="outline" className="border-amber-500 text-amber-700">
                  {item.name}: {item.quantity} {item.unit}s left
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Inventory List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search items..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filterCategory}
                onValueChange={(value) => setFilterCategory(value || undefined)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Pump">Pumps</SelectItem>
                  <SelectItem value="Motor">Motors</SelectItem>
                  <SelectItem value="Pipe">Pipes</SelectItem>
                  <SelectItem value="Valve">Valves</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Accessory">Accessories</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowLowStock(!showLowStock)}
                className={showLowStock ? "bg-amber-100" : ""}
              >
                {showLowStock ? "Show All" : "Low Stock Only"}
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}{item.quantity !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell>{item.price.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          {item.quantity <= item.reorderLevel ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              updateItem(item.id, {
                                quantity: item.quantity + 1,
                                lastRestockedDate: new Date().toISOString()
                              });
                            }}
                          >
                            + Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-500"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Item Name</label>
                <Input
                  id="name"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => handleSelectChange('category', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pump">Pump</SelectItem>
                    <SelectItem value="Motor">Motor</SelectItem>
                    <SelectItem value="Pipe">Pipe</SelectItem>
                    <SelectItem value="Valve">Valve</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="text-sm font-medium text-gray-700">Unit</label>
                  <Select
                    value={newItem.unit}
                    onValueChange={(value) => handleSelectChange('unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
                      <SelectItem value="kilogram">Kilogram</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="set">Set</SelectItem>
                      <SelectItem value="roll">Roll</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="text-sm font-medium text-gray-700">Price (₹)</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reorderLevel" className="text-sm font-medium text-gray-700">Reorder Level</label>
                  <Input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    min="0"
                    step="1"
                    value={newItem.reorderLevel}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  id="description"
                  name="description"
                  value={newItem.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter item description"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Add Item
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
