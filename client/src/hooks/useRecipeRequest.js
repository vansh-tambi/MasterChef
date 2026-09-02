import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Enterprise-grade custom hook for resilient recipe generation requests.
 * Features: monotonic requestId token guard, AbortController, explicit cancellation,
 * error code normalization, and empty payload protection.
 */
export function useRecipeRequest() {
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const activeRequestId = useRef(0)
  const abortControllerRef = useRef(null)
  const lastParamsRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    activeRequestId.current += 1
    setStatus('idle')
    setError(null)
  }, [])

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    activeRequestId.current += 1
    setStatus('idle')
    setData(null)
    setError(null)
    lastParamsRef.current = null
  }, [])

  const submit = useCallback(async ({ ingredients, servings = 2 }) => {
    // 1. Cancel previous in-flight request if active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 2. Create a new AbortController
    const controller = new AbortController()
    abortControllerRef.current = controller

    // 3. Increment and capture local requestId token
    const requestId = ++activeRequestId.current

    // 4. Save params for regeneration / retry (preserves user inputs)
    lastParamsRef.current = { ingredients, servings }

    // 5. Update UI to loading
    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, servings }),
        signal: controller.signal,
      })

      const json = await res.json()

      // 8. CRITICAL GUARD: Ignore stale response if another request was triggered
      if (requestId !== activeRequestId.current) {
        return
      }

      // 9. Handle HTTP & API contract errors
      if (!res.ok || !json.success) {
        let normalizedCode = 'ai_request_failed'
        if (res.status === 502) normalizedCode = 'invalid_shape'
        if (res.status === 504) normalizedCode = 'timeout'
        if (json.code) normalizedCode = json.code

        setStatus('error')
        setError({
          code: normalizedCode,
          message: json.error || 'Failed to compose recipe.',
          details: json.issues || json.details || null,
        })
        return
      }

      // 10. Extract recipe payload
      const recipeData = json.recipe || json.data || json

      // Guard against empty content structures
      if (
        !recipeData.ingredients ||
        !Array.isArray(recipeData.ingredients) ||
        recipeData.ingredients.length === 0 ||
        !recipeData.steps ||
        !Array.isArray(recipeData.steps) ||
        recipeData.steps.length === 0
      ) {
        setStatus('error')
        setError({
          code: 'empty_recipe',
          message: 'The recipe returned with zero actionable ingredients or steps.',
          details: null,
        })
        return
      }

      setData(recipeData)
      setStatus('success')
    } catch (err) {
      // 11. Catch handling
      if (err.name === 'AbortError') {
        // Request was cancelled; silent exit
        return
      }

      if (requestId === activeRequestId.current) {
        const isTimeout = err.message?.toLowerCase().includes('timeout')
        setStatus('error')
        setError({
          code: isTimeout ? 'timeout' : 'network_error',
          message: err instanceof Error ? err.message : 'Network communication error.',
          details: null,
        })
      }
    }
  }, [])

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      return submit(lastParamsRef.current)
    }
  }, [submit])

  return {
    status,
    data,
    error,
    lastParams: lastParamsRef.current,
    submit,
    retry,
    cancel,
    reset,
    isLoading: status === 'loading',
  }
}

export default useRecipeRequest
