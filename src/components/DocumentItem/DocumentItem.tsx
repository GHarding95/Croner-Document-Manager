import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import type { DocumentItem as DocumentItemType, FileItem } from '../../types/document'
import { isFileItem, isFolderItem } from '../../types/document'
import './DocumentItem.css'

interface DocumentItemProps {
  item: DocumentItemType
  onFolderClick: (folderName: string) => Promise<void>
  index?: number
  isFocused?: boolean
}

export interface DocumentItemRef {
  focus: () => void
  blur: () => void
}

export const DocumentItem = forwardRef<DocumentItemRef, DocumentItemProps>(({ 
  item, 
  onFolderClick, 
  index = 0,
  isFocused = false 
}, ref) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const isFolder = item.type === 'folder'
  const isFile = !isFolder

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (itemRef.current) {
        itemRef.current.focus()
      }
    },
    blur: () => {
      if (itemRef.current) {
        itemRef.current.blur()
      }
    }
  }))

  const handleClick = () => {
    if (isFolder) {
      onFolderClick(item.name)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (isFolder) {
          event.preventDefault()
          onFolderClick(item.name)
        }
        break
      case 'ArrowRight':
        if (isFolder) {
          event.preventDefault()
          onFolderClick(item.name)
        }
        break
      case 'ArrowLeft':
        // This could be used to go back if we're in a folder
        // For now, just prevent default to avoid page scrolling
        event.preventDefault()
        break
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getFileIcon = (fileType: FileItem['type']) => {
    switch (fileType) {
      case 'pdf':
        return '📄'
      case 'doc':
        return '📝'
      case 'csv':
        return '📊'
      case 'mov':
        return '🎬'
      default:
        return '📁'
    }
  }

  return (
    <div 
      ref={itemRef}
      className={`document-item ${isFolder ? 'folder' : 'file'} ${isFocused ? 'focused' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isFolder ? 'button' : 'listitem'}
      tabIndex={isFolder ? 0 : -1}
      aria-label={isFolder ? `Folder: ${item.name}` : `File: ${item.name}`}
      aria-describedby={`item-description-${index}`}
      data-index={index}
    >
      <div className="document-icon">
        {isFolder ? '📁' : getFileIcon(item.type)}
      </div>
      
      <div className="document-info">
        <div className="document-name">{item.name}</div>
        <div 
          id={`item-description-${index}`}
          className="document-details"
          data-testid={`item-description-${index}`}
        >
          {isFile && isFileItem(item) && (
            <>
              <span className="document-type">{item.type.toUpperCase()}</span>
              <span className="document-date">Added: {formatDate(item.added)}</span>
            </>
          )}
          {isFolder && isFolderItem(item) && (
            <span className="folder-indicator">
              Click to open folder • {item.files.length} items
            </span>
          )}
        </div>
      </div>
      
      {isFolder && (
        <div className="folder-arrow" aria-hidden="true">
          →
        </div>
      )}
    </div>
  )
})
