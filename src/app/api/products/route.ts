import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/libs/mongodb";
import Product from "@/app/models/Product";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// -----------------------------
// CORS
// -----------------------------

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// -----------------------------
// GET PRODUCTS
// -----------------------------

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        products,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// -----------------------------
// POST PRODUCT
// -----------------------------

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    // IMPORTANT:
    // File uploads use FormData, NOT request.json()
    const formData = await request.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const slug = formData.get("slug");
    const type = formData.get("type");
    const print = formData.get("print");
    const printCoverage =
      formData.get("printCoverage");
    const price = formData.get("price");
    const trending = formData.get("trending");
    const newArrival = formData.get("newArrival");

    const frontImage = formData.get("frontImage");
    const backImage = formData.get("backImage");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (
      typeof id !== "string" ||
      !id.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      type !== "plain" &&
      type !== "printed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product type must be plain or printed",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      typeof price !== "string" ||
      price.trim() === "" ||
      Number.isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid product price is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // -----------------------------
    // IMAGE VALIDATION
    // -----------------------------

    if (!(frontImage instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Front image is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!(backImage instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Back image is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check that files actually contain data
    if (frontImage.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Front image is empty",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (backImage.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Back image is empty",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // -----------------------------
    // IMAGE TYPE VALIDATION
    // -----------------------------

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedImageTypes.includes(
        frontImage.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Front image must be JPG, PNG, or WEBP",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      !allowedImageTypes.includes(
        backImage.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Back image must be JPG, PNG, or WEBP",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // -----------------------------
    // CHECK PRODUCT ID
    // -----------------------------

    const existingProduct =
      await Product.findOne({ id });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID already exists",
        },
        {
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    // -----------------------------
    // CONVERT FILES TO BUFFER
    // -----------------------------

    const frontImageBuffer = Buffer.from(
      await frontImage.arrayBuffer()
    );

    const backImageBuffer = Buffer.from(
      await backImage.arrayBuffer()
    );

    // -----------------------------
    // CREATE PRODUCT
    // -----------------------------

    const product =
      await Product.create({
        id: id.trim(),

        name: name.trim(),

        slug: slug.trim(),

        type,

        print:
          type === "printed" &&
          typeof print === "string" &&
          print.trim()
            ? print.trim()
            : null,

        printCoverage:
          type === "printed" &&
          typeof printCoverage === "string" &&
          printCoverage.trim()
            ? printCoverage.trim()
            : null,

        price: Number(price),

        trending:
          trending === "true",

        newArrival:
          newArrival === "true",

        frontImage: {
          data: frontImageBuffer,
          contentType: frontImage.type,
        },

        backImage: {
          data: backImageBuffer,
          contentType: backImage.type,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully",
        product,
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create product",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}