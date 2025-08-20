import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const client = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Ask an LLM to infer typical ingredients and approximate quantity proportions.
 * Return a simple string array of ingredient names (no DB).
 */
export async function inferIngredientsFromDish(dish: string): Promise<string[]> {
  const prompt = `List the main ingredients for the dish "${dish}". Return JSON array of ingredient names (short list, 5-8 items max). Example: ["Rice","Chicken","Onion","Yogurt"]`;

  // No API key? Provide a deterministic, sensible mock so the API still works locally.
  if (!client) {
    return mockIngredientsForDish(dish);
  }

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const resp = await model.generateContent(prompt);
  const content = resp.response?.text() ?? "[]";

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

function mockIngredientsForDish(dish: string): string[] {
  const lc = dish.toLowerCase();
  if (lc.includes("biryani")) return ["Rice", "Chicken", "Onion", "Yogurt", "Spices", "Oil"];
  if (lc.includes("pizza")) return ["Flour", "Tomato", "Cheese", "Olive Oil", "Yeast"];
  if (lc.includes("salad")) return ["Lettuce", "Tomato", "Cucumber", "Olive Oil"];
  if (lc.includes("burger")) return ["Bun", "Beef", "Cheese", "Onion", "Tomato"];
  return ["Rice", "Tomato", "Onion", "Oil", "Spices"]; // generic fallback
}