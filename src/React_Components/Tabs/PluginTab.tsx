import React, { useState } from 'react';
import { PluginProvider } from '../UI/PluginTab/context/PluginTabFormContext';
import CreatePluginButton from '../UI/PluginTab/input/CreatePluginButton';
import InstallPluginButton from '../UI/PluginTab/input/InstallPluginButton';
import PluginList from '../UI/PluginTab/PluginList';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Button from '../UI/common/input/controlled/Button';
import RefreshAllPluginsButton from '../UI/PluginTab/input/RefreshAllPluginsButton';

interface NewPlugin {
  [key: string]: {
    name: string;
    author: string;
    description: string;
    status: string;
    message: string;
  };
}

export default function PluginTab() {
  const [newPlugins, setNewPlugins] = useState<NewPlugin>({});

  return (
    <PluginProvider>
      <div className='plugin-element'>
        <div className='plugin-install-button'>
          <CreatePluginButton />
          <InstallPluginButton />
          <RefreshAllPluginsButton />
        </div>
        <PluginList />
      </div>
    </PluginProvider>
  );
}
