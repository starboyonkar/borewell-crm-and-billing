
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { toast } from 'sonner';
import ProductDetail from './ProductDetail';

type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
};

// Sample products data with our uploaded images
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Submersible Pump Set',
    image: '/lovable-uploads/4f73f356-1821-4792-b5c4-18aa34439ae9.png',
    description: 'High-quality submersible pumps for borewell applications with stainless steel construction. Designed for maximum efficiency and long-term durability in various water depths.',
    price: 15000,
    category: 'Pump'
  },
  {
    id: '2',
    name: 'Submersible Cable',
    image: '/lovable-uploads/cdac79d1-c67d-4c1e-b4ab-990760122bb8.png',
    description: 'Heavy-duty submersible cable for connecting pumps to power source. Water-resistant and built to withstand harsh environmental conditions.',
    price: 2500,
    category: 'Accessory'
  },
  {
    id: '3',
    name: 'PVC Pipes & Fittings',
    image: '/lovable-uploads/af836f0c-6dd6-42d3-ad0b-6f9651b51dae.png',
    description: 'High-quality PVC pipes and fittings for borewell installation. UV-resistant and pressure-tested for reliable water transportation.',
    price: 3200,
    category: 'Accessory'
  },
  {
    id: '4',
    name: 'PVC Casing Pipes',
    image: '/lovable-uploads/f0bc43da-e092-494a-97ad-2a83ad0b3e6d.png',
    description: 'Strong PVC casing pipes for borewell construction. Designed to prevent collapse and contamination of the borewell.',
    price: 4500,
    category: 'Accessory'
  },
  {
    id: '5',
    name: 'Pump Controller',
    image: '/lovable-uploads/eb58718b-cd0c-4b0e-9161-5eb5ab2716fc.png',
    description: 'Automatic water level controller for borewell pumps. Prevents dry running and provides protection against voltage fluctuations.',
    price: 5800,
    category: 'Accessory'
  },
  {
    id: '6',
    name: 'Pipe Clamp',
    image: '/lovable-uploads/d24bdb85-9d4b-4186-8116-fb0998c9a4a3.png',
    description: 'Metal clamps for securing pipes in borewell installations. Rust-resistant and designed for long-term durability.',
    price: 450,
    category: 'Accessory'
  }
];

interface ProductGalleryProps {
  onSelectProduct?: (product: Product) => void;
  selectedProductIds?: Set<string>;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ onSelectProduct, selectedProductIds = new Set() }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (autoplay) {
      interval = setInterval(() => {
        // Auto-scroll functionality (handled by Carousel component)
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay]);
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
    setAutoplay(false); // Pause autoplay when viewing details
  };
  
  const handleDialogClose = () => {
    setIsDetailOpen(false);
    setAutoplay(true); // Resume autoplay
  };
  
  const handleProductSelect = () => {
    if (selectedProduct && onSelectProduct) {
      // Check if product is already selected
      if (!selectedProductIds.has(selectedProduct.id)) {
        onSelectProduct(selectedProduct);
        toast.success(`Added ${selectedProduct.name} to your bill`);
      } else {
        toast.info(`${selectedProduct.name} is already in your bill`);
      }
      setIsDetailOpen(false);
      setAutoplay(true); // Resume autoplay
    }
  };

  const handlePriceClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (onSelectProduct) {
      // Check if product is already selected to prevent duplicates
      if (!selectedProductIds.has(product.id)) {
        onSelectProduct(product);
        
        // Show a brief visual feedback
        const target = e.currentTarget as HTMLElement;
        target.classList.add('animate-pulse');
        setTimeout(() => target.classList.remove('animate-pulse'), 500);
        
        toast.success(`Added ${product.name} to your bill`);
      } else {
        toast.info(`${product.name} is already in your bill`);
      }
    }
  };
  
  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-bold mb-4">Our Products</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {PRODUCTS.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
                      onClick={() => handleProductClick(product)}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span 
                        className={`font-bold cursor-pointer px-2 py-1 rounded transition-colors ${
                          selectedProductIds.has(product.id) 
                            ? "bg-green-100 text-green-700 cursor-not-allowed" 
                            : "text-borewell-600 hover:text-borewell-800 hover:bg-gray-100"
                        }`}
                        onClick={(e) => handlePriceClick(e, product)}
                        title={selectedProductIds.has(product.id) ? "Already added to bill" : "Click to add to bill"}
                      >
                        {selectedProductIds.has(product.id) ? "✓ Added" : `₹${product.price.toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      <ProductDetail 
        product={selectedProduct} 
        isOpen={isDetailOpen} 
        onClose={handleDialogClose} 
        onAddToService={onSelectProduct ? handleProductSelect : undefined}
      />
      
      {isDetailOpen && onSelectProduct && selectedProduct && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleProductSelect}
            className={`text-white ${
              selectedProductIds.has(selectedProduct.id)
                ? "bg-green-600 hover:bg-green-700"
                : "bg-borewell-600 hover:bg-borewell-700"
            }`}
            disabled={selectedProductIds.has(selectedProduct.id)}
          >
            {selectedProductIds.has(selectedProduct.id) ? '✓ Already Added' : 'Add to Bill'}
          </Button>
        </div>
      )}
    </div>
  );
};

export const useProducts = () => {
  return { products: PRODUCTS };
};

export default ProductGallery;
