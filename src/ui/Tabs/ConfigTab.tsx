import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import { CircleLoader, Box, Stack, Expandable } from '@greysole/spooder-component-library';
import BackupRestore from './ConfigTab/backupRestoreInput/BackupRestore';
import ConfigForm from './ConfigTab/configInput/ConfigForm';
import ConfigTabFormContextProvider from './ConfigTab/context/ConfigTabFormContext';

export default function ConfigTab() {
  const { getConfig, getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const { data, isLoading, error } = getConfig();

  if (isLoading) {
    return <CircleLoader />;
  }

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <Stack width='inherit' spacing='medium'>
        <ConfigTabFormContextProvider defaultConfig={data}>
          <ConfigForm />
        </ConfigTabFormContextProvider>
        <Expandable label='Backup/Restore'>
          <BackupRestore />
        </Expandable>
      </Stack>
    </Box>
  );
}

/**
 * configStructure = {
		"bot":{
			"owner_name":"",
			"bot_name":"",
			"help_command":"",
			"introduction":"I'm a Spooder connected to the stream ^_^"
		},
		"network":{
			"host":"",
			"host_port":3000,
			"externalhandle":"ngrok",
			"ngrokauthtoken":"",
			"external_http_url":"",
			"external_tcp_url":"",
			"udp_clients":{},
			"osc_udp_port":9000,
			"osc_tcp_port":3333
		}
	}
 */
