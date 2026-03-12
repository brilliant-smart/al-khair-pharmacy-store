import { useState, useRef, useEffect } from 'react';
import { usePosCart } from '@/hooks/usePosCart';
import { usePosScanner } from '@/hooks/usePosScanner';
import { usePosPayment } from '@/hooks/usePosPayment';
import { usePosKeyboard } from '@/hooks/usePosKeyboard';
import { useAuth } from '@/app/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  CreditCard, 
  Archive, 
  RotateCcw, 
  Ban,
  Printer,
  User,
  Percent,
  X,
  Plus,
  Minus,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import POSPaymentDrawer from './POSPaymentDrawer';
import POSHoldRecallModal from './POSHoldRecallModal';
import POSVoidModal from './POSVoidModal';
import POSCartItem from './POSCartItem';

export default function POSTerminal() {
  const { user } = useAuth();
  const cart = usePosCart();
  const scanner = usePosScanner({
    onProductScanned: (product) => {
      cart.addItem(product);
      toast.success(`Added: ${product.name}`);
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  const payment = usePosPayment(cart.grandTotal);

  // Modal states
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [holdRecallOpen, setHoldRecallOpen] = useState(false);
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);

  // Customer state
  const [showCustomerInput, setShowCustomerInput] = useState(false);
  const [customerName, setCustomerName] = useState('');

  // Discount state
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  
  // Dropdown ref for click-outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  usePosKeyboard({
    onPayment: () => {
      if (cart.items.length > 0) {
        setPaymentDrawerOpen(true);
      } else {
        toast.error('Cart is empty');
      }
    },
    onHold: () => {
      if (cart.items.length > 0) {
        handleHoldCart();
      } else {
        toast.error('Cart is empty');
      }
    },
    onRecall: () => {
      setHoldRecallOpen(true);
    },
    onVoid: () => {
      setVoidModalOpen(true);
    },
    onNewSale: () => {
      handleNewSale();
    },
    enabled: !paymentDrawerOpen && !holdRecallOpen && !voidModalOpen,
  });

  const handleHoldCart = async () => {
    try {
      // This will be implemented in the modal
      setHoldRecallOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to hold cart');
    }
  };

  const handleNewSale = () => {
    if (cart.items.length > 0) {
      if (confirm('Clear current cart and start new sale?')) {
        cart.clearCart();
        payment.clearPayments();
        setCustomerName('');
        scanner.focusScanner();
        toast.success('New sale started');
      }
    }
  };

  const handleApplyDiscount = () => {
    const value = parseFloat(discountValue);
    if (isNaN(value) || value < 0) {
      toast.error('Invalid discount value');
      return;
    }

    if (discountType === 'percentage') {
      if (value > 100) {
        toast.error('Discount percentage cannot exceed 100%');
        return;
      }
      cart.applyGlobalDiscount(value, 0);
      toast.success(`${value}% discount applied`);
    } else {
      if (value > cart.subtotal) {
        toast.error('Discount amount cannot exceed subtotal');
        return;
      }
      cart.applyGlobalDiscount(0, value);
      toast.success(`₦${value.toLocaleString()} discount applied`);
    }

    setDiscountModalOpen(false);
    setDiscountValue('');
  };
  
  // Handle product selection from search dropdown
  const handleProductSelect = (product: any) => {
    cart.addItem(product);
    toast.success(`Added: ${product.name}`);
    
    // Clear search input
    if (scanner.scannerRef.current) {
      scanner.scannerRef.current.value = '';
    }
    
    // Clear search state (closes dropdown)
    scanner.clearSearch();
    
    // Refocus scanner
    scanner.focusScanner();
  };
  
  // Click-outside and ESC key handlers for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        scanner.clearSearch();
        if (scanner.scannerRef.current) {
          scanner.scannerRef.current.value = '';
        }
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        scanner.clearSearch();
        if (scanner.scannerRef.current) {
          scanner.scannerRef.current.value = '';
        }
        scanner.focusScanner();
      }
    };

    // Only add listeners if dropdown is visible
    if (scanner.searchResults.length > 0 && scanner.searchQuery) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [scanner.searchResults.length, scanner.searchQuery, scanner]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <ShoppingCart className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-bold">POS Terminal</h1>
            <p className="text-green-100 text-sm">Al-Khair Pharmacy Store</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-green-100 text-sm">Cashier</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Scanner Input - Always focused */}
      <div className="bg-white border-b px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative" ref={dropdownRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={scanner.scannerRef}
              type="text"
              placeholder="Scan barcode or search product... (Auto-focused)"
              className="pl-10 h-12 text-lg font-mono border-2 border-green-200 focus:border-green-500"
              autoFocus
            />
            {/* Search Results Dropdown */}
            {scanner.searchResults.length > 0 && scanner.searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-green-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {scanner.searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full px-4 py-3 hover:bg-green-50 border-b last:border-b-0 text-left flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.barcode && `Barcode: ${product.barcode} • `}
                        Stock: {product.stock_quantity || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₦{product.price?.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Scanner Active</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaymentDrawerOpen(true)}
              disabled={cart.items.length === 0}
              className="h-12"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              F6 Pay
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Cart (60%) */}
        <div className="w-[60%] flex flex-col border-r bg-white">
          {/* Cart Header */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({cart.itemCount})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewSale}
                disabled={cart.items.length === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Cart (F4)
              </Button>
            </div>
          </div>

          {/* Cart Table */}
          <div className="flex-1 overflow-auto">
            {cart.items.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Cart is empty</p>
                  <p className="text-sm">Scan a product to get started</p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium w-32">Quantity</th>
                    <th className="px-4 py-3 font-medium w-32 text-right">Price</th>
                    <th className="px-4 py-3 font-medium w-32 text-right">Total</th>
                    <th className="px-4 py-3 font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cart.items.map((item) => (
                    <POSCartItem
                      key={item.product_id}
                      item={item}
                      isLastScanned={item.product_id === cart.lastScannedProductId}
                      onIncrement={() => cart.incrementQty(item.product_id)}
                      onDecrement={() => cart.decrementQty(item.product_id)}
                      onRemove={() => cart.removeItem(item.product_id)}
                      onUpdateQuantity={(qty) => cart.updateQuantity(item.product_id, qty)}
                      onUpdatePrice={(price) => cart.updatePrice(item.product_id, price)}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Cart Summary */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₦{cart.subtotal.toLocaleString()}</span>
              </div>
              {cart.globalDiscountAmount > 0 && (
                <div className="flex justify-between text-lg text-red-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-₦{cart.globalDiscountAmount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-2xl font-bold text-green-600">
                <span>TOTAL:</span>
                <span>₦{cart.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Profit:</span>
                <span className="text-green-600 font-semibold">
                  ₦{cart.totalProfit.toLocaleString()} ({cart.profitMargin.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions & Summary (40%) */}
        <div className="w-[40%] flex flex-col bg-gray-50">
          {/* Quick Actions */}
          <Card className="m-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleNewSale}
                className="h-14 flex-col"
              >
                <X className="h-5 w-5 mb-1" />
                <span className="text-xs">New Sale (F4)</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setHoldRecallOpen(true)}
                className="h-14 flex-col"
                disabled={cart.items.length === 0}
              >
                <Archive className="h-5 w-5 mb-1" />
                <span className="text-xs">Hold (F8)</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setHoldRecallOpen(true)}
                className="h-14 flex-col"
              >
                <RotateCcw className="h-5 w-5 mb-1" />
                <span className="text-xs">Recall (F9)</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setVoidModalOpen(true)}
                className="h-14 flex-col"
              >
                <Ban className="h-5 w-5 mb-1" />
                <span className="text-xs">Void (F10)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="mx-4 mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              {!showCustomerInput ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomerInput(true)}
                  className="w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  Add Customer (Optional)
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCustomerInput(false);
                      setCustomerName('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount */}
          <Card className="mx-4 mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Discount</CardTitle>
            </CardHeader>
            <CardContent>
              {!discountModalOpen ? (
                <Button
                  variant="outline"
                  onClick={() => setDiscountModalOpen(true)}
                  className="w-full"
                  disabled={cart.items.length === 0}
                >
                  <Percent className="h-4 w-4 mr-2" />
                  Apply Discount
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant={discountType === 'percentage' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDiscountType('percentage')}
                    >
                      %
                    </Button>
                    <Button
                      variant={discountType === 'amount' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDiscountType('amount')}
                    >
                      ₦
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === 'percentage' ? 'Percentage' : 'Amount'}
                      className="flex-1"
                      min="0"
                      max={discountType === 'percentage' ? '100' : cart.subtotal.toString()}
                    />
                    <Button onClick={handleApplyDiscount} size="sm">
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDiscountModalOpen(false);
                        setDiscountValue('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Complete Payment Button */}
          <div className="p-4 bg-white border-t">
            <Button
              onClick={() => setPaymentDrawerOpen(true)}
              disabled={cart.items.length === 0}
              className="w-full h-16 text-xl font-bold bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CreditCard className="h-6 w-6 mr-3" />
              Complete Payment (F6)
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <POSPaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => {
          setPaymentDrawerOpen(false);
          scanner.focusScanner();
        }}
        cart={cart}
        payment={payment}
        customerName={customerName}
      />

      <POSHoldRecallModal
        open={holdRecallOpen}
        onClose={() => {
          setHoldRecallOpen(false);
          scanner.focusScanner();
        }}
        cart={cart}
      />

      <POSVoidModal
        open={voidModalOpen}
        onClose={() => {
          setVoidModalOpen(false);
          scanner.focusScanner();
        }}
      />
    </div>
  );
}
