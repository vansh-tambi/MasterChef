import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateRecipeWithGemini } from './geminiClient.js';
import { validateRecipe } from './recipeSchema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Fallback mock recipe in case API key is missing or generation fails in dev/demo mode
const fallbackRecipe = {
  title: "Rustic Tomato Garlic Pasta",
  description: "A comforting rustic pasta tossed with golden sautéed garlic and ripe juicy tomatoes.",
  servings: 2,
  totalTimeMinutes: 25,
  difficulty: "easy",
  ingredients: [
    { name: "Pasta", quantity: 200, unit: "g", swappable: true, swapSuggestion: "Zucchini noodles" },
    { name: "Garlic", quantity: 3, unit: "cloves", swappable: false, swapSuggestion: null },
    { name: "Olive Oil", quantity: 2, unit: "tbsp", swappable: true, swapSuggestion: "Butter" },
    { name: "Tomatoes", quantity: 2, unit: "medium", swappable: true, swapSuggestion: "Canned crushed tomatoes" }
  ],
  steps: [
    { order: 1, instruction: "Boil pasta in generously salted water until al dente." },
    { order: 2, instruction: "Gently sauté sliced garlic and diced tomatoes in olive oil over low heat." },
    { order: 3, instruction: "Toss drained pasta with garlic-tomato oil and serve warm." }
  ],
  tags: ["pasta", "italian", "quick", "comfort food"]
};

app.post('/api/recipe', async (req, res) => {
  const { ingredients = [], dietaryNotes = "", servings = 2 } = req.body || {};

  // If no Gemini key is provided, return validated fallback mock payload
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    const validatedMock = validateRecipe(fallbackRecipe);
    return res.status(200).json({
      success: true,
      source: "mock",
      recipe: validatedMock.data,
      notice: "Serving mock response because GEMINI_API_KEY is not set."
    });
  }

  try {
    const rawRecipe = await generateRecipeWithGemini({
      ingredients: Array.isArray(ingredients) && ingredients.length > 0 ? ingredients : ["pasta", "garlic", "tomatoes"],
      dietaryNotes,
      servings: typeof servings === 'number' && servings > 0 ? servings : 2,
      timeoutMs: 25000,
    });

    const validationResult = validateRecipe(rawRecipe);

    if (!validationResult.success) {
      console.error("[RECIPE_VALIDATION_ERROR]", validationResult.errors);
      return res.status(502).json({
        success: false,
        error: "Generated recipe failed structural validation contract.",
        issues: validationResult.errors,
      });
    }

    return res.status(200).json({
      success: true,
      source: "gemini",
      recipe: validationResult.data,
    });
  } catch (error) {
    console.error("[RECIPE_GENERATION_ERROR]", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate recipe.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
