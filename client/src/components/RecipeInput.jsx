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

  const formattedServings = String(servings).padStart(2, '0')

  return (
    <Card accent={true} badge="INVENTORY // SPEC 01" className="w-full space-y-6 sm:space-y-7">
      {/* Structural Header Band */}
      <div className="space-y-2 border-b-2 border-panel-border pb-4 -mx-5 sm:-mx-8 px-5 sm:px-8 bg-elevated/40">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface border-2 border-panel-border text-ember-500 text-xs font-mono font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_rgba(26,29,32,0.12)] dark:shadow-[2px_2px_0px_0px_#2D323B]">
            <span className="w-2 h-2 rounded-none bg-brass-500 animate-pulse"></span>
            <span>Pantry to Plate</span>
          </div>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-bold tracking-tight break-words pt-1">
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
              className="block text-xs font-mono font-bold text-ink uppercase tracking-wider"
            >
              Ingredients
            </label>
            <span className="text-[11px] text-ink-muted hidden sm:inline font-mono">
              <kbd className="px-2 py-0.5 rounded-sm border-2 border-panel-border bg-elevated text-brass-500 font-mono text-[10px] font-bold shadow-[1px_1px_0px_0px_rgba(26,29,32,0.1)]">Ctrl/⌘ + Enter</kbd>
            </span>
          </div>

          <div className="relative rounded-md border-2 border-panel-border bg-surface dark:bg-elevated overflow-hidden shadow-inner focus-within:border-ember-500 transition-all">
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
          <div className="flex items-center justify-between text-xs px-1 font-mono">
            <span
              className={`transition-colors font-bold ${
                isValid ? 'text-rosemary-500' : 'text-ink-muted'
              }`}
            >
              {isValid ? '✓ Ready' : 'Min. 4 characters'}
            </span>
            <span className="text-ink-muted/60 text-[11px]">
              {trimmed.length} chars
            </span>
          </div>
        </div>

        {/* Quick Ideas Presets */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-mono font-bold text-ink-secondary uppercase tracking-wider block">
            Quick Ideas
          </span>

          <div className="flex flex-wrap gap-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.ingredients)}
                disabled={isLoading}
                className="min-h-[38px] border-2 border-panel-border bg-elevated hover:bg-surface hover:border-ember-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all px-3.5 py-1.5 rounded-md text-xs font-mono font-bold text-ink-secondary hover:text-ink flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(26,29,32,0.1)] dark:shadow-[2px_2px_0px_0px_#2D323B] disabled:opacity-50 text-left touch-manipulation cursor-pointer"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mechanical Servings Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t-2 border-panel-border">
          <div>
            <label className="block text-xs font-mono font-bold text-ink uppercase tracking-wider">
              Servings
            </label>
          </div>

          <div className="inline-flex items-center gap-2 bg-elevated border-2 border-panel-border rounded-md p-1.5 shadow-[3px_3px_0px_0px_rgba(26,29,32,0.08)] dark:shadow-[3px_3px_0px_0px_#000] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleServingChange(-1)}
              disabled={servings <= 1 || isLoading}
              className="w-9 h-9 flex items-center justify-center rounded-sm border-2 border-panel-border bg-surface text-ink font-mono font-bold text-base hover:border-ember-500 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1px_1px_0px_0px_rgba(26,29,32,0.15)] dark:shadow-[1px_1px_0px_0px_#000] disabled:opacity-30 transition-all select-none touch-manipulation cursor-pointer"
              aria-label="Decrease servings"
            >
              −
            </button>
            
            <div className="px-3 py-1 font-mono font-bold text-xs sm:text-sm tracking-wider text-brass-500 select-none overflow-hidden h-7 flex items-center justify-center min-w-[110px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={servings}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {formattedServings} PORTIONS
                </motion.span>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => handleServingChange(1)}
              disabled={servings >= 12 || isLoading}
              className="w-9 h-9 flex items-center justify-center rounded-sm border-2 border-panel-border bg-surface text-ink font-mono font-bold text-base hover:border-ember-500 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1px_1px_0px_0px_rgba(26,29,32,0.15)] dark:shadow-[1px_1px_0px_0px_#000] disabled:opacity-30 transition-all select-none touch-manipulation cursor-pointer"
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
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Cooking...</span> : <span>Get Recipe</span>}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RecipeInput
