import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

function formatQuantity(quantity, scalingFactor, unit) {
  const scaled = quantity * scalingFactor
  if (!scaled || isNaN(scaled)) return '0'

  if (unit?.toLowerCase() === 'whole' || unit?.toLowerCase() === 'piece') {
    return Math.round(scaled * 10) / 10
  }

  const whole = Math.floor(scaled)
  const remainder = scaled - whole

  let fractionStr = ''
  if (Math.abs(remainder - 0.5) < 0.05) fractionStr = '½'
  else if (Math.abs(remainder - 0.25) < 0.05) fractionStr = '¼'
  else if (Math.abs(remainder - 0.75) < 0.05) fractionStr = '¾'
  else if (Math.abs(remainder - 0.33) < 0.05) fractionStr = '⅓'
  else if (Math.abs(remainder - 0.67) < 0.05) fractionStr = '⅔'
  else if (Math.abs(remainder - 0.125) < 0.05) fractionStr = '⅛'

  if (fractionStr) {
    return whole > 0 ? `${whole} ${fractionStr}` : fractionStr
  }

  return Math.round(scaled * 100) / 100
}

const difficultyStyles = {
  easy: 'bg-olive-100 dark:bg-olive-950/60 border-olive-500/30 text-olive-700 dark:text-olive-300',
  medium: 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-500/30 text-amber-800 dark:text-amber-300',
  hard: 'bg-terracotta-100 dark:bg-terracotta-950/60 border-terracotta-500/30 text-terracotta-700 dark:text-terracotta-300',
}

