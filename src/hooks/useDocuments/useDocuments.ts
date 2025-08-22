import { useState, useCallback, useMemo, useEffect } from 'react'
import type { DocumentItem, SortOption, FilterOptions, FileItem } from '../../types/document'
import { isFolderItem } from '../../types/document'
import mockData from '../../assets/mock-data.json'

export const useDocuments = () => {
  const [documents] = useState<DocumentItem[]>(mockData as DocumentItem[])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'asc' })
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ filename: '' })
  const [debouncedFilter, setDebouncedFilter] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState<string>('')

  const currentDocuments = useMemo(() => {
    // Start with root documents
    let current = documents

    // Navigate to current path
    for (const folderName of currentPath) {
      const folder = current.find(item => item.type === 'folder' && item.name === folderName)
      if (folder && folder.type === 'folder' && 'files' in folder) {
        current = folder.files
      } else {
        // If folder doesn't exist or doesn't have files, return empty array
        return []
      }
    }

    // Ensure current is always an array
    if (!Array.isArray(current)) {
      return []
    }

    // Apply filter with optimized search using debounced input
    let filtered = current
    if (debouncedFilter) {
      const searchTerm = debouncedFilter.toLowerCase()
      filtered = current.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      )
    }

    // Apply optimized sorting
    return [...filtered].sort((a, b) => {
      if (sortOption.field === 'name') {
        // Name sorting - use localeCompare directly for better performance
        const comparison = a.name.localeCompare(b.name)
        return sortOption.direction === 'asc' ? comparison : -comparison
      }
      
      // Date sorting - optimize type checking and reduce redundant operations
      if (a.type === 'folder' && b.type === 'folder') return 0
      if (a.type === 'folder') return 1
      if (b.type === 'folder') return -1
      
      // Both are files, safe to cast and compare dates directly
      const aDate = (a as FileItem).added
      const bDate = (b as FileItem).added
      
      const comparison = aDate.localeCompare(bDate)
      return sortOption.direction === 'asc' ? comparison : -comparison
    })
  }, [documents, currentPath, sortOption, debouncedFilter])

  const navigateToFolder = useCallback(async (folderName: string) => {
    // Only navigate if the item is actually a folder
    const currentItems = currentDocuments
    const targetItem = currentItems.find(item => item.name === folderName)
    
    if (targetItem && isFolderItem(targetItem)) {
      setIsLoading(true)
      try {
        // Simulate async operation for better UX
        await new Promise(resolve => setTimeout(resolve, 300))
        setCurrentPath([...currentPath, folderName])
        // Clear the search filter and errors when navigating to a new folder
        setFilterOptions({ filename: '' })
        setSearchError('')
      } finally {
        setIsLoading(false)
      }
    }
  }, [currentPath, currentDocuments])

  const navigateBack = useCallback(async () => {
    setIsLoading(true)
          try {
        // Simulate async operation for better UX
        await new Promise(resolve => setTimeout(resolve, 200))
        setCurrentPath(currentPath.slice(0, -1))
        // Clear the search filter and errors when going back
        setFilterOptions({ filename: '' })
        setSearchError('')
      } finally {
        setIsLoading(false)
      }
  }, [currentPath])

  const canGoBack = currentPath.length > 0

  // Debounce filter input to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filterOptions.filename)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [filterOptions.filename])

  // Get empty state context for better UX - memoized for performance
  const emptyStateInfo = useMemo(() => {
    if (debouncedFilter) {
      return {
        type: 'search' as const,
        message: `No documents match "${debouncedFilter}"`,
        suggestion: 'Try adjusting your search terms or browse all documents',
        searchTerm: debouncedFilter
      }
    }
    
    // Check if we're in a folder or at root
    if (currentPath.length > 0) {
      return {
        type: 'empty-folder' as const,
        message: 'This folder is empty',
        suggestion: 'Navigate to a different folder or go back to browse other documents',
        searchTerm: null
      }
    }
    
    return {
      type: 'root' as const,
      message: 'No documents found',
      suggestion: 'Check if documents have been added to the system',
      searchTerm: null
    }
  }, [debouncedFilter, currentPath])

  const validateSearchInput = (input: string): string => {
    // Clear previous errors
    setSearchError('')
    
    // Check for empty input
    if (input.trim() === '') {
      return ''
    }
    
    // Check length limit
    if (input.length > 50) {
      setSearchError('Search term too long (max 50 characters)')
      return ''
    }
    
    // Check for invalid characters (common file system restrictions)
    if (/[<>:"\\|?*]/.test(input)) {
      setSearchError('Invalid characters in search term')
      return ''
    }
    
    // Check for excessive spaces
    if (/\s{3,}/.test(input)) {
      setSearchError('Too many consecutive spaces')
      return ''
    }
    
    // Input is valid
    return input.trim()
  }

  const handleFilterChange = useCallback((filename: string) => {
    const validatedInput = validateSearchInput(filename)
    if (validatedInput !== '' || filename === '') {
      setFilterOptions({ filename: validatedInput })
    }
  }, [])

  const clearSearch = useCallback(() => {
    setFilterOptions({ filename: '' })
    setSearchError('')
  }, [])

  return {
    documents: currentDocuments,
    currentPath,
    sortOption,
    filterOptions,
    isLoading,
    searchError,
    canGoBack,
    navigateToFolder,
    navigateBack,
    setSortOption,
    setFilterOptions,
    handleFilterChange,
    clearSearch,
    emptyStateInfo,
  }
}
