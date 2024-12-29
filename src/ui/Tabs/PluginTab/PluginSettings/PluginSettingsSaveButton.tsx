import React from 'react';
import { useFormContext } from 'react-hook-form';
import SaveButton from '../../../common/input/form/SaveButton';

export default function PluginSettingsSaveButton() {
  const { getValues } = useFormContext();

  function saveSettings() {}

  return <SaveButton saveFunction={saveSettings} />;
}
