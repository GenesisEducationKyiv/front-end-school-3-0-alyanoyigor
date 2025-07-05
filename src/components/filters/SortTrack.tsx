import { memo } from 'react';
import { XIcon } from 'lucide-react';
import { Option } from '@mobily/ts-belt';

import { SortField } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortFieldOptions } from '@/consts';
import { Button } from '../ui/button';

interface SortTrackProps {
  sortField: Option<SortField>;
  setSortField: (sortField: SortField | null) => void;
}

export const SortTrack = memo(({ sortField, setSortField }: SortTrackProps) => {
  return sortField ? (
    <Button
      variant="outline"
      onClick={() => setSortField(null)}
      className="flex justify-between min-w-32 text-muted-foreground"
      data-testid="sort-button"
    >
      {sortFieldOptions[sortField]}
      <XIcon className="h-4 w-4" />
    </Button>
  ) : (
    <Select
      value={sortField || ''}
      onValueChange={(value: SortField) => {
        setSortField(value);
      }}
    >
      <SelectTrigger className="min-w-32" data-testid="sort-select">
        <SelectValue data-testid="sort-select-value" placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent data-testid="sort-select-content">
        {Object.entries(sortFieldOptions).map(([key, value]) => (
          <SelectItem key={key} value={key} data-testid="sort-select-item">
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
