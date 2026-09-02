import React from 'react'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { RecipeInput } from './components/RecipeInput'
import { Card } from './components/ui/Card'
import { Button } from './components/ui/Button'

function App() {
  const { status, data: recipe, error, submit, retry, reset, isLoading } = useRecipeRequest()

  return (
    <main className="min-h-screen bg-cream-50 text-charcoal-900 font-body p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-10">
        {/* Brand Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-terracotta-100 text-terracotta-600 text-2xl shadow-sm mb-2">
            📖
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 font-bold tracking-tight">
            The Kitchen Notebook
          </h1>
          <p className="text-charcoal-700 text-base font-medium max-w-lg mx-auto">
            Transform ingredients in your pantry and fridge into artisanal home-cooked meals.
          </p>
        </header>

        {/* Interactive Recipe Input Form */}
        <RecipeInput onSubmit={submit} isLoading={isLoading} />

        {/* Graceful Error Notification */}
        {status === 'error' && error && (
          <div className="max-w-2xl mx-auto w-full bg-terracotta-100 border border-terracotta-200 rounded-xl p-5 text-terracotta-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-sm">
                <span>⚠️</span> Recipe Composition Notice ({error.code})
              </span>
              <p className="text-xs leading-relaxed text-terracotta-700/90">{error.message}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={retry}
              disabled={isLoading}
              className="shrink-0"
            >
              ↻ Try Again
            </Button>
          </div>
        )}

        {/* Recipe Display Card */}
        {recipe && (
          <Card accent={true} className="space-y-6 animate-fadeIn">
            {/* Header & Regenerate Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-cream-200 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-olive-600 uppercase flex items-center gap-1">
                  <span>✓</span> Recipe Composed
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-charcoal-900 font-bold">
                  {recipe.title}
                </h2>
                <p className="text-charcoal-700 text-sm leading-relaxed max-w-xl">
                  {recipe.description}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0">
                <span className="bg-terracotta-100 border border-terracotta-200 text-terracotta-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {recipe.servings} Servings
                </span>
                {recipe.totalTimeMinutes && (
                  <span className="text-xs text-charcoal-500 font-medium">
                    ⏱ {recipe.totalTimeMinutes} mins
                  </span>
                )}
              </div>
            </div>

            {/* Ingredients Required */}
            {recipe.ingredients && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
                  Ingredients Required
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="border border-cream-200 bg-cream-50 p-2.5 rounded-lg flex items-center justify-between text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-olive-500 shrink-0"></span>
                        <span className="font-semibold text-charcoal-900">{ing.name}</span>
                      </div>
                      <span className="font-mono text-charcoal-700 font-medium">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Steps */}
            {recipe.steps && (
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
                  Preparation Instructions
                </h3>
                <ol className="space-y-2.5">
                  {recipe.steps.map((step) => (
                    <li
                      key={step.order}
                      className="text-xs leading-relaxed text-charcoal-900 flex items-start gap-3 bg-cream-50/70 p-3 rounded-lg border border-cream-200"
                    >
                      <span className="font-bold text-terracotta-600 font-mono text-sm shrink-0">
                        {step.order}.
                      </span>
                      <span>{step.instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Action Buttons: Regenerate & Clear */}
            <div className="pt-4 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                disabled={isLoading}
              >
                Clear Recipe
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={retry}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
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
                    <span>Re-crafting recipe...</span>
                  </>
                ) : (
                  <span>↻ Regenerate with Same Ingredients</span>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}

export default App
