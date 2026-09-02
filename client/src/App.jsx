import React from 'react'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { RecipeInput } from './components/RecipeInput'
import { RecipeView } from './components/RecipeView'
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

        {/* Dynamic View State: Input Form vs. Interactive Recipe Result */}
        {!recipe ? (
          <>
            <RecipeInput onSubmit={submit} isLoading={isLoading} />

            {/* Error Notification */}
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
          </>
        ) : (
          <RecipeView
            recipe={recipe}
            onReset={reset}
            onRegenerate={retry}
            isRegenerating={isLoading}
          />
        )}
      </div>
    </main>
  )
}

export default App
