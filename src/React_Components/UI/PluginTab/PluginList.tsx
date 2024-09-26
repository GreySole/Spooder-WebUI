import { faPlusCircle, faFileImport, faSync } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/input/controlled/Button';
import { PluginProvider, usePluginContext } from './context/PluginTabFormContext';
import AlertToasterLink from './AlertToasterLink';
import PluginEntry from './PluginEntry';
import { useRef, useState } from 'react';
import usePlugins from '../../../app/hooks/usePlugins';
import useToast from '../../../app/hooks/useToast';
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
