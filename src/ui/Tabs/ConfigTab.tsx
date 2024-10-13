import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import Expandable from '../common/Expandable';
import SaveButton from '../common/input/form/SaveButton';
import BackupRestore from './configTab/backupRestoreInput/BackupRestore';
import ConfigBotSection from './configTab/configInput/ConfigBotSection';
import ConfigNetworkSection from './configTab/configInput/ConfigNetworkSection';
import ConfigTabFormContextProvider from './configTab/context/ConfigTabFormContext';
import EditCustomSpooder from './configTab/customSpooderInput/EditCustomSpooder';
import LoadingCircle from '../common/LoadingCircle';
import ThemeColor from './configTab/themeColor/ThemeColor';

export default function ConfigTab() {
  const { getConfig, getSaveConfig } = useConfig();
  const { data, isLoading, error } = getConfig();
  const { saveConfig } = getSaveConfig();

  if (isLoading) {
    return <LoadingCircle />;
  }

  return (
    <div className='config-tab'>
      <div className='non-config-element'>
        <ThemeColor />
      </div>
      <div className='non-config-element'>
        <Expandable label='Customize Spooder'>
          <EditCustomSpooder />
        </Expandable>
      </div>
      <div className='non-config-element'>
        <Expandable label='Backup/Restore'>
          <BackupRestore />
        </Expandable>
      </div>
      <ConfigTabFormContextProvider defaultConfig={data}>
        <ConfigBotSection />
        <ConfigNetworkSection />
        <SaveButton saveFunction={saveConfig} />
      </ConfigTabFormContextProvider>
    </div>
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
