import { useState, useEffect, useCallback } from 'react'

const SESSION_STORAGE_KEY = 'kitchen_notebook_session_v1'

/**
 * Custom hook for local session persistence (Stretch B).
 * Persists active recipe, servings, completedSteps, activeSwaps to localStorage.
 */
export function useRecipeSession() {
  const [session, setSession] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && parsed.recipe) {
            return {
              ...parsed,
              isRestored: true,
            }
          }
        }
      } catch (err) {
        console.error('Error hydrating session from localStorage:', err)
      }
    }
    return null
  })

  const saveSession = useCallback(({ recipe, servings, completedSteps, activeSwaps }) => {
    if (!recipe) return
    try {
      const payload = {
        recipe,
        servings: servings || recipe.servings || 2,
        completedSteps: Array.from(completedSteps || []),
        activeSwaps: Array.from(activeSwaps || []),
        timestamp: Date.now(),
      }
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
      setSession({ ...payload, isRestored: false })
    } catch (err) {
      console.error('Error saving session to localStorage:', err)
    }
  }, [])

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (err) {
      console.error('Error clearing session:', err)
    }
    setSession(null)
  }, [])

  return {
    session,
    saveSession,
    clearSession,
    isRestored: Boolean(session?.isRestored),
  }
}

export default useRecipeSession
