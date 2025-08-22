import { useCallback } from 'react'

/**
 * Hook that provides utilities for working with the enhanced ErrorBoundary
 * This allows components to easily trigger errors that will be caught by the boundary
 */
export const useErrorBoundary = () => {
  /**
   * Manually trigger an error that will be caught by the ErrorBoundary
   * Useful for testing or when you want to show error state programmatically
   */
  const triggerError = useCallback((error: Error | string) => {
    const errorObj = error instanceof Error ? error : new Error(error)
    throw errorObj
  }, [])

  /**
   * Wrapper for async functions that will be caught by the ErrorBoundary
   * if they throw an error
   */
  const withErrorBoundary = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args)
      } catch (error) {
        // Re-throw to let the error boundary catch it
        throw error
      }
    }
  }, [])

  /**
   * Safe async wrapper that catches errors and returns a result object
   * instead of throwing
   */
  const safeAsync = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<{ data?: R; error?: Error }> => {
      try {
        const data = await fn(...args)
        return { data }
      } catch (error) {
        return { error: error instanceof Error ? error : new Error(String(error)) }
      }
    }
  }, [])

  return {
    triggerError,
    withErrorBoundary,
    safeAsync
  }
}
