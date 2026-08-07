import React from 'react';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { usePluginContext } from '../context/PluginTabFormContext';
import { Button } from '@spooder/webui-component-library';

export default function RefreshAllPluginsButton() {
  const { reloadPlugins } = usePluginContext();
  return <Button label='Refresh All' onClick={reloadPlugins} icon={faSync} />;
}
