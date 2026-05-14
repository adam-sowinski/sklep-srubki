"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export default function CartSheet() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, totalPrice } =
    useCartStore();

  const total = totalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            Koszyk ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <ShoppingCart className="h-12 w-12" />
            <p className="text-sm">Koszyk jest pusty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="font-mono text-[10px] text-gray-400 tracking-wide">
                      {product.sku}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.subcategory} · paczka {product.packSize} szt.
                    </p>
                    <p className="text-sm font-bold text-orange-500 mt-0.5">
                      {((product.isPromo && product.promoPrice != null ? product.promoPrice : product.price) * quantity).toFixed(2)} zł
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1)
                        }
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Suma</span>
                <span className="text-xl font-bold text-gray-900">
                  {total.toFixed(2)} zł
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Ceny netto. Dostawa obliczana przy kasie.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 flex items-center justify-center gap-2 text-sm transition-colors uppercase tracking-wide"
              >
                Przejdź do kasy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
