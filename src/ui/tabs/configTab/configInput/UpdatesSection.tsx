import { Button, Expandable, FormBoolSwitch, Stack, TypeFace } from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCheckForUpdatesMutation } from '../../../../app/api/registrySlice';
import UpdateScheduleSet from './autoUpdate/UpdateScheduleSet';

export default function UpdatesSection() {
  const { watch } = useFormContext();
  const webuiUpdateEnabled = watch('webui_update.enabled');
  const pluginUpdateEnabled = watch('plugin_update.enabled');
  const [checkForUpdates, { data, error, isLoading }] = useCheckForUpdatesMutation();

  const summary = () => {
    if (error) {
      return 'Could not check for updates.';
    }
    if (!data) {
      return null;
    }
    const parts: string[] = [];
    if (data.webuiUpdated.length > 0) {
      parts.push(`Updated: ${data.webuiUpdated.join(', ')}. Reload the page to use the new UI.`);
    }
    if (data.pluginsOutdated.length > 0) {
      parts.push(`Plugin updates available: ${data.pluginsOutdated.join(', ')}.`);
    }
    return parts.length > 0 ? parts.join(' ') : 'Everything is up to date.';
  };

  return (
    <Expandable label='Updates'>
      <Stack spacing='medium' padding='medium'>
        <Button
          label={isLoading ? 'Checking…' : 'Check for Updates'}
          onClick={() => checkForUpdates()}
        />
        {summary() && <TypeFace fontSize='medium'>{summary()}</TypeFace>}
        <FormBoolSwitch formKey='webui_update.enabled' label='Enable Web UI Auto Update' />
        {webuiUpdateEnabled && <UpdateScheduleSet formKey='webui_update' />}
        <FormBoolSwitch formKey='plugin_update.enabled' label='Enable Plugin Update Checks' />
        {pluginUpdateEnabled && <UpdateScheduleSet formKey='plugin_update' />}
      </Stack>
    </Expandable>
  );
}
