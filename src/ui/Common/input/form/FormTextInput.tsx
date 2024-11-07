import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface TextInputProps {
  formKey: string;
  label?: string;
  charLimit?: number;
  jsonFriendly?: boolean;
  password?: boolean;
}

export default function FormTextInput(props: TextInputProps) {
  const { formKey, label, charLimit, jsonFriendly, password } = props;
  const { watch, register } = useFormContext();
  const value = watch(formKey);

  function _onInput(value: string) {
    if (charLimit !== undefined) {
      if (value.length > charLimit) {
        return value.substring(0, charLimit);
      }
    }
    if (jsonFriendly) {
      return value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, '').replace(' ', '_');
    }
    return value;
  }
  return (
    <label htmlFor={`text-${formKey}`}>
      {label}
      <input
        id={`text-${formKey}`}
        className='text-input'
        type={password ? 'password' : 'text'}
        value={value}
        {...register(formKey, { setValueAs: _onInput })}
      />
    </label>
  );
}