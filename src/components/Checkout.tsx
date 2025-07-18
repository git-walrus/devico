import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, CreditCard, Truck, MapPin, User } from 'lucide-react';
import { CartItem } from './Cart';

interface CheckoutProps {
  cartItems: CartItem[];
  onNavigateHome: () => void;
  onNavigateCart: () => void;
  onOrderComplete: () => void;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface CheckoutData {
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  paymentInfo: Omit<PaymentInfo, 'cardNumber' | 'cvv'>; // Don't store sensitive card info
  useSameAsBilling: boolean;
  selectedShippingMethod: string;
}

// Storage keys
const CHECKOUT_CUSTOMER_STORAGE_KEY = "devico-checkout-customer";
const CHECKOUT_ADDRESSES_STORAGE_KEY = "devico-checkout-addresses";
const CHECKOUT_PREFERENCES_STORAGE_KEY = "devico-checkout-preferences";

export function Checkout({ cartItems, onNavigateHome, onNavigateCart, onOrderComplete }: CheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [useSameAsBilling, setUseSameAsBilling] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShippingMethod === 'express' ? 15 : selectedShippingMethod === 'overnight' ? 25 : 8;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 8 },
    { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 15 },
    { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', price: 25 }
  ];

  const steps = [
    { number: 1, label: 'Customer Info' },
    { number: 2, label: 'Shipping' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Review' }
  ];

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      // Load customer information
      const savedCustomerInfo = localStorage.getItem(CHECKOUT_CUSTOMER_STORAGE_KEY);
      if (savedCustomerInfo) {
        const parsedCustomerInfo: CustomerInfo = JSON.parse(savedCustomerInfo);
        // Validate structure
        if (
          typeof parsedCustomerInfo.firstName === 'string' &&
          typeof parsedCustomerInfo.lastName === 'string' &&
          typeof parsedCustomerInfo.email === 'string' &&
          typeof parsedCustomerInfo.phone === 'string'
        ) {
          setCustomerInfo(parsedCustomerInfo);
        }
      }

      // Load addresses
      const savedAddresses = localStorage.getItem(CHECKOUT_ADDRESSES_STORAGE_KEY);
      if (savedAddresses) {
        const parsedAddresses: { shipping: Address; billing: Address } = JSON.parse(savedAddresses);
        // Validate structure
        if (
          parsedAddresses.shipping &&
          typeof parsedAddresses.shipping.street === 'string' &&
          typeof parsedAddresses.shipping.city === 'string' &&
          parsedAddresses.billing &&
          typeof parsedAddresses.billing.street === 'string' &&
          typeof parsedAddresses.billing.city === 'string'
        ) {
          setShippingAddress(parsedAddresses.shipping);
          setBillingAddress(parsedAddresses.billing);
        }
      }

      // Load preferences and non-sensitive payment info
      const savedPreferences = localStorage.getItem(CHECKOUT_PREFERENCES_STORAGE_KEY);
      if (savedPreferences) {
        const parsedPreferences: {
          useSameAsBilling: boolean;
          selectedShippingMethod: string;
          cardholderName: string;
        } = JSON.parse(savedPreferences);
        
        if (typeof parsedPreferences.useSameAsBilling === 'boolean') {
          setUseSameAsBilling(parsedPreferences.useSameAsBilling);
        }
        if (typeof parsedPreferences.selectedShippingMethod === 'string') {
          setSelectedShippingMethod(parsedPreferences.selectedShippingMethod);
        }
        if (typeof parsedPreferences.cardholderName === 'string') {
          setPaymentInfo(prev => ({ ...prev, cardholderName: parsedPreferences.cardholderName }));
        }
      }
    } catch (error) {
      console.error('Error loading checkout data from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem(CHECKOUT_CUSTOMER_STORAGE_KEY);
      localStorage.removeItem(CHECKOUT_ADDRESSES_STORAGE_KEY);
      localStorage.removeItem(CHECKOUT_PREFERENCES_STORAGE_KEY);
    }
  }, []);

  // Save customer info to localStorage whenever it changes
  useEffect(() => {
    try {
      if (customerInfo.firstName || customerInfo.lastName || customerInfo.email || customerInfo.phone) {
        localStorage.setItem(CHECKOUT_CUSTOMER_STORAGE_KEY, JSON.stringify(customerInfo));
      }
    } catch (error) {
      console.error('Error saving customer info to localStorage:', error);
    }
  }, [customerInfo]);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    try {
      if (shippingAddress.street || billingAddress.street) {
        const addressData = {
          shipping: shippingAddress,
          billing: billingAddress
        };
        localStorage.setItem(CHECKOUT_ADDRESSES_STORAGE_KEY, JSON.stringify(addressData));
      }
    } catch (error) {
      console.error('Error saving addresses to localStorage:', error);
    }
  }, [shippingAddress, billingAddress]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      const preferencesData = {
        useSameAsBilling,
        selectedShippingMethod,
        cardholderName: paymentInfo.cardholderName
      };
      localStorage.setItem(CHECKOUT_PREFERENCES_STORAGE_KEY, JSON.stringify(preferencesData));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
  }, [useSameAsBilling, selectedShippingMethod, paymentInfo.cardholderName]);

  const validateCustomerInfo = () => {
    const newErrors: {[key: string]: string} = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    return newErrors;
  };

  const validateAddress = (address: Address, prefix: string) => {
    const newErrors: {[key: string]: string} = {};

    if (!address.street.trim()) {
      newErrors[`${prefix}Street`] = 'Street address is required';
    }
    if (!address.city.trim()) {
      newErrors[`${prefix}City`] = 'City is required';
    }
    if (!address.state.trim()) {
      newErrors[`${prefix}State`] = 'State is required';
    }
    if (!address.zipCode.trim()) {
      newErrors[`${prefix}ZipCode`] = 'ZIP code is required';
    }

    return newErrors;
  };

  const validatePayment = () => {
    const newErrors: {[key: string]: string} = {};

    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please enter date in MM/YY format';
    }

    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    return newErrors;
  };

  const handleNextStep = () => {
    let stepErrors: {[key: string]: string} = {};

    if (currentStep === 1) {
      stepErrors = validateCustomerInfo();
    } else if (currentStep === 2) {
      stepErrors = {
        ...validateAddress(shippingAddress, 'shipping'),
        ...(!useSameAsBilling ? validateAddress(billingAddress, 'billing') : {})
      };
    } else if (currentStep === 3) {
      stepErrors = validatePayment();
    }

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handlePlaceOrder = async () => {
    const paymentErrors = validatePayment();
    if (Object.keys(paymentErrors).length > 0) {
      setErrors(paymentErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear sensitive payment data after successful order
      setPaymentInfo(prev => ({ ...prev, cardNumber: '', cvv: '', expiryDate: '' }));
      
      // Clear cart and navigate to success
      onOrderComplete();
    } catch (error) {
      setErrors({ general: 'Order failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSameAsBillingChange = (checked: boolean) => {
    setUseSameAsBilling(checked);
    if (checked) {
      setBillingAddress(shippingAddress);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const renderOrderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-12 h-14 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm mb-1">{item.name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Shipping Method */}
        <div className="space-y-3">
          <Label>Shipping Method</Label>
          {shippingMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2">
              <input
                type="radio"
                id={method.id}
                name="shipping"
                value={method.id}
                checked={selectedShippingMethod === method.id}
                onChange={(e) => setSelectedShippingMethod(e.target.value)}
                className="rounded"
              />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">{method.name}</p>
                    <p className="text-xs text-gray-600">{method.description}</p>
                  </div>
                  <p className="text-sm">${method.price}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCustomerInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
              className={errors.firstName ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={customerInfo.lastName}
              onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
              className={errors.lastName ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            className={errors.email ? 'border-red-300 focus:border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            className={errors.phone ? 'border-red-300 focus:border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>
      </CardContent>
    </Card>
  );

  const renderAddressForm = (address: Address, setAddress: (address: Address) => void, prefix: string, title: string, icon: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Street`}>Street Address</Label>
          <Input
            id={`${prefix}Street`}
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            className={errors[`${prefix}Street`] ? 'border-red-300 focus:border-red-500' : ''}
          />
          {errors[`${prefix}Street`] && <p className="text-sm text-red-600">{errors[`${prefix}Street`]}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${prefix}City`}>City</Label>
            <Input
              id={`${prefix}City`}
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className={errors[`${prefix}City`] ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors[`${prefix}City`] && <p className="text-sm text-red-600">{errors[`${prefix}City`]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${prefix}State`}>State</Label>
            <Input
              id={`${prefix}State`}
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              className={errors[`${prefix}State`] ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors[`${prefix}State`] && <p className="text-sm text-red-600">{errors[`${prefix}State`]}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${prefix}ZipCode`}>ZIP Code</Label>
            <Input
              id={`${prefix}ZipCode`}
              value={address.zipCode}
              onChange={(e) => setAddress({...address, zipCode: e.target.value})}
              className={errors[`${prefix}ZipCode`] ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors[`${prefix}ZipCode`] && <p className="text-sm text-red-600">{errors[`${prefix}ZipCode`]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${prefix}Country`}>Country</Label>
            <Select value={address.country} onValueChange={(value) => setAddress({...address, country: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            value={paymentInfo.cardholderName}
            onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
            className={errors.cardholderName ? 'border-red-300 focus:border-red-500' : ''}
          />
          {errors.cardholderName && <p className="text-sm text-red-600">{errors.cardholderName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
            className={errors.cardNumber ? 'border-red-300 focus:border-red-500' : ''}
            maxLength={19}
          />
          {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
              className={errors.expiryDate ? 'border-red-300 focus:border-red-500' : ''}
              maxLength={5}
            />
            {errors.expiryDate && <p className="text-sm text-red-600">{errors.expiryDate}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
              className={errors.cvv ? 'border-red-300 focus:border-red-500' : ''}
              maxLength={4}
            />
            {errors.cvv && <p className="text-sm text-red-600">{errors.cvv}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md text-center space-y-6">
          <Button
            variant="ghost"
            onClick={onNavigateHome}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={onNavigateHome} className="w-full">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-12" style={{ backgroundColor: "#f5f1eb" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onNavigateCart}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            {/* Step circles and connecting lines */}
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.number} className="relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentStep >= step.number ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                </div>
              ))}
              
              {/* Connecting line background */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-300 -z-0" />
              
              {/* Progress line */}
              <div 
                className="absolute top-4 left-4 h-0.5 bg-gray-900 transition-all duration-300 -z-0"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Step labels */}
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <p key={step.number} className="text-xs text-gray-600 text-center" style={{ width: '32px' }}>
                  {step.label}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {currentStep === 1 && renderCustomerInfo()}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                {renderAddressForm(shippingAddress, setShippingAddress, 'shipping', 'Shipping Address', <Truck className="h-5 w-5 mr-2" />)}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsBilling"
                    checked={useSameAsBilling}
                    onCheckedChange={handleUseSameAsBillingChange}
                  />
                  <Label htmlFor="sameAsBilling">Billing address same as shipping</Label>
                </div>

                {!useSameAsBilling && renderAddressForm(billingAddress, setBillingAddress, 'billing', 'Billing Address', <MapPin className="h-5 w-5 mr-2" />)}
              </div>
            )}

            {currentStep === 3 && renderPaymentInfo()}

            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2">Customer Information</h4>
                      <p className="text-sm text-gray-600">
                        {customerInfo.firstName} {customerInfo.lastName}<br />
                        {customerInfo.email}<br />
                        {customerInfo.phone}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {shippingAddress.street}<br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        {shippingAddress.country}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}<br />
                        {paymentInfo.cardholderName}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? onNavigateCart : handlePreviousStep}
                >
                  {currentStep === 1 ? 'Back to Cart' : 'Previous'}
                </Button>
                <Button onClick={handleNextStep}>
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            {renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  );
}