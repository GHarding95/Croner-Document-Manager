import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentList } from './DocumentList';
import type { DocumentItem as DocumentItemType } from '../../types/document';

const mockFolderItem: DocumentItemType = {
  type: 'folder',
  name: 'Test Folder',
  files: [
    { type: 'pdf', name: 'document.pdf', added: '2024-01-01' }
  ]
};

const mockFileItem: DocumentItemType = {
  type: 'pdf',
  name: 'test-document.pdf',
  added: '2024-01-01'
};

const mockOnFolderClick = vi.fn();
const mockOnClearSearch = vi.fn();

describe('DocumentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty States', () => {
    it('renders search empty state when no documents and has search filter', () => {
      const emptyStateInfo = {
        type: 'search' as const,
        message: 'No documents match "test"',
        suggestion: 'Try adjusting your search terms or browse all documents',
        searchTerm: 'test'
      };

      render(
        <DocumentList
          documents={[]}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={emptyStateInfo}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={true}
        />
      );

      expect(screen.getByText('🔍')).toBeInTheDocument();
      expect(screen.getByText('No documents match "test"')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms or browse all documents')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear search and show all documents/i })).toBeInTheDocument();
    });

    it('renders empty folder state when no documents and in folder', () => {
      const emptyStateInfo = {
        type: 'empty-folder' as const,
        message: 'This folder is empty',
        suggestion: 'Navigate to a different folder or go back to browse other documents',
        searchTerm: null
      };

      render(
        <DocumentList
          documents={[]}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={emptyStateInfo}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      expect(screen.getByText('📁')).toBeInTheDocument();
      expect(screen.getByText('This folder is empty')).toBeInTheDocument();
      expect(screen.getByText('Navigate to a different folder or go back to browse other documents')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /clear search and show all documents/i })).not.toBeInTheDocument();
    });

    it('renders root empty state when no documents at root level', () => {
      const emptyStateInfo = {
        type: 'root' as const,
        message: 'No documents found',
        suggestion: 'Check if documents have been added to the system',
        searchTerm: null
      };

      render(
        <DocumentList
          documents={[]}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={emptyStateInfo}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      expect(screen.getByText('📁')).toBeInTheDocument();
      expect(screen.getByText('No documents found')).toBeInTheDocument();
      expect(screen.getByText('Check if documents have been added to the system')).toBeInTheDocument();
    });

    it('calls onClearSearch when clear search button is clicked', () => {
      const emptyStateInfo = {
        type: 'search' as const,
        message: 'No documents match "test"',
        suggestion: 'Try adjusting your search terms or browse all documents',
        searchTerm: 'test'
      };

      render(
        <DocumentList
          documents={[]}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={emptyStateInfo}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={true}
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear search and show all documents/i });
      fireEvent.click(clearButton);

      expect(mockOnClearSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Document List Rendering', () => {
    it('renders list of documents with proper roles', () => {
      const documents = [mockFolderItem, mockFileItem];

      render(
        <DocumentList
          documents={documents}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={{
            type: 'root',
            message: 'No documents found',
            suggestion: 'Check if documents have been added to the system',
            searchTerm: null
          }}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      const list = screen.getByRole('list', { name: /documents and folders/i });
      expect(list).toBeInTheDocument();

      // Check that both items are rendered
      expect(screen.getByText('Test Folder')).toBeInTheDocument();
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    });

    it('passes correct props to DocumentItem components', () => {
      const documents = [mockFolderItem];

      render(
        <DocumentList
          documents={documents}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={{
            type: 'root',
            message: 'No documents found',
            suggestion: 'Check if documents have been added to the system',
            searchTerm: null
          }}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      // The DocumentItem should receive the onFolderClick prop and call it when clicked
      const folderItem = screen.getByRole('button', { name: /folder: test folder/i });
      fireEvent.click(folderItem);

      expect(mockOnFolderClick).toHaveBeenCalledWith('Test Folder');
    });

    it('assigns correct index to each DocumentItem', () => {
      const documents = [mockFolderItem, mockFileItem];

      render(
        <DocumentList
          documents={documents}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={{
            type: 'root',
            message: 'No documents found',
            suggestion: 'Check if documents have been added to the system',
            searchTerm: null
          }}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      // Check that the first item has index 0
      const firstItem = screen.getByRole('button', { name: /folder: test folder/i });
      expect(firstItem).toHaveAttribute('data-index', '0');

      // Check that the second item has index 1
      const secondItem = screen.getByRole('listitem', { name: /file: test-document.pdf/i });
      expect(secondItem).toHaveAttribute('data-index', '1');
    });
  });

  describe('Virtual Scrolling', () => {
    it('uses virtual scrolling for large lists', () => {
      // Create a large list of documents (over 50 items)
      const largeDocumentsList = Array.from({ length: 60 }, (_, index) => ({
        type: 'pdf' as const,
        name: `document-${index}.pdf`,
        added: '2024-01-01'
      }));

      render(
        <DocumentList
          documents={largeDocumentsList}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={{
            type: 'root',
            message: 'No documents found',
            suggestion: 'Check if documents have been added to the system',
            searchTerm: null
          }}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      // Check that virtual scrolling class is applied
      const list = screen.getByRole('list', { name: /documents and folders/i });
      expect(list).toHaveClass('virtualized');
    });

    it('uses regular rendering for small lists', () => {
      const smallDocumentsList = [mockFolderItem, mockFileItem];

      render(
        <DocumentList
          documents={smallDocumentsList}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={{
            type: 'root',
            message: 'No documents found',
            suggestion: 'Check if documents have been added to the system',
            searchTerm: null
          }}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      // Check that virtual scrolling class is not applied
      const list = screen.getByRole('list', { name: /documents and folders/i });
      expect(list).not.toHaveClass('virtualized');
    });
  });

  describe('Accessibility', () => {
    it('has proper list role and label', () => {
      const documents = [mockFolderItem];

      render(
        <DocumentList
          documents={documents}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={{
            type: 'root',
            message: 'No documents found',
            suggestion: 'Check if documents have been added to the system',
            searchTerm: null
          }}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={false}
        />
      );

      const list = screen.getByRole('list', { name: /documents and folders/i });
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute('aria-label', 'Documents and folders');
    });

    it('has proper button accessibility for clear search', () => {
      const emptyStateInfo = {
        type: 'search' as const,
        message: 'No documents match "test"',
        suggestion: 'Try adjusting your search terms or browse all documents',
        searchTerm: 'test'
      };

      render(
        <DocumentList
          documents={[]}
          onFolderClick={mockOnFolderClick}
          emptyStateInfo={emptyStateInfo}
          onClearSearch={mockOnClearSearch}
          hasSearchFilter={true}
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear search and show all documents/i });
      expect(clearButton).toBeInTheDocument();
    });
  });
});
