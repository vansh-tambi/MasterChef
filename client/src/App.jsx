import React, { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { useRecipeSession } from './hooks/useRecipeSession'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { RecipeInput } from './components/RecipeInput'
import { RecipeView } from './components/RecipeView'
import { RecipeLoading } from './components/RecipeLoading'
import { FeedbackState } from './components/FeedbackState'
import { Button } from './components/ui/Button'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { session, saveSession, clearSession, isRestored } = useRecipeSession()
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

  const [activeRecipe, setActiveRecipe] = useState(null)
  const [showRestoredNotice, setShowRestoredNotice] = useState(false)

  // Hydrate from localStorage on initial mount
  useEffect(() => {
    if (session?.recipe && !activeRecipe && status === 'idle') {
      setActiveRecipe(session.recipe)
      if (isRestored) {
        setShowRestoredNotice(true)
      }
    }
  }, [session, activeRecipe, status, isRestored])

  // Sync new recipe from useRecipeRequest
  useEffect(() => {
    if (recipe) {
      setActiveRecipe(recipe)
      setShowRestoredNotice(false)
      saveSession({
        recipe,
        servings: recipe.servings,
        completedSteps: [],
        activeSwaps: [],
      })
    }
  }, [recipe, saveSession])

  const handleStartOver = () => {
    clearSession()
    setActiveRecipe(null)
    setShowRestoredNotice(false)
    reset()
  }

  const handleRecipeUpdate = (updatedRecipe) => {
    setActiveRecipe(updatedRecipe)
    saveSession({
      recipe: updatedRecipe,
      servings: updatedRecipe.servings,
      completedSteps: session?.completedSteps || [],
      activeSwaps: session?.activeSwaps || [],
    })
  }

  const handleViewSessionStateChange = ({ servings, completedSteps, activeSwaps }) => {
    if (activeRecipe) {
      saveSession({
        recipe: activeRecipe,
        servings,
        completedSteps,
        activeSwaps,
      })
    }
  }

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

          {/* Session Restored Notice (Stretch B) */}
          {showRestoredNotice && activeRecipe && (
            <div className="inline-flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-full bg-olive-100 dark:bg-olive-950/70 border border-olive-500/30 text-olive-800 dark:text-olive-300 text-xs font-medium animate-fadeIn mt-2">
              <span>Restored from previous kitchen session</span>
              <button
                type="button"
                onClick={handleStartOver}
                className="underline hover:text-olive-950 dark:hover:text-olive-100 font-bold"
              >
                Start Fresh
              </button>
            </div>
          )}
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
            onReset={handleStartOver}
          />
        )}

        {/* State 3: Active Recipe View */}
        {status !== 'loading' && status !== 'error' && activeRecipe && (
          <RecipeView
            recipe={activeRecipe}
            onReset={handleStartOver}
            onRegenerate={retry}
            onRecipeUpdate={handleRecipeUpdate}
            isRegenerating={isLoading}
            initialServings={session?.servings}
            initialCompletedSteps={session?.completedSteps}
            initialActiveSwaps={session?.activeSwaps}
            onStateChange={handleViewSessionStateChange}
          />
        )}

        {/* State 4: Idle Input Form */}
        {status === 'idle' && !activeRecipe && (
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
