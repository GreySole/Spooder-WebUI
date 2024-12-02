import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectOption } from '../../../Types';
import useTheme from '../../../../app/hooks/useTheme';

interface SelectDropdownProps {
  formKey: string;
  label?: string;
  options: SelectOption[];
}

export default function FormSelectDropdown(props: SelectDropdownProps) {
  const { formKey, label, options } = props;
  const { watch, register, getValues } = useFormContext();
  const { themeVariables } = useTheme();
  const value = watch(formKey);

  return (
    <label htmlFor={`select-${formKey}`}>
      {label}
      <select
        id={`select-${formKey}`}
        value={value}
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${themeVariables.isDarkTheme ? '%23ffffff' : '%23000000'}" width="18px" height="18px"><path d="M7 10l5 5 5-5z"/></svg>')`,
        }}
        {...register(formKey, { valueAsNumber: typeof value === 'number' })}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
