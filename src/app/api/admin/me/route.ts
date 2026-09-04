import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

// =====================================================
// OPTIONS
// =====================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// =====================================================
// CHECK ADMIN
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "Not authenticated",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "Server configuration error",
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const decoded = jwt.verify(token, jwtSecret);

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        admin: decoded,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        message: "Invalid or expired token",
      },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }
}