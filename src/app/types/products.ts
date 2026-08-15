
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
}