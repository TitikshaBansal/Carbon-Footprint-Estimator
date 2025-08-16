import { Ingredient } from "../types";

const BASE_MAP: Record<string, number> = {
  rice: 1.0,
  "white rice": 1.0,
  chicken: 2.5,
  beef: 27.0,
  lamb: 39.2,
  pork: 12.1,
  fish: 6.1,
  egg: 4.8,
  potato: 0.3,
  tomato: 0.2,
  onion: 0.15,
  spices: 0.05,
  oil: 0.4,
  milk: 1.9,
  yogurt: 1.9,
  butter: 12.0,
  cheese: 13.5,
  lentils: 0.9,
  beans: 0.9,
  sugar: 0.6
};

function normalizeIngredientName(name: string) {
  return name.toLowerCase().replace(/[^a-z\s]/g, "").trim();
}

export function estimateCarbonForIngredients(names: string[]): Ingredient[] {
  const ingredients: Ingredient[] = names.map((raw) => {
    const n = normalizeIngredientName(raw);
    const carbon = BASE_MAP[n] ?? averageFallback(n);
    return { name: raw, carbon_kg: roundTo2(carbon) };
  });
  return ingredients;
}

function averageFallback(_name: string) {
  // Basic heuristic: plant-based average is small, animal-based bigger.
  // Simple: return 0.6 kg as fallback per ingredient
  return 0.6;
}

function roundTo2(x: number) {
  return Math.round(x * 100) / 100;
}

export function totalCarbon(ingredients: Ingredient[]) {
  return roundTo2(ingredients.reduce((s, it) => s + it.carbon_kg, 0));
}