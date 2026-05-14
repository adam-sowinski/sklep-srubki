import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { products, CATEGORY_TREE } from "@/lib/mock-data";

const categorySummary = CATEGORY_TREE.map((cat, idx) => ({
  ...cat,
  count: products.filter((p) => p.mainCategory === cat.name).length,
  code: `CAT-${String(idx + 1).padStart(2, "0")}`,
})).filter((c) => c.count > 0);

const SPECS = [
  { code: "QA-001", value: "DIN / ISO", label: "Certyfikowana jakość", desc: "Stal nierdzewna A2/A4, ocynk, mosiądz. Produkty zgodne z normami europejskimi." },
  { code: "CAT-ALL", value: `${products.length}+ REF`, label: "Szeroki asortyment", desc: "Śruby, nakrętki, podkładki, kotwy, wiertła, narzędzia — wszystko w jednym miejscu." },
  { code: "DEL-EXP", value: "24–48H", label: "Szybka dostawa", desc: "Zamówienia złożone do 14:00 wysyłamy tego samego dnia roboczego." },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200 relative overflow-hidden">
        {/* Corner brackets */}
        <div className="absolute top-5 left-5 w-7 h-7 border-l-2 border-t-2 border-orange-400/60" />
        <div className="absolute top-5 right-5 w-7 h-7 border-r-2 border-t-2 border-orange-400/60" />
        <div className="absolute bottom-5 left-5 w-7 h-7 border-l-2 border-b-2 border-orange-400/60" />
        <div className="absolute bottom-5 right-5 w-7 h-7 border-r-2 border-b-2 border-orange-400/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Technical badge */}
          <div className="inline-flex items-center gap-2 border border-orange-300 bg-orange-50 text-orange-600 text-[11px] font-mono px-3 py-1 mb-6 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            REF-CATALOG // REV.{new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, "0")}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 mb-5 tracking-tight leading-tight">
            Wszystko, czego potrzebujesz
            <br />
            <span className="text-orange-500">przykręcić na miejscu</span>
          </h1>

          <p className="text-base text-zinc-500 max-w-xl mx-auto mb-4">
            Śruby, nakrętki, podkładki i kotwy w szerokim wyborze materiałów i rozmiarów.
            Dla profesjonalistów i majsterkowiczów.
          </p>

          {/* Inline technical stats */}
          <div className="flex items-center justify-center gap-5 mb-8 text-[11px] font-mono text-zinc-400">
            <span>
              <span className="text-orange-500 font-bold">{products.length}</span> POZYCJI
            </span>
            <span className="text-zinc-200">·</span>
            <span>
              <span className="text-orange-500 font-bold">{categorySummary.length}</span> KATEGORII
            </span>
            <span className="text-zinc-200">·</span>
            <span>
              DOSTAWA <span className="text-orange-500 font-bold">24H</span>
            </span>
          </div>

          <Link
            href="/sklep"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 h-12 text-sm transition-colors uppercase tracking-wide"
          >
            Przeglądaj katalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-zinc-800">
            {[
              { label: "REFERENCJI W MAGAZYNIE", value: "500+" },
              { label: "KATEGORII PRODUKTÓW", value: String(categorySummary.length) },
              { label: "WYSYŁKA TEGO SAMEGO DNIA", value: "DO 14:00" },
            ].map(({ label, value }) => (
              <div key={label} className="py-5 px-6 text-center">
                <p className="font-mono text-orange-500 text-xl font-bold">{value}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Kategorie produktów</h2>
            <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
              CATALOG.INDEX / {categorySummary.length} SECTIONS
            </p>
          </div>
          <Link
            href="/sklep"
            className="text-xs text-orange-500 hover:text-orange-600 font-mono uppercase tracking-wide flex items-center gap-1 transition-colors"
          >
            Wszystkie <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categorySummary.map((cat) => (
            <Link
              key={cat.name}
              href="/sklep"
              className="bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-colors p-4 group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-[10px] text-zinc-400 group-hover:text-orange-400 transition-colors">
                  {cat.code}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-800 leading-tight mb-1.5 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </h3>
              <p className="font-mono text-[11px] text-zinc-400">
                <span className="text-orange-500 font-bold">{cat.count}</span> poz.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Specs table ── */}
      <section className="bg-zinc-50 border-t border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-5">
            SPECYFIKACJA USŁUGI // SERVICE.SPEC
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border border-gray-200">
            {SPECS.map(({ code, value, label, desc }) => (
              <div key={code} className="bg-white p-6">
                <p className="font-mono text-[10px] text-zinc-400 uppercase mb-3">{code}</p>
                <p className="font-mono text-2xl font-bold text-orange-500 mb-1">{value}</p>
                <h3 className="font-semibold text-zinc-900 text-sm mb-1">{label}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-900 py-14 relative overflow-hidden">
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-orange-500/30" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-orange-500/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-500/30" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-500/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-3">
            SYSTEM.HARDWARE // SKLEPSRUBKI.PL
          </p>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ponad 500 referencji w magazynie
          </h2>
          <p className="text-zinc-400 mb-7 max-w-lg mx-auto text-sm leading-relaxed">
            Od <span className="font-mono text-orange-400">M3</span> do{" "}
            <span className="font-mono text-orange-400">M12</span>, od stali nierdzewnej po mosiądz
            — znajdź dokładnie to, czego szukasz.
          </p>
          <Link
            href="/sklep"
            className="inline-flex items-center gap-2 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-bold px-8 h-11 text-sm transition-colors uppercase tracking-wide"
          >
            Przeglądaj katalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
