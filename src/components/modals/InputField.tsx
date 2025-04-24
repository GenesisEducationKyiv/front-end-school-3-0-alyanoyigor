import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface InputFieldProps<T extends FieldValues> {
  field: ControllerRenderProps<T>;
  label: string;
  placeholder: string;
}

export function InputField<T extends FieldValues>({
  field,
  label,
  placeholder,
}: InputFieldProps<T>) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
