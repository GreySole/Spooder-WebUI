import React from 'react';

interface TextInputProps {
  key?: string;
  value: string;
  label?: string;
  placeholder?: string;
  charLimit?: number;
  jsonFriendly?: boolean;
  password?: boolean;
  onInput: (value: string) => void;
}

export default function TextInput(props: TextInputProps) {
  const { key, value, label, placeholder, charLimit, jsonFriendly, password, onInput } = props;
  function _onInput(value: string) {
    if (charLimit !== undefined) {
      if (value.length > charLimit) {
        onInput(value.substring(0, charLimit));
        return;
      }
    }
    if (jsonFriendly) {
      console.log('JSON FRIENDLY');
      onInput(value.replaceAll(/[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/g, '').replaceAll(' ', '_'));
      return;
    }
    onInput(value);
    return;
  }
  return (
    <label htmlFor={`text-${key}`}>
      {label}
      <input
        id={`text-${key}`}
        className='text-input'
        placeholder={placeholder}
        type={password ? 'password' : 'text'}
        value={value}
        onInput={(e) => _onInput(e.currentTarget.value)}
      />
    </label>
  );
}
