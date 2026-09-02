import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini API calls will fail unless provided.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const recipeResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    servings: { type: SchemaType.INTEGER },
    totalTimeMinutes: { type: SchemaType.INTEGER },
    difficulty: {
      type: SchemaType.STRING,
      enum: ["easy", "medium", "hard"],
    },
    ingredients: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          quantity: { type: SchemaType.NUMBER },
          unit: { type: SchemaType.STRING },
          swappable: { type: SchemaType.BOOLEAN },
          swapSuggestion: { type: SchemaType.STRING, nullable: true },
        },
        required: ["name", "quantity", "unit", "swappable"],
      },
    },
    steps: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          order: { type: SchemaType.INTEGER },
          instruction: { type: SchemaType.STRING },
        },
        required: ["order", "instruction"],
      },
    },
    tags: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: [
    "title",
    "description",
    "servings",
    "totalTimeMinutes",
    "difficulty",
    "ingredients",
    "steps",
    "tags",
  ],
};

/**
 * Calls Gemini with structured output to generate a recipe.
 * @param {Object} params
 * @param {string[]} params.ingredients - List of ingredients in the fridge
 * @param {string} [params.dietaryNotes] - Optional dietary restrictions
 * @param {number} [params.servings] - Desired servings count
 * @param {number} [params.timeoutMs=20000] - Timeout in ms
 * @returns {Promise<any>} Parsed JSON object from Gemini
 */
export async function generateRecipeWithGemini({
  ingredients = [],
  dietaryNotes = "",
  servings = 2,
  timeoutMs = 20000,
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in the server environment.");
  }

  const ai = genAI || new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: recipeResponseSchema,
      temperature: 0.7,
    },
    systemInstruction:
      "You are an expert chef specializing in home cooking with available ingredients. Generate delicious, practical, and clear recipes maximizing the provided ingredients while suggesting smart substitutions for common pantry staples.",
  });

  const prompt = `Create an inventive, delicious recipe using these available ingredients: ${ingredients.join(", ")}.
Dietary constraints / preferences: ${dietaryNotes || "None"}.
Target Servings: ${servings}.
Ensure accurate step ordering, clear measurements, and practical cooking times.`;

  // Timeout handling with Promise.race / AbortController
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      reject(new Error(`Gemini API request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  const generatePromise = (async () => {
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    return JSON.parse(text);
  })();

  return await Promise.race([generatePromise, timeoutPromise]);
}
