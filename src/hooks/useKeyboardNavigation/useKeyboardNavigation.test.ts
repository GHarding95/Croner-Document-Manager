import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useKeyboardNavigation } from './useKeyboardNavigation'

// Mock DOM elements
const mockDocumentItems = [
  { name: 'Folder 1', type: 'folder' },
  { name: 'Document 1', type: 'pdf' },
  { name: 'Folder 2', type: 'folder' }
]

const mockHeader = document.createElement('div')
mockHeader.className = 'app-header'

const mockSearchInput = document.createElement('input')
mockSearchInput.id = 'search-input'

// Mock DOM query methods
const mockQuerySelector = vi.fn()
const mockQuerySelectorAll = vi.fn()

describe('useKeyboardNavigation', () => {
  let mockOnGoBack: ReturnType<typeof vi.fn>
  let mockOnNavigateToFolder: ReturnType<typeof vi.fn>
  let mockOnClearSearch: ReturnType<typeof vi.fn>
  let mockOnFocusSearch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Reset mocks
    mockOnGoBack = vi.fn()
    mockOnNavigateToFolder = vi.fn()
    mockOnClearSearch = vi.fn()
    mockOnFocusSearch = vi.fn()

    // Mock DOM methods
    document.querySelector = mockQuerySelector
    document.querySelectorAll = mockQuerySelectorAll

    // Mock document items
    mockQuerySelectorAll.mockReturnValue([
      { focus: vi.fn() },
      { focus: vi.fn() },
      { focus: vi.fn() }
    ])

    // Mock header
    mockQuerySelector.mockImplementation((selector: string) => {
      if (selector === '.app-header') return mockHeader
      if (selector === '#search-input') return mockSearchInput
      return null
    })

    // Mock focus method
    mockHeader.focus = vi.fn()
    mockSearchInput.focus = vi.fn()
    mockSearchInput.select = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return expected functions and values', () => {
    const { result } = renderHook(() => useKeyboardNavigation({
      onGoBack: mockOnGoBack,
      onNavigateToFolder: mockOnNavigateToFolder,
      onClearSearch: mockOnClearSearch,
      onFocusSearch: mockOnFocusSearch,
      canGoBack: true,
      hasSearchFilter: true,
      documents: mockDocumentItems
    }))

    expect(result.current.searchInputRef).toBeDefined()
    expect(result.current.focusSearchInput).toBeDefined()
    expect(result.current.currentFocusIndex).toBeDefined()
    expect(result.current.setFocusIndex).toBeDefined()
  })

  describe('Backspace key', () => {
    it('should call onGoBack when canGoBack is true', async () => {
      renderHook(() => useKeyboardNavigation({
        onGoBack: mockOnGoBack,
        canGoBack: true,
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
      })

      await waitFor(() => {
        expect(mockOnGoBack).toHaveBeenCalled()
      })
    })

    it('should not call onGoBack when canGoBack is false', async () => {
      renderHook(() => useKeyboardNavigation({
        onGoBack: mockOnGoBack,
        canGoBack: false,
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
      })

      await waitFor(() => {
        expect(mockOnGoBack).not.toHaveBeenCalled()
      })
    })
  })

  describe('Escape key', () => {
    it('should call onClearSearch when hasSearchFilter is true', async () => {
      renderHook(() => useKeyboardNavigation({
        onClearSearch: mockOnClearSearch,
        hasSearchFilter: true,
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      await waitFor(() => {
        expect(mockOnClearSearch).toHaveBeenCalled()
      })
    })

    it('should not call onClearSearch when hasSearchFilter is false', async () => {
      renderHook(() => useKeyboardNavigation({
        onClearSearch: mockOnClearSearch,
        hasSearchFilter: false,
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      await waitFor(() => {
        expect(mockOnClearSearch).not.toHaveBeenCalled()
      })
    })
  })

  describe('Ctrl+F key', () => {
    it('should call onFocusSearch when Ctrl+F is pressed', async () => {
      renderHook(() => useKeyboardNavigation({
        onFocusSearch: mockOnFocusSearch,
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', ctrlKey: true }))
      })

      await waitFor(() => {
        expect(mockOnFocusSearch).toHaveBeenCalled()
      })
    })

    it('should call onFocusSearch when Cmd+F is pressed (macOS)', async () => {
      renderHook(() => useKeyboardNavigation({
        onFocusSearch: mockOnFocusSearch,
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', metaKey: true }))
      })

      await waitFor(() => {
        expect(mockOnFocusSearch).toHaveBeenCalled()
      })
    })
  })

  describe('Enter key', () => {
    it('should call onNavigateToFolder when Enter is pressed on folder', async () => {
      renderHook(() => useKeyboardNavigation({
        onNavigateToFolder: mockOnNavigateToFolder,
        documents: mockDocumentItems
      }))

      // First navigate to first item (folder)
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      })

      // Then press Enter
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })

      await waitFor(() => {
        expect(mockOnNavigateToFolder).toHaveBeenCalledWith('Folder 1')
      })
    })

    it('should not call onNavigateToFolder when Enter is pressed on file', async () => {
      renderHook(() => useKeyboardNavigation({
        onNavigateToFolder: mockOnNavigateToFolder,
        documents: mockDocumentItems
      }))

      // Navigate to second item (file)
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      })

      // Then press Enter
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      })

      await waitFor(() => {
        expect(mockOnNavigateToFolder).not.toHaveBeenCalled()
      })
    })
  })

  describe('Ctrl+H key', () => {
    it('should focus header when Ctrl+H is pressed', async () => {
      renderHook(() => useKeyboardNavigation({
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', ctrlKey: true }))
      })

      await waitFor(() => {
        expect(mockHeader.focus).toHaveBeenCalled()
      })
    })

    it('should focus header when Cmd+H is pressed (macOS)', async () => {
      renderHook(() => useKeyboardNavigation({
        documents: mockDocumentItems
      }))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', metaKey: true }))
      })

      await waitFor(() => {
        expect(mockHeader.focus).toHaveBeenCalled()
      })
    })
  })

  describe('focus management', () => {
    it('should have focusSearchInput function that can be called without error', () => {
      const { result } = renderHook(() => useKeyboardNavigation({
        documents: mockDocumentItems
      }))

      // The function should exist and not throw when called
      expect(() => {
        result.current.focusSearchInput()
      }).not.toThrow()

      expect(result.current.focusSearchInput).toBeDefined()
    })

    it('should have setFocusIndex function that can be called without error', () => {
      const { result } = renderHook(() => useKeyboardNavigation({
        documents: mockDocumentItems
      }))

      // The function should exist and not throw when called
      expect(() => {
        result.current.setFocusIndex(1)
      }).not.toThrow()

      expect(result.current.setFocusIndex).toBeDefined()
    })
  })

  describe('input field handling', () => {
    it('should not handle keyboard events when target is input field', async () => {
      renderHook(() => useKeyboardNavigation({
        onGoBack: mockOnGoBack,
        canGoBack: true,
        documents: mockDocumentItems
      }))

      const inputElement = document.createElement('input')
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      Object.defineProperty(event, 'target', { value: inputElement, writable: false })

      act(() => {
        document.dispatchEvent(event)
      })

      await waitFor(() => {
        expect(mockOnGoBack).not.toHaveBeenCalled()
      })
    })

    it('should not handle keyboard events when target is textarea', async () => {
      renderHook(() => useKeyboardNavigation({
        onGoBack: mockOnGoBack,
        canGoBack: true,
        documents: mockDocumentItems
      }))

      const textareaElement = document.createElement('textarea')
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      Object.defineProperty(event, 'target', { value: textareaElement, writable: false })

      act(() => {
        document.dispatchEvent(event)
      })

      await waitFor(() => {
        expect(mockOnGoBack).not.toHaveBeenCalled()
      })
    })
  })

  describe('hook cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const { unmount } = renderHook(() => useKeyboardNavigation({
        documents: mockDocumentItems
      }))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})
