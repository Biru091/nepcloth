import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/libs/mongodb";
import User from "@/app/models/User";

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      email,
      password,
    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof password !== "string" ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // CLEAN EMAIL
    // =========================

    const cleanEmail =
      email.trim().toLowerCase();

    // =========================
    // CHECK EXISTING USER
    // =========================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // =========================
    // CREATE USER
    // =========================

    const user =
      await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
      });

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully",

        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create account",
      },
      {
        status: 500,
      }
    );
  }
}