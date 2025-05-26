"use server";

import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { transport } from "./transport";
import { verifyTransport } from "./verify-transport";
import dotenv from "dotenv";
dotenv.config();

export async function sendTalkToUsEmail(data: TalkToUsFormData) {
  const { NEXT_PUBLIC_SMTP_TARGET_EMAIL } = process.env;
  const { email, name, message } = data;

  await verifyTransport();

  try {
    await transport.sendMail({
      replyTo: email,
      to: NEXT_PUBLIC_SMTP_TARGET_EMAIL,
      subject: `Talk to us contact by ${name}`,
      html: `
        <div>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        </div>
        `,
    });
  } catch (error) {
    console.error(error);
  }
}
