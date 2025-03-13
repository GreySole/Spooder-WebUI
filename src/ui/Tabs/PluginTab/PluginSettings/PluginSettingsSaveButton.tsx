import { SaveButton } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { usePluginContext } from '../context/PluginTabFormContext';
import usePlugins from '../../../../app/hooks/usePlugins';

export default function PluginSettingsSaveButton() {
  const { getValues } = useFormContext();
  const { getSavePluginSettings } = usePlugins();
  const { savePluginSettings } = getSavePluginSettings();
  const { pluginSettingsOpen, setPluginSettingsOpen } = usePluginContext();

  function saveSettings() {
    savePluginSettings(pluginSettingsOpen, getValues()).then(() => {
      setPluginSettingsOpen('');
    });
  }

  return <SaveButton saveFunction={saveSettings} />;
}
