import { Box, Button, Columns } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { PluginProvider } from './pluginTab/context/PluginTabFormContext';
import RefreshAllPluginsButton from './pluginTab/input/RefreshAllPluginsButton';
import PluginList from './pluginTab/PluginList';
import { Footer } from '../app/Footer';
import { faPlusCircle, faFileImport } from '@fortawesome/free-solid-svg-icons';
import CreatePluginModal from './pluginTab/input/CreatePluginModal';
import InstallPluginModal from './pluginTab/input/InstallPluginModal';
import CreatePluginFormContextProvider from './pluginTab/context/CreatePluginFormContext';

export default function PluginTab() {
  const [createPluginOpen, setCreatePluginOpen] = useState(false);
  const [installPluginOpen, setInstallPluginOpen] = useState(false);
  return (
    <PluginProvider>
      <CreatePluginFormContextProvider>
        <CreatePluginModal isOpen={createPluginOpen} setIsOpen={setCreatePluginOpen} />
      </CreatePluginFormContextProvider>
      <InstallPluginModal isOpen={installPluginOpen} setIsOpen={setInstallPluginOpen} />
      <Box flexFlow='column' width='100%' marginBottom='var(--footer-height)'>
        <PluginList />
      </Box>
      <Footer showFooter>
        <Columns spacing='medium' padding='small'>
          <Button
            label='Create'
            onClick={() => setCreatePluginOpen(!createPluginOpen)}
            icon={faPlusCircle}
          />
          <Button
            label='Install'
            icon={faFileImport}
            onClick={() => {
              setInstallPluginOpen(!installPluginOpen);
            }}
          />
          <RefreshAllPluginsButton />
        </Columns>
      </Footer>
    </PluginProvider>
  );
}
