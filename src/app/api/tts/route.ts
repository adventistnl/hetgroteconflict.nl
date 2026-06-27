import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/tts/edge-tts-client";
import { getVoiceInfo } from "@/lib/tts/language-detection";
import type { WordBoundary } from "@/lib/tts/edge-tts-client";

// Use Node.js runtime (needed for WebSocket / msedge-tts)
export const runtime = "nodejs";
// Increase timeout to 60s (requires Vercel Pro; Hobby defaults to 10s)
export const maxDuration = 60;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TtsRequestBody {
  /** Text to synthesise. Keep under ~3500 chars per request. */
  text: string;
  /** App locale code, e.g. "en", "pt", "ru". Defaults to "en". */
  lang?: string;
  /** Override voice name, e.g. "en-US-GuyNeural". */
  voice?: string;
}

export interface TtsSuccessResponse {
  audioBase64: string;
  boundaries: WordBoundary[];
  lang: string;
  voice: string;
}

export interface TtsErrorResponse {
  error: string;
  fallbackToWebSpeech: boolean;
}

// ── Handler ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: TtsRequestBody;

  try {
    body = (await request.json()) as TtsRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", fallbackToWebSpeech: false } satisfies TtsErrorResponse,
      { status: 400 }
    );
  }

  const { text, lang = "en", voice: requestedVoice } = body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "text is required", fallbackToWebSpeech: false } satisfies TtsErrorResponse,
      { status: 400 }
    );
  }

  // Clamp to 4000 chars — callers should chunk; this is a safety guard
  const safeText = text.slice(0, 4000);

  const { bcp47, voice: defaultVoice } = getVoiceInfo(lang);
  const voice = requestedVoice ?? defaultVoice;

  try {
    const result = await generateSpeech(safeText, voice);

    return NextResponse.json({
      audioBase64: result.audioBuffer.toString("base64"),
      boundaries: result.boundaries,
      lang: bcp47,
      voice,
    } satisfies TtsSuccessResponse);
  } catch (err) {
    console.error("[/api/tts] Edge TTS error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "TTS generation failed",
        fallbackToWebSpeech: true,
      } satisfies TtsErrorResponse,
      { status: 500 }
    );
  }
}
