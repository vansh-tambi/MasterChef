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
    <div className="bg-elevated border border-panel-border rounded-xl p-4 sm:p-5 space-y-3 shadow-stamp transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className="text-base">✍️</span>
        <h3 className="font-display font-bold text-sm sm:text-base text-ink">
          Adjust Recipe
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <input
          type="text"
          value={instruction}
          onChange={(e) => {
            setInstruction(e.target.value)
            if (errorMessage) setErrorMessage(null)
          }}
          disabled={isSubmitting}
          placeholder="e.g. Make it vegetarian, less spicy..."
          className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-panel-border bg-surface text-ink placeholder:text-ink-muted/40 text-sm focus:border-ember-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas transition-all"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!instruction.trim() || isSubmitting}
          className="shrink-0 flex items-center justify-center gap-2 font-bold"
        >
          {isSubmitting ? <span>Adjusting...</span> : <span>Adjust</span>}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-xs text-ember-500 animate-fadeIn">
          ⚠️ {errorMessage}
        </p>
      )}
    </div>
  )
}

export default RecipeRefine
