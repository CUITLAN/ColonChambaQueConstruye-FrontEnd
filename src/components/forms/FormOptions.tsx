import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from '@/components/ui/select';
import { FieldValues } from 'react-hook-form';
import { Combobox } from '../ui/comboBox';
import React from 'react';
import { Button } from '../ui/button';
import { TrashBinTrash } from '@solar-icons/react';
import { FormOptionsProps, SelectOption } from '@/interfaces/form';
import { cn } from '@heroui/react';

export default function FormOptions<T extends FieldValues>({
  control,
  name,
  label,
  description,
  htmlFor,
  type,
  placeholder,
  disabled = false,
  width,
  className,
  optional = false,
  options,
  color = "gray",
  onSelect = () => {},  
}: FormOptionsProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel htmlFor={htmlFor} className="j!inline-flex !justify-start items-center gap-1 font-medium">
                {label}
                {!optional && <span className="text-red-500">*</span>}
                {optional && (
                  <span className="text-sm font-light text-gray-500 ml-1">Opcional</span>
                )}
            </FormLabel>
          )}

          <FormControl>
            <div className="flex items-center gap-2">
              {type === 'combobox' ? (
                <Combobox
                  value={field.value??''}
                  onChange={(val) => {
                    field.onChange(val);
                    onSelect?.(val);
                  }}
                  options={options}
                  width={width}
                  placeholder={placeholder}
                  color={color}
                />
              ) : (
                <Select onValueChange={field.onChange} value={field.value??''} disabled={disabled}>
                  <SelectTrigger className={cn(
                        className, width,
                      )}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className='max-h-60 overflow-y-auto'>
                    {groupOptions(options).map(([group, groupOptions]) => (
                      <SelectGroup key={group}>
                        {group && <SelectLabel>{group}</SelectLabel>}
                        {groupOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {optional && (
                <Button
                  type="button"
                  color="gray"
                  size="sm_icon"
                  onClick={() => field.onChange('')}
                >
                  <TrashBinTrash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </FormControl>

          {description && (
            <Label htmlFor={htmlFor} variant="description">
              {description}
            </Label>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Agrupa opciones por "group"
function groupOptions(options: SelectOption[]): [string, SelectOption[]][] {
  const grouped: Record<string, SelectOption[]> = {};
  for (const opt of options) {
    const group = opt.group || '';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(opt);
  }
  return Object.entries(grouped);
}
