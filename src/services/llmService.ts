import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const client = new OpenAIApi(configuration);

/**
 * Ask an LLM to infer typical ingredients and approximate quantity proportions.
 * Return a simple string array of ingredient names (no DB).
 */
export async function inferIngredientsFromDish(dish: string): Promise<string[]> {
  const prompt = `List the main ingredients for the dish "${dish}". Return JSON array of ingredient names (short list, 5-8 items max). Example: ["Rice","Chicken","Onion","Yogurt"]`;

  const resp = await client.createChatCompletion({
    model: "gpt-4o-mini", // choose appropriate model
    messages: [
      { role: "system", content: "You are a helpful assistant that lists ingredients." },
      { role: "user", content: prompt }
    ],
    max_tokens: 200,
    temperature: 0.2
  });

  const content = resp.data.choices?.[0]?.message?.content ?? "[]";

  // Try to parse JSON; fall back to naive extraction
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim());
  } catch {
    // fallback: extract lines and commas
    const items = content.split(/[\n,]+/).map(s => s.replace(/["\[\]]/g, "").trim()).filter(Boolean);
    return items.slice(0, 8);
  }
  return [];
}