import { Box, Columns } from '@greysole/spooder-component-library';
import React from 'react';
import { PluginProvider } from './pluginTab/context/PluginTabFormContext';
import CreatePluginButton from './pluginTab/input/CreatePluginButton';
import InstallPluginButton from './pluginTab/input/InstallPluginButton';
import RefreshAllPluginsButton from './pluginTab/input/RefreshAllPluginsButton';
import PluginList from './pluginTab/PluginList';

export default function PluginTab() {
  return (
    <PluginProvider>
      <Box flexFlow='column' width='100%'>
        <Columns spacing='medium' padding='small'>
          <CreatePluginButton />
          <InstallPluginButton />
          <RefreshAllPluginsButton />
        </Columns>
        <PluginList />
      </Box>
    </PluginProvider>
  );
}
