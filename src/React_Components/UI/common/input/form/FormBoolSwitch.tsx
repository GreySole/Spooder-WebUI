import { ChangeEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';

interface BoolSwitchProps {
  formKey: string;
  label?: string;
}

export default function FormBoolSwitch(props: BoolSwitchProps) {
  const { formKey, label } = props;
  const { watch, register } = useFormContext();
  const value = watch(formKey);

  return (
    <label className={value ? 'boolswitch checked' : 'boolswitch'} htmlFor={`bool-${formKey}`}>
      {label}
      <input id={`bool-${formKey}`} type='checkbox' checked={value} {...register(formKey)} />
    </label>
  );
}
