import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const PRESETS = [
  {
    label: 'Pasta',
    ingredients: 'dry pasta, canned tomatoes, garlic, olive oil, basil, parmesan rind',
    icon: '🍝',
  },
  {
    label: 'Eggs & Toast',
    ingredients: '3 eggs, cheddar cheese, green onion, butter, sourdough bread',
    icon: '🍳',
  },
  {
    label: 'Tofu & Veggies',
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
    <Card accent={true} className="w-full space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-panel-border pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-panel-border text-ember-500 text-xs font-semibold tracking-wider uppercase shadow-stamp">
            <span className="w-2 h-2 rounded-full bg-brass-500 animate-pulse"></span>
            <span>Pantry to Plate</span>
          </div>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-bold tracking-tight break-words">
          Your Ingredients
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ingredients Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="ingredients-input"
              className="block text-xs sm:text-sm font-bold text-ink-secondary uppercase tracking-wider"
            >
              Ingredients
            </label>
            <span className="text-[11px] text-ink-muted hidden sm:inline font-mono">
              <kbd className="px-1.5 py-0.5 rounded border border-panel-border bg-elevated text-brass-500 font-mono text-[10px]">Ctrl/⌘ + Enter</kbd>
            </span>
          </div>

          <div className="relative rounded-xl border border-panel-border bg-surface overflow-hidden shadow-sm focus-within:border-ember-500 focus-within:ring-1 focus-within:ring-ember-500 transition-all">
            <textarea
              id="ingredients-input"
              ref={textareaRef}
              rows={4}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Chicken, spinach, garlic, rice, soy sauce..."
              className="w-full bg-transparent p-4 sm:p-5 text-ink placeholder:text-ink-muted/40 font-mono text-sm sm:text-base leading-[28px] ledger-lines outline-none resize-y min-h-[120px] disabled:opacity-50"
            />
          </div>

          {/* Helper Validation Note */}
          <div className="flex items-center justify-between text-xs px-1">
            <span
              className={`transition-colors ${
                isValid ? 'text-rosemary-500 font-medium' : 'text-ink-muted'
              }`}
            >
              {isValid ? '✓ Ready' : 'Min. 4 characters'}
            </span>
            <span className="text-ink-muted/50 font-mono text-[11px]">
              {trimmed.length} chars
            </span>
          </div>
        </div>

        {/* Quick Ideas Presets */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider block">
            Quick Ideas
          </span>

          <div className="flex flex-wrap gap-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.ingredients)}
                disabled={isLoading}
                className="min-h-[44px] border border-panel-border bg-elevated hover:border-ember-500/60 active:scale-[0.98] transition-all px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-ink-secondary flex items-center gap-2 shadow-tag disabled:opacity-50 text-left touch-manipulation cursor-pointer"
              >
                <span>{preset.icon}</span>
                <span className="font-semibold">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Servings Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-panel-border">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-ink-secondary uppercase tracking-wider">
              Servings
            </label>
          </div>

          <div className="inline-flex items-center bg-canvas border border-panel-border rounded-xl p-1 shadow-dial self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleServingChange(-1)}
              disabled={servings <= 1 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-ink-secondary hover:bg-elevated hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
              aria-label="Decrease servings"
            >
              −
            </button>
            <div className="w-14 text-center font-mono font-bold text-brass-500 text-lg select-none overflow-hidden h-7 flex items-center justify-center tracking-wider">
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
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-ink-secondary hover:bg-elevated hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
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
            className="w-full flex items-center justify-center gap-2 font-bold"
          >
            {isLoading ? <span>Cooking...</span> : <span>Get Recipe</span>}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RecipeInput
