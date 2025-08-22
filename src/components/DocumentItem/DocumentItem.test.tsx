import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentItem } from './DocumentItem';
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

describe('DocumentItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Folder Items', () => {
    it('renders folder with correct icon and name', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByText('📁')).toBeInTheDocument();
      expect(screen.getByText('Test Folder')).toBeInTheDocument();
    });

    it('shows folder indicator text', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByText(/Click to open folder/)).toBeInTheDocument();
      expect(screen.getByText(/1 items/)).toBeInTheDocument();
    });

    it('calls onFolderClick when clicked', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      const folderItem = screen.getByRole('button');
      fireEvent.click(folderItem);

      expect(mockOnFolderClick).toHaveBeenCalledWith('Test Folder');
    });

    it('calls onFolderClick when Enter key is pressed', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      const folderItem = screen.getByRole('button');
      fireEvent.keyDown(folderItem, { key: 'Enter' });

      expect(mockOnFolderClick).toHaveBeenCalledWith('Test Folder');
    });

    it('calls onFolderClick when Space key is pressed', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      const folderItem = screen.getByRole('button');
      fireEvent.keyDown(folderItem, { key: ' ' });

      expect(mockOnFolderClick).toHaveBeenCalledWith('Test Folder');
    });

    it('calls onFolderClick when Right Arrow key is pressed', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      const folderItem = screen.getByRole('button');
      fireEvent.keyDown(folderItem, { key: 'ArrowRight' });

      expect(mockOnFolderClick).toHaveBeenCalledWith('Test Folder');
    });

    it('shows folder arrow indicator', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByText('→')).toBeInTheDocument();
    });
  });

  describe('File Items', () => {
    it('renders file with correct icon and name', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByText('📄')).toBeInTheDocument();
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    });

    it('shows file type and date', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText(/Added: 01\/01\/2024/)).toBeInTheDocument();
    });

    it('does not call onFolderClick when clicked', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      const fileItem = screen.getByRole('listitem');
      fireEvent.click(fileItem);

      expect(mockOnFolderClick).not.toHaveBeenCalled();
    });

    it('does not show folder arrow indicator', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.queryByText('→')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct role for folders', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has correct role for files', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('has proper aria-label for folders', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByLabelText('Folder: Test Folder')).toBeInTheDocument();
    });

    it('has proper aria-label for files', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByLabelText('File: test-document.pdf')).toBeInTheDocument();
    });

    it('has proper aria-describedby relationship', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      const item = screen.getByRole('listitem');
      const description = screen.getByTestId('item-description-0');

      expect(item).toHaveAttribute('aria-describedby', 'item-description-0');
      expect(description).toHaveAttribute('id', 'item-description-0');
    });
  });

  describe('Focus Management', () => {
    it('has correct tabIndex for folders', () => {
      render(
        <DocumentItem 
          item={mockFolderItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
    });

    it('has correct tabIndex for files', () => {
      render(
        <DocumentItem 
          item={mockFileItem} 
          onFolderClick={mockOnFolderClick}
          index={0}
        />
      );

      expect(screen.getByRole('listitem')).toHaveAttribute('tabIndex', '-1');
    });
  });
});
