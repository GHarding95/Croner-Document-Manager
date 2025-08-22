
import { useDocuments } from './hooks/useDocuments'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import { useErrorBoundary } from './hooks/useErrorBoundary'
import { DocumentControls } from './components/DocumentControls'
import { DocumentList } from './components/DocumentList'
import { LoadingSpinner } from './components/LoadingSpinner'
import './App.css'

function App() {
  
  const {
    documents,
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
  } = useDocuments()

  const { triggerError } = useErrorBoundary()

  // Initialize keyboard navigation
  useKeyboardNavigation({
    onGoBack: navigateBack,
    onNavigateToFolder: navigateToFolder,
    onClearSearch: clearSearch,
    onFocusSearch: () => { // Modified to avoid circular dependency
      const searchInput = document.getElementById('filename-filter') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    },
    canGoBack,
    hasSearchFilter: !!filterOptions.filename,
    documents
  })

  // Simple test error function
  const handleTestError = () => {
    triggerError('Test error triggered! This demonstrates the ErrorBoundary in action.')
  }

  return (
    <div className="app">
      <header className="app-header" tabIndex={-1}>
        <h1>Croner Document Manager</h1>
        <p>View and navigate through your documents</p>
        <div className="keyboard-shortcuts-help">
          <span className="shortcut-hint">⌨️ Keyboard shortcuts:</span>
          <span className="shortcut">Go back</span> - Backspace
          <span className="shortcut-divider">|</span>
          <span className="shortcut">Navigate items</span> - ↑↓
          <span className="shortcut-divider">|</span>
          <span className="shortcut">Open folder</span> - Enter
          <span className="shortcut-divider">|</span>
          <span className="shortcut">Focus search</span> - Ctrl+F
          <span className="shortcut-divider">|</span>
          <span className="shortcut">Clear search</span> - Escape
          <span className="shortcut-divider">|</span>
          <span className="shortcut">First/Last item</span> - Home/End
        </div>
        <div className="error-test-buttons">
          <button 
            onClick={handleTestError}
            className="test-error-button"
            title="Test the enhanced ErrorBoundary by triggering a manual error"
          >
            <span className="icon">⚠️</span>
            <span>Test Error</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        <DocumentControls
          sortOption={sortOption}
          filterOptions={filterOptions}
          onSortChange={setSortOption}
          onFilterChange={setFilterOptions}
          onFilterInputChange={handleFilterChange}
          searchError={searchError}
          canGoBack={canGoBack}
          onGoBack={navigateBack}
          currentPath={currentPath}
        />

        {isLoading ? (
          <div className="loading-container">
            <LoadingSpinner message="Loading documents..." />
          </div>
        ) : (
          <DocumentList
            documents={documents}
            onFolderClick={navigateToFolder}
            emptyStateInfo={emptyStateInfo}
            onClearSearch={clearSearch}
            hasSearchFilter={!!filterOptions.filename}
          />
        )}
      </main>
    </div>
  )
}

export default App
