export interface Ingredient {
  name: string;
  carbon_kg: number;
  confidence?: number; // for vision results
}

export interface EstimateResponse {
  dish: string;
  estimated_carbon_kg: number;
  ingredients: Ingredient[];
  source?: string; // e.g. "llm" | "vision"
}