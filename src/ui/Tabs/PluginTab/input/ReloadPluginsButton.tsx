import React from 'react';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { usePluginContext } from '../context/PluginTabFormContext';
import { Button } from '@greysole/spooder-component-library';

export default function ReloadPluginsButton() {
  const { reloadPlugins } = usePluginContext();
  return (
    <div className='save-div'>
      <Button label='Refresh All Plugins' onClick={reloadPlugins} icon={faSync} iconSize='lg' />
      <div className='save-status'></div>
    </div>
  );
}
