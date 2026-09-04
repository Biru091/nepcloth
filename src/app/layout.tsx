import type { Metadata } from "next";

import "./globals.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import { Space_Grotesk } from "next/font/google";

import { CartProvider } from "@/app/context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEPCLOTH",
  description: "Clothing brand.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        <AuthProvider>
          <Navbar />

          <CartProvider>
            {children}
          </CartProvider>

          <Footer />
        </AuthProvider>

      </body>
    </html>
  );
}