import React from 'react';
import { KeyedObject } from '@greysole/spooder-component-library';
import { createContext, ReactNode, useContext } from 'react';

interface SettingsFormContextProps {
  pluginName: string;
  form: KeyedObject;
  defaults: KeyedObject;
  children: ReactNode;
}

const PluginSettingsContext = createContext<{
  pluginName: string;
  form: KeyedObject;
  defaults: KeyedObject;
} | null>(null);

export const usePluginSettingsContext = () => {
  const context = useContext(PluginSettingsContext);
  if (!context) {
    throw new Error(
      'usePluginSettingsContext must be used within a PluginSettingsContext.Provider',
    );
  }
  return context;
};

export default function PluginSettingsContextProvider(props: SettingsFormContextProps) {
  const { pluginName, form, defaults, children } = props;
  console.log('PLUGIN SETTINGS CONTEXT RENDER');
  return (
    <PluginSettingsContext.Provider value={{ pluginName, form, defaults }}>
      {children}
    </PluginSettingsContext.Provider>
  );
}
