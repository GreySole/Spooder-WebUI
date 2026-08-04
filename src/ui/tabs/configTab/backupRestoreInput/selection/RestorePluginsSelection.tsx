import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  BoolSwitch,
  Border,
  Box,
  Button,
  FormLoader,
  MouseArea,
  Stack,
  TypeFace,
} from '@spooder/webui-component-library';
import useRecovery from '../../../../../app/hooks/useRecovery';
import { faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { KeyedObject } from '../../../../Types';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RestorePluginsSelectionProps {
  backupName: string;
  pluginList: KeyedObject[];
  goBack: () => void;
  startRestoring: (backupName: string, data: any) => void;
}

export default function RestorePluginSelection({
  backupName,
  pluginList,
  goBack,
  startRestoring,
}: RestorePluginsSelectionProps) {
  const { control, handleSubmit, setValue } = useForm();
  const { getPlugins } = usePlugins();
  const { data, isLoading, error } = getPlugins();
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const onSubmit = (data: any) => {
    startRestoring(backupName, data);
  };

  const handleSelectAll = (value: boolean) => {
    pluginList.forEach((plugin) => {
      setValue(plugin.dirName, value);
    });
  };

  if (isLoading || !data) {
    return <FormLoader numRows={4} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing='medium'>
        <Box flexFlow='row wrap' justifyContent='space-between' alignItems='center'>
          <Button label='Go Back' icon={faArrowLeft} iconPosition='left' onClick={() => goBack()} />
          <TypeFace fontSize='large'>Plugin List</TypeFace>
        </Box>
        <TypeFace fontSize='large'>Select which files to restore from the backup file.</TypeFace>
        <TypeFace fontSize='large'>
          <FontAwesomeIcon icon={faExclamationTriangle} /> This will also replace settings files!
        </TypeFace>
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
          {pluginList.map((selection) => (
            <Controller
              key={selection.dirName}
              name={selection.dirName}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Border borderBottom>
                  <MouseArea
                    onClick={() => {
                      field.onChange(!field.value); // Toggle the value on click
                    }}
                  >
                    <Box>
                      <BoolSwitch
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      <Stack spacing='small' marginLeft='medium'>
                        <TypeFace fontSize='medium' userSelect='none'>
                          {selection.name} v{selection.version}
                        </TypeFace>
                        <TypeFace fontSize='medium' userSelect='none'>
                          Installed:{' '}
                          {data[selection.dirName] ? `v${data[selection.dirName].version}` : 'None'}
                        </TypeFace>
                      </Stack>
                    </Box>
                  </MouseArea>
                </Border>
              )}
            />
          ))}
        </Stack>
        <Button
          label='Restore Files'
          onClick={() => {
            handleSubmit(onSubmit);
          }}
        />
      </Stack>
    </form>
  );
}
