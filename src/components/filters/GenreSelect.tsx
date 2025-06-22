import { FieldError } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { FormLabel } from '../ui/form';
import { Button } from '../ui/button';

interface GenreSelectProps {
  availableGenres: string[] | undefined;
  selectedGenres: string[];
  error: FieldError | undefined;
  handleRemoveGenre: (genre: string) => void;
  handleAddGenre: (genre: string) => void;
}

export function GenreSelect({
  availableGenres,
  selectedGenres,
  error,
  handleRemoveGenre,
  handleAddGenre,
}: GenreSelectProps) {
  return (
    <div className="space-y-2" data-testid="genre-selector">
      <FormLabel>Genres</FormLabel>
      <div className="flex flex-wrap gap-2">
        {selectedGenres.map((genre: string) => (
          <Badge
            key={genre}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {genre}
            <button
              type="button"
              onClick={() => handleRemoveGenre(genre)}
              className="hover:text-destructive cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableGenres &&
          availableGenres
            .filter((genre) => !selectedGenres.includes(genre))
            .map((genre) => (
              <Button
                key={genre}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddGenre(genre)}
                className="flex items-center gap-1"
                data-testid="genre-button"
              >
                <Plus className="h-3 w-3" />
                {genre}
              </Button>
            ))}
      </div>
      {error && (
        <p
          className="text-sm font-medium text-destructive"
          data-testid="error-genre"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
