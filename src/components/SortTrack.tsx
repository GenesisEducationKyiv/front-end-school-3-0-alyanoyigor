import { SortField } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sortFieldOptions } from "@/consts";

interface SortTrackProps {
  sortField: SortField | null;
  setSortField: (sortField: SortField) => void;
}

export function SortTrack({ sortField, setSortField }: SortTrackProps) {
  return (
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
}
