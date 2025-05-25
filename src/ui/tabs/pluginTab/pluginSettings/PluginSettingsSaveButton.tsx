import { SaveButton } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { usePluginContext } from '../context/PluginTabFormContext';
import usePlugins from '../../../../app/hooks/usePlugins';

export default function PluginSettingsSaveButton() {
  const { getValues } = useFormContext();
  const { getSavePluginSettings, getPluginSettings } = usePlugins();
  const { savePluginSettings } = getSavePluginSettings();

  const { pluginSettingsOpen, setPluginSettingsOpen } = usePluginContext();
  const { refetch } = getPluginSettings(pluginSettingsOpen);

  function saveSettings() {
    const newSettings = structuredClone(getValues());
    for (let key in newSettings) {
      if (newSettings[key]._name_changes) {
        for (let name in newSettings[key]._name_changes) {
          const newName = newSettings[key]._name_changes[name];
          newSettings[key][newName] = structuredClone(newSettings[key][name]);
          delete newSettings[key][name];
        }
        delete newSettings[key]._name_changes;
      }
    }
    savePluginSettings(pluginSettingsOpen, newSettings).then(() => {
      refetch();
      setPluginSettingsOpen('');
    });
  }

  return <SaveButton saveFunction={saveSettings} />;
}
