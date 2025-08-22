import React, { memo } from 'react'
import { FixedSizeList as List } from 'react-window'
import type { DocumentItem as DocumentItemType } from '../../types/document'
import { DocumentItem } from '../DocumentItem'
import './DocumentList.css'

interface DocumentListProps {
  documents: DocumentItemType[]
  onFolderClick: (folderName: string) => Promise<void>
  emptyStateInfo: {
    type: 'search' | 'empty-folder' | 'root'
    message: string
    suggestion: string
    searchTerm: string | null
  }
  onClearSearch: () => void
  hasSearchFilter: boolean
}

export const DocumentList: React.FC<DocumentListProps> = memo(({ 
  documents, 
  onFolderClick, 
  emptyStateInfo, 
  onClearSearch, 
  hasSearchFilter 
}) => {
  // Virtual scrolling threshold - use virtual scrolling for lists with 50+ items
  const VIRTUAL_SCROLLING_THRESHOLD = 50
  
  if (documents.length === 0) {
    return (
      <div className="document-list-empty">
        <div className="empty-icon">
          {emptyStateInfo.type === 'search' ? '🔍' : '📁'}
        </div>
        <h3>{emptyStateInfo.message}</h3>
        <p>{emptyStateInfo.suggestion}</p>
        
        {hasSearchFilter && (
          <button 
            onClick={onClearSearch}
            className="clear-search-button"
            aria-label="Clear search and show all documents"
          >
            Clear Search
          </button>
        )}
      </div>
    )
  }

  // Use virtual scrolling for large lists
  if (documents.length >= VIRTUAL_SCROLLING_THRESHOLD) {
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style} className="virtualized-row">
        <DocumentItem
          item={documents[index]}
          onFolderClick={onFolderClick}
          index={index}
        />
      </div>
    )

    return (
      <div className="document-list virtualized" role="list" aria-label="Documents and folders">
        <List
          height={Math.min(600, Math.max(200, documents.length * 20))} // Dynamic height
          itemCount={documents.length}
          itemSize={80}
          width="100%"
          overscanCount={5} // Render 5 items above/below viewport for smooth scrolling
          itemData={documents}
        >
          {Row}
        </List>
      </div>
    )
  }

  // Regular rendering for smaller lists
  return (
    <div className="document-list" role="list" aria-label="Documents and folders">
      {documents.map((item, index) => (
        <DocumentItem
          key={`${item.name}-${index}`}
          item={item}
          onFolderClick={onFolderClick}
          index={index}
        />
      ))}
    </div>
  )
})
