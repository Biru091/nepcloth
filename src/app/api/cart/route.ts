import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import { connectDB } from "@/app/libs/mongodb";

import Cart from "@/app/models/Cart";
import Product from "@/app/models/Product";

// =====================================================
// GET LOGGED-IN USER
// =====================================================

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: string;
    };

    if (!decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch {
    return null;
  }
}

// =====================================================
// NORMALIZE PRODUCT ID
// =====================================================

function normalizeProductId(
  productId: unknown
): string | null {
  if (
    typeof productId !== "string" &&
    typeof productId !== "number"
  ) {
    return null;
  }

  const id = String(productId).trim();

  if (!id) {
    return null;
  }

  return id;
}

// =====================================================
// NORMALIZE SIZE
// =====================================================

function normalizeSize(
  size: unknown
): string | null {
  if (typeof size !== "string") {
    return null;
  }

  const value = size.trim();

  if (!value || value.length > 20) {
    return null;
  }

  return value;
}

// =====================================================
// GET CART
// =====================================================

export async function GET(
  request: NextRequest
) {
  try {
    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // AUTHENTICATION
    // =================================================

    const userId =
      getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // FIND CART
    // =================================================

    let cart =
      await Cart.findOne({
        userId,
      });

    // =================================================
    // CREATE CART IF NOT EXISTS
    // =================================================

    if (!cart) {
      cart =
        await Cart.create({
          userId,
          items: [],
        });
    }

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(
      "GET CART ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load cart",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// ADD TO CART
// =====================================================

export async function POST(
  request: NextRequest
) {
  try {
    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // AUTHENTICATION
    // =================================================

    const userId =
      getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // READ BODY
    // =================================================

    const body =
      await request.json();

    const {
      productId,
      size,
      quantity = 1,
    } = body;

    // =================================================
    // NORMALIZE PRODUCT ID
    // =================================================

    const normalizedProductId =
      normalizeProductId(
        productId
      );

    if (!normalizedProductId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // NORMALIZE SIZE
    // =================================================

    const normalizedSize =
      normalizeSize(size);

    if (!normalizedSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid product size is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE QUANTITY
    // =================================================

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Quantity must be between 1 and 100",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // IMPORTANT:
    // VERIFY PRODUCT EXISTS
    // =================================================

    const product =
      await Product.findOne({
        id: normalizedProductId,
      }).lean();

    // =================================================
    // PRODUCT DOES NOT EXIST
    // =================================================

    if (!product) {
      console.error(
        "ADD TO CART - PRODUCT NOT FOUND:",
        normalizedProductId
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Product is no longer available",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // ALWAYS USE DATABASE PRODUCT ID
    // =================================================

    const finalProductId =
      String(product.id).trim();

    // =================================================
    // FIND CART
    // =================================================

    let cart =
      await Cart.findOne({
        userId,
      });

    // =================================================
    // CREATE NEW CART
    // =================================================

    if (!cart) {
      cart =
        await Cart.create({
          userId,
          items: [
            {
              productId:
                finalProductId,
              size:
                normalizedSize,
              quantity,
            },
          ],
        });

      return NextResponse.json({
        success: true,
        message:
          "Product added to cart",
        cart,
      });
    }

    // =================================================
    // FIND EXISTING ITEM
    // =================================================

    const existingItem =
      cart.items.find(
        (item) =>
          String(
            item.productId
          ).trim() ===
            finalProductId &&
          String(
            item.size
          ).trim() ===
            normalizedSize
      );

    // =================================================
    // ITEM ALREADY EXISTS
    // =================================================

    if (existingItem) {
      const newQuantity =
        Number(
          existingItem.quantity
        ) + quantity;

      if (newQuantity > 100) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum quantity is 100",
          },
          {
            status: 400,
          }
        );
      }

      existingItem.quantity =
        newQuantity;
    }

    // =================================================
    // NEW ITEM
    // =================================================

    else {
      if (cart.items.length >= 50) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Cart cannot contain more than 50 different items",
          },
          {
            status: 400,
          }
        );
      }

      cart.items.push({
        productId:
          finalProductId,
        size:
          normalizedSize,
        quantity,
      });
    }

    // =================================================
    // SAVE CART
    // =================================================

    await cart.save();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,
      message:
        "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(
      "ADD CART ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to add product to cart",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE QUANTITY
// =====================================================

export async function PATCH(
  request: NextRequest
) {
  try {
    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // AUTHENTICATION
    // =================================================

    const userId =
      getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // READ BODY
    // =================================================

    const body =
      await request.json();

    const {
      productId,
      size,
      quantity,
    } = body;

    // =================================================
    // NORMALIZE PRODUCT ID
    // =================================================

    const normalizedProductId =
      normalizeProductId(
        productId
      );

    // =================================================
    // NORMALIZE SIZE
    // =================================================

    const normalizedSize =
      normalizeSize(size);

    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (
      !normalizedProductId ||
      !normalizedSize ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID, size and valid quantity are required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FIND CART
    // =================================================

    const cart =
      await Cart.findOne({
        userId,
      });

    // =================================================
    // CART DOES NOT EXIST
    // =================================================

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cart not found",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // FIND ITEM
    // =================================================

    const item =
      cart.items.find(
        (item) =>
          String(
            item.productId
          ).trim() ===
            normalizedProductId &&
          String(
            item.size
          ).trim() ===
            normalizedSize
      );

    // =================================================
    // ITEM DOES NOT EXIST
    // =================================================

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cart item not found",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // REMOVE ITEM
    // =================================================

    if (quantity <= 0) {
      cart.items =
        cart.items.filter(
          (item) =>
            !(
              String(
                item.productId
              ).trim() ===
                normalizedProductId &&
              String(
                item.size
              ).trim() ===
                normalizedSize
            )
        );
    }

    // =================================================
    // UPDATE QUANTITY
    // =================================================

    else {
      if (quantity > 100) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum quantity is 100",
          },
          {
            status: 400,
          }
        );
      }

      item.quantity =
        quantity;
    }

    // =================================================
    // SAVE
    // =================================================

    await cart.save();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,
      message:
        "Cart updated",
      cart,
    });
  } catch (error) {
    console.error(
      "UPDATE CART ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update cart",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE CART ITEM / CLEAR CART
// =====================================================

export async function DELETE(
  request: NextRequest
) {
  try {
    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // AUTHENTICATION
    // =================================================

    const userId =
      getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // READ BODY
    // =================================================

    const body =
      await request.json();

    const {
      productId,
      size,
      clear,
    } = body;

    // =================================================
    // FIND CART
    // =================================================

    const cart =
      await Cart.findOne({
        userId,
      });

    // =================================================
    // CART DOES NOT EXIST
    // =================================================

    if (!cart) {
      return NextResponse.json({
        success: true,
        message:
          "Cart is already empty",
        cart: {
          items: [],
        },
      });
    }

    // =================================================
    // CLEAR ENTIRE CART
    // =================================================

    if (clear === true) {
      cart.items = [];

      await cart.save();

      return NextResponse.json({
        success: true,
        message:
          "Cart cleared",
        cart,
      });
    }

    // =================================================
    // NORMALIZE INPUT
    // =================================================

    const normalizedProductId =
      normalizeProductId(
        productId
      );

    const normalizedSize =
      normalizeSize(size);

    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (
      !normalizedProductId ||
      !normalizedSize
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID and size are required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // REMOVE ITEM
    // =================================================

    cart.items =
      cart.items.filter(
        (item) =>
          !(
            String(
              item.productId
            ).trim() ===
              normalizedProductId &&
            String(
              item.size
            ).trim() ===
              normalizedSize
          )
      );

    // =================================================
    // SAVE
    // =================================================

    await cart.save();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,
      message:
        "Cart item removed",
      cart,
    });
  } catch (error) {
    console.error(
      "DELETE CART ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update cart",
      },
      {
        status: 500,
      }
    );
  }
}