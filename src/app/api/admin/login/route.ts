import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
// POST LOGIN
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // =================================================
    // GET REQUEST DATA
    // =================================================

    const body = await request.json();

    const email = body.email;
    const password = body.password;

    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =================================================
    // GET ENVIRONMENT VARIABLES
    // =================================================

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPassword || !jwtSecret) {
      console.error("ADMIN AUTH ENVIRONMENT VARIABLES ARE MISSING");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // =================================================
    // CHECK EMAIL
    // =================================================

    if (
      email.trim().toLowerCase() !==
      adminEmail.trim().toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const passwordMatches = await bcrypt.compare(
      password,
      adminPassword
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    // =================================================
    // CREATE JWT
    // =================================================

    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      jwtSecret,
      {
        expiresIn: "1d",
      }
    );

    // =================================================
    // CREATE RESPONSE
    // =================================================

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin login successful",
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );

    // =================================================
    // SAVE TOKEN IN HTTP-ONLY COOKIE
    // =================================================

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}