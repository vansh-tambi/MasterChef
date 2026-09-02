import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

/**
 * Rounds and formats scaled quantities for clean cooking fractions/decimals
 */
function formatQuantity(quantity, scalingFactor, unit) {
  const scaled = quantity * scalingFactor
  if (!scaled || isNaN(scaled)) return '0'

  // If whole unit or near-integer, round cleanly
  if (unit?.toLowerCase() === 'whole' || unit?.toLowerCase() === 'piece') {
    return Math.round(scaled * 10) / 10
  }

  // Fraction approximations for common cooking measurements
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

  // Fallback to max 2 decimal places without trailing zeros
  return Math.round(scaled * 100) / 100
}

const difficultyStyles = {
  easy: 'bg-olive-100 border-olive-500/30 text-olive-700',
  medium: 'bg-amber-100/70 border-amber-500/30 text-amber-800',
  hard: 'bg-terracotta-100 border-terracotta-500/30 text-terracotta-700',
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

  // Reset local state if a new recipe payload comes in
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
    <Card accent={true} className="w-full max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-cream-200 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="flex items-center gap-1.5 text-charcoal-700 hover:text-charcoal-900"
        >
          <span>←</span>
          <span>Back to Pantry</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-1.5 shadow-sm"
        >
          {isRegenerating ? (
            <>
              <svg
                className="animate-spin h-3.5 w-3.5 text-terracotta-600"
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
            className={`border px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
              difficultyStyles[recipe.difficulty] || difficultyStyles.easy
            }`}
          >
            {recipe.difficulty}
          </span>
          {recipe.totalTimeMinutes && (
            <span className="bg-cream-50 border border-cream-300 text-charcoal-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <span>⏱</span>
              <span>{recipe.totalTimeMinutes} mins</span>
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 tracking-tight">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="font-body text-charcoal-700 italic text-base leading-relaxed border-l-2 border-terracotta-500 pl-3.5">
            "{recipe.description}"
          </p>
        )}

        {/* Tag Pills */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {recipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-cream-200/70 border border-cream-300 text-[11px] font-mono px-2 py-0.5 rounded text-charcoal-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Servings Bar */}
      <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Servings Proportions
            </span>
            {servings !== baseServings && (
              <span className="text-[11px] text-terracotta-600 font-medium">
                (Scaled from base {baseServings})
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-500">
            Quantities automatically scale with your serving size
          </p>
        </div>

        <div className="inline-flex items-center bg-cream-100 border border-cream-200 rounded-lg p-1 shadow-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleServingChange(-1)}
            disabled={servings <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-md text-charcoal-700 hover:bg-cream-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-base select-none"
            aria-label="Decrease servings"
          >
            −
          </button>
          <div className="w-12 text-center font-display font-bold text-charcoal-900 text-lg select-none">
            {servings}
          </div>
          <button
            type="button"
            onClick={() => handleServingChange(1)}
            disabled={servings >= 20}
            className="w-8 h-8 flex items-center justify-center rounded-md text-charcoal-700 hover:bg-cream-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-base select-none"
            aria-label="Increase servings"
          >
            +
          </button>
        </div>
      </div>

      {/* Ingredient List with Swaps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🧺</span>
            <span>Ingredients &amp; Smart Swaps</span>
          </h2>
          <span className="text-xs text-charcoal-500 font-mono">
            {recipe.ingredients?.length || 0} items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recipe.ingredients?.map((ing, idx) => {
            const isSwapped = activeSwaps.has(ing.name)
            const scaledQty = formatQuantity(ing.quantity, scalingFactor, ing.unit)

            return (
              <div
                key={idx}
                className="bg-cream-50 border border-cream-300 rounded-lg p-3.5 space-y-2 shadow-tactile transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className={`font-semibold text-sm transition-all ${
                        isSwapped
                          ? 'line-through text-charcoal-500 opacity-60'
                          : 'text-charcoal-900'
                      }`}
                    >
                      {ing.name}
                    </h3>
                    <p
                      className={`text-xs font-mono transition-all ${
                        isSwapped
                          ? 'line-through text-charcoal-500 opacity-60'
                          : 'text-charcoal-700 font-medium'
                      }`}
                    >
                      {scaledQty} {ing.unit}
                    </p>
                  </div>

                  {ing.swappable && (
                    <button
                      type="button"
                      onClick={() => toggleSwap(ing.name)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-md border transition-all active:scale-95 ${
                        isSwapped
                          ? 'bg-olive-500 text-cream-50 border-olive-600 shadow-sm'
                          : 'bg-cream-100 text-charcoal-700 border-cream-300 hover:bg-cream-200'
                      }`}
                    >
                      {isSwapped ? '✓ Swapped' : '⇄ Swap'}
                    </button>
                  )}
                </div>

                {isSwapped && ing.swapSuggestion && (
                  <div className="bg-olive-100/70 border border-olive-500/30 rounded-md p-2 text-xs text-olive-800 animate-fadeIn space-y-0.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-olive-900">
                      Alternative Choice:
                    </span>
                    <p>{ing.swapSuggestion}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Interactive Step Checklist */}
      <div className="space-y-4 pt-2">
        {/* Progress Meter */}
        <div className="space-y-1.5 bg-cream-50 border border-cream-200 p-3.5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-700">
            <span>
              Cooking Progress: {completedCount} of {totalSteps} completed
            </span>
            <span className="font-mono text-olive-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-olive-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Cards */}
        <div className="space-y-2.5">
          {recipe.steps?.map((step) => {
            const isDone = completedSteps.has(step.order)

            return (
              <div
                key={step.order}
                onClick={() => toggleStep(step.order)}
                className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3.5 select-none shadow-tactile ${
                  isDone
                    ? 'bg-cream-200/40 border-cream-300/80'
                    : 'bg-cream-50 border-cream-200 hover:border-terracotta-500/40'
                }`}
              >
                {/* Step Number / Checkbox Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                    isDone
                      ? 'bg-olive-500 text-cream-50'
                      : 'bg-terracotta-100 text-terracotta-700 border border-terracotta-200'
                  }`}
                >
                  {isDone ? '✓' : step.order}
                </div>

                <div className="space-y-1 flex-1">
                  <p
                    className={`text-sm leading-relaxed transition-all ${
                      isDone
                        ? 'line-through text-charcoal-500 opacity-60'
                        : 'text-charcoal-900 font-medium'
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
