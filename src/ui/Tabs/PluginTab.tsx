import React, { useState } from 'react';
import { PluginProvider } from './pluginTab/context/PluginTabFormContext';
import CreatePluginButton from './pluginTab/input/CreatePluginButton';
import InstallPluginButton from './pluginTab/input/InstallPluginButton';
import PluginList from './pluginTab/PluginList';
import RefreshAllPluginsButton from './pluginTab/input/RefreshAllPluginsButton';
import Columns from '../common/layout/Columns';
import Box from '../common/layout/Box';

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
