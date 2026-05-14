"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Building2,
  Truck,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { getEffectivePrice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  paymentMethod: "card" | "transfer" | "cod";
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  zipCode: "",
  city: "",
  paymentMethod: "card",
};

const PAYMENT_METHODS = [
  {
    id: "card" as const,
    label: "Karta płatnicza",
    icon: CreditCard,
    desc: "Visa, Mastercard, BLIK — płatność natychmiastowa",
  },
  {
    id: "transfer" as const,
    label: "Przelew bankowy",
    icon: Building2,
    desc: "Wysyłka po zaksięgowaniu · 1–2 dni robocze",
  },
  {
    id: "cod" as const,
    label: "Płatność przy odbiorze",
    icon: Truck,
    desc: "Dostępna dla zamówień do 500 zł · +5 zł obsługi",
  },
];

function validate(form: FormData): FormErrors {
  const e: FormErrors = {};
  if (!form.firstName.trim()) e.firstName = "Pole wymagane";
  if (!form.lastName.trim()) e.lastName = "Pole wymagane";
  if (!form.email.trim() || !form.email.includes("@")) e.email = "Podaj prawidłowy adres e-mail";
  if (!form.address.trim()) e.address = "Pole wymagane";
  if (!form.city.trim()) e.city = "Pole wymagane";
  if (!/^\d{2}-\d{3}$/.test(form.zipCode)) e.zipCode = "Format: 00-000";
  return e;
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function Field({ label, error, className, ...props }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1"
      >
        {label}
      </label>
      <input
        className={cn(
          "w-full h-9 px-3 border text-sm bg-white rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors font-sans",
          error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-gray-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-red-500 mt-0.5 font-mono">{error}</p>
      )}
    </div>
  );
}

