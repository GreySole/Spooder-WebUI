import React, { useState } from 'react';
import { PluginProvider } from './PluginTab/context/PluginTabFormContext';
import CreatePluginButton from './PluginTab/input/CreatePluginButton';
import InstallPluginButton from './PluginTab/input/InstallPluginButton';
import PluginList from './PluginTab/PluginList';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Button from '../Common/input/controlled/Button';
import RefreshAllPluginsButton from './PluginTab/input/RefreshAllPluginsButton';

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
