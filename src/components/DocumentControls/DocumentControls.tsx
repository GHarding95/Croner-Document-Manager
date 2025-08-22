import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import type { SortOption, FilterOptions } from '../../types/document'
import './DocumentControls.css'

interface DocumentControlsProps {
  sortOption: SortOption
  filterOptions: FilterOptions
  onSortChange: (sortOption: SortOption) => void
  onFilterChange: (filterOptions: FilterOptions) => void
  onFilterInputChange: (filename: string) => void
  searchError?: string
  canGoBack: boolean
  onGoBack: () => Promise<void>
  currentPath: string[]
}

export interface DocumentControlsRef {
  focusSearch: () => void
}

export const DocumentControls = forwardRef<DocumentControlsRef, DocumentControlsProps>(({ 
  sortOption, 
  filterOptions, 
  onSortChange, 
  onFilterInputChange, 
  searchError, 
  canGoBack, 
  onGoBack, 
  currentPath 
}, ref) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)

  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
        searchInputRef.current.select()
      }
    }
  }))

  const handleSortFieldChange = (field: SortOption['field']) => {
    onSortChange({ ...sortOption, field })
  }

  const handleSortDirectionChange = (direction: SortOption['direction']) => {
    onSortChange({ ...sortOption, direction })
  }

  const handleFilterChange = (filename: string) => {
    onFilterInputChange(filename)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        if (filterOptions.filename) {
          event.preventDefault()
          onFilterInputChange('')
        }
        break
      case 'Enter':
        if (event.target === searchInputRef.current && filterOptions.filename) {
          // Keep focus on search input after Enter
          event.preventDefault()
        }
        break
    }
  }

  const handleBackButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onGoBack()
    }
  }

  return (
    <div className="document-controls">
      <div className="controls-header">
        <div className="breadcrumb">
          <span className="current-location">
            {currentPath.length === 0 ? 'Root' : currentPath.join(' / ')}
          </span>
        </div>
        {canGoBack && (
          <button 
            ref={backButtonRef}
            className="back-button"
            onClick={onGoBack}
            onKeyDown={handleBackButtonKeyDown}
            aria-label="Go back to previous folder"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="controls-actions">
        <div className="filter-section">
          <label htmlFor="filename-filter" className="filter-label">
            Filter by filename:
          </label>
          <input
            ref={searchInputRef}
            id="filename-filter"
            type="text"
            placeholder="Search documents..."
            value={filterOptions.filename}
            onChange={(e) => handleFilterChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`filter-input ${searchError ? 'error' : ''}`}
            aria-invalid={!!searchError}
            aria-describedby={searchError ? 'search-error' : undefined}
            aria-label="Search documents by filename"
          />
          {searchError && (
            <div id="search-error" className="search-error" role="alert">
              {searchError}
            </div>
          )}
        </div>

        <div className="sort-section">
          <label htmlFor="sort-field" className="sort-label">
            Sort by:
          </label>
          <div className="sort-options">
            <select
              id="sort-field"
              value={sortOption.field}
              onChange={(e) => handleSortFieldChange(e.target.value as 'name' | 'date')}
              className="sort-select"
              aria-label="Sort documents by field"
            >
              <option value="name">Name</option>
              <option value="date">Date Added</option>
            </select>
            
            <button
              className={`sort-direction ${sortOption.direction === 'asc' ? 'asc' : 'desc'}`}
              onClick={() => handleSortDirectionChange(sortOption.direction === 'asc' ? 'desc' : 'asc')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSortDirectionChange(sortOption.direction === 'asc' ? 'desc' : 'asc')
                }
              }}
              aria-label={`Sort ${sortOption.direction === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortOption.direction === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})
