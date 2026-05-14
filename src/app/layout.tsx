import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "SklepŚrubki — Złączniki i Śruby",
  description:
    "Profesjonalny sklep z śrubami, nakrętkami, podkładkami i kotwami. Stalowe, nierdzewne, mosiężne. Szybka dostawa.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${inter.className} ${robotoMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <Navbar />
        <CartSheet />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
