import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Cart, CartItem } from "./components/Cart";
import { HeroBanner } from "./components/HeroBanner";
import { PhotoCarousel } from "./components/PhotoCarousel";
import { ProductCarousel } from "./components/ProductCarousel";
import { CustomerReviews } from "./components/CustomerReviews";
import { Footer } from "./components/Footer";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Checkout } from "./components/Checkout";
import { About } from "./components/About";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const CART_STORAGE_KEY = "devico-cart-items";

type Page = "home" | "signin" | "signup" | "checkout" | "about";

// Custom hook for URL-based routing
function useURLRouting() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // Get page from URL
  const getPageFromURL = (): Page => {
    const path = window.location.pathname;
    switch (path) {
      case '/signin':
        return 'signin';
      case '/signup':
        return 'signup';
      case '/checkout':
        return 'checkout';
      case '/about':
        return 'about';
      case '/':
      default:
        return 'home';
    }
  };

  // Update URL without page reload
  const navigateToPage = (page: Page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', path);
    setCurrentPage(page);
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromURL());
    };

    // Set initial page from URL
    setCurrentPage(getPageFromURL());

    // Listen for back/forward navigation
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return { currentPage, navigateToPage };
}

export default function App() {
  const { currentPage, navigateToPage } = useURLRouting();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showEmptyCartDialog, setShowEmptyCartDialog] =
    useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLElement>(null);
  const craftedRef = useRef<HTMLElement>(null);
  const productCarouselRef = useRef<HTMLElement>(null);
  const customerReviewsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);
  const isWheelScrolling = useRef(false);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  // Enhanced touch tracking refs for iOS
  const isTouchScrolling = useRef(false);
  const touchTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const lastTouchY = useRef(0);
  const touchScrollDirection = useRef<"up" | "down" | null>(
    null,
  );
  const touchVelocity = useRef(0);
  const isIOSDevice = useRef(false);

  // Detect iOS devices
  useEffect(() => {
    isIOSDevice.current =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1);
  }, []);

  // Disable/enable scrolling when menu is opened/closed
  useEffect(() => {
    if (isMenuOpen) {
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "";
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    try {
      const savedCartItems =
        localStorage.getItem(CART_STORAGE_KEY);
      if (savedCartItems) {
        const parsedItems: CartItem[] =
          JSON.parse(savedCartItems);
        // Validate that the parsed items have the correct structure
        if (
          Array.isArray(parsedItems) &&
          parsedItems.every(
            (item) =>
              typeof item.id === "number" &&
              typeof item.name === "string" &&
              typeof item.price === "number" &&
              typeof item.image === "string" &&
              typeof item.quantity === "number",
          )
        ) {
          setCartItems(parsedItems);
        }
      }
    } catch (error) {
      console.error(
        "Error loading cart items from localStorage:",
        error,
      );
      // If there's an error, clear the invalid data
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems),
      );
    } catch (error) {
      console.error(
        "Error saving cart items to localStorage:",
        error,
      );
    }
  }, [cartItems]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close cart if opening menu
    if (!isMenuOpen && isCartOpen) {
      setIsCartOpen(false);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
    // Close menu if opening cart
    if (!isCartOpen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleEmptyCartRequest = () => {
    // Show confirmation dialog instead of directly emptying cart
    setShowEmptyCartDialog(true);
  };

  const handleEmptyCartConfirm = () => {
    // Actually empty the cart
    setCartItems([]);
    setShowEmptyCartDialog(false);
  };

  const handleEmptyCartCancel = () => {
    // Close dialog without emptying cart
    setShowEmptyCartDialog(false);
  };

  const handleSignInClick = () => {
    navigateToPage("signin");
    setIsMenuOpen(false);
  };

  const handleSignUpClick = () => {
    navigateToPage("signup");
    setIsMenuOpen(false);
  };

  const handleNavigateHome = () => {
    navigateToPage("home");
  };

  const handleNavigateAbout = () => {
    navigateToPage("about");
    setIsMenuOpen(false);
  };

  const handleNavigateCheckout = () => {
    navigateToPage("checkout");
    setIsCartOpen(false);
  };

  const handleNavigateCart = () => {
    navigateToPage("home");
    setIsCartOpen(true);
  };

  const handleOrderComplete = () => {
    // Clear cart and return to home
    setCartItems([]);
    navigateToPage("home");
    // Show success message (you could add a toast notification here)
    alert("Order placed successfully! You will receive a confirmation email shortly.");
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (
    id: number,
    newQuantity: number,
  ) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id),
    );
  };

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  useEffect(() => {
    // Only setup scroll behavior on home page
    if (currentPage !== "home") return;

    // Track wheel events to detect mouse wheel/touchpad scrolling
    const handleWheel = () => {
      isWheelScrolling.current = true;

      // Clear existing timeout
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }

      // Reset wheel scrolling flag after a short delay
      wheelTimeout.current = setTimeout(() => {
        isWheelScrolling.current = false;
      }, 150);
    };

    // Enhanced touch event handlers for iOS devices
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      lastTouchY.current = e.touches[0].clientY;
      isTouchScrolling.current = true;
      touchScrollDirection.current = null;
      touchVelocity.current = 0;

      // Clear existing timeout
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchScrolling.current) return;

      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaY = lastTouchY.current - currentY;
      const deltaTime = currentTime - touchStartTime.current;

      // Calculate velocity for iOS momentum detection
      if (deltaTime > 0) {
        touchVelocity.current = Math.abs(deltaY) / deltaTime;
      }

      // Determine scroll direction based on touch movement with higher threshold for iOS
      if (Math.abs(deltaY) > 10) {
        // Increased threshold for iOS
        touchScrollDirection.current =
          deltaY > 0 ? "down" : "up";
      }

      lastTouchY.current = currentY;
    };

    const handleTouchEnd = () => {
      // For iOS, we need to wait longer to catch momentum scrolling
      const timeoutDelay = isIOSDevice.current ? 500 : 300;

      touchTimeout.current = setTimeout(() => {
        isTouchScrolling.current = false;
        touchScrollDirection.current = null;
        touchVelocity.current = 0;
      }, timeoutDelay);
    };

    const handleScroll = () => {
      if (isScrolling.current) return;

      const currentScrollY = window.scrollY;
      const scrollDirection =
        currentScrollY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = currentScrollY;

      // Enhanced conditions for iOS touch scrolling
      const shouldSnapWheel =
        isWheelScrolling.current && scrollDirection === "down";
      const shouldSnapTouch =
        isTouchScrolling.current &&
        touchScrollDirection.current === "down" &&
        (isIOSDevice.current
          ? touchVelocity.current > 0.1
          : true);

      if (shouldSnapWheel || shouldSnapTouch) {
        const windowHeight = window.innerHeight;

        // Check for Customer Reviews section scroll snap
        if (customerReviewsRef.current) {
          const reviewsRect =
            customerReviewsRef.current.getBoundingClientRect();
          const reviewsTop = reviewsRect.top;
          const thresholdPosition35 = windowHeight * 0.35; // 35% from top
          const thresholdPosition25 = windowHeight * 0.25; // 25% from top

          // If the Customer Reviews section is visible and above the top 25% of the screen - snap to bottom
          if (
            reviewsTop > 0 &&
            reviewsTop < windowHeight &&
            reviewsTop < thresholdPosition25
          ) {
            isScrolling.current = true;

            // Clear touch scrolling state for iOS
            if (isIOSDevice.current) {
              isTouchScrolling.current = false;
              if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
              }
            }

            // Scroll to bottom of the page
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });

            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 800); // Longer timeout for iOS

            return; // Exit early to prevent other snaps from triggering
          }

          // If the Customer Reviews section is visible and below the top 35% of the screen - snap to reviews section
          if (
            reviewsTop > 0 &&
            reviewsTop < windowHeight &&
            reviewsTop > thresholdPosition35
          ) {
            isScrolling.current = true;

            // Clear touch scrolling state for iOS
            if (isIOSDevice.current) {
              isTouchScrolling.current = false;
              if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
              }
            }

            // Calculate the position to scroll to (reviews section top - header height)
            const reviewsScrollTop =
              customerReviewsRef.current.offsetTop - 56; // 56px header height

            window.scrollTo({
              top: reviewsScrollTop,
              behavior: "smooth",
            });

            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 800); // Longer timeout for iOS

            return; // Exit early to prevent other snaps from triggering
          }
        }

        // Check for "Crafted for you" section scroll snap
        if (craftedRef.current) {
          const craftedRect =
            craftedRef.current.getBoundingClientRect();
          const craftedTop = craftedRect.top;
          const thresholdPosition35 = windowHeight * 0.35; // 35% from top
          const thresholdPosition25 = windowHeight * 0.25; // 25% from top

          // If the "Crafted for you" h2 is visible and above the top 25% of the screen - snap to customer reviews
          if (
            craftedTop > 0 &&
            craftedTop < windowHeight &&
            craftedTop < thresholdPosition25 &&
            customerReviewsRef.current
          ) {
            isScrolling.current = true;

            // Clear touch scrolling state for iOS
            if (isIOSDevice.current) {
              isTouchScrolling.current = false;
              if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
              }
            }

            // Calculate the position to scroll to (reviews section top - header height)
            const reviewsScrollTop =
              customerReviewsRef.current.offsetTop - 56; // 56px header height

            window.scrollTo({
              top: reviewsScrollTop,
              behavior: "smooth",
            });

            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 800); // Longer timeout for iOS

            return; // Exit early to prevent other snaps from triggering
          }

          // If the "Crafted for you" h2 is visible and below the top 35% of the screen - snap to crafted section
          if (
            craftedTop > 0 &&
            craftedTop < windowHeight &&
            craftedTop > thresholdPosition35
          ) {
            isScrolling.current = true;

            // Clear touch scrolling state for iOS
            if (isIOSDevice.current) {
              isTouchScrolling.current = false;
              if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
              }
            }

            // Calculate the position to scroll to (crafted section top - header height)
            const craftedScrollTop =
              craftedRef.current.offsetTop - 56; // 56px header height

            window.scrollTo({
              top: craftedScrollTop,
              behavior: "smooth",
            });

            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 800); // Longer timeout for iOS

            return; // Exit early to prevent hero snap from also triggering
          }
        }

        // Hero section scroll snap (existing logic with iOS improvements)
        if (heroRef.current && taglineRef.current) {
          const heroRect =
            heroRef.current.getBoundingClientRect();

          // Calculate how much of the hero is visible
          const heroTop = heroRect.top;
          const heroBottom = heroRect.bottom;
          const heroHeight = heroRect.height;

          // Calculate visible portion of hero
          let visibleHeight = 0;
          if (heroTop >= 0 && heroBottom <= windowHeight) {
            // Hero is fully visible
            visibleHeight = heroHeight;
          } else if (heroTop < 0 && heroBottom > 0) {
            // Hero is partially visible (scrolled past top)
            visibleHeight = heroBottom;
          } else if (
            heroTop < windowHeight &&
            heroBottom > windowHeight
          ) {
            // Hero is partially visible (extending below viewport)
            visibleHeight = windowHeight - heroTop;
          }

          const visibilityPercentage =
            (visibleHeight / heroHeight) * 100;

          // If 50% or more of hero is visible and user is scrolling down
          if (visibilityPercentage >= 50 && heroTop < 0) {
            isScrolling.current = true;

            // Clear touch scrolling state for iOS
            if (isIOSDevice.current) {
              isTouchScrolling.current = false;
              if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
              }
            }

            // Calculate the position to scroll to (tagline section top - header height)
            const taglineTop =
              taglineRef.current.offsetTop - 56; // 56px header height

            window.scrollTo({
              top: taglineTop,
              behavior: "smooth",
            });

            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 800); // Longer timeout for iOS
          }
        }
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add event listeners with enhanced options for iOS
    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    window.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
    window.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    }); // Added for iOS
    window.addEventListener("scroll", throttledScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener(
        "touchstart",
        handleTouchStart,
      );
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("scroll", throttledScroll);
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    };
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "signin":
        return (
          <SignIn
            onNavigateHome={handleNavigateHome}
            onNavigateSignUp={() => navigateToPage("signup")}
          />
        );
      case "signup":
        return (
          <SignUp
            onNavigateHome={handleNavigateHome}
            onNavigateSignIn={() => navigateToPage("signin")}
          />
        );
      case "checkout":
        return (
          <Checkout
            cartItems={cartItems}
            onNavigateHome={handleNavigateHome}
            onNavigateCart={handleNavigateCart}
            onOrderComplete={handleOrderComplete}
          />
        );
      case "about":
        return (
          <About
            onNavigateHome={handleNavigateHome}
          />
        );
      case "home":
      default:
        return (
          <>
            {/* Hero Section - Full screen minus 25-30px */}
            <main
              ref={heroRef}
              style={{ minHeight: "calc(100vh - 25px)" }}
            >
              <HeroBanner />
            </main>

            {/* Tagline Section */}
            <section
              ref={taglineRef}
              className="py-16 px-4 text-center"
            >
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  Where timeless elegance meets sustainable
                  design. Discover pieces that speak to your
                  unique style and values.
                </p>
              </div>
            </section>

            {/* Photo Carousel */}
            <section>
              <PhotoCarousel />
            </section>

            {/* Crafted for you Section */}
            <section
              ref={craftedRef}
              className="pt-24 pb-8 px-4 text-center"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl mb-4 tracking-wide">
                  Crafted for you:
                </h2>
              </div>
            </section>

            {/* Product Carousel */}
            <section ref={productCarouselRef} className="pb-16">
              <ProductCarousel onAddToCart={handleAddToCart} />
            </section>

            {/* Customer Reviews */}
            <section ref={customerReviewsRef}>
              <CustomerReviews />
            </section>

            <div ref={footerRef}>
              <Footer />
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f5f1eb" }}
    >
      <Header
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        onMenuClose={handleMenuClose}
        isCartOpen={isCartOpen}
        onCartToggle={handleCartToggle}
        onCartClose={handleCartClose}
        onEmptyCart={handleEmptyCartRequest}
        cartItemCount={totalCartItems}
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
        onNavigateHome={handleNavigateHome}
        currentPage={currentPage}
      />
      <Menu 
        isOpen={isMenuOpen} 
        onClose={handleMenuClose}
        onNavigateToAbout={handleNavigateAbout}
      />
      <Cart
        isOpen={isCartOpen}
        onClose={handleCartClose}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleNavigateCheckout}
      />

      {/* Empty Cart Confirmation Dialog */}
      <AlertDialog
        open={showEmptyCartDialog}
        onOpenChange={setShowEmptyCartDialog}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Cart</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to empty the cart? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleEmptyCartCancel}>
              No
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyCartConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overlay - appears when menu is open, covers entire screen including header */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[30] transition-opacity duration-300"
          onClick={handleMenuClose}
        />
      )}

      {renderPage()}
    </div>
  );
}