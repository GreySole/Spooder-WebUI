import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Box, TypeFace } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface PluginMultiInputValueArrayProps {
  formKey: string;
  removeMultiInput: (index: number) => void;
}

export default function PluginMultiInputValueArray({
  formKey,
  removeMultiInput,
}: PluginMultiInputValueArrayProps) {
  const { watch } = useFormContext();
  const valueArray = watch(formKey, []);

  const varContainer = [] as any[];
  for (let v in valueArray) {
    varContainer.push(
      <Button key={v} label={valueArray[v]} onClick={() => removeMultiInput(parseInt(v))} />,
    );
  }

  return (
    <Box>{varContainer.length > 0 ? varContainer : 'Select an item and add to the array'}</Box>
  );
}
