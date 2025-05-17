
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
};

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [showInfo, setShowInfo] = React.useState(false);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };
  
  const toggleInfo = () => {
    setShowInfo(prev => !prev);
  };
  
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setZoomLevel(1); // Reset zoom when closing
      setShowInfo(false); // Reset info panel when closing
      onClose();
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{product.name}</span>
            <Badge variant="outline">{product.category}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <div 
            className="overflow-hidden rounded-md bg-secondary/20 transition-all"
            style={{ maxHeight: '400px' }}
          >
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  maxHeight: '300px'
                }}
              />
            </div>
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleZoomIn} 
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleZoomOut} 
              disabled={zoomLevel <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={toggleInfo}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className={`rounded-md p-3 bg-secondary/10 transition-all ${showInfo ? 'max-h-96' : 'max-h-24 overflow-hidden'}`}>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="font-semibold">Product Details</h3>
            <span className="text-lg font-bold text-borewell-600">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
          
          {showInfo && (
            <div className="border-t pt-3 mt-2">
              <h4 className="text-sm font-medium mb-2">Pricing Logic:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Base price: ₹{(product.price * 0.85).toFixed(2)}</li>
                <li>• Tax (18% GST): ₹{(product.price * 0.15).toFixed(2)}</li>
                <li>• Installation charges may apply for certain services</li>
                <li>• Bundle discounts available for multiple product purchases</li>
              </ul>
            </div>
          )}
        </div>
        
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;
