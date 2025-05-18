
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter,
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type SelectedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
};

interface SelectedProductsTableProps {
  products: SelectedProduct[];
  onRemoveProduct: (productId: string) => void;
  className?: string;
}

const SelectedProductsTable: React.FC<SelectedProductsTableProps> = ({ 
  products, 
  onRemoveProduct,
  className = ""
}) => {
  if (products.length === 0) {
    return (
      <div className={`text-center p-6 bg-gray-50 border rounded-md ${className}`}>
        <p className="text-gray-500">No products selected yet.</p>
        <p className="text-sm text-gray-400">Browse the product gallery above and click on items to add them to your bill.</p>
      </div>
    );
  }

  // Calculate total
  const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <div className={`border rounded-md overflow-hidden shadow-sm ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div>
                  {product.name}
                  <Badge className="ml-2" variant="outline">{product.category}</Badge>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
              </TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
              <TableCell className="font-medium">
                ₹{(product.price * product.quantity).toLocaleString('en-IN')}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
            <TableCell className="font-bold text-borewell-700">₹{total.toLocaleString('en-IN')}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default SelectedProductsTable;
