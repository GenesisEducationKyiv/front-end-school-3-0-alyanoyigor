import { Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface FilterProps {
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
  onDeselect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Filter({
  options,
  selected,
  onSelect,
  onDeselect,
  placeholder = 'Select items...',
  disabled = false,
}: FilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {selected.length > 0 ? selected.join(', ') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command >
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option}
                onSelect={() => {
                  if (selected.includes(option)) {
                    onDeselect(option);
                  } else {
                    onSelect(option);
                  }
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 