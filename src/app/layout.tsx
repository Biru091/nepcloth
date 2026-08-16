import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import { Space_Grotesk } from "next/font/google";
import Footer from "./components/Footer/Footer"
import { CartProvider } from "@/app/context/CartContext"
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "NEPCLOTH",
  description: "Clothing brand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
       <CartProvider>
          {children}
       </CartProvider>
        <Footer/>
        </body>
    </html>
  );
}
