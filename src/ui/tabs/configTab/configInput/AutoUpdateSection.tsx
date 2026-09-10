import { Expandable, FormBoolSwitch, Stack } from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import UpdateScheduleSet from './autoUpdate/UpdateScheduleSet';

export default function AutoUpdateSection() {
  const { watch } = useFormContext();
  const webuiUpdateEnabled = watch('webui_update.enabled');
  const pluginUpdateEnabled = watch('plugin_update.enabled');

  return (
    <Expandable label='Auto Update'>
      <Stack spacing='medium' padding='medium'>
        <FormBoolSwitch formKey='webui_update.enabled' label='Enable Web UI Auto Update' />
        {webuiUpdateEnabled && <UpdateScheduleSet formKey='webui_update' />}
        <FormBoolSwitch formKey='plugin_update.enabled' label='Enable Plugin Update Checks' />
        {pluginUpdateEnabled && <UpdateScheduleSet formKey='plugin_update' />}
      </Stack>
    </Expandable>
  );
}
