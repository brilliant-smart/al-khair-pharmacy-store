/**
 * POS Search Component
 * 
 * Responsible for:
 * - Scanner input field
 * - Search results dropdown
 * - Product selection
 */

import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UseScannerReturn } from '../composables';
import { UsePosCartReturn } from '../composables';
import { toast } from 'sonner';

interface POSSearchProps {
  scanner: UseScannerReturn;
  cart: UsePosCartReturn;
}

export default function POSSearch({ scanner, cart }: POSSearchProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Clear search if clicking outside
        scanner.clearSearch();
        if (scanner.scannerRef.current) {
          scanner.scannerRef.current.value = '';
        }
      }
    };

    // Handle ESC key to close dropdown
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

  const handleProductSelect = (product: any) => {
    // Add product to cart
    cart.addItem(product);
    toast.success(`Added: ${product.name}`);
    
    // Clear search input
    if (scanner.scannerRef.current) {
      scanner.scannerRef.current.value = '';
    }
    
    // Clear search state (this closes the dropdown)
    scanner.clearSearch();
    
    // Refocus scanner
    scanner.focusScanner();
  };

  return (
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
      </div>
    </div>
  );
}
