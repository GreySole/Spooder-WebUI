import { SaveButton } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function PluginSettingsSaveButton() {
  const { getValues } = useFormContext();

  function saveSettings() {}

  return <SaveButton saveFunction={saveSettings} />;
}
