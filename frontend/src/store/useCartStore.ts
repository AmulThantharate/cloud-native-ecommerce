"use client";

import { create } from "zustand";
import { Cart, CartItem, Product } from "@/types";

interface CartState {
  cart: Cart;
  isOpen: boolean;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: initialCart,
  isOpen: false,
  isLoading: false,

  addItem: (product, quantity = 1) => {
    const { cart } = get();
    const existingItem = cart.items.find((item) => item.product.id === product.id);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = cart.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...cart.items, { id: crypto.randomUUID(), product, quantity }];
    }

    const subtotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    set({
      cart: { items: newItems, subtotal, tax, shipping, total, itemCount },
    });
  },

  removeItem: (itemId) => {
    const { cart } = get();
    const newItems = cart.items.filter((item) => item.id !== itemId);
    const subtotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    set({
      cart: { items: newItems, subtotal, tax, shipping, total, itemCount },
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const { cart } = get();
    const newItems = cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    const subtotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    set({
      cart: { items: newItems, subtotal, tax, shipping, total, itemCount },
    });
  },

  clearCart: () => set({ cart: initialCart }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
