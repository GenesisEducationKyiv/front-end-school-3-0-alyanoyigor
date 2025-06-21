import { describe, expect, it, vi } from 'vitest';
import { SortTrack } from '@/components/filters/SortTrack';
import { render, screen } from '@testing-library/react';
import { SortFieldSchema } from '@/types';

describe('SortTrack component', () => {
  it('should display "Sort by" placeholder when no sort field is selected', () => {
    // Arrange
    const props = {
      sortField: null,
      setSortField: vi.fn(),
    };

    // Act
    render(<SortTrack {...props} />);

    // Assert
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('should be button when sort field has value', () => {
    // Arrange
    const props = {
      sortField: SortFieldSchema.enum.title,
      setSortField: vi.fn(),
    };

    // Act
    render(<SortTrack {...props} />);
    const button = screen.getByTestId('sort-button');

    // Assert
    expect(button).toBeInTheDocument();
  });
});
