
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// =====================================================
// TYPES
// =====================================================

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
}

interface WishlistItem {
  productId: string;
}

interface CartResponse {
  success: boolean;
  message?: string;
  cart?: {
    items: CartItem[];
  };
}

interface WishlistResponse {
  success: boolean;
  message?: string;
  wishlist?: {
    items: WishlistItem[];
  };
}

interface CartContextType {
  // Cart
  cart: CartItem[];

  addToCart: (
    productId: string,
    size: string,
    quantity?: number
  ) => Promise<void>;

  removeFromCart: (
    productId: string,
    size: string
  ) => Promise<void>;

  updateQuantity: (
    productId: string,
    size: string,
    quantity: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  // Wishlist
  wishlist: string[];

  addToWishlist: (
    productId: string
  ) => Promise<void>;

  removeFromWishlist: (
    productId: string
  ) => Promise<void>;

  isInWishlist: (
    productId: string
  ) => boolean;

  clearWishlist: () => Promise<void>;
}

// =====================================================
// CONTEXT
// =====================================================

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

// =====================================================
// PROVIDER
// =====================================================

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [wishlist, setWishlist] =
    useState<string[]>([]);

  // =====================================================
  // LOAD CART FROM DATABASE
  // =====================================================

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch(
          "/api/cart",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as CartResponse;

        if (
          data.success &&
          data.cart
        ) {
          setCart(data.cart.items);
        }
      } catch (error) {
        console.error(
          "LOAD CART ERROR:",
          error
        );
      }
    };

    loadCart();
  }, []);

  // =====================================================
  // LOAD WISHLIST FROM DATABASE
  // =====================================================

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await fetch(
          "/api/wishlist",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as WishlistResponse;

        if (
          data.success &&
          data.wishlist
        ) {
          const ids =
            data.wishlist.items.map(
              (item: WishlistItem) =>
                item.productId
            );

          setWishlist(ids);
        }
      } catch (error) {
        console.error(
          "LOAD WISHLIST ERROR:",
          error
        );
      }
    };

    loadWishlist();
  }, []);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (
    productId: string,
    size: string,
    quantity = 1
  ) => {
    try {
      const response = await fetch(
        "/api/cart",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            productId,
            size,
            quantity,
          }),
        }
      );

      const data =
        (await response.json()) as CartResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add product to cart"
        );
      }

      if (
        data.success &&
        data.cart
      ) {
        setCart(data.cart.items);
      }
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = async (
    productId: string,
    size: string
  ) => {
    try {
      const response = await fetch(
        "/api/cart",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            productId,
            size,
          }),
        }
      );

      const data =
        (await response.json()) as CartResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove cart item"
        );
      }

      if (
        data.success &&
        data.cart
      ) {
        setCart(data.cart.items);
      }
    } catch (error) {
      console.error(
        "REMOVE CART ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = async (
    productId: string,
    size: string,
    quantity: number
  ) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(
          productId,
          size
        );

        return;
      }

      const response = await fetch(
        "/api/cart",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            productId,
            size,
            quantity,
          }),
        }
      );

      const data =
        (await response.json()) as CartResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update quantity"
        );
      }

      if (
        data.success &&
        data.cart
      ) {
        setCart(data.cart.items);
      }
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    try {
      const response = await fetch(
        "/api/cart",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            clear: true,
          }),
        }
      );

      const data =
        (await response.json()) as CartResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to clear cart"
        );
      }

      setCart([]);
    } catch (error) {
      console.error(
        "CLEAR CART ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  const addToWishlist = async (
    productId: string
  ) => {
    try {
      const response = await fetch(
        "/api/wishlist",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            productId,
          }),
        }
      );

      const data =
        (await response.json()) as WishlistResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add wishlist"
        );
      }

      if (
        data.success &&
        data.wishlist
      ) {
        const ids =
          data.wishlist.items.map(
            (item: WishlistItem) =>
              item.productId
          );

        setWishlist(ids);
      }
    } catch (error) {
      console.error(
        "ADD WISHLIST ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist =
    async (
      productId: string
    ) => {
      try {
        const response =
          await fetch(
            "/api/wishlist",
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify({
                productId,
              }),
            }
          );

        const data =
          (await response.json()) as WishlistResponse;

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to remove wishlist item"
          );
        }

        if (
          data.success &&
          data.wishlist
        ) {
          const ids =
            data.wishlist.items.map(
              (
                item: WishlistItem
              ) =>
                item.productId
            );

          setWishlist(ids);
        }
      } catch (error) {
        console.error(
          "REMOVE WISHLIST ERROR:",
          error
        );

        throw error;
      }
    };

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  const isInWishlist = (
    productId: string
  ) => {
    return wishlist.includes(
      productId
    );
  };

  // =====================================================
  // CLEAR WISHLIST
  // =====================================================

  const clearWishlist = async () => {
    try {
      const response =
        await fetch(
          "/api/wishlist",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              clear: true,
            }),
          }
        );

      const data =
        (await response.json()) as WishlistResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to clear wishlist"
        );
      }

      setWishlist([]);
    } catch (error) {
      console.error(
        "CLEAR WISHLIST ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

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

// =====================================================
// HOOK
// =====================================================

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
