import { useFormContext } from 'react-hook-form';
import { SelectOption } from '../../../../Types';

interface SelectDropdownProps {
  label?: string;
  options: SelectOption[];
  value:string;
  onChange: (value: string) => void;
}

export default function SelectDropdown(props: SelectDropdownProps) {
  const { label, options, value, onChange } = props;

  return (
    <label htmlFor={`select-${label}`}>
      {label}
      <select
        id={`select-${label}`}
        value={value}
        onChange={e=>onChange(e.target.value)}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
