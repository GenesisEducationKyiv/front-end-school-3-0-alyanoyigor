import { FieldError } from 'react-hook-form';
import { Plus } from 'lucide-react';
import Chip from '@mui/material/Chip';

import { FormLabel } from '@/shared/components/ui/form';

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
          <Chip
            key={genre}
            label={genre}
            variant="filled"
            color="primary"
            size="small"
            onDelete={() => handleRemoveGenre(genre)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableGenres &&
          availableGenres
            .filter((genre) => !selectedGenres.includes(genre))
            .map((genre) => (
              <Chip
                key={genre}
                label={genre}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleAddGenre(genre)}
                icon={<Plus className="h-3 w-3" />}
              />
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
