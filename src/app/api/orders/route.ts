import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { buildConfirmationEmail, buildStoreNotificationEmail, type OrderEmailData } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "SklepŚrubki <onboarding@resend.dev>";

export async function POST(req: Request) {
  try {
    const body: OrderEmailData = await req.json();

    if (!body.email || !body.orderNumber) {
      return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
    }

    /* 1. Zapisz zamówienie w bazie danych */
    await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        firstName:   body.firstName,
        lastName:    body.lastName,
        email:       body.email,
        phone:       body.phone ?? "",
        address:     body.address,
        zipCode:     body.zipCode,
        city:        body.city,
        paymentMethod: body.paymentMethod,
        subtotal:    body.subtotal,
        shipping:    body.shipping,
        codFee:      body.codFee,
        total:       body.total,
        status:      "new",
        items: {
          create: body.items.map((i) => ({
            name:     i.name,
            sku:      i.sku,
            quantity: i.quantity,
            price:    i.price,
            packSize: i.packSize,
          })),
        },
      },
    });

    /* 2. Wyślij potwierdzenie do klienta */
    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: body.email,
      subject: `Potwierdzenie zamówienia ${body.orderNumber} — SklepŚrubki`,
      html: buildConfirmationEmail(body),
    });

    if (sendError) {
      console.error("[orders] Resend error:", JSON.stringify(sendError, null, 2));
      /* Zamówienie już zapisane — zwróć sukces ale z ostrzeżeniem */
      return NextResponse.json(
        { success: true, emailWarning: `Resend: ${sendError.message ?? JSON.stringify(sendError)}` },
      );
    }

    /* 3. Powiadomienie do sklepu */
    const storeEmail = process.env.STORE_EMAIL;
    if (storeEmail) {
      await resend.emails.send({
        from: FROM,
        to: storeEmail,
        subject: `[ZAMÓWIENIE] ${body.orderNumber} · ${body.firstName} ${body.lastName} · ${body.total.toFixed(2)} zł`,
        html: buildStoreNotificationEmail(body),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[orders] Unexpected error:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
