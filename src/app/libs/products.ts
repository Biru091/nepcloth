import { connectDB } from "@/app/libs/mongodb";
import Product from "@/app/models/Product";

type LeanImage = {
  data: Buffer | Uint8Array | { buffer: Uint8Array };
  contentType: string;
};

type LeanProduct = {
  id: string;
  name: string;
  slug: string;
  type: "plain" | "printed";
  print: string | null;
  printCoverage: string | null;
  price: number;
  trending: boolean;
  newArrival: boolean;
  frontImage: LeanImage | null;
};

function imageToBase64(data: LeanImage["data"]): string {
  if (Buffer.isBuffer(data)) {
    return data.toString("base64");
  }

  if (data instanceof Uint8Array) {
    return Buffer.from(data).toString("base64");
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "buffer" in data
  ) {
    return Buffer.from(data.buffer).toString("base64");
  }

  throw new Error("Unsupported image data format");
}

function serializeProduct(product: LeanProduct) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    type: product.type,
    print: product.print,
    printCoverage: product.printCoverage,
    price: product.price,
    trending: product.trending,
    newArrival: product.newArrival,

    frontImage: product.frontImage
      ? {
          data: imageToBase64(product.frontImage.data),
          contentType: product.frontImage.contentType,
        }
      : null,
  };
}

export async function getTrendingProducts() {
  await connectDB();

  const products = await Product.find({ trending: true })
    .select(
      "id name slug type print printCoverage price trending newArrival frontImage"
    )
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return products.map((product) =>
    serializeProduct(product as unknown as LeanProduct)
  );
}

export async function getNewArrivalProducts() {
  await connectDB();

  const products = await Product.find({ newArrival: true })
    .select(
      "id name slug type print printCoverage price trending newArrival frontImage"
    )
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return products.map((product) =>
    serializeProduct(product as unknown as LeanProduct)
  );
}

export async function getAllProducts() {
  await connectDB();

  const products = await Product.find()
    .select(
      "id name slug type print printCoverage price trending newArrival frontImage"
    )
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return products.map((product) =>
    serializeProduct(product as unknown as LeanProduct)
  );
}