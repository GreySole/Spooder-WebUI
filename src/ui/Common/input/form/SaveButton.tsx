import React from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { HotkeysProvider } from '../../../../app/hooks/useHotkeys';
import Button from '../controlled/Button';

interface SaveButtonProps {
  saveFunction: (form: FieldValues) => void;
}

export default function SaveButton(props: SaveButtonProps) {
  const { getValues } = useFormContext();
  const { saveFunction } = props;

  return (
    <HotkeysProvider save={() => saveFunction(getValues())}>
      <Button label='Save' onClick={() => saveFunction(getValues())} />
    </HotkeysProvider>
  );
}
