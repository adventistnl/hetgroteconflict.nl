import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { NEXT_PUBLIC_SMTP_EMAIL, NEXT_PUBLIC_SMTP_PASSWORD } = process.env;

//Gmail:
export const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: NEXT_PUBLIC_SMTP_EMAIL,
    pass: NEXT_PUBLIC_SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Ignorar erros de certificado autoassinado
  },
});

//Microsoft:
// export const transport = nodemailer.createTransport({
//   host: "smtp.office365.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: NEXT_PUBLIC_SMTP_EMAIL,
//     pass: NEXT_PUBLIC_SMTP_PASSWORD,
//   },
//   tls: {
//     ciphers: "SSLv3",
//   },
// });
