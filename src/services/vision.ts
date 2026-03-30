import type { OpenAIConfig } from "../config.js";

const CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Describe an image using OpenAI's Vision API (GPT-4o).
 * Returns a concise text description.
 */
export async function describeImage(
  imageBuffer: Buffer,
  mimetype: string,
  config: OpenAIConfig,
  userPrompt?: string,
): Promise<string> {
  const base64 = imageBuffer.toString("base64");
  const dataUrl = `data:${mimetype};base64,${base64}`;

  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
    {
      type: "image_url",
      image_url: { url: dataUrl },
    },
  ];

  if (userPrompt) {
    content.push({ type: "text", text: userPrompt });
  } else {
    content.push({ type: "text", text: "Describe this image concisely." });
  }

  const response = await fetch(CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.visionModel,
      messages: [{ role: "user", content }],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Vision API error (${response.status}): ${errorBody}`);
  }

  const result = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return result.choices[0]?.message?.content ?? "(No description)";
}
