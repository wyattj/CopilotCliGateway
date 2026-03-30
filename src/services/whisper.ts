import type { OpenAIConfig } from "../config.js";

const WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

/** Map common audio MIME types to file extensions for the upload filename. */
function extensionFromMimetype(mimetype: string): string {
  const base = mimetype.split(";")[0].trim().toLowerCase();
  const map: Record<string, string> = {
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/webm": "webm",
    "audio/flac": "flac",
    "audio/amr": "amr",
  };
  return map[base] ?? "ogg";
}

/**
 * Transcribe an audio buffer using the OpenAI Whisper API.
 * Returns the transcribed text.
 */
export async function transcribe(
  audioBuffer: Buffer,
  mimetype: string,
  config: OpenAIConfig,
): Promise<string> {
  const ext = extensionFromMimetype(mimetype);
  const filename = `voice.${ext}`;

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audioBuffer)], { type: mimetype }), filename);
  form.append("model", config.whisperModel);
  if (config.language) {
    form.append("language", config.language);
  }

  const response = await fetch(WHISPER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Whisper API error (${response.status}): ${errorBody}`);
  }

  const result = (await response.json()) as { text: string };
  return result.text;
}
