import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { connectDB } from "@/app/libs/mongodb";
import User from "@/app/models/User";

export async function GET(request: NextRequest) {
  try {
    // =========================
    // JWT SECRET
    // =========================

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        {
          status: 500,
        }
      );
    }

    // =========================
    // GET COOKIE
    // =========================

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // VERIFY JWT
    // =========================

    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    // =========================
    // GET USER ID
    // =========================

    const userId = payload.userId;

    if (
      typeof userId !== "string" ||
      !userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // DATABASE
    // =========================

    await connectDB();

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json(
      {
        success: true,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "AUTH ME ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired session",
      },
      {
        status: 401,
      }
    );
  }
}

