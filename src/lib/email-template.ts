export type OrderEmailData = {
  orderNumber: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  paymentMethod: "card" | "transfer" | "cod";
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
    packSize: number;
  }>;
  subtotal: number;
  shipping: number;
  codFee: number;
  total: number;
};

const PAYMENT_LABELS: Record<OrderEmailData["paymentMethod"], string> = {
  card: "Karta płatnicza (Visa / Mastercard / BLIK)",
  transfer: "Przelew bankowy",
  cod: "Płatność przy odbiorze",
};

export function buildConfirmationEmail(d: OrderEmailData): string {
  const itemRows = d.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a2e;">
          ${item.name}<br/>
          <span style="font-family:monospace;font-size:11px;color:#888;">${item.sku}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:center;">
          × ${item.quantity} paczka
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a2e;text-align:right;font-weight:600;font-family:monospace;">
          ${(item.price * item.quantity).toFixed(2)} zł
        </td>
      </tr>`
    )
    .join("");

  const shippingRow =
    d.shipping === 0
      ? `<tr>
          <td colspan="2" style="padding:8px 12px;font-size:13px;color:#16a34a;">Dostawa</td>
          <td style="padding:8px 12px;font-size:13px;color:#16a34a;text-align:right;font-family:monospace;font-weight:600;">GRATIS</td>
        </tr>`
      : `<tr>
          <td colspan="2" style="padding:8px 12px;font-size:13px;color:#555;">Dostawa</td>
          <td style="padding:8px 12px;font-size:13px;color:#555;text-align:right;font-family:monospace;">${d.shipping.toFixed(2)} zł</td>
        </tr>`;

  const codRow =
    d.codFee > 0
      ? `<tr>
          <td colspan="2" style="padding:8px 12px;font-size:13px;color:#555;">Obsługa płatności przy odbiorze</td>
          <td style="padding:8px 12px;font-size:13px;color:#555;text-align:right;font-family:monospace;">${d.codFee.toFixed(2)} zł</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Potwierdzenie zamówienia ${d.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#18181b;padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:800;color:#fff;">Sklep<span style="color:#f97316;">Śrubki</span></span>
                  </td>
                  <td align="right">
                    <span style="font-family:monospace;font-size:11px;color:#6b7280;letter-spacing:0.1em;">SYSTEM.HARDWARE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Orange accent bar -->
          <tr>
            <td style="background:#f97316;height:3px;"></td>
          </tr>

          <!-- Status banner -->
          <tr>
            <td style="background:#fff7ed;border-left:3px solid #f97316;padding:20px 32px;">
              <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#9ca3af;letter-spacing:0.15em;text-transform:uppercase;">STATUS // ZAMÓWIENIE PRZYJĘTE</p>
              <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#18181b;">Dziękujemy za zamówienie!</h1>
              <p style="margin:0;font-size:13px;color:#555;">
                Cześć <strong>${d.firstName}</strong>, Twoje zamówienie zostało przyjęte i jest w trakcie realizacji.
              </p>
            </td>
          </tr>

          <!-- Order meta -->
          <tr>
            <td style="background:#fff;padding:20px 32px;border-bottom:1px solid #f0f0f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;">
                    <p style="margin:0 0 2px;font-family:monospace;font-size:10px;color:#9ca3af;letter-spacing:0.1em;text-transform:uppercase;">NR ZAMÓWIENIA</p>
                    <p style="margin:0;font-family:monospace;font-size:15px;font-weight:700;color:#f97316;">${d.orderNumber}</p>
                  </td>
                  <td style="width:50%;text-align:right;">
                    <p style="margin:0 0 2px;font-family:monospace;font-size:10px;color:#9ca3af;letter-spacing:0.1em;text-transform:uppercase;">DATA</p>
                    <p style="margin:0;font-family:monospace;font-size:13px;color:#18181b;">${d.createdAt}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items table -->
          <tr>
            <td style="background:#fff;padding:0 32px 8px;">
              <p style="margin:20px 0 8px;font-family:monospace;font-size:10px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;">POZYCJE ZAMÓWIENIA</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;">
                <thead>
                  <tr style="background:#fafafa;">
                    <th style="padding:8px 12px;font-size:11px;color:#9ca3af;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Produkt</th>
                    <th style="padding:8px 12px;font-size:11px;color:#9ca3af;text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Ilość</th>
                    <th style="padding:8px 12px;font-size:11px;color:#9ca3af;text-align:right;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Price summary -->
          <tr>
            <td style="background:#fff;padding:8px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;">
                <tbody>
                  ${shippingRow}
                  ${codRow}
                  <tr style="background:#18181b;">
                    <td colspan="2" style="padding:12px;font-size:13px;color:#fff;font-weight:700;letter-spacing:0.05em;">SUMA CAŁKOWITA</td>
                    <td style="padding:12px;font-size:18px;color:#f97316;font-weight:800;text-align:right;font-family:monospace;">${d.total.toFixed(2)} zł</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Delivery + Payment -->
          <tr>
            <td style="background:#fff;padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;vertical-align:top;padding-right:16px;">
                    <p style="margin:0 0 8px;font-family:monospace;font-size:10px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;">ADRES DOSTAWY</p>
                    <p style="margin:0;font-size:13px;color:#18181b;line-height:1.6;">
                      ${d.firstName} ${d.lastName}<br/>
                      ${d.address}<br/>
                      ${d.zipCode} ${d.city}
                    </p>
                  </td>
                  <td style="width:50%;vertical-align:top;padding-left:16px;border-left:1px solid #f0f0f0;">
                    <p style="margin:0 0 8px;font-family:monospace;font-size:10px;color:#9ca3af;letter-spacing:0.12em;text-transform:uppercase;">METODA PŁATNOŚCI</p>
                    <p style="margin:0;font-size:13px;color:#18181b;line-height:1.6;">
                      ${PAYMENT_LABELS[d.paymentMethod]}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info box -->
          <tr>
            <td style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px 32px;margin:0 32px;">
              <p style="margin:0;font-size:12px;color:#15803d;line-height:1.6;">
                ✓ Przewidywany czas dostawy: <strong>2–3 dni robocze</strong><br/>
                ✓ Zamówienia złożone do 14:00 są wysyłane tego samego dnia<br/>
                ✓ W razie pytań: <a href="mailto:kontakt@sklepsrubki.pl" style="color:#15803d;">kontakt@sklepsrubki.pl</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#18181b;padding:20px 32px;margin-top:2px;">
              <p style="margin:0;font-size:11px;color:#6b7280;text-align:center;font-family:monospace;letter-spacing:0.08em;">
                SKLEPSRUBKI.PL · SYSTEM.HARDWARE · ${new Date().getFullYear()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildStoreNotificationEmail(d: OrderEmailData): string {
  const itemList = d.items
    .map((i) => `• ${i.name} [${i.sku}] × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} zł`)
    .join("\n");

  return `
<div style="font-family:monospace;font-size:13px;color:#18181b;padding:24px;background:#fff;border:1px solid #e5e7eb;">
  <h2 style="margin:0 0 16px;font-size:16px;">🔔 NOWE ZAMÓWIENIE: ${d.orderNumber}</h2>
  <p><strong>Klient:</strong> ${d.firstName} ${d.lastName} &lt;${d.email}&gt;</p>
  <p><strong>Adres:</strong> ${d.address}, ${d.zipCode} ${d.city}</p>
  <p><strong>Płatność:</strong> ${PAYMENT_LABELS[d.paymentMethod]}</p>
  <p><strong>Data:</strong> ${d.createdAt}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
  <pre style="margin:0;white-space:pre-wrap;">${itemList}</pre>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
  <p><strong>RAZEM: ${d.total.toFixed(2)} zł</strong></p>
</div>`;
}
