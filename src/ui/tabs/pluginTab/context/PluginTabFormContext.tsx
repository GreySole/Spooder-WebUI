import React from 'react';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import usePlugins from '../../../../app/hooks/usePlugins';
import { PluginsObject } from '../../../Types';
import { ToastType, useOSC, useToast } from '@greysole/spooder-component-library';
import { preProcessFile } from 'typescript';

export const PluginContext = createContext({
  plugins: {} as PluginsObject,
  isReady: false,
  reloadPlugins: () => {
    return new Promise<any>(() => {});
  },
  pluginInfoOpen: '',
  pluginSettingsOpen: '',
  pluginAssetsOpen: '',
  pluginInstalled: '',
  setPluginInfoOpen: (info: string) => {},
  setPluginSettingsOpen: (settings: string) => {},
  setPluginAssetsOpen: (assets: string) => {},
  setPluginInstalled: (installedPlugin: string) => {},
  newPlugins: {} as PluginsObject,
  setNewPlugins: (newPlugins: PluginsObject) => {},
});

export function usePluginContext() {
  return useContext(PluginContext);
}

interface PluginProviderProps {
  children: ReactNode;
}

export const PluginProvider = (props: PluginProviderProps) => {
  const { children } = props;
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading, error, refetch } = getPlugins();
  const [pluginInfoOpen, setPluginInfoOpen] = useState('');
  const [pluginSettingsOpen, setPluginSettingsOpen] = useState('');
  const [pluginAssetsOpen, setPluginAssetsOpen] = useState('');
  const [pluginInstalled, setPluginInstalled] = useState('');
  const [newPlugins, setNewPlugins] = useState({} as PluginsObject);
  const { showToast } = useToast();

  const { addListener, removeListener } = useOSC();

  useEffect(() => {
    addListener('/spooder/plugin/install/progress', (message: any) => {
      let progressObj = JSON.parse(message.args[0]);

      let newNewPlugins = Object.assign({});
      console.log('PROGRESS', progressObj);
      newNewPlugins[progressObj.pluginName] = Object.assign(newNewPlugins[progressObj.pluginName], {
        status: progressObj.status,
        message: progressObj.message,
      });
      setNewPlugins((prevNewPlugins) => {
        return { ...prevNewPlugins, [progressObj.pluginName]: progressObj };
      });
    });

    addListener('/spooder/plugin/install/complete', (message: any) => {
      let progressObj = JSON.parse(message.args[0]);
      console.log('COMPLETE', progressObj);
      let newNewPlugins = Object.assign({}, newPlugins);
      delete newNewPlugins[progressObj.pluginName];
      setNewPlugins(newNewPlugins);
      reloadPlugins();
    });

    return () => {
      removeListener('/spooder/plugin/install/progress');
      removeListener('/spooder/plugin/install/complete');
    };
  }, []);

  const isReady = !isLoading && !error && plugins !== undefined;

  function reloadPlugins() {
    return refetch();
  }

  const value = {
    plugins: isReady ? plugins : ({} as PluginsObject),
    isReady,
    reloadPlugins,
    pluginInfoOpen,
    pluginSettingsOpen,
    pluginAssetsOpen,
    pluginInstalled,
    setPluginInfoOpen,
    setPluginSettingsOpen,
    setPluginAssetsOpen,
    setPluginInstalled,
    newPlugins,
    setNewPlugins,
  };

  if (error) {
    showToast('Failed to fetch plugins', ToastType.ERROR);
  }

  return <PluginContext.Provider value={value}>{children}</PluginContext.Provider>;
};
