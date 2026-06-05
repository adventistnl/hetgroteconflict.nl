"use server";

import FormData from "./interfaces/form-data";
import { sendLeadCaptureEmail } from "@/utils/send-email/send-lead-capture-email";
import { appendLeadToSheet } from "@/utils/google-sheets";

export const sendMailAction = async (
  func: (data: FormData) => Promise<void>,
  data: FormData,
) => {
  await func(data);
};

export async function captureLeadAction(
  email: string,
  source: "exit-intent" | "1min-trigger" | "video-play-trigger" | "form" = "exit-intent",
  locale: string = "unknown"
): Promise<void> {
  await sendLeadCaptureEmail(email);
  console.log("[captureLeadAction] ✅ Email enviado para:", email, "| source:", source, "| locale:", locale);
  try {
    await appendLeadToSheet(email, source, locale);
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "(não configurado)";
    console.log(
      "[captureLeadAction] ✅ Lead salvo na planilha:",
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
      "| email:", email,
      "| source:", source,
      "| locale:", locale
    );
  } catch (err) {
    // Log but don't block — email already sent
    console.error("[captureLeadAction] ❌ Google Sheets error:", err);
  }
}

