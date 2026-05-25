import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem, Producto } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto, talle: string, cantidad?: number) => void;
  removeItem: (productoId: number, talle: string) => void;
  updateQuantity: (productoId: number, talle: string, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(producto: Producto, talle: string, cantidad = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.producto.id === producto.id && i.talle === talle);
      if (existing) {
        return prev.map(i =>
          i.producto.id === producto.id && i.talle === talle
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { producto, talle, cantidad }];
    });
  }

  function removeItem(productoId: number, talle: string) {
    setItems(prev => prev.filter(i => !(i.producto.id === productoId && i.talle === talle)));
  }

  function updateQuantity(productoId: number, talle: string, cantidad: number) {
    if (cantidad < 1) {
      removeItem(productoId, talle);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.producto.id === productoId && i.talle === talle ? { ...i, cantidad } : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  const count = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
