import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useErrorBoundary } from './useErrorBoundary'

describe('useErrorBoundary', () => {
  it('should return triggerError function', () => {
    const { result } = renderHook(() => useErrorBoundary())
    
    expect(result.current.triggerError).toBeDefined()
    expect(typeof result.current.triggerError).toBe('function')
  })

  it('should return withErrorBoundary function', () => {
    const { result } = renderHook(() => useErrorBoundary())
    
    expect(result.current.withErrorBoundary).toBeDefined()
    expect(typeof result.current.withErrorBoundary).toBe('function')
  })

  it('should return safeAsync function', () => {
    const { result } = renderHook(() => useErrorBoundary())
    
    expect(result.current.safeAsync).toBeDefined()
    expect(typeof result.current.safeAsync).toBe('function')
  })

  describe('triggerError', () => {
    it('should throw Error object when passed string', () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      expect(() => {
        result.current.triggerError('Test error message')
      }).toThrow('Test error message')
    })

    it('should throw Error object when passed Error instance', () => {
      const { result } = renderHook(() => useErrorBoundary())
      const testError = new Error('Test error instance')
      
      expect(() => {
        result.current.triggerError(testError)
      }).toThrow(testError)
    })

    it('should create new Error object from string', () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      try {
        result.current.triggerError('Custom error message')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Custom error message')
      }
    })
  })

  describe('withErrorBoundary', () => {
    it('should wrap async function and return result when successful', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockResolvedValue('success result')
      const wrappedFn = result.current.withErrorBoundary(mockAsyncFn)
      
      const response = await wrappedFn('arg1', 'arg2')
      
      expect(response).toBe('success result')
      expect(mockAsyncFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should wrap async function and re-throw errors', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockError = new Error('Async function failed')
      const mockAsyncFn = vi.fn().mockRejectedValue(mockError)
      const wrappedFn = result.current.withErrorBoundary(mockAsyncFn)
      
      await expect(wrappedFn('arg1')).rejects.toThrow('Async function failed')
      expect(mockAsyncFn).toHaveBeenCalledWith('arg1')
    })

    it('should preserve function arguments', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockResolvedValue('result')
      const wrappedFn = result.current.withErrorBoundary(mockAsyncFn)
      
      await wrappedFn(1, 2, 3)
      
      expect(mockAsyncFn).toHaveBeenCalledWith(1, 2, 3)
    })

    it('should handle async function with no arguments', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockResolvedValue('no args result')
      const wrappedFn = result.current.withErrorBoundary(mockAsyncFn)
      
      const response = await wrappedFn()
      
      expect(response).toBe('no args result')
      expect(mockAsyncFn).toHaveBeenCalledWith()
    })
  })

  describe('safeAsync', () => {
    it('should return data when async function succeeds', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockResolvedValue('success data')
      const safeFn = result.current.safeAsync(mockAsyncFn)
      
      const response = await safeFn('arg1')
      
      expect(response).toEqual({ data: 'success data' })
      expect(response.error).toBeUndefined()
      expect(mockAsyncFn).toHaveBeenCalledWith('arg1')
    })

    it('should return error when async function fails', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockError = new Error('Async function failed')
      const mockAsyncFn = vi.fn().mockRejectedValue(mockError)
      const safeFn = result.current.safeAsync(mockAsyncFn)
      
      const response = await safeFn('arg1')
      
      expect(response.data).toBeUndefined()
      expect(response.error).toBeInstanceOf(Error)
      expect((response.error as Error).message).toBe('Async function failed')
      expect(mockAsyncFn).toHaveBeenCalledWith('arg1')
    })

    it('should convert non-Error rejections to Error objects', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockRejectedValue('String error')
      const safeFn = result.current.safeAsync(mockAsyncFn)
      
      const response = await safeFn()
      
      expect(response.error).toBeInstanceOf(Error)
      expect((response.error as Error).message).toBe('String error')
    })

    it('should handle async function with multiple arguments', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockResolvedValue('multi arg result')
      const safeFn = result.current.safeAsync(mockAsyncFn)
      
      const response = await safeFn('arg1', 42, true)
      
      expect(response.data).toBe('multi arg result')
      expect(mockAsyncFn).toHaveBeenCalledWith('arg1', 42, true)
    })

    it('should handle async function with no arguments', async () => {
      const { result } = renderHook(() => useErrorBoundary())
      
      const mockAsyncFn = vi.fn().mockResolvedValue('no args result')
      const safeFn = result.current.safeAsync(mockAsyncFn)
      
      const response = await safeFn()
      
      expect(response.data).toBe('no args result')
      expect(mockAsyncFn).toHaveBeenCalledWith()
    })
  })

  describe('hook stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useErrorBoundary())
      
      const firstResult = result.current
      rerender()
      const secondResult = result.current
      
      expect(firstResult.triggerError).toBe(secondResult.triggerError)
      expect(firstResult.withErrorBoundary).toBe(secondResult.withErrorBoundary)
      expect(firstResult.safeAsync).toBe(secondResult.safeAsync)
    })
  })
})
