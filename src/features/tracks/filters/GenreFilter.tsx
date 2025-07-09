import { Option } from '@mobily/ts-belt';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface GenreFilterProps {
  selectedGenre: Option<string>;
  onSelect: (genre: string | null) => void;
  genres?: string[];
  isGenresPending?: boolean;
}

export function GenreFilter({
  genres,
  selectedGenre,
  onSelect,
  isGenresPending = false,
}: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isGenresPending &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-8 w-20"
            data-testid="loading-indicator"
          />
        ))}

      {genres &&
        genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              selectedGenre === genre ? onSelect(null) : onSelect(genre)
            }
            disabled={isGenresPending}
            aria-disabled={isGenresPending}
            data-testid="filter-genre"
          >
            {genre}
          </Button>
        ))}
    </div>
  );
}
