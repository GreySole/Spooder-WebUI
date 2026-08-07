import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import {
  CircleLoader,
  Box,
  Stack,
  Expandable,
  BoolSwitch,
} from '@spooder/webui-component-library';
import BackupRestore from './configTab/backupRestoreInput/BackupRestore';
import ConfigForm from './configTab/configInput/ConfigForm';
import ConfigTabFormContextProvider from './configTab/context/ConfigTabFormContext';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import useNavigation from '../../app/hooks/useNavigation';

export default function ConfigTab() {
  const { getConfig, getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const { data, isLoading, error } = getConfig();
  const { urlParams, tabOptions, deckTabOptions, navigationOpen, setRememberLastTab } =
    useNavigation();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  const isRemembering = localStorage.getItem('lastTab') != null;

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)' spacing='medium'>
      <ConfigTabFormContextProvider defaultConfig={data}>
        <ConfigForm />
      </ConfigTabFormContextProvider>
      <Expandable label='Backup/Restore'>
        <BackupRestore />
      </Expandable>
      <BoolSwitch
        onChange={() => setRememberLastTab(localStorage.getItem('lastTab') == null)}
        value={isRemembering}
        label='Remember Where I Was'
        tooltipText='If enabled, the app will remember the last tab you were on and return to it when you reload the page.'
      />
    </Box>
  );
}
