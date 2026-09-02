import React from 'react'
import { useTheme } from './hooks/useTheme'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { RecipeInput } from './components/RecipeInput'
import { RecipeView } from './components/RecipeView'
import { RecipeLoading } from './components/RecipeLoading'
import { FeedbackState } from './components/FeedbackState'

function App() {
  const { theme, toggleTheme } = useTheme()
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
    <main className="min-h-screen w-full bg-cream-50 dark:bg-roast-950 text-charcoal-900 dark:text-cream-50 font-body px-4 py-6 sm:px-6 sm:py-12 flex justify-center transition-colors duration-200">
      <div className="max-w-2xl lg:max-w-3xl w-full space-y-8 sm:space-y-10">
        {/* Brand Header with Theme Toggle */}
        <header className="relative text-center space-y-2 pt-2 sm:pt-0">
          <div className="absolute right-0 top-0">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-600 dark:text-terracotta-400 text-2xl shadow-sm mb-1">
            📖
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal-900 dark:text-cream-50 font-bold tracking-tight break-words">
            The Kitchen Notebook
          </h1>
          <p className="text-charcoal-700 dark:text-cream-200 text-sm sm:text-base font-medium max-w-lg mx-auto break-words">
            Transform ingredients in your pantry and fridge into artisanal home-cooked meals.
          </p>
        </header>

        {/* State 1: Loading */}
        {status === 'loading' && (
          <RecipeLoading onCancel={cancel} />
        )}

        {/* State 2: Error */}
        {status === 'error' && (
          <FeedbackState
            error={error}
            onRetry={retry}
            onReset={cancel}
          />
        )}

        {/* State 3: Success */}
        {status === 'success' && recipe && (
          <RecipeView
            recipe={recipe}
            onReset={reset}
            onRegenerate={retry}
            isRegenerating={isLoading}
          />
        )}

        {/* State 4: Idle */}
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
