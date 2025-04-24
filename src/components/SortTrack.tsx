import { memo } from 'react';
import { XIcon } from 'lucide-react';

import { SortField } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortFieldOptions } from '@/consts';
import { Button } from './ui/button';

interface SortTrackProps {
  sortField: SortField | null;
  setSortField: (sortField: SortField | null) => void;
}

export const SortTrack = memo(({ sortField, setSortField }: SortTrackProps) => {
  return sortField ? (
    <Button
      variant="outline"
      onClick={() => setSortField(null)}
      className="flex justify-between min-w-32 text-muted-foreground"
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
      <SelectTrigger className="min-w-32">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(sortFieldOptions).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
