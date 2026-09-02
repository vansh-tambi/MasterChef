import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/recipe', (req, res) => {
  res.json({
    id: "recipe-mock-1",
    title: "Rustic Tomato Garlic Pasta",
    prepTime: "10 mins",
    cookTime: "15 mins",
    servings: 2,
    ingredients: [
      { name: "Pasta", amount: 200, unit: "g", substitute: "Zucchini noodles" },
      { name: "Garlic", amount: 3, unit: "cloves", substitute: "Garlic powder" },
      { name: "Olive Oil", amount: 2, unit: "tbsp", substitute: "Butter" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Boil pasta in salted water until al dente." },
      { stepNumber: 2, instruction: "Sauté sliced garlic in olive oil over low heat." },
      { stepNumber: 3, instruction: "Toss drained pasta with garlic oil and serve." }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
