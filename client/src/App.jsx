import React from 'react'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { RecipeInput } from './components/RecipeInput'
import { RecipeView } from './components/RecipeView'
import { RecipeLoading } from './components/RecipeLoading'
import { FeedbackState } from './components/FeedbackState'

function App() {
  const {
    status,
    data: recipe,
    error,
    lastParams,
    submit,
    retry,
    cancel,
    reset,
    isLoading,
  } = useRecipeRequest()

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

        {/* State 1: Loading - Culinary Skeleton with Cancel */}
        {status === 'loading' && (
          <RecipeLoading onCancel={cancel} />
        )}

        {/* State 2: Error - Design-system-aligned feedback card */}
        {status === 'error' && (
          <FeedbackState
            error={error}
            onRetry={retry}
            onReset={cancel}
          />
        )}

        {/* State 3: Success - Interactive Recipe View */}
        {status === 'success' && recipe && (
          <RecipeView
            recipe={recipe}
            onReset={reset}
            onRegenerate={retry}
            isRegenerating={isLoading}
          />
        )}

        {/* State 4: Idle - Recipe Input (preserving inputs if returning from revision) */}
        {status === 'idle' && (
          <RecipeInput
            onSubmit={submit}
            isLoading={isLoading}
            initialIngredients={lastParams?.ingredients || ''}
            initialServings={lastParams?.servings || 2}
          />
        )}
      </div>
    </main>
  )
}

export default App
