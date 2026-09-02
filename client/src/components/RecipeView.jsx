import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { RecipeRefine } from './RecipeRefine'
import { staggerContainer, platedItem, swapExpand } from '../utils/motion'

function formatQuantity(quantity, scalingFactor, unit) {
  const scaled = quantity * scalingFactor
  if (!scaled || isNaN(scaled)) return '0'

  if (unit?.toLowerCase() === 'whole' || unit?.toLowerCase() === 'piece' || unit?.toLowerCase() === 'count') {
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
  easy: 'bg-sage-600/30 border-sage-500/40 text-sage-400',
  medium: 'bg-mustard-500/20 border-mustard-500/40 text-mustard-400',
  hard: 'bg-terracotta-600/30 border-terracotta-500/40 text-terracotta-400',
}

export function RecipeView({
  recipe,
  onReset,
  onRegenerate,
  onRecipeUpdate,
  isRegenerating = false,
  initialServings,
  initialCompletedSteps,
  initialActiveSwaps,
  onStateChange,
}) {
  const shouldReduceMotion = useReducedMotion()
  const [servings, setServings] = useState(initialServings || recipe?.servings || 2)
  const [completedSteps, setCompletedSteps] = useState(() => new Set(initialCompletedSteps || []))
  const [activeSwaps, setActiveSwaps] = useState(() => new Set(initialActiveSwaps || []))

  const completedStepsArray = React.useMemo(() => Array.from(completedSteps).sort(), [completedSteps])
  const activeSwapsArray = React.useMemo(() => Array.from(activeSwaps).sort(), [activeSwaps])
  const isFirstRender = React.useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (onStateChange) {
      onStateChange({
        servings,
        completedSteps: completedStepsArray,
        activeSwaps: activeSwapsArray,
      })
    }
  }, [servings, completedStepsArray.join(','), activeSwapsArray.join(','), onStateChange])

  useEffect(() => {
    if (recipe && !initialServings) {
      setServings(recipe.servings || 2)
      setCompletedSteps(new Set())
      setActiveSwaps(new Set())
    }
  }, [recipe?.title, initialServings])

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

  const toggleSwap = (ingredientName) => {
    setActiveSwaps((prev) => {
      const next = new Set(prev)
      if (next.has(ingredientName)) {
        next.delete(ingredientName)
      } else {
        next.add(ingredientName)
      }
      return next
    })
  }

  return (
    <Card accent={true} className="w-full space-y-7 sm:space-y-9 overflow-hidden">
      <motion.div
        variants={shouldReduceMotion ? undefined : staggerContainer}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        exit="exit"
        className="space-y-7 sm:space-y-9"
      >
        {/* Top Action Bar */}
        <motion.div
          variants={shouldReduceMotion ? undefined : platedItem}
          className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-b border-kitchen-border pb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="flex items-center justify-center sm:justify-start gap-2 text-parchment-300 hover:text-parchment-100 w-full sm:w-auto"
          >
            <span>←</span>
            <span>Return to Pantry</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center gap-2 shadow-stamp w-full sm:w-auto"
          >
            {isRegenerating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-mustard-400"
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
                <span>Re-firing recipe...</span>
              </>
            ) : (
              <>
                <span>↻</span>
                <span>Regenerate Plate</span>
              </>
            )}
          </Button>
        </motion.div>

        {/* Header Section */}
        <motion.div variants={shouldReduceMotion ? undefined : platedItem} className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`border px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                difficultyStyles[recipe.difficulty] || difficultyStyles.easy
              }`}
            >
              {recipe.difficulty}
            </span>
            {recipe.totalTimeMinutes && (
              <span className="bg-kitchen-card border border-kitchen-border text-parchment-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-stamp">
                <span>⏱</span>
                <span>{recipe.totalTimeMinutes} mins total</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-parchment-100 tracking-tight break-words">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="font-body text-parchment-200 italic text-sm sm:text-base leading-relaxed border-l-2 border-terracotta-500 pl-4 break-words">
              "{recipe.description}"
            </p>
          )}

          {/* Tag Pills */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {recipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-kitchen-card border border-kitchen-border text-xs font-mono px-2.5 py-1 rounded-md text-parchment-300 shadow-stamp"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Interactive Servings Bar with AnimatePresence */}
        <motion.div
          variants={shouldReduceMotion ? undefined : platedItem}
          className="bg-kitchen-bg/80 border border-kitchen-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-parchment-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚖️</span>
                <span>Proportional Brigade Yield</span>
              </span>
              {servings !== baseServings && (
                <span className="text-xs text-mustard-400 font-semibold">
                  (Base: {baseServings})
                </span>
              )}
            </div>
            <p className="text-xs text-parchment-300/70 mt-0.5">
              Ingredients scale proportionally for your table
            </p>
          </div>

          <div className="inline-flex items-center bg-kitchen-card border border-kitchen-border rounded-xl p-1 shadow-stamp self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleServingChange(-1)}
              disabled={servings <= 1}
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
              disabled={servings >= 20}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-parchment-200 hover:bg-kitchen-border/60 hover:text-parchment-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 disabled:opacity-30 transition-all font-bold text-lg select-none touch-manipulation cursor-pointer"
              aria-label="Increase servings"
            >
              +
            </button>
          </div>
        </motion.div>

        {/* Asymmetric Editorial Grid */}
        <motion.div
          variants={shouldReduceMotion ? undefined : platedItem}
          className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 pt-2"
        >
          {/* Left Column: Pantry Tags & Scaled Quantities */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-dashed border-kitchen-border pb-2">
              <h2 className="text-xs sm:text-sm font-bold text-parchment-200 uppercase tracking-wider flex items-center gap-2">
                <span>🧺</span>
                <span>Ingredients &amp; Swaps</span>
              </h2>
              <span className="text-xs text-parchment-300/60 font-mono">
                {recipe.ingredients?.length || 0} items
              </span>
            </div>

            <div className="space-y-3">
              {recipe.ingredients?.map((ing, idx) => {
                const isSwapped = activeSwaps.has(ing.name)
                const scaledQty = formatQuantity(ing.quantity, scalingFactor, ing.unit)

                return (
                  <div
                    key={idx}
                    className="bg-kitchen-card/90 border border-kitchen-border rounded-xl p-3.5 space-y-2 shadow-stamp transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 pr-1">
                        <h3
                          className={`font-semibold text-sm sm:text-base break-words transition-all duration-200 ${
                            isSwapped
                              ? 'line-through text-parchment-300/40 opacity-60'
                              : 'text-parchment-100'
                          }`}
                        >
                          {ing.name}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm font-mono transition-all duration-200 ${
                            isSwapped
                              ? 'line-through text-parchment-300/40 opacity-60'
                              : 'text-mustard-400 font-semibold'
                          }`}
                        >
                          {scaledQty} {ing.unit}
                        </p>
                      </div>

                      {ing.swappable && (
                        <button
                          type="button"
                          onClick={() => toggleSwap(ing.name)}
                          className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-lg border transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard-500 touch-manipulation shrink-0 cursor-pointer ${
                            isSwapped
                              ? 'bg-sage-600 text-parchment-100 border-sage-500 shadow-sm'
                              : 'bg-kitchen-surface text-parchment-200 border-kitchen-border hover:border-kitchen-border/80'
                          }`}
                        >
                          {isSwapped ? '✓ Swapped' : '⇄ Swap'}
                        </button>
                      )}
                    </div>

                    {/* Smooth AnimatePresence for Swap Expansion */}
                    <AnimatePresence>
                      {isSwapped && ing.swapSuggestion && (
                        <motion.div
                          key="swap-box"
                          {...swapExpand}
                          className="overflow-hidden"
                        >
                          <div className="bg-sage-600/20 border border-sage-500/40 rounded-lg p-2.5 text-xs sm:text-sm text-sage-300 space-y-0.5 mt-2">
                            <span className="font-bold text-[11px] uppercase tracking-wider block text-sage-200">
                              Alternative Choice:
                            </span>
                            <p className="break-words">{ing.swapSuggestion}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Step-by-Step Brigade Checklist */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-dashed border-kitchen-border pb-2">
              <h2 className="text-xs sm:text-sm font-bold text-parchment-200 uppercase tracking-wider flex items-center gap-2">
                <span>👨‍🍳</span>
                <span>Brigade Checklist</span>
              </h2>
              <span className="text-xs text-mustard-400 font-mono font-bold">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-kitchen-card h-2 rounded-full overflow-hidden border border-kitchen-border/60">
              <motion.div
                className="bg-gradient-to-r from-terracotta-500 via-mustard-500 to-sage-500 h-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>

            {/* Step Cards with Spring Checkmark Physics */}
            <div className="space-y-3 pt-1">
              {recipe.steps?.map((step) => {
                const isDone = completedSteps.has(step.order)

                return (
                  <motion.div
                    key={step.order}
                    role="checkbox"
                    aria-checked={isDone}
                    tabIndex={0}
                    onClick={() => toggleStep(step.order)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        toggleStep(step.order)
                      }
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`cursor-pointer rounded-xl border p-4 transition-colors duration-200 flex items-start gap-3.5 select-none shadow-stamp touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard-500 focus-visible:ring-offset-2 focus-visible:ring-offset-kitchen-bg ${
                      isDone
                        ? 'bg-kitchen-surface/50 border-kitchen-border/50 text-parchment-300/40'
                        : 'bg-kitchen-card/90 border-kitchen-border hover:border-terracotta-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 shrink-0">
                      <motion.div
                        initial={false}
                        animate={{ scale: isDone ? [0.8, 1.15, 1] : 1 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors duration-200 ${
                          isDone
                            ? 'bg-sage-600 text-parchment-100 shadow-candlelight'
                            : 'bg-kitchen-surface text-terracotta-400 border border-kitchen-border'
                        }`}
                      >
                        {isDone ? '✓' : step.order}
                      </motion.div>
                    </div>

                    <div className="space-y-1 flex-1 pt-2.5">
                      <motion.p
                        animate={{ opacity: isDone ? 0.45 : 1 }}
                        transition={{ duration: 0.15 }}
                        className={`text-sm sm:text-base leading-relaxed break-words ${
                          isDone ? 'line-through' : 'text-parchment-100 font-medium'
                        }`}
                      >
                        {step.instruction}
                      </motion.p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Recipe Refine Section */}
        <motion.div variants={shouldReduceMotion ? undefined : platedItem} className="pt-4 border-t border-dashed border-kitchen-border">
          <RecipeRefine
            currentRecipe={recipe}
            onRefineSuccess={(updated) => {
              if (onRecipeUpdate) {
                onRecipeUpdate(updated)
              }
            }}
          />
        </motion.div>
      </motion.div>
    </Card>
  )
}

export default RecipeView
