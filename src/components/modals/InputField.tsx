import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface InputFieldProps<T extends FieldValues> {
  field: ControllerRenderProps<T>;
  label: string;
  placeholder: string;
  testId: string;
}

export function InputField<T extends FieldValues>({
  field,
  label,
  placeholder,
  testId,
}: InputFieldProps<T>) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input placeholder={placeholder} {...field} data-testid={`input-${testId}`} />
      </FormControl>
      <FormMessage data-testid={`error-${field.name}`} />
    </FormItem>
  );
}
