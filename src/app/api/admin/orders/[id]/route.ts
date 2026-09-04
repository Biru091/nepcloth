import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/app/libs/mongodb";
import Order from "@/app/models/Order";

const ADMIN_ORIGIN = "http://localhost:3001";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": ADMIN_ORIGIN,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    const allowedStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": ADMIN_ORIGIN,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": ADMIN_ORIGIN,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: {
          id: String(updatedOrder._id),
          userId: String(updatedOrder.userId),
          email: updatedOrder.email,
          customer: updatedOrder.customer,
          items: updatedOrder.items,
          subtotal: updatedOrder.subtotal,
          shipping: updatedOrder.shipping,
          total: updatedOrder.total,
          paymentMethod: updatedOrder.paymentMethod,
          transactionCode:
            updatedOrder.transactionCode ?? null,
          paymentScreenshot:
            updatedOrder.paymentScreenshot ?? null,
          status: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
          createdAt: updatedOrder.createdAt,
        },
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
    console.error(
      "ADMIN UPDATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": ADMIN_ORIGIN,
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ADMIN_ORIGIN,
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}