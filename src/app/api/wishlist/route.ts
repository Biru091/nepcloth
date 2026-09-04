import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/app/libs/mongodb";
import Wishlist from "@/app/models/Wishlist";

// =========================
// GET USER ID FROM JWT
// =========================

function getUserId(request: NextRequest) {
  const token =
    request.cookies.get("auth_token")?.value;

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
    ) as {
      userId: string;
    };

    return decoded.userId;
  } catch (error) {
    console.error("JWT ERROR:", error);
    return null;
  }
}

// =========================
// GET WISHLIST
// =========================

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const userId = getUserId(request);

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

    const wishlist =
      await Wishlist.findOne({
        userId,
      }).lean();

    return NextResponse.json({
      success: true,

      wishlist: wishlist || {
        userId,
        items: [],
      },
    });
  } catch (error) {
    console.error(
      "GET WISHLIST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get wishlist",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// ADD TO WISHLIST
// =========================

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const userId = getUserId(request);

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

    const body = await request.json();

    const { productId } = body;

    // =========================
    // VALIDATION
    // =========================

    if (
      typeof productId !== "string" ||
      !productId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const cleanProductId =
      productId.trim();

    // =========================
    // FIND USER WISHLIST
    // =========================

    let wishlist =
      await Wishlist.findOne({
        userId,
      });

    // =========================
    // CREATE WISHLIST
    // =========================

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          userId,
          items: [
            {
              productId: cleanProductId,
            },
          ],
        });

      return NextResponse.json(
        {
          success: true,
          message:
            "Product added to wishlist",
          wishlist,
        },
        {
          status: 201,
        }
      );
    }

    // =========================
    // CHECK DUPLICATE
    // =========================

    const alreadyExists =
      wishlist.items.some(
        (item) =>
          item.productId ===
          cleanProductId
      );

    if (alreadyExists) {
      return NextResponse.json({
        success: true,
        message:
          "Product already in wishlist",
        wishlist,
      });
    }

    // =========================
    // ADD PRODUCT
    // =========================

    wishlist.items.push({
      productId: cleanProductId,
    });

    await wishlist.save();

    return NextResponse.json({
      success: true,
      message:
        "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error(
      "ADD WISHLIST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to add product to wishlist",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// DELETE WISHLIST ITEM
// =========================

export async function DELETE(
  request: NextRequest
) {
  try {
    await connectDB();

    const userId = getUserId(request);

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

    const body = await request.json();

    const { productId } = body;

    // =========================
    // CLEAR ENTIRE WISHLIST
    // =========================

    if (body.clear === true) {
      const wishlist =
        await Wishlist.findOneAndUpdate(
          { userId },
          {
            $set: {
              items: [],
            },
          },
          {
            new: true,
          }
        );

      return NextResponse.json({
        success: true,
        message:
          "Wishlist cleared",
        wishlist: wishlist || {
          userId,
          items: [],
        },
      });
    }

    // =========================
    // VALIDATION
    // =========================

    if (
      typeof productId !== "string" ||
      !productId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // FIND WISHLIST
    // =========================

    const wishlist =
      await Wishlist.findOne({
        userId,
      });

    if (!wishlist) {
      return NextResponse.json({
        success: true,
        message:
          "Wishlist is already empty",
        wishlist: {
          userId,
          items: [],
        },
      });
    }

    // =========================
    // REMOVE PRODUCT
    // =========================

    wishlist.items =
      wishlist.items.filter(
        (item) =>
          item.productId !==
          productId.trim()
      );

    await wishlist.save();

    return NextResponse.json({
      success: true,
      message:
        "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error(
      "DELETE WISHLIST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to remove wishlist item",
      },
      {
        status: 500,
      }
    );
  }
}