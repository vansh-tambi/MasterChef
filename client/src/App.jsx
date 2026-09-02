import { useEffect, useState } from 'react'
import { Button } from './components/ui/Button'
import { Card } from './components/ui/Card'

function App() {
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    fetch('/api/recipe', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        console.log('Recipe endpoint response:', data)
        setRecipe(data)
      })
      .catch((err) => console.error('Error fetching recipe:', err))
  }, [])

  return (
    <main className="min-h-screen bg-cream-50 text-charcoal-900 font-body p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 font-bold tracking-tight">
            Artisanal Kitchen Notebook
          </h1>
          <p className="text-charcoal-700 text-base font-medium">
            Design Tokens &amp; Tactile UI Primitives Showcase
          </p>
        </header>

        {/* Recipe Showroom Card */}
        <Card accent={true} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-cream-200 pb-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-terracotta-600 uppercase">
                Featured Recipe
              </span>
              <h2 className="font-display text-2xl text-charcoal-900 font-semibold mt-0.5">
                {recipe ? recipe.title : 'Rustic Tomato Garlic Pasta'}
              </h2>
            </div>
            <span className="self-start sm:self-auto bg-terracotta-100 border border-terracotta-200 text-terracotta-700 text-xs font-semibold px-3 py-1 rounded-full">
              {recipe ? `${recipe.prepTime} prep · ${recipe.cookTime} cook` : '10 mins prep · 15 mins cook'}
            </span>
          </div>

          {/* Pantry Tags */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Pantry Ingredients (Paper Labels)
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Fresh Tomatoes', 'Garlic Cloves', 'Extra Virgin Olive Oil', 'Rigatoni', 'Fresh Basil'].map((item) => (
                <span
                  key={item}
                  className="border border-cream-300 bg-cream-50 px-2.5 py-1 rounded-md text-xs font-mono text-charcoal-700 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-olive-500"></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Button Variants Showroom */}
          <div className="space-y-3 pt-2 border-t border-cream-200">
            <h3 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Tactile Button Variants
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Terracotta</Button>
              <Button variant="secondary">Secondary Olive</Button>
              <Button variant="outline">Outline Cream</Button>
              <Button variant="ghost">Ghost Charcoal</Button>
            </div>
          </div>

          <p className="text-xs text-charcoal-500 italic pt-2">
            Tip: Click buttons to test active press micro-interactions (<code className="font-mono text-terracotta-600">active:scale-[0.98]</code>).
          </p>
        </Card>
      </div>
    </main>
  )
}

export default App
