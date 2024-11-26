"use server";
import dotenv from "dotenv";
dotenv.config();

import FormData from "@/app/interfaces/form-data";
import { transport } from "./transport";
import { verifyTransport } from "./verify-transport";

export async function sendOrderInfo(data: FormData) {
  const { NEXT_PUBLIC_SMTP_EMAIL } = process.env;
  const { country, name, email, street, number, city, postCode } = data;

  await verifyTransport();

  try {
    await transport.sendMail({
      from: NEXT_PUBLIC_SMTP_EMAIL,
      to: NEXT_PUBLIC_SMTP_EMAIL,
      subject: `Book shipment for ${country}`,
      html: `
        <div>
            <p><strong>Data:</strong></p>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Address: ${street}, ${number}, ${city}, ${postCode}, ${country}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error(error);
  }
}
