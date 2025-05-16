import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  BoolSwitch,
  Border,
  Box,
  Button,
  MouseArea,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import useRecovery from '../../../../../app/hooks/useRecovery';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface RestoreSettingsSelectionProps {
  backupName: string;
  selections: string[];
  setSettingsFileSelection: (value: boolean) => void;
}

export default function RestoreSettingsSelection({
  backupName,
  selections,
  setSettingsFileSelection,
}: RestoreSettingsSelectionProps) {
  const { control, handleSubmit, setValue } = useForm();
  const { getRestoreSettings } = useRecovery();
  const { restoreSettings } = getRestoreSettings();
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const onSubmit = (data: any) => {
    restoreSettings(backupName, data);
  };

  const handleSelectAll = (value: boolean) => {
    selections.forEach((selection) => {
      setValue(selection, value);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing='medium'>
        <Box flexFlow='row wrap' justifyContent='space-between' alignItems='center'>
          <Button
            label='Go Back'
            icon={faArrowLeft}
            iconPosition='left'
            onClick={() => setSettingsFileSelection(false)}
          />
          <TypeFace fontSize='large'>Settings List</TypeFace>
        </Box>
        <TypeFace fontSize='large'>Select which files to restore from the backup file.</TypeFace>

        <Stack spacing='small'>
          <Box width='100%' marginBottom='small'>
            <Box padding='small'>
              <BoolSwitch
                label='Select All'
                value={selectAll}
                onChange={(value) => {
                  setSelectAll(value);
                  handleSelectAll(value);
                }}
              />
            </Box>
          </Box>
          {selections.map((selection) => (
            <Controller
              key={selection}
              name={selection}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Border borderBottom>
                  <MouseArea
                    onClick={() => {
                      field.onChange(!field.value); // Toggle the value on click
                    }}
                  >
                    <Box padding='small'>
                      <BoolSwitch
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      <Stack spacing='small' marginLeft='medium'>
                        <TypeFace fontSize='medium' userSelect='none'>
                          {selection}
                        </TypeFace>
                      </Stack>
                    </Box>
                  </MouseArea>
                </Border>
              )}
            />
          ))}
        </Stack>
        <Button label='Restore Files' onClick={() => handleSubmit(onSubmit)} />
      </Stack>
    </form>
  );
}
