import { Box, Button, Columns } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { PluginProvider } from './pluginTab/context/PluginTabFormContext';
import RefreshAllPluginsButton from './pluginTab/input/RefreshAllPluginsButton';
import PluginList from './pluginTab/PluginList';
import { Footer } from '../app/Footer';
import { faPlusCircle, faFileImport, faDownload } from '@fortawesome/free-solid-svg-icons';
import CreatePluginModal from './pluginTab/input/CreatePluginModal';
import InstallPluginModal from './pluginTab/input/InstallPluginModal';
import CreatePluginFormContextProvider from './pluginTab/context/CreatePluginFormContext';
import ExportPluginModal from './pluginTab/input/ExportPluginModal';

export default function PluginTab() {
  const [createPluginOpen, setCreatePluginOpen] = useState(false);
  const [installPluginOpen, setInstallPluginOpen] = useState(false);
  return (
    <PluginProvider>
      <CreatePluginFormContextProvider>
        <CreatePluginModal isOpen={createPluginOpen} setIsOpen={setCreatePluginOpen} />
      </CreatePluginFormContextProvider>
      <InstallPluginModal isOpen={installPluginOpen} setIsOpen={setInstallPluginOpen} />
      <ExportPluginModal />
      <Box flexFlow='column' width='100%' marginBottom='var(--footer-height)'>
        <PluginList />
      </Box>
      <Footer showFooter>
        <Button
          label='Create'
          onClick={() => setCreatePluginOpen(!createPluginOpen)}
          icon={faPlusCircle}
        />
        <Button
          label='Install'
          icon={faDownload}
          onClick={() => {
            setInstallPluginOpen(!installPluginOpen);
          }}
        />
        <RefreshAllPluginsButton />
      </Footer>
    </PluginProvider>
  );
}
