import React, { useState } from 'react';
import { PluginProvider } from './pluginTab/context/PluginTabFormContext';
import CreatePluginButton from './pluginTab/input/CreatePluginButton';
import InstallPluginButton from './pluginTab/input/InstallPluginButton';
import PluginList from './pluginTab/PluginList';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/input/controlled/Button';
import RefreshAllPluginsButton from './pluginTab/input/RefreshAllPluginsButton';

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
