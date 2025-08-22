import { useEffect, useCallback, useRef } from 'react'

interface KeyboardNavigationOptions {
  onGoBack?: () => void
  onNavigateToFolder?: (folderName: string) => void
  onClearSearch?: () => void
  onFocusSearch?: () => void
  canGoBack?: boolean
  hasSearchFilter?: boolean
  documents?: Array<{ name: string; type: string }>
}

export const useKeyboardNavigation = ({
  onGoBack,
  onNavigateToFolder,
  onClearSearch,
  onFocusSearch,
  canGoBack = false,
  hasSearchFilter = false,
  documents = []
}: KeyboardNavigationOptions) => {
  const currentFocusIndex = useRef<number>(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Reset focus index when documents change
  useEffect(() => {
    currentFocusIndex.current = -1
  }, [documents])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle keyboard events when typing in input fields
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (event.key) {
      case 'Backspace':
        if (canGoBack && onGoBack) {
          event.preventDefault()
          onGoBack()
        }
        break

      case 'Escape':
        if (hasSearchFilter && onClearSearch) {
          event.preventDefault()
          onClearSearch()
        }
        break

      case 'f':
      case 'F':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          onFocusSearch?.()
        }
        break

      case 'ArrowDown':
        event.preventDefault()
        if (documents.length > 0) {
          currentFocusIndex.current = Math.min(
            currentFocusIndex.current + 1,
            documents.length - 1
          )
          focusDocumentItem(currentFocusIndex.current)
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        if (documents.length > 0) {
          currentFocusIndex.current = Math.max(currentFocusIndex.current - 1, 0)
          focusDocumentItem(currentFocusIndex.current)
        }
        break

      case 'Enter':
        if (currentFocusIndex.current >= 0 && currentFocusIndex.current < documents.length) {
          const currentItem = documents[currentFocusIndex.current]
          if (currentItem.type === 'folder' && onNavigateToFolder) {
            event.preventDefault()
            onNavigateToFolder(currentItem.name)
          }
        }
        break

      case 'Home':
        if (documents.length > 0) {
          event.preventDefault()
          currentFocusIndex.current = 0
          focusDocumentItem(0)
        }
        break

      case 'End':
        if (documents.length > 0) {
          event.preventDefault()
          currentFocusIndex.current = documents.length - 1
          focusDocumentItem(documents.length - 1)
        }
        break

      case 'h':
      case 'H':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          // Focus on header/home
          const header = document.querySelector('.app-header')
          if (header) {
            (header as HTMLElement).focus()
          }
        }
        break
    }
  }, [canGoBack, hasSearchFilter, documents, onGoBack, onClearSearch, onNavigateToFolder, onFocusSearch])

  const focusDocumentItem = useCallback((index: number) => {
    const documentItems = document.querySelectorAll('.document-item')
    if (documentItems[index]) {
      (documentItems[index] as HTMLElement).focus()
    }
  }, [])

  const focusSearchInput = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
      searchInputRef.current.select()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    searchInputRef,
    focusSearchInput,
    currentFocusIndex: currentFocusIndex.current,
    setFocusIndex: (index: number) => {
      currentFocusIndex.current = index
    }
  }
}
