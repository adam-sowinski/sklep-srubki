"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_TREE, MATERIALS, THREAD_SIZES } from "@/lib/mock-data";
import { ChevronRight, X, Sparkles, Tag } from "lucide-react";

export type Filters = {
  mainCategory: string | null;
  subcategory: string | null;
  materials: string[];
  threadSizes: string[];
  special: "all" | "new" | "promo";
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() =>
    filters.mainCategory ? [filters.mainCategory] : []
  );

  const hasActiveFilters =
    filters.mainCategory !== null ||
    filters.subcategory !== null ||
    filters.materials.length > 0 ||
    filters.threadSizes.length > 0 ||
    filters.special !== "all";

  const reset = () => {
    onChange({ mainCategory: null, subcategory: null, materials: [], threadSizes: [], special: "all" });
    setExpandedCategories([]);
  };

  function handleMainCategoryClick(catName: string, hasSubcats: boolean) {
    const isSame = filters.mainCategory === catName;
    if (isSame && !hasSubcats) {
      onChange({ ...filters, mainCategory: null, subcategory: null });
      setExpandedCategories((prev) => prev.filter((c) => c !== catName));
      return;
    }
    onChange({ ...filters, mainCategory: catName, subcategory: null });
    setExpandedCategories((prev) =>
      prev.includes(catName) && isSame
        ? prev.filter((c) => c !== catName)
        : [...prev.filter((c) => c !== catName), catName]
    );
  }

  function handleSubcategoryClick(subcat: string) {
    const isSame = filters.subcategory === subcat;
    onChange({ ...filters, subcategory: isSame ? null : subcat });
  }

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 text-sm">Filtry</h2>
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600"
            >
              <X className="h-3 w-3" />
              Wyczyść
            </button>
          )}
        </div>

        {/* Nowości / Promocje */}
        <div className="flex gap-1.5 mb-4">
          <button
            onClick={() => onChange({ ...filters, special: filters.special === "new" ? "all" : "new" })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors flex-1 justify-center ${
              filters.special === "new"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Nowości
          </button>
          <button
            onClick={() => onChange({ ...filters, special: filters.special === "promo" ? "all" : "promo" })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors flex-1 justify-center ${
              filters.special === "promo"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-600"
            }`}
          >
            <Tag className="h-3 w-3" />
            Promocje
          </button>
        </div>

        <Separator className="mb-3" />

        {/* Category tree */}
        <section className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Kategoria
          </h3>
          <div className="space-y-0.5">
            {CATEGORY_TREE.map((cat) => {
              const hasSubcats = !!cat.subcategories?.length;
              const isExpanded = expandedCategories.includes(cat.name);
              const isSelected = filters.mainCategory === cat.name;

              return (
                <div key={cat.name}>
                  <button
                    onClick={() => handleMainCategoryClick(cat.name, hasSubcats)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                    }`}
                  >
                    <span className="leading-tight">{cat.name}</span>
                    {hasSubcats && (
                      <ChevronRight
                        className={`h-3 w-3 flex-shrink-0 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </button>

                  {hasSubcats && isExpanded && (
                    <div className="ml-3 mt-0.5 mb-1 border-l border-gray-100 pl-2 space-y-0.5">
                      {cat.subcategories!.map((sub) => {
                        const isSubSelected = filters.subcategory === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => handleSubcategoryClick(sub)}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                              isSubSelected
                                ? "text-orange-600 font-medium bg-orange-50"
                                : "text-gray-500 hover:text-orange-500 hover:bg-gray-50"
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Separator className="mb-3" />

        {/* Thread sizes */}
        <section className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Rozmiar gwintu
          </h3>
          <div className="flex flex-wrap gap-1">
            {THREAD_SIZES.map((size) => (
              <button
                key={size}
                onClick={() =>
                  onChange({ ...filters, threadSizes: toggle(filters.threadSizes, size) })
                }
                className={`px-2 py-0.5 text-xs font-mono font-medium rounded border transition-colors ${
                  filters.threadSizes.includes(size)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <Separator className="mb-3" />

        {/* Materials */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Materiał
          </h3>
          <div className="space-y-1.5">
            {MATERIALS.map((mat) => (
              <label key={mat} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.materials.includes(mat)}
                  onCheckedChange={() =>
                    onChange({ ...filters, materials: toggle(filters.materials, mat) })
                  }
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 h-3.5 w-3.5"
                />
                <span className="text-xs text-gray-700 group-hover:text-orange-500 transition-colors leading-tight">
                  {mat}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
