import { z } from 'zod';
import { pathToFileURL } from 'node:url';

/**
 * @typedef {Object} Ingredient
 * @property {string} name - Name of the ingredient
 * @property {number} quantity - Quantity amount (greater than 0)
 * @property {string} unit - Unit of measurement (e.g. "g", "cup", "tbsp", "whole")
 * @property {boolean} swappable - Whether ingredient can be substituted
 * @property {string|null} swapSuggestion - Suggested replacement if swappable
 */

/**
 * @typedef {Object} Step
 * @property {number} order - Step number (positive integer)
 * @property {string} instruction - Step instructions
 */

/**
 * @typedef {Object} Recipe
 * @property {string} title - Recipe title
 * @property {string} description - Brief summary (1-2 sentences)
 * @property {number} servings - Base serving size (positive integer)
 * @property {number} totalTimeMinutes - Total prep/cook time in minutes
 * @property {'easy'|'medium'|'hard'} difficulty - Recipe difficulty
 * @property {Ingredient[]} ingredients - Required ingredients list
 * @property {Step[]} steps - Sequential preparation steps
 * @property {string[]} tags - Optional categorization tags
 */

export const IngredientSchema = z.object({
  name: z.string().trim().min(1, "Ingredient name cannot be empty"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit: z.string().trim().min(1, "Unit cannot be empty"),
  swappable: z.boolean(),
  swapSuggestion: z.string().trim().nullable(),
});

export const StepSchema = z.object({
  order: z.number().int().positive("Step order must be a positive integer"),
  instruction: z.string().trim().min(1, "Instruction cannot be empty"),
});

export const RecipeSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().trim().min(1, "Description cannot be empty"),
  servings: z.number().int().positive("Servings must be a positive integer"),
  totalTimeMinutes: z.number().int().positive("Total time must be positive"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  ingredients: z.array(IngredientSchema).min(1, "At least one ingredient required"),
  steps: z.array(StepSchema).min(1, "At least one step required"),
  tags: z.array(z.string().trim()).default([]),
});

/**
 * Safely validates recipe data without throwing exceptions.
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

  const validSample = {
    title: "Rustic Tomato Garlic Pasta",
    description: "A comforting rustic pasta tossed with golden sautéed garlic and fresh tomatoes.",
    servings: 2,
    totalTimeMinutes: 25,
    difficulty: "easy",
    ingredients: [
      { name: "Pasta", quantity: 200, unit: "g", swappable: true, swapSuggestion: "Zucchini noodles" },
      { name: "Garlic", quantity: 3, unit: "cloves", swappable: false, swapSuggestion: null }
    ],
    steps: [
      { order: 1, instruction: "Boil pasta in salted water." },
      { order: 2, instruction: "Sauté garlic in olive oil." }
    ],
    tags: ["pasta", "italian", "quick"]
  };

  const invalidSample = {
    title: "",
    description: "Invalid recipe test",
    servings: -2,
    totalTimeMinutes: 0,
    difficulty: "super-hard",
    ingredients: [],
    steps: []
  };

  const validRes = validateRecipe(validSample);
  if (validRes.success) {
    console.log("[SCHEMA TEST: VALID PAYLOAD] -> PASSED");
  } else {
    console.error("[SCHEMA TEST: VALID PAYLOAD] -> FAILED", validRes.errors);
  }

  const invalidRes = validateRecipe(invalidSample);
  if (!invalidRes.success && invalidRes.errors.servings && invalidRes.errors.difficulty) {
    console.log("[SCHEMA TEST: INVALID PAYLOAD] -> PASSED");
  } else {
    console.error("[SCHEMA TEST: INVALID PAYLOAD] -> FAILED", invalidRes.errors);
  }
}
