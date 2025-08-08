import React from 'react';
import { PluginComponentProps } from '../../../Types';
import usePlugins from '../../../../app/hooks/usePlugins';
import { FormLoader } from '@greysole/spooder-component-library';
import PluginSettingsContextProvider from './context/PluginSettingsContext';
import SettingsFormContextProvider from './context/SettingsFormContext';
import SettingsFormModal from './SettingsFormModal';

export default function SettingsForm(props: PluginComponentProps) {
  const { pluginName } = props;
  const { getPluginSettings, getPluginSettingsForm } = usePlugins();
  const { data: pluginSettings, isLoading: valuesLoading } = getPluginSettings(pluginName);
  const { data: pluginSettingsForm, isLoading: settingsFormLoading } =
    getPluginSettingsForm(pluginName);

  if (valuesLoading || settingsFormLoading) {
    return <FormLoader numRows={4} />;
  }

  if (!pluginSettings || !pluginSettingsForm) {
    return null;
  }

  const values = JSON.parse(JSON.stringify(pluginSettings || {}));

  const form = pluginSettingsForm.form;
  const defaults = pluginSettingsForm.defaults;

  // Helper function to process defaults recursively
  function processDefaults(defaults: any, values: any, form: any) {
    for (let d in defaults) {
      const formEntry = form[d];

      // Handle sections - process their fields
      if (formEntry && formEntry.type === 'section' && formEntry.fields) {
        if (values[d] == null) {
          values[d] = {};
        }
        // Ensure the section object is extensible
        if (typeof values[d] !== 'object' || values[d] === null) {
          values[d] = {};
        }
        // Process section fields
        if (defaults[d] && typeof defaults[d] === 'object') {
          for (let fieldKey in defaults[d]) {
            if (values[d][fieldKey] == null) {
              values[d][fieldKey] = JSON.parse(JSON.stringify(defaults[d][fieldKey]));
            }
          }
        }
      } else {
        // Handle regular form fields
        if (values[d] == null) {
          values[d] = JSON.parse(JSON.stringify(defaults[d]));
        }
      }
    }
  }

  processDefaults(defaults, values, form);

  return (
    <PluginSettingsContextProvider pluginName={pluginName} form={form} defaults={defaults}>
      <SettingsFormContextProvider values={values}>
        <SettingsFormModal />
      </SettingsFormContextProvider>
    </PluginSettingsContextProvider>
  );
}
