"use server";

import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { transport } from "./transport";
import { verifyTransport } from "./verify-transport";

export async function sendTalkToUsEmail(data: TalkToUsFormData) {
  const { SMTP_EMAIL } = process.env;
  const { email, name, message } = data;

  await verifyTransport();

  try {
    await transport.sendMail({
      from: email,
      to: SMTP_EMAIL,
      subject: `Talk to us`,
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
