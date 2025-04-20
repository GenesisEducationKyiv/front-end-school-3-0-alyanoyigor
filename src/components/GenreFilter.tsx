import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onSelect: (genre: string | null) => void;
  disabled?: boolean;
}

export function GenreFilter({
  genres,
  selectedGenre,
  onSelect,
  disabled = false,
}: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedGenre === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(null)}
        disabled={disabled}
      >
        All
      </Button>
      {genres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(genre)}
          disabled={disabled}
        >
          {genre}
        </Button>
      ))}
    </div>
  );
} 