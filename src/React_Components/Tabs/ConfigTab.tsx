import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import Expandable from '../UI/common/Expandable';
import SaveButton from '../UI/common/input/form/SaveButton';
import BackupRestore from '../UI/ConfigTab/backupRestoreInput/BackupRestore';
import ConfigBotSection from '../UI/ConfigTab/configInput/ConfigBotSection';
import ConfigNetworkSection from '../UI/ConfigTab/configInput/ConfigNetworkSection';
import ConfigTabFormContextProvider from '../UI/ConfigTab/context/ConfigTabFormContext';
import EditCustomSpooder from '../UI/ConfigTab/customSpooderInput/EditCustomSpooder';
import LoadingCircle from '../UI/LoadingCircle';

export default function ConfigTab() {
  const { getConfig, getSaveConfig } = useConfig();
  const { data, isLoading, error } = getConfig();
  const { saveConfig } = getSaveConfig();

  if (isLoading) {
    return <LoadingCircle />;
  }

  return (
    <form className='config-tab'>
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
    </form>
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
