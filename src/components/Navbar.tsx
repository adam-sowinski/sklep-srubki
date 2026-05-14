"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Wrench } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function Navbar() {
  const { openCart, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? totalItems() : 0;

  return (
    <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white shrink-0">
          <Wrench className="h-5 w-5 text-orange-500" />
          <span>
            Sklep<span className="text-orange-500">Śrubki</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {[
            { href: "/sklep", label: "Katalog" },
            { href: "#", label: "O nas" },
            { href: "#", label: "Kontakt" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-1.5 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 rounded transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-orange-500 hover:text-orange-400 hover:bg-zinc-800 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-xs font-medium hidden sm:inline">Koszyk</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </div>

      {/* Technical accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
    </header>
  );
}
