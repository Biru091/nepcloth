import { NextResponse } from "next/server";

import { connectDB } from "@/app/libs/mongodb";
import Order from "@/app/models/Order";

const ADMIN_ORIGIN = "http://localhost:3001";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders: orders.map((order) => ({
          id: String(order._id),

          userId: String(order.userId),

          email: order.email,

          customer: order.customer,

          items: order.items,

          subtotal: order.subtotal,

          shipping: order.shipping,

          total: order.total,

          paymentMethod: order.paymentMethod,

          transactionCode:
            order.transactionCode ?? null,

          paymentScreenshot:
            order.paymentScreenshot ?? null,

          status: order.status,

          paymentStatus:
            order.paymentStatus,

          createdAt: order.createdAt,
        })),
      },
      {
        status: 200,

        headers: {
          "Access-Control-Allow-Origin": ADMIN_ORIGIN,
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("ADMIN GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load orders",
      },
      {
        status: 500,
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,

    headers: {
      "Access-Control-Allow-Origin": ADMIN_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}