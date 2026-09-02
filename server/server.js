import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateRecipeWithGemini, refineRecipe } from './geminiClient.js';
import { validateRecipe } from './recipeSchema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'master-chef-server',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Fallback mock recipe
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

// Route: Generate New Recipe
app.post('/api/recipe', async (req, res) => {
  const { ingredients = [], dietaryNotes = "", servings = 2 } = req.body || {};

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
      timeoutMs: 35000,
    });

    const validationResult = validateRecipe(rawRecipe);

    if (!validationResult.success) {
      console.error("[RECIPE_VALIDATION_ERROR]", validationResult.errors);
      return res.status(502).json({
        success: false,
        code: "invalid_shape",
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
    const isTimeout = error?.message?.toLowerCase().includes("timed out");
    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      code: isTimeout ? "timeout" : "ai_request_failed",
      error: error instanceof Error ? error.message : "Failed to generate recipe.",
    });
  }
});

// Route: Refine Existing Recipe
app.post('/api/recipe/refine', async (req, res) => {
  const { currentRecipe, instruction } = req.body || {};

  if (!currentRecipe || !instruction || typeof instruction !== 'string' || instruction.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Both currentRecipe and a valid instruction string are required for refinement.",
    });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    const updatedMock = {
      ...fallbackRecipe,
      title: `${fallbackRecipe.title} (Refined: ${instruction.slice(0, 20)}...)`,
      description: `${fallbackRecipe.description} Adjusted with notes: "${instruction}".`,
    };
    const validatedMock = validateRecipe(updatedMock);
    return res.status(200).json({
      success: true,
      source: "mock",
      recipe: validatedMock.data,
      notice: "Serving refined mock response because GEMINI_API_KEY is not set."
    });
  }

  try {
    const rawRecipe = await refineRecipe({
      currentRecipe,
      instruction: instruction.trim(),
      timeoutMs: 35000,
    });

    const validationResult = validateRecipe(rawRecipe);

    if (!validationResult.success) {
      console.error("[RECIPE_REFINE_VALIDATION_ERROR]", validationResult.errors);
      return res.status(502).json({
        success: false,
        code: "invalid_shape",
        error: "Refined recipe failed structural validation contract.",
        issues: validationResult.errors,
      });
    }

    return res.status(200).json({
      success: true,
      source: "gemini",
      recipe: validationResult.data,
    });
  } catch (error) {
    console.error("[RECIPE_REFINE_ERROR]", error);
    const isTimeout = error?.message?.toLowerCase().includes("timed out");
    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      code: isTimeout ? "timeout" : "ai_request_failed",
      error: error instanceof Error ? error.message : "Failed to refine recipe.",
    });
  }
});

// Production Unified Static Asset Serving
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Master Chef Server listening on port ${PORT}`);
});
