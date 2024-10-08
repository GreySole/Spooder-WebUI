import React from 'react';
import { usePluginContext } from './context/PluginTabFormContext';
import AlertToasterLink from './AlertToasterLink';
import PluginEntry from './PluginEntry';
import LoadingCircle from '../LoadingCircle';

export default function PluginList() {
  const { plugins, isReady, reloadPlugins } = usePluginContext();

  console.log(plugins);

  if (!isReady) {
    return <LoadingCircle />;
  }

  let pluginList = [];
  let sortedPluginKeys = Object.keys(plugins).sort();
  if (sortedPluginKeys.length == 0) {
    pluginList.push(<AlertToasterLink />);
  } else {
    for (let sp in sortedPluginKeys) {
      let p = sortedPluginKeys[sp];
      if (plugins[p] == null) {
        continue;
      }

      pluginList.push(<PluginEntry pluginName={p} />);
    }
  }

  return <div className='plugin-list'>{pluginList}</div>;
}
