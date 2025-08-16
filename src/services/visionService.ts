import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const client = new OpenAIApi(configuration);

/**
 * Accepts Buffer image and returns inferred labels/ingredients (string[]).
 * This is an example call using a hypothetical vision endpoint via the LLM provider's multimodal feature.
 */
export async function inferIngredientsFromImage(imageBuffer: Buffer): Promise<string[]> {
  // Many vision APIs expect multipart or base64 — adapt to your provider.
  // Here we call a text model and ask to guess ingredients based on an explanation (mocking the process).
  // In a production integration, use a proper Vision / Image Classification API.

  const base64 = imageBuffer.toString("base64");
  const prompt = `Given this image encoded in base64 (image omitted to keep payload small), list probable ingredients visible in the dish. Return a JSON array of ingredient names. Answer format: ["rice","tomato", ...]`;

  const resp = await client.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an assistant that guesses dish ingredients from images." },
      { role: "user", content: prompt }
    ],
    max_tokens: 200,
    temperature: 0.2
  });

  const content = resp.data.choices?.[0]?.message?.content ?? "[]";

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim());
  } catch {
    const items = content.split(/[\n,]+/).map(s => s.replace(/["\[\]]/g, "").trim()).filter(Boolean);
    return items.slice(0, 10);
  }
}