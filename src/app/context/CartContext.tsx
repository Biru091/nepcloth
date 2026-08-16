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
  // Cart
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

  // Wishlist
  wishlist: string[];

  addToWishlist: (
    productId: string
  ) => void;

  removeFromWishlist: (
    productId: string
  ) => void;

  isInWishlist: (
    productId: string
  ) => boolean;

  clearWishlist: () => void;
}

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [wishlist, setWishlist] =
    useState<string[]>([]);

  // =========================
  // CART
  // =========================

  const addToCart = (
    productId: string,
    size: string,
    quantity = 1
  ) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.productId === productId &&
            item.size === size
        );

      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = currentCart.map(
          (item) =>
            item.productId === productId &&
            item.size === size
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
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

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart)
        );
      }

      return updatedCart;
    });
  };

  const removeFromCart = (
    productId: string,
    size: string
  ) => {
    setCart((currentCart) => {
      const updatedCart =
        currentCart.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.size === size
            )
        );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart)
        );
      }

      return updatedCart;
    });
  };

  const updateQuantity = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(
        productId,
        size
      );
      return;
    }

    setCart((currentCart) => {
      const updatedCart =
        currentCart.map((item) =>
          item.productId === productId &&
          item.size === size
            ? {
                ...item,
                quantity,
              }
            : item
        );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart)
        );
      }

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);

    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  // =========================
  // WISHLIST
  // =========================

  const addToWishlist = (
    productId: string
  ) => {
    setWishlist((currentWishlist) => {
      // Prevent duplicate
      if (
        currentWishlist.includes(
          productId
        )
      ) {
        return currentWishlist;
      }

      const updatedWishlist = [
        ...currentWishlist,
        productId,
      ];

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wishlist",
          JSON.stringify(updatedWishlist)
        );
      }

      return updatedWishlist;
    });
  };

  const removeFromWishlist = (
    productId: string
  ) => {
    setWishlist((currentWishlist) => {
      const updatedWishlist =
        currentWishlist.filter(
          (id) => id !== productId
        );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wishlist",
          JSON.stringify(updatedWishlist)
        );
      }

      return updatedWishlist;
    });
  };

  const isInWishlist = (
    productId: string
  ) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);

    if (typeof window !== "undefined") {
      localStorage.removeItem(
        "wishlist"
      );
    }
  };

  // =========================
  // PROVIDER
  // =========================

  return (
    <CartContext.Provider
      value={{
        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}