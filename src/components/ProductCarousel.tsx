import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import floralDressImage from '../assets/prd/floral-dress.jpg';
import linenDressImage from '../assets/prd/linen-dress.jpg';
import linenShirtImage from '../assets/prd/linen-shirt.jpg';
import floralShirtImage from '../assets/prd/floral-shirt.jpg';
import pinkShirtImage from '../assets/prd/pink-shirt.jpg';
import whiteLinenShirtImage from '../assets/prd/white-linen-shirt.jpg';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCarouselProps {
  onAddToCart: (product: Product) => void;
}

export function ProductCarousel({ onAddToCart }: ProductCarouselProps) {
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: "Floral Dress",
      price: 89,
      image: floralDressImage,
    },
    {
      id: 2,
      name: "Linen Dress",
      price: 75,
      image: linenDressImage,
    },
    {
      id: 3,
      name: "Linen Shirt",
      price: 55,
      image: linenShirtImage,
    },
    {
      id: 4,
      name: "Floral Shirt",
      price: 65,
      image: floralShirtImage,
    },
    {
      id: 5,
      name: "Pink Shirt",
      price: 60,
      image: pinkShirtImage,
    },
    {
      id: 6,
      name: "White Linen Shirt",
      price: 70,
      image: whiteLinenShirtImage,
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    // Add the clicked button to the set
    setClickedButtons(prev => new Set(prev).add(product.id));
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      setClickedButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 300); // Match animation duration
    
    // Call the parent's add to cart function
    onAddToCart(product);
  };

  const handleProductTouch = (productId: number) => {
    setActiveProduct(activeProduct === productId ? null : productId);
  };

  const handleProductMouseEnter = (productId: number) => {
    // Only activate on mouse enter for non-touch devices
    if (!('ontouchstart' in window)) {
      setActiveProduct(productId);
    }
  };

  const handleProductMouseLeave = () => {
    // Only deactivate on mouse leave for non-touch devices
    if (!('ontouchstart' in window)) {
      setActiveProduct(null);
    }
  };

  return (
    <section className="py-16 px-4">
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div 
                className="group cursor-pointer"
                onMouseEnter={() => handleProductMouseEnter(product.id)}
                onMouseLeave={handleProductMouseLeave}
                onTouchStart={() => handleProductTouch(product.id)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      activeProduct === product.id ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                  />
                  
                  {/* Add to Cart Button - appears on hover or touch */}
                  <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 flex items-end justify-center p-4 ${
                    activeProduct === product.id 
                      ? 'opacity-100' 
                      : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <Button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full bg-white text-black hover:bg-gray-100 transition-all duration-300 ${
                        activeProduct === product.id 
                          ? 'translate-y-0' 
                          : 'translate-y-4 group-hover:translate-y-0'
                      } ${
                        clickedButtons.has(product.id) 
                          ? 'animate-pulse scale-110 bg-green-100 border-green-300 text-green-800' 
                          : ''
                      }`}
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="mb-2">{product.name}</h3>
                  <p className="text-lg">${product.price}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}