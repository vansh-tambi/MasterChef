import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const PRESETS = [
  {
    label: '🍝 Pasta Night',
    ingredients: 'dry pasta, canned tomatoes, garlic, olive oil, basil, parmesan rind',
  },
  {
    label: '🍳 Quick Breakfast',
    ingredients: '3 eggs, cheddar cheese, green onion, butter, sourdough bread',
  },
  {
    label: '🥗 Crisper Clean-out',
    ingredients: 'block of firm tofu, broccoli florets, carrots, soy sauce, sesame oil, chili flakes',
  },
]

export function RecipeInput({
  onSubmit,
  isLoading = false,
  initialIngredients = '',
  initialServings = 2,
}) {
  const [ingredients, setIngredients] = useState(
    Array.isArray(initialIngredients) ? initialIngredients.join(', ') : initialIngredients
  )
  const [servings, setServings] = useState(initialServings || 2)

  const textareaRef = useRef(null)

  useEffect(() => {
    if (initialIngredients) {
      setIngredients(
        Array.isArray(initialIngredients) ? initialIngredients.join(', ') : initialIngredients
      )
    }
    if (initialServings) {
      setServings(initialServings)
    }
  }, [initialIngredients, initialServings])

  const trimmed = ingredients.trim()
  const isValid = trimmed.length >= 4

  const handlePresetClick = (presetText) => {
    setIngredients(presetText)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleServingChange = (delta) => {
    setServings((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > 12) return 12
      return next
    })
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (!isValid || isLoading) return

    const ingredientList = ingredients
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    if (onSubmit) {
      onSubmit({
        ingredients: ingredientList,
        servings,
      })
    }
  }

  // Keyboard shortcut: Cmd/Ctrl + Enter triggers form submission
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Card accent={true} className="w-full space-y-6 animate-fadeIn transition-all duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-terracotta-100 dark:bg-terracotta-900/40 border border-terracotta-200 dark:border-terracotta-700/60 text-terracotta-700 dark:text-terracotta-400 text-xs font-semibold tracking-wide uppercase">
          <span>🥘</span>
          <span>Pantry to Plate</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-charcoal-900 dark:text-cream-50 font-bold tracking-tight break-words">
          What are we cooking with?
        </h2>
        <p className="text-charcoal-700 dark:text-cream-200 text-sm sm:text-base leading-relaxed break-words">
          Tell us what's lingering in your fridge, crisper drawer, or spice rack. We'll turn it into tonight's dinner.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ingredients Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="ingredients-input"
              className="block text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider"
            >
              Available Ingredients &amp; Staples
            </label>
            <span className="text-[11px] text-charcoal-500 dark:text-cream-300/70 hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded border border-cream-300 dark:border-roast-700 bg-cream-100 dark:bg-roast-800 font-mono text-[10px]">Ctrl/⌘ + Enter</kbd> to cook
            </span>
          </div>
          <textarea
            id="ingredients-input"
            ref={textareaRef}
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="e.g., chicken thighs, baby spinach, minced garlic, leftover cooked jasmine rice, soy sauce, a knob of ginger..."
            className="w-full bg-cream-50 dark:bg-roast-950 border border-cream-200 dark:border-roast-700 focus:border-terracotta-500 dark:focus:border-terracotta-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-roast-900 rounded-lg p-3.5 sm:p-4 text-charcoal-900 dark:text-cream-50 placeholder:text-charcoal-500/70 dark:placeholder:text-charcoal-500 font-body text-base leading-relaxed transition-all shadow-inner outline-none resize-y min-h-[120px] disabled:opacity-60 disabled:cursor-not-allowed"
          />

          {/* Helper Note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-1">
            <span
              className={`transition-colors ${
                isValid ? 'text-olive-600 dark:text-olive-400 font-medium' : 'text-charcoal-500 dark:text-cream-300/70'
              }`}
            >
              {isValid
                ? '✓ Ready to compose your recipe'
                : 'Add at least a couple of ingredients (min. 4 chars)'}
            </span>
            <span className="text-charcoal-500 dark:text-cream-300/70 font-mono text-[11px]">
              {trimmed.length} chars
            </span>
          </div>
        </div>

        {/* Clickable Inspiration Presets */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs sm:text-sm font-semibold text-charcoal-700 dark:text-cream-200 block">
            Quick Inspiration Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.ingredients)}
                disabled={isLoading}
                className="min-h-[44px] border border-cream-300 dark:border-roast-700 bg-cream-50 dark:bg-roast-800 hover:bg-cream-200/80 dark:hover:bg-roast-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-roast-900 transition-all px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-charcoal-700 dark:text-cream-200 flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:pointer-events-none text-left touch-manipulation"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Control for Servings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-cream-200 dark:border-roast-700">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
              Target Servings
            </label>
            <p className="text-xs text-charcoal-500 dark:text-cream-300/70">Scale proportions for the table</p>
          </div>

          <div className="inline-flex items-center bg-cream-50 dark:bg-roast-950 border border-cream-200 dark:border-roast-700 rounded-lg p-1 shadow-sm self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleServingChange(-1)}
              disabled={servings <= 1 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-charcoal-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-roast-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-lg select-none touch-manipulation"
              aria-label="Decrease servings"
            >
              −
            </button>
            <div className="w-12 text-center font-display font-bold text-charcoal-900 dark:text-cream-50 text-lg select-none">
              {servings}
            </div>
            <button
              type="button"
              onClick={() => handleServingChange(1)}
              disabled={servings >= 12 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-charcoal-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-roast-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-lg select-none touch-manipulation"
              aria-label="Increase servings"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid || isLoading}
            className="w-full flex items-center justify-center gap-2 text-base"
          >
            <span>Create Recipe from Ingredients</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RecipeInput
