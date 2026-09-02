import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const PRESETS = [
  {
    label: 'Pasta Night',
    ingredients: 'dry pasta, canned tomatoes, garlic, olive oil, basil, parmesan rind',
    icon: '🍝',
    note: 'classic pantry',
  },
  {
    label: 'Quick Breakfast',
    ingredients: '3 eggs, cheddar cheese, green onion, butter, sourdough bread',
    icon: '🍳',
    note: '10 min prep',
  },
  {
    label: 'Crisper Clean-out',
    ingredients: 'block of firm tofu, broccoli florets, carrots, soy sauce, sesame oil, chili flakes',
    icon: '🥗',
    note: 'zero waste',
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
      {/* Marquee Serial Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-kitchen-border pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kitchen-card border border-kitchen-border text-terracotta-400 text-xs font-semibold tracking-wider uppercase shadow-stamp">
            <span className="w-2 h-2 rounded-full bg-mustard-500 animate-pulse"></span>
            <span>Brigade De Cuisine</span>
          </div>
          <span className="font-mono text-[11px] text-parchment-300/60 uppercase tracking-widest">
            SPEC NO. 01 ◆ SERVICE 2026
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-parchment-100 font-bold tracking-tight break-words">
          What are we cooking with tonight?
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <p className="text-parchment-300 text-sm sm:text-base leading-relaxed break-words max-w-xl">
            Enter what’s in your fridge, crisper, or spice rack. Master Chef will craft an inventive recipe.
          </p>
          <span className="font-hand text-lg sm:text-xl text-mustard-400 rotate-[-1deg] shrink-0">
            * no ingredient too humble!
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Head Chef's Lined Prep Pad */}
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

          <div className="relative rounded-xl border border-kitchen-border bg-kitchen-bg/95 overflow-hidden shadow-inner focus-within:border-terracotta-500">
            <textarea
              id="ingredients-input"
              ref={textareaRef}
              rows={4}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="e.g., chicken thighs, baby spinach, minced garlic, leftover cooked jasmine rice, soy sauce, a knob of ginger..."
              className="w-full bg-transparent p-4 sm:p-5 text-parchment-100 placeholder:text-parchment-300/30 font-mono text-sm sm:text-base leading-[28px] ledger-lines outline-none resize-y min-h-[140px] disabled:opacity-50"
            />
          </div>

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
                  <span>Ready to fire on the brigade line</span>
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

        {/* Textured Hanging Butcher Jar Tags (Presets) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-parchment-200 block">
              Pantry Jar Tags:
            </span>
            <span className="font-hand text-sm text-parchment-300 rotate-1">
              click to fill prep pad
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.ingredients)}
                disabled={isLoading}
                className="relative min-h-[44px] border border-kitchen-border bg-kitchen-card hover:bg-kitchen-card/90 hover:border-mustard-500/60 active:scale-[0.98] transition-all px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-parchment-200 flex items-center gap-2.5 shadow-butcher-tag disabled:opacity-50 text-left touch-manipulation cursor-pointer group"
              >
                {/* Simulated Tag Hole Punch */}
                <span className="w-2 h-2 rounded-full bg-kitchen-bg border border-kitchen-border group-hover:border-mustard-500/50"></span>
                <span>{preset.icon}</span>
                <span className="font-semibold">{preset.label}</span>
                <span className="text-[10px] font-mono text-mustard-400/80 bg-kitchen-bg px-1.5 py-0.5 rounded border border-kitchen-border/70">
                  {preset.note}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Vintage Line-Ticket Servings Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-kitchen-border">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-parchment-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>🍽️</span>
              <span>Target Servings (Plates)</span>
            </label>
            <p className="text-xs text-parchment-300/70">Scale brigade proportions automatically</p>
          </div>

          <div className="inline-flex items-center bg-kitchen-bg border border-kitchen-border rounded-xl p-1.5 shadow-brass-dial self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleServingChange(-1)}
              disabled={servings <= 1 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-parchment-200 hover:bg-kitchen-card hover:text-parchment-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
              aria-label="Decrease servings"
            >
              −
            </button>
            <div className="w-16 text-center font-mono font-bold text-mustard-400 text-xl select-none overflow-hidden h-7 flex items-center justify-center tracking-widest drop-shadow-[0_0_8px_rgba(217,155,38,0.4)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={servings}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {String(servings).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => handleServingChange(1)}
              disabled={servings >= 12 || isLoading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-parchment-200 hover:bg-kitchen-card hover:text-parchment-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
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
            <span>Fire Master Chef Recipe</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RecipeInput