function SectionLabel({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] text-orange-500 border border-orange-300 bg-orange-50 px-2 py-0.5 leading-tight">
        {num}
      </span>
      <div>
        <h2 className="font-semibold text-zinc-900 text-sm">{title}</h2>
        <p className="text-xs text-zinc-400">{sub}</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [orderNumber] = useState(
    () => `ORD-${Date.now().toString(36).toUpperCase().slice(-8)}`
  );

  const subtotal = totalPrice();
  const shipping = subtotal > 200 ? 0 : 14.99;
  const codFee = form.paymentMethod === "cod" ? 5 : 0;
  const total = subtotal + shipping + codFee;

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleZipCode(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 5);
    update("zipCode", digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError(null);

    const now = new Date();
    const createdAt = `${now.toISOString().slice(0, 10)} · ${now.toTimeString().slice(0, 8)}`;

    const payload = {
      orderNumber,
      createdAt,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      address: form.address,
      zipCode: form.zipCode,
      city: form.city,
      paymentMethod: form.paymentMethod,
      items: items.map(({ product, quantity }) => ({
        name: product.name,
        sku: product.sku,
        quantity,
        price: product.isPromo && product.promoPrice != null ? product.promoPrice : product.price,
        packSize: product.packSize,
      })),
      subtotal,
      shipping,
      codFee,
      total,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Nieznany błąd");
      }

      clearCart();
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Nie udało się złożyć zamówienia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Empty cart ── */
  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-gray-200 p-12 relative">
          <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-orange-300" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-orange-300" />
          <ShoppingCart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Koszyk jest pusty</h1>
          <p className="text-sm text-zinc-500 mb-7">
            Dodaj produkty do koszyka, aby przejść do realizacji zamówienia.
          </p>
          <Link
            href="/sklep"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Przejdź do sklepu
          </Link>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-gray-200 p-12 relative">
          <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-emerald-400" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-emerald-400" />

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
            STATUS // ZAMÓWIENIE PRZYJĘTE
          </p>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Zamówienie złożone</h1>
          <p className="font-mono text-sm text-orange-500 font-bold mb-1">{orderNumber}</p>
          <p className="text-xs text-zinc-400 font-mono mb-6">
            {new Date().toISOString().slice(0, 10)} · {new Date().toTimeString().slice(0, 8)}
          </p>
          <p className="text-sm text-zinc-500 mb-2">
            Potwierdzenie zostanie wysłane na adres{" "}
            <span className="font-semibold text-zinc-700">{form.email}</span>.
          </p>
          <p className="text-sm text-zinc-500 mb-8">
            Przewidywany czas dostawy:{" "}
            <span className="font-mono text-orange-500">2–3 DNI ROBOCZE</span>
          </p>
          <Link
            href="/sklep"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do sklepu
          </Link>
        </div>
      </div>
    );
  }

  /* ── Checkout form ── */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/sklep"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-orange-500 transition-colors mb-3 font-mono uppercase tracking-wide"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          BACK / SKLEP
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Realizacja zamówienia</h1>
        <p className="font-mono text-[11px] text-zinc-400 mt-0.5 uppercase tracking-wider">
          CHECKOUT · {items.length} POZYCJ{items.length === 1 ? "A" : items.length < 5 ? "E" : "I"} · KOSZYK
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ─── LEFT: Form ─── */}
          <div className="space-y-6">

            {/* Shipping details */}
            <section className="bg-white border border-gray-200 p-6 relative">
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-r border-t border-gray-200" />
              <SectionLabel
                num="01"
                title="Dane dostawy"
                sub="Adres, na który zostanie wysłane zamówienie"
              />

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    id="firstName"
                    label="Imię"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    error={errors.firstName}
                    placeholder="Jan"
                    autoComplete="given-name"
                  />
                  <Field
                    id="lastName"
                    label="Nazwisko"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    error={errors.lastName}
                    placeholder="Kowalski"
                    autoComplete="family-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    id="email"
                    label="Adres e-mail"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    error={errors.email}
                    placeholder="jan@firma.pl"
                    autoComplete="email"
                  />
                  <Field
                    id="phone"
                    label="Telefon (opcjonalnie)"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    error={errors.phone}
                    placeholder="+48 600 000 000"
                    autoComplete="tel"
                  />
                </div>
                <Field
                  id="address"
                  label="Ulica i numer"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  error={errors.address}
                  placeholder="ul. Przemysłowa 12/34"
                  autoComplete="street-address"
                />
                <div className="grid grid-cols-[130px_1fr] gap-3">
                  <Field
                    id="zipCode"
                    label="Kod pocztowy"
                    value={form.zipCode}
                    onChange={(e) => handleZipCode(e.target.value)}
                    error={errors.zipCode}
                    placeholder="00-000"
                    autoComplete="postal-code"
                    className="font-mono tracking-widest"
                  />
                  <Field
                    id="city"
                    label="Miasto"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    error={errors.city}
                    placeholder="Warszawa"
                    autoComplete="address-level2"
                  />
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="bg-white border border-gray-200 p-6 relative">
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-r border-t border-gray-200" />
              <SectionLabel
                num="02"
                title="Metoda płatności"
                sub="Wybierz preferowany sposób zapłaty za zamówienie"
              />

              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => {
                  const active = form.paymentMethod === id;
                  return (
                    <label
                      key={id}
                      className={cn(
                        "flex items-center gap-3 p-3.5 border cursor-pointer transition-colors",
                        active
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={id}
                        checked={active}
                        onChange={() => update("paymentMethod", id)}
                        className="accent-orange-500 h-4 w-4"
                      />
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          active ? "text-orange-500" : "text-zinc-400"
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-900">{label}</p>
                        <p className="text-xs text-zinc-500 font-mono">{desc}</p>
                      </div>
                      {id === "cod" && (
                        <span className="text-[10px] font-mono text-orange-500 border border-orange-300 bg-orange-50 px-1.5 py-0.5">
                          +5.00 zł
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ─── RIGHT: Order summary ─── */}
          <div>
            <div className="bg-white border border-gray-200 p-6 sticky top-20 relative">
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-r border-t border-gray-200" />

              <SectionLabel
                num="03"
                title="Podsumowanie"
                sub={`${items.length} pozycj${items.length === 1 ? "a" : items.length < 5 ? "e" : "i"} w zamówieniu`}
              />

              {/* Items list */}
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => {
                  const price = getEffectivePrice(product);
                  return (
                    <div key={product.id} className="flex gap-2.5">
                      <div className="w-9 h-9 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="h-4 w-4 text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-900 leading-tight line-clamp-1">
                          {product.name}
                        </p>
                        <p className="font-mono text-[10px] text-zinc-400">{product.sku}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          × {quantity} paczka{quantity > 1 ? "i" : ""}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-zinc-900 tabular-nums whitespace-nowrap pt-0.5">
                        {(price * quantity).toFixed(2)}{" "}
                        <span className="font-normal text-zinc-400">zł</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Suma produktów</span>
                  <span className="font-mono tabular-nums">{subtotal.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Dostawa</span>
                  <span
                    className={cn(
                      "font-mono tabular-nums",
                      shipping === 0 ? "text-emerald-600 font-semibold" : ""
                    )}
                  >
                    {shipping === 0 ? "GRATIS" : `${shipping.toFixed(2)} zł`}
                  </span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Obsługa płatności przy odbiorze</span>
                    <span className="font-mono tabular-nums">{codFee.toFixed(2)} zł</span>
                  </div>
                )}
                {shipping === 0 && (
                  <p className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Darmowa dostawa — zamówienia powyżej 200 zł
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-[10px] font-mono text-zinc-400">
                    Brakuje {(200 - subtotal).toFixed(2)} zł do darmowej dostawy
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-zinc-200 mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-zinc-900">SUMA CAŁKOWITA</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-500 tabular-nums">
                    {total.toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-400 ml-1">zł</span>
                </div>
              </div>

              {/* API error */}
              {apiError && (
                <div className="mt-4 border border-red-300 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600 font-mono">{apiError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold h-12 text-sm flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Wysyłanie…
                  </>
                ) : (
                  <>
                    Złóż zamówienie
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-400 text-center mt-2 font-mono">
                Klikając przycisk akceptujesz regulamin sklepu
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
