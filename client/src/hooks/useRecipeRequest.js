import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Enterprise-grade custom hook for resilient recipe generation requests.
 * Uses both AbortController and monotonic requestId token guard to eliminate race conditions.
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

    // 4. Save params for regeneration / retry
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
        setStatus('error')
        setError({
          code: json.code || (res.status === 502 ? 'invalid_shape' : 'ai_request_failed'),
          message: json.error || 'Failed to compose recipe.',
          details: json.issues || json.details || null,
        })
        return
      }

      // 10. Success: assign recipe payload (handling both json.recipe and json.data)
      const recipeData = json.recipe || json.data || json
      setData(recipeData)
      setStatus('success')
    } catch (err) {
      // 11. Catch handling
      if (err.name === 'AbortError') {
        // Request was aborted by user or new request; do not alter state
        return
      }

      if (requestId === activeRequestId.current) {
        setStatus('error')
        setError({
          code: 'network_error',
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
    submit,
    retry,
    reset,
    isLoading: status === 'loading',
  }
}

export default useRecipeRequest
