import { Button } from './ui/button';

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
      {genres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            selectedGenre === genre ? onSelect(null) : onSelect(genre)
          }
          disabled={disabled}
        >
          {genre}
        </Button>
      ))}
    </div>
  );
} 