import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface GenreFilterProps {
  selectedGenre: string | null;
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
          <Skeleton key={index} className="h-8 w-20" />
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
          >
            {genre}
          </Button>
        ))}
    </div>
  );
}
