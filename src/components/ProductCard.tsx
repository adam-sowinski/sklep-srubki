"use client";

import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/mock-data";
import { getEffectivePrice } from "@/lib/mock-data";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const effectivePrice = getEffectivePrice(product);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col relative">
      {/* Badges */}
      {(product.isNew || product.isPromo) && (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white uppercase tracking-wide">
              Nowość
            </span>
          )}
          {product.isPromo && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white uppercase tracking-wide">
              Promocja
            </span>
          )}
        </div>
      )}

      <div className="bg-gray-50 h-36 flex items-center justify-center border-b border-gray-100">
        <Package className="h-14 w-14 text-gray-300" />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
            {product.subcategory !== product.mainCategory
              ? product.subcategory
              : product.mainCategory}
          </p>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="font-mono text-[10px] text-gray-400 mt-0.5 tracking-wide">
            {product.sku}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {product.material && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded border bg-gray-50 text-gray-600 border-gray-200">
              {product.material}
            </span>
          )}
          {product.threadSize && (
            <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border bg-orange-50 text-orange-700 border-orange-200">
              {product.threadSize}
            </span>
          )}
          {product.length && (
            <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border bg-gray-50 text-gray-600 border-gray-200">
              {product.length}mm
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-orange-500">
                {effectivePrice.toFixed(2)}{" "}
                <span className="text-xs font-normal text-gray-500">zł</span>
              </p>
              {product.isPromo && product.promoPrice != null && (
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toFixed(2)} zł
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              paczka {product.packSize} szt.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 px-3"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Do koszyka
          </Button>
        </div>
      </div>
    </div>
  );
}
