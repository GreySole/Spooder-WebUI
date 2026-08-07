import {
  Box,
  KeyedObject,
  Modal,
  Stack,
  translateCondition,
} from '@spooder/webui-component-library';
import React from 'react';
import PluginInput from './pluginInput/PluginInput';
import PluginSubform from './PluginSubform';
import PluginSettingsSaveButton from './PluginSettingsSaveButton';
import { usePluginContext } from '../context/PluginTabFormContext';
import PluginMultiInput from './pluginInput/PluginMultiInput';
import { usePluginSettingsContext } from './context/PluginSettingsContext';
import PluginInputsList from './pluginInput/PluginInputsList';

export default function SettingsFormModal() {
  const { setPluginSettingsOpen } = usePluginContext();
  const { pluginName } = usePluginSettingsContext();

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        setPluginSettingsOpen('');
      }}
      title={pluginName}
      content={
        <Box flexFlow='column' padding='medium'>
          <Stack spacing='medium'>
            <PluginInputsList />
          </Stack>
        </Box>
      }
      footerContent={
        <Box width='100%' justifyContent='flex-end'>
          <PluginSettingsSaveButton />
        </Box>
      }
    />
  );
}
