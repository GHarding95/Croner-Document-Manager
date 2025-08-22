export interface FileItem {
  type: 'pdf' | 'doc' | 'csv' | 'mov'
  name: string
  added: string
}

export interface FolderItem {
  type: 'folder'
  name: string
  files: FileItem[]
}

export type DocumentItem = FileItem | FolderItem

export interface SortOption {
  field: 'name' | 'date'
  direction: 'asc' | 'desc'
}

export interface FilterOptions {
  filename: string
}

// Type guard functions
export const isFileItem = (item: DocumentItem): item is FileItem => {
  return item.type !== 'folder'
}

export const isFolderItem = (item: DocumentItem): item is FolderItem => {
  return item.type === 'folder'
}
