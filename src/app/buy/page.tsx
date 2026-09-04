import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

import BuyClient from "./BuyClient";

export default async function BuyPage() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login?redirect=/buy");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  try {
    jwt.verify(token, secret);
  } catch {
    redirect("/login?redirect=/buy");
  }

  return <BuyClient />;
}