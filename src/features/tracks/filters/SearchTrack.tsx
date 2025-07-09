import { Option } from '@mobily/ts-belt';
import { XIcon, SearchIcon } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';

interface SearchTrackProps {
  searchTerm: Option<string>;
  setSearchTerm: (searchTerm: string) => void;
}

export function SearchTrack({ searchTerm, setSearchTerm }: SearchTrackProps) {
  return (
    <Label htmlFor="search" className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="search"
        placeholder="Search tracks..."
        value={searchTerm || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value);
        }}
        className="pl-10"
        data-testid="search-input"
      />
      {searchTerm && searchTerm.length > 0 && (
        <Button
          onClick={() => setSearchTerm('')}
          variant="ghost"
          className="absolute right-0 top-1/2 size-8 -translate-y-1/2"
        >
          <XIcon className="h-5 w-5" />
        </Button>
      )}
    </Label>
  );
}
