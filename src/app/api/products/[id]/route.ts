import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/libs/mongodb";
import Product from "@/app/models/Product";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/* =====================================================
   CONVERT MONGODB BINARY IMAGE TO DATA URL
===================================================== */

function convertImageToDataUrl(
  image:
    | {
        data?: unknown;
        contentType?: string;
      }
    | null
    | undefined
): string | null {
  if (!image || !image.data || !image.contentType) {
    return null;
  }

  try {
    let buffer: Buffer;

    const data = image.data as {
      buffer?: Buffer;
      value?: () => Buffer;
    };

    /*
     * Mongoose/MongoDB BSON Binary
     */
    if (typeof data.value === "function") {
      buffer = Buffer.from(data.value());
    } else if (data.buffer) {
      buffer = Buffer.from(data.buffer);
    } else if (Buffer.isBuffer(image.data)) {
      buffer = image.data;
    } else {
      console.error("Unknown image data format:", image.data);
      return null;
    }

    if (buffer.length === 0) {
      return null;
    }

    return `data:${image.contentType};base64,${buffer.toString(
      "base64"
    )}`;
  } catch (error) {
    console.error("IMAGE CONVERSION ERROR:", error);
    return null;
  }
}

/* =====================================================
   GET ONE PRODUCT
===================================================== */

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("REQUESTED PRODUCT ID:", id);

    const product = await Product.findOne({ id }).lean();

    if (!product) {
      console.log("PRODUCT NOT FOUND:", id);

      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    console.log("PRODUCT FOUND:", product.id);

    console.log(
      "FRONT IMAGE EXISTS:",
      !!product.frontImage
    );

    console.log(
      "FRONT IMAGE TYPE:",
      product.frontImage?.contentType
    );

    console.log(
      "FRONT IMAGE RAW:",
      product.frontImage?.data
    );

    console.log(
      "BACK IMAGE EXISTS:",
      !!product.backImage
    );

    /* =================================================
       CONVERT IMAGES
    ================================================= */

    const frontImage = convertImageToDataUrl(
      product.frontImage
    );

    const backImage = convertImageToDataUrl(
      product.backImage
    );

    console.log(
      "FRONT IMAGE URL EXISTS:",
      !!frontImage
    );

    console.log(
      "FRONT IMAGE URL LENGTH:",
      frontImage?.length ?? 0
    );

    console.log(
      "BACK IMAGE URL EXISTS:",
      !!backImage
    );

    console.log(
      "BACK IMAGE URL LENGTH:",
      backImage?.length ?? 0
    );

    /* =================================================
       RESPONSE
    ================================================= */

    const formattedProduct = {
      _id: String(product._id),

      id: product.id,

      name: product.name,

      slug: product.slug,

      type: product.type,

      print: product.print,

      printCoverage: product.printCoverage,

      price: product.price,

      trending: product.trending,

      newArrival: product.newArrival,

      /*
       * IMPORTANT:
       * These are STRINGS now.
       */
      frontImage,

      backImage,

      createdAt: product.createdAt,

      updatedAt: product.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        product: formattedProduct,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

/* =====================================================
   PUT
===================================================== */

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const formData = await request.formData();

    const nameValue = formData.get("name");
    const slugValue = formData.get("slug");
    const typeValue = formData.get("type");
    const printValue = formData.get("print");
    const printCoverageValue =
      formData.get("printCoverage");
    const priceValue = formData.get("price");
    const trendingValue = formData.get("trending");
    const newArrivalValue =
      formData.get("newArrival");

    if (
      typeof nameValue !== "string" ||
      !nameValue.trim()
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
      typeof slugValue !== "string" ||
      !slugValue.trim()
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
      typeValue !== "plain" &&
      typeValue !== "printed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product type",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      typeof priceValue !== "string" ||
      !priceValue.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product price is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const price = Number(priceValue);

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product price",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const existingProduct =
      await Product.findOne({ id });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const updateData: {
      name: string;
      slug: string;
      type: "plain" | "printed";
      print: string | null;
      printCoverage: string | null;
      price: number;
      trending: boolean;
      newArrival: boolean;
      frontImage?: {
        data: Buffer;
        contentType: string;
      };
      backImage?: {
        data: Buffer;
        contentType: string;
      };
    } = {
      name: nameValue.trim(),

      slug: slugValue.trim(),

      type: typeValue,

      print:
        typeValue === "printed" &&
        typeof printValue === "string" &&
        printValue.trim()
          ? printValue.trim()
          : null,

      printCoverage:
        typeValue === "printed" &&
        typeof printCoverageValue === "string" &&
        printCoverageValue.trim()
          ? printCoverageValue.trim()
          : null,

      price,

      trending: trendingValue === "true",

      newArrival:
        newArrivalValue === "true",
    };

    /* FRONT IMAGE */

    const frontImage =
      formData.get("frontImage");

    if (
      frontImage instanceof File &&
      frontImage.size > 0
    ) {
      const arrayBuffer =
        await frontImage.arrayBuffer();

      updateData.frontImage = {
        data: Buffer.from(arrayBuffer),
        contentType:
          frontImage.type ||
          "application/octet-stream",
      };
    }

    /* BACK IMAGE */

    const backImage =
      formData.get("backImage");

    if (
      backImage instanceof File &&
      backImage.size > 0
    ) {
      const arrayBuffer =
        await backImage.arrayBuffer();

      updateData.backImage = {
        data: Buffer.from(arrayBuffer),
        contentType:
          backImage.type ||
          "application/octet-stream",
      };
    }

    const updatedProduct =
      await Product.findOneAndUpdate(
        { id },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const responseProduct = {
      _id: String(updatedProduct._id),

      id: updatedProduct.id,

      name: updatedProduct.name,

      slug: updatedProduct.slug,

      type: updatedProduct.type,

      print: updatedProduct.print,

      printCoverage:
        updatedProduct.printCoverage,

      price: updatedProduct.price,

      trending: updatedProduct.trending,

      newArrival: updatedProduct.newArrival,

      frontImage: convertImageToDataUrl(
        updatedProduct.frontImage
      ),

      backImage: convertImageToDataUrl(
        updatedProduct.backImage
      ),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: responseProduct,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update product",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

/* =====================================================
   DELETE
===================================================== */

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const product =
      await Product.findOneAndDelete({ id });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}