import { describe, expect, it, vi } from 'vitest';
import { SortTrack } from '@/components/filters/SortTrack';
import { render, screen } from '@testing-library/react';
import { SortFieldSchema } from '@/types';

describe('SortTrack component', () => {
  it('should display "Sort by" placeholder when no sort field is selected', () => {
    const props = {
      sortField: null,
      setSortField: vi.fn(),
    };

    render(<SortTrack {...props} />);

    expect(screen.getByTestId('sort-select-value')).toBeInTheDocument();
  });

  it('should be button when sort field has value', () => {
    const props = {
      sortField: SortFieldSchema.enum.title,
      setSortField: vi.fn(),
    };

    render(<SortTrack {...props} />);
    const button = screen.getByTestId('sort-button');

    expect(button).toBeInTheDocument();
  });
});
