export interface ProductImage {
  data: string;
  contentType: string;
}

export interface Product {
  id: string;

  name: string;

  slug: string;

  type: "printed" | "plain";

  print: string | null;

  printCoverage: "half" | "full" | null;

  price: number;

  trending: boolean;

  newArrival: boolean;

  frontImage: ProductImage | null;

  backImage: ProductImage | null;
}