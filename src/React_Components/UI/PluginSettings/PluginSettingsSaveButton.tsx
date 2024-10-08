import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function PluginSettingsSaveButton() {
  const { getValues } = useFormContext();

  function saveSettings() {}

  return (
    <div className='save-div'>
      <button className='save-button' onClick={saveSettings}>
        Save
      </button>
      <div className='save-status'></div>
    </div>
  );
}
