import React, { useState } from 'react';
import { CartItem } from '@/hooks/usePosCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, X } from 'lucide-react';

interface POSCartItemProps {
  item: CartItem;
  isLastScanned: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
  onUpdatePrice: (price: number) => void;
}

const POSCartItem: React.FC<POSCartItemProps> = React.memo(({
  item,
  isLastScanned,
  onIncrement,
  onDecrement,
  onRemove,
  onUpdateQuantity,
  onUpdatePrice,
}) => {
  const [editingQty, setEditingQty] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [tempQty, setTempQty] = useState(item.quantity.toString());
  const [tempPrice, setTempPrice] = useState(item.unit_price.toString());

  const lineTotal = item.quantity * item.unit_price - item.discount;

  const handleQtySubmit = () => {
    const qty = parseInt(tempQty);
    if (!isNaN(qty) && qty > 0) {
      onUpdateQuantity(qty);
    } else {
      setTempQty(item.quantity.toString());
    }
    setEditingQty(false);
  };

  const handlePriceSubmit = () => {
    const price = parseFloat(tempPrice);
    if (!isNaN(price) && price >= 0) {
      onUpdatePrice(price);
    } else {
      setTempPrice(item.unit_price.toString());
    }
    setEditingPrice(false);
  };

  return (
    <tr 
      className={`
        hover:bg-gray-50 transition-colors
        ${isLastScanned ? 'bg-green-50 border-l-4 border-green-500 animate-pulse-once' : ''}
      `}
    >
      {/* Product Name */}
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{item.product_name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {item.sku && `SKU: ${item.sku} | `}
            Stock: {item.stock_available} {item.unit_type}
          </p>
        </div>
      </td>

      {/* Quantity Controls */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onDecrement}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          {editingQty ? (
            <Input
              type="number"
              value={tempQty}
              onChange={(e) => setTempQty(e.target.value)}
              onBlur={handleQtySubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleQtySubmit()}
              className="w-16 h-8 text-center px-1"
              autoFocus
              min="1"
            />
          ) : (
            <button
              onClick={() => {
                setEditingQty(true);
                setTempQty(item.quantity.toString());
              }}
              className="w-16 h-8 text-center font-semibold hover:bg-gray-100 rounded border"
            >
              {item.quantity}
            </button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </td>

      {/* Unit Price */}
      <td className="px-4 py-4 text-right">
        {editingPrice ? (
          <Input
            type="number"
            value={tempPrice}
            onChange={(e) => setTempPrice(e.target.value)}
            onBlur={handlePriceSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handlePriceSubmit()}
            className="w-24 h-8 text-right"
            autoFocus
            min="0"
            step="0.01"
          />
        ) : (
          <button
            onClick={() => {
              setEditingPrice(true);
              setTempPrice(item.unit_price.toString());
            }}
            className="font-semibold hover:bg-gray-100 px-2 py-1 rounded"
            title="Click to edit price"
          >
            ₦{item.unit_price.toLocaleString()}
          </button>
        )}
      </td>

      {/* Line Total */}
      <td className="px-4 py-4 text-right">
        <div>
          <p className="font-bold text-gray-900">
            ₦{lineTotal.toLocaleString()}
          </p>
          {item.discount > 0 && (
            <p className="text-xs text-red-600">
              -₦{item.discount.toLocaleString()} disc
            </p>
          )}
        </div>
      </td>

      {/* Remove Button */}
      <td className="px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-rendering
  return (
    prevProps.item.product_id === nextProps.item.product_id &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.unit_price === nextProps.item.unit_price &&
    prevProps.item.discount === nextProps.item.discount &&
    prevProps.isLastScanned === nextProps.isLastScanned
  );
});

POSCartItem.displayName = 'POSCartItem';

export default POSCartItem;
