"use server";

import { transport } from "./transport";
import { verifyTransport } from "./verify-transport";
import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";

export async function sendTalkToUsConfirmationEmail(data: TalkToUsFormData) {
  const { SMTP_EMAIL } = process.env;
  const { name, email } = data;

  await verifyTransport();

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to: email,
      subject: "The Great Controversy Project - Talk to us",
      html: `
              <div>
               <p>Hello, <strong>${name}</strong></p>
               <p>We have received your email and will contact you shortly.</p>
               <p>Thank you for your patience.</p>
               <p>Best regards,</p>
               <p>The Great Controversy Project</p>
              </div>
            `,
    });
  } catch (error) {
    console.error(error);
  }
}
