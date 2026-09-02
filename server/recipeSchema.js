import { z } from 'zod';
import { pathToFileURL } from 'node:url';

/**
 * Robust, enterprise-resilient Ingredient Schema
 */
export const IngredientSchema = z.object({
  name: z.string().trim().min(1, "Ingredient name cannot be empty"),
  quantity: z.preprocess((val) => {
    if (typeof val === 'number') return val > 0 ? val : 1;
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && parsed > 0 ? parsed : 1;
    }
    return 1;
  }, z.number().positive("Quantity must be greater than 0")),
  unit: z.preprocess((val) => (typeof val === 'string' && val.trim().length > 0 ? val.trim() : 'unit'), z.string()),
  swappable: z.preprocess((val) => Boolean(val), z.boolean()),
  swapSuggestion: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim().length > 0) return val.trim();
    return null;
  }, z.string().nullable()),
});

/**
 * Robust, enterprise-resilient Step Schema
 */
export const StepSchema = z.object({
  order: z.preprocess((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0 ? num : 1;
  }, z.number().int().positive("Step order must be a positive integer")),
  instruction: z.string().trim().min(1, "Instruction cannot be empty"),
});

/**
 * Robust, enterprise-resilient Recipe Schema
 */
export const RecipeSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().trim().min(1, "Description cannot be empty"),
  servings: z.preprocess((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0 ? num : 2;
  }, z.number().int().positive("Servings must be a positive integer")),
  totalTimeMinutes: z.preprocess((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0 ? num : 20;
  }, z.number().int().positive("Total time must be positive")),
  difficulty: z.preprocess((val) => {
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (['easy', 'medium', 'hard'].includes(lower)) return lower;
      if (lower.includes('easy') || lower.includes('simple')) return 'easy';
      if (lower.includes('hard') || lower.includes('advanced') || lower.includes('complex')) return 'hard';
    }
    return 'medium';
  }, z.enum(["easy", "medium", "hard"])),
  ingredients: z.array(IngredientSchema).min(1, "At least one ingredient required"),
  steps: z.array(StepSchema).min(1, "At least one step required"),
  tags: z.preprocess((val) => {
    if (Array.isArray(val)) {
      return val.map((t) => (typeof t === 'string' ? t.trim() : String(t))).filter(Boolean);
    }
    return [];
  }, z.array(z.string())),
});

/**
 * Safely validates recipe data with automatic type normalization.
 * @param {unknown} data
 * @returns {{ success: true, data: import('zod').infer<typeof RecipeSchema> } | { success: false, errors: Record<string, string[]>, rawIssues: z.ZodIssue[] }}
 */
export function validateRecipe(data) {
  try {
    const result = RecipeSchema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      rawIssues: result.error.issues,
    };
  } catch (err) {
    return {
      success: false,
      errors: { _unknown: [err instanceof Error ? err.message : String(err)] },
      rawIssues: [],
    };
  }
}

// Self-executing sanity check if script is run directly via node
const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  console.log("=== RUNNING RECIPE SCHEMA SANITY CHECKS ===");

  const sampleWithoutSwap = {
    title: "Rustic Tomato Garlic Pasta",
    description: "A comforting rustic pasta tossed with golden sautéed garlic and fresh tomatoes.",
    servings: "2",
    totalTimeMinutes: 25,
    difficulty: "EASY",
    ingredients: [
      { name: "Pasta", quantity: 200, unit: "g", swappable: false },
      { name: "Garlic", quantity: "3", unit: "cloves", swappable: true, swapSuggestion: "Shallots" }
    ],
    steps: [
      { order: "1", instruction: "Boil pasta in salted water." },
      { order: 2, instruction: "Sauté garlic in olive oil." }
    ],
    tags: ["pasta", "quick"]
  };

  const res = validateRecipe(sampleWithoutSwap);
  if (res.success) {
    console.log("[SCHEMA TEST: NORMALIZATION] -> PASSED:", res.data);
  } else {
    console.error("[SCHEMA TEST: NORMALIZATION] -> FAILED:", res.errors);
  }
}
