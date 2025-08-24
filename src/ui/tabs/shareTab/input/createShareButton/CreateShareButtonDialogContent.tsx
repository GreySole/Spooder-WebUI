import { Stack, TypeFace, TextInput } from '@greysole/spooder-component-library';
import React, { useState, useEffect } from 'react';

export default function CreateShareButtonDialogContent({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    onValueChange(inputValue);
  }, [inputValue, onValueChange]);
  return (
    <Stack spacing='medium'>
      <TypeFace>Enter the user's Twitch username to create a share</TypeFace>
      <TextInput
        value={inputValue}
        placeholder='Twitch Username'
        onInput={(value: string) => setInputValue(value)}
        autoFocus
      />
    </Stack>
  );
}
