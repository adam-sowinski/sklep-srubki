import Link from "next/link";
import { ArrowRight, Shield, Truck, Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Package,
    title: "Szeroki asortyment",
    desc: "Śruby, nakrętki, podkładki, kotwy — wszystko w jednym miejscu.",
  },
  {
    icon: Shield,
    title: "Certyfikowana jakość",
    desc: "Produkty zgodne z normami DIN/ISO. Stal nierdzewna A2/A4, ocynk, mosiądz.",
  },
  {
    icon: Truck,
    title: "Szybka dostawa",
    desc: "Zamówienia złożone do 14:00 wysyłamy tego samego dnia.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-orange-200">
            Profesjonalne złączniki
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
            Wszystko, czego potrzebujesz
            <br />
            <span className="text-orange-500">przykręcić na miejscu</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Śruby, nakrętki, podkładki i kotwy w szerokim wyborze materiałów i rozmiarów.
            Dla profesjonalistów i majsterkowiczów.
          </p>
          <Link
            href="/sklep"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 h-12 text-base"
            )}
          >
            Przejdź do sklepu <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-gray-200 p-6 flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-orange-500 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ponad 500 referencji w magazynie
          </h2>
          <p className="text-orange-100 mb-7 max-w-lg mx-auto">
            Od M3 do M12, od stali nierdzewnej po mosiądz — znajdź dokładnie to,
            czego szukasz.
          </p>
          <Link
            href="/sklep"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white text-orange-500 bg-white hover:bg-orange-50 font-semibold px-8 h-11"
            )}
          >
            Przeglądaj katalog
          </Link>
        </div>
      </section>
    </>
  );
}
