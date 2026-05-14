"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/mock-data";
import FilterSidebar, { type Filters } from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

const EMPTY_FILTERS: Filters = {
  mainCategory: null,
  subcategory: null,
  materials: [],
  threadSizes: [],
  special: "all",
};

export default function ShopClient() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.special === "new" && !p.isNew) return false;
      if (filters.special === "promo" && !p.isPromo) return false;
      if (filters.mainCategory && p.mainCategory !== filters.mainCategory) return false;
      if (filters.subcategory && p.subcategory !== filters.subcategory) return false;
      if (filters.materials.length > 0 && (!p.material || !filters.materials.includes(p.material)))
        return false;
      if (filters.threadSizes.length > 0 && (!p.threadSize || !filters.threadSizes.includes(p.threadSize)))
        return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.sku.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [filters, search]);

  const heading =
    filters.special === "new"
      ? "Nowości"
      : filters.special === "promo"
      ? "Promocje"
      : filters.subcategory ?? filters.mainCategory ?? "Katalog produktów";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{heading}</h1>
        <p className="text-sm text-gray-500">
          {filtered.length} z {products.length} produktów
        </p>
      </div>

      <div className="flex gap-6">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <div className="flex-1 min-w-0">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Szukaj produktu, SKU, opisu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Brak produktów pasujących do filtrów</p>
              <p className="text-sm mt-1">Spróbuj zmienić kryteria wyszukiwania</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
