import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/app/libs/mongodb";

import Cart from "@/app/models/Cart";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";

// =====================================================
// TYPES
// =====================================================

interface TokenPayload {
  userId: string;
}

interface PaymentScreenshotData {
  data: string;
  contentType: string;
}

// =====================================================
// CONSTANTS
// =====================================================

const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const SHIPPING_COST = 150;

const FREE_SHIPPING_LIMIT = 3000;

// =====================================================
// GET USER ID FROM JWT
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
    const decoded = jwt.verify(
      token,
      secret
    ) as TokenPayload;

    if (!decoded.userId) {
      return null;
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        decoded.userId
      )
    ) {
      return null;
    }

    return decoded.userId;
  } catch {
    return null;
  }
}

// =====================================================
// BASIC STRING VALIDATION
// =====================================================

function cleanString(
  value: unknown,
  maxLength: number
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  if (cleaned.length > maxLength) {
    return null;
  }

  return cleaned;
}

// =====================================================
// EMAIL VALIDATION
// =====================================================

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =====================================================
// PAYMENT SCREENSHOT VALIDATION
// =====================================================

function validatePaymentScreenshot(
  screenshot: unknown
): screenshot is PaymentScreenshotData {
  if (
    !screenshot ||
    typeof screenshot !== "object"
  ) {
    return false;
  }

  const value =
    screenshot as Partial<PaymentScreenshotData>;

  if (
    typeof value.data !== "string" ||
    typeof value.contentType !== "string"
  ) {
    return false;
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      value.contentType
    )
  ) {
    return false;
  }

  // Data URL should look like:
  // data:image/jpeg;base64,...

  if (
    !value.data.startsWith(
      `data:${value.contentType};base64,`
    )
  ) {
    return false;
  }

  // Approximate decoded size

  const base64Part =
    value.data.split(",")[1] || "";

  const estimatedSize = Math.floor(
    (base64Part.length * 3) / 4
  );

  if (
    estimatedSize >
    MAX_SCREENSHOT_SIZE
  ) {
    return false;
  }

  return true;
}

// =====================================================
// CSRF / ORIGIN CHECK
// =====================================================

function validateOrigin(
  request: NextRequest
): boolean {
  const origin =
    request.headers.get("origin");

  // Browser POST requests normally
  // contain Origin.

  if (!origin) {
    return false;
  }

  try {
    const requestOrigin =
      new URL(origin).origin;

    const expectedOrigin =
      request.nextUrl.origin;

    return (
      requestOrigin ===
      expectedOrigin
    );
  } catch {
    return false;
  }
}

// =====================================================
// POST - CREATE ORDER
// =====================================================

