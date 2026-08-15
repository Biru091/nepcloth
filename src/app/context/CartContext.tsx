"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (
    productId: string,
    size: string,
    quantity?: number
  ) => void;

  removeFromCart: (
    productId: string,
    size: string
  ) => void;

  updateQuantity: (
    productId: string,
    size: string,
    quantity: number
  ) => void;

  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  });

  const addToCart = (
    productId: string,
    size: string,
    quantity = 1
  ) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) =>
          item.productId === productId &&
          item.size === size
      );

      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = currentCart.map((item) =>
          item.productId === productId &&
          item.size === size
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            productId,
            size,
            quantity,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const removeFromCart = (
    productId: string,
    size: string
  ) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size
          )
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const updateQuantity = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item.productId === productId &&
        item.size === size
          ? {
              ...item,
              quantity,
            }
          : item
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}