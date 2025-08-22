import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentControls } from './DocumentControls';
import type { SortOption, FilterOptions } from '../../types/document';

const mockSortOption: SortOption = {
  field: 'name',
  direction: 'asc'
};

const mockFilterOptions: FilterOptions = {
  filename: ''
};

const mockOnSortChange = vi.fn();
const mockOnFilterChange = vi.fn();
const mockOnFilterInputChange = vi.fn();
const mockOnGoBack = vi.fn();

describe('DocumentControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders breadcrumb with current path', () => {
      const currentPath = ['Documents', 'Projects'];
      
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={currentPath}
        />
      );

      expect(screen.getByText('Documents / Projects')).toBeInTheDocument();
    });

    it('renders "Root" when no path', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      expect(screen.getByText('Root')).toBeInTheDocument();
    });

    it('shows back button when canGoBack is true', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={true}
          onGoBack={mockOnGoBack}
          currentPath={['Documents']}
        />
      );

      expect(screen.getByRole('button', { name: /go back to previous folder/i })).toBeInTheDocument();
      expect(screen.getByText('← Back')).toBeInTheDocument();
    });

    it('hides back button when canGoBack is false', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={['Documents']}
        />
      );

      expect(screen.queryByRole('button', { name: /go back to previous folder/i })).not.toBeInTheDocument();
    });
  });

  describe('Search Input', () => {
    it('renders search input with correct placeholder', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search documents...');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls onFilterInputChange when input changes', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search documents...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(mockOnFilterInputChange).toHaveBeenCalledWith('test');
    });

    it('shows search error when provided', () => {
      const searchError = 'Invalid search term';
      
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          searchError={searchError}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      expect(screen.getByText(searchError)).toBeInTheDocument();
      expect(screen.getByText(searchError)).toHaveAttribute('role', 'alert');
    });

    it('clears search on Escape key', () => {
      const filterOptionsWithValue = { filename: 'test' };
      
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={filterOptionsWithValue}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search documents...');
      fireEvent.keyDown(searchInput, { key: 'Escape' });

      expect(mockOnFilterInputChange).toHaveBeenCalledWith('');
    });
  });

  describe('Sort Controls', () => {
    it('renders sort field select with correct options', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const sortSelect = screen.getByRole('combobox', { name: /sort documents by field/i });
      expect(sortSelect).toBeInTheDocument();
      
      const nameOption = screen.getByRole('option', { name: 'Name' });
      const dateOption = screen.getByRole('option', { name: 'Date Added' });
      expect(nameOption).toBeInTheDocument();
      expect(dateOption).toBeInTheDocument();
    });

    it('calls onSortChange when sort field changes', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const sortSelect = screen.getByRole('combobox', { name: /sort documents by field/i });
      fireEvent.change(sortSelect, { target: { value: 'date' } });

      expect(mockOnSortChange).toHaveBeenCalledWith({
        field: 'date',
        direction: 'asc'
      });
    });

    it('renders sort direction button with correct icon', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const sortButton = screen.getByRole('button', { name: /sort ascending/i });
      expect(sortButton).toBeInTheDocument();
      expect(sortButton).toHaveTextContent('↑');
    });

    it('calls onSortChange when sort direction button is clicked', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const sortButton = screen.getByRole('button', { name: /sort ascending/i });
      fireEvent.click(sortButton);

      expect(mockOnSortChange).toHaveBeenCalledWith({
        field: 'name',
        direction: 'desc'
      });
    });

    it('shows correct sort direction icon for descending', () => {
      const descendingSortOption: SortOption = { field: 'name', direction: 'desc' };
      
      render(
        <DocumentControls
          sortOption={descendingSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const sortButton = screen.getByRole('button', { name: /sort descending/i });
      expect(sortButton).toBeInTheDocument();
      expect(sortButton).toHaveTextContent('↓');
    });
  });

  describe('Back Button', () => {
    it('calls onGoBack when clicked', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={true}
          onGoBack={mockOnGoBack}
          currentPath={['Documents']}
        />
      );

      const backButton = screen.getByRole('button', { name: /go back to previous folder/i });
      fireEvent.click(backButton);

      expect(mockOnGoBack).toHaveBeenCalledTimes(1);
    });

    it('calls onGoBack when Enter key is pressed', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={true}
          onGoBack={mockOnGoBack}
          currentPath={['Documents']}
        />
      );

      const backButton = screen.getByRole('button', { name: /go back to previous folder/i });
      fireEvent.keyDown(backButton, { key: 'Enter' });

      expect(mockOnGoBack).toHaveBeenCalledTimes(1);
    });

    it('calls onGoBack when Space key is pressed', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={true}
          onGoBack={mockOnGoBack}
          currentPath={['Documents']}
        />
      );

      const backButton = screen.getByRole('button', { name: /go back to previous folder/i });
      fireEvent.keyDown(backButton, { key: ' ' });

      expect(mockOnGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for form controls', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      expect(screen.getByLabelText(/filter by filename/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sort documents by field/i)).toBeInTheDocument();
    });

    it('has proper ARIA attributes for search input', () => {
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search documents...');
      expect(searchInput).toHaveAttribute('aria-label', 'Search documents by filename');
    });

    it('shows aria-invalid when search has error', () => {
      const searchError = 'Invalid search term';
      
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          searchError={searchError}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search documents...');
      expect(searchInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('links search input to error message with aria-describedby', () => {
      const searchError = 'Invalid search term';
      
      render(
        <DocumentControls
          sortOption={mockSortOption}
          filterOptions={mockFilterOptions}
          onSortChange={mockOnSortChange}
          onFilterChange={mockOnFilterChange}
          onFilterInputChange={mockOnFilterInputChange}
          searchError={searchError}
          canGoBack={false}
          onGoBack={mockOnGoBack}
          currentPath={[]}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search documents...');
      const errorMessage = screen.getByText(searchError);
      
      expect(searchInput).toHaveAttribute('aria-describedby', errorMessage.id);
    });
  });
});
