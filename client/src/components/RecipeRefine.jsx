import React, { useState } from 'react'
import { Button } from './ui/Button'

export function RecipeRefine({ currentRecipe, onRefineSuccess }) {
  const [instruction, setInstruction] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = instruction.trim()
    if (!trimmed || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/recipe/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRecipe,
          instruction: trimmed,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to refine recipe.')
      }

      const updatedRecipe = json.recipe || json.data
      setInstruction('')
      if (onRefineSuccess) {
        onRefineSuccess(updatedRecipe)
      }
    } catch (err) {
      console.error('Error refining recipe:', err)
      setErrorMessage(err.message || 'Unable to update recipe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-cream-50 dark:bg-roast-950 border border-cream-200 dark:border-roast-700 rounded-xl p-4 sm:p-5 space-y-3 shadow-inner transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className="text-base">✍️</span>
        <h3 className="font-display font-bold text-sm sm:text-base text-charcoal-900 dark:text-cream-50">
          Refine &amp; Customize This Recipe
        </h3>
      </div>
      <p className="text-xs text-charcoal-700 dark:text-cream-300">
        Want to tweak heat levels, adjust for allergies, or change cooking methods? Add your note below:
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <input
          type="text"
          value={instruction}
          onChange={(e) => {
            setInstruction(e.target.value)
            if (errorMessage) setErrorMessage(null)
          }}
          disabled={isSubmitting}
          placeholder="e.g., Make it spicier, swap pasta for zoodles, or make it dairy-free..."
          className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-cream-300 dark:border-roast-700 bg-cream-100/90 dark:bg-roast-900 text-charcoal-900 dark:text-cream-50 placeholder:text-charcoal-500/70 dark:placeholder:text-charcoal-500 text-sm focus:border-terracotta-500 dark:focus:border-terracotta-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-roast-900 transition-all"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!instruction.trim() || isSubmitting}
          className="shrink-0 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white"
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
              <span>Adjusting notes...</span>
            </>
          ) : (
            <span>Adjust Recipe</span>
          )}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-xs text-terracotta-700 dark:text-terracotta-400 animate-fadeIn">
          ⚠️ {errorMessage}
        </p>
      )}
    </div>
  )
}

export default RecipeRefine
