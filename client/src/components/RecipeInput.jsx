import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const PRESETS = [
  {
    label: '🍝 Pasta Night',
    ingredients: 'dry pasta, canned tomatoes, garlic, olive oil, basil, parmesan rind',
    icon: '🍝',
  },
  {
    label: '🍳 Quick Breakfast',
    ingredients: '3 eggs, cheddar cheese, green onion, butter, sourdough bread',
    icon: '🍳',
  },
  {
    label: '🥗 Crisper Clean-out',
    ingredients: 'block of firm tofu, broccoli florets, carrots, soy sauce, sesame oil, chili flakes',
    icon: '🥗',
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

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Card accent={true} className="w-full space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kitchen-card border border-kitchen-border text-terracotta-400 text-xs font-semibold tracking-wider uppercase shadow-stamp">
          <span className="w-2 h-2 rounded-full bg-mustard-500 animate-pulse"></span>
          <span>Open Kitchen Brigade</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-parchment-100 font-bold tracking-tight break-words">
          What are we cooking with tonight?
        </h2>
        <p className="text-parchment-300 text-sm sm:text-base leading-relaxed break-words max-w-xl">
          Enter what’s lingering in your fridge, crisper drawer, or spice rack. Master Chef will craft an inventive, artisanal recipe for your table.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ingredients Textarea */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="ingredients-input"
              className="block text-xs sm:text-sm font-bold text-parchment-200 uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>🔪</span>
              <span>Available Ingredients &amp; Staples</span>
            </label>
            <span className="text-[11px] text-parchment-300/60 hidden sm:inline font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded border border-kitchen-border bg-kitchen-card text-mustard-400 font-mono text-[10px]">Ctrl/⌘ + Enter</kbd> to fire
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
            className="w-full bg-kitchen-bg/90 border border-kitchen-border focus:border-terracotta-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-kitchen-bg rounded-xl p-4 sm:p-5 text-parchment-100 placeholder:text-parchment-300/30 font-mono text-sm sm:text-base leading-relaxed transition-all shadow-inner resize-y min-h-[130px] disabled:opacity-50"
          />

          {/* Helper Validation Note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-1">
            <span
              className={`transition-colors flex items-center gap-1.5 ${
                isValid ? 'text-sage-400 font-medium' : 'text-parchment-300/60'
              }`}
            >
              {isValid ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-400"></span>
                  <span>Ready to fire in the kitchen</span>
                </>
              ) : (
                <span>Add at least a couple of ingredients (min. 4 characters)</span>
              )}
            </span>
            <span className="text-parchment-300/40 font-mono text-[11px]">
              {trimmed.length} characters
            </span>
          </div>
        </div>

        {/* Embossed Kitchen Stamps (Presets) */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs sm:text-sm font-semibold text-parchment-200 block">
            Kitchen Inspiration Stamps:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.ingredients)}
                disabled={isLoading}
                className="min-h-[44px] border border-kitchen-border bg-kitchen-card hover:bg-kitchen-card/90 hover:border-mustard-500/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard-500 focus-visible:ring-offset-2 focus-visible:ring-offset-kitchen-bg transition-all px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-parchment-200 flex items-center gap-2 shadow-stamp disabled:opacity-50 text-left touch-manipulation cursor-pointer"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Control for Servings with AnimatePresence */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-kitchen-border">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-parchment-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>🍽️</span>
              <span>Target Servings</span>
            </label>
            <p className="text-xs text-parchment-300/70">Scale brigade proportions automatically</p>
          </div>

          <div className="inline-flex items-center bg-kitchen-card border border-kitchen-border rounded-xl p-1 shadow-stamp self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleServingChange(-1)}
              disabled={servings <= 1 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-parchment-200 hover:bg-kitchen-border/60 hover:text-parchment-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
              aria-label="Decrease servings"
            >
              −
            </button>
            <div className="w-14 text-center font-display font-bold text-mustard-400 text-xl select-none overflow-hidden h-7 flex items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={servings}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {servings}
                </motion.span>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => handleServingChange(1)}
              disabled={servings >= 12 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-parchment-200 hover:bg-kitchen-border/60 hover:text-parchment-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
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
            className="w-full flex items-center justify-center gap-2.5 font-bold"
          >
            <span>🔥</span>
            <span>Create Master Chef Recipe</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RecipeInput
