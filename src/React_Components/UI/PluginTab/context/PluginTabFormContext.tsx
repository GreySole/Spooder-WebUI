import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import usePlugins from '../../../../app/hooks/usePlugins';
import { PluginsObject, ToastType } from '../../../Types';
import useToast from '../../../../app/hooks/useToast';
import { useOSC } from '../../../../app/context/OscContext';

export const PluginContext = createContext({
  plugins: {} as PluginsObject,
  isReady: false,
  reloadPlugins: () => {},
  pluginInfoOpen: '',
  pluginSettingsOpen: '',
  pluginAssetsOpen: '',
  setPluginInfoOpen: (info: string) => {},
  setPluginSettingsOpen: (settings: string) => {},
  setPluginAssetsOpen: (assets: string) => {},
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
  const [newPlugins, setNewPlugins] = useState({} as PluginsObject);
  const { showToast } = useToast();

  const { addListener, removeListener } = useOSC();

  useEffect(() => {
    addListener('/frontend/plugin/install/progress', (message:any) => {
      let progressObj = JSON.parse(message.args[0]);

      let newNewPlugins = Object.assign({}, newPlugins);
      console.log('PROGRESS', newNewPlugins);
      newNewPlugins[progressObj.pluginName] = Object.assign(newNewPlugins[progressObj.pluginName], {
        status: progressObj.status,
        message: progressObj.message,
      });
      setNewPlugins(newNewPlugins);
    });

    addListener('/frontend/plugin/install/complete', (message:any) => {
      let progressObj = JSON.parse(message.args[0]);
      console.log('COMPLETE', progressObj);
      let newNewPlugins = Object.assign({}, newPlugins);
      delete newNewPlugins[progressObj.pluginName];
      setNewPlugins(newNewPlugins);
      reloadPlugins();
    });

    return () => {
      removeListener('/frontend/plugin/install/progress');
      removeListener('/frontend/plugin/install/complete');
    };
  });

  const isReady = !isLoading && !error && plugins !== undefined;

  function reloadPlugins() {
    refetch();
  }

  const value = {
    plugins: isReady ? plugins : ({} as PluginsObject),
    isReady,
    reloadPlugins,
    pluginInfoOpen,
    pluginSettingsOpen,
    pluginAssetsOpen,
    setPluginInfoOpen,
    setPluginSettingsOpen,
    setPluginAssetsOpen,
    newPlugins,
    setNewPlugins,
  };

  if (error) {
    showToast('Failed to fetch plugins', ToastType.ERROR);
  }

  return <PluginContext.Provider value={value}>{children}</PluginContext.Provider>;
};

