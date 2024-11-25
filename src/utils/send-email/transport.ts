import nodemailer from "nodemailer";

const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

//Gmail:
export const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
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
//     user: SMTP_EMAIL,
//     pass: SMTP_PASSWORD,
//   },
//   tls: {
//     ciphers: "SSLv3",
//   },
// });
