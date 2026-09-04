import { connectDB } from "@/app/libs/mongodb"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully!",
    });
  } catch (error) {
    console.error("MONGODB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}