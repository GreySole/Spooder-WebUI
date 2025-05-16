import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import { CircleLoader, Box, Stack, Expandable } from '@greysole/spooder-component-library';
import BackupRestore from './configTab/backupRestoreInput/BackupRestore';
import ConfigForm from './configTab/configInput/ConfigForm';
import ConfigTabFormContextProvider from './configTab/context/ConfigTabFormContext';
import PageCircleLoader from '../common/input/general/PageCircleLoader';

export default function ConfigTab() {
  const { getConfig, getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const { data, isLoading, error } = getConfig();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <Stack width='100%' spacing='none'>
        <ConfigTabFormContextProvider defaultConfig={data}>
          <ConfigForm />
        </ConfigTabFormContextProvider>
        <Stack spacing='none' paddingLeft='medium' paddingRight='medium'>
          <Expandable label='Backup/Restore'>
            <BackupRestore />
          </Expandable>
        </Stack>
      </Stack>
    </Box>
  );
}
