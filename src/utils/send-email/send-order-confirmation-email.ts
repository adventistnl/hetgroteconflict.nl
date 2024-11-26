"use server";
import dotenv from "dotenv";
dotenv.config();

import FormData from "@/app/interfaces/form-data";
import { transport } from "./transport";
import { verifyTransport } from "./verify-transport";

export async function sendOrderConfirmationEmail(data: FormData) {
  const { SMTP_EMAIL } = process.env;
  const { country, name, email, street, number, city, postCode } = data;

  await verifyTransport();

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to: email,
      subject: "The Great Controversy book shipment",
      html: `
              <div>
               <p>Hello, <strong>${name}</strong></p>
               <p>We have received your information and will contact you shortly to inform you of the shipment.</p>
               <p>We will send the book to the following address:</p>
               <p>${country}</p>
               <p>${street}, ${number}, ${city}, ${postCode}</p>
              <p>If the address is incorrect, please contact us by replying to this email. If everything is correct, you don't need to reply, just wait for us to contact you.</p>
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
