import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const client = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Accepts Buffer image and returns inferred labels/ingredients (string[]).
 * This is an example call using a hypothetical vision endpoint via the LLM provider's multimodal feature.
 */
export async function inferIngredientsFromImage(imageBuffer: Buffer): Promise<string[]> {
  // Many vision APIs expect multipart or base64 — adapt to your provider.
  // Here we call a text model and ask to guess ingredients based on an explanation (mocking the process).
  // In a production integration, use a proper Vision / Image Classification API.

  const base64 = imageBuffer.toString("base64");
  const prompt = `List probable ingredients visible in the provided image. Return a JSON array of ingredient names. Answer format: ["rice","tomato", ...]`;

  if (!client) {
    return ["Rice", "Tomato", "Onion", "Oil"]; // simple mock when no API key
  }

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const resp = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64,
        mimeType: "image/png"
      }
    } as any
  ]);

  const content = resp.response?.text() ?? "[]";

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim());
  } catch {
    const items = content.split(/[\n,]+/).map(s => s.replace(/["\[\]]/g, "").trim()).filter(Boolean);
    return items.slice(0, 10);
  }
  return [];
}