export async function POST(
  request: NextRequest
) {
  try {
    // =================================================
    // ORIGIN CHECK
    // =================================================

    if (!validateOrigin(request)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request origin",
        },
        {
          status: 403,
        }
      );
    }

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
      email,
      customer,
      paymentMethod,
      transactionCode,
      paymentScreenshot,
    } = body;

    // =================================================
    // EMAIL
    // =================================================

    const cleanEmail =
      cleanString(
        email,
        254
      );

    if (
      !cleanEmail ||
      !isValidEmail(cleanEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // CUSTOMER VALIDATION
    // =================================================

    if (
      !customer ||
      typeof customer !== "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer information is required",
        },
        {
          status: 400,
        }
      );
    }

    const firstName =
      cleanString(
        customer.firstName,
        100
      );

    const lastName =
      cleanString(
        customer.lastName,
        100
      );

    const phone =
      cleanString(
        customer.phone,
        30
      );

    const address =
      cleanString(
        customer.address,
        500
      );

    const city =
      cleanString(
        customer.city,
        100
      );

    const postalCode =
      cleanString(
        customer.postalCode,
        20
      );

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !city ||
      !postalCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete delivery information is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // PAYMENT METHOD
    // =================================================

    if (
      paymentMethod !== "cod" &&
      paymentMethod !== "online"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment method",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // ONLINE PAYMENT
    // =================================================

    let finalTransactionCode:
      string | null = null;

    let finalPaymentScreenshot:
      PaymentScreenshotData | null =
      null;

    if (
      paymentMethod === "online"
    ) {
      finalTransactionCode =
        cleanString(
          transactionCode,
          200
        );

      if (!finalTransactionCode) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Transaction code is required",
          },
          {
            status: 400,
          }
        );
      }

      if (
        !validatePaymentScreenshot(
          paymentScreenshot
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid payment screenshot",
          },
          {
            status: 400,
          }
        );
      }

      finalPaymentScreenshot =
        paymentScreenshot;
    }

    // =================================================
    // FIND USER'S CART
    // =================================================

    const cart =
      await Cart.findOne({
        userId,
      });

    if (
      !cart ||
      !cart.items ||
      cart.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your cart is empty",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // PROTECT AGAINST HUGE CARTS
    // =================================================

    if (
      cart.items.length > 50
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many items in cart",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // GET PRODUCT IDs FROM CART
    // =================================================

    const productIds =
      cart.items.map(
        (item) =>
          String(
            item.productId
          ).trim()
      );

    // =================================================
    // GET REAL PRODUCTS FROM DATABASE
    // =================================================

    // IMPORTANT:
    // We get prices from MongoDB.
    //
    // We DO NOT trust frontend prices.
    //
    // =================================================

    const products =
      await Product.find({
        id: {
          $in: productIds,
        },
      }).lean();

    // =================================================
    // MAKE PRODUCT MAP
    // =================================================

    const productMap =
      new Map(
        products.map(
          (product) => [
            String(
              product.id
            ).trim(),
            product,
          ]
        )
      );

    // =================================================
    // BUILD SECURE ORDER ITEMS
    // =================================================

    const orderItems: Array<{
      productId: string;
      name: string;
      price: number;
      size: string;
      quantity: number;
    }> = [];

    for (
      const cartItem of cart.items
    ) {
      const cartProductId =
        String(
          cartItem.productId
        ).trim();

      const product =
        productMap.get(
          cartProductId
        );

      // =================================================
      // PRODUCT WAS DELETED
      // =================================================

      if (!product) {
        console.error(
          "PRODUCT NOT FOUND:",
          cartProductId
        );

        console.error(
          "AVAILABLE PRODUCT IDS:",
          products.map(
            (p) =>
              String(p.id)
          )
        );

        return NextResponse.json(
          {
            success: false,
            message:
              `Product ${cartProductId} is no longer available. Please remove it from your cart and add the product again.`,
          },
          {
            status: 400,
          }
        );
      }

      // =================================================
      // QUANTITY VALIDATION
      // =================================================

      const quantity =
        Number(
          cartItem.quantity
        );

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product quantity",
          },
          {
            status: 400,
          }
        );
      }

      // =================================================
      // SIZE VALIDATION
      // =================================================

      const size =
        cleanString(
          cartItem.size,
          20
        );

      if (!size) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product size",
          },
          {
            status: 400,
          }
        );
      }

      // =================================================
      // REAL DATABASE PRICE
      // =================================================

      const price =
        Number(
          product.price
        );

      if (
        !Number.isFinite(
          price
        ) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product price",
          },
          {
            status: 500,
          }
        );
      }

      // =================================================
      // CREATE SNAPSHOT
      // =================================================

      orderItems.push({
        productId:
          String(
            product.id
          ),

        name:
          String(
            product.name
          ),

        // IMPORTANT:
        // Price comes from DB

        price,

        size,

        quantity,
      });
    }

    // =================================================
    // CALCULATE SUBTOTAL ON SERVER
    // =================================================

    const subtotal =
      orderItems.reduce(
        (
          total,
          item
        ) => {
          return (
            total +
            item.price *
              item.quantity
          );
        },
        0
      );

    // =================================================
    // CALCULATE SHIPPING ON SERVER
    // =================================================

    const shipping =
      subtotal >=
      FREE_SHIPPING_LIMIT
        ? 0
        : SHIPPING_COST;

    // =================================================
    // CALCULATE TOTAL ON SERVER
    // =================================================

    const total =
      subtotal +
      shipping;

    // =================================================
    // CREATE ORDER
    // =================================================

    const order =
      await Order.create({
        // Comes from JWT
        // NOT frontend

        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        email:
          cleanEmail.toLowerCase(),

        customer: {
          firstName,
          lastName,
          phone,
          address,
          city,
          postalCode,
        },

        // Comes from DB cart + DB products

        items:
          orderItems,

        // Calculated on server

        subtotal,

        shipping,

        total,

        paymentMethod,

        transactionCode:
          finalTransactionCode,

        paymentScreenshot:
          finalPaymentScreenshot,

        status:
          "pending",

        paymentStatus:
          "pending",
      });

    // =================================================
    // CLEAR USER'S CART
    // =================================================

    await Cart.updateOne(
      {
        userId,
      },
      {
        $set: {
          items: [],
        },
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Order placed successfully",

        order: {
          id: String(
            order._id
          ),

          userId: String(
            order.userId
          ),

          email:
            order.email,

          customer:
            order.customer,

          items:
            order.items,

          subtotal:
            order.subtotal,

          shipping:
            order.shipping,

          total:
            order.total,

          paymentMethod:
            order.paymentMethod,

          status:
            order.status,

          paymentStatus:
            order.paymentStatus,

          createdAt:
            order.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "========== CREATE ORDER ERROR =========="
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to place order",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// GET - USER ORDERS
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
          message:
            "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // GET USER ORDERS
    // =================================================

    const orders =
      await Order.find({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      orders:
        orders.map(
          (order) => ({
            id: String(
              order._id
            ),

            email:
              order.email,

            customer:
              order.customer,

            items:
              order.items,

            subtotal:
              order.subtotal,

            shipping:
              order.shipping,

            total:
              order.total,

            paymentMethod:
              order.paymentMethod,

            status:
              order.status,

            paymentStatus:
              order.paymentStatus,

            createdAt:
              order.createdAt,
          })
        ),
    });
  } catch (error) {
    console.error(
      "========== GET ORDERS ERROR =========="
    );

    console.error(error);

    console.error(
      "======================================"
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to get orders",
      },
      {
        status: 500,
      }
    );
  }
}