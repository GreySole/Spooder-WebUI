import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectOption } from '../../../../Types';

interface SelectDropdownProps {
  formKey: string;
  label?: string;
  options: SelectOption[];
}

export default function FormSelectDropdown(props: SelectDropdownProps) {
  const { formKey, label, options } = props;
  const { watch, register, getValues } = useFormContext();
  const value = watch(formKey);

  return (
    <label htmlFor={`select-${formKey}`}>
      {label}
      <select
        id={`select-${formKey}`}
        value={value}
        {...register(formKey, { valueAsNumber: typeof value === 'number' })}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
