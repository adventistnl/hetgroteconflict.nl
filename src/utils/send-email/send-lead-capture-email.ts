"use server";

import { transport } from "./transport";
import { verifyTransport } from "./verify-transport";
import dotenv from "dotenv";
dotenv.config();

export async function sendLeadCaptureEmail(email: string) {
  const { NEXT_PUBLIC_SMTP_TARGET_EMAIL } = process.env;

  await verifyTransport();

  try {
    await transport.sendMail({
      to: NEXT_PUBLIC_SMTP_TARGET_EMAIL,
      subject: `New lead captured from chapter page`,
      html: `
        <div>
          <h2>New interested visitor</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p>This person expressed interest in receiving materials about The Great Controversy via the exit-intent popup on a chapter page.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error(error);
  }
}
