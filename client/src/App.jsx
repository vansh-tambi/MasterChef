import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTheme } from './hooks/useTheme'
import { useRecipeRequest } from './hooks/useRecipeRequest'
import { useRecipeSession } from './hooks/useRecipeSession'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { CustomCursor } from './components/ui/CustomCursor'
import { RecipeInput } from './components/RecipeInput'
import { RecipeView } from './components/RecipeView'
import { RecipeLoading } from './components/RecipeLoading'
import { FeedbackState } from './components/FeedbackState'
import { fadeTransition } from './utils/motion'

function App() {
  const shouldReduceMotion = useReducedMotion()
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
    <main className="min-h-screen w-full bg-canvas text-ink font-body px-4 py-6 sm:px-6 sm:py-10 flex justify-center ambient-glow transition-colors duration-200">
      <CustomCursor />

      <div className="max-w-5xl lg:max-w-6xl w-full space-y-6 sm:space-y-8">
        {/* Brand Header */}
        <header className="relative text-center space-y-2 pt-2 sm:pt-0">
          <div className="absolute right-0 top-0">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-surface border-2 border-panel-border text-ember-500 text-2xl shadow-[3px_3px_0px_0px_rgba(26,29,32,0.12)] dark:shadow-[3px_3px_0px_0px_#000] mb-0.5">
            👨‍🍳
          </div>

          <div className="space-y-0.5">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink break-words">
              Master Chef
            </h1>
          </div>

          <p className="font-body text-ink-muted text-sm sm:text-base leading-relaxed max-w-sm mx-auto break-words">
            Fridge to plate, instantly.
          </p>

          {/* Session Restored Notice */}
          <AnimatePresence>
            {showRestoredNotice && activeRecipe && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-flex items-center justify-between gap-3 px-3.5 py-1 rounded-sm bg-surface border-2 border-rosemary-500/50 text-rosemary-500 text-xs font-mono font-bold mt-1.5 shadow-[2px_2px_0px_0px_rgba(26,29,32,0.1)] dark:shadow-[2px_2px_0px_0px_#000]"
              >
                <span>RESTORED SESSION</span>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="underline hover:text-ink text-ember-500 cursor-pointer font-bold"
                >
                  Start Fresh
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* AnimatePresence Page-Level State Crossfading */}
        <AnimatePresence mode="wait">
          {/* State 1: Loading */}
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={fadeTransition}
            >
              <RecipeLoading onCancel={cancel} />
            </motion.div>
          )}

          {/* State 2: Error */}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={fadeTransition}
            >
              <FeedbackState
                error={error}
                onRetry={retry}
                onReset={handleStartOver}
              />
            </motion.div>
          )}

          {/* State 3: Active Recipe View */}
          {status !== 'loading' && status !== 'error' && activeRecipe && (
            <motion.div
              key="recipe"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={fadeTransition}
            >
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
            </motion.div>
          )}

          {/* State 4: Idle Input Form */}
          {status === 'idle' && !activeRecipe && (
            <motion.div
              key="input"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={fadeTransition}
            >
              <RecipeInput
                onSubmit={submit}
                isLoading={isLoading}
                initialIngredients={lastParams?.ingredients || ''}
                initialServings={lastParams?.servings || 2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App
