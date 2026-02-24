// IMS Type Definitions

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  payment_terms: 'cash' | 'net_15' | 'net_30' | 'net_60' | 'net_90';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier?: Supplier;
  department_id: number | null;
  department?: any;
  order_date: string;
  expected_delivery_date: string | null;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled' | 'completed';
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_due_date: string | null;
  notes: string | null;
  approved_by: number | null;
  approved_at: string | null;
  received_by: number | null;
  received_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  product?: any;
  quantity_ordered: number;
  quantity_received: number;
  unit_type: 'piece' | 'carton' | 'box' | 'pack' | 'dozen' | 'kg' | 'liter' | 'meter';
  unit_price: string;
  unit_cost: string;
  tax_rate: string;
  total_price: string;
  total_cost: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: number;
  sale_number: string;
  department_id: number | null;
  department?: any;
  sale_date: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  payment_method: 'cash' | 'card' | 'transfer' | 'credit';
  payment_status: 'paid' | 'partial' | 'unpaid';
  amount_paid: string;
  cost_of_goods: string;
  gross_profit: string;
  profit_margin: string;
  notes: string | null;
  cashier_id: number;
  cashier?: any;
  created_at: string;
  updated_at: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product?: any;
  quantity: number;
  unit_type: 'piece' | 'carton' | 'box' | 'pack' | 'dozen' | 'kg' | 'liter' | 'meter';
  unit_price: string;
  unit_cost: string;
  total_price: string;
  line_profit: string;
  profit_margin: string;
  created_at: string;
  updated_at: string;
}

export interface ProfitLossReport {
  period: {
    start_date: string;
    end_date: string;
  };
  revenue: {
    total_sales: string;
    sales_count: number;
    average_sale: string;
  };
  costs: {
    total_cogs: string;
    total_purchases: string;
  };
  profit: {
    gross_profit: string;
    gross_margin: string;
  };
  by_department?: Array<{
    department_name: string;
    revenue: string;
    cogs: string;
    profit: string;
    margin: string;
  }>;
}

export interface StockVariance {
  product_id: number;
  product_name: string;
  sku: string;
  expected_stock: number;
  actual_stock: number;
  variance: number;
  variance_percentage: string;
  variance_value: string;
  last_count_date: string | null;
}

export interface ExpiringProduct {
  id: number;
  name: string;
  sku: string;
  batch_number: string | null;
  expiry_date: string;
  days_to_expiry: number;
  stock_quantity: number;
  value: string;
}