export function RecipeView({
  recipe,
  onReset,
  onRegenerate,
  isRegenerating = false,
}) {
  const [servings, setServings] = useState(recipe?.servings || 2)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [activeSwaps, setActiveSwaps] = useState(new Set())

  useEffect(() => {
    if (recipe?.servings) {
      setServings(recipe.servings)
      setCompletedSteps(new Set())
      setActiveSwaps(new Set())
    }
  }, [recipe])

  if (!recipe) return null

  const baseServings = recipe.servings || 2
  const scalingFactor = servings / baseServings
  const totalSteps = recipe.steps?.length || 0
  const completedCount = completedSteps.size
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

  const handleServingChange = (delta) => {
    setServings((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > 20) return 20
      return next
    })
  }

  const toggleStep = (stepOrder) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(stepOrder)) {
        next.delete(stepOrder)
      } else {
        next.add(stepOrder)
      }
      return next
    })
  }

  const toggleSwap = (ingredientKey) => {
    setActiveSwaps((prev) => {
      const next = new Set(prev)
      if (next.has(ingredientKey)) {
        next.delete(ingredientKey)
      } else {
        next.add(ingredientKey)
      }
      return next
    })
  }

  return (
    <Card accent={true} className="w-full space-y-6 sm:space-y-8 animate-fadeIn overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 dark:border-roast-700 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="flex items-center justify-center sm:justify-start gap-1.5 text-charcoal-700 dark:text-cream-200 hover:text-charcoal-900 dark:hover:text-cream-50 w-full sm:w-auto"
        >
          <span>←</span>
          <span>Back to Pantry</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto"
        >
          {isRegenerating ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-terracotta-600 dark:text-terracotta-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Re-crafting...</span>
            </>
          ) : (
            <>
              <span>↻</span>
              <span>Regenerate</span>
            </>
          )}
        </Button>
      </div>

      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`border px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              difficultyStyles[recipe.difficulty] || difficultyStyles.easy
            }`}
          >
            {recipe.difficulty}
          </span>
          {recipe.totalTimeMinutes && (
            <span className="bg-cream-50 dark:bg-roast-950 border border-cream-300 dark:border-roast-700 text-charcoal-700 dark:text-cream-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span>⏱</span>
              <span>{recipe.totalTimeMinutes} mins</span>
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-cream-50 tracking-tight break-words">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="font-body text-charcoal-700 dark:text-cream-200 italic text-sm sm:text-base leading-relaxed border-l-2 border-terracotta-500 pl-3.5 break-words">
            "{recipe.description}"
          </p>
        )}

        {/* Tag Pills */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {recipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-cream-200/70 dark:bg-roast-800 border border-cream-300 dark:border-roast-700 text-xs font-mono px-2.5 py-1 rounded text-charcoal-700 dark:text-cream-200 break-words"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Servings Bar */}
      <div className="bg-cream-50 dark:bg-roast-950 border border-cream-200 dark:border-roast-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
              Servings Proportions
            </span>
            {servings !== baseServings && (
              <span className="text-xs text-terracotta-600 dark:text-terracotta-400 font-medium">
                (Base {baseServings})
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-500 dark:text-cream-300/70">
            Quantities automatically scale with your serving size
          </p>
        </div>

        <div className="inline-flex items-center bg-cream-100 dark:bg-roast-800 border border-cream-200 dark:border-roast-700 rounded-lg p-1 shadow-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleServingChange(-1)}
            disabled={servings <= 1}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-charcoal-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-roast-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-lg select-none touch-manipulation"
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
            disabled={servings >= 20}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-charcoal-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-roast-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-lg select-none touch-manipulation"
            aria-label="Increase servings"
          >
            +
          </button>
        </div>
      </div>

      {/* Ingredient List with Swaps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider flex items-center gap-1.5">
            <span>🧺</span>
            <span>Ingredients &amp; Smart Swaps</span>
          </h2>
          <span className="text-xs text-charcoal-500 dark:text-cream-300/70 font-mono">
            {recipe.ingredients?.length || 0} items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recipe.ingredients?.map((ing, idx) => {
            const isSwapped = activeSwaps.has(ing.name)
            const scaledQty = formatQuantity(ing.quantity, scalingFactor, ing.unit)

            return (
              <div
                key={idx}
                className="bg-cream-50 dark:bg-roast-950 border border-cream-300 dark:border-roast-700 rounded-lg p-3.5 space-y-2.5 shadow-tactile dark:shadow-none transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 pr-2">
                    <h3
                      className={`font-semibold text-sm sm:text-base break-words transition-all ${
                        isSwapped
                          ? 'line-through text-charcoal-500 dark:text-charcoal-500 opacity-60'
                          : 'text-charcoal-900 dark:text-cream-50'
                      }`}
                    >
                      {ing.name}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm font-mono transition-all ${
                        isSwapped
                          ? 'line-through text-charcoal-500 dark:text-charcoal-500 opacity-60'
                          : 'text-charcoal-700 dark:text-cream-200 font-medium'
                      }`}
                    >
                      {scaledQty} {ing.unit}
                    </p>
                  </div>

                  {ing.swappable && (
                    <button
                      type="button"
                      onClick={() => toggleSwap(ing.name)}
                      className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-md border transition-all active:scale-95 touch-manipulation shrink-0 ${
                        isSwapped
                          ? 'bg-olive-500 dark:bg-olive-600 text-cream-50 border-olive-600 dark:border-olive-500 shadow-sm'
                          : 'bg-cream-100 dark:bg-roast-800 text-charcoal-700 dark:text-cream-200 border-cream-300 dark:border-roast-700 hover:bg-cream-200 dark:hover:bg-roast-700'
                      }`}
                    >
                      {isSwapped ? '✓ Swapped' : '⇄ Swap'}
                    </button>
                  )}
                </div>

                {isSwapped && ing.swapSuggestion && (
                  <div className="bg-olive-100/70 dark:bg-olive-950/60 border border-olive-500/30 dark:border-olive-700/50 rounded-md p-2.5 text-xs sm:text-sm text-olive-800 dark:text-olive-200 animate-fadeIn space-y-0.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-olive-900 dark:text-olive-300">
                      Alternative Choice:
                    </span>
                    <p className="break-words">{ing.swapSuggestion}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Interactive Step Checklist */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1.5 bg-cream-50 dark:bg-roast-950 border border-cream-200 dark:border-roast-700 p-3.5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-200">
            <span>
              Cooking Progress: {completedCount} of {totalSteps} completed
            </span>
            <span className="font-mono text-olive-600 dark:text-olive-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-cream-200 dark:bg-roast-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-olive-500 dark:bg-olive-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {recipe.steps?.map((step) => {
            const isDone = completedSteps.has(step.order)

            return (
              <div
                key={step.order}
                onClick={() => toggleStep(step.order)}
                className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition-all flex items-start gap-3 select-none shadow-tactile dark:shadow-none touch-manipulation active:bg-cream-200/50 dark:active:bg-roast-800/60 ${
                  isDone
                    ? 'bg-cream-200/40 dark:bg-roast-900/40 border-cream-300/80 dark:border-roast-700/60'
                    : 'bg-cream-50 dark:bg-roast-950 border-cream-200 dark:border-roast-700 hover:border-terracotta-500/40 dark:hover:border-terracotta-500/40'
                }`}
              >
                <div className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                      isDone
                        ? 'bg-olive-500 dark:bg-olive-600 text-cream-50'
                        : 'bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-400 border border-terracotta-200 dark:border-terracotta-700/60'
                    }`}
                  >
                    {isDone ? '✓' : step.order}
                  </div>
                </div>

                <div className="space-y-1 flex-1 pt-2.5">
                  <p
                    className={`text-sm sm:text-base leading-relaxed break-words transition-all ${
                      isDone
                        ? 'line-through text-charcoal-500 dark:text-charcoal-500 opacity-60'
                        : 'text-charcoal-900 dark:text-cream-50 font-medium'
                    }`}
                  >
                    {step.instruction}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default RecipeView
