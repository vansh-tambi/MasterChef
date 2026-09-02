import React, { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { useRecipeSession } from './hooks/useRecipeSession'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { CustomCursor } from './components/ui/CustomCursor'
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

  const handleViewSessionStateChange = React.useCallback(
    ({ servings, completedSteps, activeSwaps }) => {
      if (activeRecipe) {
        saveSession({
          recipe: activeRecipe,
          servings,
          completedSteps,
          activeSwaps,
        })
      }
    },
    [activeRecipe, saveSession]
  )

  return (
    <main className="min-h-screen w-full bg-kitchen-bg text-parchment-100 font-body px-4 py-7 sm:px-6 sm:py-12 flex justify-center ambient-glow">
      {/* 60 FPS Hardware-Accelerated Artisanal Whisk Cursor */}
      <CustomCursor />

      <div className="max-w-2xl lg:max-w-4xl w-full space-y-8 sm:space-y-10">
        {/* Brand Header with Restaurant Signage Typography */}
        <header className="relative text-center space-y-3 pt-2 sm:pt-0">
          <div className="absolute right-0 top-0">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-kitchen-surface border border-kitchen-border text-terracotta-400 text-3xl shadow-candlelight mb-1">
            👨‍🍳
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-mustard-400 font-bold block">
              Culinary Intelligence Studio
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-parchment-100 break-words">
              Master Chef
            </h1>
          </div>

          <p className="font-body text-parchment-300 text-sm sm:text-base mt-2 leading-relaxed max-w-lg mx-auto break-words">
            Transform ingredients in your pantry and fridge into artisanal home-cooked meals.
          </p>

          {/* Session Restored Notice */}
          {showRestoredNotice && activeRecipe && (
            <div className="inline-flex items-center justify-between gap-3 px-4 py-1.5 rounded-full bg-kitchen-surface border border-sage-500/40 text-sage-400 text-xs font-medium animate-fadeIn mt-2 shadow-stamp">
              <span>Restored previous Master Chef creation</span>
              <button
                type="button"
                onClick={handleStartOver}
                className="underline hover:text-parchment-100 font-bold text-mustard-400"
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
