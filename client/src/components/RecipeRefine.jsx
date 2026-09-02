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
    <div className="bg-elevated/70 border-2 border-panel-border rounded-lg p-4 sm:p-5 space-y-3 shadow-[3px_3px_0px_0px_rgba(26,29,32,0.06)] dark:shadow-[3px_3px_0px_0px_#000] transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className="text-sm">✍️</span>
        <h3 className="font-mono uppercase tracking-wider font-bold text-xs sm:text-sm text-ink">
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
          className="flex-1 min-h-[44px] px-4 py-2.5 rounded-md border-2 border-panel-border bg-surface text-ink placeholder:text-ink-muted/40 text-sm font-mono focus:border-ember-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ember-500 transition-all shadow-inner"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!instruction.trim() || isSubmitting}
          className="shrink-0 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <span>Adjusting...</span> : <span>Adjust</span>}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-xs font-mono font-bold text-ember-500 animate-fadeIn">
          ⚠️ {errorMessage}
        </p>
      )}
    </div>
  )
}

export default RecipeRefine
