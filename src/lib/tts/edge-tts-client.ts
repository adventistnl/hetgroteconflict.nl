// AVISO: depende de serviço não-oficial da Microsoft (Edge TTS via WebSocket).
// Pode parar de funcionar sem aviso. O fallback Web Speech API no hook cobre esse risco.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts") as {
  MsEdgeTTS: typeof import("msedge-tts").MsEdgeTTS;
  OUTPUT_FORMAT: typeof import("msedge-tts").OUTPUT_FORMAT;
};

export interface WordBoundary {
  text: string;
  offsetMs: number;
  durationMs: number;
  /** Char index in the original text passed to generateSpeech */
  charIndex: number;
}

export interface TtsChunkResult {
  audioBuffer: Buffer;
  boundaries: WordBoundary[];
}

// ── In-memory cache (lives while the serverless container is warm) ─────────────

const _cache = new Map<string, TtsChunkResult>();

function cacheKey(text: string, voice: string): string {
  return `${voice}::${text.length}::${text.slice(0, 80)}`;
}

// ── Word boundary parsing ─────────────────────────────────────────────────────
// msedge-tts emits word boundary events whose charIndex points into the SSML,
// not the raw text. We re-map by matching word text to its position in the
// original text instead — robust, format-agnostic.

function matchBoundariesToText(
  text: string,
  rawWords: Array<{ text: string; offsetMs: number; durationMs: number }>
): WordBoundary[] {
  let searchFrom = 0;
  return rawWords.map((w) => {
    const idx = text.indexOf(w.text, searchFrom);
    const charIndex = idx !== -1 ? idx : searchFrom;
    if (idx !== -1) searchFrom = idx + w.text.length;
    return { text: w.text, offsetMs: w.offsetMs, durationMs: w.durationMs, charIndex };
  });
}

// ── Raw event parsing (handles different msedge-tts event shapes) ─────────────

interface RawWord {
  text: string;
  offsetMs: number;
  durationMs: number;
}

function parseBoundaryEvent(data: unknown): RawWord | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  // Shape A: { Data: { Offset, Duration, text: { text } } }
  const inner = (d["Data"] ?? d["data"]) as Record<string, unknown> | undefined;
  if (inner && typeof inner["Offset"] === "number") {
    const wordText =
      typeof inner["text"] === "object"
        ? ((inner["text"] as Record<string, unknown>)["text"] as string)
        : typeof inner["text"] === "string"
        ? inner["text"]
        : null;
    if (wordText) {
      return {
        text: wordText,
        offsetMs: Math.round((inner["Offset"] as number) / 10000),
        durationMs: Math.round(((inner["Duration"] as number) ?? 0) / 10000),
      };
    }
  }

  // Shape B: flat { Offset, Duration, text }
  if (typeof d["Offset"] === "number") {
    const wordText =
      typeof d["text"] === "string"
        ? d["text"]
        : typeof d["text"] === "object"
        ? ((d["text"] as Record<string, unknown>)["text"] as string)
        : null;
    if (wordText) {
      return {
        text: wordText,
        offsetMs: Math.round((d["Offset"] as number) / 10000),
        durationMs: Math.round(((d["Duration"] as number) ?? 0) / 10000),
      };
    }
  }

  return null;
}

// ── Core generator ────────────────────────────────────────────────────────────

export async function generateSpeech(
  text: string,
  voice: string
): Promise<TtsChunkResult> {
  const key = cacheKey(text, voice);
  const cached = _cache.get(key);
  if (cached) return cached;

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

  return new Promise<TtsChunkResult>((resolve, reject) => {
    const audioChunks: Buffer[] = [];
    const rawWords: RawWord[] = [];

    const { audioStream, metadataStream } = tts.toStream(text);

    if (metadataStream) {
      metadataStream.on("data", (data: unknown) => {
        const word = parseBoundaryEvent(data);
        if (word && word.text.trim()) rawWords.push(word);
      });
      metadataStream.on("error", (err: Error) => reject(err));
    }

    audioStream.on("data", (chunk: Buffer) => audioChunks.push(chunk));

    audioStream.on("end", () => {
      const audioBuffer = Buffer.concat(audioChunks);
      const boundaries = matchBoundariesToText(text, rawWords);
      const result: TtsChunkResult = { audioBuffer, boundaries };
      _cache.set(key, result);
      resolve(result);
    });

    audioStream.on("error", (err: Error) => reject(err));
  });
}
