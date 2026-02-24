import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Scan, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { purchaseOrderApi } from '@/app/api/purchaseOrders';
import { supplierApi } from '@/app/api/suppliers';
import { productApi } from '@/app/api/products';
import { priceHistoryApi } from '@/app/api/priceHistory';
import { Supplier } from '@/types/ims';
import { toast } from 'sonner';
import BarcodeScanner from '@/components/BarcodeScanner';
import { DatePickerWithToday } from '@/components/DatePickerWithToday';
import { useAuth } from '@/app/auth/AuthContext';
import PriceComparisonModal from '@/components/PriceComparisonModal';

export default function PurchaseOrderCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [priceComparisonOpen, setPriceComparisonOpen] = useState(false);
  const [priceComparisons, setPriceComparisons] = useState<any[]>([]);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    payment_method: 'credit' as 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'credit',
    payment_due_date: '',
    notes: '',
  });
  const [items, setItems] = useState<any[]>([
    { product_id: '', quantity_ordered: 1, unit_cost: 0, unit_type: 'piece' },
  ]);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningForIndex, setScanningForIndex] = useState<number | null>(null);

  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierApi.getAll();
      setSuppliers(data.filter((s: Supplier) => s.is_active));
    } catch (error) {
      toast.error('Failed to load suppliers');
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productApi.getAll();
      const allProducts = data.data || data;
      
      // Filter products by department for section heads
      // Master admin sees all products
      if (user?.role === 'section_head' && user?.department_id) {
        const filteredProducts = allProducts.filter((p: any) => p.department_id === user.department_id);
        setProducts(filteredProducts);
      } else {
        // Master admin sees all products
        setProducts(allProducts);
      }
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const addItem = () => {
    setItems([...items, { product_id: '', quantity_ordered: 1, unit_cost: 0, unit_type: 'piece' }]);
  };

  const handlePriceComparison = async () => {
    const productIds = items
      .filter(item => item.product_id)
      .map(item => parseInt(item.product_id));

    if (productIds.length === 0) {
      toast.error('Please add products first');
      return;
    }

    setLoadingComparison(true);
    try {
      const response = await priceHistoryApi.getPriceComparison(productIds);
      setPriceComparisons(response.price_comparison || []);
      setPriceComparisonOpen(true);
    } catch (error: any) {
      console.error('Price comparison error:', error);
      toast.error(error.response?.data?.message || 'Failed to load price comparison');
    } finally {
      setLoadingComparison(false);
    }
  };

  const getCurrentPrices = () => {
    const prices: { [key: number]: number } = {};
    items.forEach(item => {
      if (item.product_id && item.unit_cost) {
        prices[parseInt(item.product_id)] = parseFloat(item.unit_cost);
      }
    });
    return prices;
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleBarcodeClick = (index: number) => {
    setScanningForIndex(index);
    setShowScanner(true);
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const product = await productApi.searchByBarcode(barcode);
      
      if (scanningForIndex !== null) {
        updateItem(scanningForIndex, 'product_id', product.id.toString());
        
        // Auto-fill unit cost with product's cost price if available
        if (product.cost_price) {
          updateItem(scanningForIndex, 'unit_cost', product.cost_price);
        }
        
        toast.success(`Product "${product.name}" added`);
      }
      
      setShowScanner(false);
      setScanningForIndex(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Product not found');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplier_id) {
      toast.error('Please select a supplier');
      return;
    }

    if (items.length === 0 || items.some((i) => !i.product_id || i.quantity_ordered <= 0)) {
      toast.error('Please add at least one valid item');
      return;
    }

    // Validate unit cost for all items
    if (items.some((i) => !i.unit_cost || i.unit_cost <= 0)) {
      toast.error('Please enter unit cost for all items');
      return;
    }

    try {
      setLoading(true);
      await purchaseOrderApi.create({
        ...formData,
        supplier_id: parseInt(formData.supplier_id),
        items,
      });
      toast.success('Purchase order created successfully');
      navigate('/admin/purchase-orders');
    } catch (error: any) {
      console.error('Purchase order creation error:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create purchase order';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        // Show first validation error
        const firstError = Object.values(validationErrors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/purchase-orders')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Purchase Order</h1>
          <p className="text-muted-foreground">Order stock from suppliers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Select 
                  value={formData.supplier_id} 
                  onValueChange={(v) => {
                    // WORLD-CLASS BEST PRACTICE: Auto-populate payment method from supplier's default
                    const selectedSupplier = suppliers.find(s => s.id.toString() === v);
                    const defaultPaymentMethod = selectedSupplier?.payment_terms || 'credit';
                    
                    setFormData({ 
                      ...formData, 
                      supplier_id: v,
                      payment_method: defaultPaymentMethod as any
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} 
                        <span className="text-xs text-muted-foreground ml-2">
                          ({s.payment_terms?.replace('_', ' ') || 'credit'})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.supplier_id && (
                  <p className="text-xs text-muted-foreground">
                    💡 Payment method auto-filled from supplier's default (you can change it below)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Order Date *</Label>
                <DatePickerWithToday
                  value={formData.order_date}
                  onChange={(v) => setFormData({ ...formData, order_date: v })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Delivery</Label>
                <DatePickerWithToday
                  value={formData.expected_delivery_date}
                  onChange={(v) => setFormData({ ...formData, expected_delivery_date: v })}
                  placeholder="Select delivery date"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select value={formData.payment_method} onValueChange={(v: any) => setFormData({ ...formData, payment_method: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">💵 Cash</SelectItem>
                    <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                    <SelectItem value="cheque">📝 Cheque</SelectItem>
                    <SelectItem value="card">💳 Card</SelectItem>
                    <SelectItem value="credit">📋 Credit (Pay Later)</SelectItem>
                    <SelectItem value="credit_7">⏰ Credit 7 Days</SelectItem>
                    <SelectItem value="credit_14">⏰ Credit 14 Days</SelectItem>
                    <SelectItem value="credit_30">⏰ Credit 30 Days</SelectItem>
                    <SelectItem value="credit_60">⏰ Credit 60 Days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  You can change the payment method if needed
                </p>
              </div>

              {formData.payment_method === 'credit' && (
                <div className="space-y-2">
                  <Label>Payment Due Date</Label>
                  <DatePickerWithToday
                    value={formData.payment_due_date}
                    onChange={(v) => setFormData({ ...formData, payment_due_date: v })}
                    placeholder="Select due date"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Items</CardTitle>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={handlePriceComparison} 
                  variant="outline"
                  size="sm"
                  disabled={loadingComparison || items.filter(i => i.product_id).length === 0}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {loadingComparison ? 'Loading...' : 'Check Prices'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Product</Label>
                  <div className="flex gap-2">
                    <Select value={item.product_id} onValueChange={(v) => updateItem(index, 'product_id', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleBarcodeClick(index)}
                      title="Scan barcode"
                    >
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="w-24 space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity_ordered || ''}
                    onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="w-28 space-y-2">
                  <Label>Unit Type</Label>
                  <Select value={item.unit_type || 'piece'} onValueChange={(v) => updateItem(index, 'unit_type', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="carton">Carton</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32 space-y-2">
                  <Label>Unit Cost (₦)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_cost || ''}
                    onChange={(e) => updateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₦{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/purchase-orders')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Purchase Order'}
          </Button>
        </div>
      </form>

      {/* Price Comparison Modal */}
      <PriceComparisonModal
        open={priceComparisonOpen}
        onClose={() => setPriceComparisonOpen(false)}
        comparisons={priceComparisons}
        currentPrices={getCurrentPrices()}
      />

      {/* Barcode Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Scan Product Barcode</DialogTitle>
          </DialogHeader>
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onClose={() => {
              setShowScanner(false);
              setScanningForIndex(null);
            }}
            title="Scan to add product"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
