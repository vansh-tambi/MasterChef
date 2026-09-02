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
  easy: 'bg-rosemary-500/15 border-2 border-rosemary-600/40 text-rosemary-500',
  medium: 'bg-brass-500/15 border-2 border-brass-600/40 text-brass-500',
  hard: 'bg-ember-500/15 border-2 border-ember-600/40 text-ember-500',
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
  const formattedServings = String(servings).padStart(2, '0')

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
    <Card accent={true} badge="BRIGADE SPEC // LIVE" className="w-full space-y-7 sm:space-y-9 overflow-hidden">
      <motion.div
        variants={shouldReduceMotion ? undefined : staggerContainer}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        exit="exit"
        className="space-y-7 sm:space-y-8"
      >
        {/* Top Structural Action Bar */}
        <motion.div
          variants={shouldReduceMotion ? undefined : platedItem}
          className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-panel-border pb-4 -mx-5 sm:-mx-8 px-5 sm:px-8 bg-elevated/40"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="flex items-center justify-center sm:justify-start gap-2 text-ink-muted hover:text-ink w-full sm:w-auto"
          >
            <span>←</span>
            <span>New Recipe</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {isRegenerating ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-brass-500"
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
                <span>Re-rolling...</span>
              </>
            ) : (
              <>
                <span>↻</span>
                <span>Re-roll</span>
              </>
            )}
          </Button>
        </motion.div>

        {/* Header Section */}
        <motion.div variants={shouldReduceMotion ? undefined : platedItem} className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-2.5 py-0.5 rounded-sm text-[11px] font-mono font-bold uppercase tracking-wider ${
                difficultyStyles[recipe.difficulty] || difficultyStyles.easy
              }`}
            >
              {recipe.difficulty}
            </span>
            {recipe.totalTimeMinutes && (
              <span className="bg-elevated border-2 border-panel-border text-ink-secondary text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-sm flex items-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(26,29,32,0.1)]">
                <span>⏱</span>
                <span>{recipe.totalTimeMinutes} mins</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight break-words">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="font-body text-ink-secondary italic text-sm sm:text-base leading-relaxed border-l-4 border-ember-500 pl-4 break-words">
              "{recipe.description}"
            </p>
          )}

          {/* Tag Pills */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {recipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-elevated border border-panel-border text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm text-ink-muted shadow-[1px_1px_0px_0px_rgba(26,29,32,0.06)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Asymmetric 12-Column Layout (4 Cols Ingredients Sidebar, 8 Cols Timeline) */}
        <motion.div
          variants={shouldReduceMotion ? undefined : platedItem}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-2 items-start"
        >
          {/* LEFT 4-COL SIDEBAR: Scaled Servings & Pantry Inventory */}
          <div className="lg:col-span-5 space-y-6">
            {/* Servings Mechanical Stepper Card */}
            <div className="bg-elevated/70 border-2 border-panel-border rounded-lg p-4 space-y-3 shadow-[3px_3px_0px_0px_rgba(26,29,32,0.06)] dark:shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <span>🍽️</span>
                  <span>Servings</span>
                </span>
                <span className="text-[11px] text-brass-500 font-mono font-bold">
                  Base: {baseServings}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-surface border-2 border-panel-border rounded-md p-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleServingChange(-1)}
                  disabled={servings <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border-2 border-panel-border bg-elevated text-ink font-mono font-bold text-base hover:border-ember-500 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1px_1px_0px_0px_rgba(26,29,32,0.12)] disabled:opacity-30 transition-all select-none touch-manipulation cursor-pointer"
                  aria-label="Decrease servings"
                >
                  −
                </button>

                <div className="font-mono font-bold text-xs sm:text-sm tracking-wider text-brass-500 select-none overflow-hidden h-7 flex items-center justify-center">
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
                  disabled={servings >= 20}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border-2 border-panel-border bg-elevated text-ink font-mono font-bold text-base hover:border-ember-500 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1px_1px_0px_0px_rgba(26,29,32,0.12)] disabled:opacity-30 transition-all select-none touch-manipulation cursor-pointer"
                  aria-label="Increase servings"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ingredients Pantry Inventory */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-panel-border pb-2">
                <h2 className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                  <span>🧺</span>
                  <span>Ingredients</span>
                </h2>
                <span className="text-xs text-ink-muted font-mono font-bold">
                  {recipe.ingredients?.length || 0} ITEMS
                </span>
              </div>

              <div className="space-y-2.5">
                {recipe.ingredients?.map((ing, idx) => {
                  const isSwapped = activeSwaps.has(ing.name)
                  const scaledQty = formatQuantity(ing.quantity, scalingFactor, ing.unit)

                  return (
                    <div
                      key={idx}
                      className="bg-surface border-2 border-panel-border rounded-md p-3 space-y-2 shadow-[2px_2px_0px_0px_rgba(26,29,32,0.06)] dark:shadow-[2px_2px_0px_0px_#181B20] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1 pr-1">
                          <h3
                            className={`font-mono text-xs sm:text-sm font-bold break-words transition-all duration-200 ${
                              isSwapped
                                ? 'hand-strike text-ink-muted/40 opacity-60'
                                : 'text-ink'
                            }`}
                          >
                            {ing.name}
                          </h3>
                          <p
                            className={`text-xs font-mono font-bold transition-all duration-200 ${
                              isSwapped
                                ? 'line-through text-ink-muted/40 opacity-60'
                                : 'text-brass-500'
                            }`}
                          >
                            {scaledQty} {ing.unit}
                          </p>
                        </div>

                        {ing.swappable && (
                          <button
                            type="button"
                            onClick={() => toggleSwap(ing.name)}
                            className={`min-h-[32px] px-2.5 py-1 text-[11px] font-mono font-bold rounded-sm border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 touch-manipulation shrink-0 cursor-pointer shadow-[2px_2px_0px_0px_rgba(26,29,32,0.15)] dark:shadow-[2px_2px_0px_0px_#000] ${
                              isSwapped
                                ? 'bg-rosemary-500 text-white border-rosemary-700'
                                : 'bg-elevated text-ink border-panel-border hover:border-ember-500'
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
                            <div className="bg-rosemary-500/10 border-2 border-rosemary-500/30 rounded-sm p-2.5 text-xs text-rosemary-400 space-y-0.5 mt-2">
                              <span className="font-mono font-bold text-[10px] uppercase tracking-wider block text-rosemary-500">
                                Swap Choice:
                              </span>
                              <p className="font-body break-words">{ing.swapSuggestion}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 7-COL PANE: Connected Industrial Step Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-panel-border pb-2">
              <h2 className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span>👨‍🍳</span>
                <span>Steps</span>
              </h2>
              <span className="text-xs font-mono font-bold text-brass-500 bg-elevated border border-panel-border px-2 py-0.5 rounded-sm shadow-[1px_1px_0px_0px_rgba(26,29,32,0.06)]">
                {completedCount} / {totalSteps} done
              </span>
            </div>

            {/* Solid Progress Bar */}
            <div className="w-full bg-elevated h-2 rounded-sm overflow-hidden border-2 border-panel-border">
              <motion.div
                className="bg-gradient-to-r from-ember-500 via-brass-500 to-rosemary-500 h-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>

            {/* Prep Timeline with Connecting Dashed Guideline */}
            <div className="border-l-2 border-dashed border-panel-border ml-4 sm:ml-5 pl-6 sm:pl-7 relative space-y-5 pt-3">
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
                    className={`relative cursor-pointer rounded-md border-2 p-4 transition-all duration-150 select-none shadow-[2px_2px_0px_0px_rgba(26,29,32,0.08)] dark:shadow-[2px_2px_0px_0px_#181B20] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 ${
                      isDone
                        ? 'bg-surface/50 border-panel-border/60 text-ink-muted'
                        : 'bg-surface border-panel-border hover:border-ember-500'
                    }`}
                  >
                    {/* Monospace Step Badge that bleeds over the timeline line */}
                    <div
                      className={`absolute -left-[35px] sm:-left-[39px] top-3.5 w-7 h-7 sm:w-8 sm:h-8 font-mono font-bold text-xs flex items-center justify-center rounded-sm border-2 transition-all shadow-[1px_1px_0px_0px_rgba(26,29,32,0.2)] dark:shadow-[1px_1px_0px_0px_#000] ${
                        isDone
                          ? 'bg-rosemary-500 text-white border-rosemary-700'
                          : 'bg-surface text-ember-500 border-panel-border'
                      }`}
                    >
                      {isDone ? '✓' : step.order}
                    </div>

                    <div className="space-y-1">
                      <motion.p
                        animate={{ opacity: isDone ? 0.45 : 1 }}
                        transition={{ duration: 0.15 }}
                        className={`text-sm sm:text-base leading-relaxed break-words ${
                          isDone ? 'hand-strike' : 'text-ink font-medium'
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
        <motion.div variants={shouldReduceMotion ? undefined : platedItem} className="pt-3 border-t-2 border-panel-border">
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
