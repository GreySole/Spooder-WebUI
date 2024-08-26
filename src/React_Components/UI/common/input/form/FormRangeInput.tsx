import { useFormContext } from 'react-hook-form';

interface FormRangeInputProps {
  formKey: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
}

export default function FormRangeInput(props: FormRangeInputProps) {
  const { formKey, label, min, max, step } = props;
  const { register } = useFormContext();
  return (
    <label htmlFor={`range-${formKey}`}>
      {label}
      <input
        id={`range-${formKey}`}
        className='range-input'
        type='range'
        min={min}
        max={max}
        step={step}
        {...register(formKey, { valueAsNumber: true })}
      />
    </label>
  );
}
