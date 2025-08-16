import { Request, Response } from "express";
import { inferIngredientsFromDish } from "../services/llmService";
import { inferIngredientsFromImage } from "../services/visionService";
import { estimateCarbonForIngredients, totalCarbon } from "../services/carbonEstimator";
import { EstimateResponse } from "../types";

export async function estimateFromDish(req: Request, res: Response) {
  try {
    const { dish } = req.body;
    if (!dish || typeof dish !== "string") return res.status(400).json({ error: "dish string required" });

    const inferred = await inferIngredientsFromDish(dish); // string[]
    const ingredients = estimateCarbonForIngredients(inferred);
    const total = totalCarbon(ingredients);

    const response: EstimateResponse = {
      dish,
      estimated_carbon_kg: total,
      ingredients,
      source: "llm"
    };
    return res.json(response);
  } catch (err: any) {
    console.error("estimateFromDish error:", err?.message ?? err);
    return res.status(500).json({ error: "internal error" });
  }
}

export async function estimateFromImage(req: Request, res: Response) {
  try {
    // multer sets file in req.file
    const file = req.file;
    if (!file) return res.status(400).json({ error: "image file required" });

    const inferred = await inferIngredientsFromImage(file.buffer);
    const ingredients = estimateCarbonForIngredients(inferred);
    const total = totalCarbon(ingredients);

    const response: EstimateResponse = {
      dish: inferred.join(", "),
      estimated_carbon_kg: total,
      ingredients,
      source: "vision"
    };
    return res.json(response);
  } catch (err: any) {
    console.error("estimateFromImage error:", err?.message ?? err);
    return res.status(500).json({ error: "internal error" });
  }
}