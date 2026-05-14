import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Wrench className="h-5 w-5 text-orange-500" />
              Sklep<span className="text-orange-500">Śrubki</span>
            </div>
            <p className="text-sm">
              Profesjonalne złączniki dla przemysłu i budownictwa. Szybka dostawa,
              konkurencyjne ceny.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Asortyment</h4>
            <ul className="space-y-1 text-sm">
              <li>Śruby i wkręty</li>
              <li>Nakrętki</li>
              <li>Podkładki</li>
              <li>Kotwy i kołki</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Kontakt</h4>
            <ul className="space-y-1 text-sm">
              <li>kontakt@sklepsrubki.pl</li>
              <li>+48 123 456 789</li>
              <li>Pn–Pt: 8:00–17:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} SklepŚrubki. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
