import { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart, X, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  isCartOpen: boolean;
  onCartToggle: () => void;
  onCartClose: () => void;
  onEmptyCart: () => void;
  cartItemCount: number;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onNavigateHome: () => void;
  currentPage: 'home' | 'signin' | 'signup' | 'about';
}

export function Header({ 
  isMenuOpen, 
  onMenuToggle, 
  onMenuClose, 
  isCartOpen, 
  onCartToggle, 
  onCartClose,
  onEmptyCart,
  cartItemCount,
  onSignInClick,
  onSignUpClick,
  onNavigateHome,
  currentPage
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Only track scroll on home and about pages
    if (currentPage !== 'home' && currentPage !== 'about') {
      setIsScrolled(true); // Always show scrolled state on other pages
      return;
    }

    const handleScroll = () => {
      // Check if we've scrolled past the hero section
      const heroHeight = currentPage === 'about' ? 500 : window.innerHeight - 30; // About page has 500px hero, home has full viewport
      setIsScrolled(window.scrollY > heroHeight * 0.8); // Start transition at 80% of hero height
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleMenuButtonClick = () => {
    if (isMenuOpen) {
      onMenuClose();
    } else {
      onMenuToggle();
    }
  };

  const handleCartButtonClick = () => {
    if (isCartOpen) {
      onCartClose();
    } else {
      onCartToggle();
    }
  };

  const handleEmptyCartClick = () => {
    onEmptyCart();
  };

  const handleBrandClick = () => {
    onNavigateHome();
  };

  // Calculate position and transform for brand name based on state
  const getBrandPositioning = () => {
    if (isCartOpen) {
      return 'left-4'; // Direct positioning 4rem from left
    } else {
      return 'left-1/2 -translate-x-1/2'; // Always centered for menu states
    }
  };

  // Calculate opacity for brand name based on menu state
  const getBrandOpacity = () => {
    if (isMenuOpen) {
      return 'opacity-0'; // Fade out when menu is open
    } else {
      return 'opacity-100'; // Fade in when menu is closed
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ease-in-out ${
        isScrolled || (currentPage !== 'home' && currentPage !== 'about')
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 relative">
        {/* Left - Menu/Close Button */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`p-2 transition-all duration-300 ${
              isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                ? 'text-gray-900 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:text-gray-200 hover:bg-white/10'
            } ${
              isCartOpen ? 'transform -translate-x-16 opacity-0' : 'transform translate-x-0 opacity-100'
            }`}
            onClick={handleMenuButtonClick}
          >
            <div className="relative w-6 h-6">
              <Menu 
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 transform ${
                  isMenuOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                }`} 
              />
              <X 
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 transform ${
                  isMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
                }`} 
              />
            </div>
          </Button>

          {/* Authentication Buttons - emerge from close icon */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-y-1/2 flex items-center transition-all duration-300 ${
            isCartOpen ? 'opacity-0 pointer-events-none' : ''
          }`}>
            {/* Sign In Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSignInClick}
              className={`transition-all duration-300 transform origin-left ${
                isMenuOpen 
                  ? 'translate-x-8 scale-100 opacity-100' 
                  : '-translate-x-3 scale-0 opacity-0'
              } hover:bg-gray-50 hover:border-gray-300 ${
                isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                  ? 'bg-white border-gray-300 text-gray-700' 
                  : 'bg-white/90 border-white/50 text-gray-800'
              }`}
              style={{ 
                transitionDelay: isMenuOpen ? '150ms' : '0ms'
              }}
            >
              Sign In
            </Button>

            {/* Sign Up Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSignUpClick}
              className={`ml-3 transition-all duration-300 transform origin-left ${
                isMenuOpen 
                  ? 'translate-x-8 scale-100 opacity-100' 
                  : '-translate-x-3 scale-0 opacity-0'
              } hover:bg-gray-50 hover:border-gray-300 ${
                isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                  ? 'bg-white border-gray-300 text-gray-700' 
                  : 'bg-white/90 border-white/50 text-gray-800'
              }`}
              style={{ 
                transitionDelay: isMenuOpen ? '200ms' : '0ms'
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Center/Right - Brand Name */}
        <h1 
          className={`text-2xl tracking-wide transition-all duration-1000 ease-out absolute top-1/2 transform -translate-y-1/2 cursor-pointer ${
            isScrolled || (currentPage !== 'home' && currentPage !== 'about') ? 'text-gray-900' : 'text-white'
          } ${getBrandPositioning()} ${getBrandOpacity()} ${
            isMenuOpen ? 'select-none' : ''
          }`}
          onClick={handleBrandClick}
        >
          DevīCo
        </h1>

        {/* Right - Action Icons */}
        <div className="flex items-center space-x-2 relative">
          {/* Cart Action Buttons - appear when cart is open, positioned to the left of close icon */}
          <div className={`absolute top-0 right-12 flex items-center space-x-3 transition-all duration-300 ${
            isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Empty Cart Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={cartItemCount === 0}
              onClick={handleEmptyCartClick}
              className={`transition-all duration-300 transform ${
                isCartOpen 
                  ? 'translate-x-0 scale-100' 
                  : 'translate-x-8 scale-0'
              } ${
                cartItemCount === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-red-50 hover:border-red-200'
              } ${
                isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                  ? 'bg-white border-gray-300 text-gray-700' 
                  : 'bg-white/90 border-white/50 text-gray-800'
              }`}
              style={{ 
                transitionDelay: isCartOpen ? '100ms' : '0ms'
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Empty
            </Button>

            {/* Close Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClose}
              className={`transition-all duration-300 transform ${
                isCartOpen 
                  ? 'translate-x-0 scale-100' 
                  : 'translate-x-4 scale-0'
              } hover:bg-gray-50 hover:border-gray-300 ${
                isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                  ? 'bg-white border-gray-300 text-gray-700' 
                  : 'bg-white/90 border-white/50 text-gray-800'
              }`}
              style={{ 
                transitionDelay: isCartOpen ? '150ms' : '0ms'
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          </div>

          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`relative p-2 transition-all duration-300 ${
              isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                ? 'text-gray-900 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:text-gray-200 hover:bg-white/10'
            } ${
              isMenuOpen 
                ? 'transform translate-x-16 opacity-0'
                : isCartOpen 
                  ? 'transform translate-x-12' 
                  : 'transform translate-x-0 opacity-100'
            }`}
            onClick={handleCartButtonClick}
          >
            <div className="relative w-6 h-6">
              <ShoppingCart 
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 transform ${
                  isCartOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                }`} 
              />
              <X 
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 transform ${
                  isCartOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
                }`} 
              />
            </div>
            {/* Cart item count badge */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Button>
          
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`p-2 transition-all duration-300 ${
              isScrolled || (currentPage !== 'home' && currentPage !== 'about')
                ? 'text-gray-900 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:text-gray-200 hover:bg-white/10'
            } ${
              isMenuOpen 
                ? 'transform translate-x-16 opacity-0'
                : isCartOpen 
                  ? 'transform translate-x-12 opacity-0' 
                  : 'transform translate-x-0 opacity-100'
            }`}
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}